(function(){
  function renderPaymentMethods() {
    const checkoutPayContainer = getElement('checkoutPaymentContainer');
    if (checkoutPayContainer) {
      checkoutPayContainer.innerHTML = '';
      checkoutPayContainer.innerHTML += `
        <div class="payment-option-group">
          <label class="payment-radio active">
            <input type="radio" name="payment" value="cod" checked onchange="togglePayment()">
            <span>Cash on Delivery (COD)</span>
          </label>
        </div>
      `;

      (appState.linkedPayments || []).forEach((payment) => {
        const optionVal = `${payment.type}_${payment.id}`;
        checkoutPayContainer.innerHTML += `
          <div class="payment-option-group">
            <label class="payment-radio">
              <input type="radio" name="payment" value="${optionVal}" onchange="togglePayment()">
              <span>Linked ${payment.type === 'card' ? 'Card' : 'GCash Account'} (${payment.display})</span>
            </label>
          </div>
        `;
      });
    }

    const settingsPayList = getElement('settingsPaymentsList');
    if (settingsPayList) {
      settingsPayList.innerHTML = '';
      if (!appState.linkedPayments || appState.linkedPayments.length === 0) {
        settingsPayList.innerHTML = '<p class="payment-empty-message">No linked payment methods.</p>';
      } else {
        appState.linkedPayments.forEach((payment) => {
          settingsPayList.innerHTML += `
            <div class="linked-card">
              <div>
                <strong class="linked-card-title">${payment.type} Profile</strong>
                <span class="linked-card-display">${payment.display}</span>
              </div>
              <button class="linked-card-remove" onclick="deleteLinkedPayment('${payment.id}')">Remove</button>
            </div>
          `;
        });
      }
    }
  }

  function togglePayment() {
    const radios = document.getElementsByName('payment');
    let selected = '';
    radios.forEach((radio) => {
      if (radio.parentNode) radio.parentNode.className = 'payment-radio';
      if (radio.checked) {
        selected = radio.value;
        if (radio.parentNode) radio.parentNode.className = 'payment-radio active';
      }
    });

    const cardDetails = getElement('cardDetails');
    const gcashDetails = getElement('gcashDetails');
    if (cardDetails) cardDetails.className = 'payment-details hidden';
    if (gcashDetails) gcashDetails.className = 'payment-details hidden';
    if (selected === 'card' && cardDetails) cardDetails.className = 'payment-details';
    if (selected === 'gcash' && gcashDetails) gcashDetails.className = 'payment-details';
  }

  function toggleLinkedPaymentInputs() {
    const value = getElement('paymentTypeSelect')?.value;
    if (!value) return;
    const cardInputs = getElement('settingsCardInputs');
    const gcashInputs = getElement('settingsGcashInputs');
    if (!cardInputs || !gcashInputs) return;

    if (value === 'card') {
      cardInputs.classList.remove('hidden');
      gcashInputs.classList.add('hidden');
    } else {
      cardInputs.classList.add('hidden');
      gcashInputs.classList.remove('hidden');
    }
  }

  function saveSettingPaymentMethod() {
    const type = getElement('paymentTypeSelect')?.value || 'card';
    const id = 'pay' + Date.now();
    let display = '';

    if (type === 'card') {
      const cardNo = getElement('settingsCardNum')?.value.trim() || '';
      const cardHolder = getElement('settingsCardHolder')?.value.trim() || '';
      if (!cardNo || !cardHolder) {
        alert('Please enter complete card credentials.');
        return;
      }
      display = `Card ends in *${cardNo.slice(-4)}`;
      appState.linkedPayments.push({ id, type: 'card', num: cardNo, holder: cardHolder, display });
    } else {
      const gcashNo = getElement('settingsGcashNum')?.value.trim() || '';
      if (gcashNo.length < 11) {
        alert('Please enter a valid 11-digit GCash mobile number.');
        return;
      }
      display = `GCash: ${gcashNo.slice(0, 4)}***${gcashNo.slice(7)}`;
      appState.linkedPayments.push({ id, type: 'gcash', num: gcashNo, display });
    }

    getElement('settingsCardNum').value = '';
    getElement('settingsCardHolder').value = '';
    getElement('settingsGcashNum').value = '';
    alert('Payment profile linked successfully!');
    hideSettingPaymentForm();
    renderPaymentMethods();
  }

  function deleteLinkedPayment(id) {
    if (!confirm('Are you sure you want to remove this linked payment account?')) return;
    appState.linkedPayments = appState.linkedPayments.filter((payment) => payment.id !== id);
    alert('Linked method removed.');
    renderPaymentMethods();
  }

  function showSettingPaymentForm() {
    getElement('settingsPaymentForm')?.classList.remove('hidden');
    getElement('addPaymentBtn')?.classList.add('hidden');
  }

  function hideSettingPaymentForm() {
    getElement('settingsPaymentForm')?.classList.add('hidden');
    getElement('addPaymentBtn')?.classList.remove('hidden');
  }

  window.renderPaymentMethods = renderPaymentMethods;
  window.togglePayment = togglePayment;
  window.toggleLinkedPaymentInputs = toggleLinkedPaymentInputs;
  window.saveSettingPaymentMethod = saveSettingPaymentMethod;
  window.deleteLinkedPayment = deleteLinkedPayment;
  window.showSettingPaymentForm = showSettingPaymentForm;
  window.hideSettingPaymentForm = hideSettingPaymentForm;
})();
