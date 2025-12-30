const API_URL = 'http://localhost:3000/api';

let users = [];
let userToDelete = null;

// Check authentication and admin role
function checkAuth() {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    window.location.href = '/';
    return null;
  }

  // Check if user is admin
  if (user.role !== 'admin') {
    window.location.href = '/dashboard';
    return null;
  }

  return { token, user };
}

// Logout function
function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');

  fetch(`${API_URL}/auth/logout`, {
    method: 'GET',
    credentials: 'include',
  }).finally(() => {
    window.location.href = '/';
  });
}

// Show Alert
function showAlert(message) {
  const modal = document.getElementById('alertModal');
  const alertText = document.getElementById('alertText');
  alertText.textContent = message;
  modal.classList.add('show');
}

function closeAlert() {
  const modal = document.getElementById('alertModal');
  modal.classList.remove('show');
}

// Load all users
async function loadUsers() {
  const auth = checkAuth();
  if (!auth) return;

  try {
    const response = await fetch(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/';
        return;
      }
      throw new Error('Failed to load users');
    }

    const data = await response.json();
    users = data.users || [];
    displayUsers(users);
  } catch (error) {
    console.error('Error loading users:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  }
}

// Display users in table
function displayUsers(usersToDisplay) {
  const tbody = document.getElementById('usersTableBody');

  if (usersToDisplay.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; padding: 20px;">No users found</td></tr>';
    return;
  }

  tbody.innerHTML = usersToDisplay
    .map(
      (user) => `
    <tr>
      <td class="user-name">
        <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
        ${user.name}
      </td>
      <td>${user.email}</td>
      <td>
        <span class="role-badge ${user.role === 'admin' ? 'admin' : 'user'}">
          ${user.role.toUpperCase()}
        </span>
      </td>
      <td>${new Date(user.createdAt).toLocaleDateString()}</td>
      <td>
        <button class="btn-delete-small" onclick="openDeleteModal('${
          user._id
        }', '${user.name}')">
          Delete
        </button>
      </td>
    </tr>
  `
    )
    .join('');
}

// Open delete modal
function openDeleteModal(userId, userName) {
  userToDelete = userId;
  document.getElementById('deleteUserName').textContent = userName;
  const modal = document.getElementById('deleteModal');
  modal.classList.add('show');
}

function closeDeleteModal() {
  const modal = document.getElementById('deleteModal');
  modal.classList.remove('show');
  userToDelete = null;
}

// Confirm and delete user
async function confirmDelete() {
  if (!userToDelete) return;

  const auth = checkAuth();
  if (!auth) return;

  try {
    const response = await fetch(`${API_URL}/user/delete/${userToDelete}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    closeDeleteModal();
    showAlert('User deleted successfully! ✓');
    loadUsers();
  } catch (error) {
    showAlert('Error: ' + error.message);
  }
}

// Search functionality
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();

  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    displayUsers(filtered);
  });
});
