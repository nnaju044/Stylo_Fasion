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

