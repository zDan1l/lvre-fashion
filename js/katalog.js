// ═══════════════════════════════════════════════════════════════
// LVRE - Product Catalog/Katalog Page
// Filtering, sorting, searching, and pagination
// ═══════════════════════════════════════════════════════════════

// Sample products data (in real app, this would come from API)
const productsData = [
  {
    id: 'p1',
    name: 'Linen Co-ord Set — Sage',
    brand: 'Naura Studio',
    category: 'clothing',
    price: 485000,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
    colors: ['sage', 'sand', 'ivory', 'charcoal'],
    sizes: ['xs', 's', 'm', 'l', 'xl'],
    badge: 'new',
    badgeText: 'New',
    rating: 5,
    reviewCount: 24,
    createdAt: '2024-03-15'
  },
  {
    id: 'p2',
    name: 'Wrap Midi Dress — Ivory',
    brand: 'Fiera Label',
    category: 'clothing',
    price: 320000,
    originalPrice: 400000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    colors: ['ivory', 'blush', 'black'],
    sizes: ['xs', 's', 'm', 'l'],
    badge: 'sale',
    badgeText: '−20%',
    rating: 4.5,
    reviewCount: 18,
    createdAt: '2024-03-10'
  },
  {
    id: 'p3',
    name: 'Oversized Blazer — Forest',
    brand: 'Rima Collective',
    category: 'clothing',
    price: 620000,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
    colors: ['forest', 'black', 'camel'],
    sizes: ['s', 'm', 'l', 'xl'],
    badge: null,
    badgeText: null,
    rating: 4.8,
    reviewCount: 32,
    createdAt: '2024-03-05'
  },
  {
    id: 'p4',
    name: 'Satin Slip Skirt — Moss',
    brand: 'Kaia Haus',
    category: 'clothing',
    price: 255000,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
    colors: ['moss', 'ivory', 'black'],
    sizes: ['xs', 's', 'm', 'l', 'xl'],
    badge: 'new',
    badgeText: 'New',
    rating: 4.6,
    reviewCount: 15,
    createdAt: '2024-03-18'
  },
  {
    id: 'p5',
    name: 'Structured Handbag — Tan',
    brand: 'Fiera Label',
    category: 'accessories',
    price: 425000,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
    colors: ['tan', 'black'],
    sizes: ['one-size'],
    badge: null,
    badgeText: null,
    rating: 4.7,
    reviewCount: 21,
    createdAt: '2024-03-01'
  },
  {
    id: 'p6',
    name: 'Chunky Loafers — Beige',
    brand: 'Rima Collective',
    category: 'shoes',
    price: 380000,
    originalPrice: 450000,
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&q=80',
    colors: ['beige', 'black', 'white'],
    sizes: ['36', '37', '38', '39', '40', '41'],
    badge: 'sale',
    badgeText: '−16%',
    rating: 4.4,
    reviewCount: 28,
    createdAt: '2024-02-28'
  },
  {
    id: 'p7',
    name: 'Ribbed Knit Top — Cream',
    brand: 'Naura Studio',
    category: 'clothing',
    price: 185000,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&q=80',
    colors: ['cream', 'grey', 'black'],
    sizes: ['xs', 's', 'm', 'l', 'xl'],
    badge: null,
    badgeText: null,
    rating: 4.3,
    reviewCount: 12,
    createdAt: '2024-02-25'
  },
  {
    id: 'p8',
    name: 'Wide Leg Pants — Navy',
    brand: 'Kaia Haus',
    category: 'clothing',
    price: 295000,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    colors: ['navy', 'black', 'cream'],
    sizes: ['xs', 's', 'm', 'l', 'xl'],
    badge: null,
    badgeText: null,
    rating: 4.5,
    reviewCount: 19,
    createdAt: '2024-02-20'
  },
  {
    id: 'p9',
    name: 'Leather Belt — Cognac',
    brand: 'Rima Collective',
    category: 'accessories',
    price: 145000,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    colors: ['cognac', 'black'],
    sizes: ['s', 'm', 'l'],
    badge: null,
    badgeText: null,
    rating: 4.2,
    reviewCount: 8,
    createdAt: '2024-02-15'
  },
  {
    id: 'p10',
    name: 'Canvas Sneakers — White',
    brand: 'Naura Studio',
    category: 'shoes',
    price: 265000,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80',
    colors: ['white', 'black'],
    sizes: ['36', '37', '38', '39', '40', '41'],
    badge: null,
    badgeText: null,
    rating: 4.6,
    reviewCount: 35,
    createdAt: '2024-02-10'
  },
  {
    id: 'p11',
    name: 'Silk Scarf — Floral',
    brand: 'Fiera Label',
    category: 'accessories',
    price: 165000,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1601924921557-45e6dea0a3e7?w=600&q=80',
    colors: ['floral', 'solid'],
    sizes: ['one-size'],
    badge: null,
    badgeText: null,
    rating: 4.8,
    reviewCount: 14,
    createdAt: '2024-02-05'
  },
  {
    id: 'p12',
    name: 'Linen Trousers — Sand',
    brand: 'Naura Studio',
    category: 'clothing',
    price: 375000,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    colors: ['sand', 'navy', 'black'],
    sizes: ['xs', 's', 'm', 'l', 'xl'],
    badge: null,
    badgeText: null,
    rating: 4.7,
    reviewCount: 22,
    createdAt: '2024-01-30'
  }
];

// ═══════════════════════════════════════════════════════════════
// CATALOG PAGE CLASS
// ═══════════════════════════════════════════════════════════════
class CatalogPage {
  constructor() {
    this.allProducts = productsData;
    this.filteredProducts = [...this.allProducts];

    // Filter state
    this.filters = {
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      priceRange: { min: 0, max: 1000000 },
      searchQuery: ''
    };

    // Sort state
    this.sortBy = 'rekomendasi'; // rekomendasi, terbaru, termurah, termahal

    // Pagination
    this.currentPage = 1;
    this.productsPerPage = 12;

    this.init();
  }

  init() {
    this.bindEvents();
    this.loadFilters();
    this.applyFilters();
    this.updateUI();
  }

  bindEvents() {
    // Mobile filter toggle
    const mobileFilterBtn = document.querySelector('.mobile-filter-btn');
    if (mobileFilterBtn) {
      mobileFilterBtn.addEventListener('click', () => this.toggleMobileFilters());
    }

    // Filter checkboxes
    document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.handleFilterChange();
        this.applyFilters();
        this.updateUI();
      });
    });

    // Color swatches
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        swatch.classList.toggle('active');
        this.handleFilterChange();
        this.applyFilters();
        this.updateUI();
      });
    });

    // Size chips
    document.querySelectorAll('.size-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('active');
        this.handleFilterChange();
        this.applyFilters();
        this.updateUI();
      });
    });

    // Price range inputs
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    if (minPriceInput) {
      minPriceInput.addEventListener('change', () => {
        this.filters.priceRange.min = parseInt(minPriceInput.value) || 0;
        this.applyFilters();
        this.updateUI();
      });
    }
    if (maxPriceInput) {
      maxPriceInput.addEventListener('change', () => {
        this.filters.priceRange.max = parseInt(maxPriceInput.value) || 1000000;
        this.applyFilters();
        this.updateUI();
      });
    }

    // Sort dropdown
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.applyFilters();
        this.updateUI();
      });
    }

    // Search input
    const searchInput = document.getElementById('catalogSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.searchQuery = e.target.value.toLowerCase();
        this.applyFilters();
        this.updateUI();
      });
    }

    // Clear filters button
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => this.clearFilters());
    }

    // Pagination
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('pagination-page')) {
        const page = parseInt(e.target.dataset.page);
        this.goToPage(page);
      } else if (e.target.classList.contains('pagination-prev')) {
        this.previousPage();
      } else if (e.target.classList.contains('pagination-next')) {
        this.nextPage();
      }
    });

    // Listen for global search events
    document.addEventListener('lvre:search', (e) => {
      this.filters.searchQuery = e.detail.query.toLowerCase();
      this.applyFilters();
      this.updateUI();

      // Update search input if visible
      const searchInput = document.getElementById('catalogSearch');
      if (searchInput) {
        searchInput.value = e.detail.query;
      }
    });

    // Add to cart from product grid
    document.addEventListener('click', (e) => {
      if (e.target.closest('.add-to-cart-quick')) {
        const btn = e.target.closest('.add-to-cart-quick');
        const productId = btn.dataset.productId;
        this.quickAddToCart(productId);
      }

      // Wishlist toggle
      if (e.target.closest('.product-wishlist')) {
        const btn = e.target.closest('.product-wishlist');
        const productId = btn.dataset.productId;
        this.toggleProductWishlist(productId, btn);
      }
    });
  }

  loadFilters() {
    // Get unique values for filters
    const categories = [...new Set(this.allProducts.map(p => p.category))];
    const brands = [...new Set(this.allProducts.map(p => p.brand))];
    const colors = [...new Set(this.allProducts.flatMap(p => p.colors))];
    const sizes = [...new Set(this.allProducts.flatMap(p => p.sizes))];

    // Update filter counts
    this.updateFilterCounts();
  }

  handleFilterChange() {
    // Update filter state from DOM
    this.filters.categories = Array.from(document.querySelectorAll('.filter-category:checked')).map(el => el.value);
    this.filters.brands = Array.from(document.querySelectorAll('.filter-brand:checked')).map(el => el.value);
    this.filters.colors = Array.from(document.querySelectorAll('.color-swatch.active')).map(el => el.dataset.color);
    this.filters.sizes = Array.from(document.querySelectorAll('.size-chip.active')).map(el => el.dataset.size);
  }

  applyFilters() {
    let filtered = [...this.allProducts];

    // Category filter
    if (this.filters.categories.length > 0) {
      filtered = filtered.filter(p => this.filters.categories.includes(p.category));
    }

    // Brand filter
    if (this.filters.brands.length > 0) {
      filtered = filtered.filter(p => this.filters.brands.includes(p.brand));
    }

    // Color filter
    if (this.filters.colors.length > 0) {
      filtered = filtered.filter(p =>
        p.colors.some(c => this.filters.colors.includes(c))
      );
    }

    // Size filter
    if (this.filters.sizes.length > 0) {
      filtered = filtered.filter(p =>
        p.sizes.some(s => this.filters.sizes.includes(s))
      );
    }

    // Price range filter
    filtered = filtered.filter(p =>
      p.price >= this.filters.priceRange.min &&
      p.price <= this.filters.priceRange.max
    );

    // Search filter
    if (this.filters.searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.filters.searchQuery) ||
        p.brand.toLowerCase().includes(this.filters.searchQuery)
      );
    }

    // Sort
    filtered = this.sortProducts(filtered);

    this.filteredProducts = filtered;

    // Reset pagination
    this.currentPage = 1;
  }

  sortProducts(products) {
    const sorted = [...products];

    switch (this.sortBy) {
      case 'terbaru':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'termurah':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'termahal':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rekomendasi':
      default:
        // Sort by rating and review count
        sorted.sort((a, b) => {
          const scoreA = a.rating * 10 + a.reviewCount;
          const scoreB = b.rating * 10 + b.reviewCount;
          return scoreB - scoreA;
        });
        break;
    }

    return sorted;
  }

  updateUI() {
    this.updateProductGrid();
    this.updatePagination();
    this.updateFilterCounts();
    this.updateResultsCount();
  }

  updateProductGrid() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    // Get products for current page
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    const pageProducts = this.filteredProducts.slice(startIndex, endIndex);

    if (pageProducts.length === 0) {
      productGrid.innerHTML = `
        <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
          <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
          <h3 style="font-size: 20px; margin-bottom: 8px; color: #1a1a1a;">Tidak ada produk ditemukan</h3>
          <p style="color: #666; margin-bottom: 24px;">Coba sesuaikan filter atau kata pencarian Anda</p>
          <button onclick="window.catalogPage.clearFilters()" style="padding: 12px 24px; background: #1E5A8D; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">Reset Filter</button>
        </div>
      `;
      return;
    }

    productGrid.innerHTML = pageProducts.map(product => `
      <div class="product-card" data-product-id="${product.id}">
        <a href="detail.html?id=${product.id}" class="product-img-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          ${product.badge ? `<span class="product-badge badge-${product.badge}">${product.badgeText}</span>` : ''}
          <button
            class="product-wishlist ${LVRE.wishlist.isInWishlist(product.id) ? 'active' : ''}"
            data-product-id="${product.id}"
            aria-label="Wishlist"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </a>
        <div class="product-brand">${product.brand}</div>
        <a href="detail.html?id=${product.id}" class="product-name">${product.name}</a>
        <div class="product-price">
          <span class="price-current">Rp ${product.price.toLocaleString('id-ID')}</span>
          ${product.originalPrice ? `<span class="price-original">Rp ${product.originalPrice.toLocaleString('id-ID')}</span>` : ''}
        </div>
        ${product.rating ? `
          <div class="product-rating">
            <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
            <span class="count">(${product.reviewCount})</span>
          </div>
        ` : ''}
        <button
          class="add-to-cart-quick"
          data-product-id="${product.id}"
          style="width: 100%; margin-top: 12px; padding: 10px; background: #1E5A8D; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; transition: background 0.2s;"
          onmouseover="this.style.background='#155070'"
          onmouseout="this.style.background='#1E5A8D'"
        >
          + Keranjang
        </button>
      </div>
    `).join('');
  }

  updatePagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);

    if (totalPages <= 1) {
      paginationContainer.style.display = 'none';
      return;
    }

    paginationContainer.style.display = 'flex';

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
      <button class="pagination-prev ${this.currentPage === 1 ? 'disabled' : ''}" ${this.currentPage === 1 ? 'disabled' : ''}>
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
    `;

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      paginationHTML += `<button class="pagination-page" data-page="1">1</button>`;
      if (startPage > 2) {
        paginationHTML += `<span style="padding: 0 8px; color: #666;">...</span>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <button class="pagination-page ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
          ${i}
        </button>
      `;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<span style="padding: 0 8px; color: #666;">...</span>`;
      }
      paginationHTML += `<button class="pagination-page" data-page="${totalPages}">${totalPages}</button>`;
    }

    // Next button
    paginationHTML += `
      <button class="pagination-next ${this.currentPage === totalPages ? 'disabled' : ''}" ${this.currentPage === totalPages ? 'disabled' : ''}>
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    `;

    paginationContainer.innerHTML = paginationHTML;
  }

  updateFilterCounts() {
    // Update category counts
    document.querySelectorAll('.filter-category').forEach(checkbox => {
      const category = checkbox.value;
      const count = this.allProducts.filter(p => p.category === category).length;
      const countEl = checkbox.closest('.filter-option').querySelector('.filter-count');
      if (countEl) countEl.textContent = count;
    });

    // Update brand counts
    document.querySelectorAll('.filter-brand').forEach(checkbox => {
      const brand = checkbox.value;
      const count = this.allProducts.filter(p => p.brand === brand).length;
      const countEl = checkbox.closest('.filter-option').querySelector('.filter-count');
      if (countEl) countEl.textContent = count;
    });
  }

  updateResultsCount() {
    const resultsCountEl = document.querySelector('.results-count');
    if (!resultsCountEl) return;

    const count = this.filteredProducts.length;
    resultsCountEl.textContent = `Menampilkan ${count} produk`;
  }

  toggleMobileFilters() {
    const filterSidebar = document.querySelector('.filter-sidebar');
    if (filterSidebar) {
      filterSidebar.classList.toggle('active');
      document.body.style.overflow = filterSidebar.classList.contains('active') ? 'hidden' : '';
    }
  }

  clearFilters() {
    // Reset all filter checkboxes
    document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });

    // Reset color swatches
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.classList.remove('active');
    });

    // Reset size chips
    document.querySelectorAll('.size-chip').forEach(chip => {
      chip.classList.remove('active');
    });

    // Reset price range
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    if (minPriceInput) minPriceInput.value = 0;
    if (maxPriceInput) maxPriceInput.value = 1000000;

    // Reset search
    const searchInput = document.getElementById('catalogSearch');
    if (searchInput) searchInput.value = '';

    // Reset state
    this.filters = {
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      priceRange: { min: 0, max: 1000000 },
      searchQuery: ''
    };

    // Reset sort
    this.sortBy = 'rekomendasi';
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'rekomendasi';

    // Apply
    this.applyFilters();
    this.updateUI();

    LVRE.notify.success('Filter direset');
  }

  goToPage(page) {
    this.currentPage = page;
    this.updateUI();

    // Scroll to top of product grid
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
      productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    if (this.currentPage < totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  quickAddToCart(productId) {
    const product = this.allProducts.find(p => p.id === productId);
    if (!product) return;

    LVRE.cart.addItem(product, {}, 1);
  }

  toggleProductWishlist(productId, btn) {
    const product = this.allProducts.find(p => p.id === productId);
    if (!product) return;

    const isAdded = LVRE.wishlist.toggleProduct(product);

    if (isAdded) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  window.catalogPage = new CatalogPage();
});
