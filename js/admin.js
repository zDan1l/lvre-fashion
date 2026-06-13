// ═══════════════════════════════════════════════════════════════
// LVRE - Admin Dashboard
// Complete admin functionality for products, orders, users, and articles
// ═══════════════════════════════════════════════════════════════

class AdminDashboard {
  constructor() {
    this.currentSection = 'dashboard';
    this.init();
  }

  init() {
    this.checkAdminAccess();
    this.bindEvents();
    this.loadDashboardStats();
  }

  checkAdminAccess() {
    // Check if admin is logged in using sessionStorage
    if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
      alert('Akses ditolak. Silakan login terlebih dahulu.');
      window.location.href = 'login.html';
      return;
    }
  }

  handleLogout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
      // Clear admin session
      sessionStorage.removeItem('adminLoggedIn');
      sessionStorage.removeItem('loginTime');

      // Redirect to login page
      window.location.href = 'login.html';
    }
  }

  bindEvents() {
    // Navigation
    document.querySelectorAll('[data-admin-section]').forEach(navItem => {
      navItem.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo(navItem.dataset.adminSection);
      });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.handleLogout();
      });
    }

    // Mobile Menu Toggle
    this.initMobileMenu();
  }

  initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const adminSidebar = document.getElementById('adminSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (mobileMenuToggle && adminSidebar && sidebarOverlay) {
      // Toggle sidebar
      mobileMenuToggle.addEventListener('click', () => {
        adminSidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');

        // Prevent body scroll when sidebar is open
        document.body.style.overflow = adminSidebar.classList.contains('open') ? 'hidden' : '';
      });

      // Close sidebar when clicking overlay
      sidebarOverlay.addEventListener('click', () => {
        adminSidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
      });

      // Close sidebar when clicking a navigation link
      const sidebarLinks = adminSidebar.querySelectorAll('.admin-nav a');
      sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
          adminSidebar.classList.remove('open');
          sidebarOverlay.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
          document.body.style.overflow = '';
        });
      });

      // Close sidebar on window resize if open
      window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && adminSidebar.classList.contains('open')) {
          adminSidebar.classList.remove('open');
          sidebarOverlay.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  }

  navigateTo(section) {
    this.currentSection = section;

    // Update active navigation
    document.querySelectorAll('[data-admin-section]').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.adminSection === section) {
        item.classList.add('active');
      }
    });

    // Load section content
    switch (section) {
      case 'dashboard':
        this.loadDashboardStats();
        break;
      case 'products':
        window.location.href = 'kelola-produk.html';
        break;
      case 'orders':
        window.location.href = 'kelola-transaksi.html';
        break;
      case 'users':
        window.location.href = 'kelola-pengguna.html';
        break;
      case 'articles':
        window.location.href = 'kelola-artikel.html';
        break;
    }
  }

  loadDashboardStats() {
    const stats = LVRE.orders.getOrderStats();

    const statsHTML = `
      <div class="admin-dashboard">
        <h2>Dashboard Overview</h2>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background: #DBEAFE; color: #1E40AF;">📦</div>
            <div class="stat-info">
              <div class="stat-value">${stats.totalOrders}</div>
              <div class="stat-label">Total Pesanan</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background: #D1FAE5; color: #065F46;">💰</div>
            <div class="stat-info">
              <div class="stat-value">Rp ${stats.totalRevenue.toLocaleString('id-ID')}</div>
              <div class="stat-label">Total Pendapatan</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background: #FEF3C7; color: #92400E;">👥</div>
            <div class="stat-info">
              <div class="stat-value">${LVRE.user.getAllUsers().length}</div>
              <div class="stat-label">Total Pengguna</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background: #EDE9FE; color: #5B21B6;">🛒</div>
            <div class="stat-info">
              <div class="stat-value">${LVRE.cart.getCart().length}</div>
              <div class="stat-label">Item di Keranjang</div>
            </div>
          </div>
        </div>

        <div class="recent-orders">
          <h3>Pesanan Terbaru</h3>
          ${this.renderRecentOrders()}
        </div>
      </div>
    `;

    const contentArea = document.getElementById('admin-content');
    if (contentArea) {
      contentArea.innerHTML = statsHTML;
    }
  }

  renderRecentOrders() {
    const recentOrders = LVRE.orders.getAllOrders().slice(0, 5);

    if (recentOrders.length === 0) {
      return '<p style="color: #6B7280; padding: 20px 0;">Belum ada pesanan</p>';
    }

    return `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Tanggal</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${recentOrders.map(order => `
            <tr>
              <td>${order.id}</td>
              <td>${order.shipping?.fullName || 'Guest'}</td>
              <td>Rp ${order.total.toLocaleString('id-ID')}</td>
              <td><span class="status-badge status-${order.status}">${order.status}</span></td>
              <td>${new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
              <td>
                <button class="action-btn view-order-btn" data-order-id="${order.id}">View</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}

// ═══════════════════════════════════════════════════════════════
// GLOBAL AUTHENTICATION CHECK
// ═══════════════════════════════════════════════════════════════

// Check authentication on all admin pages
function checkAdminAuthentication() {
  if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
    alert('Akses ditolak. Silakan login terlebih dahulu.');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Run authentication check immediately
if (!checkAdminAuthentication()) {
  // If not authenticated, stop further execution
  throw new Error('Authentication failed');
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  window.adminDashboard = new AdminDashboard();
});