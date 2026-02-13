function openEditProfileModal() {
  document.getElementById("editProfileModal").classList.remove("hidden");
}
function closeModal() {

  document.getElementById("editProfileModal").classList.add("hidden");
}

function showSuccess(msg) {

  successIcon.style.display = "block";
  errorMsg.style.display = "none";
}

async function saveChanges() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName  = document.getElementById("lastName").value.trim();
  const phone     = document.getElementById("phone").value.trim();

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword     = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // ---------- BASIC VALIDATION ----------
  if (!firstName || !lastName) {
    Swal.fire("Error", "First and last name are required", "error");
    return;
  }

  // ---------- PASSWORD RULE ----------
  const passwordFields = [currentPassword, newPassword, confirmPassword];
  const anyPasswordFilled = passwordFields.some(v => v.length > 0);
  const allPasswordFilled = passwordFields.every(v => v.length > 0);

  if (anyPasswordFilled && !allPasswordFilled) {
    Swal.fire(
      "Error",
      "Please complete all password fields",
      "error"
    );
    return;
  }

  if (allPasswordFilled && newPassword !== confirmPassword) {
    Swal.fire("Error", "Passwords do not match", "error");
    return;
  }

  // ---------- PAYLOAD ----------
  const payload = {
    firstName,
    lastName,
    phone
  };

  if (allPasswordFilled) {
    payload.currentPassword = currentPassword;
    payload.newPassword = newPassword;
    payload.confirmPassword = confirmPassword;
  }

  try {
   
    await axios.patch("/user/profile/update-all", payload);

    Swal.fire("Success", "Profile updated successfully", "success");

    setTimeout(()=>{
      window.location.reload();
    },1000)


  } catch (err) {
    console.log("error from saveChange",err)
    const msg =
      err.response?.data?.errors
        ? Object.values(err.response.data.errors)[0][0]
        : err.response?.data?.message || "Update failed";

    Swal.fire("Error", msg, "error");
  }
}

/* -------------------- FOR SEND EMAIL -------------------- */

function sendEmailOtp (){

  (async () =>{
    try {

    const email = document.getElementById("email").value.trim();
    const emailOtpSection = document.getElementById("emailOtpSection");


    if (!email) {
      Swal.fire("Error", "Please enter an email", "error");
      return;
    }
    emailOtpSection.style.display = "block";

    await axios.post("/user/profile/email/send-otp", { email });


    Swal.fire("OTP Sent", "Check your email", "success");
  } catch (error) {
    console.error("Email OTP error:", error);

    Swal.fire(
      "Error",
      error?.response?.data?.message || "Failed to send OTP",
      "error"
    );
  }
})();
};

    /* -------------------- FOR VERIFY EMAIL -------------------- */


 function verifyEmailOtp() {
  (async ()=>{
    const inputs = document.querySelectorAll(".otp-input");
  let otp = "";

  inputs.forEach(i => otp += i.value);
  console.log(otp)

  if (otp.length !== 6) {
    document.getElementById("emailOtpError").innerText =
      "Enter complete 6-digit OTP";
    document.getElementById("emailOtpError").style.display = "block";
    return;
  }

  try {
    await axios.patch("/user/profile/email/verify-otp", { otp });

    Swal.fire("Success", "Email updated successfully", "success");

    document.getElementById("emailOtpSection").style.display = "none";

  } catch (err) {
    document.getElementById("emailOtpError").innerText =
      "Invalid or expired OTP";
    document.getElementById("emailOtpError").style.display = "block";
  }
  })();
  
};

async function uploadProfileImage() {
  const fileInput = document.getElementById("profileImageInput");
  const file = fileInput.files[0];

  if (!file) return;

  const formData = new FormData();
  formData.append("profileImage", file);

  try {
    const res = await axios.patch(
      "/user/profile/upload-image",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    // Update image instantly
    document.querySelector("#profileAvatar").src = res.data.imageUrl;

    Swal.fire("Success", "Profile picture updated", "success");

  } catch (err) {
    Swal.fire("Error", "Image upload failed", "error");
  }
};

async function handleImageUpload(input) {
  console.log(input)
  const file = input.files[0];

  console.log(file)

  if (!file) return;

  // ---------- Frontend validation ----------
  if (!file.type.startsWith("image/")) {
    Swal.fire("Error", "Please select an image file", "error");
    return;
  }

  // ---------- Preview immediately ----------
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("profileAvatar").src = reader.result;
  };
  reader.readAsDataURL(file);

  // ---------- Upload to server ----------
  const formData = new FormData();
  formData.append("profileImage", file);

  try {
    const res = await axios.patch("/user/profile/upload-image",formData,{ headers: { "Content-Type": "multipart/form-data" } });

    
    document.getElementById("profileAvatar").src = res.data.imageUrl;

    Swal.fire("Success", "Profile picture updated", "success");

  } catch (err) {
    console.log("error from the image upload :",err);
    Swal.fire("Error", "Image upload failed", "error");
  }
}










/* -------------------- FOR INPUT EMAIL -------------------- */

    const inputs = document.querySelectorAll('.otp-input');
    const successIcon = document.getElementById('otpSuccessIcon');

    inputs.forEach((input, index) => {
       
        input.addEventListener('input', (e) => {
          
            if (e.target.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        // Handle Backspace
        input.addEventListener('keydown', (e) => {
        
            if (e.key === 'Backspace' && index > 0) {
                if (e.target.value === '') {
                    inputs[index - 1].focus();
                }
            }
        });
        
        // Handle Paste 
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasteData = e.clipboardData.getData('text').slice(0, 6); // Get first 6 chars
            if (!/^\d+$/.test(pasteData)) return; // Only allow numbers

            pasteData.split('').forEach((char, i) => {
                if (inputs[i]) inputs[i].value = char;
            });
            // Focus on the last filled input or the next empty one
            const lastIndex = Math.min(pasteData.length, inputs.length) - 1;
            if (lastIndex >= 0) inputs[lastIndex].focus();
        });
    });








