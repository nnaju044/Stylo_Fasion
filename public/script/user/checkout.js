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