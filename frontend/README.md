# Ambulu Mengajar — Frontend (React + Vite)

Folder `frontend/` ini adalah aplikasi **Frontend (FE)** mandiri untuk Company Profile & Portal Admin **Ambulu Mengajar**.

## Menjalankan Lokal
```bash
npm install
npm run dev
```

## Build Produksi
```bash
npm run build
```

## Konfigurasi Environment Variable (`.env`)
Buat file `.env` berdasarkan `.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
```
Saat di-hosting di Vercel, arahkan `VITE_API_URL` ke URL deployment Backend Vercel Anda (misal: `https://ambulu-mengajar-backend.vercel.app/api`).

