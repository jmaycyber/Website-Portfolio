(function(){
  function sendInquiry() {
    const input = document.getElementById('footerInquireText');
    if (!input) return;
    const value = input.value.trim();
    if (!value) {
      alert('Please type your inquiry first.');
      return;
    }
    alert('You will be notified later on.');
    input.value = '';
  }

  function showBellNotification() {
    alert('Your order is confirmed and waiting for shipment.');
  }

  function showToast(message) {
    alert(message);
  }

  window.sendInquiry = sendInquiry;
  window.showBellNotification = showBellNotification;
  window.showToast = showToast;
})();
