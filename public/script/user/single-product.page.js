let selectedSize = null;
let selectedMetal = null;
let currentVariant = null;
const variants = window.variants;

document.addEventListener("DOMContentLoaded", () => {
  // Initialize first variant
  if (variants.length) {
    const first = variants[0];
    selectedMetal = first.metal;
    currentVariant = first;

    document
      .querySelector(`.material-btn[data-metal="${first.metal}"]`)
      ?.classList.add("active");

    document.getElementById("mainImage").src = first.images[0];
    document.getElementById("productPrice").innerHTML = "₹" + first.price;

    renderSizes();
  }

  // Size button click handlers
  document.querySelectorAll(".sizeBtn").forEach((btn) => {
    btn.addEventListener("click", function () {
      console.log("size btn worked");

      document
        .querySelectorAll(".sizeBtn")
        .forEach((b) => b.classList.remove("active"));

      this.classList.add("active");
      selectedSize = this.dataset.size;
      updateVariant();
    });
  });

  // Material button click handlers
  document.querySelectorAll(".material-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      console.log("material btn working");

      document
        .querySelectorAll(".material-btn")
        .forEach((b) => b.classList.remove("active"));

      this.classList.add("active");
      selectedMetal = this.dataset.metal;

      currentVariant = variants.find((v) => v.metal === selectedMetal);

      if (!currentVariant) return;

      document.getElementById("mainImage").src = currentVariant.images[0];
      document.getElementById("productPrice").innerHTML =
        "₹" + currentVariant.price;

      renderSizes();
    });
  });
});

function updateVariant() {
  let variant = variants.find(
    (v) =>
      v.metal === selectedMetal &&
      (!selectedSize || v.sizes?.size == selectedSize),
  );

  if (!variant) {
    variant = variants.find((v) => v.metal === selectedMetal);
  }

  if (!variant) return;

  document.getElementById("productPrice").innerHTML = "₹" + variant.price;

  document.getElementById("mainImage").src = variant.images[0];
}

function getSelectedSKU() {
  if (!currentVariant || !selectedSize) return null;

  const sizeObj = currentVariant.sizes.find((s) => s.size == selectedSize);

  return sizeObj?.sku;
}

function renderSizes() {
  if (!currentVariant || !currentVariant.sizes) return;

  const availableSizes = currentVariant.sizes.map((s) => s.size.toString());

  document.querySelectorAll(".sizeBtn").forEach((btn) => {
    const size = btn.dataset.size;
    if (availableSizes.includes(size)) {
      btn.disabled = false;
      btn.classList.remove("opacity-50", "cursor-not-allowed");
      btn.classList.add("hover:border-red-900", "hover:text-red-900");
    } else {
      btn.disabled = true;
      btn.classList.add("opacity-50", "cursor-not-allowed");
      btn.classList.remove(
        "hover:border-red-900",
        "hover:text-red-900",
        "active",
      );
    }
  });

  // If selected size is not available, reset it
  if (selectedSize && !availableSizes.includes(selectedSize.toString())) {
    selectedSize = null;
    document
      .querySelectorAll(".sizeBtn")
      .forEach((b) => b.classList.remove("active"));
  }

  const images = currentVariant.images;

  const container = document.getElementById("thumbnailContainer");

  container.innerHTML = "";

  images.forEach((img) => {
    const div = document.createElement("div");

    div.className =
      "thumbnail w-20 h-20 rounded-lg overflow-hidden cursor-pointer";

    div.innerHTML = `<img src="${img}" class="w-full h-full object-cover">`;

    div.onclick = () => {
      changeMainImage(img, div);
    };

    container.appendChild(div);
  });

  document.getElementById("mainImage").src = currentVariant.images[0];

  // Rebuild gallery with all variant images
  rebuildGallery(images);
}

function rebuildGallery(images) {
  const gallery = document.getElementById("gallery");
  
  gallery.innerHTML = "";

  images.forEach((img) => {
    const link = document.createElement("a");
    link.href = img;
    link.setAttribute("data-pswp-width", "1600");
    link.setAttribute("data-pswp-height", "1600");
    link.target = "_blank";
    
    const imgElement = document.createElement("img");
    imgElement.src = img;
    imgElement.alt = "Product image";
    imgElement.className = "hidden";
    
    link.appendChild(imgElement);
    gallery.appendChild(link);
  });

  // Reinitialize PhotoSwipe with new images
  if (window.lightbox) {
    window.lightbox.destroy();
  }

  window.lightbox = new PhotoSwipeLightbox({
    gallery: "#gallery",
    children: "a",
    pswpModule: () =>
      import("https://unpkg.com/photoswipe@5/dist/photoswipe.esm.js"),
  });

  window.lightbox.init();
}

// Quantity controls
function increaseQty() {
  const input = document.getElementById("quantity");
  input.value = parseInt(input.value) + 1;
}

function decreaseQty() {
  const input = document.getElementById("quantity");
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
  }
}

// Zoom function to open lightbox at current image
function zoomImage() {
  const mainImage = document.getElementById("mainImage");
  const gallery = document.getElementById("gallery");
  const allLinks = gallery.querySelectorAll("a");

  // Find the link that matches the current main image
  let targetIndex = 0;
  allLinks.forEach((link, index) => {
    if (link.href === mainImage.src || link.href.includes(mainImage.src)) {
      targetIndex = index;
    }
  });

  if (window.lightbox && allLinks.length > 0) {
    window.lightbox.loadAndOpen(targetIndex);
  }
}

function changeMainImage(src, el){
    const mainImage = document.getElementById("mainImage");
    const allLinks = document.querySelectorAll("#gallery a");

    mainImage.src = src;

    // Find and focus the matching gallery link
    allLinks.forEach(link => {
        if (link.href === src || link.href.includes(src)) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    document.querySelectorAll(".thumbnail")
        .forEach(t => t.classList.remove("active"));

    el.classList.add("active");
}
