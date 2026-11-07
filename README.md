# Ambulu Mengajar — Fullstack Monorepo (Separated Frontend & Backend)

Project ini telah dipisahkan secara penuh menjadi **2 folder independen** agar **Frontend (FE)** dan **Backend (BE)** dapat dijalankan maupun di-hosting secara terpisah di **Vercel**:

```text
c:\WEB AM\
├── frontend/               # Project Frontend (React 18 + Vite) — Deploy ke Vercel (Project 1)
│   ├── public/             # Aset gambar resmi & galeri dokumentasi
│   ├── src/
│   │   ├── components/     # Komponen UI Interaktif + Portal Login & Dashboard Admin
│   │   ├── data/           # Data profil organisasi, divisi, sejarah, dan galeri
│   │   └── services/       # Klien HTTP API ke Backend (apiClient.js)
│   ├── .env.example        # Contoh konfigurasi VITE_API_URL
│   ├── package.json        # Dependensi Frontend
│   ├── vercel.json         # Konfigurasi routing SPA Vercel
│   └── vite.config.js
│
└── backend/                # Project Backend (Node.js + Vercel Serverless API) — Deploy ke Vercel (Project 2)
    ├── api/
    │   └── index.js        # Handler utama REST API + JWT Auth + CORS
    ├── data/
    │   └── seedData.js     # Seed database (Event KURMA berstatus Selesai / Donasi Ditutup)
    ├── .env.example        # Konfigurasi kredensial Admin & JWT Secret
    ├── package.json        # Konfigurasi Node.js Backend
    └── vercel.json         # Konfigurasi Serverless Function & CORS Vercel
```

---

## Cara Menjalankan Secara Lokal

### 1. Menjalankan Backend (BE)
```bash
cd backend
npm run dev
# Berjalan di http://localhost:5000
```

### 2. Menjalankan Frontend (FE)
```bash
cd frontend
npm run dev
# Berjalan di http://localhost:5173 (atau port yang tersedia)
```

---

## Cara Deploy Terpisah di Vercel

### A. Deploy Backend (`backend/`)
1. Buat project baru di Vercel dan arahkan **Root Directory** ke `backend` (atau upload folder `backend` secara terpisah).
2. Tambahkan Environment Variables:
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD` = `ambulumengajar2026`
   - `JWT_SECRET` = `ambulu-mengajar-jwt-secret-key-2026`
   - `CORS_ORIGIN` = `*`
3. Klik **Deploy** dan salin URL domain Backend (contoh: `https://ambulu-mengajar-be.vercel.app`).

### B. Deploy Frontend (`frontend/`)
1. Buat project baru di Vercel dan arahkan **Root Directory** ke `frontend` (atau upload folder `frontend` secara terpisah).
2. Tambahkan Environment Variable:
   - `VITE_API_URL` = `https://ambulu-mengajar-be.vercel.app/api`
3. Klik **Deploy**.

