# ShopDip — Dokumentasi Lengkap

## Tech Stack
- **Framework**: React 18 + React Router v6
- **Styling**: TailwindCSS
- **API**: https://api.escuelajs.co/api/v1 (Platzi Fake API)
- **Deployment**: Docker + Nginx

---

## Alur & Cara Kerja Aplikasi

### 1. Authentication Flow

```
User buka /login
    ↓
Isi email + password → klik Submit
    ↓
Validasi frontend (required field)
    ↓
POST /auth/login → dapat access_token
    ↓
GET /auth/profile → dapat data user
    ↓
Simpan token + user ke localStorage
    ↓
Redirect ke halaman Products (/)
```

**Middleware (ProtectedRoute)**:
- Setiap route yang dilindungi (mis. /add-product) dibungkus `<ProtectedRoute>`
- Cek `isAuthenticated` dari AuthContext
- Jika belum login → redirect ke `/login`
- Jika sudah login → render halaman

---

### 2. Daftar Produk Flow

```
User buka /
    ↓
ProductsPage mount → fetch GET /products?offset=0&limit=8
    ↓
Tampilkan skeleton loading (8 kartu)
    ↓
Data masuk → render ProductCard grid
    ↓
User ketik di Search Bar
    ↓
Filter client-side berdasarkan nama
    ↓
User klik nomor halaman → fetch offset baru
```

---

### 3. Tambah Produk Flow

```
User klik "Add Product" di Navbar
    ↓
ProtectedRoute cek token
    ↓ (jika belum login)
Redirect ke /login
    ↓ (jika sudah login)
Tampilkan AddProductPage
    ↓
User isi form (title, price, desc, category, images)
    ↓
Validasi frontend:
  - title: required, max 150 char
  - price: required, harus angka positif
  - categoryId: required
    ↓
POST /products dengan Bearer token
    ↓
Sukses → Toast notifikasi hijau
       → onProductAdded(product) update state di App.jsx
       → Redirect ke / setelah 1.5 detik
       → Produk muncul di atas daftar TANPA reload
    ↓
Error → Toast notifikasi merah
```

---

## Struktur Folder

```
shop-app/
├── public/
│   └── index.html
├── src/
│   ├── context/
│   │   └── AuthContext.jsx     ← State global auth + login/logout
│   ├── components/
│   │   ├── Navbar.jsx          ← Navigasi + tombol logout
│   │   ├── ProtectedRoute.jsx  ← Middleware auth guard
│   │   ├── ProductCard.jsx     ← Kartu produk + skeleton
│   │   └── Toast.jsx           ← Notifikasi sukses/error
│   ├── pages/
│   │   ├── LoginPage.jsx       ← Halaman login
│   │   ├── ProductsPage.jsx    ← Daftar produk + search + pagination
│   │   └── AddProductPage.jsx  ← Form tambah produk
│   ├── App.jsx                 ← Router + state newProducts
│   ├── index.js
│   └── index.css               ← Tailwind + custom styles
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── package.json
```

---

## Cara Menjalankan

### Menggunakan Docker (Recommended)

```bash
# Build dan jalankan
docker-compose up --build

# Akses di browser
http://localhost:3000
```

### Tanpa Docker (Development)

```bash
npm install
npm start
# Akses di http://localhost:3000
```

---

## Demo Credentials

| Field    | Value           |
|----------|-----------------|
| Email    | john@mail.com   |
| Password | changeme        |

---

## API Endpoints yang Digunakan

| Method | Endpoint              | Kegunaan              |
|--------|-----------------------|-----------------------|
| POST   | /auth/login           | Login, dapat token    |
| GET    | /auth/profile         | Ambil data user       |
| GET    | /products             | Daftar produk         |
| POST   | /products             | Tambah produk baru    |
| GET    | /categories           | List kategori         |
