
let selectedSize = null;
let selectedMetal = null;
let selectedSKU = null;
let currentVariant = null;
const variants = window.variants;

document.addEventListener("DOMContentLoaded", async () => {

  

  // ================== VARIANT INIT ==================
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
  
  // ================== FAVORITES ==================
const favButtons = document.querySelectorAll(".fav-btn");

if (favButtons.length) {

  let favoriteCache = new Set();

  try {
    const res = await axios.get("/user/api/favorites");

    const favorites = res.data?.favorites || [];

    favoriteCache = new Set(
      favorites.map(item => item._id.toString())
    );

    favButtons.forEach(btn => {
      if (favoriteCache.has(btn.dataset.id)) {
        btn.classList.add("active");
      }
    });

  } catch (err) {
    console.error("Error loading favorites:", err);
  }

  // TOGGLE
  favButtons.forEach(btn => {
    btn.addEventListener("click", async () => {

      const productId = btn.dataset.id;

       if (btn.dataset.loading === "true") return;

           btn.dataset.loading = "true";

      try {
        btn.disabled = true;

        const res = await axios.post(`/user/api/favorites/${productId}`);

        const isFav = res.data.isFavorite;

        btn.classList.toggle("active", isFav);

        if (isFav) {
          favoriteCache.add(productId);
        } else {
          favoriteCache.delete(productId);
        }

      } catch (err) {
        console.error("Toggle error:", err);
      } finally {
        btn.disabled = false;
      }

    });
  });

}

  // ================== SIZE BUTTON ==================
 document.querySelectorAll(".sizeBtn").forEach(btn => {
  btn.addEventListener("click", function () {

    // remove active
    document.querySelectorAll(".sizeBtn")
      .forEach(b => b.classList.remove("border-red-900", "text-red-900"));

    // add active
    this.classList.add("border-red-900", "text-red-900");

    selectedSize = this.dataset.size === "Free size"
      ? 1
      : Number(this.dataset.size);

      const sizeObj = currentVariant?.sizes.find(s => s.size == selectedSize);
selectedSKU = sizeObj?.sku || null;

    updateVariant();
  });
});

  // ================== MATERIAL BUTTON ==================
 document.querySelectorAll(".material-btn").forEach(btn => {
  btn.addEventListener("click", function () {

    document.querySelectorAll(".material-btn")
      .forEach(b => b.classList.remove("active"));

    this.classList.add("active");

    selectedMetal = this.dataset.metal;
    selectedSize = null;
selectedSKU = null;

    updateVariant();
  });
});

});

function updateVariant() {

  if(!selectedMetal) return;

  let variant = variants.find((v) => v.metal === selectedMetal);

  if (!variant) return;

  currentVariant = variant;

  document.getElementById("productPrice").innerHTML = "₹" + variant.price;

  // document.getElementById("mainImage").src = variant.images[0];

  renderSizes();

  if(selectedSize){
    const sizeObj = variant.sizes.find(s => s.size == selectedSize);
    selectedSKU = sizeObj?.sku || null;
  }
    console.log("Selected SKU:", selectedSKU);
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
    const size = Number(btn.dataset.size);
    if (availableSizes.includes(size.toString())) {
      btn.disabled = false;
      btn.classList.remove("opacity-50", "cursor-not-allowed");
      btn.classList.add("hover:border-red-900", "hover:text-red-900");
    } else {
      btn.disabled = true;
      btn.classList.add("opacity-50", "cursor-not-allowed");
      btn.classList.remove(
        "hover:border-red-900",
        "hover:text-red-900",
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

  rebuildGallery(images);

  if (!selectedSize && currentVariant.sizes.length > 0) {

  const firstSize = currentVariant.sizes[0].size;
  selectedSize = firstSize;

  const sizeObj = currentVariant.sizes.find(s => s.size == firstSize);
  selectedSKU = sizeObj?.sku;

  document.querySelectorAll(".sizeBtn").forEach(btn => {
    if (Number(btn.dataset.size) === firstSize) {
      btn.classList.add("border-red-900", "text-red-900");
    }
  });
}
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

async function addToCart() {

  if (!selectedSKU) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Please select size and material"
    });
    return;
  }

  const qty = Number(document.getElementById("quantity").value);

  if (qty <= 0) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Please select a valid quantity"
    });
    return;
  }

  try {
    const res = await axios.post('/user/cart/add', {
      sku: selectedSKU,
      qty
    });

    if (res.data.success) {
      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `✓ Added ${res.data.qty || qty} item(s) to cart`,
        timer: 2000,
        showConfirmButton: false
      });
      
      document.getElementById("quantity").value = 1;
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: res.data.message || "Failed to add to cart"
      });
    }
  } catch (error) {
    console.error("Cart error:", error);
    const message = error.response?.data?.message || "Failed to add to cart. Please try again.";
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message
    });
  }
}

