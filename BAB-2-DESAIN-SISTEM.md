# BAB 2
# DESAIN SISTEM

## 2.1 Pendahuluan

Sistem e-commerce fashion "LVRE" dirancang dengan pendekatan user-centered design yang mengutamakan pengalaman pengguna yang optimal. Desain sistem menggabungkan estetika visual yang elegan dengan fungsionalitas yang lengkap untuk mendukung proses jual beli produk fashion secara online. Sistem ini dibangun menggunakan teknologi web modern (HTML5, CSS3, dan JavaScript) dengan desain responsif yang dapat diakses melalui berbagai perangkat.

Desain antarmuka sistem mengusung konsep minimalis dan editorial dengan nuansa warna earth tones (cream, terracotta, dan brown) yang mencerminkan identitas brand fashion Indonesia yang sophisticated. Sistem ini menyediakan dua kategori pengguna utama: pengunjung/pelanggan dan administrator, masing-masing dengan antarmuka dan fitur yang disesuaikan dengan kebutuhan.

## 2.2 Wireframe

Wireframe merupakan rancangan awal struktur layout setiap halaman sebelum implementasi visual yang sebenarnya. Wireframe membantu dalam perencanaan posisi elemen-elemen penting seperti navigasi, konten utama, dan interaksi pengguna. Berikut adalah wireframe untuk seluruh halaman dalam sistem:

### 2.2.1 Wireframe Halaman Publik

**[PLACEHOLDER SCREENSHOT WIREFRAME LANDING PAGE]**
*Gambar 2.1 Wireframe Halaman Landing Page*

**[PLACEHOLDER SCREENSHOT WIREFRAME KATALOG PRODUK]**
*Gambar 2.2 Wireframe Halaman Katalog Produk*

**[PLACEHOLDER SCREENSHOT WIREFRAME DETAIL PRODUK]**
*Gambar 2.3 Wireframe Halaman Detail Produk*

**[PLACEHOLDER SCREENSHOT WIREFRAME KERANJANG]**
*Gambar 2.4 Wireframe Halaman Keranjang Belanja*

**[PLACEHOLDER SCREENSHOT WIREFRAME PEMBAYARAN]**
*Gambar 2.5 Wireframe Halaman Pembayaran*

**[PLACEHOLDER SCREENSHOT WIREFRAME HISTORY TRANSAKSI]**
*Gambar 2.6 Wireframe Halaman History Transaksi*

**[PLACEHOLDER SCREENSHOT WIREFRAME ARSIP ARTIKEL]**
*Gambar 2.7 Wireframe Halaman Arsip Artikel*

**[PLACEHOLDER SCREENSHOT WIREFRAME DETAIL ARTIKEL]**
*Gambar 2.8 Wireframe Halaman Detail Artikel*

### 2.2.2 Wireframe Halaman Admin

**[PLACEHOLDER SCREENSHOT WIREFRAME ADMIN DASHBOARD]**
*Gambar 2.9 Wireframe Halaman Dashboard Admin*

**[PLACEHOLDER SCREENSHOT WIREFRAME KELOLA PRODUK]**
*Gambar 2.10 Wireframe Halaman Kelola Produk*

**[PLACEHOLDER SCREENSHOT WIREFRAME KELOLA ARTIKEL]**
*Gambar 2.11 Wireframe Halaman Kelola Artikel*

**[PLACEHOLDER SCREENSHOT WIREFRAME KELOLA PENGGUNA]**
*Gambar 2.12 Wireframe Halaman Kelola Pengguna*

**[PLACEHOLDER SCREENSHOT WIREFRAME KELOLA TRANSAKSI]**
*Gambar 2.13 Wireframe Halaman Kelola Transaksi*

## 2.3 Front End

### 2.3.1 Landing Page

Halaman landing page berfungsi sebagai titik entry utama pengunjung ke sistem. Desain landing page mengusung konsep editorial dengan hero section yang menampilkan showcase produk terkurasi, navigasi yang intuitif, dan call-to-action yang jelas untuk mengarahkan pengunjung ke halaman katalog produk.

**Fitur Utama:**
- Navigasi dengan menu utama: Katalog, Artikel, Brand, Sale, dan Tentang
- Hero section dengan visual produk dan brand statement
- Quick access ke kategori produk populer
- Footer dengan informasi brand dan social media links

**[PLACEHOLDER SCREENSHOT LANDING PAGE]**
*Gambar 2.5 Tampilan Halaman Landing Page*

**[PLACEHOLDER SCREENSHOT LANDING PAGE - MOBILE VIEW]**
*Gambar 2.6 Tampilan Landing Page pada Tampilan Mobile*

### 2.3.2 Katalog Produk

Halaman katalog produk adalah jantung dari sistem e-commerce ini. Desain katalog menggunakan layout dua kolom dengan sidebar filter di sebelah kiri dan grid produk di sebelah kanan. Sistem filter yang comprehensive memungkinkan pengguna menyaring produk berdasarkan kategori, brand, rentang harga, warna, dan ukuran sesuai kebutuhan spesifik mereka.

**Fitur Utama:**
- Filter sidebar dengan 5 kategori filter: Kategori, Brand, Harga, Warna, dan Ukuran
- Product grid dengan tampilan 3 kolom pada desktop, 2 kolom pada tablet, dan 1 kolom pada mobile
- Sort option: Rekomendasi, Terbaru, Harga Terendah, Harga Tertinggi, dan Populer
- Toggle view antara grid dan list view
- Active filter tags dengan opsi remove individual atau clear all
- Pagination untuk navigasi halaman produk

**[PLACEHOLDER SCREENSHOT KATALOG PRODUK - FULL VIEW]**
*Gambar 2.7 Tampilan Katalog Produk dengan Filter Sidebar*

**[PLACEHOLDER SCREENSHOT KATALOG PRODUK - FILTER SIDEBAR]**
*Gambar 2.8 Detail Filter Sidebar pada Katalog Produk*

**[PLACEHOLDER SCREENSHOT KATALOG PRODUK - PRODUCT GRID]**
*Gambar 2.9 Tampilan Product Grid pada Katalog Produk*

**[PLACEHOLDER SCREENSHOT KATALOG PRODUK - MOBILE VIEW]**
*Gambar 2.10 Tampilan Katalog Produk pada Mobile dengan Filter Toggle*

### 2.3.3 Detail Produk

Halaman detail produk menyajikan informasi lengkap tentang sebuah produk dengan layout yang dirancang untuk konversi. Informasi produk ditampilkan secara terstruktur mulai dari visual produk, deskripsi, hingga opsi pembelian. Desain ini mengikuti pattern e-commerce best practice dengan menempatkan tombol "Tambah ke Keranjang" pada posisi yang mudah diakses.

**Fitur Utama:**
- Product gallery dengan multiple images
- Product information: nama, brand, rating, deskripsi lengkap
- Price display dengan promo pricing jika applicable
- Opsi variant: warna dan ukuran
- Quantity selector
- Tombol "Tambah ke Keranjang" dan "Beli Sekarang"
- Product recommendations section

**[PLACEHOLDER SCREENSHOT DETAIL PRODUK]**
*Gambar 2.11 Tampilan Halaman Detail Produk*

**[PLACEHOLDER SCREENSHOT DETAIL PRODUK - PRODUCT INFO]**
*Gambar 2.12 Section Informasi Produk pada Detail Produk*

### 2.3.4 Keranjang Belanja

Halaman keranjang menampilkan semua produk yang ditambahkan pengguna dengan opsi untuk memodifikasi quantity atau menghapus item. Desain keranjang menggunakan layout table-like yang jelas dengan kolom untuk product, quantity, harga, dan subtotal. Summary order ditampilkan secara sticky pada bagian bawah atau sisi kanan layar.

**Fitur Utama:**
- List produk dalam keranjang dengan thumbnail
- Quantity control (+/-) untuk setiap item
- Remove button untuk menghapus item
- Price breakdown: subtotal, pajak, ongkir
- Total harga final
- Tombol "Lanjut ke Pembayaran"
- Opsi "Belanja Lagi" untuk kembali ke katalog

**[PLACEHOLDER SCREENSHOT KERANJANG]**
*Gambar 2.13 Tampilan Halaman Keranjang Belanja*

**[PLACEHOLDER SCREENSHOT KERANJANG - EMPTY STATE]**
*Gambar 2.14 Tampilan Keranjang dalam Keadaan Kosong*

### 2.3.5 Halaman Pembayaran

Halaman pembayaran (checkout) dirancang untuk streamlin proses pembelian dengan minimal friction. Formulir dibagi menjadi beberapa section: informasi pengiriman, metode pembayaran, dan review order. Desain form mengikuti best practice dengan clear labels, appropriate input types, dan inline validation.

**Fitur Utama:**
- Form informasi pengiriman: nama, alamat lengkap, kota, kode pos, telepon
- Opsi metode pembayaran: transfer bank, e-wallet, COD
- Summary order di sisi kanan (sticky pada desktop)
- Form input voucher/promo code
- Terms & conditions checkbox
- Tombol "Proses Pembayaran" dengan loading state

**[PLACEHOLDER SCREENSHOT PEMBAYARAN]**
*Gambar 2.15 Tampilan Halaman Pembayaran*

**[PLACEHOLDER SCREENSHOT PEMBAYARAN - FORM PENGIRIMAN]**
*Gambar 2.16 Section Form Informasi Pengiriman*

**[PLACEHOLDER SCREENSHOT PEMBAYARAN - METODE PEMBAYARAN]**
*Gambar 2.17 Section Pilihan Metode Pembayaran*

### 2.3.6 History Transaksi

Halaman history transaksi memungkinkan pengguna melihat riwayat pembelian yang telah dilakukan. Setiap transaksi ditampilkan dalam card format dengan informasi singkat: nomor order, tanggal, total harga, dan status pembayaran. Pengguna dapat mengklik setiap card untuk melihat detail lebih lengkap dari transaksi tersebut.

**Fitur Utama:**
- List transaksi dalam card format
- Filter berdasarkan status pembayaran
- Informasi singkat: order ID, tanggal, total, status
- Status badge dengan color coding (Paid, Pending, Cancelled)
- Detail view untuk setiap transaksi
- Download invoice button

**[PLACEHOLDER SCREENSHOT HISTORY TRANSAKSI]**
*Gambar 2.18 Tampilan Halaman History Transaksi*

**[PLACEHOLDER SCREENSHOT HISTORY TRANSAKSI - DETAIL]**
*Gambar 2.19 Tampilan Detail History Transaksi*

### 2.3.7 Arsip Artikel

Halaman arsip artikel menampilkan koleksi konten editorial tentang fashion, tips styling, dan update trend. Desain menggunakan grid layout dengan featured article di bagian atas yang lebih besar, diikuti oleh grid artikel lainnya secara kronologis. Setiap article card menampilkan thumbnail, judul, excerpt, dan tanggal publish.

**Fitur Utama:**
- Featured article section dengan large hero image
- Article grid dengan 3 kolom layout
- Category filter untuk topik artikel
- Search bar untuk mencari artikel spesifik
- Load more button untuk pagination
- Related articles section di bawah

**[PLACEHOLDER SCREENSHOT ARSIP ARTIKEL]**
*Gambar 2.20 Tampilan Halaman Arsip Artikel*

**[PLACEHOLDER SCREENSHOT ARSIP ARTIKEL - FEATURED]**
*Gambar 2.21 Section Featured Article pada Arsip Artikel*

### 2.3.8 Detail Artikel

Halaman detail artikel menampilkan konten editorial secara lengkap dengan typography yang dioptimasi untuk keterbacaan. Layout menggunakan single column dengan fokus pada konten tulisan dan visual pendukung. Desain ini mengutamakan reading experience dengan hierarchy yang jelas antara heading, subheading, dan body text.

**Fitur Utama:**
- Article header dengan featured image, judul, dan metadata
- Body content dengan typography yang optimal
- Inline images dan captions
- Author bio section
- Share buttons (social media)
- Related articles section
- Comment section (optional)

**[PLACEHOLDER SCREENSHOT DETAIL ARTIKEL]**
*Gambar 2.22 Tampilan Halaman Detail Artikel*

**[PLACEHOLDER SCREENSHOT DETAIL ARTIKEL - CONTENT]**
*Gambar 2.23 Tampilan Konten Artikel dengan Typography Optimal*

## 2.4 Dashboard Admin

Dashboard admin menyediakan antarmuka terpusat bagi administrator untuk mengelola seluruh aspek sistem e-commerce. Desain admin dashboard mengutamakan efficiency dengan navigasi yang cepat antar menu dan data visualization untuk overview performa sistem.

### 2.4.1 Dashboard Overview

Halaman overview admin menampilkan summary statistik dan metrics penting untuk monitoring performa bisnis secara real-time. Layout dashboard menggunakan card-based design dengan modular widgets untuk setiap metric dan chart.

**Fitur Utama:**
- Statistik cards: Total produk, total pesanan, total pengguna, total revenue
- Chart visualisasi tren penjualan (line chart)
- Recent orders table dengan status indicators
- Top products list berdasarkan penjualan
- Quick action buttons untuk add item baru

**[PLACEHOLDER SCREENSHOT ADMIN DASHBOARD]**
*Gambar 2.24 Tampilan Dashboard Admin Overview*

**[PLACEHOLDER SCREENSHOT ADMIN DASHBOARD - STATISTICS]**
*Gambar 2.25 Section Statistik pada Dashboard Admin*

### 2.4.2 Kelola Produk

Halaman kelola produk memungkinkan administrator untuk menambah, mengedit, atau menghapus produk katalog. Layout menggunakan table view dengan action buttons untuk setiap produk. Modal form digunakan untuk add/edit produk tanpa meninggalkan halaman.

**Fitur Utama:**
- Product table dengan kolom: gambar, nama, kategori, harga, stok, status
- Search dan filter produk
- Add new product button
- Edit dan delete action untuk setiap produk
- Bulk actions (select multiple products)
- Pagination untuk data produkt yang banyak

**[PLACEHOLDER SCREENSHOT KELOLA PRODUK]**
*Gambar 2.26 Tampilan Halaman Kelola Produk*

**[PLACEHOLDER SCREENSHOT KELOLA PRODUK - ADD PRODUCT FORM]**
*Gambar 2.27 Form Add New Product pada Kelola Produk*

**[PLACEHOLDER SCREENSHOT KELOLA PRODUK - EDIT PRODUCT]**
*Gambar 2.28 Tampilan Edit Product dengan Form*

### 2.4.3 Kelola Artikel

Halaman kelola artikel menyediakan interface untuk content management pada sistem. Layout mirip dengan kelola produk menggunakan table view dengan status indicator untuk published/draft status.

**Fitur Utama:**
- Article table dengan kolom: featured image, judul, kategori, author, status, tanggal
- Filter berdasarkan status (published, draft)
- Add new article button
- Edit dan delete action
- Preview article before publish
- Bulk publish/unpublish actions

**[PLACEHOLDER SCREENSHOT KELOLA ARTIKEL]**
*Gambar 2.29 Tampilan Halaman Kelola Artikel*

**[PLACEHOLDER SCREENSHOT KELOLA ARTIKEL - ADD ARTICLE]**
*Gambar 2.30 Form Add New Article dengan Rich Text Editor*

### 2.4.4 Kelola Pengguna

Halaman kelola pengguna memungkinkan administrator untuk mengelola data pengguna terdaftar dalam sistem. Tabel menampilkan informasi pengguna dengan opsi untuk view detail, edit role, atau deactivate account.

**Fitur Utama:**
- User table dengan kolom: avatar, nama, email, role, tanggal join, status
- Search berdasarkan nama atau email
- Filter berdasarkan role (customer, admin)
- Add new user button
- Edit role action
- Deactivate/activate user account
- User detail view dengan activity log

**[PLACEHOLDER SCREENSHOT KELOLA PENGGUNA]**
*Gambar 2.31 Tampilan Halaman Kelola Pengguna*

**[PLACEHOLDER SCREENSHOT KELOLA PENGGUNA - USER DETAIL]**
*Gambar 2.32 Tampilan Detail User dengan Activity Log*

### 2.4.5 Kelola Transaksi

Halaman kelola transaksi menyediakan interface untuk mengelola semua order yang masuk ke sistem. Table view menampilkan list order dengan status indicators yang color-coded untuk easy scanning.

**Fitur Utama:**
- Order table dengan kolom: order ID, customer, tanggal, total, status
- Filter berdasarkan status (pending, paid, shipped, completed, cancelled)
- Search by order ID atau customer name
- Order detail view dengan item list dan shipping info
- Update status action dengan workflow buttons
- Export to CSV untuk reporting

**[PLACEHOLDER SCREENSHOT KELOLA TRANSAKSI]**
*Gambar 2.33 Tampilan Halaman Kelola Transaksi*

**[PLACEHOLDER SCREENSHOT KELOLA TRANSAKSI - ORDER DETAIL]**
*Gambar 2.34 Tampilan Detail Order pada Kelola Transaksi*

**[PLACEHOLDER SCREENSHOT KELOLA TRANSAKSI - UPDATE STATUS]**
*Gambar 2.35 Tampilan Update Status Order*

## 2.5 Pengujian Sistem

Pengujian sistem dilakukan untuk memastikan bahwa seluruh fitur berfungsi sesuai dengan spesifikasi yang telah ditetapkan. Proses pengujian mencakup beberapa aspek penting:

### 2.5.1 Pengujian Fungsional

Pengujian fungsional dilakukan untuk memverifikasi bahwa setiap fitur beroperasi dengan benar. Beberapa skenario uji yang dijalankan meliputi:

1. **Navigasi Antar Halaman**
   - Verifikasi bahwa semua link pada navigasi berfungsi dan mengarah ke halaman yang tepat
   - Pengujian breadcrumb navigation pada katalog dan detail produk
   - Verifikasi back button functionality

2. **Filter dan Pencarian Produk**
   - Pengujian setiap filter option (kategori, brand, harga, warna, ukuran)
   - Verifikasi kombinasi multiple filters bekerja secara bersamaan
   - Testing sort options (rekomendasi, terbaru, harga)
   - Verifikasi search functionality jika ada

3. **Flow Pembelian**
   - Add to cart dari katalog dan detail produk
   - Modifikasi quantity dan remove item di keranjang
   - Checkout flow completion hingga confirmation
   - Verifikasi order appears di history transaksi

4. **Admin Operations**
   - Create, read, update, delete (CRUD) operations untuk produk
   - CRUD operations untuk artikel
   - User management operations
   - Order status update workflow

### 2.5.2 Pengujian Responsivitas

Pengujian responsivitas dilakukan untuk memastikan tampilan sistem optimal di berbagai ukuran perangkat. Testing dilakukan pada beberapa breakpoint:

1. **Desktop View (1366px dan above)**
   - Verifikasi layout multi-column berfungsi dengan baik
   - Testing hover states dan desktop-specific interactions

2. **Tablet View (768px - 1024px)**
   - Verifikasi layout beradaptasi dengan baik
   - Testing touch interactions dan gesture support

3. **Mobile View (320px - 767px)**
   - Verifikasi single column layout
   - Testing hamburger menu functionality
   - Verifikasi filter sidebar toggle pada katalog
   - Testing thumb-friendly touch targets

### 2.5.3 Pengujian Browser Compatibility

Pengujian dilakukan pada beberapa browser modern untuk memastikan consistency rendering:

- Google Chrome (latest)
- Mozilla Firefox (latest)
- Safari (latest)
- Microsoft Edge (latest)

### 2.5.4 Pengujian Accessibility

Accessibility testing dilakukan untuk memastikan sistem dapat diakses oleh pengguna dengan disabilities:

- Verifikasi semantic HTML structure
- Testing keyboard navigation (tab order)
- Verifikasi ARIA labels pada interactive elements
- Testing dengan screen reader (basic verification)

**[PLACEHOLDER SCREENSHOT PENGUJIAN RESPONSIVITAS]**
*Gambar 2.36 Hasil Pengujian Responsivitas pada Berbagai Perangkat*

**[PLACEHOLDER SCREENSHOT PENGUJIAN BROWSER COMPATIBILITY]**
*Gambar 2.37 Hasil Pengujian Cross-Browser Compatibility*

**[PLACEHOLDER SCREENSHOT PENGUJIAN FUNGSIONAL]**
*Gambar 2.38 Dokumentasi Hasil Pengujian Fungsional*