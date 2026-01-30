/* -------------------- MODAL STATE -------------------- */
let isEditMode = false;
let editingCategoryId = null;

/* -------------------- ELEMENTS -------------------- */
const modal = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const saveBtn = document.getElementById("saveCategoryBtn");

const nameInput = document.getElementById("categoryName");
const statusToggle = document.getElementById("statusToggle");
const toggleSlider = document.getElementById("toggleSlider");
const sliderButton = toggleSlider.querySelector("span");

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
  isEditMode = false;
  editingCategoryId = null;

  modalTitle.innerText = "Add New Category";
  saveBtn.innerText = "Add Category";

  nameInput.value = "";
  statusToggle.checked = true;
  updateToggleUI();

  modal.style.display = "flex";
}

/* -------------------- OPEN EDIT MODAL -------------------- */
function openEditCategoryModal(category) {
  isEditMode = true;
  editingCategoryId = category._id;

  modalTitle.innerText = "Edit Category";
  saveBtn.innerText = "Update Category";

  nameInput.value = category.name;
  statusToggle.checked = category.isActive;
  updateToggleUI();

  modal.style.display = "flex";
}

/* -------------------- CLOSE MODAL -------------------- */
function closeModal() {
  modal.style.display = "none";
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

/* -------------------- SAVE BUTTON -------------------- */
saveBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const isActive = statusToggle.checked;

  if (!name) {
    alert("Category name is required");
    return;
  }

  try {
    let response;

    if (isEditMode) {
      response = await axios.patch(
        `/admin/category/${editingCategoryId}`,
        { name, isActive }
      );
    } else {
      response = await axios.post("/admin/category", {
        name,
        isActive
      });
    }

    if (response.data.success) {
         Swal.fire("Success", response.data.message, "success");
      location.reload();
    } else {
            Swal.fire("Error", response.data.message, "error");

    }

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
});
