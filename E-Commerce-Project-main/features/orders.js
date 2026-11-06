(function(){
  function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'status-card order-card';

    const header = document.createElement('div');
    header.className = 'status-header';

    const title = document.createElement('strong');
    title.innerText = `Order #${order.number}`;

    const badge = document.createElement('span');
    const statusClass = order.status === 'cancelled' ? 'cancelled' : order.status === 'shipped' ? 'shipped' : 'transit';
    badge.className = `status-badge ${statusClass}`;
    badge.innerText = order.status === 'cancelled' ? 'Cancelled' : order.status === 'shipped' ? 'Shipped' : 'Confirmed';

    header.appendChild(title);
    header.appendChild(badge);

    const statusText = document.createElement('p');
    statusText.className = 'status-text';
    statusText.innerText = order.statusText;

    const actionWrapper = document.createElement('div');
    actionWrapper.className = 'order-actions';

    const detailsButton = document.createElement('button');
    detailsButton.type = 'button';
    detailsButton.className = 'btn-outline';
    detailsButton.id = `detailsBtn_${order.id}`;
    detailsButton.innerText = 'Show Details';
    detailsButton.onclick = () => toggleOrderDetails(order.id);

    const actionGroup = document.createElement('div');
    actionGroup.className = 'order-action-group';

    if (order.status === 'confirmed') {
      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.className = 'btn-cancel';
      cancelButton.innerText = 'Cancel Order';
      cancelButton.onclick = () => cancelOrder(order.id);

      const receiveButton = document.createElement('button');
      receiveButton.type = 'button';
      receiveButton.className = 'btn btn-success';
      receiveButton.innerText = 'Seller Confirmed (Test)';
      receiveButton.onclick = () => markPreparing(order.id);

      actionGroup.appendChild(cancelButton);
      actionGroup.appendChild(receiveButton);
    }

    const details = document.createElement('div');
    details.id = `orderDetails_${order.id}`;
    details.className = 'hidden myorder-collapsed-details';
    details.innerHTML = `
      <div class="order-details-grid">
        <div>
          <h4>Delivery Address</h4>
          <p>${order.addressHtml}</p>
        </div>
        <div>
          <h4>Payment Method</h4>
          <p>${order.paymentDisplay}</p>
        </div>
        <div>
          <h4>Ordered Items</h4>
          <div class="order-items-summary">${order.itemsHtml}</div>
        </div>
      </div>
    `;

    actionWrapper.appendChild(detailsButton);
    actionWrapper.appendChild(actionGroup);

    card.appendChild(header);
    card.appendChild(statusText);
    card.appendChild(actionWrapper);
    card.appendChild(details);

    return card;
  }

  function renderOrders() {
    const list = getElement('ordersList');
    const noOrderMessage = getElement('noOrderMessage');
    if (!list || !noOrderMessage) return;

    if (!appState.orders || appState.orders.length === 0) {
      list.innerHTML = '';
      noOrderMessage.classList.remove('hidden');
      return;
    }

    noOrderMessage.classList.add('hidden');
    list.innerHTML = '';

    (appState.orders || []).slice().reverse().forEach((order) => {
      list.appendChild(createOrderCard(order));
    });
  }

  function toggleOrderDetails(orderId) {
    const details = getElement(`orderDetails_${orderId}`);
    const btn = getElement(`detailsBtn_${orderId}`);
    if (!details || !btn) return;

    if (details.classList.contains('hidden')) {
      details.classList.remove('hidden');
      btn.innerText = 'Hide Details';
    } else {
      details.classList.add('hidden');
      btn.innerText = 'Show Details';
    }
  }

  function cancelOrder(orderId) {
    const order = (appState.orders || []).find((item) => item.id === orderId);
    if (!order || order.status !== 'confirmed') return;
    order.status = 'cancelled';
    order.statusText = 'Status: This order has been cancelled and is no longer active.';
    renderOrders();
    alert('Order has been cancelled successfully.');
  }

  function markPreparing(orderId) {
    const order = (appState.orders || []).find((item) => item.id === orderId);
    if (!order) return;
    order.status = 'ontheway';
    order.statusText = 'Status: Order confirmed. Your items will be on the way after preparation.';
    renderOrders();
    alert('You have confirmed the order.');
  }

  window.renderOrders = renderOrders;
  window.toggleOrderDetails = toggleOrderDetails;
  window.cancelOrder = cancelOrder;
  window.markPreparing = markPreparing;
})();
