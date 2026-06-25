// ═══════════════════════════════════════════════════════════════
// LVRE - Admin Transaction Management
// Order management, status updates, and transaction processing
// ═══════════════════════════════════════════════════════════════

class TransactionManagement {
  constructor() {
    this.orders = [];
    this.currentView = 'list';
    this.selectedOrderId = null;
    this.currentFilter = 'all';
    this.searchQuery = '';

    this.init();
  }

  init() {
    // Check if user is admin
    if (!LVRE.user.isAdmin()) {
      LVRE.modal.alert('Akses ditolak. Halaman ini khusus administrator.', {
        title: 'Akses Ditolak',
        onClose: () => {
          window.location.href = '../index.html';
        }
      });
      return;
    }

    this.bindEvents();
    this.loadOrders();
    this.updateUI();
  }

  bindEvents() {
    // View order buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.view-order-btn')) {
        const btn = e.target.closest('.view-order-btn');
        const orderId = btn.dataset.orderId;
        this.showOrderDetails(orderId);
      }
    });

    // Update status buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.update-status-btn')) {
        const btn = e.target.closest('.update-status-btn');
        const orderId = btn.dataset.orderId;
        this.showStatusUpdate(orderId);
      }
    });

    // Back button
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('back-to-list-btn')) {
        this.showListView();
      }
    });

    // Filter tabs
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-tab')) {
        const filter = e.target.dataset.filter;
        this.setFilter(filter);
      }
    });

    // Search input
    const searchInput = document.getElementById('orderSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.updateUI();
      });
    }

    // Export button
    const exportBtn = document.querySelector('.export-orders-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportOrders());
    }
  }

  loadOrders() {
    // Load orders from the order system
    this.orders = LVRE.orders.getAllOrders();
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.updateUI();
  }

  getFilteredOrders() {
    let filtered = [...this.orders];

    // Apply search
    if (this.searchQuery) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(this.searchQuery) ||
        order.items.some(item => item.name.toLowerCase().includes(this.searchQuery))
      );
    }

    // Apply status filter
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(order => order.status === this.currentFilter);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return filtered;
  }

  updateUI() {
    if (this.currentView === 'list') {
      this.showListView();
    } else if (this.currentView === 'details') {
      // Details view is handled separately
    }
  }

  showListView() {
    this.currentView = 'list';
    this.selectedOrderId = null;

    const listContainer = document.querySelector('.orders-list-container');
    const detailsContainer = document.querySelector('.order-details-container');

    if (listContainer) listContainer.style.display = 'block';
    if (detailsContainer) detailsContainer.style.display = 'none';

    this.renderOrdersList();
    this.updateStats();
  }

  renderOrdersList() {
    const ordersContainer = document.querySelector('.admin-orders-list');
    if (!ordersContainer) return;

    const filteredOrders = this.getFilteredOrders();

    if (filteredOrders.length === 0) {
      ordersContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 48px; margin-bottom: 16px;">📦</div>
          <h3 style="margin: 0 0 8px 0;">${this.searchQuery ? 'Tidak ada pesanan ditemukan' : 'Tidak ada pesanan'}</h3>
          <p style="margin: 0 0 24px 0; color: #666;">${this.searchQuery ? 'Coba kata kunci lain' : 'Belum ada pesanan masuk'}</p>
        </div>
      `;
      return;
    }

    ordersContainer.innerHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #E5E7EB;">
            <th style="padding: 12px; text-align: left;">Order ID</th>
            <th style="padding: 12px; text-align: left;">Customer</th>
            <th style="padding: 12px; text-align: right;">Total</th>
            <th style="padding: 12px; text-align: center;">Status</th>
            <th style="padding: 12px; text-align: center;">Payment</th>
            <th style="padding: 12px; text-align: center;">Tanggal</th>
            <th style="padding: 12px; text-align: center;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${filteredOrders.map(order => this.createOrderRow(order)).join('')}
        </tbody>
      </table>
    `;
  }

  createOrderRow(order) {
    const statusInfo = this.getStatusInfo(order.status);
    const paymentStatusInfo = this.getPaymentStatusInfo(order.paymentStatus);
    const orderDate = new Date(order.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 16px 12px;">
          <div style="font-weight: 600; color: #1a1a1a;">${order.id}</div>
          <div style="font-size: 12px; color: #666;">${order.items.length} item</div>
        </td>
        <td style="padding: 12px;">
          <div style="font-size: 14px; color: #374151;">${order.shipping?.fullName || 'Guest'}</div>
          <div style="font-size: 12px; color: #666;">${order.shipping?.phone || '-'}</div>
        </td>
        <td style="padding: 12px; text-align: right; font-weight: 600; color: #1a1a1a;">
          Rp ${order.total.toLocaleString('id-ID')}
        </td>
        <td style="padding: 12px; text-align: center;">
          <span style="padding: 4px 12px; background: ${statusInfo.bg}; color: ${statusInfo.color}; border-radius: 20px; font-size: 13px; font-weight: 500;">
            ${statusInfo.label}
          </span>
        </td>
        <td style="padding: 12px; text-align: center;">
          <span style="padding: 4px 12px; background: ${paymentStatusInfo.bg}; color: ${paymentStatusInfo.color}; border-radius: 20px; font-size: 13px; font-weight: 500;">
            ${paymentStatusInfo.label}
          </span>
        </td>
        <td style="padding: 12px; text-align: center; font-size: 13px; color: #666;">
          ${orderDate}
        </td>
        <td style="padding: 12px; text-align: center;">
          <div style="display: flex; gap: 8px; justify-content: center;">
            <button class="view-order-btn" data-order-id="${order.id}" style="padding: 6px 12px; background: #1E5A8D; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
              Detail
            </button>
            <button class="update-status-btn" data-order-id="${order.id}" style="padding: 6px 12px; background: #F59E0B; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
              Status
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  showOrderDetails(orderId) {
    const order = LVRE.orders.getOrder(orderId);
    if (!order) {
      LVRE.notify.error('Pesanan tidak ditemukan');
      return;
    }

    this.currentView = 'details';
    this.selectedOrderId = orderId;

    const listContainer = document.querySelector('.orders-list-container');
    const detailsContainer = document.querySelector('.order-details-container');

    if (listContainer) listContainer.style.display = 'none';
    if (detailsContainer) detailsContainer.style.display = 'block';

    this.renderOrderDetails(order);
  }

  renderOrderDetails(order) {
    const detailsContainer = document.querySelector('.order-details-container');
    if (!detailsContainer) return;

    const statusInfo = this.getStatusInfo(order.status);
    const paymentStatusInfo = this.getPaymentStatusInfo(order.paymentStatus);

    const detailsHTML = `
      <div style="margin-bottom: 24px;">
        <button class="back-to-list-btn" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: white; border: 1px solid #D1D5DB; border-radius: 6px; cursor: pointer; font-size: 14px; color: #374151;">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
          Kembali ke Daftar
        </button>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
        <!-- Order Information -->
        <div>
          <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 24px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #1a1a1a;">Informasi Pesanan</h3>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
              <div>
                <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">Order ID</div>
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

            <h4 style="margin: 0 0 12px 0; font-size: 14px; color: #1F2937;">Item Pesanan</h4>
            ${order.items.map(item => `
              <div style="display: flex; gap: 12px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #F3F4F6;">
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px; border: 1px solid #E5E7EB;">
                <div style="flex: 1;">
                  <div style="font-size: 13px; color: #1E5A8D; margin-bottom: 4px;">${item.brand}</div>
                  <div style="font-weight: 500; color: #1F2937; margin-bottom: 4px;">${item.name}</div>
                  ${Object.keys(item.variant || {}).length > 0 ? `
                    <div style="font-size: 13px; color: #6B7280; margin-bottom: 8px;">${Object.values(item.variant).filter(v => v).join(' / ')}</div>
                  ` : ''}
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 13px; color: #6B7280;">Qty: ${item.quantity} × Rp ${item.price.toLocaleString('id-ID')}</div>
                    <div style="font-weight: 600; color: #1F2937;">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Shipping Information -->
          <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 24px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #1a1a1a;">Informasi Pengiriman</h3>
            <div style="background: #F9FAFB; padding: 16px; border-radius: 8px;">
              <div style="margin-bottom: 8px;">
                <span style="font-size: 13px; color: #6B7280;">Nama: </span>
                <span style="font-size: 14px; color: #1F2937;">${order.shipping?.fullName || '-'}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span style="font-size: 13px; color: #6B7280;">Telepon: </span>
                <span style="font-size: 14px; color: #1F2937;">${order.shipping?.phone || '-'}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span style="font-size: 13px; color: #6B7280;">Alamat: </span>
                <span style="font-size: 14px; color: #1F2937;">${order.shipping?.address || '-'}, ${order.shipping?.city || '-'} ${order.shipping?.province || '-'}</span>
              </div>
              <div>
                <span style="font-size: 13px; color: #6B7280;">Kode Pos: </span>
                <span style="font-size: 14px; color: #1F2937;">${order.shipping?.postalCode || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment & Summary -->
        <div>
          <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 24px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #1a1a1a;">Status & Pembayaran</h3>

            <div style="margin-bottom: 20px;">
              <div style="font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px;">Status Pesanan</div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${this.getStatusButtons(order)}
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <div style="font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px;">Status Pembayaran</div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${this.getPaymentStatusButtons(order)}
              </div>
            </div>

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

            <div style="margin-top: 20px;">
              <button onclick="window.print()" style="width: 100%; padding: 10px; background: #1E5A8D; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
                📄 Cetak Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    detailsContainer.innerHTML = detailsHTML;

    // Bind status button events
    this.bindStatusButtonEvents(order);
  }

  getStatusButtons(order) {
    const statuses = [
      { value: 'pending', label: 'Pending', color: '#F59E0B' },
      { value: 'confirmed', label: 'Dikonfirmasi', color: '#3B82F6' },
      { value: 'processing', label: 'Diproses', color: '#8B5CF6' },
      { value: 'shipped', label: 'Dikirim', color: '#10B981' },
      { value: 'delivered', label: 'Terkirim', color: '#059669' },
      { value: 'cancelled', label: 'Dibatalkan', color: '#DC2626' }
    ];

    return statuses.map(status => `
      <button
        class="status-btn ${order.status === status.value ? 'active' : ''}"
        data-status="${status.value}"
        data-order-id="${order.id}"
        style="padding: 6px 12px; border: 1px solid ${order.status === status.value ? status.color : '#D1D5DB'}; background: ${order.status === status.value ? status.color : 'white'}; color: ${order.status === status.value ? 'white' : '#374151'}; border-radius: 20px; cursor: pointer; font-size: 13px; transition: all 0.2s;"
        onmouseover="this.style.background = '${order.status === status.value ? status.color : '#F3F4F6'}'"
        onmouseout="this.style.background = '${order.status === status.value ? status.color : 'white'}'"
      >
        ${status.label}
      </button>
    `).join('');
  }

  getPaymentStatusButtons(order) {
    const statuses = [
      { value: 'unpaid', label: 'Belum Bayar', color: '#F59E0B' },
      { value: 'paid', label: 'Sudah Bayar', color: '#10B981' },
      { value: 'refunded', label: 'Dikembalikan', color: '#8B5CF6' }
    ];

    return statuses.map(status => `
      <button
        class="payment-status-btn ${order.paymentStatus === status.value ? 'active' : ''}"
        data-payment-status="${status.value}"
        data-order-id="${order.id}"
        style="padding: 6px 12px; border: 1px solid ${order.paymentStatus === status.value ? status.color : '#D1D5DB'}; background: ${order.paymentStatus === status.value ? status.color : 'white'}; color: ${order.paymentStatus === status.value ? 'white' : '#374151'}; border-radius: 20px; cursor: pointer; font-size: 13px; transition: all 0.2s;"
        onmouseover="this.style.background = '${order.paymentStatus === status.value ? status.color : '#F3F4F6'}'"
        onmouseout="this.style.background = '${order.paymentStatus === status.value ? status.color : 'white'}'"
      >
        ${status.label}
      </button>
    `).join('');
  }

  bindStatusButtonEvents(order) {
    // Order status buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const newStatus = btn.dataset.status;
        this.updateOrderStatus(order.id, newStatus);
      });
    });

    // Payment status buttons
    document.querySelectorAll('.payment-status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const newPaymentStatus = btn.dataset.paymentStatus;
        this.updatePaymentStatus(order.id, newPaymentStatus);
      });
    });
  }

  updateOrderStatus(orderId, newStatus) {
    LVRE.modal.confirm(`Ubah status pesanan ${orderId} menjadi ${newStatus}?`, {
      title: 'Konfirmasi Update Status',
      confirmText: 'Ya, Ubah',
      cancelText: 'Batal',
      onConfirm: () => {
        const updated = LVRE.orders.updateOrderStatus(orderId, newStatus);
        if (updated) {
          this.loadOrders();
          this.showOrderDetails(orderId); // Refresh details view
        }
      }
    });
  }

  updatePaymentStatus(orderId, newPaymentStatus) {
    LVRE.modal.confirm(`Ubah status pembayaran ${orderId} menjadi ${newPaymentStatus}?`, {
      title: 'Konfirmasi Update Pembayaran',
      confirmText: 'Ya, Ubah',
      cancelText: 'Batal',
      onConfirm: () => {
        const updated = LVRE.orders.updateOrderStatus(orderId, LVRE.orders.getOrder(orderId).status, newPaymentStatus);
        if (updated) {
          this.loadOrders();
          this.showOrderDetails(orderId); // Refresh details view
        }
      }
    });
  }

  showStatusUpdate(orderId) {
    this.showOrderDetails(orderId);
  }

  getStatusInfo(status) {
    const statusMap = {
      'pending': { label: 'Pending', color: '#92400E', bg: '#FEF3C7' },
      'confirmed': { label: 'Dikonfirmasi', color: '#1E40AF', bg: '#DBEAFE' },
      'processing': { label: 'Diproses', color: '#7C3AED', bg: '#EDE9FE' },
      'shipped': { label: 'Dikirim', color: '#059669', bg: '#D1FAE5' },
      'delivered': { label: 'Terkirim', color: '#047857', bg: '#D1FAE5' },
      'cancelled': { label: 'Dibatalkan', color: '#DC2626', bg: '#FEE2E2' }
    };

    return statusMap[status] || { label: status, color: '#6B7280', bg: '#F3F4F6' };
  }

  getPaymentStatusInfo(status) {
    const statusMap = {
      'unpaid': { label: 'Belum Bayar', color: '#92400E', bg: '#FEF3C7' },
      'paid': { label: 'Sudah Bayar', color: '#059669', bg: '#D1FAE5' },
      'refunded': { label: 'Dikembalikan', color: '#7C3AED', bg: '#EDE9FE' }
    };

    return statusMap[status] || { label: status, color: '#6B7280', bg: '#F3F4F6' };
  }

  updateStats() {
    const statsEl = document.querySelector('.orders-stats');
    if (!statsEl) return;

    const stats = LVRE.orders.getOrderStats();

    statsEl.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="padding: 16px; background: #F9FAFB; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #1E5A8D;">${stats.totalOrders}</div>
          <div style="font-size: 13px; color: #666;">Total Pesanan</div>
        </div>
        <div style="padding: 16px; background: #F9FAFB; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #10B981;">Rp ${(stats.totalRevenue / 1000000).toFixed(1)}jt</div>
          <div style="font-size: 13px; color: #666;">Total Pendapatan</div>
        </div>
        <div style="padding: 16px; background: #F9FAFB; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #F59E0B;">${stats.statusCounts.pending}</div>
          <div style="font-size: 13px; color: #666;">Pending</div>
        </div>
        <div style="padding: 16px; background: #F9FAFB; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #DC2626;">${stats.statusCounts.cancelled}</div>
          <div style="font-size: 13px; color: #666;">Dibatalkan</div>
        </div>
      </div>
    `;
  }

  exportOrders() {
    const orders = this.getFilteredOrders();

    // Create CSV content
    const headers = ['Order ID', 'Customer', 'Phone', 'Total', 'Status', 'Payment Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...orders.map(order => [
        order.id,
        order.shipping?.fullName || 'Guest',
        order.shipping?.phone || '-',
        order.total,
        order.status,
        order.paymentStatus,
        new Date(order.createdAt).toLocaleDateString('id-ID')
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    LVRE.notify.success('Data berhasil diekspor');
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Make sure LVRE is loaded first
  if (!window.LVRE) {
    console.error('LVRE not loaded. Make sure app.js is included before admin-transaction.js');
    return;
  }

  window.transactionManagement = new TransactionManagement();
});