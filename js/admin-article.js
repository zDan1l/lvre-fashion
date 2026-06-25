// ═══════════════════════════════════════════════════════════════
// LVRE - Admin Article Management
// CRUD operations for articles/blog posts
// ═══════════════════════════════════════════════════════════════

class ArticleManagement {
  constructor() {
    this.articles = [];
    this.currentView = 'list';
    this.selectedArticleId = null;
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
    this.loadArticles();
    this.updateUI();
  }

  bindEvents() {
    // Add article button
    const addArticleBtn = document.querySelector('.add-article-btn');
    if (addArticleBtn) {
      addArticleBtn.addEventListener('click', () => this.showCreateForm());
    }

    // Edit article buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.edit-article-btn')) {
        const btn = e.target.closest('.edit-article-btn');
        const articleId = btn.dataset.articleId;
        this.showEditForm(articleId);
      }
    });

    // Delete article buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.delete-article-btn')) {
        const btn = e.target.closest('.delete-article-btn');
        const articleId = btn.dataset.articleId;
        this.deleteArticle(articleId);
      }
    });

    // Save article form
    const saveArticleBtn = document.querySelector('.save-article-btn');
    if (saveArticleBtn) {
      saveArticleBtn.addEventListener('click', () => this.saveArticle());
    }

    // Cancel/back buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('cancel-article-btn') || e.target.classList.contains('back-to-list-btn')) {
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
    const searchInput = document.getElementById('articleSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.updateUI();
      });
    }
  }

  loadArticles() {
    // Load articles from storage
    this.articles = LVRE.Storage.get('lvre_articles', this.getSampleArticles());
  }

  saveArticles() {
    LVRE.Storage.set('lvre_articles', this.articles);
  }

  getSampleArticles() {
    return [
      {
        id: 'art1',
        title: '5 Tren Fashion Indonesia 2025 yang Wajib Kamu Tahu',
        category: 'Tren',
        excerpt: 'Simak perkembangan fashion lokal yang sedang hangat dibahas pecinta fashion Tanah Air.',
        content: 'Fashion Indonesia terus berkembang pesat...',
        author: 'Editor LVRE',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
        published: true,
        createdAt: '2024-03-15',
        publishedAt: '2024-03-15'
      },
      {
        id: 'art2',
        title: 'Cara Memadukan outfit Casual untuk ke Kantor',
        category: 'Tips',
        excerpt: 'Tips mix & match outfit santai untuk tampilan profesional namun tetap nyaman.',
        content: 'Kombinasi outfit casual dan formal...',
        author: 'Editor LVRE',
        image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80',
        published: true,
        createdAt: '2024-03-10',
        publishedAt: '2024-03-10'
      }
    ];
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.updateUI();
  }

  getFilteredArticles() {
    let filtered = [...this.articles];

    // Apply search
    if (this.searchQuery) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(this.searchQuery) ||
        a.category.toLowerCase().includes(this.searchQuery) ||
        a.author.toLowerCase().includes(this.searchQuery)
      );
    }

    // Apply status filter
    if (this.currentFilter === 'published') {
      filtered = filtered.filter(a => a.published);
    } else if (this.currentFilter === 'draft') {
      filtered = filtered.filter(a => !a.published);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
    this.selectedArticleId = null;

    const listContainer = document.querySelector('.articles-list-container');
    const formContainer = document.querySelector('.article-form-container');

    if (listContainer) listContainer.style.display = 'block';
    if (formContainer) formContainer.style.display = 'none';

    this.renderArticlesList();
    this.updateStats();
  }

  renderArticlesList() {
    const articlesContainer = document.querySelector('.admin-articles-list');
    if (!articlesContainer) return;

    const filteredArticles = this.getFilteredArticles();

    if (filteredArticles.length === 0) {
      articlesContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 48px; margin-bottom: 16px;">📰</div>
          <h3 style="margin: 0 0 8px 0;">${this.searchQuery ? 'Tidak ada artikel ditemukan' : 'Tidak ada artikel'}</h3>
          <p style="margin: 0 0 24px 0; color: #666;">${this.searchQuery ? 'Coba kata kunci lain' : 'Belum ada artikel yang ditambahkan'}</p>
        </div>
      `;
      return;
    }

    articlesContainer.innerHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #E5E7EB;">
            <th style="padding: 12px; text-align: left;">Artikel</th>
            <th style="padding: 12px; text-align: left;">Kategori</th>
            <th style="padding: 12px; text-align: left;">Penulis</th>
            <th style="padding: 12px; text-align: center;">Status</th>
            <th style="padding: 12px; text-align: center;">Tanggal</th>
            <th style="padding: 12px; text-align: center;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${filteredArticles.map(article => `
            <tr style="border-bottom: 1px solid #E5E7EB;">
              <td style="padding: 16px 12px;">
                <div style="display: flex; gap: 12px; align-items: center;">
                  <img src="${article.image}" alt="${article.title}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px; border: 1px solid #E5E7EB;">
                  <div>
                    <div style="font-size: 14px; font-weight: 500; color: #1a1a1a; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${article.title}</div>
                    <div style="font-size: 13px; color: #666;">ID: ${article.id}</div>
                  </div>
                </div>
              </td>
              <td style="padding: 12px;">
                <span style="padding: 4px 12px; background: #F3F4F6; border-radius: 20px; font-size: 13px; color: #666;">
                  ${article.category}
                </span>
              </td>
              <td style="padding: 12px;">
                <div style="font-size: 14px; color: #374151;">${article.author}</div>
              </td>
              <td style="padding: 12px; text-align: center;">
                <span style="padding: 4px 12px; background: ${article.published ? '#D1FAE5' : '#F3F4F6'}; border-radius: 20px; font-size: 13px; color: ${article.published ? '#059669' : '#6B7280'};">
                  ${article.published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td style="padding: 12px; text-align: center;">
                <div style="font-size: 13px; color: #666;">
                  ${article.createdAt ? new Date(article.createdAt).toLocaleDateString('id-ID') : '-'}
                </div>
              </td>
              <td style="padding: 12px; text-align: center;">
                <div style="display: flex; gap: 8px; justify-content: center;">
                  <button class="edit-article-btn" data-article-id="${article.id}" style="padding: 6px 12px; background: #1E5A8D; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
                    Edit
                  </button>
                  <button class="delete-article-btn" data-article-id="${article.id}" style="padding: 6px 12px; background: #DC2626; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
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
    this.selectedArticleId = null;

    const listContainer = document.querySelector('.articles-list-container');
    const formContainer = document.querySelector('.article-form-container');

    if (listContainer) listContainer.style.display = 'none';
    if (formContainer) formContainer.style.display = 'block';

    this.renderArticleForm();
  }

  showEditForm(articleId) {
    const article = this.articles.find(a => a.id === articleId);
    if (!article) {
      LVRE.notify.error('Artikel tidak ditemukan');
      return;
    }

    this.currentView = 'edit';
    this.selectedArticleId = articleId;

    const listContainer = document.querySelector('.articles-list-container');
    const formContainer = document.querySelector('.article-form-container');

    if (listContainer) listContainer.style.display = 'none';
    if (formContainer) formContainer.style.display = 'block';

    this.renderArticleForm(article);
  }

  renderArticleForm(article = null) {
    const formContainer = document.querySelector('.article-form-container');
    if (!formContainer) return;

    const isEdit = article !== null;
    const title = isEdit ? 'Edit Artikel' : 'Tambah Artikel Baru';

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

      <form id="articleForm" style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Basic Info -->
          <div style="padding: 20px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #1a1a1a;">Informasi Dasar</h3>

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Judul Artikel *</label>
              <input type="text" name="title" value="${article?.title || ''}" required style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Kategori *</label>
                <select name="category" required style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
                  <option value="">Pilih kategori</option>
                  <option value="Tren" ${article?.category === 'Tren' ? 'selected' : ''}>Tren</option>
                  <option value="Tips" ${article?.category === 'Tips' ? 'selected' : ''}>Tips</option>
                  <option value="Tutorial" ${article?.category === 'Tutorial' ? 'selected' : ''}>Tutorial</option>
                  <option value="Brand Story" ${article?.category === 'Brand Story' ? 'selected' : ''}>Brand Story</option>
                  <option value="News" ${article?.category === 'News' ? 'selected' : ''}>News</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Penulis *</label>
                <input type="text" name="author" value="${article?.author || ''}" required style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
              </div>
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Excerpt (Ringkasan) *</label>
              <textarea name="excerpt" rows="2" required style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px; resize: vertical;" placeholder="Ringkasan singkat artikel untuk preview">${article?.excerpt || ''}</textarea>
            </div>

            <div>
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Konten Artikel *</label>
              <textarea name="content" rows="12" required style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px; resize: vertical;" placeholder="Tulis isi artikel lengkap di sini...">${article?.content || ''}</textarea>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Image -->
          <div style="padding: 20px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #1a1a1a;">Gambar Artikel *</h3>

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">URL Gambar Utama</label>
              <input type="url" name="image" value="${article?.image || ''}" required style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
            </div>

            ${article?.image ? `
              <div style="border: 1px solid #E5E7EB; border-radius: 6px; overflow: hidden;">
                <img src="${article.image}" alt="Preview" style="width: 100%; height: 150px; object-fit: cover;">
              </div>
            ` : `
              <div style="border: 2px dashed #D1D5DB; border-radius: 6px; padding: 30px; text-align: center; color: #9CA3AF;">
                <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin: 0 auto 8px;">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <div style="font-size: 13px;">Preview gambar artikel</div>
              </div>
            `}
          </div>

          <!-- Status -->
          <div style="padding: 20px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #1a1a1a;">Status</h3>

            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" name="published" ${article?.published ? 'checked' : ''} style="width: 16px; height: 16px;">
              <span style="font-size: 14px; color: #374151;">Published (tampilkan di website)</span>
            </label>
          </div>

          <!-- SEO -->
          <div style="padding: 20px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #1a1a1a;">SEO (Opsional)</h3>

            <div style="margin-bottom: 12px;">
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Meta Keywords</label>
              <input type="text" name="metaKeywords" value="${article?.metaKeywords || ''}" placeholder="fashion, tren, 2025" style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
            </div>

            <div>
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Meta Description</label>
              <textarea name="metaDescription" rows="3" style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px; resize: vertical;" placeholder="Deskripsi singkat untuk search engines">${article?.metaDescription || ''}</textarea>
            </div>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 12px; flex-direction: column;">
            <button type="submit" class="save-article-btn" style="padding: 12px 24px; background: #1E5A8D; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
              ${isEdit ? 'Simpan Perubahan' : 'Tambah Artikel'}
            </button>
            <button type="button" class="cancel-article-btn" style="padding: 12px 24px; background: white; border: 1px solid #D1D5DB; border-radius: 6px; cursor: pointer; font-size: 14px; color: #374151;">
              Batal
            </button>
          </div>
        </div>
      </form>
    `;

    // Bind form submit
    const form = document.getElementById('articleForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveArticle();
      });
    }
  }

  saveArticle() {
    const form = document.getElementById('articleForm');
    if (!form) return;

    const formData = new FormData(form);

    const articleData = {
      title: formData.get('title'),
      category: formData.get('category'),
      author: formData.get('author'),
      excerpt: formData.get('excerpt'),
      content: formData.get('content'),
      image: formData.get('image'),
      published: formData.get('published') === 'on',
      metaKeywords: formData.get('metaKeywords'),
      metaDescription: formData.get('metaDescription'),
      updatedAt: new Date().toISOString()
    };

    if (this.currentView === 'edit' && this.selectedArticleId) {
      // Update existing article
      const index = this.articles.findIndex(a => a.id === this.selectedArticleId);
      if (index !== -1) {
        this.articles[index] = {
          ...this.articles[index],
          ...articleData,
          id: this.selectedArticleId
        };
        LVRE.notify.success('Artikel berhasil diperbarui');
      }
    } else {
      // Create new article
      const newArticle = {
        ...articleData,
        id: 'art' + Date.now(),
        createdAt: new Date().toISOString(),
        publishedAt: articleData.published ? new Date().toISOString() : null
      };
      this.articles.unshift(newArticle);
      LVRE.notify.success('Artikel berhasil ditambahkan');
    }

    this.saveArticles();
    this.showListView();
  }

  deleteArticle(articleId) {
    LVRE.modal.confirm('Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.', {
      title: 'Konfirmasi Hapus',
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      onConfirm: () => {
        const index = this.articles.findIndex(a => a.id === articleId);
        if (index !== -1) {
          this.articles.splice(index, 1);
          this.saveArticles();
          this.updateUI();
          LVRE.notify.success('Artikel berhasil dihapus');
        }
      }
    });
  }

  updateStats() {
    const statsEl = document.querySelector('.articles-stats');
    if (!statsEl) return;

    const totalArticles = this.articles.length;
    const publishedArticles = this.articles.filter(a => a.published).length;
    const draftArticles = this.articles.filter(a => !a.published).length;

    statsEl.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="padding: 16px; background: #F9FAFB; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #1E5A8D;">${totalArticles}</div>
          <div style="font-size: 13px; color: #666;">Total Artikel</div>
        </div>
        <div style="padding: 16px; background: #F9FAFB; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #10B981;">${publishedArticles}</div>
          <div style="font-size: 13px; color: #666;">Published</div>
        </div>
        <div style="padding: 16px; background: #F9FAFB; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #F59E0B;">${draftArticles}</div>
          <div style="font-size: 13px; color: #666;">Draft</div>
        </div>
      </div>
    `;
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Make sure LVRE is loaded first
  if (!window.LVRE) {
    console.error('LVRE not loaded. Make sure app.js is included before admin-article.js');
    return;
  }

  window.articleManagement = new ArticleManagement();
});