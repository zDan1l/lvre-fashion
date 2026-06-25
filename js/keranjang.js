// ═══════════════════════════════════════════════════════════════
// LVRE - Shopping Cart/Keranjang Page
// Cart item management, quantity updates, removal, checkout flow
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// CART PAGE CLASS
// ═══════════════════════════════════════════════════════════════
class CartPage {
  constructor() {
    this.cartItems = LVRE.cart.getCart();
    this.couponCode = '';
    this.couponDiscount = 0;
    this.shippingMethod = 'regular';
    this.shippingCost = 0;

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateUI();
  }

  bindEvents() {
    // Quantity increment/decrement
    document.addEventListener('click', (e) => {
      if (e.target.closest('.qty-increase')) {
        const btn = e.target.closest('.qty-increase');
        const itemId = btn.dataset.itemId;
        const variant = JSON.parse(btn.dataset.variant || '{}');
        this.increaseQuantity(itemId, variant);
      } else if (e.target.closest('.qty-decrease')) {
        const btn = e.target.closest('.qty-decrease');
        const itemId = btn.dataset.itemId;
        const variant = JSON.parse(btn.dataset.variant || '{}');
        this.decreaseQuantity(itemId, variant);
      } else if (e.target.closest('.item-remove')) {
        const btn = e.target.closest('.item-remove');
        const itemId = btn.dataset.itemId;
        const variant = JSON.parse(btn.dataset.variant || '{}');
        this.removeItem(itemId, variant);
      }
    });

    // Coupon form
    window.toggleCoupon = () => this.toggleCouponForm();
    window.applyCoupon = () => this.applyCoupon();

    // Shipping method selection
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('shipping-radio')) {
        this.shippingMethod = e.target.value;
        this.calculateShipping();
        this.updateSummary();
      }
    });

    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
    }

    // Continue shopping button
    const continueShoppingBtn = document.querySelector('.continue-shopping-btn');
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener('click', () => {
        window.location.href = 'katalog.html';
      });
    }

    // Clear cart button
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => this.clearCart());
    }

    // Listen for cart updates from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'lvre_cart') {
        this.cartItems = JSON.parse(e.newValue);
        this.updateUI();
      }
    });
  }

  increaseQuantity(itemId, variant = {}) {
    const item = this.cartItems.find(i =>
      i.id === itemId && JSON.stringify(i.variant) === JSON.stringify(variant)
    );

    if (item) {
      if (item.quantity < 10) {
        LVRE.cart.updateQuantity(itemId, variant, item.quantity + 1);
        this.cartItems = LVRE.cart.getCart();
        this.updateUI();
      } else {
        LVRE.notify.warning('Maksimal quantity 10');
      }
    }
  }

  decreaseQuantity(itemId, variant = {}) {
    const item = this.cartItems.find(i =>
      i.id === itemId && JSON.stringify(i.variant) === JSON.stringify(variant)
    );

    if (item && item.quantity > 1) {
      LVRE.cart.updateQuantity(itemId, variant, item.quantity - 1);
      this.cartItems = LVRE.cart.getCart();
      this.updateUI();
    }
  }

  removeItem(itemId, variant = {}) {
    LVRE.modal.confirm('Hapus item ini dari keranjang?', {
      title: 'Hapus Item',
      confirmText: 'Hapus',
      cancelText: 'Batal',
      onConfirm: () => {
        LVRE.cart.removeItem(itemId, variant);
        this.cartItems = LVRE.cart.getCart();
        this.updateUI();
      }
    });
  }

  clearCart() {
    if (this.cartItems.length === 0) {
      LVRE.notify.info('Keranjang sudah kosong');
      return;
    }

    LVRE.modal.confirm('Kosongkan semua item dari keranjang?', {
      title: 'Kosongkan Keranjang',
      confirmText: 'Kosongkan',
      cancelText: 'Batal',
      onConfirm: () => {
        LVRE.cart.clear();
        this.cartItems = [];
        this.updateUI();
      }
    });
  }

  toggleCouponForm() {
    const couponForm = document.getElementById('couponForm');
    if (couponForm) {
      couponForm.classList.toggle('active');
    }
  }

  applyCoupon() {
    const couponInput = document.getElementById('couponInput');
    if (!couponInput) return;

    const code = couponInput.value.trim().toUpperCase();

    if (!code) {
      LVRE.notify.error('Masukkan kode kupon');
      return;
    }

    // Sample coupon codes (in real app, this would be validated on server)
    const coupons = {
      'HEMAT10': { type: 'percent', value: 10, minPurchase: 200000 },
      'DISKON50': { type: 'fixed', value: 50000, minPurchase: 300000 },
      'FREESHIP': { type: 'shipping', value: 0, minPurchase: 150000 }
    };

    const coupon = coupons[code];

    if (!coupon) {
      LVRE.notify.error('Kode kupon tidak valid');
      return;
    }

    const summary = this.getCartSummary();
    if (summary.subtotal < coupon.minPurchase) {
      LVRE.notify.error(`Min. pembelian Rp ${coupon.minPurchase.toLocaleString('id-ID')}`);
      return;
    }

    this.couponCode = code;
    this.couponDiscount = coupon.type === 'percent'
      ? summary.subtotal * (coupon.value / 100)
      : coupon.type === 'fixed'
        ? coupon.value
        : 0;

    if (coupon.type === 'shipping') {
      // Free shipping will be handled in calculateShipping
    }

    this.updateUI();

    if (coupon.type === 'percent') {
      LVRE.notify.success(`Diskon ${coupon.value}% diterapkan`);
    } else if (coupon.type === 'fixed') {
      LVRE.notify.success(`Diskon Rp ${coupon.value.toLocaleString('id-ID')} diterapkan`);
    } else {
      LVRE.notify.success('Gratis ongkir diterapkan');
    }

    // Clear input
    couponInput.value = '';
    this.toggleCouponForm();
  }

  calculateShipping() {
    const summary = this.getCartSummary();

    // Free shipping for orders above certain threshold
    const freeShippingThreshold = 200000;

    if (this.couponCode === 'FREESHIP' || summary.subtotal >= freeShippingThreshold) {
      this.shippingCost = 0;
      return;
    }

    // Shipping costs based on method
    const shippingRates = {
      regular: 15000,
      express: 25000,
      sameday: 40000
    };

    this.shippingCost = shippingRates[this.shippingMethod] || 15000;
  }

  getCartSummary() {
    const subtotal = this.cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const totalDiscount = this.cartItems.reduce((sum, item) => {
      if (!item.originalPrice) return sum;
      const itemDiscount = (item.originalPrice - item.price) * item.quantity;
      return sum + itemDiscount;
    }, 0);

    const shipping = this.shippingCost;
    const couponDiscount = this.couponDiscount;
    const total = subtotal - couponDiscount + shipping;

    return {
      subtotal,
      totalDiscount,
      shipping,
      couponDiscount,
      total,
      itemCount: this.cartItems.length
    };
  }

  updateUI() {
    this.updateCartItems();
    this.updateSummary();
    this.updateEmptyState();
  }

  updateCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;

    if (this.cartItems.length === 0) {
      cartItemsContainer.innerHTML = '';
      return;
    }

    cartItemsContainer.innerHTML = this.cartItems.map(item => {
      const variant = item.variant || {};
      const variantText = Object.values(variant).filter(v => v).join(' / ') || '-';

      return `
        <div class="cart-item" data-item-id="${item.id}">
          <div class="item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="item-details">
            <div class="item-brand">${item.brand}</div>
            <a href="detail.html?id=${item.id}" class="item-name">${item.name}</a>
            <div class="item-variant">Variasi: ${variantText}</div>
            <div class="item-price">
              Rp ${item.price.toLocaleString('id-ID')}
              ${item.originalPrice ? `<span class="price-original">Rp ${item.originalPrice.toLocaleString('id-ID')}</span>` : ''}
            </div>
          </div>
          <div class="item-quantity">
            <div class="qty-wrapper">
              <button class="qty-decrease" data-item-id="${item.id}" data-variant='${JSON.stringify(variant)}' ${item.quantity <= 1 ? 'disabled' : ''}>
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M5 12h14"/>
                </svg>
              </button>
              <input type="number" class="qty-input" value="${item.quantity}" min="1" max="10" readonly>
              <button class="qty-increase" data-item-id="${item.id}" data-variant='${JSON.stringify(variant)}' ${item.quantity >= 10 ? 'disabled' : ''}>
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="item-total">
            <div class="total-price">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</div>
            <button class="item-remove" data-item-id="${item.id}" data-variant='${JSON.stringify(variant)}'>
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
              Hapus
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  updateSummary() {
    this.calculateShipping();

    const summary = this.getCartSummary();

    // Update summary elements
    const subtotalEl = document.querySelector('.summary-subtotal .value');
    const discountEl = document.querySelector('.summary-discount .value');
    const shippingEl = document.querySelector('.summary-shipping .value');
    const couponEl = document.querySelector('.summary-coupon .value');
    const totalEl = document.querySelector('.summary-total .value');

    if (subtotalEl) subtotalEl.textContent = `Rp ${summary.subtotal.toLocaleString('id-ID')}`;
    if (discountEl) discountEl.textContent = `−Rp ${summary.totalDiscount.toLocaleString('id-ID')}`;
    if (shippingEl) shippingEl.textContent = summary.shipping === 0 ? 'Gratis' : `Rp ${summary.shipping.toLocaleString('id-ID')}`;
    if (couponEl) couponEl.textContent = `−Rp ${summary.couponDiscount.toLocaleString('id-ID')}`;
    if (totalEl) totalEl.textContent = `Rp ${summary.total.toLocaleString('id-ID')}`;

    // Update shipping method selection
    this.updateShippingMethods();

    // Update applied coupon
    this.updateCouponDisplay();
  }

  updateShippingMethods() {
    const shippingOptions = document.querySelectorAll('.shipping-radio');
    shippingOptions.forEach(option => {
      option.checked = option.value === this.shippingMethod;
    });
  }

  updateCouponDisplay() {
    const appliedCouponEl = document.querySelector('.applied-coupon');
    if (appliedCouponEl) {
      if (this.couponCode) {
        appliedCouponEl.innerHTML = `
          <span class="coupon-code">${this.couponCode}</span>
          <button onclick="window.cartPage.removeCoupon()" style="background: none; border: none; color: #EF4444; cursor: pointer; margin-left: 8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        `;
        appliedCouponEl.style.display = 'flex';
      } else {
        appliedCouponEl.style.display = 'none';
      }
    }
  }

  removeCoupon() {
    this.couponCode = '';
    this.couponDiscount = 0;
    this.updateUI();
    LVRE.notify.success('Kupon dihapus');
  }

  updateEmptyState() {
    const emptyStateEl = document.querySelector('.cart-empty-state');
    const cartContentEl = document.querySelector('.cart-content');

    if (this.cartItems.length === 0) {
      if (emptyStateEl) emptyStateEl.style.display = 'block';
      if (cartContentEl) cartContentEl.style.display = 'none';
    } else {
      if (emptyStateEl) emptyStateEl.style.display = 'none';
      if (cartContentEl) cartContentEl.style.display = 'block';
    }
  }

  proceedToCheckout() {
    if (this.cartItems.length === 0) {
      LVRE.notify.error('Keranjang kosong');
      return;
    }

    // Check if user is logged in
    if (!LVRE.user.isLoggedIn()) {
      LVRE.modal.confirm('Silakan login terlebih dahulu untuk melanjutkan checkout', {
        title: 'Login Diperlukan',
        confirmText: 'Login',
        cancelText: 'Belanja Dulu',
        onConfirm: () => {
          // Store checkout redirect in session
          sessionStorage.setItem('lvre_checkout_redirect', 'true');
          window.location.href = 'index.html';
        }
      });
      return;
    }

    // Proceed to checkout
    window.location.href = 'pembayaran.html';
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  window.cartPage = new CartPage();
});
