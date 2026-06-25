// ═══════════════════════════════════════════════════════════════
// LVRE - Checkout/Pembayaran Page
// Checkout flow, form validation, payment processing, order creation
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// CHECKOUT PAGE CLASS
// ═══════════════════════════════════════════════════════════════
class CheckoutPage {
  constructor() {
    this.cartItems = LVRE.cart.getCart();
    this.checkoutData = {
      shipping: {
        recipient: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postalCode: ''
      },
      paymentMethod: 'transfer',
      shippingMethod: 'regular',
      notes: ''
    };

    this.shippingCost = 0;
    this.isProcessing = false;

    this.init();
  }

  init() {
    // Check if cart is empty
    if (this.cartItems.length === 0) {
      this.showEmptyCartState();
      return;
    }

    // Check if user is logged in
    if (!LVRE.user.isLoggedIn()) {
      this.showLoginRequired();
      return;
    }

    this.bindEvents();
    this.loadUserData();
    this.updateUI();
  }

  bindEvents() {
    // Form inputs
    const formInputs = document.querySelectorAll('.checkout-form input, .checkout-form textarea, .checkout-form select');
    formInputs.forEach(input => {
      input.addEventListener('change', () => this.saveFormData());
      input.addEventListener('input', () => this.validateForm());
    });

    // Payment method selection
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('payment-radio')) {
        this.checkoutData.paymentMethod = e.target.value;
        this.updatePaymentDisplay();
      }
    });

    // Shipping method selection
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('checkout-shipping-radio')) {
        this.checkoutData.shippingMethod = e.target.value;
        this.calculateShipping();
        this.updateSummary();
      }
    });

    // Place order button
    const placeOrderBtn = document.querySelector('.place-order-btn');
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', () => this.placeOrder());
    }

    // Edit cart button
    const editCartBtn = document.querySelector('.edit-cart-btn');
    if (editCartBtn) {
      editCartBtn.addEventListener('click', () => {
        window.location.href = 'keranjang.html';
      });
    }

    // Address selection (if user has saved addresses)
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('address-radio')) {
        this.loadSelectedAddress(e.target.value);
      }
    });
  }

  loadUserData() {
    const user = LVRE.user.getUser();
    if (!user) return;

    // Pre-fill form with user data
    const emailInput = document.getElementById('shippingEmail');
    const phoneInput = document.getElementById('shippingPhone');
    const firstNameInput = document.getElementById('shippingFirstName');
    const lastNameInput = document.getElementById('shippingLastName');

    if (emailInput) emailInput.value = user.email || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (firstNameInput) firstNameInput.value = user.name?.split(' ')[0] || '';
    if (lastNameInput) lastNameInput.value = user.name?.split(' ').slice(1).join(' ') || '';
  }

  loadSelectedAddress(addressId) {
    const user = LVRE.user.getUser();
    if (!user || !user.addresses) return;

    const address = user.addresses.find(a => a.id === addressId);
    if (!address) return;

    // Fill form with selected address
    const nameInput = document.getElementById('shippingName');
    const phoneInput = document.getElementById('shippingPhone');
    const addressInput = document.getElementById('shippingAddress');
    const cityInput = document.getElementById('shippingCity');
    const provinceInput = document.getElementById('shippingProvince');
    const postalInput = document.getElementById('shippingPostal');

    if (nameInput) nameInput.value = address.recipient || '';
    if (phoneInput) phoneInput.value = address.phone || '';
    if (addressInput) addressInput.value = address.address || '';
    if (cityInput) cityInput.value = address.city || '';
    if (provinceInput) provinceInput.value = address.province || '';
    if (postalInput) postalInput.value = address.postalCode || '';

    this.validateForm();
  }

  saveFormData() {
    const firstName = document.getElementById('shippingFirstName')?.value || '';
    const lastName = document.getElementById('shippingLastName')?.value || '';

    this.checkoutData.shipping = {
      fullName: `${firstName} ${lastName}`.trim(),
      firstName: firstName,
      lastName: lastName,
      email: document.getElementById('shippingEmail')?.value || '',
      phone: document.getElementById('shippingPhone')?.value || '',
      address: document.getElementById('shippingAddress')?.value || '',
      city: document.getElementById('shippingCity')?.value || '',
      province: document.getElementById('shippingProvince')?.value || '',
      postalCode: document.getElementById('shippingPostal')?.value || ''
    };

    this.checkoutData.notes = document.getElementById('orderNotes')?.value || '';

    // Save to session storage for recovery
    sessionStorage.setItem('lvre_checkout_data', JSON.stringify(this.checkoutData));
  }

  validateForm() {
    const requiredFields = [
      'shippingEmail',
      'shippingPhone',
      'shippingFirstName',
      'shippingLastName',
      'shippingAddress',
      'shippingCity',
      'shippingProvince',
      'shippingPostal'
    ];

    let isValid = true;
    requiredFields.forEach(fieldId => {
      const input = document.getElementById(fieldId);
      if (input && !input.value.trim()) {
        isValid = false;
        input.classList.add('invalid');
      } else if (input) {
        input.classList.remove('invalid');
      }
    });

    // Validate phone number format
    const phoneInput = document.getElementById('shippingPhone');
    if (phoneInput) {
      const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
      if (!phoneRegex.test(phoneInput.value.replace(/[\s-]/g, ''))) {
        isValid = false;
        phoneInput.classList.add('invalid');
      }
    }

    // Update place order button state
    const placeOrderBtn = document.querySelector('.place-order-btn');
    if (placeOrderBtn) {
      placeOrderBtn.disabled = !isValid;
    }

    return isValid;
  }

  calculateShipping() {
    const cartSummary = this.getCartSummary();

    // Free shipping threshold
    const freeShippingThreshold = 200000;

    if (cartSummary.subtotal >= freeShippingThreshold) {
      this.shippingCost = 0;
      return;
    }

    const shippingRates = {
      regular: 15000,
      express: 25000,
      sameday: 40000
    };

    this.shippingCost = shippingRates[this.checkoutData.shippingMethod] || 15000;
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
    const total = subtotal + shipping;

    return {
      subtotal,
      totalDiscount,
      shipping,
      total,
      itemCount: this.cartItems.length
    };
  }

  updateUI() {
    this.updateOrderItems();
    this.updateSummary();
    this.updatePaymentDisplay();
    this.validateForm();
  }

  updateOrderItems() {
    const orderItemsContainer = document.querySelector('.order-items');
    if (!orderItemsContainer) return;

    orderItemsContainer.innerHTML = this.cartItems.map(item => {
      const variant = item.variant || {};
      const variantText = Object.values(variant).filter(v => v).join(' / ') || '-';

      return `
        <div class="order-item">
          <img src="${item.image}" alt="${item.name}" class="order-item-image">
          <div class="order-item-details">
            <div class="order-item-brand">${item.brand}</div>
            <div class="order-item-name">${item.name}</div>
            <div class="order-item-variant">${variantText}</div>
            <div class="order-item-qty">Qty: ${item.quantity}</div>
          </div>
          <div class="order-item-price">
            Rp ${(item.price * item.quantity).toLocaleString('id-ID')}
          </div>
        </div>
      `;
    }).join('');
  }

  updateSummary() {
    this.calculateShipping();

    const summary = this.getCartSummary();

    // Update summary elements
    const subtotalEl = document.querySelector('.checkout-summary .subtotal .value');
    const discountEl = document.querySelector('.checkout-summary .discount .value');
    const shippingEl = document.querySelector('.checkout-summary .shipping .value');
    const totalEl = document.querySelector('.checkout-summary .total .value');

    if (subtotalEl) subtotalEl.textContent = `Rp ${summary.subtotal.toLocaleString('id-ID')}`;
    if (discountEl) discountEl.textContent = `−Rp ${summary.totalDiscount.toLocaleString('id-ID')}`;
    if (shippingEl) {
      shippingEl.textContent = summary.shipping === 0 ? 'Gratis' : `Rp ${summary.shipping.toLocaleString('id-ID')}`;
    }
    if (totalEl) totalEl.textContent = `Rp ${summary.total.toLocaleString('id-ID')}`;
  }

  updatePaymentDisplay() {
    const paymentDetails = document.querySelector('.payment-details');
    if (!paymentDetails) return;

    const paymentMethods = {
      transfer: {
        name: 'Transfer Bank',
        description: 'Transfer ke rekening berikut:',
        accounts: [
          { bank: 'BCA', number: '1234567890', holder: 'LVRE Indonesia' },
          { bank: 'Mandiri', number: '0987654321', holder: 'LVRE Indonesia' },
          { bank: 'BNI', number: '5678901234', holder: 'LVRE Indonesia' }
        ]
      },
      ewallet: {
        name: 'E-Wallet',
        description: 'Pilih e-wallet untuk pembayaran:',
        options: ['GoPay', 'OVO', 'Dana', 'ShopeePay', 'LinkAja']
      },
      cod: {
        name: 'COD (Bayar di Tempat)',
        description: 'Bayar tunai saat pesanan sampai',
        note: 'Pastikan Anda memiliki uang pas saat kurir mengantar pesanan.'
      },
      card: {
        name: 'Kartu Kredit/Debit',
        description: 'Pembayaran aman dengan kartu',
        note: 'Kami menerima kartu Visa dan Mastercard'
      }
    };

    const method = paymentMethods[this.checkoutData.paymentMethod];
    if (!method) return;

    let paymentHTML = `
      <div class="payment-info">
        <p style="margin: 0 0 16px 0; font-weight: 500;">${method.description}</p>
    `;

    if (this.checkoutData.paymentMethod === 'transfer') {
      paymentHTML += `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${method.accounts.map(account => `
            <div style="padding: 12px; background: #F9FAFB; border-radius: 6px; border: 1px solid #E5E7EB;">
              <div style="font-weight: 600; color: #1a1a1a;">${account.bank}</div>
              <div style="font-size: 16px; color: #1E5A8D; font-weight: 500; margin: 4px 0;">${account.number}</div>
              <div style="font-size: 13px; color: #666;">a.n. ${account.holder}</div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (this.checkoutData.paymentMethod === 'ewallet') {
      paymentHTML += `
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${method.options.map(option => `
            <div style="padding: 8px 16px; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#E5E7EB'" onmouseout="this.style.background='#F9FAFB'">
              ${option}
            </div>
          `).join('')}
        </div>
      `;
    } else if (this.checkoutData.paymentMethod === 'cod' || this.checkoutData.paymentMethod === 'card') {
      paymentHTML += `
        <div style="background: #FEF3C7; padding: 12px; border-radius: 6px; border-left: 4px solid #F59E0B; font-size: 14px; color: #92400E;">
          ${method.note}
        </div>
      `;
    }

    paymentHTML += `</div>`;

    paymentDetails.innerHTML = paymentHTML;
  }

  placeOrder() {
    if (this.isProcessing) return;

    if (!this.validateForm()) {
      LVRE.notify.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    this.isProcessing = true;

    const placeOrderBtn = document.querySelector('.place-order-btn');
    if (placeOrderBtn) {
      placeOrderBtn.disabled = true;
      placeOrderBtn.innerHTML = `
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-dasharray="4 4"/>
        </svg>
        Memproses...
      `;
    }

    // Simulate processing delay
    setTimeout(() => {
      this.createOrder();
    }, 2000);
  }

  createOrder() {
    const summary = this.getCartSummary();

    const orderData = {
      items: this.cartItems,
      shipping: this.checkoutData.shipping,
      payment: {
        method: this.checkoutData.paymentMethod,
        status: 'unpaid'
      },
      shippingMethod: this.checkoutData.shippingMethod,
      subtotal: summary.subtotal,
      shippingCost: summary.shipping,
      discount: summary.totalDiscount,
      total: summary.total,
      notes: this.checkoutData.notes
    };

    // Create order using OrderSystem
    const order = LVRE.orders.createOrder(orderData);

    // Clear cart
    LVRE.cart.clear();
    this.cartItems = [];

    // Clear checkout data from session
    sessionStorage.removeItem('lvre_checkout_data');

    // Show success modal and redirect
    this.showOrderConfirmation(order);
  }

  showOrderConfirmation(order) {
    const confirmationHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="width: 80px; height: 80px; background: #D1FAE5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
          <svg width="40" height="40" fill="none" stroke="#10B981" stroke-width="2" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h3 style="margin: 0 0 8px 0; font-size: 20px; color: #1a1a1a;">Pesanan Berhasil!</h3>
        <p style="margin: 0 0 20px 0; color: #666; font-size: 15px;">Nomor pesanan Anda:</p>
        <div style="font-size: 24px; font-weight: 700; color: #1E5A8D; margin-bottom: 24px;">${order.id}</div>
        <div style="background: #F9FAFB; padding: 16px; border-radius: 8px; margin-bottom: 20px; text-align: left;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666;">Total Pembayaran:</span>
            <span style="font-weight: 600;">Rp ${order.total.toLocaleString('id-ID')}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #666;">Metode Pembayaran:</span>
            <span style="font-weight: 600;">${this.getPaymentMethodName(order.payment.method)}</span>
          </div>
        </div>
        <div style="display: flex; gap: 12px; flex-direction: column;">
          <button onclick="window.location.href='history-transaksi.html'" style="padding: 12px 24px; background: #1E5A8D; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; width: 100%;">
            Lihat Detail Pesanan
          </button>
          <button onclick="window.location.href='katalog.html'" style="padding: 12px 24px; background: white; border: 1px solid #D1D5DB; border-radius: 6px; cursor: pointer; font-size: 14px; width: 100%;">
            Lanjut Belanja
          </button>
        </div>
      </div>
    `;

    LVRE.modal.open(confirmationHTML, {
      title: '',
      size: 'medium',
      showClose: false,
      backdrop: true,
      closeOnBackdrop: false
    });
  }

  getPaymentMethodName(method) {
    const names = {
      transfer: 'Transfer Bank',
      ewallet: 'E-Wallet',
      cod: 'COD',
      card: 'Kartu Kredit/Debit'
    };
    return names[method] || method;
  }

  showEmptyCartState() {
    const checkoutContent = document.querySelector('.checkout-content');
    if (checkoutContent) {
      checkoutContent.innerHTML = `
        <div style="text-align: center; padding: 80px 20px;">
          <div style="font-size: 64px; margin-bottom: 20px;">🛒</div>
          <h2 style="margin: 0 0 12px 0; font-size: 24px; color: #1a1a1a;">Keranjang Kosong</h2>
          <p style="margin: 0 0 32px 0; color: #666;">Anda belum memiliki item di keranjang</p>
          <a href="katalog.html" style="display: inline-block; padding: 12px 32px; background: #1E5A8D; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">
            Mulai Belanja
          </a>
        </div>
      `;
    }
  }

  showLoginRequired() {
    const checkoutContent = document.querySelector('.checkout-content');
    if (checkoutContent) {
      checkoutContent.innerHTML = `
        <div style="text-align: center; padding: 80px 20px;">
          <div style="font-size: 64px; margin-bottom: 20px;">🔐</div>
          <h2 style="margin: 0 0 12px 0; font-size: 24px; color: #1a1a1a;">Login Diperlukan</h2>
          <p style="margin: 0 0 32px 0; color: #666;">Silakan login terlebih dahulu untuk melanjutkan checkout</p>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button onclick="window.location.href='index.html'" style="padding: 12px 32px; background: #1E5A8D; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
              Login Sekarang
            </button>
            <a href="katalog.html" style="display: inline-block; padding: 12px 32px; background: white; border: 1px solid #D1D5DB; text-decoration: none; border-radius: 6px; font-size: 14px; color: #374151;">
              Belanja Dulu
            </a>
          </div>
        </div>
      `;
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Load saved checkout data if exists
  const savedCheckoutData = sessionStorage.getItem('lvre_checkout_data');
  if (savedCheckoutData) {
    try {
      window.savedCheckoutData = JSON.parse(savedCheckoutData);
    } catch (e) {
      console.error('Error loading saved checkout data:', e);
    }
  }

  window.checkoutPage = new CheckoutPage();
});
