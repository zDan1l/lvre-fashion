// ═══════════════════════════════════════════════════════════════
// LVRE - Article Pages (Detail & Archive)
// Interactive article functionality with reading progress and sharing
// ═══════════════════════════════════════════════════════════════

class ArticlePages {
  constructor() {
    this.currentPage = this.detectPageType();
    this.init();
  }

  detectPageType() {
    const path = window.location.pathname;
    if (path.includes('detail-artikel.html')) return 'detail';
    if (path.includes('arsip-artikel.html')) return 'archive';
    return 'unknown';
  }

  init() {
    if (this.currentPage === 'detail') {
      this.initArticleDetail();
    } else if (this.currentPage === 'archive') {
      this.initArticleArchive();
    }
  }

  initArticleDetail() {
    this.bindDetailEvents();
    this.initReadingProgress();
    this.initTableOfContents();
    this.loadRelatedArticles();
  }

  bindDetailEvents() {
    // Share button
    const shareBtn = document.getElementById('article-share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.shareArticle();
      });
    }

    // Bookmark button
    const bookmarkBtn = document.getElementById('article-bookmark-btn');
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', () => {
        this.bookmarkArticle();
      });
    }

    // Like button
    const likeBtn = document.getElementById('article-like-btn');
    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        this.likeArticle();
      });
    }

    // Print button
    const printBtn = document.getElementById('article-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        this.printArticle();
      });
    }

    // Font size controls
    const increaseFontBtn = document.getElementById('increase-font-btn');
    const decreaseFontBtn = document.getElementById('decrease-font-btn');

    if (increaseFontBtn) {
      increaseFontBtn.addEventListener('click', () => {
        this.adjustFontSize(1);
      });
    }

    if (decreaseFontBtn) {
      decreaseFontBtn.addEventListener('click', () => {
        this.adjustFontSize(-1);
      });
    }
  }

  initReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;

    const articleContent = document.querySelector('.article-content');
    if (!articleContent) return;

    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;

      progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
  }

  initTableOfContents() {
    const articleContent = document.querySelector('.article-content');
    if (!articleContent) return;

    const headings = articleContent.querySelectorAll('h2, h3');
    if (headings.length === 0) return;

    const tocContainer = document.getElementById('table-of-contents');
    if (!tocContainer) return;

    let tocHTML = '<h4 style="margin: 0 0 12px 0;">Daftar Isi</h4><ul style="list-style: none; padding: 0;">';

    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;

      const level = heading.tagName.toLowerCase();
      const indent = level === 'h3' ? '16px' : '0';

      tocHTML += `
        <li style="margin-bottom: 8px;">
          <a href="#${id}" style="display: block; padding-left: ${indent}; color: #374151; text-decoration: none; font-size: 14px; transition: color 0.2s;" data-heading-link="${id}">
            ${heading.textContent}
          </a>
        </li>
      `;
    });

    tocHTML += '</ul>';
    tocContainer.innerHTML = tocHTML;

    // Bind click events
    tocContainer.querySelectorAll('[data-heading-link]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.dataset.headingLink;
        const target = document.getElementById(targetId);

        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Update active link
          tocContainer.querySelectorAll('[data-heading-link]').forEach(l => l.style.color = '#374151');
          link.style.color = '#1E5A8D';
        }
      });

      link.addEventListener('mouseenter', () => {
        link.style.color = '#1E5A8D';
      });

      link.addEventListener('mouseleave', () => {
        if (link.style.color !== 'rgb(30, 90, 141)') {
          link.style.color = '#374151';
        }
      });
    });
  }

  shareArticle() {
    const shareData = {
      title: document.querySelector('.article-title')?.textContent || 'LVRE Article',
      text: document.querySelector('.article-excerpt')?.textContent || '',
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        this.fallbackShare(shareData);
      });
    } else {
      this.fallbackShare(shareData);
    }
  }

  fallbackShare(shareData) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        LVRE.notify.success('Link artikel disalin ke clipboard');
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
        <p style="margin-bottom: 20px; color: #374151;">Share artikel ini:</p>
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

    LVRE.modal.open(shareHTML, { title: 'Share Artikel', size: 'small' });

    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.shareToPlatform(btn.dataset.platform, shareData);
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

  bookmarkArticle() {
    const bookmarkBtn = document.getElementById('article-bookmark-btn');
    if (!bookmarkBtn) return;

    const isBookmarked = bookmarkBtn.classList.contains('bookmarked');

    if (isBookmarked) {
      bookmarkBtn.classList.remove('bookmarked');
      bookmarkBtn.innerHTML = `
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        Simpan Artikel
      `;
      LVRE.notify.info('Artikel dihapus dari bookmark');
    } else {
      bookmarkBtn.classList.add('bookmarked');
      bookmarkBtn.innerHTML = `
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        Tersimpan
      `;
      LVRE.notify.success('Artikel disimpan ke bookmark');
    }
  }

  likeArticle() {
    const likeBtn = document.getElementById('article-like-btn');
    if (!likeBtn) return;

    const likeCount = likeBtn.dataset.likeCount || 0;
    const isLiked = likeBtn.classList.contains('liked');

    if (isLiked) {
      likeBtn.classList.remove('liked');
      likeBtn.innerHTML = `
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        ${likeCount}
      `;
    } else {
      likeBtn.classList.add('liked');
      likeBtn.innerHTML = `
        <svg width="16" height="16" fill="#EF4444" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        ${parseInt(likeCount) + 1}
      `;
      LVRE.notify.success('Terima kasih atas like Anda!');
    }
  }

  printArticle() {
    window.print();
  }

  adjustFontSize(direction) {
    const articleContent = document.querySelector('.article-content');
    if (!articleContent) return;

    const currentSize = parseInt(window.getComputedStyle(articleContent).fontSize);
    const newSize = Math.max(14, Math.min(20, currentSize + (direction * 2)));

    articleContent.style.fontSize = `${newSize}px`;

    // Save preference
    localStorage.setItem('lvre_article_font_size', newSize);
  }

  loadRelatedArticles() {
    const relatedContainer = document.getElementById('related-articles');
    if (!relatedContainer) return;

    // Sample related articles
    const relatedArticles = [
      {
        id: 'a2',
        title: '5 Wardrobe Essentials untuk Wanita Karier',
        excerpt: 'Pelajari 5 item fashion wajib yang every woman should have...',
        image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=80',
        category: 'Tips',
        date: '10 Mar 2024'
      },
      {
        id: 'a3',
        title: 'Cara Mix & Match Pakaian Kerja',
        excerpt: 'Tips menciptakan berbagai look profesional dengan item yang sama...',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
        category: 'Tips',
        date: '8 Mar 2024'
      },
      {
        id: 'a4',
        title: 'Material Guide: Linen vs Cotton',
        excerpt: 'Kenali perbedaan linen dan cotton untuk pilihan fashion terbaik...',
        image: 'https://images.unsplash.com/photo-1520006403905-6321b4b7b1d6?w=400&q=80',
        category: 'Care Guide',
        date: '5 Mar 2024'
      }
    ];

    relatedContainer.innerHTML = relatedArticles.map(article => `
      <article class="related-article-card" style="margin-bottom: 24px;">
        <a href="detail-artikel.html?id=${article.id}" style="text-decoration: none; color: inherit;">
          <div style="display: flex; gap: 16px; align-items: start;">
            <img src="${article.image}" alt="${article.title}" style="width: 120px; height: 80px; object-fit: cover; border-radius: 6px; flex-shrink: 0;">
            <div style="flex: 1;">
              <div style="font-size: 12px; color: #1E5A8D; margin-bottom: 4px; letter-spacing: 0.18em; text-transform: uppercase;">${article.category}</div>
              <h4 style="margin: 0 0 8px 0; font-size: 16px; color: #1F2937; line-height: 1.4;">${article.title}</h4>
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #6B7280; line-height: 1.5;">${article.excerpt}</p>
              <div style="font-size: 12px; color: #9CA3AF;">${article.date}</div>
            </div>
          </div>
        </a>
      </article>
    `).join('');
  }

  initArticleArchive() {
    this.bindArchiveEvents();
    this.loadArticles();
  }

  bindArchiveEvents() {
    // Category filter
    const categoryFilter = document.getElementById('article-category-filter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => {
        this.filterArticles(categoryFilter.value);
      });
    }

    // Search input
    const searchInput = document.getElementById('article-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchArticles(e.target.value);
      });
    }

    // Sort select
    const sortSelect = document.getElementById('article-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        this.sortArticles(sortSelect.value);
      });
    }
  }

  loadArticles() {
    // Sample articles data
    const articles = [
      {
        id: 'a1',
        title: '5 Tips Fashion untuk Tampil Lebih Percaya Diri',
        excerpt: 'Pelajari bagaimana fashion dapat meningkatkan kepercayaan diri Anda...',
        image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80',
        category: 'Tips',
        author: 'Admin',
        date: '2024-03-15',
        readTime: '5 min read'
      },
      {
        id: 'a2',
        title: '5 Wardrobe Essentials untuk Wanita Karier',
        excerpt: 'Pelajari 5 item fashion wajib yang every woman should have...',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
        category: 'Tips',
        author: 'Admin',
        date: '2024-03-10',
        readTime: '4 min read'
      },
      {
        id: 'a3',
        title: 'Trend Fashion Musim Panas 2024',
        excerpt: 'Simak trend fashion yang akan dominan di musim panas tahun ini...',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
        category: 'Trend',
        author: 'Admin',
        date: '2024-03-08',
        readTime: '6 min read'
      },
      {
        id: 'a4',
        title: 'Material Guide: Linen vs Cotton',
        excerpt: 'Kenali perbedaan linen dan cotton untuk pilihan fashion terbaik...',
        image: 'https://images.unsplash.com/photo-1520006403905-6321b4b7b1d6?w=600&q=80',
        category: 'Care Guide',
        author: 'Admin',
        date: '2024-03-05',
        readTime: '7 min read'
      },
      {
        id: 'a5',
        title: 'Cara Merawat Pakaian Linen',
        excerpt: 'Tips merawat pakaian linen agar awet dan tetap nyaman dipakai...',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
        category: 'Care Guide',
        author: 'Admin',
        date: '2024-03-01',
        readTime: '5 min read'
      },
      {
        id: 'a6',
        title: 'Mix & Match: Create 10 Looks with 5 Items',
        excerpt: 'Cara menciptakan 10 outfit berbeda hanya dengan 5 item fashion...',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
        category: 'Inspiration',
        author: 'Admin',
        date: '2024-02-28',
        readTime: '8 min read'
      }
    ];

    this.articles = articles;
    this.filteredArticles = [...articles];
    this.renderArticles();
  }

  renderArticles() {
    const articlesContainer = document.getElementById('articles-container');
    if (!articlesContainer) return;

    if (this.filteredArticles.length === 0) {
      articlesContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem;">
          <div style="font-size: 64px; margin-bottom: 1rem;">📝</div>
          <h3 style="font-size: 24px; color: #1F2937; margin-bottom: 0.5rem;">Tidak Ada Artikel Ditemukan</h3>
          <p style="color: #6B7280; margin-bottom: 2rem;">Coba sesuaikan kata kunci pencarian atau filter kategori</p>
        </div>
      `;
      return;
    }

    articlesContainer.innerHTML = this.filteredArticles.map(article => `
      <article class="article-card-archive" style="margin-bottom: 32px;">
        <a href="detail-artikel.html?id=${article.id}" style="text-decoration: none; color: inherit; display: block;">
          <div style="aspect-ratio: 16/9; overflow: hidden; background: #F3F4F6; margin-bottom: 16px; border-radius: 8px;">
            <img src="${article.image}" alt="${article.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          </div>
          <div style="font-size: 12px; color: #1E5A8D; margin-bottom: 8px; letter-spacing: 0.18em; text-transform: uppercase;">${article.category}</div>
          <h3 style="margin: 0 0 12px 0; font-size: 20px; color: #1F2937; line-height: 1.3;">${article.title}</h3>
          <p style="margin: 0 0 12px 0; font-size: 15px; color: #6B7280; line-height: 1.6;">${article.excerpt}</p>
          <div style="display: flex; gap: 16px; font-size: 13px; color: #9CA3AF;">
            <span>👤 ${article.author}</span>
            <span>📅 ${new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span>⏱ ${article.readTime}</span>
          </div>
        </a>
      </article>
    `).join('');

    // Update article count
    const articleCount = document.getElementById('article-count');
    if (articleCount) {
      articleCount.textContent = `${this.filteredArticles.length} Artikel`;
    }
  }

  filterArticles(category) {
    if (!category || category === 'all') {
      this.filteredArticles = [...this.articles];
    } else {
      this.filteredArticles = this.articles.filter(article => article.category === category);
    }

    this.renderArticles();
  }

  searchArticles(query) {
    if (!query.trim()) {
      this.filteredArticles = [...this.articles];
    } else {
      const searchTerm = query.toLowerCase();
      this.filteredArticles = this.articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm) ||
        article.category.toLowerCase().includes(searchTerm)
      );
    }

    this.renderArticles();
  }

  sortArticles(sortBy) {
    switch (sortBy) {
      case 'newest':
        this.filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        this.filteredArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'title':
        this.filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Default order
        this.filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    this.renderArticles();
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  window.articlePages = new ArticlePages();
});