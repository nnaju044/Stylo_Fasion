
let selectedUserId = null;
let currentStatus = false;

function openUserModal(userId, isBlocked) {
  selectedUserId = userId;
  currentStatus = isBlocked;

  const modal = document.getElementById('userConfirmModal');
  const title = document.getElementById('modalTitle');
  const message = document.getElementById('modalMessage');
  const btn = document.getElementById('confirmActionBtn');

  if (isBlocked) {
    title.innerText = 'Unblock User';
    message.innerText = 'Are you sure you want to unblock this user?';
    btn.innerText = 'Unblock';
    btn.className = 'px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white';
  } else {
    title.innerText = 'Block User';
    message.innerText = 'Are you sure you want to block this user?';
    btn.innerText = 'Block';
    btn.className = 'px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white';
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeUserModal() {
  const modal = document.getElementById('userConfirmModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

async function confirmUserAction() {
  try {
    await axios.patch(`/admin/users/${selectedUserId}/toggle-block`);
    closeUserModal();
    location.reload();
  } catch (error) {
    alert('Something went wrong');
    console.error(error);
  }
}

document.getElementById('confirmActionBtn').onclick = confirmUserAction;

