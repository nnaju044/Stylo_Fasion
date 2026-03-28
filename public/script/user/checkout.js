    document.querySelectorAll('input[name="paymentMethod"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        var fields = document.getElementById('card-fields');
        fields.classList.toggle('hidden', this.value !== 'CARD');
      });
    });

document.getElementById('checkout-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const addressId = formData.get('addressId');
  const payBtn = document.getElementById('pay-button');

  const paymentMethod = "COD";

  if (!addressId) {
    return Swal.fire({
      icon: 'warning',
      title: 'Address missing',
      text: 'Please select a delivery address!'
    });
  }

  try {
    payBtn.disabled = true;
    payBtn.textContent = 'Processing...';

    const response = await axios.post('/checkout/place-order', {
      addressId,
      paymentMethod
    });

    if (response.data.success) {
      window.location.href = '/order-success/' + response.data.orderId;
    } else {
      throw new Error(response.data.message);
    }

  } catch (error) {

    const errMsg =
      error.response?.data?.message || "Failed to place order";

    Swal.fire({
      icon: 'error',
      title: 'Order Failed',
      text: errMsg
    });

    payBtn.disabled = false;
    payBtn.textContent = 'Place Order';
  }
});
    // Address Modal Logic
    const changeAddressBtn = document.getElementById('change-address-btn');
    const addressModal = document.getElementById('address-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const confirmAddressBtn = document.getElementById('confirm-address-btn');
    const modalAddressLabels = document.querySelectorAll('.modal-address-label');

    if (changeAddressBtn && addressModal) {
      changeAddressBtn.addEventListener('click', function (e) {
        e.preventDefault();
        addressModal.classList.remove('hidden');
      });

      closeModalBtn.addEventListener('click', function () {
        addressModal.classList.add('hidden');
      });

      // Close on clicking outside modal
      addressModal.addEventListener('click', function (e) {
        if (e.target === addressModal) {
          addressModal.classList.add('hidden');
        }
      });

      // Handle label highlighting
      modalAddressLabels.forEach(label => {
        const radio = label.querySelector('input[type="radio"]');
        radio.addEventListener('change', function () {
          modalAddressLabels.forEach(l => l.classList.remove('border-crimson', 'bg-red-50'));
          modalAddressLabels.forEach(l => l.classList.add('border-gray-200'));
          label.classList.remove('border-gray-200');
          label.classList.add('border-crimson', 'bg-red-50');
        });
      });

      confirmAddressBtn.addEventListener('click', function () {
        const selectedRadio = document.querySelector('input[name="modalAddressId"]:checked');
        if (selectedRadio) {
          const label = selectedRadio.closest('.modal-address-label');
          const id = label.getAttribute('data-id');
          const name = label.getAttribute('data-name');
          const phone = label.getAttribute('data-phone');
          const details = label.getAttribute('data-details');

          document.getElementById('selected-address-id').value = id;
          document.getElementById('selected-address-name').innerHTML = name + ' &nbsp;|&nbsp; ' + phone;
          document.getElementById('selected-address-details').textContent = details;

          addressModal.classList.add('hidden');
        }
      });
    }

