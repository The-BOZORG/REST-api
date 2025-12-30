const API_URL = 'http://localhost:3000/api';

// Check authentication
function checkAuth() {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    window.location.href = '/';
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

// Load user data
async function loadUserData() {
  const auth = checkAuth();
  if (!auth) return;

  const { token, user } = auth;

  // Display user info
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userNameFull').textContent = user.name;
  document.getElementById('userId').textContent = user.userId;
  document.getElementById('userRole').textContent = user.role.toUpperCase();
  document.getElementById('userRoleFull').textContent = user.role.toUpperCase();

  try {
    // Fetch current user details
    const response = await fetch(`${API_URL}/user/showme`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();

    // Update with fresh data
    if (data.user) {
      document.getElementById('userName').textContent = data.user.name;
      document.getElementById('userNameFull').textContent = data.user.name;
      document.getElementById('userEmail').textContent = 'Loading...';
      document.getElementById('userId').textContent = data.user.userId;
      document.getElementById('userRole').textContent =
        data.user.role.toUpperCase();
      document.getElementById('userRoleFull').textContent =
        data.user.role.toUpperCase();

      // Show Users link for admin
      if (data.user.role === 'admin') {
        document.getElementById('usersLink').style.display = 'flex';
      }
    }

    // Fetch user details to get email
    const userDetailResponse = await fetch(`${API_URL}/user/${user.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (userDetailResponse.ok) {
      const userDetail = await userDetailResponse.json();
      if (userDetail.user && userDetail.user.email) {
        document.getElementById('userEmail').textContent =
          userDetail.user.email;
      }
    }

    // Load total users if admin
    if (user.role === 'admin') {
      await loadTotalUsers(token);
    } else {
      document.getElementById('totalUsers').textContent = 'N/A';
    }
  } catch (error) {
    // If token is invalid or expired, redirect to home
    console.error('Authentication error:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  }
}

// Load total users (admin only)
async function loadTotalUsers(token) {
  try {
    const response = await fetch(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById('totalUsers').textContent = data.users
        ? data.users.length
        : '0';
    } else {
      document.getElementById('totalUsers').textContent = 'N/A';
    }
  } catch (error) {
    document.getElementById('totalUsers').textContent = 'N/A';
  }
}

// Show Alert Modal
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

// Update User Profile
document
  .getElementById('updateUserForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const auth = checkAuth();
    if (!auth) return;

    const name = document.getElementById('updateName').value;
    const email = document.getElementById('updateEmail').value;
    const token = auth.token;

    try {
      const response = await fetch(`${API_URL}/user/updateuser`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to update profile');
      }

      // Update local storage with new user data
      const user = JSON.parse(localStorage.getItem('user'));
      user.name = data.user.name;
      localStorage.setItem('user', JSON.stringify(user));

      // Update displayed name
      document.getElementById('userName').textContent = data.user.name;
      document.getElementById('userNameFull').textContent = data.user.name;

      showAlert('Profile updated successfully! ✓');
      document.getElementById('updateUserForm').reset();
    } catch (error) {
      showAlert('Error: ' + error.message);
    }
  });

// Update User Password
document
  .getElementById('updatePasswordForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const auth = checkAuth();
    if (!auth) return;

    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const token = auth.token;

    if (newPassword.length < 6) {
      showAlert('New password must be at least 6 characters long!');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/updatepassword`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to update password');
      }

      showAlert('Password changed successfully! ✓');
      document.getElementById('updatePasswordForm').reset();
    } catch (error) {
      showAlert('Error: ' + error.message);
    }
  });

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  loadUserData();

  // Pre-fill update form with current user data
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    document.getElementById('updateName').value = user.name;
  }

  // Fetch email to populate form
  const token = localStorage.getItem('accessToken');
  if (token && user) {
    fetch(`${API_URL}/user/${user.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.email) {
          document.getElementById('updateEmail').value = data.user.email;
        }
      });
  }
});
