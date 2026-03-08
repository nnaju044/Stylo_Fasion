document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("searchInput");

  if (!searchInput) return;

  searchInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
      const value = this.value.trim();

      if (!value) return;

      window.location.href = `/user/search?q=${encodeURIComponent(value)}`;
    }

  });

});