/* -------------------- CONFORM MODAL -------------------- */

let selectedUserId = null;
let currentIsActive = true;

function openUserModal(userId, isActive) {
  selectedUserId = userId;
  currentIsActive = isActive;

  const title = document.getElementById("modalTitle");
  const msg = document.getElementById("modalMessage");
  const btn = document.getElementById("confirmActionBtn");

  if (isActive) {
    title.innerText = "Block User";
    msg.innerText = "Are you sure you want to block this user?";
    btn.innerText = "Block";
    btn.className =
      "px-6 py-2.5 bg-red-800 hover:bg-red-900 text-white rounded-md";
  } else {
    title.innerText = "Unblock User";
    msg.innerText = "Are you sure you want to unblock this user?";
    btn.innerText = "Unblock";
    btn.className =
      "px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-md";
  }

  document.getElementById("userConfirmModal").style.display = "flex";
}

function closeUserModal() {
  document.getElementById("userConfirmModal").style.display = "none";
}

async function confirmUserAction() {
  
  try {
    await axios.patch(`/admin/users/${selectedUserId}/toggle-status`);
    closeUserModal();
    location.reload();
      Swal.fire({
  toast: true,
  position: "top-end",
  icon: "error",
  title: "user updated succesfully",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
});

  } catch (err) {
    Swal.fire({
  toast: true,
  position: "top-end",
  icon: "error",
  title: err,
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
});


    console.error(err);
  }
}

/* -------------------- SEARCH BAR -------------------- */
let currentPage = 1;
let currentKeyword = "";

const searchInput = document.getElementById("userSearchInput");
const clearBtn = document.getElementById("clearSearchBtn");
const tableBody = document.getElementById("usersTableBody");

let debounceTimer;

function handleUserSearch(value) {
  clearTimeout(debounceTimer);

  if (value.trim()) {
    clearBtn.classList.remove("hidden");
  } else {
    clearBtn.classList.add("hidden");
  }

  debounceTimer = setTimeout(() => {
    fetchUsers(value, 1);
  }, 300);
}

function renderUsers(users) {
  tableBody.innerHTML = "";

  if (!users.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-6 text-gray-500">
          No users found
        </td>
      </tr>
    `;
    return;
  }

  users.forEach((user) => {
    const profileImg =
      user.profileImage || user.googleImage
        ? `<img src="${user.profileImage || user.googleImage}"
               alt="${user.firstName}"
               class="w-10 h-10 rounded-full object-cover">`
        : `<i class="fas fa-user text-gray-400"></i>`;

    tableBody.innerHTML += `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
              ${profileImg}
            </div>
            <div>
              <div class="font-medium text-gray-900">${user.firstName}</div>
              <div class="text-sm text-gray-500">${user.email}</div>
            </div>
          </div>
        </td>

        <td class="px-6 py-4">
          ${
            user.isActive
              ? `<span class="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">active</span>`
              : `<span class="px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">blocked</span>`
          }
        </td>

        <td class="px-6 py-4">
          ${new Date(user.createdAt).toLocaleDateString("en-IN")}
        </td>

        <td class="px-6 py-4">
          <button
            onclick="openUserModal('${user._id}', ${user.isActive})"
            class="${user.isActive ? "text-red-600" : "text-green-600"}">
            <i class="fas ${user.isActive ? "fa-ban" : "fa-check-circle"}"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

function clearUserSearch() {
  searchInput.value = "";
  clearBtn.classList.add("hidden");
  fetchUsers("", 1);
}

function renderPagination(totalPages, currentPage) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  if (!totalPages || totalPages <= 1) return;

  if (currentPage > 1) {
    pagination.innerHTML += `
      <button onclick="fetchUsers(currentKeyword, ${currentPage - 1})"
        class="px-3 py-1 border rounded">Prev</button>
    `;
  }

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <button onclick="fetchUsers('', ${i})"
        class="px-3 py-1 border rounded ${
          i === currentPage ? "bg-red-600 text-white" : ""
        }">
        ${i}
      </button>
    `;
  }

  if (currentPage < totalPages) {
    pagination.innerHTML += `
      <button onclick="fetchUsers('', ${currentPage + 1})"
        class="px-3 py-1 border rounded">Next</button>
    `;
  }
}

async function fetchUsers(keyword = "", page = 1) {
  try {
    currentKeyword = keyword;
    currentPage = page;
    const res = await axios.get("/admin/users/search", {
      params: {
        q: keyword,
        page: page,
      },
    });

    renderUsers(res.data.users);
    renderPagination(res.data.totalPages, res.data.currentPage);
  } catch (err) {
    console.error("fetchUsers error", err);
  }
}

fetchUsers("", 1);
