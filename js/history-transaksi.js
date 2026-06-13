// ═══════════════════════════════════════════════════════════════
// LVRE - Order History/Transaction History Page
// Interactive order tracking, management, and reorder functionality
// ═══════════════════════════════════════════════════════════════

class OrderHistoryPage {
  constructor() {
    this.orders = [];
    this.currentFilter = 'all';
    this.currentPage = 1;
    this.ordersPerPage = 10;

    this.init();
  }

  init() {
    this.loadOrders();
    this.bindEvents();
    this.renderOrders();
    this.updateStatistics();
  }

  loadOrders() {
    if (LVRE.user.isLoggedIn()) {
      const user = LVRE.user.getUser();
      this.orders = LVRE.orders.getUserOrders(user.id);
    } else {
      // Show guest orders from localStorage (if any)
      this.orders = LVRE.orders.getAllOrders().filter(order => order.userId === 'guest');
    }

    // Sort by date (newest first)
    this.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  bindEvents() {
    // Filter tabs
    document.querySelectorAll('[data-order-filter]').forEach(tab => {
      tab.addEventListener('click', () => {
        this.setFilter(tab.dataset.orderFilter);
      });
    });

    // Search input
    const searchInput = document.getElementById('order-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchOrders(e.target.value);
      });
    }

    // Date range filter
    const dateFromInput = document.getElementById('date-from');
    const dateToInput = document.getElementById('date-to');

    if (dateFromInput && dateToInput) {
      const applyDateFilter = () => {
        this.filterByDate(dateFromInput.value, dateToInput.value);
      };

      dateFromInput.addEventListener('change', applyDateFilter);
      dateToInput.addEventListener('change', applyDateFilter);
    }
  }

  setFilter(filter) {
    this.currentFilter = filter;

    // Update active tab
    document.querySelectorAll('[data-order-filter]').forEach(tab => {
      tab.classList.remove('active');
      if (tab.dataset.orderFilter === filter) {
        tab.classList.add('active');
      }
    });

    this.renderOrders();
  }

  searchOrders(query) {
    if (!query.trim()) {
      this.loadOrders();
      this.renderOrders();
      return;
    }

    const searchTerm = query.toLowerCase();
    this.orders = this.orders.filter(order =>
      order.id.toLowerCase().includes(searchTerm) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm))
    );

    this.renderOrders();
  }

  filterByDate(dateFrom, dateTo) {
    if (!dateFrom && !dateTo) {
      this.loadOrders();
      this.renderOrders();
      return;
    }

    const fromDate = dateFrom ? new Date(dateFrom) : new Date('2000-01-01');
    const toDate = dateTo ? new Date(dateTo) : new Date();

    this.orders = this.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= fromDate && orderDate <= toDate;
    });

    this.renderOrders();
  }

  getFilteredOrders() {
    switch (this.currentFilter) {
      case 'pending':
        return this.orders.filter(order => order.status === 'pending');
      case 'confirmed':
        return this.orders.filter(order => order.status === 'confirmed');
      case 'processing':
        return this.orders.filter(order => order.status === 'processing');
      case 'shipped':
        return this.orders.filter(order => order.status === 'shipped');
      case 'delivered':
        return this.orders.filter(order => order.status === 'delivered');
      case 'cancelled':
        return this.orders.filter(order => order.status === 'cancelled');
      default:
        return this.orders;
    }
  }

  renderOrders() {
    const ordersContainer = document.getElementById('orders-container');
    if (!ordersContainer) return;

    const filteredOrders = this.getFilteredOrders();

    if (filteredOrders.length === 0) {
      this.renderEmptyOrders(ordersContainer);
      return;
    }

    ordersContainer.innerHTML = filteredOrders.map(order => this.createOrderCard(order)).join('');

    // Bind events for each order
    this.bindOrderEvents();
  }

  renderEmptyOrders(container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 2rem;">
        <div style="font-size: 64px; margin-bottom: 1rem;">📦</div>
        <h3 style="font-size: 24px; color: #1F2937; margin-bottom: 0.5rem;">Tidak Ada Pesanan</h3>
        <p style="color: #6B7280; margin-bottom: 2rem;">
          ${this.currentFilter !== 'all' ? 'Tidak ada pesanan dengan status ini' : 'Belum ada riwayat pesanan'}
        </p>
        <a
          href="katalog.html"
          class="btn-primary"
          style="display: inline-block; padding: 12px 32px; background: #1E5A8D; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;"
        >
          Mulai Belanja
        </a>
      </div>
    `;
  }

  createOrderCard(order) {
    const statusInfo = this.getStatusInfo(order.status);
    const paymentStatusInfo = this.getPaymentStatusInfo(order.paymentStatus);

    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const orderDate = new Date(order.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    return `
      <div class="order-card" data-order-id="${order.id}" style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; margin-bottom: 16px; overflow: hidden;">
        <!-- Order Header -->
        <div style="padding: 16px 20px; border-bottom: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; background: #F9FAFB;">
          <div style="display: flex; gap: 24px; align-items: center;">
            <div>
              <div style="font-size: 12px; color: #6B7280; margin-bottom: 2px;">NOMOR PESANAN</div>
              <div style="font-weight: 600; color: #1F2937;">${order.id}</div>
            </div>
            <div>
              <div style="font-size: 12px; color: #6B7280; margin-bottom: 2px;">TANGGAL</div>
              <div style="font-size: 14px; color: #1F2937;">${orderDate}</div>
            </div>
            <div>
              <div style="font-size: 12px; color: #6B7280; margin-bottom: 2px;">TOTAL</div>
              <div style="font-size: 14px; font-weight: 600; color: #1F2937;">Rp ${order.total.toLocaleString('id-ID')}</div>
            </div>
          </div>
          <div style="display: flex; gap: 12px; align-items: center;">
            <span class="status-badge status-${order.status}" style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; background: ${statusInfo.bg}; color: ${statusInfo.color};">
              ${statusInfo.label}
            </span>
            <span class="payment-badge payment-${order.paymentStatus}" style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; background: ${paymentStatusInfo.bg}; color: ${paymentStatusInfo.color};">
              ${paymentStatusInfo.label}
            </span>
          </div>
        </div>

        <!-- Order Items -->
        <div style="padding: 20px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
            ${order.items.map(item => `
              <div style="display: flex; gap: 12px;">
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px; border: 1px solid #E5E7EB;">
                <div style="flex: 1;">
                  <div style="font-size: 13px; color: #1E5A8D; margin-bottom: 4px;">${item.brand}</div>
                  <div style="font-weight: 500; color: #1F2937; margin-bottom: 4px; font-size: 14px;">${item.name}</div>
                  ${Object.keys(item.variant || {}).length > 0 ? `
                    <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">${Object.values(item.variant).filter(v => v).join(' / ')}</div>
                  ` : ''}
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; color: #6B7280;">Qty: ${item.quantity}</span>
                    <span style="font-size: 14px; font-weight: 500; color: #1F2937;">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Order Actions -->
        <div style="padding: 16px 20px; border-top: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; background: #F9FAFB;">
          <div style="display: flex; gap: 12px;">
            <button class="order-action-btn view-details-btn" data-order-id="${order.id}" style="padding: 8px 16px; background: white; border: 1px solid #D1D5DB; border-radius: 6px; cursor: pointer; font-size: 13px; color: #374151; transition: all 0.2s;">
              Lihat Detail
            </button>
            ${order.status === 'delivered' ? `
              <button class="order-action-btn reorder-btn" data-order-id="${order.id}" style="padding: 8px 16px; background: white; border: 1px solid #D1D5DB; border-radius: 6px; cursor: pointer; font-size: 13px; color: #374151; transition: all 0.2s;">
                Beli Lagi
              </button>
            ` : ''}
            ${(order.status === 'pending' || order.status === 'confirmed') ? `
              <button class="order-action-btn cancel-order-btn" data-order-id="${order.id}" style="padding: 8px 16px; background: white; border: 1px solid #D1D5DB; border-radius: 6px; cursor: pointer; font-size: 13px; color: #DC2626; transition: all 0.2s;">
                Batalkan
              </button>
            ` : ''}
          </div>
          <button class="track-order-btn" data-order-id="${order.id}" style="padding: 8px 16px; background: #1E5A8D; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.2s;">
            Lacak Pesanan
          </button>
        </div>
      </div>
    `;
  }

  bindOrderEvents() {
    // View details buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showOrderDetails(btn.dataset.orderId);
      });
    });

    // Reorder buttons
    document.querySelectorAll('.reorder-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.reorderItems(btn.dataset.orderId);
      });
    });

    // Cancel order buttons
    document.querySelectorAll('.cancel-order-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.cancelOrder(btn.dataset.orderId);
      });
    });

    // Track order buttons
    document.querySelectorAll('.track-order-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.trackOrder(btn.dataset.orderId);
      });
    });

    // Add hover effects
    document.querySelectorAll('.order-action-btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.borderColor = '#1E5A8D';
        btn.style.color = '#1E5A8D';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.borderColor = '#D1D5DB';
        btn.style.color = '#374151';
      });
    });

    document.querySelectorAll('.track-order-btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.background = '#155070';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = '#1E5A8D';
      });
    });
  }

  showOrderDetails(orderId) {
    const order = LVRE.orders.getOrder(orderId);
    if (!order) return;

    const statusInfo = this.getStatusInfo(order.status);

    const detailsHTML = `
      <div style="padding: 20px;">
        <!-- Order Info -->
        <div style="background: #F9FAFB; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
            <div>
              <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">Nomor Pesanan</div>
              <div style="font-weight: 600; color: #1F2937;">${order.id}</div>
            </div>
            <div>
              <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">Tanggal</div>
              <div style="color: #1F2937;">${new Date(order.createdAt).toLocaleDateString('id-ID')}</div>
            </div>
            <div>
              <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">Status</div>
              <div style="font-weight: 500; color: ${statusInfo.color};">${statusInfo.label}</div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 16px 0; font-size: 16px; color: #1F2937;">Item Pesanan</h4>
          ${order.items.map(item => `
            <div style="display: flex; gap: 12px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #E5E7EB;">
              <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 100px; object-fit: cover; border-radius: 4px; border: 1px solid #E5E7EB;">
              <div style="flex: 1;">
                <div style="font-size: 13px; color: #1E5A8D; margin-bottom: 4px;">${item.brand}</div>
                <div style="font-weight: 500; color: #1F2937; margin-bottom: 4px;">${item.name}</div>
                ${Object.keys(item.variant || {}).length > 0 ? `
                  <div style="font-size: 13px; color: #6B7280; margin-bottom: 8px;">${Object.values(item.variant).filter(v => v).join(' / ')}</div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <span style="font-size: 13px; color: #6B7280;">Qty: ${item.quantity}</span>
                    <span style="font-size: 13px; color: #6B7280; margin-left: 12px;">@ Rp ${item.price.toLocaleString('id-ID')}</span>
                  </div>
                  <div style="font-weight: 600; color: #1F2937;">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Shipping Info -->
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 16px 0; font-size: 16px; color: #1F2937;">Informasi Pengiriman</h4>
          <div style="background: #F9FAFB; padding: 16px; border-radius: 8px;">
            <div style="margin-bottom: 8px;">
              <span style="font-size: 13px; color: #6B7280;">Nama: </span>
              <span style="font-size: 14px; color: #1F2937;">${order.shipping.fullName || '-'}</span>
            </div>
            <div style="margin-bottom: 8px;">
              <span style="font-size: 13px; color: #6B7280;">Telepon: </span>
              <span style="font-size: 14px; color: #1F2937;">${order.shipping.phone || '-'}</span>
            </div>
            <div>
              <span style="font-size: 13px; color: #6B7280;">Alamat: </span>
              <span style="font-size: 14px; color: #1F2937;">${order.shipping.address || '-'}, ${order.shipping.city || '-'} ${order.shipping.province || '-'}</span>
            </div>
          </div>
        </div>

        <!-- Payment Info -->
        <div>
          <h4 style="margin: 0 0 16px 0; font-size: 16px; color: #1F2937;">Informasi Pembayaran</h4>
          <div style="background: #F9FAFB; padding: 16px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #6B7280;">Subtotal</span>
              <span style="font-size: 14px; color: #1F2937;">Rp ${order.subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #6B7280;">Ongkos Kirim</span>
              <span style="font-size: 14px; color: #1F2937;">Rp ${order.shippingCost.toLocaleString('id-ID')}</span>
            </div>
            ${order.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 14px; color: #6B7280;">Diskon</span>
                <span style="font-size: 14px; color: #DC2626;">-Rp ${order.discount.toLocaleString('id-ID')}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid #E5E7EB; font-weight: 600;">
              <span style="font-size: 14px; color: #1F2937;">Total</span>
              <span style="font-size: 16px; color: #1F2937;">Rp ${order.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    LVRE.modal.open(detailsHTML, {
      title: 'Detail Pesanan',
      size: 'large'
    });
  }

  reorderItems(orderId) {
    const order = LVRE.orders.getOrder(orderId);
    if (!order) return;

    LVRE.modal.confirm(`Tambahkan ${order.items.length} item dari pesanan ${orderId} ke keranjang?`, {
      title: 'Beli Lagi',
      confirmText: 'Ya, Tambahkan',
      cancelText: 'Batal',
      onConfirm: () => {
        // Add all items to cart
        order.items.forEach(item => {
          const productToAdd = {
            id: item.id,
            name: item.name,
            brand: item.brand,
            price: item.price,
            originalPrice: item.originalPrice,
            image: item.image
          };

          LVRE.cart.addItem(productToAdd, item.variant || {}, item.quantity);
        });

        // Redirect to cart
        LVRE.notify.success('Semua item ditambahkan ke keranjang');
        setTimeout(() => {
          window.location.href = 'keranjang.html';
        }, 1000);
      }
    });
  }

  cancelOrder(orderId) {
    LVRE.modal.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?', {
      title: 'Konfirmasi Pembatalan',
      confirmText: 'Ya, Batalkan',
      cancelText: 'Tidak',
      onConfirm: () => {
        const cancelled = LVRE.orders.cancelOrder(orderId);
        if (cancelled) {
          this.loadOrders();
          this.renderOrders();
          this.updateStatistics();
        }
      }
    });
  }

  trackOrder(orderId) {
    const order = LVRE.orders.getOrder(orderId);
    if (!order) return;

    const trackingSteps = [
      { status: 'pending', label: 'Pesanan Dibuat', icon: '📝' },
      { status: 'confirmed', label: 'Pesanan Dikonfirmasi', icon: '✓' },
      { status: 'processing', label: 'Sedang Diproses', icon: '⚙' },
      { status: 'shipped', label: 'Dikirim', icon: '🚚' },
      { status: 'delivered', label: 'Terkirim', icon: '📦' }
    ];

    const statusIndex = trackingSteps.findIndex(step => step.status === order.status);
    const currentIndex = order.status === 'cancelled' ? -1 : Math.max(0, statusIndex);

    const trackingHTML = `
      <div style="padding: 20px;">
        <div style="background: #FEF3C7; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <div style="font-size: 13px; color: #92400E; margin-bottom: 4px;">NOMOR PESANAN</div>
          <div style="font-size: 18px; font-weight: 700; color: #1F2937;">${orderId}</div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 16px 0; font-size: 16px; color: #1F2937;">Status Pengiriman</h4>
          <div style="display: flex; gap: 8px;">
            ${trackingSteps.map((step, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex && order.status !== 'cancelled';
              const isCancelled = order.status === 'cancelled';

              return `
                <div style="flex: 1; text-align: center;">
                  <div style="width: 40px; height: 40px; margin: 0 auto 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; ${isCancelled ? 'background: #FEE2E2; color: #DC2626;' : isCurrent ? 'background: #1E5A8D; color: white;' : isCompleted ? 'background: #D1FAE5; color: #059669;' : 'background: #F3F4F6; color: #9CA3AF;'}">
                    ${isCancelled ? '✕' : step.icon}
                  </div>
                  <div style="font-size: 12px; ${isCurrent ? 'font-weight: 600; color: #1E5A8D;' : 'color: #6B7280;'}">${step.label}</div>
                </div>
                ${index < trackingSteps.length - 1 ? `
                  <div style="width: 20px; height: 2px; background: ${index < currentIndex ? '#059669' : '#E5E7EB'}; margin-top: 20px;"></div>
                ` : ''}
              `;
            }).join('')}
          </div>
        </div>

        ${order.status === 'shipped' || order.status === 'delivered' ? `
          <div style="background: #F9FAFB; padding: 16px; border-radius: 8px;">
            <h4 style="margin: 0 0 12px 0; font-size: 14px; color: #1F2937;">Informasi Pengiriman</h4>
            <div style="font-size: 13px; color: #6B7280; margin-bottom: 4px;">Kurir: JNE Reguler</div>
            <div style="font-size: 13px; color: #6B7280; margin-bottom: 4px;">No. Resi: JP1234567890</div>
            <div style="font-size: 13px; color: #6B7280;">Estimasi: ${new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID')}</div>
          </div>
        ` : ''}
      </div>
    `;

    LVRE.modal.open(trackingHTML, {
      title: 'Lacak Pesanan',
      size: 'medium'
    });
  }

  getStatusInfo(status) {
    const statusMap = {
      'pending': { label: 'Menunggu Konfirmasi', color: '#F59E0B', bg: '#FEF3C7' },
      'confirmed': { label: 'Dikonfirmasi', color: '#3B82F6', bg: '#DBEAFE' },
      'processing': { label: 'Diproses', color: '#8B5CF6', bg: '#EDE9FE' },
      'shipped': { label: 'Dikirim', color: '#10B981', bg: '#D1FAE5' },
      'delivered': { label: 'Terkirim', color: '#059669', bg: '#D1FAE5' },
      'cancelled': { label: 'Dibatalkan', color: '#DC2626', bg: '#FEE2E2' }
    };

    return statusMap[status] || { label: status, color: '#6B7280', bg: '#F3F4F6' };
  }

  getPaymentStatusInfo(status) {
    const statusMap = {
      'unpaid': { label: 'Belum Bayar', color: '#F59E0B', bg: '#FEF3C7' },
      'paid': { label: 'Sudah Bayar', color: '#059669', bg: '#D1FAE5' },
      'refunded': { label: 'Dikembalikan', color: '#8B5CF6', bg: '#EDE9FE' }
    };

    return statusMap[status] || { label: status, color: '#6B7280', bg: '#F3F4F6' };
  }

  updateStatistics() {
    const totalOrders = this.orders.length;
    const totalSpent = this.orders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0);

    const totalOrdersEl = document.getElementById('total-orders-count');
    const totalSpentEl = document.getElementById('total-spent-amount');

    if (totalOrdersEl) {
      totalOrdersEl.textContent = totalOrders;
    }

    if (totalSpentEl) {
      totalSpentEl.textContent = `Rp ${totalSpent.toLocaleString('id-ID')}`;
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  window.orderHistoryPage = new OrderHistoryPage();
});