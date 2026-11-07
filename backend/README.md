# Panduan Hosting Terpisah di Vercel (Frontend & Backend Ambulu Mengajar)

Proyek ini dirancang dengan arsitektur **Frontend React (`c:\WEB AM`)** dan **Backend Express Serverless (`c:\WEB AM\backend`)** yang terpisah sepenuhnya sehingga dapat di-*deploy* sebagai **2 project berbeda di Vercel**.

---

## 1. Deploy Backend di Vercel (`c:\WEB AM\backend`)

1. Buka dashboard [Vercel](https://vercel.com/) -> **Add New Project**.
2. Pilih repository Git Anda, lalu pada bagian **Root Directory**, pilih folder **`backend`**.
3. Tambahkan **Environment Variables** berikut di Vercel (isi dengan nilai rahasia milik Anda sendiri):
   - `ADMIN_USERNAME` = username admin pilihan Anda
   - `ADMIN_PASSWORD` = password admin pilihan Anda
   - `JWT_SECRET` = teks acak panjang
   - `CORS_ORIGIN` = `*` (atau URL domain Frontend Vercel Anda)
4. Klik **Deploy**.
5. Setelah selesai, salin URL domain Backend Anda (misal: `https://ambulu-mengajar-backend.vercel.app`).

---

## 2. Deploy Frontend di Vercel (`c:\WEB AM`)

1. Buka dashboard [Vercel](https://vercel.com/) -> **Add New Project**.
2. Pilih repository yang sama, biarkan **Root Directory** tetap di root (`./`).
3. Tambahkan **Environment Variable** di project Frontend Vercel:
   - `VITE_API_URL` = `https://ambulu-mengajar-backend.vercel.app/api`
4. Klik **Deploy**.

---

## 3. Kredensial Login Admin

Kredensial ditentukan lewat Environment Variable `ADMIN_USERNAME` dan `ADMIN_PASSWORD` di Vercel, dan tidak ditampilkan di website.

