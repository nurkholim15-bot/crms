# Collection & Recovery Management System (CRMS)
### Segmentasi: Perbankan Ritel, Komersial & Payroll (Bank DKI / Bank Jakarta & Sektor Finansial)

[![Go Version](https://img.shields.io/badge/Go-1.24+-00ADD8?logo=go&logoColor=white)](https://golang.org)
[![React Version](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-nurkholim15--bot%2Fcrms-181717?logo=github&logoColor=white)](https://github.com/nurkholim15-bot/crms)

---

## 📌 Ringkasan Sistem

**Collection & Recovery Management System (CRMS)** adalah platform enterprise terintegrasi yang dirancang khusus untuk mengelola seluruh siklus penagihan dan pemulihan kredit bermasalah (*Non-Performing Loan* / NPL) pada portofolio perbankan modern (KPR, KMK, KTA, KUR, dan Kartu Kredit), dengan fokus khusus pada segmen **Payroll ASN/PNS Pemprov DKI**.

---

## 🚀 6 Fitur Utama Unggulan

1. **Unified Customer 360° View**: Agregasi total eksposur fasilitas kredit aktif (lancar vs overdue), nomor agunan, serta linimasa aktivitas interaksi dalam satu nomor CIF.
2. **Decision Engine & Collection Scoring Model (0–1000 Poin)**: Klasifikasi risiko gagal bayar multi-faktor (`LOW_RISK`, `MEDIUM_RISK`, `HIGH_RISK`, `VIP`) dan alokasi antrean kerja otomatis (Action Path Grade 1–8).
3. **Omnichannel WhatsApp Engine (Arsitektur Kopkara-EWA)**: Pengiriman notifikasi tagihan otomatis melalui API Gateway (Fonnte / Meta Cloud API) dan direct Web URL dengan pesan skrip dinamis ter-encode serta pencatatan audit trail otomatis.
4. **7-Stage Recovery Lifecycle Pipeline**: Alur penyelamatan kredit terstruktur (`COLLECTION` -> `SKIP_TRACING` -> `RESTRUCTURING` -> `LEGAL_NOTICE` -> `LITIGATION_AUCTION` -> `SETTLEMENT` -> `CLOSED`).
5. **Instant Payment Takeout Task**: Webhook rekonsiliasi pembayaran real-time via Virtual Account / BI-FAST untuk penghentian penagihan seketika guna mencegah salah tagih (*post-payment harassment*).
6. **Role-Based Access Control (RBAC)**: Pembatasan hak akses berjenjang (`ADMIN`, `AR_HEAD`, `COLLECTOR`) dilengkapi portal manajemen eksklusif nasabah VIP.

---

## 🛠️ Tech Stack & Arsitektur

* **Backend API**: Golang 1.24+ / Gin Web Framework / GORM ORM
* **Frontend Web**: React 18+ (SPA) / Vite / Tailwind CSS / Lucide Icons
* **Database**: PostgreSQL 14+ / 18+ (`crms_db`)
* **Reverse Proxy**: Nginx SSL HTTPS Port 3030
* **Repository**: [https://github.com/nurkholim15-bot/crms](https://github.com/nurkholim15-bot/crms)

---

## ⚙️ Panduan Menjalankan Sistem Lokal

### 1. Prasyarat:
* Go 1.24+
* Node.js 18+ & npm
* PostgreSQL 14+

### 2. Backend Setup:
```bash
cd backend
go mod download
go run ./cmd/server
# Backend aktif di http://localhost:8030
```

### 3. Frontend Setup:
```bash
cd frontend
npm install
npm run dev
# Frontend aktif di http://localhost:3030
```

---

## 📦 Prosedur Sinkronisasi Git (GitHub)

```bash
# Set remote SSH (rekomendasi tanpa password)
git remote set-url origin git@github.com:nurkholim15-bot/crms.git

# Stage, commit, dan push
git add .
git commit -m "feat: complete CRMS banking system implementation"
git push -u origin main
```

---

## 📄 Dokumentasi Lengkap
Dokumen spesifikasi bisnis dan arsitektur teknis lengkap dapat dilihat pada file [system_doc_crms.md](./system_doc_crms.md).
