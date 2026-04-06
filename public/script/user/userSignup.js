const signupForm = document.getElementById("signupForm");

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

if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
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

    if (firstName) firstName.addEventListener("input", function () {
        if (firstName.value.trim() !== "") firstNameError.innerText = "";
    });

    if (lastName) lastName.addEventListener("input", function () {
        if (lastName.value.trim() !== "") lastNameError.innerText = "";
    });

    if (email) email.addEventListener("input", function () {
        if (email.value.trim() !== "") emailError.innerText = "";
    });

    if (phone) phone.addEventListener("input", function () {
        if (phone.value.trim() !== "") phoneError.innerText = "";
    });

    if (password) password.addEventListener("input", function () {
        if (password.value.trim() !== "") passwordError.innerText = "";
    });

    if (confirmPassword) confirmPassword.addEventListener("input", function () {
        if (confirmPassword.value.trim() !== "") confirmPasswordError.innerText = "";
    });
}
