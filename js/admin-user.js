// ═══════════════════════════════════════════════════════════════
// LVRE - Admin User Management
// CRUD operations for users
// ═══════════════════════════════════════════════════════════════

class UserManagement {
  constructor() {
    this.users = [];
    this.currentView = 'list'; // list, create, edit
    this.selectedUserId = null;
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
    this.loadUsers();
    this.updateUI();
  }

  bindEvents() {
    // Add user button
    const addUserBtn = document.querySelector('.add-user-btn');
    if (addUserBtn) {
      addUserBtn.addEventListener('click', () => this.showCreateForm());
    }

    // Edit user buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.edit-user-btn')) {
        const btn = e.target.closest('.edit-user-btn');
        const userId = btn.dataset.userId;
        this.showEditForm(userId);
      }
    });

    // Delete user buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.delete-user-btn')) {
        const btn = e.target.closest('.delete-user-btn');
        const userId = btn.dataset.userId;
        this.deleteUser(userId);
      }
    });

    // Save user form
    const saveUserBtn = document.querySelector('.save-user-btn');
    if (saveUserBtn) {
      saveUserBtn.addEventListener('click', () => this.saveUser());
    }

    // Cancel/back buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('cancel-user-btn') || e.target.classList.contains('back-to-list-btn')) {
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
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.updateUI();
      });
    }
  }

  loadUsers() {
    // Load users from the user system
    this.users = LVRE.user.getAllUsers();
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.updateUI();
  }

  getFilteredUsers() {
    let filtered = [...this.users];

    // Apply search
    if (this.searchQuery) {
      filtered = filtered.filter(u =>
        u.name?.toLowerCase().includes(this.searchQuery) ||
        u.email?.toLowerCase().includes(this.searchQuery)
      );
    }

    // Apply status filter
    if (this.currentFilter === 'admin') {
      filtered = filtered.filter(u => u.isAdmin);
    } else if (this.currentFilter === 'regular') {
      filtered = filtered.filter(u => !u.isAdmin);
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
    this.selectedUserId = null;

    const listContainer = document.querySelector('.users-list-container');
    const formContainer = document.querySelector('.user-form-container');

    if (listContainer) listContainer.style.display = 'block';
    if (formContainer) formContainer.style.display = 'none';

    this.renderUsersList();
    this.updateStats();
  }

  renderUsersList() {
    const usersContainer = document.querySelector('.admin-users-list');
    if (!usersContainer) return;

    const filteredUsers = this.getFilteredUsers();

    if (filteredUsers.length === 0) {
      usersContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 48px; margin-bottom: 16px;">👥</div>
          <h3 style="margin: 0 0 8px 0;">${this.searchQuery ? 'Tidak ada user ditemukan' : 'Tidak ada user'}</h3>
          <p style="margin: 0 0 24px 0; color: #666;">${this.searchQuery ? 'Coba kata kunci lain' : 'Belum ada user yang terdaftar'}</p>
        </div>
      `;
      return;
    }

    usersContainer.innerHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #E5E7EB;">
            <th style="padding: 12px; text-align: left;">User</th>
            <th style="padding: 12px; text-align: left;">Email</th>
            <th style="padding: 12px; text-align: left;">Telepon</th>
            <th style="padding: 12px; text-align: center;">Role</th>
            <th style="padding: 12px; text-align: center;">Terdaftar</th>
            <th style="padding: 12px; text-align: center;">Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${filteredUsers.map(user => `
            <tr style="border-bottom: 1px solid #E5E7EB;">
              <td style="padding: 16px 12px;">
                <div style="display: flex; gap: 12px; align-items: center;">
                  <div style="width: 40px; height: 40px; background: #F3F4F6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; color: #1E5A8D;">
                    ${(user.name || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <div style="font-size: 14px; font-weight: 500; color: #1a1a1a;">${user.name || '-'}</div>
                    <div style="font-size: 13px; color: #666;">ID: ${user.id}</div>
                  </div>
                </div>
              </td>
              <td style="padding: 12px;">
                <div style="font-size: 14px; color: #374151;">${user.email || '-'}</div>
              </td>
              <td style="padding: 12px;">
                <div style="font-size: 14px; color: #374151;">${user.phone || '-'}</div>
              </td>
              <td style="padding: 12px; text-align: center;">
                <span style="padding: 4px 12px; background: ${user.isAdmin ? '#DBEAFE' : '#F3F4F6'}; border-radius: 20px; font-size: 13px; color: ${user.isAdmin ? '#1E40AF' : '#374151'};">
                  ${user.isAdmin ? 'Admin' : 'User'}
                </span>
              </td>
              <td style="padding: 12px; text-align: center;">
                <div style="font-size: 13px; color: #666;">
                  ${user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}
                </div>
              </td>
              <td style="padding: 12px; text-align: center;">
                <div style="display: flex; gap: 8px; justify-content: center;">
                  <button class="edit-user-btn" data-user-id="${user.id}" style="padding: 6px 12px; background: #1E5A8D; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
                    Edit
                  </button>
                  <button class="delete-user-btn" data-user-id="${user.id}" style="padding: 6px 12px; background: #DC2626; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;" ${user.isAdmin ? 'disabled title="Tidak dapat menghapus admin"' : ''}>
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
    this.selectedUserId = null;

    const listContainer = document.querySelector('.users-list-container');
    const formContainer = document.querySelector('.user-form-container');

    if (listContainer) listContainer.style.display = 'none';
    if (formContainer) formContainer.style.display = 'block';

    this.renderUserForm();
  }

  showEditForm(userId) {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      LVRE.notify.error('User tidak ditemukan');
      return;
    }

    this.currentView = 'edit';
    this.selectedUserId = userId;

    const listContainer = document.querySelector('.users-list-container');
    const formContainer = document.querySelector('.user-form-container');

    if (listContainer) listContainer.style.display = 'none';
    if (formContainer) formContainer.style.display = 'block';

    this.renderUserForm(user);
  }

  renderUserForm(user = null) {
    const formContainer = document.querySelector('.user-form-container');
    if (!formContainer) return;

    const isEdit = user !== null;
    const title = isEdit ? 'Edit User' : 'Tambah User Baru';

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

      <form id="userForm" style="display: grid; grid-template-columns: 1fr; gap: 20px;">
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Personal Info -->
          <div style="padding: 20px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #1a1a1a;">Informasi Pribadi</h3>

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Nama Lengkap *</label>
              <input type="text" name="name" value="${user?.name || ''}" required style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Email *</label>
              <input type="email" name="email" value="${user?.email || ''}" required style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">No. Telepon</label>
              <input type="tel" name="phone" value="${user?.phone || ''}" style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
            </div>

            <div>
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px;">Password ${!isEdit ? '*' : '(biarkan kosong jika tidak ingin mengubah)'}</label>
              <input type="password" name="password" value="" ${!isEdit ? 'required' : ''} style="width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px;">
            </div>
          </div>

          <!-- Role & Settings -->
          <div style="padding: 20px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #1a1a1a;">Role & Settings</h3>

            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" name="isAdmin" ${user?.isAdmin ? 'checked' : ''} style="width: 16px; height: 16px;">
              <span style="font-size: 14px; color: #374151;">Administrator</span>
            </label>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 12px;">
            <button type="submit" class="save-user-btn" style="padding: 12px 24px; background: #1E5A8D; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
              ${isEdit ? 'Simpan Perubahan' : 'Tambah User'}
            </button>
            <button type="button" class="cancel-user-btn" style="padding: 12px 24px; background: white; border: 1px solid #D1D5DB; border-radius: 6px; cursor: pointer; font-size: 14px; color: #374151;">
              Batal
            </button>
          </div>
        </div>
      </form>
    `;

    // Bind form submit
    const form = document.getElementById('userForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveUser();
      });
    }
  }

  saveUser() {
    const form = document.getElementById('userForm');
    if (!form) return;

    const formData = new FormData(form);

    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      password: formData.get('password'),
      isAdmin: formData.get('isAdmin') === 'on'
    };

    if (this.currentView === 'edit' && this.selectedUserId) {
      // Update existing user
      if (userData.password) {
        LVRE.user.updateUser(this.selectedUserId, {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
          isAdmin: userData.isAdmin
        });
      } else {
        LVRE.user.updateUser(this.selectedUserId, {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          isAdmin: userData.isAdmin
        });
      }
      LVRE.notify.success('User berhasil diperbarui');
    } else {
      // Create new user
      const success = LVRE.user.register(userData);
      if (success) {
        LVRE.notify.success('User berhasil ditambahkan');
      } else {
        return; // Registration failed
      }
    }

    this.loadUsers();
    this.showListView();
  }

  deleteUser(userId) {
    LVRE.modal.confirm('Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.', {
      title: 'Konfirmasi Hapus',
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      onConfirm: () => {
        const user = this.users.find(u => u.id === userId);
        if (user && user.isAdmin) {
          LVRE.notify.error('Tidak dapat menghapus admin');
          return;
        }

        const deleted = LVRE.user.deleteUser(userId);
        if (deleted) {
          this.loadUsers();
          this.updateUI();
          LVRE.notify.success('User berhasil dihapus');
        }
      }
    });
  }

  updateStats() {
    const statsEl = document.querySelector('.users-stats');
    if (!statsEl) return;

    const totalUsers = this.users.length;
    const adminUsers = this.users.filter(u => u.isAdmin).length;
    const regularUsers = this.users.filter(u => !u.isAdmin).length;

    statsEl.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="padding: 16px; background: #F9FAFB; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #1E5A8D;">${totalUsers}</div>
          <div style="font-size: 13px; color: #666;">Total User</div>
        </div>
        <div style="padding: 16px; background: #F9FAFB; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #10B981;">${adminUsers}</div>
          <div style="font-size: 13px; color: #666;">Admin</div>
        </div>
        <div style="padding: 16px; background: #F9FAFB; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #F59E0B;">${regularUsers}</div>
          <div style="font-size: 13px; color: #666;">User Biasa</div>
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
    console.error('LVRE not loaded. Make sure app.js is included before admin-user.js');
    return;
  }

  window.userManagement = new UserManagement();
});