(function(){
  function createAddressOption(address, checked) {
    const wrapper = document.createElement('div');
    wrapper.className = 'payment-option-group';

    const label = document.createElement('label');
    label.className = `payment-radio${checked ? ' active' : ''}`;
    label.innerHTML = `
      <input type="radio" name="address" value="${address.id}" ${checked ? 'checked' : ''} onchange="toggleAddress()">
      <div class="address-info">
        <span>${address.type} - ${address.name}</span>
        <span class="address-meta">${address.street}, ${address.city} ${address.zip}</span>
      </div>
    `;

    wrapper.appendChild(label);
    return wrapper;
  }


  function createSettingsAddressCard(address) {
    const card = document.createElement('div');
    card.className = 'settings-address-card';

    const info = document.createElement('div');
    info.className = 'settings-address-info';

    const title = document.createElement('strong');
    title.className = 'settings-address-title';
    title.innerText = address.type;

    const summary = document.createElement('span');
    summary.className = 'settings-address-meta';
    summary.innerText = `${address.name} — ${address.street}, ${address.city}`;

    info.appendChild(title);
    info.appendChild(summary);

    const actions = document.createElement('div');
    actions.className = 'settings-address-actions';

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'settings-action-btn settings-action-delete';
    deleteBtn.innerText = 'Delete';
    deleteBtn.onclick = () => deleteAddress(address.id);

    actions.appendChild(deleteBtn);
    card.appendChild(info);
    card.appendChild(actions);

    return card;
  }

  function createCheckoutSummaryItem(item) {
    const row = document.createElement('div');
    row.className = 'summary-product';

    const image = document.createElement('img');
    image.src = item.image;
    image.alt = item.name;

    const info = document.createElement('div');
    info.className = 'summary-product-info';

    const title = document.createElement('h4');
    title.innerText = item.name;

    const meta = document.createElement('p');
    meta.innerText = `Qty: ${item.qty} | Size: ${item.size}`;

    info.appendChild(title);
    info.appendChild(meta);

    const price = document.createElement('div');
    price.className = 'summary-product-price';
    price.innerText = window.formatCurrency(item.price * item.qty);

    row.appendChild(image);
    row.appendChild(info);
    row.appendChild(price);

    return row;
  }

  function renderSavedAddresses() {
    const container = getElement('savedAddressesContainer');
    if (container) {
      container.innerHTML = '';
      (appState.savedAddresses || []).forEach((address, index) => {
        container.appendChild(createAddressOption(address, index === 0));
      });
      toggleAddress();
    }

    const settingsList = getElement('settingsAddressList');
    if (!settingsList) return;
    settingsList.innerHTML = '';
    (appState.savedAddresses || []).forEach((address) => {
      settingsList.appendChild(createSettingsAddressCard(address));
    });
  }

  function showAddressForm() {
    getElement('editAddressId').value = '';
    getElement('addrType').value = 'Home';
    getElement('addrName').value = '';
    getElement('addrStreet').value = '';
    getElement('addrCity').value = '';
    getElement('addrZip').value = '';
    getElement('settingsAddressForm')?.classList.remove('hidden');
    getElement('addAddressBtn')?.classList.add('hidden');
  }

  function hideAddressForm() {
    getElement('settingsAddressForm')?.classList.add('hidden');
    getElement('addAddressBtn')?.classList.remove('hidden');
  }

  function saveAddress() {
    const id = getElement('editAddressId').value;
    const type = getElement('addrType').value.trim() || 'Home';
    const name = getElement('addrName').value.trim();
    const street = getElement('addrStreet').value.trim();
    const city = getElement('addrCity').value.trim();
    const zip = getElement('addrZip').value.trim();

    if (!name || !street || !city || !zip) {
      alert('Please fill out all address details.');
      return;
    }

    if (id) {
      const existing = (appState.savedAddresses || []).find((address) => address.id === id);
      if (existing) {
        existing.type = type;
        existing.name = name;
        existing.street = street;
        existing.city = city;
        existing.zip = zip;
      }
      alert('Address details updated!');
    } else {
      appState.savedAddresses.push({ id: 'addr' + Date.now(), type, name, street, city, zip });
      alert('New address added successfully!');
    }

    hideAddressForm();
    renderSavedAddresses();
  }

  function editAddress(id) {
    const address = (appState.savedAddresses || []).find((item) => item.id === id);
    if (!address) return;
    getElement('editAddressId').value = address.id;
    getElement('addrType').value = address.type;
    getElement('addrName').value = address.name;
    getElement('addrStreet').value = address.street;
    getElement('addrCity').value = address.city;
    getElement('addrZip').value = address.zip;
    getElement('settingsAddressForm')?.classList.remove('hidden');
    getElement('addAddressBtn')?.classList.add('hidden');
  }

  function deleteAddress(id) {
    if (!confirm('Are you sure you want to delete this location?')) return;
    appState.savedAddresses = (appState.savedAddresses || []).filter((address) => address.id !== id);
    alert('Address deleted successfully.');
    renderSavedAddresses();
  }

  function toggleAddress() {
    const radios = document.getElementsByName('address');
    let selected = '';
    radios.forEach((radio) => {
      if (radio.parentNode) radio.parentNode.className = 'payment-radio';
      if (radio.checked) {
        selected = radio.value;
        if (radio.parentNode) radio.parentNode.className = 'payment-radio active';
      }
    });

    const newAddressDetails = getElement('newAddressDetails');
    if (!newAddressDetails) return;

    if (selected === 'new' || radios.length === 0) {
      newAddressDetails.className = 'payment-details';
    } else {
      newAddressDetails.className = 'payment-details hidden';
    }
  }

  function renderCheckoutSummary() {
    const list = getElement('checkoutSummaryItems');
    const subtotalEl = getElement('summarySubtotal');
    const discountRow = getElement('discountRow');
    const discountLabel = getElement('discountLabel');
    const discountValue = getElement('summaryDiscount');
    const totalEl = getElement('summaryFinalTotal');
    if (!list || !subtotalEl || !totalEl) return;

    list.innerHTML = '';
    let subtotal = 0;

    (appState.cart || []).forEach((item) => {
      if (!item.isChecked) return;
      subtotal += item.price * item.qty;
      list.appendChild(createCheckoutSummaryItem(item));
    });

    let discount = 0;
    if (appState.appliedPromo) {
      discount = subtotal * appState.appliedPromo.rate;
      discountRow?.classList.remove('hidden');
      if (discountLabel) discountLabel.innerText = appState.appliedPromo.code;
      if (discountValue) discountValue.innerText = `-${window.formatCurrency(discount)}`;
    } else {
      discountRow?.classList.add('hidden');
    }

    subtotalEl.innerText = window.formatCurrency(subtotal);
    totalEl.innerText = window.formatCurrency(subtotal - discount);
  }

  function applyPromo() {
    const promoInput = getElement('promoInput');
    if (!promoInput) return;
    const code = promoInput.value.trim().toUpperCase();
    if (code === 'SAVE20') {
      appState.appliedPromo = { code: 'SAVE20', rate: 0.2 };
    } else if (code === 'AUTUMN26') {
      appState.appliedPromo = { code: 'AUTUMN26', rate: 0.5 };
    } else {
      alert('Invalid promo code.');
      return;
    }

    alert('Promo code applied successfully!');
    promoInput.value = '';
    renderCheckoutSummary();
  }

  function handleCheckoutSubmit(event) {
    event.preventDefault();
    const addressRadios = document.getElementsByName('address');
    let selectedAddress = '';
    addressRadios.forEach((radio) => {
      if (radio.checked) selectedAddress = radio.value;
    });

    if (selectedAddress === 'new' || selectedAddress === '') {
      const required = ['newFirstName', 'newLastName', 'newStreet', 'newCity', 'newZip'];
      const missing = required.some((id) => !(getElement(id)?.value.trim()));
      if (missing) {
        alert('Please fill in all address inputs.');
        return;
      }
    }

    const paymentRadios = document.getElementsByName('payment');
    let selectedPayment = '';
    paymentRadios.forEach((radio) => {
      if (radio.checked) selectedPayment = radio.value;
    });

    if (!selectedPayment) {
      alert('Please select a payment method.');
      return;
    }

    placeOrder();
  }

  function placeOrder() {
    const addressRadios = document.getElementsByName('address');
    let selectedAddress = '';
    addressRadios.forEach((radio) => {
      if (radio.checked) selectedAddress = radio.value;
    });

    let addressHtml = '';
    if (selectedAddress === 'new' || selectedAddress === '') {
      const firstName = getElement('newFirstName')?.value.trim();
      const lastName = getElement('newLastName')?.value.trim();
      const street = getElement('newStreet')?.value.trim();
      const city = getElement('newCity')?.value.trim();
      const zip = getElement('newZip')?.value.trim();
      if (!firstName || !lastName || !street || !city || !zip) {
        alert('Please fill in all address fields.');
        return;
      }
      addressHtml = `${firstName} ${lastName}<br>${street}<br>${city} ${zip}`;
      const duplicate = (appState.savedAddresses || []).some(
        (address) => address.street.toLowerCase() === street.toLowerCase() && address.city.toLowerCase() === city.toLowerCase()
      );
      if (!duplicate) {
        appState.savedAddresses.push({ id: 'addr' + Date.now(), type: 'Recent Location', name: `${firstName} ${lastName}`, street, city, zip });
      }
    } else {
      const saved = (appState.savedAddresses || []).find((address) => address.id === selectedAddress);
      if (saved) {
        addressHtml = `${saved.name}<br>${saved.street}<br>${saved.city} ${saved.zip}`;
      }
    }

    const paymentRadios = document.getElementsByName('payment');
    let selectedPayment = '';
    paymentRadios.forEach((radio) => {
      if (radio.checked) selectedPayment = radio.value;
    });

    let paymentDisplay = 'Cash on Delivery';
    if (selectedPayment.includes('_')) {
      const paymentId = selectedPayment.split('_')[1];
      const payment = (appState.linkedPayments || []).find((method) => method.id === paymentId);
      if (payment) {
        paymentDisplay = `Linked ${payment.type === 'card' ? 'Card' : 'GCash'} (${payment.display})`;
      }
    }

    let itemsHtml = '';
    let subtotal = 0;
    (appState.cart || []).forEach((item) => {
      if (!item.isChecked) return;
      const lineTotal = item.price * item.qty;
      subtotal += lineTotal;
      itemsHtml += `<div class="order-detail-row"><span>${item.qty}x ${item.name} (Size: ${item.size})</span><span>${window.formatCurrency(lineTotal)}</span></div>`;
    });

    let discount = 0;
    if (appState.appliedPromo) {
      discount = subtotal * appState.appliedPromo.rate;
      itemsHtml += `<div class="order-detail-row order-discount-row"><span>Discount (${appState.appliedPromo.code})</span><span>-${window.formatCurrency(discount)}</span></div>`;
    }

    const orderId = 'order' + Date.now();
    const orderNumber = ('00000' + ((appState.orders || []).length + 1)).slice(-5);
    appState.orders.push({
      id: orderId,
      number: orderNumber,
      status: 'confirmed',
      statusText: 'Status: Order confirmed. Your items will be on the way after preparation.',
      addressHtml,
      paymentDisplay,
      itemsHtml,
      total: subtotal - discount
    });

    appState.cart = (appState.cart || []).filter((item) => !item.isChecked);
    appState.appliedPromo = null;
    if (window.renderCart) window.renderCart();
    if (window.renderSavedAddresses) window.renderSavedAddresses();
    if (window.renderPaymentMethods) window.renderPaymentMethods();
    if (window.renderOrders) window.renderOrders();
    alert('Your order is being submitted.');
    if (window.showView) window.showView('myOrdersView');
  }

  function markPreparing(orderId) {
    const order = (appState.orders || []).find((item) => item.id === orderId);
    if (!order) return;
    order.status = 'ontheway';
    order.statusText = 'Status: Order received. Your items are on the way.';
    if (window.renderOrders) window.renderOrders();
    alert('Your order is on the way.');
  }

  window.renderSavedAddresses = renderSavedAddresses;
  window.showAddressForm = showAddressForm;
  window.hideAddressForm = hideAddressForm;
  window.saveAddress = saveAddress;
  window.editAddress = editAddress;
  window.deleteAddress = deleteAddress;
  window.toggleAddress = toggleAddress;
  window.renderCheckoutSummary = renderCheckoutSummary;
  window.applyPromo = applyPromo;
  window.handleCheckoutSubmit = handleCheckoutSubmit;
  window.placeOrder = placeOrder;
  window.markPreparing = markPreparing;
})();
