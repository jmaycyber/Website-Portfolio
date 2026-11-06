window.appState = {
  products: [],
  currentFilter: 'all',
  currentSort: 'featured',
  searchQuery: '',
  favorites: [],
  cart: [],
  appliedPromo: null,
  currentModalProduct: null,
  isSignUpMode: false,
  isLoggedIn: false,
  selectedSize: 'S',
  activeView: 'storeView',
  savedAddresses: [],
  linkedPayments: [],
  userEmail: 'user@example.com',
  userPassword: 'user12345',
  orders: []
};

window.formatCurrency = function (value) {
  return '$' + value.toFixed(2);
};

window.getElement = function (id) { return document.getElementById(id); };
