(function(){
  function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'cart-item-check';
    checkbox.checked = item.isChecked;
    checkbox.onchange = () => toggleCartCheck(item.cartItemId);

    const image = document.createElement('img');
    image.src = item.image;
    image.alt = item.name;

    const details = document.createElement('div');
    details.className = 'cart-item-details';

    const name = document.createElement('div');
    name.className = 'name';
    name.innerText = item.name;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerText = `Size: ${item.size}`;

    const qty = document.createElement('div');
    qty.className = 'qty';

    const minus = document.createElement('button');
    minus.type = 'button';
    minus.innerText = '-';
    minus.onclick = () => updateQty(item.cartItemId, -1);

    const qtyValue = document.createElement('span');
    qtyValue.innerText = item.qty;

    const plus = document.createElement('button');
    plus.type = 'button';
    plus.innerText = '+';
    plus.onclick = () => updateQty(item.cartItemId, 1);

    qty.appendChild(minus);
    qty.appendChild(qtyValue);
    qty.appendChild(plus);

    details.appendChild(name);
    details.appendChild(meta);
    details.appendChild(qty);

    const summary = document.createElement('div');
    summary.className = 'cart-item-right';

    const price = document.createElement('div');
    price.className = 'cart-item-price';
    price.innerText = window.formatCurrency(item.price * item.qty);

    const remove = document.createElement('div');
    remove.className = 'remove';
    remove.innerText = 'Remove';
    remove.onclick = () => updateQty(item.cartItemId, -item.qty);

    summary.appendChild(price);
    summary.appendChild(remove);

    cartItem.appendChild(checkbox);
    cartItem.appendChild(image);
    cartItem.appendChild(details);
    cartItem.appendChild(summary);

    return cartItem;
  }

  function createEmptyCartMessage() {
    const message = document.createElement('div');
    message.className = 'cart-empty-message';
    message.innerText = 'Your cart is empty. Add items to checkout.';
    return message;
  }

  function openPreviewModal(id) {
    appState.currentModalProduct = (appState.products || []).find((product) => product.id === id);
    if (!appState.currentModalProduct) return;

    const image = getElement('pmImage');
    const name = getElement('pmName');
    const price = getElement('pmPrice');

    if (image) image.src = appState.currentModalProduct.image;
    if (name) name.innerText = appState.currentModalProduct.name;
    if (price) price.innerText = window.formatCurrency(appState.currentModalProduct.price);

    selectSize('S');
    const overlay = getElement('productModalOverlay');
    if (overlay) overlay.classList.add('open');
  }

  function closePreviewModal() {
    const overlay = getElement('productModalOverlay');
    if (overlay) overlay.classList.remove('open');
  }

  function selectSize(size) {
    appState.selectedSize = size;
    const selectEl = getElement('pmSize');
    if (selectEl) selectEl.value = size;
  }

  function addToCart() {
    if (!appState.currentModalProduct) return;

    const size = getElement('pmSize')?.value || appState.selectedSize;
    const cartItemId = `${appState.currentModalProduct.id}-${size}`;
    let existingItem = (appState.cart || []).find((item) => item.cartItemId === cartItemId);

    if (existingItem) {
      if (existingItem.qty >= 10) {
        alert('Maximum quantity for this item is 10.');
        return;
      }
      existingItem.qty += 1;
    } else {
      appState.cart.push({
        id: appState.currentModalProduct.id,
        cartItemId,
        name: appState.currentModalProduct.name,
        price: appState.currentModalProduct.price,
        image: appState.currentModalProduct.image,
        size,
        qty: 1,
        isChecked: true
      });
    }

    renderCart();
    closePreviewModal();
    alert(`${appState.currentModalProduct.name} added to cart!`);
  }

  function toggleCartCheck(cartItemId) {
    const cartItem = appState.cart.find((item) => item.cartItemId === cartItemId);
    if (!cartItem) return;

    cartItem.isChecked = !cartItem.isChecked;
    renderCart();
    if (appState.activeView === 'checkoutView' && window.renderCheckoutSummary) window.renderCheckoutSummary();
  }

  function updateQty(cartItemId, change) {
    const itemIndex = appState.cart.findIndex((item) => item.cartItemId === cartItemId);
    if (itemIndex === -1) return;

    if (change > 0 && appState.cart[itemIndex].qty >= 10) {
      alert('Maximum quantity for this item is 10.');
      return;
    }

    appState.cart[itemIndex].qty += change;
    if (appState.cart[itemIndex].qty <= 0) {
      appState.cart.splice(itemIndex, 1);
    }

    renderCart();
    if (appState.activeView === 'checkoutView' && window.renderCheckoutSummary) window.renderCheckoutSummary();
  }

  function renderCart() {
    const container = getElement('cartItems');
    const badge = getElement('cartCount');
    const totalEl = getElement('cartTotal');
    if (!container) return;

    container.innerHTML = '';

    if (appState.cart.length === 0) {
      container.appendChild(createEmptyCartMessage());
    }

    let totalQty = 0;
    let checkedTotalPrice = 0;

    appState.cart.forEach((item) => {
      totalQty += item.qty;
      if (item.isChecked) checkedTotalPrice += item.price * item.qty;
      container.appendChild(createCartItemElement(item));
    });

    if (badge) badge.innerText = totalQty;
    if (totalEl) totalEl.innerText = window.formatCurrency(checkedTotalPrice);
  }

  function toggleDrawer() {
    const drawer = getElement('cartDrawer');
    const overlay = getElement('drawerOverlay');
    if (!drawer || !overlay) return;

    drawer.classList.toggle('open');
    overlay.classList.toggle('open');
  }

  function initCheckout() {
    const hasCheckedItem = appState.cart.some((item) => item.isChecked);
    if (appState.cart.length === 0) {
      alert('Your cart is empty. Add items to checkout.');
      return;
    }
    if (!hasCheckedItem) {
      alert('Please select at least one item to checkout.');
      return;
    }
    if (!appState.isLoggedIn) {
      toggleDrawer();
      const loginModal = getElement('loginModalOverlay');
      if (loginModal) loginModal.classList.add('open');
      alert('Please sign in first to checkout.');
      return;
    }
    toggleDrawer();
    if (window.showView) window.showView('checkoutView');
    if (window.renderCheckoutSummary) window.renderCheckoutSummary();
  }

  function attachCartEvents() {
    const cartBtn = getElement('cartBtn');
    if (cartBtn) cartBtn.addEventListener('click', toggleDrawer);
  }

  attachCartEvents();
  window.openPreviewModal = openPreviewModal;
  window.closePreviewModal = closePreviewModal;
  window.selectSize = selectSize;
  window.addToCart = addToCart;
  window.toggleCartCheck = toggleCartCheck;
  window.updateQty = updateQty;
  window.toggleDrawer = toggleDrawer;
  window.initCheckout = initCheckout;
  window.renderCart = renderCart;
  window.updateCartUI = renderCart;
})();
