// ── STANDARD NAVBAR TEMPLATE ─────────────────────────────────
// This script generates the correct navbar structure for LVRE mobile design
const navbarTemplate = `<!-- HEADER -->
<header id="site-header">
  <!-- Logo (left on both desktop and mobile) -->
  <a href="index.html" class="logo">LV<span>R</span>E</a>

  <!-- Desktop Navigation -->
  <nav id="desktopNav">
    <a href="katalog.html">Katalog</a>
    <a href="https://lvre.framer.website/">Artikel</a>
    <a href="#">Brand</a>
    <a href="katalog.html">Sale</a>
    <a href="#">Tentang</a>
  </nav>

  <!-- Header Actions (Account + Cart on mobile, more on desktop) -->
  <div class="header-actions">
    <button class="icon-btn" aria-label="Cari" data-search-trigger>
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
    </button>
    <a href="admin/login.html" class="icon-btn" aria-label="Akun">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
    </a>
    <div class="cart-wrap">
      <a href="keranjang.html" class="icon-btn" aria-label="Keranjang">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      </a>
      <span class="cart-badge">2</span>
    </div>
    <!-- Mobile Menu Button -->
    <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Menu">
      <span></span>
    </button>
  </div>

  <!-- Mobile Navigation Overlay -->
  <nav class="mobile-nav" id="mobileNav">
    <a href="katalog.html">Katalog</a>
    <a href="https://lvre.framer.website/">Artikel</a>
    <a href="#">Brand</a>
    <a href="katalog.html">Sale</a>
    <a href="#">Tentang</a>
    <a href="admin/login.html">Login Admin</a>
    <!-- Search icon at bottom -->
    <div class="mobile-nav-search">
      <button aria-label="Cari" data-search-trigger>
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
      </button>
    </div>
  </nav>
</header>`;

console.log(navbarTemplate);