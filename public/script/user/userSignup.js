const signupForm = document.getElementById("signupForm");


    signupForm.addEventListener("submit", function (e) {

        const firstName = document.getElementById("firstName");
        const lastName = document.getElementById("lastName");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirmPassword");

        const firstNameError = document.getElementById("firstNameError");
        const lastNameError = document.getElementById("lastNameError");
        const emailError = document.getElementById("emailError");
        const phoneError = document.getElementById("phoneError");
        const passwordError = document.getElementById("passwordError");
        const confirmPasswordError = document.getElementById("confirmPasswordError");

        // Clear old errors
        firstNameError.innerText = "";
        lastNameError.innerText = "";
        emailError.innerText = "";
        phoneError.innerText = "";
        passwordError.innerText = "";
        confirmPasswordError.innerText = "";

        let isValid = true;

        if (!firstName.value.trim()) {
            firstNameError.innerText = "First name required";
            isValid = false;
        }

        if (!lastName.value.trim()) {
            lastNameError.innerText = "Last name required";
            isValid = false;
        }

        if (!email.value.trim()) {
            emailError.innerText = "Email required";
            isValid = false;
        }

        if (!phone.value.trim()) {
            phoneError.innerText = "Phone number required";
            isValid = false;
        }

        if (!password.value.trim()) {
            passwordError.innerText = "Password required";
            isValid = false;
        }

        if (password.value !== confirmPassword.value) {
            confirmPasswordError.innerText = "Passwords do not match";
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault();
        }

    });

    firstName.addEventListener("input", function () {
  if (firstName.value.trim() !== "") {
    firstNameError.classList.add("hidden");
  }
});

  lastName.addEventListener("input", function () {
  if (lastName.value.trim() !== "") {
    lastNameError.classList.add("hidden");
  }
});

  email.addEventListener("input", function () {
  if (email.value.trim() !== "") {
    emailError.classList.add("hidden");
  }
});

  phone.addEventListener("input", function () {
  if (phone.value.trim() !== "") {
    phoneError.classList.add("hidden");
  }
});

  password.addEventListener("input", function () {
  if (password.value.trim() !== "") {
    passwordError.classList.add("hidden");
  }
});

  firstName.addEventListener("input", function () {
  if (firstName.value.trim() !== "") {
    firstNameError.classList.add("hidden");
  }
});

  
