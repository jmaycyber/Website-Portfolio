document.addEventListener('DOMContentLoaded', function () {
  if (window.products && Array.isArray(window.products) && (!appState.products || appState.products.length === 0)) {
    appState.products = window.products;
  }

  if (window.renderCart) window.renderCart();
  if (window.renderPaymentMethods) window.renderPaymentMethods();
  if (window.renderSavedAddresses) window.renderSavedAddresses();
  if (window.renderCheckoutSummary) window.renderCheckoutSummary();
  if (window.renderOrders) window.renderOrders();
  if (window.renderProducts) window.renderProducts();
});
