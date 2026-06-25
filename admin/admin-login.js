// ═══════════════════════════════════════════════════════════════
// LVRE - Admin Login Page
// Admin authentication and authorization
// ═══════════════════════════════════════════════════════════════

class AdminLogin {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.checkExistingSession();
  }

  bindEvents() {
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }
  }

  checkExistingSession() {
    // Check if user is already logged in as admin
    const user = LVRE.user.getUser();
    if (user && user.isAdmin) {
      // Redirect to admin dashboard
      window.location.href = 'index.html';
    }
  }

  handleLogin(e) {
    e.preventDefault();

    const emailInput = document.getElementById('adminEmail');
    const passwordInput = document.getElementById('adminPassword');
    const rememberCheckbox = document.getElementById('rememberMe');

    const email = emailInput?.value || '';
    const password = passwordInput?.value || '';

    if (!email || !password) {
      LVRE.notify.error('Email dan password harus diisi');
      return;
    }

    // Show loading state
    const submitBtn = document.querySelector('.admin-login-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-dasharray="4 4"/>
        </svg>
        Memproses...
      `;
    }

    // Simulate API call delay
    setTimeout(() => {
      // Attempt login
      const success = this.attemptAdminLogin(email, password);

      if (success) {
        // Redirect to admin dashboard
        window.location.href = 'index.html';
      } else {
        // Reset button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Login';
        }

        // Show error
        LVRE.modal.alert('Email atau password salah. Silakan coba lagi.', {
          title: 'Login Gagal'
        });
      }
    }, 1000);
  }

  attemptAdminLogin(email, password) {
    // Get all users
    const users = LVRE.user.getAllUsers();

    // Find admin user
    const adminUser = users.find(u =>
      u.email === email &&
      u.password === password &&
      u.isAdmin === true
    );

    if (adminUser) {
      // Set as current user
      LVRE.user.login(email, password);
      return true;
    }

    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// CREATE DEFAULT ADMIN ACCOUNT (for testing)
// ═══════════════════════════════════════════════════════════════

function createDefaultAdminAccount() {
  const users = LVRE.user.getAllUsers();
  const adminExists = users.some(u => u.isAdmin === true);

  if (!adminExists) {
    LVRE.user.register({
      name: 'Admin',
      email: 'admin@lvre.com',
      password: 'admin123',
      phone: '081234567890',
      isAdmin: true
    });
    console.log('Default admin account created: admin@lvre.com / admin123');
  }
}

// Create default admin on load
createDefaultAdminAccount();

// ═══════════════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  window.adminLogin = new AdminLogin();
});
