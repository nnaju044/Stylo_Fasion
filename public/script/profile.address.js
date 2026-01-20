

/* -------------------- OPEN/CLOSE ADDRESS MODULE -------------------- */

function openModal() {
  document.getElementById("AddAddessModal").style.display = "flex";
  document.body.classList.add("modal-open");
}

function closeModal() {
  document.getElementById("AddAddessModal").style.display = "none";
  document.body.classList.remove("modal-open");
}
/* -------------------- ADD ADDRESS MODULE -------------------- */

function openAddressModal() {
  openModal();

  const form = document.getElementById("userAddressForm");

  form.action = "/user/addresses/add";

  form.reset();

  const countryInput = document.getElementById("country");
  if (countryInput) {
    countryInput.value = "India";
  }
}






const pincodeInput = document.getElementById("pincode");

pincodeInput.addEventListener("blur", fetchPincodeDetails);

async function fetchPincodeDetails() {
  const pincode = document.getElementById("pincode").value;

  // Basic validation
  if (pincode.length !== 6) return;

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await res.json();

    if (data[0].Status !== "Success") {
      alert("Invalid pincode");
      return;
    }

    const postOffice = data[0].PostOffice[0];

    document.getElementById("city").value = postOffice.District;
    document.getElementById("state").value = postOffice.State;
  } catch (error) {
    console.error("Pincode fetch failed", error);
  }
}

/* -------------------- EDIT ADDRESS MODULE -------------------- */

function openEditAddress(btn) {
  openModal();

  const form = document.getElementById("userAddressForm");
  form.action = `/user/addresses/${btn.dataset.id}/update`;

  document.getElementById("fullName").value = btn.dataset.fullname || "";
  document.getElementById("addressLine").value = btn.dataset.addressline || "";
  document.getElementById("city").value = btn.dataset.city || "";
  document.getElementById("state").value = btn.dataset.state || "";
  document.getElementById("pincode").value = btn.dataset.pincode || "";
  document.getElementById("phone").value = btn.dataset.phone || "";
  document.getElementById("country").value = btn.dataset.country || "India";
}



/* -------------------- DELETE ADDRESS MODULE -------------------- */

  function openDeleteModal(btn) {
    const addressId = btn.dataset.id;

    const form = document.getElementById("deleteAddressForm");

    form.action = `/user/addresses/${addressId}/delete`;

    document.getElementById("deleteAddressModal").style.display = "flex";
    document.body.classList.add("modal-open");
  }

  function closeDeleteModal() {
    document.getElementById("deleteAddressModal").style.display = "none";
    document.body.classList.remove("modal-open");
  }






