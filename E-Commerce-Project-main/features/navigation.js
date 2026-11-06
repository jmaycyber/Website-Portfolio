(function(){
  const viewIds = ['storeView', 'checkoutView', 'settingsView', 'myOrdersView'];

  function showView(viewId) {
    appState.activeView = viewId;
    viewIds.forEach((id) => {
      const element = getElement(id);
      if (element) element.classList.add('hidden');
    });

    const target = getElement(viewId);
    if (target) target.classList.remove('hidden');

    if (viewId === 'myOrdersView' && window.renderOrders) window.renderOrders();
    if (viewId === 'checkoutView') {
      if (window.renderPaymentMethods) window.renderPaymentMethods();
      if (window.renderSavedAddresses) window.renderSavedAddresses();
      if (window.renderCheckoutSummary) window.renderCheckoutSummary();
    }
    if (viewId === 'settingsView') {
      if (window.renderSavedAddresses) window.renderSavedAddresses();
      if (window.renderPaymentMethods) window.renderPaymentMethods();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateHeroTitle() {
    const heroTitle = getElement('heroTitle');
    if (!heroTitle) return;
    if (appState.currentFilter === 'all') {
      heroTitle.innerHTML = 'Cozy Meets<br/><em>Couture.</em>';
    } else if (appState.currentFilter === 'favorites') {
      heroTitle.innerHTML = 'Your<br/><em>Favorites.</em>';
    } else {
      heroTitle.innerHTML = 'Stunning<br/><em>' + appState.currentFilter.charAt(0).toUpperCase() + appState.currentFilter.slice(1) + '.</em>';
    }
  }

  function filterFromCard(category) {
    appState.currentFilter = category;
    const links = document.querySelectorAll('.nav-links a');
    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('data-filter') === category);
    });
    updateHeroTitle();
    renderProducts();
  }

  function renderProducts() {
    const grid = getElement('productGrid');
    const empty = getElement('emptyState');
    if (!grid || !empty) return;

    grid.innerHTML = '';
    const normalizedQuery = (appState.searchQuery || '').toLowerCase();

    const filtered = (appState.products || []).filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(normalizedQuery);
      if (appState.currentFilter === 'favorites') {
        return (appState.favorites || []).includes(product.id) && matchesSearch;
      }
      if (appState.currentFilter === 'all') {
        return matchesSearch;
      }
      return product.category === appState.currentFilter && matchesSearch;
    });

    if (appState.currentSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    }
    if (appState.currentSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (filtered.length === 0) {
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');
    filtered.forEach((product) => {
      const isFav = (appState.favorites || []).includes(product.id);
      const heartIcon = isFav ? '❤️' : '🤍';
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <button class="fav-btn" onclick="toggleFav(event, ${product.id})">${heartIcon}</button>
        <div class="card-img"><img src="${product.image}" alt="${product.name}"></div>
        <div class="card-body">
          <span class="card-cat">${product.category}</span>
          <h3 class="card-name">${product.name}</h3>
          <div class="price">$${product.price.toFixed(2)}</div>
          <button class="add-btn" onclick="openPreviewModal(${product.id})">View</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  async function loadProducts() {
    try {
      const response = await fetch('./data/products.json');
      if (!response.ok) throw new Error('Failed to load products');
      appState.products = await response.json();
      renderProducts();
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  function toggleFav(event, id) {
    event.stopPropagation();
    const index = (appState.favorites || []).indexOf(id);
    if (index === -1) {
      appState.favorites.push(id);
      alert('Added to your favorites!');
    } else {
      appState.favorites.splice(index, 1);
      alert('Removed from favorites.');
    }
    renderProducts();
  }

  function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        showView('storeView');
        navLinks.forEach((item) => item.classList.remove('active'));
        event.target.classList.add('active');
        appState.currentFilter = event.target.getAttribute('data-filter');
        updateHeroTitle();
        renderProducts();
      });
    });

    const searchInput = getElement('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        appState.searchQuery = event.target.value;
        renderProducts();
      });
    }

    const sortSelect = getElement('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (event) => {
        appState.currentSort = event.target.value;
        renderProducts();
      });
    }
  }

  // start
  loadProducts();
  initializeNavigation();

  window.showView = showView;
  window.filterFromCard = filterFromCard;
  window.renderProducts = renderProducts;
  window.toggleFav = toggleFav;
})();
