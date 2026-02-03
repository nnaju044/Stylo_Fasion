/* -------------------- MODAL STATE -------------------- */
let modalMode = "add";
let activeCategoryId = null;

/* -------------------- ELEMENTS -------------------- */
const modal = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const saveBtn = document.getElementById("saveCategoryBtn");

const nameInput = document.getElementById("categoryName");
const statusToggle = document.getElementById("statusToggle");
const toggleSlider = document.getElementById("toggleSlider");
const sliderButton = toggleSlider.querySelector("span");
const formSection = document.getElementById("formInputsSection");
const deleteSection = document.getElementById("deleteConfirmSection");

/* -------------------- HELPER FUNCTIONS -------------------- */
function showSuccess(message) {
  Swal.fire({
    icon: 'success',
    title: 'Success',
    text: message,
    timer: 1500
  });
}

function showError(message) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message
  });
}

/* -------------------- TOGGLE HANDLER -------------------- */
function updateToggleUI() {
  if (statusToggle.checked) {
    toggleSlider.style.backgroundColor = "#7c2d12";
    sliderButton.style.transform = "translateX(24px)";
  } else {
    toggleSlider.style.backgroundColor = "#cbd5e0";
    sliderButton.style.transform = "translateX(0)";
  }
}

updateToggleUI();
statusToggle.addEventListener("change", updateToggleUI);

/* -------------------- OPEN ADD MODAL -------------------- */
function openAddCategoryModal() {
  modalMode = "add";
  activeCategoryId = null;

  modalTitle.innerText = "Add New Category";
  saveBtn.innerText = "Add Category";

  formSection.style.display = "block";
  deleteSection.style.display = "none";

  nameInput.value = "";
  statusToggle.checked = true;
  updateToggleUI();

  modal.style.display = "flex";
}

/* -------------------- OPEN EDIT MODAL -------------------- */
function openEditCategoryModal(category) {
  modalMode = "edit";
  activeCategoryId = category._id;

  modalTitle.innerText = "Edit Category";
  saveBtn.innerText = "Update Category";

  formSection.style.display = "block";
  deleteSection.style.display = "none";

  nameInput.value = category.name;
  statusToggle.checked = category.isActive;
  updateToggleUI();

  modal.style.display = "flex";
}

/* -------------------- OPEN DELETE MODAL -------------------- */
function openDeleteCategoryModal(categoryId) {
    console.log(categoryId)
  modalMode = "delete";
  activeCategoryId = categoryId;

  modalTitle.innerText = "Delete Category";
  saveBtn.innerText = "Delete";
  saveBtn.style.backgroundColor = "#dc2626";
  saveBtn.style.color = "white";

  formSection.style.display = "none";
  deleteSection.style.display = "block";

  modal.style.display = "flex";
}

/* -------------------- CLOSE MODAL -------------------- */
function closeModal() {
  modal.style.display = "none";
  saveBtn.style.backgroundColor = "#7c2d12";
}

// outside click
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// esc key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// prevent modal click close
modal.querySelector("div").addEventListener("click", (e) => {
  e.stopPropagation();
});

/* -------------------- CRUD OPERATIONS -------------------- */
async function addCategory() {
  const name = nameInput.value.trim();
  const isActive = statusToggle.checked;

  if (!name) {
    showError("Category name is required");
    return;
  }

  try {
    const res = await axios.post("/admin/category", { name, isActive });

   
    
    if (res.data.success) {
      showSuccess("Category added successfully");
      setTimeout(() => location.reload(), 1000);
    } else {
      showError(res.data.message || "Failed to add category");
    }
  } catch (error) {
    
    showError(error.response?.data?.message || "Server error");
  }
}

async function updateCategory() {
  const name = nameInput.value.trim();
  const isActive = statusToggle.checked;

  if (!name) {
    showError("Category name is required");
    return;
  }

  try {
    const res = await axios.patch(`/admin/category/${activeCategoryId}`, { name, isActive });
    
    if (res.data.success) {
      showSuccess("Category updated successfully");
      setTimeout(() => location.reload(), 1000);
    } else {
      showError(res.data.message || "Failed to update category");
    }
  } catch (error) {
    
    showError(error.response?.data?.message || "Server error");
  }
}

async function deleteCategory() {

  try {
    const res = await axios.patch(`/admin/category/delete/${activeCategoryId}`);

    if (res.data.success) {
      showSuccess("Category deleted successfully");
      setTimeout(() => location.reload(), 1000);
    } else {
      showError(res.data.message || "Delete failed");
    }
  } catch (error) {
    showError(error.response?.data?.message || "Server error");
  }
}

/* -------------------- SAVE BUTTON HANDLER -------------------- */
saveBtn.addEventListener("click", async () => {
  try {
    if (modalMode === "add") {
      await addCategory();
    } else if (modalMode === "edit") {
      await updateCategory();
    } else if (modalMode === "delete") {
      await deleteCategory();
    }
  } catch (err) {
    console.error(err);
    showError("Operation failed");
  }
});


// SEARCH & PAGINATION
let currentPage = 1;
let currentKeyword = "";

const searchInput = document.getElementById("categorySearchInput");
const clearBtn = document.getElementById("clearCategorySearchBtn");
const tableBody = document.getElementById("categoriesTableBody");

let debounceTimer;

function handleCategorySearch(value) {
  clearTimeout(debounceTimer);

  if (value.trim()) {
    clearBtn.classList.remove("hidden");
  } else {
    clearBtn.classList.add("hidden");
  }

  debounceTimer = setTimeout(() => {
    fetchCategories(value, 1);
  }, 300);
}


function renderCategories(categories) {
  tableBody.innerHTML = "";

  if (!categories.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-6 text-gray-500">
          No categories found
        </td>
      </tr>
    `;
    return;
  }

  categories.forEach((category) => {
    tableBody.innerHTML += `
      <tr class="hover:bg-gray-50 transition-colors">
        
        <!-- Name -->
        <td class="px-6 py-4">
          <div class="font-medium text-gray-900">
            ${category.name}
          </div>
        </td>

        <!-- Products -->
        <td class="px-6 py-4">
          <div class="text-gray-600">
            ${category.productCount || 0} products
          </div>
        </td>

        <!-- Offers -->
        <td class="px-6 py-4">
          <div class="flex items-center gap-2 text-red-900 font-medium">
            <i class="fas fa-tag"></i>
            <span>Add Offer</span>
          </div>
        </td>

        <!-- Status -->
        <td class="px-6 py-4">
          <span class="${
            category.isActive ? "text-gray-900" : "text-gray-500"
          } font-medium">
            ${category.isActive ? "Active" : "Inactive"}
          </span>
        </td>

        <!-- Actions -->
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            <button
              onclick='openEditCategoryModal(${JSON.stringify(category)})'
              class="text-red-900">
              <i class="fas fa-edit text-lg"></i>
            </button>

            <button
              onclick="openDeleteCategoryModal('${category._id}')"
              class="text-red-900">
              <i class="fas fa-trash text-lg"></i>
            </button>
          </div>
        </td>

      </tr>
    `;
  });
}


function clearCategorySearch() {
  searchInput.value = "";
  clearBtn.classList.add("hidden");
  fetchCategories("", 1);
}

function renderPagination(totalPages, currentPage) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  if (!totalPages || totalPages <= 1) return;

  if (currentPage > 1) {
    pagination.innerHTML += `
      <button onclick="fetchCategories(currentKeyword, ${currentPage - 1})"
        class="px-3 py-1 border rounded">Prev</button>
    `;
  }

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <button onclick="fetchCategories(currentKeyword, ${i})"
        class="px-3 py-1 border rounded ${
          i === currentPage ? "bg-red-600 text-white" : ""
        }">
        ${i}
      </button>
    `;
  }

  if (currentPage < totalPages) {
    pagination.innerHTML += `
      <button onclick="fetchCategories(currentKeyword, ${currentPage + 1})"
        class="px-3 py-1 border rounded">Next</button>
    `;
  }
}

async function fetchCategories(keyword = "", page = 1) {
  try {
    currentKeyword = keyword;
    currentPage = page;

    const res = await axios.get("/admin/categories/search", {
      params: {
        q: keyword,
        page: page,
      },
    });

    renderCategories(res.data.categories);
    renderPagination(res.data.totalPages, res.data.currentPage);
  } catch (err) {
    console.error("fetchCategories error", err);
  }
}


fetchCategories("", 1);


