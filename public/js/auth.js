const API_URL = 'http://localhost:3000/api';

// Switch between login and register forms
function switchTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabs = document.querySelectorAll('.tab');

  tabs.forEach((t) => t.classList.remove('active'));

  if (tab === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    tabs[0].classList.add('active');
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    tabs[1].classList.add('active');
  }

  hideAlert();
}

// Show alert message
function showAlert(message, type = 'success') {
  const alert = document.getElementById('alertMessage');
  alert.textContent = message;
  alert.className = `alert ${type}`;
  alert.style.display = 'block';

  setTimeout(() => {
    hideAlert();
  }, 5000);
}

function hideAlert() {
  const alert = document.getElementById('alertMessage');
  alert.style.display = 'none';
}

// Handle Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Login failed');
    }

    // Store token and user info
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));

    showAlert('Login successful! Redirecting to dashboard...', 'success');

    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);
  } catch (error) {
    showAlert(error.message, 'error');
  }
});

// Handle Register
document
  .getElementById('registerForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (password.length < 6) {
      showAlert('Password must be at least 6 characters long', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Registration failed');
      }

      // Store token and user info
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      showAlert(
        'Registration successful! Redirecting to dashboard...',
        'success'
      );

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error) {
      showAlert(error.message, 'error');
    }
  });

// Check if user is already logged in
const token = localStorage.getItem('accessToken');
if (token && window.location.pathname.includes('auth.html')) {
  window.location.href = '/dashboard';
}

// Check if coming from home page with register intent
window.addEventListener('DOMContentLoaded', () => {
  const authTab = localStorage.getItem('authTab');
  if (authTab === 'register') {
    switchTab('register');
    localStorage.removeItem('authTab');
  }
});
