import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleSections((prev) => new Set([...prev, entry.target.id]))
            }, 80)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.fade-up').forEach((el) => {
      observer.observe(el)
    })

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="lvre-landing">
      {/* HEADER */}
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="logo">
          LV<span>R</span>E
        </Link>
        <nav className="desktop-nav">
          <Link to="/catalog">Katalog</Link>
          <Link to="/articles">Artikel</Link>
          <Link to="/brands">Brand</Link>
          <Link to="/sale">Sale</Link>
          <Link to="/about">Tentang</Link>
        </nav>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Cari">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <button className="icon-btn" aria-label="Akun">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </button>
          <div className="cart-wrap">
            <button className="icon-btn" aria-label="Keranjang">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </button>
            <span className="cart-badge">2</span>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <p className="eyebrow hero-eyebrow">Musim Baru · Koleksi 2025</p>
          <h1 className="hero-title">
            Fashion<br/>
            yang <em>Bercerita,</em><br/>
            Gaya yang Abadi.
          </h1>
          <p className="hero-sub">
            LVRE menghadirkan pilihan fashion editorial Indonesia — kurasi dengan selera, dikenakan dengan percaya diri.
          </p>
          <div className="hero-cta">
            <Link to="/catalog" className="btn-primary">
              Jelajahi Koleksi
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/articles" className="btn-ghost">Baca Artikel</Link>
          </div>
        </div>
        <div className="hero-right">
          <img
            className="hero-main-img"
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80"
            alt="LVRE Hero Fashion"
          />
          <div className="hero-img-overlay">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80"
              alt="Fashion detail"
            />
          </div>
          <div className="hero-stats">
            <div className="hero-stat-num">300+</div>
            <div className="hero-stat-label">Produk Kurasi</div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          <span className="marquee-item">Fashion Editorial</span>
          <span className="marquee-dot">✦</span>
          <span className="marquee-item">Brand Lokal Indonesia</span>
          <span className="marquee-dot">✦</span>
          <span className="marquee-item">Koleksi Terkurasi</span>
          <span className="marquee-dot">✦</span>
          <span className="marquee-item">Free Ongkir Jabodetabek</span>
          <span className="marquee-dot">✦</span>
          <span className="marquee-item">New Arrivals Every Week</span>
          <span className="marquee-dot">✦</span>
          <span className="marquee-item">Fashion Editorial</span>
          <span className="marquee-dot">✦</span>
          <span className="marquee-item">Brand Lokal Indonesia</span>
          <span className="marquee-dot">✦</span>
          <span className="marquee-item">Koleksi Terkurasi</span>
          <span className="marquee-dot">✦</span>
          <span className="marquee-item">Free Ongkir Jabodetabek</span>
          <span className="marquee-dot">✦</span>
          <span className="marquee-item">New Arrivals Every Week</span>
          <span className="marquee-dot">✦</span>
        </div>
      </div>

      {/* CATEGORIES */}
      <section id="categories" className={`categories fade-up ${visibleSections.has('categories') ? 'visible' : ''}`}>
        <div className="section-header">
          <p className="eyebrow">Temukan Gaya Anda</p>
          <h2 className="section-title serif">Belanja per Kategori</h2>
          <div className="divider"></div>
        </div>
        <div className="cat-grid">
          <div className="cat-card">
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"
              alt="Clothing"
            />
            <div className="cat-label">
              <div className="cat-label-name">Clothing</div>
              <div className="cat-label-count">142 Produk</div>
            </div>
          </div>
          <div className="cat-card">
            <img
              src="https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80"
              alt="Tas"
            />
            <div className="cat-label">
              <div className="cat-label-name">Tas & Dompet</div>
              <div className="cat-label-count">68 Produk</div>
            </div>
          </div>
          <div className="cat-card">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
              alt="Sepatu"
            />
            <div className="cat-label">
              <div className="cat-label-name">Sepatu</div>
              <div className="cat-label-count">95 Produk</div>
            </div>
          </div>
          <div className="cat-card">
            <img
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80"
              alt="Aksesori"
            />
            <div className="cat-label">
              <div className="cat-label-name">Aksesori</div>
              <div className="cat-label-count">53 Produk</div>
            </div>
          </div>
          <div className="cat-card">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80"
              alt="Outer"
            />
            <div className="cat-label">
              <div className="cat-label-name">Outer & Jacket</div>
              <div className="cat-label-count">44 Produk</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section id="featured" className={`featured fade-up ${visibleSections.has('featured') ? 'visible' : ''}`}>
        <div className="featured-header">
          <div>
            <p className="eyebrow">Pilihan Editor</p>
            <h2 className="section-title serif" style={{ textAlign: 'left', marginTop: '0.4rem' }}>
              Produk Unggulan
            </h2>
          </div>
          <Link to="/catalog" className="btn-ghost">Lihat Semua</Link>
        </div>
        <div className="product-grid">
          {/* Product 1 */}
          <div className="product-card">
            <div className="product-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80"
                alt="Naura Linen Co-ord"
              />
              <span className="product-badge badge-new">New</span>
              <button className="product-wishlist" aria-label="Wishlist">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
            <div className="product-brand">Naura Studio</div>
            <div className="product-stars">★★★★★</div>
            <div className="product-name">Linen Co-ord Set — Sage</div>
            <div className="product-price">
              <span className="price-current">Rp 485.000</span>
            </div>
          </div>

          {/* Product 2 */}
          <div className="product-card">
            <div className="product-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
                alt="Fiera Mini Dress"
              />
              <span className="product-badge badge-sale">−20%</span>
              <button className="product-wishlist" aria-label="Wishlist">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
            <div className="product-brand">Fiera Label</div>
            <div className="product-stars">★★★★☆</div>
            <div className="product-name">Wrap Midi Dress — Ivory</div>
            <div className="product-price">
              <span className="price-current">Rp 320.000</span>
              <span className="price-original">Rp 400.000</span>
            </div>
          </div>

          {/* Product 3 */}
          <div className="product-card">
            <div className="product-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1617114191518-9e7d4eb77088?w=600&q=80"
                alt="Rima Blazer"
              />
              <button className="product-wishlist" aria-label="Wishlist">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
            <div className="product-brand">Rima Collective</div>
            <div className="product-stars">★★★★★</div>
            <div className="product-name">Oversized Blazer — Forest</div>
            <div className="product-price">
              <span className="price-current">Rp 620.000</span>
            </div>
          </div>

          {/* Product 4 */}
          <div className="product-card">
            <div className="product-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80"
                alt="Kaia Slip Skirt"
              />
              <span className="product-badge badge-new">New</span>
              <button className="product-wishlist" aria-label="Wishlist">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
            <div className="product-brand">Kaia Haus</div>
            <div className="product-stars">★★★★☆</div>
            <div className="product-name">Satin Slip Skirt — Moss</div>
            <div className="product-price">
              <span className="price-current">Rp 255.000</span>
            </div>
          </div>

        </div>
      </section>

      {/* EDITORIAL STRIP */}
      <section id="editorial" className={`editorial-strip fade-up ${visibleSections.has('editorial') ? 'visible' : ''}`}>
        <div className="editorial-text">
          <p className="eyebrow">Filosofi Kami</p>
          <h2 className="editorial-big">
            Bukan Sekadar<br/>
            Belanja — ini<br/>
            <em>Pengalaman.</em>
          </h2>
          <p className="editorial-body">
            Di LVRE, kami percaya fashion adalah bahasa. Setiap produk dipilih dengan teliti oleh tim editorial kami — memastikan yang kamu kenakan bukan hanya indah, tapi bermakna. Dari brand lokal terbaik Indonesia, untuk kamu yang menghargai kualitas.
          </p>
          <Link to="/about" className="btn-primary">
            Kenali LVRE
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        <div className="editorial-visual">
          <div className="editorial-img-main">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
              alt="Editorial LVRE"
            />
          </div>
          <div className="editorial-img-accent">
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80"
              alt="Fashion detail"
            />
          </div>
          <div className="editorial-counter">
            <div className="counter-num">50+</div>
            <div className="counter-label">Brand Lokal</div>
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section id="articles" className={`articles fade-up ${visibleSections.has('articles') ? 'visible' : ''}`}>
        <div className="section-header">
          <p className="eyebrow">Dari Redaksi</p>
          <h2 className="section-title serif">The Journal</h2>
          <div className="divider"></div>
        </div>
        <div className="articles-grid">
          {/* Article 1 (featured) */}
          <div className="article-card">
            <div className="article-img">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
                alt="Artikel 1"
              />
            </div>
            <div className="article-cat">Trend · 12 Jan 2025</div>
            <h3 className="article-title">Cool Tones Takeover: Panduan Warna Dingin untuk Lemari Minimalis</h3>
            <p className="article-excerpt">
              Membangun wardrobe yang timeless dimulai dari pilihan warna yang tepat. Kami merangkum tone-tone paling relevan musim ini — dari powder blue hingga glacier white.
            </p>
            <span className="article-meta">Oleh Almira Dewi · 5 menit baca</span>
          </div>

          {/* Article 2 */}
          <div className="article-card">
            <div className="article-img">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
                alt="Artikel 2"
              />
            </div>
            <div className="article-cat">Tips · 8 Jan 2025</div>
            <h3 className="article-title">5 Cara Styling Co-ord Set agar Tidak Terlihat Monoton</h3>
            <p className="article-excerpt">
              Co-ord set yang sama bisa tampil empat cara berbeda — kuncinya ada di aksesori dan layering.
            </p>
            <span className="article-meta">Oleh Tasya Kamila · 4 menit baca</span>
          </div>

          {/* Article 3 */}
          <div className="article-card">
            <div className="article-img">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
                alt="Artikel 3"
              />
            </div>
            <div className="article-cat">Inspirasi · 3 Jan 2025</div>
            <h3 className="article-title">Brand Lokal yang Redefinisi Makna Luxury di Indonesia</h3>
            <p className="article-excerpt">
              Dari Bali hingga Jakarta, brand-brand ini membuktikan bahwa lokal bisa setara dengan internasional.
            </p>
            <span className="article-meta">Oleh Rara Setiawan · 6 menit baca</span>
          </div>
        </div>
        <div className="articles-footer">
          <Link to="/articles" className="btn-ghost">Baca Semua Artikel</Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className={`testimonials fade-up ${visibleSections.has('testimonials') ? 'visible' : ''}`}>
        <div className="section-header">
          <p className="eyebrow">Kata Mereka</p>
          <h2 className="section-title serif">Ulasan Pelanggan</h2>
          <div className="divider"></div>
        </div>
        <div className="testi-grid">
          <div className="testi-card">
            <div className="testi-quote">"</div>
            <p className="testi-text">
              LVRE adalah satu-satunya platform fashion lokal yang benar-benar terasa premium. Produknya kurasi, pengirimannya cepat, dan packagingnya cantik banget.
            </p>
            <div className="testi-author">Nadhira Putri</div>
            <div className="testi-role">Jakarta · Pelanggan Setia</div>
          </div>
          <div className="testi-card">
            <div className="testi-quote">"</div>
            <p className="testi-text">
              Akhirnya ada e-commerce fashion yang tidak ramai dan membingungkan. LVRE tahu persis apa yang dicari perempuan dengan selera tinggi tapi budget realistis.
            </p>
            <div className="testi-author">Calista Moreno</div>
            <div className="testi-role">Surabaya · Fashion Enthusiast</div>
          </div>
          <div className="testi-card">
            <div className="testi-quote">"</div>
            <p className="testi-text">
              Artikel-artikel di LVRE itu genuinely berguna dan menginspirasi. Bukan cuma buat jualan, tapi juga edukasi soal fashion yang sustainable dan thoughtful.
            </p>
            <div className="testi-author">Yasmin Salsabila</div>
            <div className="testi-role">Bandung · Content Creator</div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section id="newsletter" className={`newsletter fade-up ${visibleSections.has('newsletter') ? 'visible' : ''}`}>
        <div>
          <h2 className="nl-title">
            Jadilah yang<br/>
            Pertama Tahu<br/>
            <em>Koleksi Baru.</em>
          </h2>
          <p className="nl-sub">
            Dapatkan akses early ke koleksi terbaru, artikel editorial eksklusif, dan penawaran khusus subscriber LVRE.
          </p>
        </div>
        <div>
          <div className="nl-form">
            <div className="nl-input-row">
              <input type="email" className="nl-input" placeholder="Masukkan email kamu..." />
              <button className="nl-btn">Subscribe</button>
            </div>
            <p className="nl-note">Tidak ada spam. Berhenti berlangganan kapan saja.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="logo">
              LV<span style={{ color: 'var(--terracotta)' }}>R</span>E
            </Link>
            <p className="footer-tagline">
              Fashion yang Bercerita, Gaya yang Abadi. Platform editorial fashion Indonesia terkurasi.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Instagram">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="TikTok">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Pinterest">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Belanja</div>
            <ul className="footer-links">
              <li><Link to="/catalog/clothing">Clothing</Link></li>
              <li><Link to="/catalog/bags">Tas & Dompet</Link></li>
              <li><Link to="/catalog/shoes">Sepatu</Link></li>
              <li><Link to="/catalog/accessories">Aksesori</Link></li>
              <li><Link to="/sale">Sale</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Informasi</div>
            <ul className="footer-links">
              <li><Link to="/about">Tentang LVRE</Link></li>
              <li><Link to="/articles">Artikel Fashion</Link></li>
              <li><Link to="/brands">Brand Partner</Link></li>
              <li><Link to="/careers">Karir</Link></li>
              <li><Link to="/press">Press</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Bantuan</div>
            <ul className="footer-links">
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Pengiriman</Link></li>
              <li><Link to="/returns">Return & Refund</Link></li>
              <li><Link to="/contact">Hubungi Kami</Link></li>
              <li><Link to="/size-guide">Panduan Ukuran</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2025 LVRE — Live Fashion Revolution Experience. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Kebijakan Privasi</a>
            <a href="#">Syarat & Ketentuan</a>
            <a href="#">Cookie</a>
          </div>
        </div>
      </footer>
    </div>
  )
}