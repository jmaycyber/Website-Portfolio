(function(){
  function toggleAuthMode() {
    appState.isSignUpMode = !appState.isSignUpMode;
    const title = getElement('loginTitle');
    const subtitle = getElement('loginSubtitle');
    const link = getElement('authModeToggleLink');
    const btn = getElement('authSubmitBtn');

    if (!title || !subtitle || !link || !btn) return;

    if (appState.isSignUpMode) {
      title.innerText = 'Create account for AutumnJo.';
      subtitle.innerText = 'Join us to explore premium autumn aesthetics.';
      link.innerText = 'Already have an account? Sign in';
      btn.innerText = 'Create Account';
    } else {
      title.innerText = 'Sign in to AutumnJo.';
      subtitle.innerText = 'Access your favorites and faster checkout.';
      link.innerText = 'Create an account';
      btn.innerText = 'Sign In';
    }
  }

  function handleLoginSubmit(event) {
    event.preventDefault();
    const emailField = getElement('loginEmailField');
    const passwordField = getElement('loginPasswordField');
    if (!emailField || !passwordField) return;

    const email = emailField.value.trim();
    const password = passwordField.value;

    if (!email || !password) {
      alert('Please enter your email and password.');
      return;
    }

    if (appState.isSignUpMode) {
      appState.userEmail = email;
      appState.userPassword = password;
      appState.isSignUpMode = false;
      toggleAuthMode();
      alert('Account created successfully! Welcome to AutumnJo.');
    } else {
      if (email !== appState.userEmail || password !== appState.userPassword) {
        alert('Invalid credentials. Please try again.');
        return;
      }
      alert('Successfully logged in to AutumnJo!');
    }

    appState.isLoggedIn = true;
    getElement('loginBtn')?.classList.add('logged-in');
    closeLoginModal();
  }

  function closeLoginModal() {
    const modal = getElement('loginModalOverlay');
    if (modal) modal.classList.remove('open');
  }

  function toggleChangePasswordForm() {
    const form = getElement('settingsChangePasswordForm');
    if (!form) return;
    form.classList.toggle('hidden');
  }

  function changePassword() {
    const current = getElement('currentPasswordInput')?.value || '';
    const next = getElement('newPasswordInput')?.value || '';
    const confirm = getElement('confirmPasswordInput')?.value || '';

    if (!current || !next || !confirm) {
      alert('Please fill out all password fields.');
      return;
    }
    if (current !== appState.userPassword) {
      alert('Current password is incorrect.');
      return;
    }
    if (next.length < 6) {
      alert('New password must be at least 6 characters long.');
      return;
    }
    if (next !== confirm) {
      alert('New password and confirmation do not match.');
      return;
    }

    appState.userPassword = next;
    if (getElement('currentPasswordInput')) getElement('currentPasswordInput').value = '';
    if (getElement('newPasswordInput')) getElement('newPasswordInput').value = '';
    if (getElement('confirmPasswordInput')) getElement('confirmPasswordInput').value = '';
    if (getElement('settingsChangePasswordForm')) getElement('settingsChangePasswordForm').classList.add('hidden');
    alert('Password updated successfully!');
  }

  function deleteAccount() {
    if (!confirm('Are you sure you want to delete your account?')) return;
    if (!confirm('This will remove all saved data and cannot be undone. Continue?')) return;

    appState.isLoggedIn = false;
    appState.favorites = [];
    appState.cart = [];
    appState.savedAddresses = [];
    appState.linkedPayments = [];
    appState.appliedPromo = null;
    appState.orders = [];
    appState.isSignUpMode = false;
    appState.userEmail = 'user@example.com';
    appState.userPassword = 'user12345';

    getElement('loginBtn')?.classList.remove('logged-in');
    getElement('profileDropdown')?.classList.add('hidden');

    if (window.renderCart) window.renderCart();
    if (window.renderSavedAddresses) window.renderSavedAddresses();
    if (window.renderPaymentMethods) window.renderPaymentMethods();
    if (window.renderOrders) window.renderOrders();
    alert('Your account has been deleted.');
    if (window.showView) window.showView('storeView');
  }

  function navigateToAccount(viewId) {
    if (!appState.isLoggedIn) {
      getElement('loginModalOverlay')?.classList.add('open');
      return;
    }
    if (window.showView) window.showView(viewId);
    const profileDropdown = getElement('profileDropdown');
    if (profileDropdown) profileDropdown.classList.add('hidden');
  }

  function attachAuthEvents() {
    const loginBtn = getElement('loginBtn');
    const logoutBtn = getElement('logoutBtn');
    const profileDropdown = getElement('profileDropdown');
    const profileContainer = document.querySelector('.profile-container');

    function toggleProfileDropdown() {
      if (profileDropdown) {
        profileDropdown.classList.toggle('hidden');
      }
    }

    loginBtn?.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleProfileDropdown();
    });

    profileContainer?.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    logoutBtn?.addEventListener('click', () => {
      appState.isLoggedIn = false;
      getElement('loginBtn')?.classList.remove('logged-in');
      if (profileDropdown) profileDropdown.classList.add('hidden');

      appState.favorites = [];
      appState.cart = [];
      appState.savedAddresses = [];
      appState.linkedPayments = [];
      appState.appliedPromo = null;
      appState.isSignUpMode = false;
      appState.orders = [];

      if (window.renderCart) window.renderCart();
      if (window.renderSavedAddresses) window.renderSavedAddresses();
      if (window.renderPaymentMethods) window.renderPaymentMethods();
      if (window.renderOrders) window.renderOrders();

      alert('Session cleared & logged out successfully.');
      if (window.showView) window.showView('storeView');
    });

    document.addEventListener('click', (event) => {
      if (!profileDropdown || !profileContainer) return;
      if (!profileDropdown.classList.contains('hidden') && !profileContainer.contains(event.target)) {
        profileDropdown.classList.add('hidden');
      }
    });
  }

  attachAuthEvents();
  window.toggleAuthMode = toggleAuthMode;
  window.handleLoginSubmit = handleLoginSubmit;
  window.closeLoginModal = closeLoginModal;
  window.toggleChangePasswordForm = toggleChangePasswordForm;
  window.changePassword = changePassword;
  window.deleteAccount = deleteAccount;
  window.navigateToAccount = navigateToAccount;
})();
