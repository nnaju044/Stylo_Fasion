
let productData = {
  category: '',
  name: '',
  description: '',
  isActive: true
};

let variants = [];             
let currentVariantIndex = null;    
let variantFormState = {
  metal: '',
  size: '',
  price: '',
  stock: '',
  images: []
};

let cropper = null;
let currentFile = null;
let cropMode = 'add-variant';  




document.addEventListener("DOMContentLoaded", () => {
  loadCategoryDropdown("filterCategory");
  loadMaterialDropdown("filterMaterial");
});

function clearErrors() {
  [
    "categoryError",
    "metalError",
    "nameError",
    "descriptionError",
    "imageError",
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerText = "";
  });
}


function validateProductForm() {
  clearErrors();

  const categoryEl = document.getElementById("category");
  const nameEl = document.getElementById("productName");
  const descEl = document.getElementById("description");
  const statusEl = document.getElementById("statusToggle");

  // Product fields only (metal is per-variant, not per-product)
  const formData = {
    category: categoryEl?.value || "",
    name: nameEl?.value || "",
    description: descEl?.value || "",
    isActive: statusEl?.checked || true,
  };
  

  console.log("productScema shape :",productSchema.shape)
  const result = productSchema.safeParse(formData);
  
  if (!result.success) {
    result.error.issues.forEach(err => {
      const field = err.path[0];
      const errorEl = document.getElementById(field + "Error");
      if (errorEl) errorEl.innerText = err.message;
    });
    return null;
  }

  
  return formData;
}

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

function openAddProductModal(){
    document.getElementById("productMode").value = "add";
    document.getElementById("productId").value = "";

    loadCategoryDropdown("category");

    resetProductForm();
    openModal();
}

async function openEditProductModal(id){
    document.getElementById("productMode").value = "edit";
    document.getElementById("productId").value = id;

    const {data} = await axios.get(`/admin/products/${id}`);

    loadCategoryDropdown("category", data.product.category);

    fillProductForm(data.product);
    openModal();
}


async function loadCategoryDropdown(selectId , selectedVal = ""){
   try {
     const res = await axios.get("/admin/api/categories");

    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = `<option value="">Select category</option>`;
    const categories = res.data?.categories || [];
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat._id;
        option.textContent = cat.name;

        if (cat._id === selectedVal) {
          option.selected = true;
        }
        select.appendChild(option);

    });
   } catch (error) {
    console.log(error)
    
   }
};

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
};

function fillProductForm(product) {
  const categoryEl = document.getElementById("category");
  const nameEl = document.getElementById("productName");
  const descEl = document.getElementById("description");
  const statusEl = document.getElementById("statusToggle");

  if (categoryEl) categoryEl.value = product.category || "";
  if (nameEl) nameEl.value = product.name || "";
  if (descEl) descEl.value = product.description || "";
  if (statusEl) statusEl.checked = product.isActive ?? true;
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
};

async function addProduct () {
    try {
        const validated = validateProductAndVariantsFrontend();

        console.log("validated :",validated);

        const fd = buildProductFormData(validated);
      
        console.log("FormData ready for submission");
        await axios.post("/admin/products", fd);

        
        Swal.fire("success", "product added successfully..", "success");

        closeModal();
        location.reload();

    } catch (error) {

        console.log("error found in add product ",error)

        handleAddProductError(error);
        
    }
};

function buildProductFormData({product,variants}) {
    const fd = new FormData();

    fd.append("data", JSON.stringify({product,variants}));

    variants.forEach((variant,idx) => {
        variant.images.forEach(img => {
            fd.append(`variantImages_${idx}`,img);
        });
    });
    return fd;
};

function handleAddProductError(err) {
    if(err.response) {
          alert(err.response.data.message || "Server error");
    }else{

        alert(err.message);
    }
}

function removeImage(index) {
  selectedImages.splice(index, 1);
  renderImagePreviews();
  validateImages();
};

async function handleCroppedImage(blob) {
  const croppedFile = new File([blob], "cropped.jpg", {
    type: "image/jpeg"
  });

  selectedImages.push(croppedFile);
  renderImagePreviews();
  validateImages();
};

function addSize() {
  const value = document.getElementById("sizeStock").value.trim();
  if (!value) return;

  sizes.push(value);
  document.getElementById("sizeStock").value = "";

  renderSizes();
};

function renderSizes() {
  const container = document.getElementById("sizeList");
  if (!container) return;
  container.innerHTML = "";

  sizes.forEach((size, i) => {
    const chip = document.createElement("div");
    chip.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background-color: #fef2f2;
      border: 1px solid #7c2d12;
      border-radius: 6px;
      color: #7c2d12;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    `;
    chip.innerText = size;
    
    chip.onmouseover = () => {
      chip.style.backgroundColor = "#fed7d7";
      chip.style.borderColor = "#991b1b";
    };
    
    chip.onmouseout = () => {
      chip.style.backgroundColor = "#fef2f2";
      chip.style.borderColor = "#7c2d12";
    };
    
    chip.onclick = () => {
      sizes.splice(i, 1);
      renderSizes();
    };
    
    container.appendChild(chip);
  });
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









function openVariantModal() {
  editingVariantId = null;
  clearVariantForm();

  loadMaterialDropdown("variantMetal");

  document.getElementById("variantModalTitle").innerText = "Add Variant";
  document.getElementById("variantModalOverlay").style.display = "flex";
}

function closeVariantModal() {
  document.getElementById("variantModalOverlay").style.display = "none";
}

function clearVariantForm() {
  variantMetal.value = "";
  variantSize.value = "";
  variantPrice.value = "";
  variantStock.value = "";

  variantImages = [];
  renderVariantImagePreview();

  [
    variantMetalError,
    variantSizeError,
    variantPriceError,
    variantStockError,
    variantImageError
  ].forEach(e => e.innerText = "");
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

function validateImages() {
  const err = document.getElementById("imageError");

  if (variantImages.length <= 3) {
    err.innerText = "Minimum 3 images required";
    return false;
  }

  err.innerText = "";
  return true;
}

function validateVariant() {
  let valid = true;

  if (!variantMetal.value) {
    variantMetalError.innerText = "Metal required";
    valid = false;
  }

  if (!variantSize.value) {
    variantSizeError.innerText = "Size required";
    valid = false;
  }

  if (!variantPrice.value) {
    variantPriceError.innerText = "Price required";
    valid = false;
  }

  if (!variantStock.value) {
    variantStockError.innerText = "Stock required";
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
    console.log("validateVariant error")
    return;
  }

  const metalName = variantMetal.options[variantMetal.selectedIndex].text;
  const sizeValue = variantSize.value;

  const sku = generateSKU(
    productName.value,
    metalName,
    sizeValue
  );


  const variant = {
    tempId: crypto.randomUUID(),   
    metal: metalName,        // Store metal ObjectId              // Store display name
    size: Number(sizeValue),                      // Convert to numeric ID (1-5)
    price: Number(variantPrice.value),
    stock: Number(variantStock.value),
    sku,
    images: [...variantImages]
  };

 
  
  variants.push(variant);
  console.log("variants pushed:",variants)
  renderVariantCards();
  closeVariantModal();
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


function renderVariantCards() {
  const container = document.getElementById("variantList");
  container.innerHTML = "";

  variants.forEach(variant => {
    const card = document.createElement("div");

    card.style.border = "1px solid #e5e7eb";
    card.style.borderRadius = "8px";
    card.style.padding = "12px";
    card.style.marginBottom = "12px";
    card.style.display = "flex";
    card.style.gap = "12px";
    card.style.alignItems = "center";

    
    const img = document.createElement("img");
    img.src = URL.createObjectURL(variant.images[0]);
    img.style.width = "60px";
    img.style.height = "60px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "6px";

    
    const info = document.createElement("div");
    info.innerHTML = `
      <div style="font-weight:600;">
        ${variant.metal} | Size ${variant.size}
      </div>
      <div style="font-size:13px;color:#6b7280;">
        SKU: ${variant.sku}
      </div>
      <div style="font-size:13px;">
        ₹${variant.price} | Stock: ${variant.stock}
      </div>
    `;

    
    const actions = document.createElement("div");
    actions.style.marginLeft = "auto";

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "Remove";
    removeBtn.onclick = () => {
      variants = variants.filter(v => v.tempId !== variant.tempId);
      renderVariantCards();
    };

    actions.appendChild(removeBtn);

    card.appendChild(img);
    card.appendChild(info);
    card.appendChild(actions);

    container.appendChild(card);
  });
}

function confirmCrop() {
  if (!cropper) return;

  cropper.getCroppedCanvas({
    width: 800,
    height: 800,
    imageSmoothingQuality: "high",
  }).toBlob(blob => {
    const croppedFile = new File(
      [blob],
      currentFile.name,
      { type: "image/jpeg" }
    );

    variantImages.push(croppedFile);

    closeCropper();
    renderVariantImagePreview();
  });
};

function validateProductAndVariantsFrontend() {
  const product = {
    category: category.value?.trim(),
    name: productName.value?.trim(),
    description: description.value?.trim(),
    isActive: statusToggle.checked
  };

  if (!product.category) {
    throw new Error("Please select a category");
  }

  if (!product.name || product.name.length < 2) {
    throw new Error("Product name is required");
  }

  if (!product.description || product.description.length < 5) {
    throw new Error("Product description is required");
  }

  if (!variants || variants.length === 0) {
    throw new Error("Please add at least one variant");
  }

  variants.forEach((v, i) => {
    if (!v.metal) {
      throw new Error(`Variant ${i + 1}: Metal is required`);
    }

    if (!v.size || Number(v.size) <= 0) {
      throw new Error(`Variant ${i + 1}: Size must be greater than 0`);
    }

    if (!v.price || Number(v.price) <= 0) {
      throw new Error(`Variant ${i + 1}: Price must be greater than 0`);
    }

    if (v.stock == null || Number(v.stock) < 0) {
      throw new Error(`Variant ${i + 1}: Stock cannot be negative`);
    }

    if (!v.sku) {
      throw new Error(`Variant ${i + 1}: SKU missing`);
    }

    if (!v.images || v.images.length < 3) {
      throw new Error(`Variant ${i + 1}: Minimum 3 images required`);
    }
  });

  console.log("varianrt from validation ",variants)

  return { product, variants };
}



async function loadMaterialDropdown(selectId, selectedValue = "") {
  try {
    const { data } = await axios.get("/admin/api/materials");

  const select = document.getElementById(selectId);
  select.innerHTML = `<option value="">Select Metal</option>`;

  data.materials.forEach(mat => {
    const option = document.createElement("option");
    option.value = mat._id;
    option.textContent = mat.name;

    if (mat._id === selectedValue) {
      option.selected = true;
    }

    select.appendChild(option);
  });
  } catch (error) {
    console.log(error)
    
  }
}













