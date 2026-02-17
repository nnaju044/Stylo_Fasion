document.addEventListener("click", function (e) {

    const toggleBtn = e.target.closest(".toggle-password");
    if (!toggleBtn) return;

    const wrapper = toggleBtn.closest(".password-wrapper");
    const input = wrapper.querySelector(".password-input");
    const icon = toggleBtn.querySelector("i");

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
});
