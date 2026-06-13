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
    if (!LVRE.user.isAdmin()) {
      alert('Access denied. Admin privileges required.');
      window.location.href = 'index.html';
      return;
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
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        LVRE.user.logout();
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
        this.loadProductsManagement();
        break;
      case 'orders':
        this.loadOrdersManagement();
        break;
      case 'users':
        this.loadUsersManagement();
        break;
      case 'articles':
        this.loadArticlesManagement();
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

  loadProductsManagement() {
    const contentArea = document.getElementById('admin-content');
    if (!contentArea) return;

    contentArea.innerHTML = `
      <div class="admin-products">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2>Product Management</h2>
          <button class="admin-primary-btn" onclick="window.adminDashboard.showProductForm()">+ Add Product</button>
        </div>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="products-table-body">
              ${this.renderProductsTable()}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.bindProductEvents();
  }

  renderProductsTable() {
    // Sample products - in real app, this would come from database
    const products = [
      { id: 'p1', name: 'Linen Co-ord Set — Sage', brand: 'Naura Studio', price: 485000, category: 'clothing', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=100&q=80', active: true },
      { id: 'p2', name: 'Wrap Midi Dress — Ivory', brand: 'Fiera Label', price: 320000, category: 'clothing', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=80', active: true },
      { id: 'p3', name: 'Oversized Blazer — Forest', brand: 'Rima Collective', price: 620000, category: 'outer', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&q=80', active: true }
    ];

    return products.map(product => `
      <tr data-product-id="${product.id}">
        <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
        <td>${product.name}</td>
        <td>${product.brand}</td>
        <td>Rp ${product.price.toLocaleString('id-ID')}</td>
        <td>${product.category}</td>
        <td><span class="status-badge ${product.active ? 'active' : 'inactive'}">${product.active ? 'Active' : 'Inactive'}</span></td>
        <td>
          <button class="action-btn edit-product-btn" data-product-id="${product.id}">Edit</button>
          <button class="action-btn delete-product-btn" data-product-id="${product.id}">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  bindProductEvents() {
    document.querySelectorAll('.edit-product-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.editProduct(btn.dataset.productId);
      });
    });

    document.querySelectorAll('.delete-product-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.deleteProduct(btn.dataset.productId);
      });
    });
  }

  showProductForm(productId = null) {
    const isEdit = !!productId;
    const product = productId ? { name: 'Sample Product', brand: 'Brand', price: 100000, category: 'clothing' } : {};

    const formHTML = `
      <div class="product-form" style="padding: 20px;">
        <h3>${isEdit ? 'Edit Product' : 'Add New Product'}</h3>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Product Name *</label>
            <input type="text" class="form-input" id="product-name" value="${product.name || ''}" required>
          </div>

          <div class="form-group">
            <label class="form-label">Brand *</label>
            <input type="text" class="form-input" id="product-brand" value="${product.brand || ''}" required>
          </div>

          <div class="form-group">
            <label class="form-label">Price *</label>
            <input type="number" class="form-input" id="product-price" value="${product.price || ''}" required>
          </div>

          <div class="form-group">
            <label class="form-label">Category *</label>
            <select class="form-select" id="product-category" required>
              <option value="">Select Category</option>
              <option value="clothing" ${product.category === 'clothing' ? 'selected' : ''}>Clothing</option>
              <option value="tas" ${product.category === 'tas' ? 'selected' : ''}>Tas & Dompet</option>
              <option value="sepatu" ${product.category === 'sepatu' ? 'selected' : ''}>Sepatu</option>
              <option value="aksesori" ${product.category === 'aksesori' ? 'selected' : ''}>Aksesori</option>
              <option value="outer" ${product.category === 'outer' ? 'selected' : ''}>Outer & Jacket</option>
            </select>
          </div>

          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" id="product-description" rows="4"></textarea>
          </div>

          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">Image URL</label>
            <input type="url" class="form-input" id="product-image" placeholder="https://...">
          </div>
        </div>

        <div style="display: flex; gap: 12px; margin-top: 24px;">
          <button class="admin-primary-btn" onclick="window.adminDashboard.saveProduct('${productId || ''}')">
            ${isEdit ? 'Update Product' : 'Add Product'}
          </button>
          <button class="admin-secondary-btn" onclick="LVRE.modal.close()">Cancel</button>
        </div>
      </div>
    `;

    LVRE.modal.open(formHTML, {
      title: isEdit ? 'Edit Product' : 'Add New Product',
      size: 'large'
    });
  }

  saveProduct(productId) {
    // Collect form data
    const productData = {
      name: document.getElementById('product-name').value,
      brand: document.getElementById('product-brand').value,
      price: parseInt(document.getElementById('product-price').value),
      category: document.getElementById('product-category').value,
      description: document.getElementById('product-description').value,
      image: document.getElementById('product-image').value
    };

    // Validate
    if (!productData.name || !productData.brand || !productData.price || !productData.category) {
      LVRE.notify.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    // Save (in real app, this would be an API call)
    if (productId) {
      LVRE.notify.success('Produk berhasil diperbarui');
    } else {
      LVRE.notify.success('Produk berhasil ditambahkan');
    }

    LVRE.modal.close();
    this.loadProductsManagement();
  }

  editProduct(productId) {
    this.showProductForm(productId);
  }

  deleteProduct(productId) {
    LVRE.modal.confirm('Apakah Anda yakin ingin menghapus produk ini?', {
      title: 'Konfirmasi Hapus',
      onConfirm: () => {
        LVRE.notify.success('Produk berhasil dihapus');
        this.loadProductsManagement();
      }
    });
  }

  loadOrdersManagement() {
    const contentArea = document.getElementById('admin-content');
    if (!contentArea) return;

    const orders = LVRE.orders.getAllOrders();

    contentArea.innerHTML = `
      <div class="admin-orders">
        <h2>Order Management</h2>

        <div class="admin-filters" style="display: flex; gap: 12px; margin-bottom: 24px;">
          <select class="form-select" id="order-status-filter" style="width: 200px;">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(order => `
                <tr data-order-id="${order.id}">
                  <td>${order.id}</td>
                  <td>${order.shipping?.fullName || 'Guest'}</td>
                  <td>${order.items.length} items</td>
                  <td>Rp ${order.total.toLocaleString('id-ID')}</td>
                  <td>
                    <select class="status-select" data-order-id="${order.id}" onchange="window.adminDashboard.updateOrderStatus('${order.id}', this.value)">
                      <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                      <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                      <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                      <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                      <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                      <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                  </td>
                  <td>${order.paymentStatus}</td>
                  <td>${new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                  <td>
                    <button class="action-btn view-order-detail-btn" data-order-id="${order.id}">View</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.bindOrderEvents();
  }

  bindOrderEvents() {
    document.querySelectorAll('.view-order-detail-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.viewOrderDetails(btn.dataset.orderId);
      });
    });
  }

  updateOrderStatus(orderId, newStatus) {
    LVRE.orders.updateOrderStatus(orderId, newStatus);
    LVRE.notify.success(`Order ${orderId} status updated to ${newStatus}`);
  }

  viewOrderDetails(orderId) {
    const order = LVRE.orders.getOrder(orderId);
    if (!order) return;

    const detailsHTML = `
      <div style="padding: 20px;">
        <h3>Order Details - ${orderId}</h3>

        <div style="margin-bottom: 20px;">
          <h4>Customer Information</h4>
          <p><strong>Name:</strong> ${order.shipping?.fullName || 'Guest'}</p>
          <p><strong>Email:</strong> ${order.shipping?.email || '-'}</p>
          <p><strong>Phone:</strong> ${order.shipping?.phone || '-'}</p>
          <p><strong>Address:</strong> ${order.shipping?.address || '-'}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h4>Order Items</h4>
          ${order.items.map(item => `
            <div style="display: flex; gap: 12px; margin-bottom: 12px; padding: 12px; background: #F9FAFB; border-radius: 6px;">
              <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px;">
              <div style="flex: 1;">
                <div style="font-weight: 500;">${item.name}</div>
                <div style="font-size: 13px; color: #6B7280;">${item.brand}</div>
                <div style="font-size: 13px; color: #6B7280;">Qty: ${item.quantity} × Rp ${item.price.toLocaleString('id-ID')}</div>
              </div>
              <div style="font-weight: 600;">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</div>
            </div>
          `).join('')}
        </div>

        <div>
          <h4>Payment Summary</h4>
          <p><strong>Subtotal:</strong> Rp ${order.subtotal.toLocaleString('id-ID')}</p>
          <p><strong>Shipping:</strong> Rp ${order.shippingCost.toLocaleString('id-ID')}</p>
          ${order.discount > 0 ? `<p><strong>Discount:</strong> -Rp ${order.discount.toLocaleString('id-ID')}</p>` : ''}
          <p style="font-size: 16px; font-weight: 600;"><strong>Total:</strong> Rp ${order.total.toLocaleString('id-ID')}</p>
        </div>
      </div>
    `;

    LVRE.modal.open(detailsHTML, { title: 'Order Details', size: 'large' });
  }

  loadUsersManagement() {
    const contentArea = document.getElementById('admin-content');
    if (!contentArea) return;

    const users = LVRE.user.getAllUsers();

    contentArea.innerHTML = `
      <div class="admin-users">
        <h2>User Management</h2>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(user => `
                <tr data-user-id="${user.id}">
                  <td>${user.id}</td>
                  <td>${user.name}</td>
                  <td>${user.email}</td>
                  <td>${user.phone || '-'}</td>
                  <td><span class="role-badge">${user.isAdmin ? 'Admin' : 'User'}</span></td>
                  <td>${new Date(user.createdAt).toLocaleDateString('id-ID')}</td>
                  <td>
                    <button class="action-btn edit-user-btn" data-user-id="${user.id}">Edit</button>
                    <button class="action-btn delete-user-btn" data-user-id="${user.id}">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.bindUserEvents();
  }

  bindUserEvents() {
    document.querySelectorAll('.edit-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.editUser(btn.dataset.userId);
      });
    });

    document.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.deleteUser(btn.dataset.userId);
      });
    });
  }

  editUser(userId) {
    const user = LVRE.user.getAllUsers().find(u => u.id === userId);
    if (!user) return;

    const formHTML = `
      <div style="padding: 20px;">
        <h3>Edit User - ${user.name}</h3>

        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" id="edit-user-name" value="${user.name}">
        </div>

        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" id="edit-user-email" value="${user.email}">
        </div>

        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label">Phone</label>
          <input type="tel" class="form-input" id="edit-user-phone" value="${user.phone || ''}">
        </div>

        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label">Role</label>
          <select class="form-select" id="edit-user-role">
            <option value="user" ${!user.isAdmin ? 'selected' : ''}>User</option>
            <option value="admin" ${user.isAdmin ? 'selected' : ''}>Admin</option>
          </select>
        </div>

        <div style="display: flex; gap: 12px;">
          <button class="admin-primary-btn" onclick="window.adminDashboard.saveUser('${userId}')">Save Changes</button>
          <button class="admin-secondary-btn" onclick="LVRE.modal.close()">Cancel</button>
        </div>
      </div>
    `;

    LVRE.modal.open(formHTML, { title: 'Edit User', size: 'medium' });
  }

  saveUser(userId) {
    const updatedData = {
      name: document.getElementById('edit-user-name').value,
      email: document.getElementById('edit-user-email').value,
      phone: document.getElementById('edit-user-phone').value,
      isAdmin: document.getElementById('edit-user-role').value === 'admin'
    };

    LVRE.user.updateUser(userId, updatedData);
    LVRE.notify.success('User berhasil diperbarui');
    LVRE.modal.close();
    this.loadUsersManagement();
  }

  deleteUser(userId) {
    const user = LVRE.user.getAllUsers().find(u => u.id === userId);
    if (!user) return;

    LVRE.modal.confirm(`Apakah Anda yakin ingin menghapus user ${user.name}?`, {
      title: 'Konfirmasi Hapus',
      onConfirm: () => {
        LVRE.user.deleteUser(userId);
        this.loadUsersManagement();
      }
    });
  }

  loadArticlesManagement() {
    const contentArea = document.getElementById('admin-content');
    if (!contentArea) return;

    // Sample articles data
    const articles = [
      { id: 'a1', title: '5 Tips Fashion untuk Tampil Lebih Percaya Diri', category: 'Tips', author: 'Admin', date: '2024-03-15', status: 'published' },
      { id: 'a2', title: 'Trend Fashion Musim Panas 2024', category: 'Trend', author: 'Admin', date: '2024-03-10', status: 'published' },
      { id: 'a3', title: 'Cara Merawat Pakaian Linen', category: 'Care Guide', author: 'Admin', date: '2024-03-05', status: 'draft' }
    ];

    contentArea.innerHTML = `
      <div class="admin-articles">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2>Article Management</h2>
          <button class="admin-primary-btn" onclick="window.adminDashboard.showArticleForm()">+ Add Article</button>
        </div>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${articles.map(article => `
                <tr data-article-id="${article.id}">
                  <td>${article.title}</td>
                  <td>${article.category}</td>
                  <td>${article.author}</td>
                  <td>${article.date}</td>
                  <td><span class="status-badge ${article.status === 'published' ? 'active' : 'inactive'}">${article.status}</span></td>
                  <td>
                    <button class="action-btn edit-article-btn" data-article-id="${article.id}">Edit</button>
                    <button class="action-btn delete-article-btn" data-article-id="${article.id}">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.bindArticleEvents();
  }

  bindArticleEvents() {
    document.querySelectorAll('.edit-article-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.editArticle(btn.dataset.articleId);
      });
    });

    document.querySelectorAll('.delete-article-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.deleteArticle(btn.dataset.articleId);
      });
    });
  }

  showArticleForm(articleId = null) {
    const isEdit = !!articleId;
    const article = articleId ? { title: 'Sample Article', category: 'Tips', content: 'Article content here...' } : {};

    const formHTML = `
      <div class="article-form" style="padding: 20px;">
        <h3>${isEdit ? 'Edit Article' : 'Add New Article'}</h3>

        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label">Title *</label>
          <input type="text" class="form-input" id="article-title" value="${article.title || ''}" required>
        </div>

        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label">Category *</label>
          <select class="form-select" id="article-category" required>
            <option value="">Select Category</option>
            <option value="Tips" ${article.category === 'Tips' ? 'selected' : ''}>Tips</option>
            <option value="Trend" ${article.category === 'Trend' ? 'selected' : ''}>Trend</option>
            <option value="Care Guide" ${article.category === 'Care Guide' ? 'selected' : ''}>Care Guide</option>
            <option value="Inspiration" ${article.category === 'Inspiration' ? 'selected' : ''}>Inspiration</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label">Content *</label>
          <textarea class="form-textarea" id="article-content" rows="10" required>${article.content || ''}</textarea>
        </div>

        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label">Status</label>
          <select class="form-select" id="article-status">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div style="display: flex; gap: 12px;">
          <button class="admin-primary-btn" onclick="window.adminDashboard.saveArticle('${articleId || ''}')">
            ${isEdit ? 'Update Article' : 'Publish Article'}
          </button>
          <button class="admin-secondary-btn" onclick="LVRE.modal.close()">Cancel</button>
        </div>
      </div>
    `;

    LVRE.modal.open(formHTML, {
      title: isEdit ? 'Edit Article' : 'Add New Article',
      size: 'large'
    });
  }

  saveArticle(articleId) {
    const articleData = {
      title: document.getElementById('article-title').value,
      category: document.getElementById('article-category').value,
      content: document.getElementById('article-content').value,
      status: document.getElementById('article-status').value,
      author: 'Admin',
      date: new Date().toISOString().split('T')[0]
    };

    if (!articleData.title || !articleData.category || !articleData.content) {
      LVRE.notify.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    if (articleId) {
      LVRE.notify.success('Artikel berhasil diperbarui');
    } else {
      LVRE.notify.success('Artikel berhasil dipublikasikan');
    }

    LVRE.modal.close();
    this.loadArticlesManagement();
  }

  editArticle(articleId) {
    this.showArticleForm(articleId);
  }

  deleteArticle(articleId) {
    LVRE.modal.confirm('Apakah Anda yakin ingin menghapus artikel ini?', {
      title: 'Konfirmasi Hapus',
      onConfirm: () => {
        LVRE.notify.success('Artikel berhasil dihapus');
        this.loadArticlesManagement();
      }
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  window.adminDashboard = new AdminDashboard();
});