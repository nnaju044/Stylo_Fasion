async function increaseQty(sku) {
  const el = document.getElementById(`qty-${sku}`);

  try {
    const res = await axios.patch(`/user/cart/${sku}`, {
      action: "increase",
    });

    el.innerText = res.data.quantity;

    updateSubtotal(res.data.subtotal);

    if (res.data.quantity >= res.data.stock) {
      document.getElementById(`plus-${sku}`).disabled = true;
    }

  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong";

    Swal.fire({
      icon: "error",
      title: "Stock Limit",
      text: message,
      timer: 1500,
    });
  }
}

// Decrease quantity
async function decreaseQty(sku) {
  const el = document.getElementById(`qty-${sku}`);

  let qty = parseInt(el.innerText);
  if (qty <= 1) return;

 try {
     const res = await axios.patch(`/user/cart/${sku}`, {
    action: "decrease",
  });
  el.innerText = res.data.quantity;
  updateSubtotal(res.data.subtotal);
  
 } catch (error) {
    const message = error.response?.data?.message || "Error";

    Swal.fire({
      icon: "error",
      title: "Error",
      text: message
    });

 }
}

function updateSubtotal(value) {
  document.getElementById("subtotal").innerText = value.toFixed(2);
}

function removeItem() {
  if (confirm("Are you sure you want to remove this item from your cart?")) {
    console.log("Removing item");
  }
}

function checkout() {
  console.log(" Checkout button clicked!");
  
  const checkoutBtn = document.querySelector('button[onclick="checkout()"]');
  if (checkoutBtn) {
    console.log(" Checkout button found:", checkoutBtn);
  } else {
    console.error("Checkout button not found in DOM");
  }
  
  Swal.fire({
    title: 'Processing...',
    html: 'Redirecting to checkout...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
      setTimeout(() => {
        window.location.href = "/user/checkout";
      }, 500);
    }
  });
}
