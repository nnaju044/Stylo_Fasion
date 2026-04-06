async function increaseQty(sku) {
  const el = document.getElementById(`qty-${sku}`);

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  try {
    const res = await axios.patch(`/user/cart/${sku}`, {
      action: "increase",
    });

    el.innerText = res.data.quantity;

    updateSubtotal(res.data.subtotal);

    if (res.data.quantity >= res.data.stock || res.data.quantity >= 5) {
      document.getElementById(`plus-${sku}`).disabled = true;
      document.getElementById(`plus-${sku}`).classList.add('opacity-50', 'cursor-not-allowed');
      Toast.fire({
        icon: "warning",
        title: res.data.quantity >= 5 ? "Maximum 5 items allowed" : "Maximum available stock reached"
      });
    }

  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong";

    Toast.fire({
      icon: "error",
      title: message
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

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: "error",
      title: message
    });
 }
}

function updateSubtotal(value) {
  document.getElementById("subtotal").innerText = value.toFixed(2);
}

async function removeItem(sku) {
  const result = await Swal.fire({
    title: "Remove Item?",
    text: "Are you sure you want to remove this item from your cart?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#7c2d12",
    cancelButtonColor: "#9ca3af",
    confirmButtonText: "Yes, remove it!"
  });

  if (result.isConfirmed) {
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
