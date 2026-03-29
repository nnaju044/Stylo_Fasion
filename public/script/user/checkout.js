document.getElementById('checkout-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const addressInput = document.getElementById('selected-address-id');
  const addressId = addressInput && addressInput.value ? addressInput.value : null;

  const selected = document.querySelector('input[name="payment"]:checked');

  const paymentMap = {
    cod: "COD",
    wallet: "WALLET",
    razorpay: "RAZORPAY"
  };

  const paymentMethod = selected ? paymentMap[selected.value] : "COD";

  const payBtn = document.getElementById('pay-button');

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

    const response = await axios.post('/user/checkout/place-order', {
      addressId,
      paymentMethod
    });

    if (response.data.success) {
      window.location.href = '/user/order-success/' + response.data.orderId;
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

/* ── Address modal ───────────────────────────── */
var modal     = document.getElementById('address-modal');
var changeBtn = document.getElementById('change-address-btn');
var closeBtn  = document.getElementById('close-modal-btn');
var confirmBtn = document.getElementById('confirm-address-btn');

if (changeBtn) changeBtn.addEventListener('click', function(e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  modal.classList.add('flex');
});
if (closeBtn) closeBtn.addEventListener('click', function() {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
});
modal.addEventListener('click', function(e) {
  if (e.target === modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
});

if (confirmBtn) confirmBtn.addEventListener('click', function() {
  var selected = document.querySelector('input[name="modalAddressId"]:checked');
  if (!selected) return;

  var label = selected.closest('label');
  var id      = label.dataset.id;
  var name    = label.dataset.name;
  var phone   = label.dataset.phone;
  var details = label.dataset.details;

  document.getElementById('selected-address-id').value = id;
  document.getElementById('selected-address-name').textContent = name + '  |  ' + phone;
  document.getElementById('selected-address-details').textContent = details;

  modal.classList.add('hidden');
  modal.classList.remove('flex');
});