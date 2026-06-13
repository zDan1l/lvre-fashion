// ═══════════════════════════════════════════════════════════════
// LVRE - Product Detail Page
// Interactive product selection, gallery, accordion, and add to cart
// ═══════════════════════════════════════════════════════════════

// Sample product data (in real app, this would come from API based on URL params)
const productData = {
  id: 'p1',
  name: 'Linen Co-ord Set — Sage',
  brand: 'Naura Studio',
  brandSlug: 'naura-studio',
  category: 'clothing',
  price: 485000,
  originalPrice: null,
  images: [
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80'
  ],
  colors: [
    {
      id: 'sage',
      name: 'Sage Green',
      hex: '#8B7355',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=100&q=80'
    },
    {
      id: 'sand',
      name: 'Sand Beige',
      hex: '#E8D5C4',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=100&q=80'
    },
    {
      id: 'ivory',
      name: 'Ivory White',
      hex: '#FAF9F6',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&q=80'
    },
    {
      id: 'charcoal',
      name: 'Charcoal Grey',
      hex: '#8A8472',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=100&q=80'
    }
  ],
  sizes: [
    { id: 'xs', name: 'XS', available: true, stock: 5 },
    { id: 's', name: 'S', available: true, stock: 12 },
    { id: 'm', name: 'M', available: true, stock: 8 },
    { id: 'l', name: 'L', available: true, stock: 15 },
    { id: 'xl', name: 'XL', available: true, stock: 6 },
    { id: 'xxl', name: 'XXL', available: false, stock: 0 }
  ],
  rating: 5,
  reviewCount: 24,
  description: 'Co-ord set berbahan linen premium yang dirancang untuk comfort dan style. Hadir dengan atasan crop dan celana straight-cut, cocok untuk casual hingga semi-formal occasions.',
  details: {
    material: '70% Linen, 30% Cotton',
    care: ['Cuci terpisah dengan warna sejenis', 'Gunakan air dingin, detergent lembut', 'Jangan gunakan pemutih', 'Jemur di tempat teduh', 'Setrika dengan suhu medium'],
    features: ['Original Brand Lokal', 'Material Premium', 'Free Ongkir Jabodetabek'],
    shipping: ['Gratis ongkir Jabodetabek min. belanja Rp 200.000', 'Regular delivery: 2-4 hari kerja', 'Express delivery: 1-2 hari kerja'],
    returns: ['30 hari garansi retur', 'Produk harus dalam kondisi original', 'Gratis ongkir retur untuk defective items']
  }
};

// ═══════════════════════════════════════════════════════════════
// PRODUCT DETAIL PAGE CLASS
// ═══════════════════════════════════════════════════════════════
class ProductDetailPage {
  constructor() {
    this.product = productData;
    this.selectedColor = this.product.colors[0];
    this.selectedSize = null;
    this.quantity = 1;
    this.currentImageIndex = 0;
    this.isZoomEnabled = false;

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateUI();
    this.initializeWishlistButton();
    this.loadRelatedProducts();
    this.loadReviews();
    this.restoreQuantity();
  }

  bindEvents() {
    // Thumbnail click handlers
    document.querySelectorAll('.thumbnail').forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => {
        this.selectImage(index);
      });
    });

    // Color selection
    document.querySelectorAll('.color-option').forEach((option, index) => {
      option.addEventListener('click', () => {
        this.selectColor(index);
      });
    });

    // Size selection
    document.querySelectorAll('.size-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const sizeId = btn.textContent.toLowerCase();
        this.selectSize(sizeId);
      });
    });

    // Size guide link
    const sizeGuideLink = document.querySelector('.size-guide-link');
    if (sizeGuideLink) {
      sizeGuideLink.addEventListener('click', () => {
        this.showSizeGuide();
      });
    }

    // Quantity controls
    window.incrementQty = () => this.incrementQuantity();
    window.decrementQty = () => this.decrementQuantity();

    const qtyInput = document.getElementById('qtyInput');
    if (qtyInput) {
      qtyInput.addEventListener('change', (e) => {
        this.setQuantity(parseInt(e.target.value) || 1);
      });
    }

    // Add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        this.addToCart();
      });
    }

    // Wishlist button
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        this.toggleWishlist();
      });
    }

    // Share button
    const shareBtn = document.querySelectorAll('.wishlist-btn')[1];
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.shareProduct();
      });
    }

    // Zoom button
    const zoomBtn = document.querySelector('.zoom-btn');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', () => {
        this.toggleZoom();
      });
    }

    // Keyboard navigation for gallery
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.previousImage();
      } else if (e.key === 'ArrowRight') {
        this.nextImage();
      } else if (e.key === 'Escape' && this.isZoomEnabled) {
        this.toggleZoom();
      }
    });

    // Accordion functionality
    window.toggleAccordion = (header) => {
      this.toggleAccordion(header);
    };
  }

  selectImage(index) {
    this.currentImageIndex = index;
    this.updateMainImage();
    this.updateThumbnailActive();
  }

  updateMainImage() {
    const mainImage = document.querySelector('.main-image img');
    if (mainImage) {
      mainImage.style.opacity = '0';
      setTimeout(() => {
        mainImage.src = this.product.images[this.currentImageIndex];
        mainImage.style.opacity = '1';
      }, 150);
    }
  }

  updateThumbnailActive() {
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
      if (index === this.currentImageIndex) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });
  }

  nextImage() {
    const nextIndex = (this.currentImageIndex + 1) % this.product.images.length;
    this.selectImage(nextIndex);
  }

  previousImage() {
    const prevIndex = (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
    this.selectImage(prevIndex);
  }

  selectColor(index) {
    this.selectedColor = this.product.colors[index];
    this.selectedSize = null; // Reset size when color changes

    this.updateColorSelection();
    this.updateSizeAvailability();
    this.updateSelectorValue('Warna:', this.selectedColor.name);
  }

  updateColorSelection() {
    document.querySelectorAll('.color-option').forEach((option, index) => {
      if (index === this.product.colors.indexOf(this.selectedColor)) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }

  selectSize(sizeId) {
    const size = this.product.sizes.find(s => s.id === sizeId);

    if (!size || !size.available) {
      LVRE.notify.warning('Ukuran tidak tersedia');
      return;
    }

    this.selectedSize = size;
    this.updateSizeSelection();
    this.updateSelectorValue('Ukuran:', size.name.toUpperCase());
  }

  updateSizeSelection() {
    document.querySelectorAll('.size-option').forEach(btn => {
      const sizeId = btn.textContent.toLowerCase();
      if (sizeId === this.selectedSize?.id) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  updateSizeAvailability() {
    document.querySelectorAll('.size-option').forEach(btn => {
      const sizeId = btn.textContent.toLowerCase();
      const size = this.product.sizes.find(s => s.id === sizeId);

      if (size && !size.available) {
        btn.classList.add('disabled');
      } else {
        btn.classList.remove('disabled');
      }
    });
  }

  updateSelectorValue(label, value) {
    const selectorLabels = document.querySelectorAll('.selector-label');
    selectorLabels.forEach(labelEl => {
      if (labelEl.textContent.startsWith(label)) {
        const valueEl = labelEl.querySelector('.selector-value');
        if (valueEl) {
          valueEl.textContent = value;
        }
      }
    });
  }

  incrementQuantity() {
    if (this.quantity < 10) {
      this.setQuantity(this.quantity + 1);
    } else {
      LVRE.notify.warning('Maksimal quantity 10');
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.setQuantity(this.quantity - 1);
    }
  }

  setQuantity(value) {
    this.quantity = Math.max(1, Math.min(10, value));

    const qtyInput = document.getElementById('qtyInput');
    if (qtyInput) {
      qtyInput.value = this.quantity;
    }

    this.saveQuantity();
  }

  saveQuantity() {
    localStorage.setItem('lvre_last_quantity', this.quantity.toString());
  }

  restoreQuantity() {
    const savedQuantity = localStorage.getItem('lvre_last_quantity');
    if (savedQuantity) {
      this.setQuantity(parseInt(savedQuantity));
    }
  }

  addToCart() {
    if (!this.selectedSize) {
      LVRE.modal.confirm('Silakan pilih ukuran terlebih dahulu', {
        title: 'Ukuran Belum Dipilih',
        confirmText: 'Pilih Ukuran',
        cancelText: 'Batal',
        onConfirm: () => {
          // Scroll to size selector
          document.querySelector('.size-grid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      return;
    }

    const productToAdd = {
      id: this.product.id,
      name: this.product.name,
      brand: this.product.brand,
      price: this.product.price,
      originalPrice: this.product.originalPrice,
      image: this.product.images[0]
    };

    const variant = {
      color: this.selectedColor.name,
      size: this.selectedSize.name
    };

    LVRE.cart.addItem(productToAdd, variant, this.quantity);

    // Animate button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.innerHTML = `
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        Berhasil Ditambahkan
      `;
      addToCartBtn.style.background = '#10B981';

      setTimeout(() => {
        addToCartBtn.innerHTML = `
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Tambah ke Keranjang
        `;
        addToCartBtn.style.background = '';
      }, 2000);
    }
  }

  toggleWishlist() {
    const productToAdd = {
      id: this.product.id,
      name: this.product.name,
      brand: this.product.brand,
      price: this.product.price,
      originalPrice: this.product.originalPrice,
      image: this.product.images[0]
    };

    const isAdded = LVRE.wishlist.toggleProduct(productToAdd);
    this.updateWishlistButton(isAdded);
  }

  updateWishlistButton(isActive) {
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (!wishlistBtn) return;

    if (isActive) {
      wishlistBtn.innerHTML = `
        <svg width="16" height="16" fill="#EF4444" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        Tersimpan di Wishlist
      `;
    } else {
      wishlistBtn.innerHTML = `
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        Tambah ke Wishlist
      `;
    }
  }

  initializeWishlistButton() {
    const isInWishlist = LVRE.wishlist.isInWishlist(this.product.id);
    this.updateWishlistButton(isInWishlist);
  }

  shareProduct() {
    const shareData = {
      title: this.product.name,
      text: `Check out ${this.product.name} by ${this.product.brand} di LVRE!`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(err => {
        this.fallbackShare(shareData);
      });
    } else {
      this.fallbackShare(shareData);
    }
  }

  fallbackShare(shareData) {
    // Copy link to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        LVRE.notify.success('Link produk disalin ke clipboard');
      }).catch(() => {
        this.showShareModal(shareData);
      });
    } else {
      this.showShareModal(shareData);
    }
  }

  showShareModal(shareData) {
    const shareHTML = `
      <div style="text-align: center; padding: 20px;">
        <p style="margin-bottom: 20px; color: #374151;">Share produk ini:</p>
        <div style="display: flex; gap: 12px; justify-content: center; margin-bottom: 20px;">
          <button class="share-btn" data-platform="whatsapp" style="width: 50px; height: 50px; border-radius: 50%; background: #25D366; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 24px;">📱</button>
          <button class="share-btn" data-platform="facebook" style="width: 50px; height: 50px; border-radius: 50%; background: #1877F2; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 24px;">👤</button>
          <button class="share-btn" data-platform="twitter" style="width: 50px; height: 50px; border-radius: 50%; background: #1DA1F2; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 24px;">🐦</button>
          <button class="share-btn" data-platform="telegram" style="width: 50px; height: 50px; border-radius: 50%; background: #0088cc; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 24px;">✈️</button>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <input type="text" value="${window.location.href}" readonly style="flex: 1; padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;" id="shareLinkInput">
          <button onclick="navigator.clipboard.writeText('${window.location.href}'); LVRE.notify.success('Link disalin!');" style="padding: 8px 16px; background: #1E5A8D; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">Salin</button>
        </div>
      </div>
    `;

    LVRE.modal.open(shareHTML, { title: 'Share Produk', size: 'small' });

    // Add share button handlers
    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const platform = btn.dataset.platform;
        this.shareToPlatform(platform, shareData);
      });
    });
  }

  shareToPlatform(platform, shareData) {
    const encodedUrl = encodeURIComponent(shareData.url);
    const encodedText = encodeURIComponent(shareData.text);

    const urls = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  }

  toggleZoom() {
    this.isZoomEnabled = !this.isZoomEnabled;

    if (this.isZoomEnabled) {
      this.showZoomModal();
    } else {
      LVRE.modal.close();
    }
  }

  showZoomModal() {
    const zoomHTML = `
      <div style="position: relative;">
        <img
          src="${this.product.images[this.currentImageIndex]}"
          alt="${this.product.name}"
          style="width: 100%; max-height: 70vh; object-fit: contain; cursor: zoom-in;"
          id="zoomedImage"
        >
        <div style="display: flex; justify-content: center; gap: 12px; margin-top: 16px;">
          ${this.product.images.map((img, index) => `
            <img
              src="${img}"
              alt="Thumbnail ${index + 1}"
              style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px; cursor: pointer; border: 2px solid ${index === this.currentImageIndex ? '#1E5A8D' : 'transparent'}; transition: border-color 0.2s;"
              onclick="window.productDetailPage.selectZoomedImage(${index})"
            >
          `).join('')}
        </div>
        <p style="text-align: center; color: #6B7280; font-size: 14px; margin-top: 12px;">Gunakan panah keyboard untuk navigasi, ESC untuk close</p>
      </div>
    `;

    LVRE.modal.open(zoomHTML, {
      title: this.product.name,
      size: 'large',
      showClose: true
    });

    // Add image zoom functionality
    const zoomedImage = document.getElementById('zoomedImage');
    if (zoomedImage) {
      zoomedImage.addEventListener('click', () => {
        this.toggleZoom();
      });
    }
  }

  selectZoomedImage(index) {
    this.selectImage(index);
    const zoomedImage = document.getElementById('zoomedImage');
    if (zoomedImage) {
      zoomedImage.src = this.product.images[index];
    }
  }

  showSizeGuide() {
    const sizeGuideHTML = `
      <div style="padding: 20px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="border-bottom: 2px solid #1E5A8D;">
              <th style="padding: 12px; text-align: left;">Ukuran</th>
              <th style="padding: 12px; text-align: center;">Lingkar Dada</th>
              <th style="padding: 12px; text-align: center;">Panjang Top</th>
              <th style="padding: 12px; text-align: center;">Panjang Celana</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #E5E7EB;">
              <td style="padding: 12px;">XS</td>
              <td style="padding: 12px; text-align: center;">84 cm</td>
              <td style="padding: 12px; text-align: center;">37 cm</td>
              <td style="padding: 12px; text-align: center;">94 cm</td>
            </tr>
            <tr style="border-bottom: 1px solid #E5E7EB;">
              <td style="padding: 12px;">S</td>
              <td style="padding: 12px; text-align: center;">88 cm</td>
              <td style="padding: 12px; text-align: center;">38 cm</td>
              <td style="padding: 12px; text-align: center;">95 cm</td>
            </tr>
            <tr style="border-bottom: 1px solid #E5E7EB;">
              <td style="padding: 12px;">M</td>
              <td style="padding: 12px; text-align: center;">92 cm</td>
              <td style="padding: 12px; text-align: center;">39 cm</td>
              <td style="padding: 12px; text-align: center;">96 cm</td>
            </tr>
            <tr style="border-bottom: 1px solid #E5E7EB;">
              <td style="padding: 12px;">L</td>
              <td style="padding: 12px; text-align: center;">96 cm</td>
              <td style="padding: 12px; text-align: center;">40 cm</td>
              <td style="padding: 12px; text-align: center;">97 cm</td>
            </tr>
            <tr style="border-bottom: 1px solid #E5E7EB;">
              <td style="padding: 12px;">XL</td>
              <td style="padding: 12px; text-align: center;">100 cm</td>
              <td style="padding: 12px; text-align: center;">41 cm</td>
              <td style="padding: 12px; text-align: center;">98 cm</td>
            </tr>
            <tr>
              <td style="padding: 12px;">XXL</td>
              <td style="padding: 12px; text-align: center;">104 cm</td>
              <td style="padding: 12px; text-align: center;">42 cm</td>
              <td style="padding: 12px; text-align: center;">99 cm</td>
            </tr>
          </tbody>
        </table>
        <div style="background: #FEF3C7; padding: 16px; border-radius: 8px; border-left: 4px solid #F59E0B;">
          <p style="margin: 0; font-size: 14px; color: #92400E;"><strong>Tips Pengukuran:</strong> Untuk hasil terbaik, ukur body Anda dan bandingkan dengan tabel di atas. Jika berada di antara ukuran, pilih ukuran yang lebih besar untuk kenyamanan.</p>
        </div>
      </div>
    `;

    LVRE.modal.open(sizeGuideHTML, {
      title: 'Panduan Ukuran',
      size: 'medium'
    });
  }

  toggleAccordion(header) {
    const accordionItem = header.closest('.accordion-item');
    const isActive = accordionItem.classList.contains('active');

    // Close all accordions
    document.querySelectorAll('.accordion-item').forEach(item => {
      item.classList.remove('active');
    });

    // Open clicked one if it wasn't active
    if (!isActive) {
      accordionItem.classList.add('active');
    }
  }

  loadRelatedProducts() {
    const relatedGrid = document.querySelector('.related-grid');
    if (!relatedGrid) return;

    // Sample related products (in real app, this would come from API)
    const relatedProducts = [
      {
        id: 'p2',
        name: 'Wrap Midi Dress — Ivory',
        brand: 'Fiera Label',
        price: 320000,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        badge: 'sale',
        badgeText: '−20%'
      },
      {
        id: 'p3',
        name: 'Oversized Blazer — Forest',
        brand: 'Rima Collective',
        price: 620000,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80'
      },
      {
        id: 'p4',
        name: 'Satin Slip Skirt — Moss',
        brand: 'Kaia Haus',
        price: 255000,
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
        badge: 'new',
        badgeText: 'New'
      },
      {
        id: 'p12',
        name: 'Linen Trousers — Sand',
        brand: 'Naura Studio',
        price: 375000,
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80'
      }
    ];

    relatedGrid.innerHTML = relatedProducts.map(product => `
      <a href="detail.html?id=${product.id}" class="product-card">
        <div class="product-img-wrap">
          <img src="${product.image}" alt="${product.name}">
          ${product.badge ? `<span class="product-badge badge-${product.badge}">${product.badgeText}</span>` : ''}
          <button
            class="product-wishlist ${LVRE.wishlist.isInWishlist(product.id) ? 'active' : ''}"
            data-product-id="${product.id}"
            aria-label="Wishlist"
            onclick="event.preventDefault(); LVRE.wishlist.toggleProduct({id: '${product.id}', name: '${product.name}', brand: '${product.brand}', price: ${product.price}, image: '${product.image}'});"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
        <div class="product-brand">${product.brand}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">
          <span class="price-current">Rp ${product.price.toLocaleString('id-ID')}</span>
        </div>
      </a>
    `).join('');
  }

  loadReviews() {
    // Sample reviews data
    const reviews = [
      {
        id: 1,
        author: 'Sarah W.',
        date: '15 Mar 2024',
        rating: 5,
        text: 'Bahannya adem banget, pas dipake buat kondangan. Warnanya juga cantik, sama kayak di foto.',
        verified: true
      },
      {
        id: 2,
        author: 'Dewi L.',
        date: '10 Mar 2024',
        rating: 5,
        text: 'Suka sama potongannya, flattering di badan. Linen-nya juga ga gampang kusut.',
        verified: true
      },
      {
        id: 3,
        author: 'Maya P.',
        date: '8 Mar 2024',
        rating: 4,
        text: 'Overall bagus, cuma size agak kecil dibanding brand lain. Harus pake size L padahal biasanya M.',
        verified: true
      },
      {
        id: 4,
        author: 'Rina S.',
        date: '5 Mar 2024',
        rating: 5,
        text: 'Pengiriman cepat, packaging rapi. Pasti bakal order lagi dari brand ini.',
        verified: true
      }
    ];

    const reviewGrid = document.querySelector('.review-grid');
    if (!reviewGrid) return;

    reviewGrid.innerHTML = reviews.map(review => `
      <div class="review-card">
        <div class="review-header">
          <div>
            <div class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            <div class="review-date">${review.date}</div>
          </div>
        </div>
        <div class="review-author">${review.author}</div>
        <p class="review-text">"${review.text}"</p>
        ${review.verified ? `
          <div class="review-verified">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            Verified Buyer
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  updateUI() {
    this.updateThumbnailActive();
    this.updateColorSelection();
    this.updateSizeAvailability();
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  window.productDetailPage = new ProductDetailPage();
});