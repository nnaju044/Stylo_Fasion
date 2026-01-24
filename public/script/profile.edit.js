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



/* -------------------- FOR UPDATE NAME -------------------- */

function saveNameBtn() {
  (async () => {
    try {
      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();

      if (!firstName || !lastName) {
        Swal.fire("Error", "Please fill in all fields", "error");
        return;
      }

      const response = await axios.patch("/user/profile/update-basic", {
        firstName,
        lastName,
      });

      Swal.fire("Success", "Name updated successfully", "success");
      console.log("Name updated:", response.data);
    } catch (err) {
      console.error("Error updating name:", err);
      const message = err?.response?.data?.message || "Failed to update name";
      Swal.fire("Error", message, "error");
    }
  })();
}


/* -------------------- FOR UPDATE EMAIL -------------------- */

const emailOtpBtn = document.getElementById("verifyEmailOtpBtn");
const emailInput = document.getElementById("email");
const emailOtpSection = document.getElementById("emailOtpSection");

emailOtpBtn?.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const email = emailInput.value.trim();

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
});





/* -------------------- FOR SUBMIT EMAIL -------------------- */

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




    /* -------------------- FOR VERIFY EMAIL -------------------- */

    function collectOtp(inputs) {
  return [...inputs].map(i => i.value).join("");
}


   const verifyOTP = async () =>{
        let otpValue = '';
        inputs.forEach(input => otpValue += input.value);

        // Check if user entered exactly 6 digits
        if (otpValue.length === 6) {
        
          const response = await axios.post('/')
            
            console.log("Verifying Code: " + otpValue);
            
            // Show the green check icon
            successIcon.style.display = 'block';
            
            // Optional: Disable inputs after success
            // inputs.forEach(input => input.disabled = true);
        } else {
            alert("Please enter a 6-digit code.");
            successIcon.style.display = 'none';
        }
    }



