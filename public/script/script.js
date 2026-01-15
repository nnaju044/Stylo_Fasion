// carousal
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.getElementById("heroCarousel");
  if (!hero) return; 

  const totalSlides = hero.children.length;
  let current = 0;

  function updateHero() {
    hero.style.transform = `translateX(-${current * 100}%)`;

    document.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("bg-white", i === current);
      dot.classList.toggle("bg-white/50", i !== current);
    });
  }

  function nextHero() {
    current = (current + 1) % totalSlides;
    updateHero();
  }

  function prevHero() {
    current = (current - 1 + totalSlides) % totalSlides;
    updateHero();
  }

  // expose for buttons
  window.nextHero = nextHero;
  window.prevHero = prevHero;

  // autoplay
  setInterval(nextHero, 5000);
});


// togglepassword
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");

  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
  });

