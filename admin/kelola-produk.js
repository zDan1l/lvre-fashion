// ═══════════════════════════════════════════════════════════════
// LVRE - Admin Product Management
// CRUD operations for products
// ═══════════════════════════════════════════════════════════════

// Sample products data (in real app, this would come from database/API)
let productsDatabase = [
  {
    id: 'p1',
    name: 'Linen Co-ord Set — Sage',
    brand: 'Naura Studio',
    category: 'clothing',
    price: 485000,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80'],
    colors: ['sage', 'sand', 'ivory', 'charcoal'],
    sizes: ['xs', 's', 'm', 'l', 'xl'],
    description: 'Co-ord set berbahan linen premium',
    stock: 50,
    active: true,
    badge: 'new',
    badgeText: 'New',
    rating: 5,
    reviewCount: 24,
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15'
  }
];

class ProductManagement {
  constructor() {
    this.products = productsDatabase;
    this.currentView = 'list'; // list, create, edit
    this.selectedProductId = null;
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
          window.location.href = 'index.html';
        }
      });
      return;
    }

    this.bindEvents();
    this.loadProducts();
    this.updateUI();
  }

  bindEvents() {
    // Add product button
    const addProductBtn = document.querySelector('.add-product-btn');
    if (addProductBtn) {
      addProductBtn.addEventListener('click', () => this.showCreateForm());
    }

    // Edit product buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.edit-product-btn')) {
        const btn = e.target.closest('.edit-product-btn');
        const productId = btn.dataset.productId;
        this.showEditForm(productId);
      }
    });

    // Delete product buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.delete-product-btn')) {
        const btn = e.target.closest('.delete-product-btn');
        const productId = btn.dataset.productId;
        this.deleteProduct(productId);
      }
    });

    // Save product form
    const saveProductBtn = document.querySelector('.save-product-btn');
    if (saveProductBtn) {
      saveProductBtn.addEventListener('click', () => this.saveProduct());
    }

    // Cancel/back buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('cancel-product-btn') || e.target.classList.contains('back-to-list-btn')) {
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
    const searchInput = document.getElementById('productSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.updateUI();
      });
    }
  }

  loadProducts() {
    // In real app, this would fetch from API
    const stored = LVRE.Storage.get('lvre_products', null);
    if (stored) {
      this.products = stored;
    }
  }

  saveProductsToStorage() {
    LVRE.Storage.set('lvre_products', this.products);
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.updateUI();
  }

  getFilteredProducts() {
    let filtered = [...this.products];

    // Apply search
    if (this.searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery) ||
        p.brand.toLowerCase().includes(this.searchQuery)
      );
    }

    // Apply status filter
    if (this.currentFilter === 'active') {
      filtered = filtered.filter(p => p.active);
    } else if (this.currentFilter === 'inactive') {
      filtered = filtered.filter(p => !p.active);
    }

    return filtered;
  }

  updateUI() {
    if (this.currentView === 'list') {
      this.showListView();
    } else if (this.currentView === 'create') {
      this.showCreateForm();
    } else if (this.currentView === 'edit') {
      // Edit view is handled separately
    }
  }

  showListView() {
    this.currentView = 'list';
    this.selectedProductId = null;

    const listContainer = document.querySelector('.products-list-container');
    const formContainer = document.querySelector('.product-form-container');

    if (listContainer) listContainer.style.display = 'block';
    if (formContainer) formContainer.style.display = 'none';

    this.renderProductsList();
    this.updateStats();
  }

  renderProductsList() {
    const productsContainer = document.querySelector('.admin-products-list');
    if (!productsContainer) return;

    const filteredProducts = this.getFilteredProducts();

    if (filteredProducts.length === 0) {
      productsContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 48px; margin-bottom: 16px;">📦</div>
          <h3 style="margin: 0 0 8px 0;">${this.searchQuery ? 'Tidak ada produk ditemukan' : 'Tidak ada produk'}</h3>
          <p style="margin: 0 0 24px 0; color: #666;">${this.searchQuery ? 'Coba kata kunci lain' : 'Belum ada produk yang ditambahkan'}</p>
        </div>
      `;
      return;
    }

    productsContainer.innerHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #E5E7EB;">
            <th style="padding: 12px; text-align: left;">Produk</th>
            <th style="padding: 12px; text-align: left;">Kategori</th>
            <th style="padding: 12px; text-align: right;">Harga</th>
            <th style="padding: 12px; text-align: center;">Stok</th>
            <th style="padding: 12px; text-align: center;">Status</th>
            <th style="padding: 12px; text-align: center;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${filteredProducts.map(product => `
            <tr style="border-bottom: 1px solid #E5E7EB;">
              <td style="padding: 16px 12px;">
                <div style="display: flex; gap: 12px; align-items: center;">
                  <img src="${product.image}" alt="${product.name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px; border: 1px solid #E5E7EB;">
                  <div>
                    <div style="font-size: 14px; font-weight: 500; color: #1a1a1a;">${product.name}</div>
                    <div style="font-size: 13px; color: #666;">${product.brand}</div>
                  </div>
                </div>
              </td>
              <td style="padding: 12px;">
                <span style="padding: 4px 12px; background: #F3F4F6; border-radius: 20px; font-size: 13px; color: #666;">
                  ${product.category || '-'}
                </span>
              </td>
              <td style="padding: 12px; text-align: right; font-weight: 600; color: #1a1a1a;">
                Rp ${product.price.toLocaleString('id-ID')}
              </td>
              <td style="padding: 12px; text-align: center;">
                <span style="padding: 4px 12px; background: ${product.stock > 10 ? '#D1FAE5' : product.stock > 0 ? '#FEF3C7' : '#FEE2E2'}; border-radius: 20px; font-size: 13px; color: ${product.stock > 10 ? '#059669' : product.stock > 0 ? '#92400E' : '#DC2626'};">
                  ${product.stock}
                </span>
              </td>
              <td style="padding: 12px; text-align: center;">
                <span style="padding: 4px 12px; background: ${product.active ? '#D1FAE5' : '#FEE2E2'}; border-radius: 20px; font-size: 13px; color: ${product.active ? '#059669' : '#DC2626'};">
                  ${product.active ? 'Aktif' : 'Nonaktif'}
                </span>
              </td>
              <td style="padding: 12px; text-align: center;">
                <div style="display: flex; gap: 8px; justify-content: center;">
                  <button class="edit-product-btn" data-product-id="${product.id}" style="padding: 6px 12px; background: #1E5A8D; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
                    Edit
                  </button>
                  <button class="delete-product-btn" data-product-id="${product.id}" style="padding: 6px 12px; background: #DC2626; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  showCreateForm() {
    this.currentView = 'create';
    this.selectedProductId = null;

    const listContainer = document.querySelector('.products-list-container');
    const formContainer = document.querySelector('.product-form-container');

    if (listContainer) listContainer.style.display = 'none';
    if (formContainer) formContainer.style.display = 'block';

    this.renderProductForm();
  }

  showEditForm(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) {
      LVRE.notify.error('Produk tidak ditemukan');
      return;
    }

    this.currentView = 'edit';
    this.selectedProductId = productId;

    const listContainer = document.querySelector('.products-list-container');
    const formContainer = document.querySelector('.product-form-container');

    if (listContainer) listContainer.style.display = 'none';
    if (formContainer) formContainer.style.display = 'block';

    this.renderProductForm(product);
  }

  renderProductForm(product = null) {
    const formContainer = document.querySelector('.product-form-container');
    if (!formContainer) return;

    const isEdit = product !== null;
    const title = isEdit ? 'Edit Produk' : 'Tambah Produk Baru';

    formContainer.innerHTML = `
      <div style="margin-bottom: 24px;">
        <button class="back-to-list-btn" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: white; border: 1px solid #D1D5DB; border-radius: 6px; cursor: pointer; font-size: 14px; color: #374151;">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
          Kembali ke Daftar
        </button>
      </div>

      <h2 style="margin: 0 0 24px 0; font-size: 24px; color: #1a1a1a;">${title}</h2>

      <form id="productForm" style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Basic Info -->
          <div style="padding: 20px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #1a1a1a;">Informasi Dasar</h3>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Nama Produk *</label>
                <input type="text" name="name" value="${product?.name || ''}" required style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Brand *</label>
                <input type="text" name="brand" value="${product?.brand || ''}" required style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Kategori *</label>
                <select name="category" required style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
                  <option value="">Pilih kategori</option>
                  <option value="clothing" ${product?.category === 'clothing' ? 'selected' : ''}>Clothing</option>
                  <option value="shoes" ${product?.category === 'shoes' ? 'selected' : ''}>Shoes</option>
                  <option value="accessories" ${product?.category === 'accessories' ? 'selected' : ''}>Accessories</option>
                  <option value="bags" ${product?.category === 'bags' ? 'selected' : ''}>Bags</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Stok *</label>
                <input type="number" name="stock" value="${product?.stock || 0}" min="0" required style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
              </div>
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Deskripsi</label>
              <textarea name="description" rows="3" style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px; resize: vertical;">${product?.description || ''}</textarea>
            </div>
          </div>

          <!-- Pricing -->
          <div style="padding: 20px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #1a1a1a;">Harga</h3>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Harga Utama *</label>
                <input type="number" name="price" value="${product?.price || ''}" min="0" required style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Harga Coret (opsional)</label>
                <input type="number" name="originalPrice" value="${product?.originalPrice || ''}" min="0" style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
              </div>
            </div>
          </div>

          <!-- Variants -->
          <div style="padding: 20px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #1a1a1a;">Variasi</h3>

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Warna (pisahkan dengan koma)</label>
              <input type="text" name="colors" value="${product?.colors?.join(', ') || ''}" placeholder="contoh: sage, sand, ivory" style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
            </div>

            <div>
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Ukuran (pisahkan dengan koma)</label>
              <input type="text" name="sizes" value="${product?.sizes?.join(', ') || ''}" placeholder="contoh: xs, s, m, l, xl" style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Image -->
          <div style="padding: 20px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #1a1a1a;">Gambar Produk *</h3>

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">URL Gambar Utama</label>
              <input type="url" name="image" value="${product?.image || ''}" required style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
            </div>

            ${product?.image ? `
              <div style="border: 1px solid #E5E7EB; border-radius: 6px; overflow: hidden;">
                <img src="${product.image}" alt="Preview" style="width: 100%; height: 200px; object-fit: cover;">
              </div>
            ` : `
              <div style="border: 2px dashed #D1D5DB; border-radius: 6px; padding: 40px; text-align: center; color: #9CA3AF;">
                <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin: 0 auto 12px;">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <div style="font-size: 14px;">Preview gambar</div>
              </div>
            `}
          </div>

          <!-- Status -->
          <div style="padding: 20px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #1a1a1a;">Status</h3>

            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" name="active" ${product?.active !== false ? 'checked' : ''} style="width: 16px; height: 16px;">
              <span style="font-size: 14px; color: #374151;">Aktif (tampilkan di katalog)</span>
            </label>
          </div>

          <!-- Badge -->
          <div style="padding: 20px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #1a1a1a;">Badge (opsional)</h3>

            <div style="margin-bottom: 12px;">
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Tipe Badge</label>
              <select name="badge" style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
                <option value="">Tanpa badge</option>
                <option value="new" ${product?.badge === 'new' ? 'selected' : ''}>New</option>
                <option value="sale" ${product?.badge === 'sale' ? 'selected' : ''}>Sale</option>
                <option value="limited" ${product?.badge === 'limited' ? 'selected' : ''}>Limited Edition</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Teks Badge</label>
              <input type="text" name="badgeText" value="${product?.badgeText || ''}" placeholder="contoh: New, −20%, Limited" style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
            </div>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 12px; flex-direction: column;">
            <button type="submit" class="save-product-btn" style="padding: 12px 24px; background: #1E5A8D; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
              ${isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
            <button type="button" class="cancel-product-btn" style="padding: 12px 24px; background: white; border: 1px solid #D1D5DB; border-radius: 6px; cursor: pointer; font-size: 14px; color: #374151;">
              Batal
            </button>
          </div>
        </div>
      </form>
    `;

    // Bind form submit
    const form = document.getElementById('productForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveProduct();
      });
    }
  }

  saveProduct() {
    const form = document.getElementById('productForm');
    if (!form) return;

    const formData = new FormData(form);

    const productData = {
      name: formData.get('name'),
      brand: formData.get('brand'),
      category: formData.get('category'),
      price: parseInt(formData.get('price')),
      originalPrice: formData.get('originalPrice') ? parseInt(formData.get('originalPrice')) : null,
      image: formData.get('image'),
      description: formData.get('description'),
      stock: parseInt(formData.get('stock')),
      colors: formData.get('colors').split(',').map(c => c.trim()).filter(c => c),
      sizes: formData.get('sizes').split(',').map(s => s.trim()).filter(s => s),
      active: formData.get('active') === 'on',
      badge: formData.get('badge') || null,
      badgeText: formData.get('badgeText') || null,
      updatedAt: new Date().toISOString()
    };

    if (this.currentView === 'edit' && this.selectedProductId) {
      // Update existing product
      const index = this.products.findIndex(p => p.id === this.selectedProductId);
      if (index !== -1) {
        this.products[index] = {
          ...this.products[index],
          ...productData,
          id: this.selectedProductId
        };
        LVRE.notify.success('Produk berhasil diperbarui');
      }
    } else {
      // Create new product
      const newProduct = {
        ...productData,
        id: 'p' + Date.now(),
        createdAt: new Date().toISOString()
      };
      this.products.unshift(newProduct);
      LVRE.notify.success('Produk berhasil ditambahkan');
    }

    this.saveProductsToStorage();
    this.showListView();
  }

  deleteProduct(productId) {
    LVRE.modal.confirm('Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.', {
      title: 'Konfirmasi Hapus',
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      onConfirm: () => {
        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
          this.products.splice(index, 1);
          this.saveProductsToStorage();
          this.updateUI();
          LVRE.notify.success('Produk berhasil dihapus');
        }
      }
    });
  }

  updateStats() {
    const statsEl = document.querySelector('.products-stats');
    if (!statsEl) return;

    const totalProducts = this.products.length;
    const activeProducts = this.products.filter(p => p.active).length;
    const totalStock = this.products.reduce((sum, p) => sum + p.stock, 0);

    statsEl.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="padding: 16px; background: #F9FAFB; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #1E5A8D;">${totalProducts}</div>
          <div style="font-size: 13px; color: #666;">Total Produk</div>
        </div>
        <div style="padding: 16px; background: #F9FAFB; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #10B981;">${activeProducts}</div>
          <div style="font-size: 13px; color: #666;">Produk Aktif</div>
        </div>
        <div style="padding: 16px; background: #F9FAFB; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #F59E0B;">${totalStock}</div>
          <div style="font-size: 13px; color: #666;">Total Stok</div>
        </div>
      </div>
    `;
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Load app.js first
  if (!window.LVRE) {
    const script = document.createElement('script');
    script.src = '../js/app.js';
    script.onload = () => {
      window.productManagement = new ProductManagement();
    };
    document.head.appendChild(script);
  } else {
    window.productManagement = new ProductManagement();
  }
});
