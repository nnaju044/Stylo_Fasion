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
  
  if (res.data.quantity <= res.data.stock) {
    const warningEl = document.getElementById(`warning-${sku}`);
    if (warningEl) {
      warningEl.remove();
    }
    
    document.getElementById(`plus-${sku}`).disabled = false;
    document.getElementById(`plus-${sku}`).classList.remove('opacity-50', 'cursor-not-allowed');

    const remainingWarnings = document.querySelectorAll('.warning-text');
    if (remainingWarnings.length === 0) {
      const checkoutBtn = document.getElementById('checkout-btn');
      if (checkoutBtn) {
        checkoutBtn.style.background = '#7c2d12';
        checkoutBtn.style.cursor = 'pointer';
        checkoutBtn.disabled = false;
        checkoutBtn.innerText = 'Proceed to Checkout';
        checkoutBtn.onclick = checkout;
        checkoutBtn.onmouseover = function() {
          this.style.background='#6d2510'; 
          this.style.transform='scale(1.05)';
        };
        checkoutBtn.onmouseout = function() {
          this.style.background='#7c2d12'; 
          this.style.transform='scale(1)';
        };
        checkoutBtn.onmousedown = function() {
          this.style.background='#5c1f08';
        };
        checkoutBtn.onmouseup = function() {
          this.style.background='#6d2510';
        };
      }
    }
  }
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

async function removeItem(sku) {
  if (confirm("Are you sure you want to remove this item from your cart?")) {
    try {
      const res = await axios.delete(`/user/cart/${sku}`);
      if(res.data.success) {
         window.location.reload();
      }
    } catch(err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not remove item"
      });
    }
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
