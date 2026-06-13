// ═══════════════════════════════════════════════════════════════
// LVRE - Live Fashion Revolution Experience
// Main Application JavaScript
// ═══════════════════════════════════════════════════════════════

console.log('🚀 APP.JS LOADED SUCCESSFULLY!'); // Debug: Pastikan script diload

// ═══════════════════════════════════════════════════════════════
// LOCAL STORAGE HELPERS
// ═══════════════════════════════════════════════════════════════
const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// NOTIFICATION SYSTEM
// ═══════════════════════════════════════════════════════════════
class NotificationSystem {
  constructor() {
    this.container = null;
    this.notifications = [];
    this.init();
  }

  init() {
    this.container = document.createElement('div');
    this.container.className = 'notification-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `;
    document.body.appendChild(this.container);
  }

  show(message, type = 'success', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const colors = {
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6'
    };

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    notification.style.cssText = `
      background: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-left: 4px solid ${colors[type]};
      display: flex;
      align-items: center;
      gap: 12px;
      animation: slideIn 0.3s ease;
      cursor: pointer;
      transition: transform 0.2s, opacity 0.2s;
    `;

    notification.innerHTML = `
      <span style="color: ${colors[type]}; font-size: 18px; font-weight: bold;">${icons[type]}</span>
      <span style="flex: 1; font-size: 14px; color: #1a1a1a;">${message}</span>
      <button style="background: none; border: none; font-size: 18px; cursor: pointer; color: #666;">×</button>
    `;

    // Add animation keyframes if not exists
    if (!document.getElementById('notification-animations')) {
      const style = document.createElement('style');
      style.id = 'notification-animations';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(400px); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // Close button functionality
    const closeBtn = notification.querySelector('button');
    closeBtn.onclick = () => this.dismiss(notification);

    // Click to dismiss
    notification.onclick = (e) => {
      if (e.target !== closeBtn) {
        this.dismiss(notification);
      }
    };

    this.container.appendChild(notification);
    this.notifications.push(notification);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => this.dismiss(notification), duration);
    }

    return notification;
  }

  dismiss(notification) {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      notification.remove();
      this.notifications = this.notifications.filter(n => n !== notification);
    }, 300);
  }

  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }

  clear() {
    this.notifications.forEach(n => this.dismiss(n));
  }
}

// Create global notification instance
const notify = new NotificationSystem();

// ═══════════════════════════════════════════════════════════════
// MODAL SYSTEM
// ═══════════════════════════════════════════════════════════════
class ModalSystem {
  constructor() {
    this.activeModal = null;
    this.init();
  }

  init() {
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close();
      }
    });

    // Close modal on backdrop click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop') && this.activeModal) {
        this.close();
      }
    });
  }

  open(content, options = {}) {
    const {
      title = '',
      size = 'medium',
      showClose = true,
      backdrop = true,
      closeOnBackdrop = true
    } = options;

    // Close existing modal
    if (this.activeModal) {
      this.close();
    }

    // Create modal elements
    const modalBackdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease;
      padding: 20px;
    `;

    const modal = document.createElement('div');
    modal.className = `modal modal-${size}`;

    const sizeStyles = {
      small: 'max-width: 400px;',
      medium: 'max-width: 600px;',
      large: 'max-width: 800px;',
      xlarge: 'max-width: 1000px;'
    };

    modal.style.cssText = `
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      ${sizeStyles[size]}
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease;
    `;

    let modalHTML = '';

    if (title || showClose) {
      modalHTML += `
        <div style="padding: 20px 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
          ${title ? `<h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #1a1a1a;">${title}</h3>` : '<div></div>'}
          ${showClose ? `
            <button class="modal-close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; transition: background 0.2s;">×</button>
          ` : ''}
        </div>
      `;
    }

    modalHTML += `
      <div class="modal-content" style="padding: 24px; overflow-y: auto; flex: 1;">
        ${content}
      </div>
    `;

    modal.innerHTML = modalHTML;
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    // Add event listeners
    if (showClose) {
      const closeBtn = modal.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.onclick = () => this.close();
        closeBtn.onmouseover = () => closeBtn.style.background = '#f3f4f6';
        closeBtn.onmouseout = () => closeBtn.style.background = 'none';
      }
    }

    if (closeOnBackdrop) {
      backdrop.onclick = (e) => {
        if (e.target === backdrop) {
          this.close();
        }
      };
    }

    this.activeModal = { backdrop, modal };

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return modal;
  }

  close() {
    if (this.activeModal) {
      const { backdrop, modal } = this.activeModal;

      backdrop.style.animation = 'fadeOut 0.2s ease';
      modal.style.animation = 'slideDown 0.3s ease';

      setTimeout(() => {
        backdrop.remove();
        document.body.style.overflow = '';
        this.activeModal = null;
      }, 200);
    }
  }

  confirm(message, options = {}) {
    const {
      title = 'Konfirmasi',
      onConfirm = () => {},
      onCancel = () => {},
      confirmText = 'Ya',
      cancelText = 'Batal'
    } = options;

    const content = `
      <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6;">${message}</p>
      <div style="display: flex; gap: 12px; margin-top: 24px; justify-content: flex-end;">
        <button class="modal-cancel-btn" style="padding: 10px 20px; border: 1px solid #d1d5db; background: white; border-radius: 6px; cursor: pointer; font-size: 14px; color: #374151; transition: all 0.2s;">${cancelText}</button>
        <button class="modal-confirm-btn" style="padding: 10px 20px; border: none; background: #1E5A8D; color: white; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.2s;">${confirmText}</button>
      </div>
    `;

    this.open(content, { title, size: 'small' });

    const modal = this.activeModal.modal;

    const confirmBtn = modal.querySelector('.modal-confirm-btn');
    const cancelBtn = modal.querySelector('.modal-cancel-btn');

    confirmBtn.onclick = () => {
      this.close();
      onConfirm();
    };

    cancelBtn.onclick = () => {
      this.close();
      onCancel();
    };

    // Hover effects
    confirmBtn.onmouseover = () => confirmBtn.style.background = '#155070';
    confirmBtn.onmouseout = () => confirmBtn.style.background = '#1E5A8D';
    cancelBtn.onmouseover = () => cancelBtn.style.background = '#f9fafb';
    cancelBtn.onmouseout = () => cancelBtn.style.background = 'white';
  }

  alert(message, options = {}) {
    const { title = 'Informasi', onClose = () => {} } = options;

    const content = `
      <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6;">${message}</p>
      <div style="display: flex; gap: 12px; margin-top: 24px; justify-content: flex-end;">
        <button class="modal-ok-btn" style="padding: 10px 20px; border: none; background: #1E5A8D; color: white; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.2s;">OK</button>
      </div>
    `;

    this.open(content, { title, size: 'small' });

    const modal = this.activeModal.modal;
    const okBtn = modal.querySelector('.modal-ok-btn');

    okBtn.onclick = () => {
      this.close();
      onClose();
    };

    okBtn.onmouseover = () => okBtn.style.background = '#155070';
    okBtn.onmouseout = () => okBtn.style.background = '#1E5A8D';
  }
}

// Create global modal instance
const modal = new ModalSystem();

// Add animation keyframes
if (!document.getElementById('modal-animations')) {
  const style = document.createElement('style');
  style.id = 'modal-animations';
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideDown {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(30px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ═══════════════════════════════════════════════════════════════
// SHOPPING CART SYSTEM
// ═══════════════════════════════════════════════════════════════
class ShoppingCart {
  constructor() {
    this.cart = Storage.get('lvre_cart', []);
    this.init();
  }

  init() {
    this.updateCartBadge();
    this.bindEvents();
  }

  bindEvents() {
    // Listen for storage changes (sync across tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === 'lvre_cart') {
        this.cart = JSON.parse(e.newValue);
        this.updateCartBadge();
      }
    });
  }

  addItem(product, variant = {}, quantity = 1) {
    const existingItem = this.cart.find(item =>
      item.id === product.id &&
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        variant: variant,
        quantity: quantity,
        addedAt: new Date().toISOString()
      });
    }

    this.save();
    this.updateCartBadge();

    notify.success(`${product.name} ditambahkan ke keranjang`);

    return this.getCartSummary();
  }

  removeItem(itemId, variant = {}) {
    const index = this.cart.findIndex(item =>
      item.id === itemId &&
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (index !== -1) {
      const removedItem = this.cart[index];
      this.cart.splice(index, 1);
      this.save();
      this.updateCartBadge();

      notify.success(`${removedItem.name} dihapus dari keranjang`);

      return true;
    }

    return false;
  }

  updateQuantity(itemId, variant = {}, quantity) {
    const item = this.cart.find(item =>
      item.id === itemId &&
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (item) {
      if (quantity <= 0) {
        return this.removeItem(itemId, variant);
      }

      item.quantity = quantity;
      this.save();
      this.updateCartBadge();

      return true;
    }

    return false;
  }

  getCart() {
    return this.cart;
  }

  getCartSummary() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = this.cart.reduce((sum, item) => {
      const price = item.originalPrice ? item.originalPrice : item.price;
      return sum + (price * item.quantity);
    }, 0);
    const totalDiscount = this.cart.reduce((sum, item) => {
      if (!item.originalPrice) return sum;
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }, 0);
    const finalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
      totalItems,
      totalPrice,
      totalDiscount,
      finalPrice,
      itemCount: this.cart.length
    };
  }

  clear() {
    this.cart = [];
    this.save();
    this.updateCartBadge();
    notify.success('Keranjang dikosongkan');
  }

  save() {
    Storage.set('lvre_cart', this.cart);

    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  }

  updateCartBadge() {
    const summary = this.getCartSummary();
    const badgeElements = document.querySelectorAll('.cart-badge');

    badgeElements.forEach(badge => {
      if (summary.totalItems > 0) {
        badge.textContent = summary.totalItems > 99 ? '99+' : summary.totalItems;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    });
  }
}

// Create global cart instance
const cart = new ShoppingCart();

// ═══════════════════════════════════════════════════════════════
// WISHLIST SYSTEM
// ═══════════════════════════════════════════════════════════════
class Wishlist {
  constructor() {
    this.wishlist = Storage.get('lvre_wishlist', []);
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('storage', (e) => {
      if (e.key === 'lvre_wishlist') {
        this.wishlist = JSON.parse(e.newValue);
        this.updateWishlistButtons();
      }
    });
  }

  addItem(product) {
    const exists = this.wishlist.find(item => item.id === product.id);

    if (!exists) {
      this.wishlist.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        addedAt: new Date().toISOString()
      });

      this.save();
      notify.success(`${product.name} ditambahkan ke wishlist`);
      return true;
    }

    notify.info(`${product.name} sudah ada di wishlist`);
    return false;
  }

  removeItem(productId) {
    const index = this.wishlist.findIndex(item => item.id === productId);

    if (index !== -1) {
      const removedItem = this.wishlist[index];
      this.wishlist.splice(index, 1);
      this.save();
      this.updateWishlistButtons();

      notify.success(`${removedItem.name} dihapus dari wishlist`);
      return true;
    }

    return false;
  }

  isInWishlist(productId) {
    return this.wishlist.some(item => item.id === productId);
  }

  getWishlist() {
    return this.wishlist;
  }

  clear() {
    this.wishlist = [];
    this.save();
    this.updateWishlistButtons();
    notify.success('Wishlist dikosongkan');
  }

  save() {
    Storage.set('lvre_wishlist', this.wishlist);
    window.dispatchEvent(new Event('storage'));
  }

  updateWishlistButtons() {
    const wishlistButtons = document.querySelectorAll('.product-wishlist, .wishlist-btn');

    wishlistButtons.forEach(btn => {
      const productId = btn.dataset.productId;
      if (productId && this.isInWishlist(productId)) {
        btn.classList.add('active');
        if (btn.querySelector('svg')) {
          btn.querySelector('svg').style.fill = '#EF4444';
        }
      }
    });
  }

  toggleProduct(product) {
    if (this.isInWishlist(product.id)) {
      this.removeItem(product.id);
      return false;
    } else {
      this.addItem(product);
      return true;
    }
  }
}

// Create global wishlist instance
const wishlist = new Wishlist();

// ═══════════════════════════════════════════════════════════════
// USER AUTHENTICATION SYSTEM
// ═══════════════════════════════════════════════════════════════
class UserSystem {
  constructor() {
    this.currentUser = Storage.get('lvre_current_user', null);
    this.users = Storage.get('lvre_users', []);
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateUI();
  }

  bindEvents() {
    window.addEventListener('storage', (e) => {
      if (e.key === 'lvre_current_user') {
        this.currentUser = JSON.parse(e.newValue);
        this.updateUI();
      }
    });
  }

  register(userData) {
    // Check if email already exists
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      notify.error('Email sudah terdaftar');
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      password: userData.password,
      isAdmin: userData.isAdmin || false,
      createdAt: new Date().toISOString(),
      addresses: []
    };

    this.users.push(newUser);
    Storage.set('lvre_users', this.users);

    notify.success('Registrasi berhasil! Silakan login');
    return true;
  }

  login(email, password) {
    const user = this.users.find(u => u.email === email && u.password === password);

    if (user) {
      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      };

      Storage.set('lvre_current_user', this.currentUser);
      this.updateUI();

      notify.success(`Selamat datang, ${user.name}!`);
      return true;
    }

    notify.error('Email atau password salah');
    return false;
  }

  logout() {
    this.currentUser = null;
    Storage.remove('lvre_current_user');
    this.updateUI();

    notify.success('Berhasil logout');

    // Redirect to home after short delay
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  isAdmin() {
    return this.currentUser && this.currentUser.isAdmin;
  }

  updateProfile(updatedData) {
    if (!this.currentUser) return false;

    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex === -1) return false;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updatedData
    };

    this.currentUser = {
      ...this.currentUser,
      ...updatedData
    };

    Storage.set('lvre_users', this.users);
    Storage.set('lvre_current_user', this.currentUser);

    notify.success('Profil berhasil diperbarui');
    return true;
  }

  updateUI() {
    const accountButtons = document.querySelectorAll('[data-user-action]');

    accountButtons.forEach(btn => {
      const action = btn.dataset.userAction;

      if (action === 'login') {
        btn.style.display = this.isLoggedIn() ? 'none' : '';
      } else if (action === 'account') {
        btn.style.display = this.isLoggedIn() ? '' : 'none';
        if (this.isLoggedIn()) {
          btn.innerHTML = `<span style="font-size: 14px;">${this.currentUser.name.split(' ')[0]}</span>`;
        }
      }
    });
  }

  getUser() {
    return this.currentUser;
  }

  getAllUsers() {
    return this.users;
  }

  updateUser(userId, updatedData) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updatedData
    };

    Storage.set('lvre_users', this.users);

    return true;
  }

  deleteUser(userId) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    Storage.set('lvre_users', this.users);

    notify.success('User berhasil dihapus');
    return true;
  }
}

// Create global user instance
const user = new UserSystem();

// ═══════════════════════════════════════════════════════════════
// ORDER SYSTEM
// ═══════════════════════════════════════════════════════════════
class OrderSystem {
  constructor() {
    this.orders = Storage.get('lvre_orders', []);
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('storage', (e) => {
      if (e.key === 'lvre_orders') {
        this.orders = JSON.parse(e.newValue);
      }
    });
  }

  createOrder(orderData) {
    const newOrder = {
      id: 'ORD' + Date.now().toString().slice(-8),
      userId: user.getUser()?.id || 'guest',
      items: orderData.items,
      shipping: orderData.shipping,
      payment: orderData.payment,
      subtotal: orderData.subtotal,
      shippingCost: orderData.shippingCost,
      discount: orderData.discount,
      total: orderData.total,
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.unshift(newOrder);
    this.save();

    notify.success(`Pesanan ${newOrder.id} berhasil dibuat`);

    return newOrder;
  }

  updateOrderStatus(orderId, status, paymentStatus = null) {
    const order = this.orders.find(o => o.id === orderId);

    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();

      if (paymentStatus) {
        order.paymentStatus = paymentStatus;
      }

      this.save();

      notify.success(`Status pesanan ${orderId} diperbarui`);
      return true;
    }

    return false;
  }

  getOrder(orderId) {
    return this.orders.find(o => o.id === orderId);
  }

  getUserOrders(userId) {
    return this.orders.filter(o => o.userId === userId);
  }

  getAllOrders() {
    return this.orders;
  }

  cancelOrder(orderId) {
    const order = this.orders.find(o => o.id === orderId);

    if (order && (order.status === 'pending' || order.status === 'confirmed')) {
      order.status = 'cancelled';
      order.updatedAt = new Date().toISOString();
      this.save();

      notify.success(`Pesanan ${orderId} dibatalkan`);
      return true;
    }

    notify.error('Pesanan tidak dapat dibatalkan');
    return false;
  }

  save() {
    Storage.set('lvre_orders', this.orders);
    window.dispatchEvent(new Event('storage'));
  }

  getOrderStats() {
    const totalOrders = this.orders.length;
    const totalRevenue = this.orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);

    const statusCounts = {
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    this.orders.forEach(order => {
      statusCounts[order.status]++;
    });

    return {
      totalOrders,
      totalRevenue,
      statusCounts
    };
  }
}

// Create global order instance
const orders = new OrderSystem();

// ═══════════════════════════════════════════════════════════════
// SEARCH SYSTEM
// ═══════════════════════════════════════════════════════════════
class SearchSystem {
  constructor() {
    this.searchHistory = Storage.get('lvre_search_history', []);
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Search button click handlers
    const searchButtons = document.querySelectorAll('[data-search-trigger]');
    searchButtons.forEach(btn => {
      btn.addEventListener('click', () => this.openSearch());
    });

    // Close search on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeSearch();
      }
    });
  }

  openSearch() {
    const searchHTML = `
      <div style="margin-bottom: 20px;">
        <input
          type="text"
          id="globalSearchInput"
          placeholder="Cari produk..."
          style="width: 100%; padding: 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; outline: none; transition: border-color 0.2s;"
          autofocus
        >
      </div>
      <div id="searchResults" style="max-height: 400px; overflow-y: auto;"></div>
    `;

    const searchModal = modal.open(searchHTML, {
      title: 'Cari Produk',
      size: 'large',
      showClose: true
    });

    const searchInput = document.getElementById('globalSearchInput');
    searchInput?.addEventListener('input', (e) => {
      this.performSearch(e.target.value);
    });

    searchInput?.focus();
  }

  closeSearch() {
    modal.close();
  }

  performSearch(query) {
    // This will be implemented by pages that have products
    const searchEvent = new CustomEvent('lvre:search', { detail: { query } });
    document.dispatchEvent(searchEvent);
  }

  addToSearchHistory(query) {
    if (!query.trim()) return;

    // Remove if exists
    this.searchHistory = this.searchHistory.filter(q => q.toLowerCase() !== query.toLowerCase());

    // Add to beginning
    this.searchHistory.unshift(query);

    // Keep only last 10
    this.searchHistory = this.searchHistory.slice(0, 10);

    Storage.set('lvre_search_history', this.searchHistory);
  }

  getSearchHistory() {
    return this.searchHistory;
  }

  clearSearchHistory() {
    this.searchHistory = [];
    Storage.remove('lvre_search_history');
  }
}

// Create global search instance
const search = new SearchSystem();

// ═══════════════════════════════════════════════════════════════
// GLOBAL EVENT HANDLERS
// ═══════════════════════════════════════════════════════════════

// ── MOBILE MENU FUNCTIONALITY (Must run immediately) ─────────────────
console.log('🎯 INITIALIZING MOBILE MENU...'); // Debug: Pastikan function dipanggil

(function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');

  console.log('=== MOBILE MENU INITIALIZATION ==='); // Debug log
  console.log('Mobile menu button:', mobileMenuBtn); // Debug log
  console.log('Mobile nav:', mobileNav); // Debug log

  if (mobileMenuBtn && mobileNav) {
    // Debug: Check initial state
    console.log('Initial button classes:', mobileMenuBtn.classList.toString());
    console.log('Initial nav classes:', mobileNav.classList.toString());

    // Debug: Check initial computed styles
    const initialNavStyles = window.getComputedStyle(mobileNav);
    console.log('Initial nav display:', initialNavStyles.display);
    console.log('Initial nav visibility:', initialNavStyles.visibility);
    console.log('Initial nav z-index:', initialNavStyles.zIndex);
    console.log('Initial nav position:', initialNavStyles.position);

    // Toggle menu on hamburger button click
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event from bubbling
      e.preventDefault();

      console.log('=== HAMBURGER CLICKED ==='); // Debug log

      // Get current state
      const wasActive = mobileNav.classList.contains('active');

      mobileMenuBtn.classList.toggle('active');
      mobileNav.classList.toggle('active');

      const isActive = mobileNav.classList.contains('active');

      console.log('Mobile nav state changed:', wasActive, '→', isActive); // Debug log
      console.log('Mobile nav classes:', mobileNav.classList.toString()); // Debug log

      // Debug: Check computed styles
      const navStyles = window.getComputedStyle(mobileNav);
      console.log('Mobile nav display:', navStyles.display);
      console.log('Mobile nav visibility:', navStyles.visibility);
      console.log('Mobile nav z-index:', navStyles.zIndex);
      console.log('Mobile nav position:', navStyles.position);

      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close mobile menu when clicking search button in mobile nav
    const mobileSearchButton = mobileNav.querySelector('[data-search-trigger]');
    if (mobileSearchButton) {
      mobileSearchButton.addEventListener('click', () => {
        // Small delay to allow search to open first
        setTimeout(() => {
          mobileMenuBtn.classList.remove('active');
          mobileNav.classList.remove('active');
          document.body.style.overflow = '';
        }, 100);
      });
    }

    // Close mobile menu when clicking outside (on the nav itself when open)
    mobileNav.addEventListener('click', (e) => {
      // Only close if clicking directly on nav, not on its children
      if (e.target === mobileNav && mobileNav.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu on window resize if open
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    console.log('Mobile menu initialized successfully!'); // Debug log
  } else {
    console.error('Mobile menu elements not found!'); // Debug log
  }
})();

// Initialize on DOM ready for other functionality
document.addEventListener('DOMContentLoaded', () => {
  // Add page transition effects
  document.body.classList.add('page-loaded');

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Add fade-in animations for elements
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
  });
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.body.classList.add('page-hidden');
  } else {
    document.body.classList.remove('page-hidden');
  }
});

// Export for use in other scripts
window.LVRE = {
  Storage,
  notify,
  modal,
  cart,
  wishlist,
  user,
  orders,
  search
};

console.log('LVRE Application Initialized');