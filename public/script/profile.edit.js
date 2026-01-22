function openEditProfileModal() {
  document.getElementById("editProfileModal").classList.remove("hidden");
}
function closeModal() {
  document.getElementById("editProfileModal").classList.add("hidden");
}

/* -------------------- FOR OPEN GET OTP -------------------- */

function sendOTP(type) {
  const section = type === "email" ? "emailOtpSection" : "phoneOtpSection";
  document.getElementById(section).style.display = "block";

  // Send OTP request
  fetch("/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: type }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("OTP sent successfully!");
      }
    });
}

/* -------------------- FOR UPDATE NAME -------------------- */

document.getElementById("saveNameBtn")?.addEventListener("click", async () => {

  try {
    console.log("name and sec",firstName,lastName)
    await axios.post("/user/profile/name", {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim()
    });

    Swal.fire("Success", "Name updated successfully", "success");
  } catch (err) {
    Swal.fire("Error", "Failed to update name", "error");
  }
});
