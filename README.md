# Indodax Crypto Trading Platform (Modern Static Simulator)

Platform trading kripto modern dengan tampilan khas **Indodax**, dibangun menggunakan **React**, **Next.js 14**, dan **TypeScript**. Aplikasi ini merupakan *static paper trading platform* interaktif yang memungkinkan pengguna melakukan simulasi perdagangan aset kripto dengan mata uang Rupiah (IDR) tanpa risiko finansial.

---

## 🚀 Fitur Unggulan

### 1. 🎨 UI/UX Modern Khas Indodax
- **Dark Theme Pro**: Skema warna navy slate (`#0b111e`), aksen cyan Indodax (`#00b8d9`), hijau emerald buy (`#0ecb81`), dan merah coral sell (`#f6465d`).
- **Responsive Layout**: Tampilan Pro Exchange yang responsif di desktop maupun perangkat mobile.
- **Micro-Interactions**: Animasi flash kedipan harga naik/turun, depth visual bar pada order book, dan efek selebrasi konfeti saat transaksi berhasil.

### 2. 🔐 Autentikasi Statis & Profil Terverifikasi
- **1-Klik Masuk Demo**: Pilihan akun demo cepat (`Budi Santoso - Pro Trader` & `Siti Rahma - Crypto Investor`).
- **Persistent Session**: Sesi login dan saldo tersimpan otomatis di `localStorage`.
- **Status KYC**: Tampilan badge verifikasi KYC Level 2 resmi untuk setiap akun demo.

### 3. 📈 Interactive Candlestick & Volume Chart
- Chart interaktif berbasis SVG/Canvas murni tanpa dependensi eksternal yang berat.
- Pilihan timeframe: `1m`, `5m`, `15m`, `1h`, dan `1D`.
- Toggle tipe chart: **Candlesticks (Lilin)** vs **Area Line Chart**.
- Histogram volume perdagangan di bagian bawah chart.
- Crosshair interaktif yang menampilkan data OHLCV (Open, High, Low, Close, Volume) secara detail.

### 4. 📖 Order Book & Market Trades Real-Time
- **Order Book**: Kedalaman penawaran Beli (Bids) dan Jual (Asks) dengan visual bar persentase volume.
- **Quick Fill**: Mengklik salah satu baris harga pada order book akan langsung mengisi form order secara otomatis.
- **Filter Tampilan**: Toggle mode Bids & Asks, Hanya Bids, atau Hanya Asks.
- **Market Trades**: Feed stream transaksi pasar publik yang terus diperbarui secara live.

### 5. ⚡ Mesin Order & Simulasi Trading Lengkap
- **Market Order**: Eksekusi instan pada harga pasar saat ini.
- **Limit Order**: Memasang order pada harga yang ditentukan; dana dikunci sementara hingga harga pasar mencapai target limit order.
- **Quick Percentage Slider**: Tombol cepat alokasi dana `25%`, `50%`, `75%`, dan `100%`.
- **Kalkulasi Otomatis**: Estimasi biaya taker/maker (0.1%) dan total biaya IDR dihitung real-time.
- **Pembatalan Order**: Pengguna dapat membatalkan order terbuka (Open Orders) kapan saja dengan pengembalian saldo instan.

### 6. 💰 Portofolio & Faucet Top-Up IDR
- Saldo awal demo: **Rp 50.000.000 IDR** + modal awal beberapa aset kripto (BTC, ETH, USDT, SOL, DOGE, XRP).
- **Faucet Saldo**: Tombol khusus untuk top-up saldo IDR tanpa batas (+Rp 10Jt, +Rp 25Jt, +Rp 50Jt, +Rp 100Jt) kapan saja.
- Rincian saldo aset tersedia dan saldo terkunci di order terbuka.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Library**: React 18
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS
- **Ikon**: Lucide React
- **Efek**: Canvas Confetti
- **Testing**: Vitest & React Testing Library (30 Unit & Integration Tests)
- **Export**: 100% Static HTML/CSS/JS export compatible (`output: 'export'`)

---

## 💻 Cara Menjalankan

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan di Mode Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 3. Menjalankan Test Suite
```bash
npm test
```
Seluruh 30 test akan dijalankan dan terverifikasi 100% lulus (Green).

### 4. Build Static Export Produksi
```bash
npm run build
```
Hasil build statis akan otomatis dihasilkan di direktori `out/` (siap dideploy ke Vercel, Netlify, GitHub Pages, atau static hosting lainnya).

---

## 🔑 Kredensial Akun Demo

- **Email**: `demo@indodax.mock`
- **Password**: `password123`
*(Atau cukup klik tombol **1-Klik Masuk Akun Demo** di modal login)*
