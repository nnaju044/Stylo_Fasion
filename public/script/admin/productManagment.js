
let deleteProductId = null;
let selectedSizes = [];
let productData = {
  category: "",
  name: "",
  description: "",
  isActive: true,
};

let variants = [];



let cropper = null;
let currentFile = null;



document.addEventListener("DOMContentLoaded", () => {
  loadCategoryDropdown("filterCategory");
  loadMaterialDropdown("filterMaterial");
});

/* -------------------- Add Product -------------------- */

function openAddProductModal() {
  headName.innerText = "Add product ";
  modalBtn.innerText = "Add ";
  document.getElementById("productMode").value = "add";
  document.getElementById("productId").value = "";

  loadCategoryDropdown("category");

  resetProductForm();
  openModal();
}

function handleAddProductError(err) {
  const message = err.response?.data?.message || "Something went wrong";

  if (err.response) {
    Swal.fire("error", message, "error");
  } else {
    Swal.fire("error", err.message, "error");
  }
}

function validateProductForm() {
  clearErrors();

  const categoryEl = document.getElementById("category");
  const nameEl = document.getElementById("productName");
  const descEl = document.getElementById("description");
  const statusEl = document.getElementById("statusToggle");

  const formData = {
    category: categoryEl?.value || "",
    name: nameEl?.value || "",
    description: descEl?.value || "",
    isActive: statusEl?.checked || true,
  };

  const result = productSchema.safeParse(formData);

  if (!result.success) {
    result.error.issues.forEach((err) => {
      const field = err.path[0];
      const errorEl = document.getElementById(field + "Error");
      if (errorEl) errorEl.innerText = err.message;
    });
    return null;
  }

  return formData;
}

async function addProduct() {
  try {
    console.log("step 1 ");
    const validated = validateProductAndVariantsFrontend();
    console.log("step 2 ",validated);

    const fd = buildProductFormData(validated);
    console.log("step 3 ",fd);

    const mode = document.getElementById("productMode").value;
    const productId = document.getElementById("productId").value;
    console.log("step 4 ",mode,"and",productId);

    if (mode === "add") {
      console.log("step 5 ","add");
      await axios.post("/admin/products", fd);
      Swal.fire("Success", "Product added successfully", "success");
      location.reload();
    } else {
      console.log("step 6 ","edit");
      await axios.put(`/admin/products/${productId}`, fd);
      Swal.fire("Success", "Product updated successfully", "success");
      location.reload();
    }

    closeModal();
    location.reload();
  } catch (error) {
    console.log("error found in add product ", error);

    handleAddProductError(error);
  }
}

function renderImagePreviews() {
  const container = document.getElementById("imagePreviewContainer");
  container.innerHTML = "";

  selectedImages.forEach((file, index) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.width = "80px";
    img.style.height = "80px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "8px";
    img.style.cursor = "pointer";

    img.onclick = () => {
      selectedImages.splice(index, 1);
      renderImagePreviews();
      validateImages();
    };

    container.appendChild(img);
  });
}

function generateSKU(productName, metal, size) {
  if (!productName || !metal || !size) return "";

  return (
    productName
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "-")
      .replace(/[^A-Z0-9-]/g, "") +
    "-" +
    metal.toUpperCase().replace(/\s+/g, "-") +
    "-" +
    size
  );
}

function validateProductAndVariantsFrontend() {
  const product = {
    category: category.value?.trim(),
    name: productName.value?.trim(),
    description: description.value?.trim(),
    isActive: statusToggle.checked,
  };

  if (!product.category) {
    categoryError.innerText = "Please select a category";
  }

  if (!product.name || product.name.length < 2) {
    nameError.innerText = "Product name is required";
  }

  if (!product.description || product.description.length < 5) {
    descriptionError.innerText = "Product description is required";
  }

  if (!variants || variants.length === 0) {
    Swal.fire("error", "Please add at least one variant", "error");
  }

  variants.forEach((v, i) => {
    if (!v.metal) {
      Swal.fire("error", `Variant ${i + 1}: Metal is required`, "error");
    }

    if (!v.sizes || v.sizes.length === 0) {
      Swal.fire(
        "error",
        `Variant ${i + 1}: Size must be greater than 0`,
        "error",
      );
    }

    if (!v.price || Number(v.price) <= 0) {
      Swal.fire(
        "error",
        `Variant ${i + 1}: Price must be greater than 0`,
        "error",
      );
    }

    const totalStock = v.sizes.reduce((sum, s) => sum + s.stock, 0);

if (totalStock <= 0) {
  Swal.fire("error", `Variant ${i + 1}: Stock must be greater than 0`, "error");
}

if(v.sizes?.stock <= 0){
  Swal.fire("error", `Enter a valid stock`, "error");
}

    if (!v.images || v.images.length < 3) {
      Swal.fire(
        "error",
        `Variant ${i + 1}: Minimum 3 images required`,
        "error",
      );
    }
  });


  return { product, variants };
}

/* -------------------- Edit Product -------------------- */

async function openEditProductModal(id) {
  headName.innerText = "Edit product";
  modalBtn.innerText = "Edit ";
  document.getElementById("productMode").value = "edit";
  document.getElementById("productId").value = id;

  const { data } = await axios.get(`/admin/products/${id}`);

  loadCategoryDropdown("category", data.product.categoryId?._id || data.product.categoryId);

  console.log("data from edit modal",data);
  fillProductForm(data.product);
 variants = data.variants.map((v) => ({
  tempId: crypto.randomUUID(),
  _id: v._id,
  metal: v.metal,
  price: Number(v.price),
  sizes: v.sizes || [],
  skus: v.skus || [],
  images: v.images,
  isExisting: true,
}));
  

  renderVariantCards();
  openModal();
}

function fillProductForm(product) {

  console.log("fillProductForm", product);

  const categoryEl = document.getElementById("category");
  const nameEl = document.getElementById("productName");
  const descEl = document.getElementById("description");
  const statusEl = document.getElementById("statusToggle");

  if (categoryEl) {
    categoryEl.value = product.categoryId?._id || product.categoryId || "";
  }

  if (nameEl) nameEl.value = product.name || "";
  if (descEl) descEl.value = product.description || "";
  if (statusEl) statusEl.checked = product.isActive ?? true;

}

function renderVariantCards() {
  const container = document.getElementById("variantList");
  container.innerHTML = "";

  variants.forEach((variant) => {
    const card = document.createElement("div");

    card.style.border = "1px solid #e5e7eb";
    card.style.borderRadius = "8px";
    card.style.padding = "12px";
    card.style.marginBottom = "12px";
    card.style.display = "flex";
    card.style.gap = "12px";
    card.style.alignItems = "center";

    const img = document.createElement("img");
    img.src = variant.images?.[0]
      ? variant.isExisting
        ? variant.images[0]
        : URL.createObjectURL(variant.images[0])
      : "";
    img.style.width = "60px";
    img.style.height = "60px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "6px";

    const info = document.createElement("div");
    info.innerHTML = `
      <div style="font-weight:600;">
        ${variant.metal} 
      </div>
      <div style="font-size:13px;color:#6b7280;">
        SKU: ${variant.sizes.map(s => s.sku).join(", ")}
      </div>
     <div style="font-size:13px;">
  ₹${variant.price}
</div>

<div style="font-size:13px;">
  Sizes:
  ${variant.sizes.map(s => `${s.size}(${s.stock})`).join(", ")}
</div>

<div style="font-size:13px;">
  Total Stock:
  ${variant.sizes.reduce((sum,s)=>sum+s.stock,0)}
</div>
    `;

    const actions = document.createElement("div");
    actions.style.marginLeft = "auto";

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "Remove";
    removeBtn.onclick = () => {
      variants = variants.filter((v) => v.tempId !== variant.tempId);
      renderVariantCards();
    };

    

    actions.appendChild(removeBtn);

    card.appendChild(img);
    card.appendChild(info);
    card.appendChild(actions);

    container.appendChild(card);
  });
}

function clearErrors() {
  [
    "categoryError",
    "metalError",
    "nameError",
    "descriptionError",
    "imageError",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerText = "";
  });
}

/* -------------------- Delete Product -------------------- */

function openDeleteProductModal(id) {
  deleteProductId = id;
  document.getElementById("deleteModalOverlay").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeDeleteModal() {
  document.getElementById("deleteModalOverlay").style.display = "none";
  document.body.style.overflow = "";
}

async function confirmDeleteProduct() {
  try {
    await axios.delete(`/admin/products/${deleteProductId}`);

    Swal.fire("Deleted", "Product removed successfully", "success");

    closeDeleteModal();
    location.reload();
  } catch (error) {
    Swal.fire(
      "Error",
      error.response?.data?.message || "Server error",
      "error",
    );
  }
}

/* --------------------  Variant Modal -------------------- */

function openVariantModal() {
  editingVariantId = null;
  clearVariantForm();

  loadMaterialDropdown("variantMetal");

  document.getElementById("variantModalTitle").innerText = "Add Variant";
  document.getElementById("variantModalOverlay").style.display = "flex";
}

function clearVariantForm() {
  document.getElementById("variantMetal").value = "";
  document.getElementById("variantSize").value = "";
  document.getElementById("variantPrice").value = "";
  document.getElementById("sizeStockInput").value = "";

  selectedSizes = [];
  renderSelectedSizes();

  variantImages = [];
  renderVariantImagePreview();

  [
    variantMetalError,
    variantSizeError,
    variantPriceError,
    variantImageError,
  ].forEach((e) => (e.innerText = ""));
}

function renderVariantImagePreview() {
  const container = document.getElementById("variantImagePreview");
  if (!container) return;
  container.innerHTML = "";

  variantImages.forEach((file, i) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.width = "60px";
    img.style.height = "60px";
    img.style.objectFit = "cover";
    img.onclick = () => {
      variantImages.splice(i, 1);
      renderVariantImagePreview();
      validateImages();
    };

    container.appendChild(img);
  });
}

function closeVariantModal() {
  document.getElementById("variantModalOverlay").style.display = "none";
}

function validateVariant() {
  let valid = true;

  if (!variantMetal.value) {
    variantMetalError.innerText = "Metal required";
    valid = false;
  }


  if (!variantPrice.value) {
    variantPriceError.innerText = "Price required";
    valid = false;
  }

  if (selectedSizes.length === 0) {
  variantSizeError.innerText = "Add at least one size";
  valid = false;
}

  if (variantImages.length < 3) {
    variantImageError.innerText = "Minimum 3 images required";
    valid = false;
  }

  return valid;
}

function saveVariant() {

  if (!validateVariant()) {
    Swal.fire("error", "Invalid data", "error");
    return;
  }

  const metalName =
    variantMetal.options[variantMetal.selectedIndex].text;

   const sizesWithSKU = selectedSizes.map(s => ({
  size: s.size,
  stock: s.stock,
  sku: generateSKU(productName.value, metalName, s.size)
}));

  const variant = {
    tempId: crypto.randomUUID(),
    metal: metalName,
    price: Number(variantPrice.value),
    sizes: sizesWithSKU,
    images: [...variantImages],
    isExisting: false,
  };

  variants.push(variant);

  renderVariantCards();
  closeVariantModal();
}

/* --------------------  Image upload -------------------- */

function handleImageUpload(input) {
  const file = input.files[0];
  if (!file) return;

  currentFile = file;

  const reader = new FileReader();
  reader.onload = () => {
    openCropper(reader.result);
  };
  reader.readAsDataURL(file);

  input.value = "";
}

function validateImages() {
  const err = document.getElementById("imageError");

  if (variantImages.length < 3) {
    err.innerText = "Minimum 3 images required";
    return false;
  }

  err.innerText = "";
  return true;
}

function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();

  const file = event.dataTransfer.files[0];
  if (!file) return;

  currentFile = file;
  const reader = new FileReader();
  reader.onload = () => {
    openCropper(reader.result);
  };
  reader.readAsDataURL(file);
}

/* --------------------  Size upload -------------------- */


function addSizeWithStock() {

  const size = document.getElementById("variantSize").value;
  const stock = document.getElementById("sizeStockInput").value;

  if (!size) {
    variantSizeError.innerText = "Please select a size";
    return;
  }

  if (!stock || Number(stock) < 0) {
    variantSizeError.innerText = "Enter valid quantity";
    return;
  }

  // Prevent duplicate size
  if (selectedSizes.some(s => s.size == size)) {
    variantSizeError.innerText = "Size already added";
    return;
  }

  selectedSizes.push({
    size: Number(size),
    stock: Number(stock)
  });

  renderSelectedSizes();

  // Reset inputs
  document.getElementById("variantSize").value = "";
  document.getElementById("sizeStockInput").value = "";
  variantSizeError.innerText = "";
}

function renderSelectedSizes() {
  const container = document.getElementById("selectedSizesContainer");
  container.innerHTML = "";

  selectedSizes.forEach((item, index) => {

    const chip = document.createElement("div");

    chip.style.cssText = `
      display:flex;
      align-items:center;
      gap:6px;
      padding:6px 12px;
      background:#7c2d12;
      color:white;
      border-radius:20px;
      font-size:13px;
    `;

    chip.innerHTML = `
      ${item.size} (Qty: ${item.stock})
      <span style="cursor:pointer;font-weight:bold;"
            onclick="removeSize(${index})">×</span>
    `;

    container.appendChild(chip);
  });
}

function removeSize(index) {
  selectedSizes.splice(index, 1);
  renderSelectedSizes();
};

/* --------------------  Comon  -------------------- */

async function loadCategoryDropdown(selectId, selectedVal = "") {
  try {
    const res = await axios.get("/admin/api/categories");

    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = `<option value="">Select category</option>`;
    const categories = res.data?.categories || [];
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat._id;
      option.textContent = cat.name;

      if (cat._id === selectedVal) {
        option.selected = true;
      }
      select.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}

function openModal() {
  document.getElementById("productModalOverlay").style.display = "flex";
  document.getElementById("body").style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("productModalOverlay").style.display = "none";
  document.getElementById("body").style.overflow = "";
}

function cancelForm() {
  closeModal();
}

function resetProductForm() {
  const categoryEl = document.getElementById("category");
  const nameEl = document.getElementById("productName");
  const descEl = document.getElementById("description");
  const statusEl = document.getElementById("statusToggle");

  if (categoryEl) categoryEl.value = "";
  if (nameEl) nameEl.value = "";
  if (descEl) descEl.value = "";
  if (statusEl) statusEl.checked = true;

  variants = [];
}

function buildProductFormData({ product, variants }) {
  const fd = new FormData();

  fd.append(
    "data",
    JSON.stringify({
      product,
      variants,
    }),
  );

  // Append images keyed by variant position in the variants array
  variants.forEach((variant, idx) => {
    if (!variant.isExisting && variant.images && variant.images.length > 0) {
      variant.images.forEach((img) => {
        fd.append(`variantImages_${idx}`, img);
      });
    }
  });

  return fd;
}

function removeImage(index) {
  selectedImages.splice(index, 1);
  renderImagePreviews();
  validateImages();
}

async function handleCroppedImage(blob) {
  const croppedFile = new File([blob], "cropped.jpg", {
    type: "image/jpeg",
  });

  selectedImages.push(croppedFile);
  renderImagePreviews();
  validateImages();
}

function openCropper(imageSrc) {
  if (typeof Cropper === "undefined") {
    console.error("CropperJS not loaded");
    return;
  }

  document.getElementById("cropperOverlay").style.display = "flex";

  const img = document.getElementById("cropperImage");
  img.src = imageSrc;

  if (cropper) cropper.destroy();

  cropper = new Cropper(img, {
    aspectRatio: 1,
    viewMode: 1,
    autoCropArea: 1,
    responsive: true,
  });
}

function cancelCrop() {
  closeCropper();
}

function closeCropper() {
  document.getElementById("cropperOverlay").style.display = "none";
  if (cropper) cropper.destroy();
  cropper = null;
}

function confirmCrop() {
  if (!cropper) return;

  cropper
    .getCroppedCanvas({
      width: 800,
      height: 800,
      imageSmoothingQuality: "high",
    })
    .toBlob((blob) => {
      const croppedFile = new File([blob], currentFile.name, {
        type: "image/jpeg",
      });

      variantImages.push(croppedFile);

      closeCropper();
      renderVariantImagePreview();
    });
}

async function loadMaterialDropdown(selectId, selectedValue = "") {
  try {
    const { data } = await axios.get("/admin/api/materials");

    const select = document.getElementById(selectId);
    select.innerHTML = `<option value="">Select Metal</option>`;

    data.materials.forEach((mat) => {
      const option = document.createElement("option");
      option.value = mat._id;
      option.textContent = mat.name;

      if (mat._id === selectedValue) {
        option.selected = true;
      }

      select.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}

/* --------------------  SEARCH BAR  -------------------- */

let currentPage = 1;
let currentKeyword = "";

const searhInput = document.getElementById("productSearchInput");
const clearBtn = document.getElementById("clearProductSearchBtn");
const tableBody = document.getElementById("productTableBody");

let debounceTimer;

function handleProductSearch(value) {
  clearTimeout(debounceTimer);

   if (value.trim()) {
    clearBtn.classList.remove("hidden");
  } else {
    clearBtn.classList.add("hidden");
  }

  debounceTimer = setTimeout(async () => {
    fetchProducts(value,1);
  }, 500);
}

function renderProducts(products) {
    const tableBody = document.getElementById("productTableBody");
    tableBody.innerHTML = "";

     if (!products.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-6 text-gray-500">
          No products found
        </td>
      </tr>
    `;
    return;
  }

    products.forEach(product => {
        const categoryName = product.categoryId?.name ;
        const totalStock = product.totalStock ;
        const minPrice = product.minPrice;
        const maxPrice = product.maxPrice ;
        const previewImage = product.previewImage;

        tableBody.innerHTML += `<tr class="hover:bg-gray-50 transition-colors">

            <!-- Product -->
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">

                        ${
                            previewImage
                            ? `<img src="${previewImage}" class="w-full h-full object-cover rounded-lg" />`
                            : `<i class="fas fa-image text-gray-400 text-xl"></i>`
                        }

                    </div>

                    <div class="font-medium text-gray-900">
                        ${product.name}
                    </div>
                </div>
            </td>

            <!-- Category -->
            <td class="px-6 py-4 text-red-900">
                ${categoryName}
            </td>

            <!-- Price -->
            <td class="px-6 py-4 font-medium">
                ${
                    minPrice === maxPrice
                    ? `₹${minPrice}`
                    : `₹${minPrice} – ₹${maxPrice}`
                }
            </td>

            <!-- Stock -->
            <td class="px-6 py-4">
                ${totalStock}
            </td>

            <!-- Status -->
            <td class="px-6 py-4">
                ${
                    totalStock > 0
                    ? `<span class="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Available
                       </span>`
                    : `<span class="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Out of Stock
                       </span>`
                }
            </td>

            <!-- Actions -->
            <td class="px-6 py-4">
                <div class="flex gap-3">
                    <button onclick="openEditProductModal('${product._id}')"
                        class="text-red-900 hover:text-red-700" type="button">
                        <i class="fas fa-edit"></i>
                    </button>

                    <button onclick="openDeleteProductModal('${product._id}')"
                        class="text-red-900 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>

        </tr>`;
    })
}

function clearProductSearch() {
  searhInput.value ="";
  clearBtn.classList.add("hidden");
  fetchProducts("",1);
};

async function fetchProducts(keyword = "",page = 1) {
    try {
        currentKeyword = keyword;
        currentPage = page;

        const res = await axios.get("/admin/product-managment",{
            params:{q:keyword,page:page},
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });
        renderProducts(res.data.products);
        renderPagination(res.data.totalPages,res.data.currentPage)
        
    } catch (error) {
            console.error("fetchProducts error", error);

    }
};

 function renderPagination(totalPages,currentPage){
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    if(!totalPages || totalPages <=1) return;

    if(currentPage > 1) {
        pagination.innerHTML +=`
        <button onclick="fetchProducts('${currentKeyword}', ${currentPage - 1})"
        class="px-3 py-1 border rounded">Prev</button>
        `;
    }

    for(let i=1;i <= totalPages; i++) {
        pagination.innerHTML +=`
        <button onclick="fetchProducts('${currentKeyword}', ${i})"
        class="px-3 py-1 border rounded ${
          i === currentPage ? "bg-red-600 text-white" : ""
        }">
        ${i}
      </button>
        `;
    }

    if(currentPage < totalPages) {
        pagination.innerHTML +=`
        <button onclick="fetchProducts('${currentKeyword}', ${currentPage + 1})"
        class="px-3 py-1 border rounded">Next</button>
        `
    }
}

fetchProducts("",1);
