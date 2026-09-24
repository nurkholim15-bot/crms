# BLUEPRINT SISTEM MANAJEMEN PENAGIHAN & PEMULIHAN KREDIT
## Collection & Recovery Management System (CRMS)
### Segmentasi: Perbankan Ritel, Komersial & Payroll (Bank DKI / Bank Jakarta & Sektor Finansial)
**DOKUMEN SPESIFIKASI BISNIS, 6 PILAR MODERNISASI CRMS & ARSITEKTUR TEKNIS TERPADU**

---

## DAFTAR ISI
1. [Ringkasan Eksekutif (Executive Summary)](#1-ringkasan-eksekutif-executive-summary)
2. [Latar Belakang & Landasan Bisnis Perbankan (Bank DKI / Bank Jakarta)](#2-latar-belakang--landasan-bisnis-perbankan-bank-dki--bank-jakarta)
3. [Tujuan Strategis & Target KPI (Objectives & KPIs)](#3-tujuan-strategis--target-kpi-objectives--kpis)
4. [6 Pilar Utama Fitur Modernisasi CRMS](#4-6-pilar-utama-fitur-modernisasi-crms)
   - 4.1. Pilar 1: Meminimalkan Tunggakan dengan Arsitektur Fleksibel & Komposabel (80+ API)
   - 4.2. Pilar 2: Pemulihan Cerdas Berbiaya Efisien (Cost-Effective Channel Recommendations)
   - 4.3. Pilar 3: Strategi Koleksi Terkonfigurasi & Early Warning System (EWS)
   - 4.4. Pilar 4: Tampilan Terpadu Nasabah 360° (Unified Customer 360° & Script-Driven Dialogue)
   - 4.5. Pilar 5: Klasifikasi Akun Berbasis Aturan & Penugasan Antrean Otomatis
   - 4.6. Pilar 6: Alur Kerja Pemulihan Lanjutan (Advanced Collections Process Lifecycle)
5. [Pemenuhan Kebutuhan Spesifik Bank DKI / Bank Jakarta (MoM & Review Matrix)](#5-pemenuhan-kebutuhan-spesifik-bank-dki--bank-jakarta-mom--review-matrix)
   - 5.1. Filter Multi-Parameter Entry Data (DPD, Bucket, Tunggakan, Action Path)
   - 5.2. Keamanan Data, Audit Trail & Kepatuhan UU Perlindungan Data Pribadi (PDP)
   - 5.3. Penomoran Kolom Urut Baris (Row Number) di Seluruh Tabel Antrean
   - 5.4. Fitur Pencarian Instan Debitur & Rekening Pinjaman
   - 5.5. Pengawasan Desk & Mobile Field Collection (Geotagging GPS & Rekomendasi Rute)
   - 5.6. Fitur Re-Assignment Manual Penugasan Kolektor oleh Supervisor
   - 5.7. Fitur Takeout Task Assignment Otomatis (Real-Time Payment Clearance BI-FAST & VA)
   - 5.8. Perhitungan Insentif Kolektor Terintegrasi di Dashboard
   - 5.9. Penanganan Khusus Portofolio Payroll ASN/PNS Pemprov DKI (Gaji & Rapel Tukin)
   - 5.10. Tata Kelola Surat Peringatan: Surat Pemberitahuan & Jeda SP 14 Hari Kalender
6. [Arsitektur Bisnis & Aturan Segmentasi Overdue Bucket](#6-arsitektur-bisnis--aturan-segmentasi-overdue-bucket)
   - 6.1. Klasifikasi 9 Bucket Overdue (Days Past Due / DPD)
   - 6.2. Logika Pembagian Wewenang: Decision Engine (1-30 DPD) vs Core Banking (>30 DPD)
   - 6.3. Matriks Action Path & Penugasan PIC (Champion vs Challenger vs VIP)
7. [Strategi Risiko & Mekanisme Penanganan (Risk-Based Handling)](#7-strategi-risiko--mekanisme-penanganan-risk-based-handling)
   - 7.1. Low Risk (Digital & Non-Field First)
   - 7.2. Medium Risk (Hybrid: Digital, Telephony Desk & Field Visit)
   - 7.3. High Risk (Direct Field & Collateral Securitization)
   - 7.4. Segmen Khusus: Nasabah VIP / Priority Banking & AR Head Protocol
8. [Unified Customer 360° & Skrip Percakapan Terpandu Kolektor](#8-unified-customer-360--skrip-percakapan-terpandu-kolektor)
   - 8.1. Agregasi Total Eksposur Lintas Fasilitas Pinjaman (Cross-Facility Liability)
   - 8.2. Linimasa Interaksi Omnichannel Interaktif (Chronological Timeline)
   - 8.3. Skrip Percakapan Terpandu Kolektor (Script-Driven Dynamic Dialogue)
9. [Alur Kerja Siklus Pemulihan Lanjutan (Advanced Collections Lifecycle)](#9-alur-kerja-siklus-pemulihan-lanjutan-advanced-collections-lifecycle)
   - 9.1. Tahapan 1: Penagihan Reguler Omnichannel (`STAGE_COLLECTION`)
   - 9.2. Tahapan 2: Skip Tracing / Pelacakan Debitur (`STAGE_SKIP_TRACING`)
   - 9.3. Tahapan 3: Restrukturisasi Kredit Berdasarkan POJK (`STAGE_RESTRUCTURING`)
   - 9.4. Tahapan 4: Surat Peringatan & Somasi Hukum (`STAGE_LEGAL_NOTICE`)
   - 9.5. Tahapan 5: Litigasi Pengadilan & Lelang Agunan (`STAGE_LITIGATION_AUCTION`)
   - 9.6. Tahapan 6: Program Pelunasan Khusus / Diskon (`STAGE_SETTLEMENT`)
   - 9.7. Tahapan 7: Penutupan & Penyelesaian Tuntas (`STAGE_CLOSED`)
10. [Struktur Organisasi & Ekosistem Kanal Operasional](#10-struktur-organisasi--ekosistem-kanal-operasional)
    - 10.1. Head Office (Digital Automation & Centralized Desk)
    - 10.2. Branch Operational (Field Officers & Collateral Specialists)
    - 10.3. Remedial & Special Asset Management (Litigasi, Lelang KPKNL & Agency)
11. [Desain Arsitektur Sistem, Komponen & Aliran Data (Enterprise System Architecture)](#11-desain-arsitektur-sistem-komponen--aliran-data-enterprise-system-architecture)
    - 11.1. Diagram Ekosistem Perbankan CRMS Level-0 (Platform Overview & Lending Lifecycle Pillars)
    - 11.2. Diagram Aliran Data ETL Level-1 (Core System Integration & Data Transfer Pipeline)
    - 11.3. Diagram & Model Arsitektur Enterprise 5-Tier (High-Level 5-Tier Architecture Model)
    - 11.4. Arsitektur Komponen Layanan Modular Backend (Domain Micro-Services Topology)
    - 11.5. Diagram Aliran Data End-to-End & Siklus Sinkronisasi
    - 11.6. Decision Engine (Scoring Model & Rule Engine)
    - 11.7. Gerbang Omnichannel & Arsitektur Pesan Pintar
    - 11.8. Arsitektur Workbench Lapangan (mCollect) & Sistem Telemetri GeoTracker
    - 11.9. Arsitektur Settlement 6-Stage & Supervisory Control Engine
    - 11.10. Arsitektur Keamanan, Kepatuhan UU PDP No. 27/2022 & Audit Trail
    - 11.11. Arsitektur Jaringan, Topologi Infrastruktur & Deployment (Production Stack)
12. [Spesifikasi Teknis & Skema Basis Data (Technical Specs & Data Model)](#12-spesifikasi-teknis--skema-basis-data-technical-specs--data-model)
    - 12.1. Arsitektur Komponen Terimplementasi (Production Stack)
    - 12.2. Taksonomi & Daftar Lengkap Tabel Basis Data CRMS (Data Catalog & Sourcing)
    - 12.3. Kebijakan & Strategi Pemrosesan ETL Data Eksternal serta Tata Kelola Data Inputan CRMS
    - 12.4. Entity Relationship Model (ERD) Enterprise & Kamus Data Tabel Fisik
    - 12.5. Spesifikasi REST API v1 Terintegrasi
    - 12.6. Manajemen Pengguna & Role-Based Access Control (RBAC)
    - 12.7. Parameter Dinamis Lembaga Perbankan (`global_parameters`)
    - 12.8. Panduan Kompilasi & Deployment Mandiri ke VPS (Linux Systemd & Nginx SSL Port 3030)
    - 12.9. Manajemen Repositori Source Code & Git Workflow (GitHub)
13. [Panduan Operasional & Cara Verifikasi 9 Dimensi Penagihan Modern](#13-panduan-operasional--cara-verifikasi-9-dimensi-penagihan-modern)
    - 13.1. Matriks Evaluasi 9 Dimensi Penagihan (Sebelum vs Sesudah Upgrade)
    - 13.2. Prosedur Pengecekan Mendalam: Dimensi 2 s/d Dimensi 9
    - 13.3. Panduan Khusus Verifikasi: Tahapan & Kanal Rekomendasi serta Customer 360°
    - 13.4. Bedah Rinci Struktur Data & Kolom Tabel Antrean Penagihan (Kolom 1 s/d Kolom 11)
    - 13.5. Bedah Antarmuka Customer 360° & Alur Testing Lengkap
14. [Kepatuhan Regulasi Perbankan & Manajemen Risiko (POJK & Bank Indonesia)](#14-kepatuhan-regulasi-perbankan--manajemen-risiko-pojk--bank-indonesia)
15. [Rencana Implementasi & Roadmap Bertahap (Quick Wins hingga 24 Bulan)](#15-rencana-implementasi--roadmap-bertahap-quick-wins-hingga-24-bulan)
16. [Analisis Kelayakan Finansial & Dampak Bisnis (ROI Analysis)](#16-analisis-kelayakan-finansial--dampak-bisnis-roi-analysis)
17. [Arsitektur Enterprise Lengkap (Enterprise Collections Architecture Patching)](#17-arsitektur-enterprise-lengkap-enterprise-collections-architecture-patching)
    - 17.1. Pre-Delinquency Management (PDM) - DPD 0 Early Warning
    - 17.2. Functional Journey & Case Stamping
    - 17.3. Alur Penanganan Hukum (6-Stage Legal Recourse Workflow)
    - 17.4. Eksekusi Agunan & Pelelangan (8-Stage Repossession & Auction Workflow)
    - 17.5. Manajemen Kompromi & Diskon (Settlement Management - 6-Stage Lifecycle & Multi-Tranches)
    - 17.6. Fitur Pembeda Enterprise (Value Differentiators)
    - 17.7. mCollect - Workbench Penagihan Lapangan Digital
    - 17.8. GeoTracker - Pemantauan GPS Lapangan Real-Time
18. [Matriks Perbandingan Komprehensif: Sebelum vs Sesudah Patching](#18-matriks-perbandingan-komprehensif-sebelum-vs-sesudah-patching)
19. [Penutup & Lembar Persetujuan Dokumen](#19-penutup--lembar-persetujuan-dokumen)

---

## 1. Ringkasan Eksekutif (Executive Summary)

Dalam lanskap industri perbankan nasional, pengelolaan kredit bermasalah (*Collection & Recovery Management*) merupakan pilar krusial penjaga ketahanan kualitas aset produktif (*Non-Performing Loan* / NPL), efisiensi pembentukan Cadangan Kerugian Penurunan Nilai (CKPN), serta reputasi dan profitabilitas institusi keuangan.

Dokumen ini merumuskan blueprint komprehensif implementasi **Collection & Recovery Management System (CRMS)** terintegrasi untuk portofolio **Perbankan Ritel, Komersial, dan Payroll**, yang diselaraskan secara spesifik dengan hasil pembahasan kebutuhan **Bank DKI / Bank Jakarta** serta mengadopsi standar arsitektur penagihan perbankan modern (*Enterprise Best-Practice Collections System*).

### Transformasi CRMS Bertumpu pada 3 Landasan Strategis:
1. **Penyelarasan Kebutuhan Bank DKI / Bank Jakarta (MoM 4 September 2026)**:
   - Modernisasi penagihan mendahului pembaruan core banking melalui arsitektur *surrounding integration layer* yang independen.
   - Penanganan khusus portofolio **Payroll ASN/PNS Pemprov DKI** (variasi tanggal gaji, pergeseran rapel tunjangan kinerja/tukin, multi-fasilitas per debitur).
   - Penanganan terstandarisasi untuk **Kartu Kredit** (*billing cycle*), **KPR & Pinjaman Beragunan** (manajemen agunan SHM/SHGB, lelang KPKNL), serta **Komersial & UKM** (*covenant monitoring*).
   - Siklus surat peringatan berjenjang: Surat Pemberitahuan $\rightarrow$ Surat Peringatan I (SP 1) $\rightarrow$ Jeda 14 hari kalender $\rightarrow$ SP 2 $\rightarrow$ SP 3/Somasi.
   - Rekonsiliasi pembayaran *near-real-time* (Virtual Account, transfer BI-FAST) untuk penghentian penagihan seketika (*takeout task*).
2. **Adopsi 6 Pilar Utama Modernisasi CRMS**:
   - *Arsitektur Komposabel & Fleksibel* dengan 80+ API digital siap pakai.
   - *Pemulihan Cerdas Berbiaya Efisien* dengan rekomendasi kanal dinamis (*cost-effective channel recommendation*: WhatsApp AutoBot hemat 90%, Smart Robo Call hemat 80%, Desk, Field).
   - *Strategi Koleksi Terkonfigurasi* dengan Pre-Delinquent Early Warning System (EWS) dan pengujian A/B *Champion vs Challenger*.
   - *Unified Customer 360°* yang mengonsolidasikan total eksposur lintas pinjaman, linimasa omnichannel interaktif, serta panduan skrip dialog dinamis bagi kolektor (*script-driven dialogue*).
   - *Klasifikasi Akun Multi-Dimensi & Antrean Otomatis* untuk alokasi kerja yang objektif.
   - *Alur Pemulihan Lanjutan (Advanced Collections Lifecycle)* mencakup 7 tahapan: Koleksi Reguler, Skip Tracing, Restrukturisasi POJK, Somasi Hukum, Litigasi/Lelang Agunan, Settlement Diskon, dan Penutupan Rekening.
3. **Kepatuhan Regulasi & Keamanan Ketat (UU PDP No. 27/2022 & POJK)**:
   - Pembatasan akses berbasis peran (*Role-Based Access Control*), pemisahan portofolio cabang, *data masking* informasi sensitif (PII), larangan penyimpanan data nasabah di perangkat kolektor, audit trail permanen (*immutable timestamp*), dan kontrol anti-fraud berbasis GPS geotagging.

Dengan implementasi CRMS ini, bank diproyeksikan menekan NPL sebesar 0.8% - 1.4%, menghemat biaya operasional penagihan hingga 40%, dan meningkatkan kepatuhan janji bayar (*Kept PTP Ratio*) hingga di atas 74%.

---

## 2. Latar Belakang & Landasan Bisnis Perbankan (Bank DKI / Bank Jakarta)

Berdasarkan hasil pembahasan *Focus Group Discussion* (FGD) dan *Minutes of Meeting* (MoM) tanggal 4 September 2026, Bank DKI / Bank Jakarta menetapkan modernisasi sistem penagihan sebagai **prioritas strategis awal** yang harus berjalan tanpa harus menunggu pergantian sistem inti perbankan (*core banking system*). 

Kondisi operasional eksisting menghadapi tantangan struktural:
1. **Data Tersebar & Belum Terintegrasi**: Data penagihan masih berada di core banking lama, sementara data kredit macet / hapusbuku (*write-off*) dikelola menggunakan aplikasi terpisah dengan kualitas data yang belum seragam.
2. **Keterbatasan Pembacaan DPD Pasca-Restrukturisasi**: Ketika debitur memperoleh restrukturisasi, DPD operasional dapat kembali ke angka nol (0), namun profil risiko dan kolektibilitas historis tidak langsung pulih. Sistem konvensional yang hanya membaca DPD berisiko salah memberikan perlakuan (*mis-treatment*).
3. **Kompleksitas Produk Payroll ASN / Pemprov DKI**:
   - Debitur berstatus Pegawai Negeri Sipil (PNS / ASN) dan BUMD memiliki tanggal penerimaan gaji pokok dan tunjangan kinerja (tukin) yang berbeda.
   - Rapel tunjangan kinerja kerap terjadi per semester atau triwulan, sehingga keterlambatan bersifat musiman (*cash flow timing*) dan bukan cerminan gagal bayar permanen.
   - Satu debitur kerap memiliki multi-fasilitas sekaligus: KTA Payroll, Pinjaman Multiguna, KPR, dan Kartu Kredit Bank DKI.
4. **Risiko Penagihan Pasca-Bayar (*Over-Collection*)**: Akibat pemrosesan pembayaran yang masih bersifat *batch end-of-day*, debitur yang telah membayar melalui BI-FAST atau Virtual Account pada siang hari masih sering dihubungi oleh petugas penagihan. Hal ini memicu komplain nasabah dan pemborosan biaya.
5. **Pembuatan & Distribusi Surat Peringatan Manual**: Pembuatan SP 1, SP 2, dan SP 3 masih melibatkan pengetikan manual dan tanda tangan basah di cabang, sehingga lambat dan sulit diaudit kepatuhannya terhadap jeda waktu 14 hari kalender.

Oleh karena itu, diperlukan sistem CRMS yang bertindak sebagai *surrounding intelligent layer* yang menghubungkan core banking, saluran omnichannel, divisi penagihan lapangan, dan unit remedial secara terpadu.

---

## 3. Tujuan Strategis & Target KPI (Objectives & KPIs)

### 3.1. Sasaran Utama
1. **Implementasi Mandiri & Bertahap**: Memberikan *quick wins* operasional dalam waktu kurang dari 6 bulan dan *go-live* fungsionalitas utama pada Semester I.
2. **Efisiensi Biaya Koleksi (Cost of Collection)**: Memaksimalkan penyelesaian tagihan melalui saluran otomatis berbiaya murah (WA Bot & Smart IVR) pada hari-hari awal tunggakan.
3. **Penyelamatan Aset Agunan Lebih Cepat**: Memfasilitasi lelang eksekusi hak tanggungan (SHM/SHGB) dan restrukturisasi POJK secara terstruktur sebelum aset terdepresiasi.
4. **Kepatuhan Perlindungan Data Pribadi (UU PDP)**: Meniadakan kebocoran data debitur di lapangan melalui sistem *zero-local-storage* dan *data masking*.

### 3.2. Target KPI Kinerja Penagihan
| Indikator Kinerja Utama | Kondisi Baseline | Target CRMS Baru | Dampak Terhadap Bank |
|---|---|---|---|
| **Cure Rate DPD 1–7 (Digital)** | 55% | $\ge 78\%$ | Peningkatan likuiditas kas cepat tanpa biaya kunjungan |
| **Roll Rate DPD 1–30 ke DPD >30** | 4.9% | $\le 2.8\%$ | Mencegah pembentukan NPL baru |
| **Biaya Penagihan per Rekening** | Indeks 100% | $\le 60\%$ (Hemat 40%) | Efisiensi anggaran operasional desk & field |
| **Kept PTP Ratio (Janji Bayar Tepat)** | 52% | $\ge 74\%$ | Akurasi komitmen debitur meningkat |
| **Tingkat Adopsi Kanal Digital** | 22% | $\ge 70\%$ | Debitur membayar mandiri via VA / QRIS Bank |
| **Kecepatan Takeout Task Pasca-Bayar** | 12 - 24 Jam (Batch) | $< 5$ Menit (Real-Time) | Mengeliminasi salah tagih dan komplain nasabah |
| **Recovery Rate Akun Write-Off** | 12% | $\ge 26\%$ | Peningkatan pendapatan pemulihan piutang macet |

---

## 4. 6 Pilar Utama Fitur Modernisasi CRMS

Sistem CRMS mengadopsi secara penuh arsitektur teruji sistem penagihan perbankan modern (*Modernized Enterprise CRMS*):

```
+-------------------------------------------------------------------------------------------------------+
|                                6 PILAR UTAMA MODERNISASI CRMS                                         |
+-------------------+-------------------+-------------------+-------------------+-------------------+
|  1. ARSITEKTUR    |  2. PEMULIHAN     |  3. STRATEGI      |  4. CUSTOMER 360° |  5. KLASIFIKASI   |  6. LIFECYCLE     |
|     FLEKSIBEL &   |     CERDAS &      |     KOLEKSI       |     TERPADU &     |     OTOMATIS &    |     PEMULIHAN     |
|     KOMPOSABEL    |     EFISIEN BIAYA |     EWS DINAMIS   |     SKRIP DIALOG  |     ANTREAN PIC   |     LANJUTAN      |
|-------------------|-------------------|-------------------|-------------------|-------------------|-------------------|
| - Modul Modular   | - Rekomendasi     | - Pre-Delinquent  | - Agregasi Lintas | - Multi-Dimensi   | - Skip Tracing    |
| - 80+ API Digital |   Kanal Efisien   |   EWS Engine      |   Fasilitas Bank  |   Classification  | - Restrukturisasi |
| - High Scale & HA | - Digital-First   | - Champion vs     | - Linimasa Jejak  | - Automated Queue | - Somasi Hukum    |
| - Cloud / VPS     |   Cost Reduction  |   Challenger A/B  |   Omnichannel     |   Assignment      | - Litigasi/Lelang |
|   Ready           | - Embedded Engine | - Custom Rules    | - Dynamic Script  | - SLA Enforcement | - Settlement      |
+-------------------+-------------------+-------------------+-------------------+-------------------+-------------------+
```

### 4.1. Pilar 1: Meminimalkan Tunggakan dengan Arsitektur Fleksibel & Komposabel (80+ API)
- Arsitektur berbasis modul-mikro (*composable micro-engines*) yang dapat diintegrasikan dengan core banking apa pun melalui antarmuka REST API.
- Dilengkapi pustaka 80+ API digital siap pakai untuk integrasi ke Core Banking Host, Layanan Pembayaran (VA, BI-FAST, QRIS), Dukcapil, SLIK OJK, SMS Gateway, dan WhatsApp Business API.

### 4.2. Pilar 2: Pemulihan Cerdas Berbiaya Efisien (Cost-Effective Channel Recommendations)
- Mesin kalkulasi biaya kanal cerdas (*Embedded Rule Engine*):
  - **WhatsApp AutoBot**: Biaya ~Rp 400 per pesan, efisiensi biaya **90%**.
  - **Smart Interactive Robo Call**: Biaya ~Rp 900 per panggilan, efisiensi biaya **80%**.
  - **Desk Telephony**: Biaya ~Rp 12.000 per kontak, efisiensi biaya **45%**.
  - **Field Collector Visit**: Biaya ~Rp 85.000 - Rp 120.000 per kunjungan, efisiensi biaya **10%**.
- Setiap akun yang menunggak secara otomatis diberikan label `recommended_channel` dan persentase efisiensi `cost_efficiency_rate` di layar dashboard.

### 4.3. Pilar 3: Strategi Koleksi Terkonfigurasi & Early Warning System (EWS)
- **Pre-Delinquent EWS**: Menganalisis pergerakan saldo rekening tabungan dan gaji sebelum tanggal jatuh tempo (DPD 0). Jika saldo terindikasi tidak mencukupi untuk autodebet, notifikasi pengingat ramah (*preventive gentle reminder*) dikirimkan 3 hari sebelum jatuh tempo.
- **Champion vs Challenger Framework**: Mendukung simulasi strategi penagihan baru secara paralel tanpa mengganggu proses operasional inti.

### 4.4. Pilar 4: Tampilan Terpadu Nasabah 360° (Unified Customer 360° & Script-Driven Dialogue)
- Tampilan terpadu seluruh fasilitas kredit yang dimiliki nasabah (KPR, KMK, KTA, KUR, CC) dalam satu nomor CIF.
- Linimasa interaktif seluruh aktivitas penagihan lintas saluran (*interactive omnichannel timeline*).
- Panduan dialog dinamis bagi kolektor (*script-driven dynamic dialogue*) yang memberikan kalimat pembuka sopan, perincian tagihan, taktik negosiasi persuasif, dan komitmen penutup yang dapat disalin langsung ke WhatsApp.

### 4.5. Pilar 5: Klasifikasi Akun Berbasis Aturan & Penugasan Antrean Otomatis
- Akun dikelompokkan secara multi-dimensi (DPD, riwayat risiko, plafon, lokasi cabang, nilai agunan SHM/SHGB).
- Penugasan antrean otomatis ke petugas (*Automated Work Queue*) guna meniadakan cherry-picking dan mengoptimalkan utilisasi staf.

### 4.6. Pilar 6: Alur Kerja Pemulihan Lanjutan (Advanced Collections Process Lifecycle)
- Mengelola 7 tahapan pemulihan terpadu:
  1. `STAGE_COLLECTION`: Koleksi persuasif harian (Digital, Desk, Field).
  2. `STAGE_SKIP_TRACING`: Investigasi pelacakan kontak dan domisili debitur yang hilang kontak (*unreachable*).
  3. `STAGE_RESTRUCTURING`: Relaksasi kredit sesuai POJK (perpanjangan tenor, penyesuaian suku bunga, grace period).
  4. `STAGE_LEGAL_NOTICE`: Pengiriman Somasi I, II, dan III berlandaskan hukum perbankan.
  5. `STAGE_LITIGATION_AUCTION`: Gugatan sederhana di pengadilan dan permohonan lelang eksekusi agunan via KPKNL.
  6. `STAGE_SETTLEMENT`: Program pelunasan khusus (*compromise discount / haircut* bunga & denda).
  7. `STAGE_CLOSED`: Pelunasan penuh, penerbitan Surat Keterangan Lunas (SKL), dan pengurusan Roya Sertifikat Agunan.

---

## 5. Pemenuhan Kebutuhan Spesifik Bank DKI / Bank Jakarta (MoM & Review Matrix)

Berdasarkan matriks evaluasi kebutuhan pada berkas review [**`Review CMS - Bank Djakarta.xlsx`**](file:///c:/Project/documentation/crms/Review%20CMS%20-%20Bank%20Djakarta.xlsx) dan MoM 4 September 2026, sistem CRMS telah mengimplementasikan solusi tuntas untuk 10 area kebutuhan berikut:

### 5.1. Filter Multi-Parameter Entry Data (Review Point 1.0)
- Antarmuka dashboard dan daftar akun dilengkapi filter multi-dimensi:
  - Filter Hari Keterlambatan (**DPD & Bucket Matrix**)
  - Filter Status Akun (**OPEN, PROMISE TO PAY, PAID**)
  - Filter Petugas / PIC Aktif (**WA, Robot, DC, FC, SFC, Special Team**)
  - Filter Tahapan Pemulihan (**Koleksi Reguler, Skip Tracing, Restrukturisasi, Somasi, Litigasi, Settlement**)
  - Filter Nilai Tunggakan & Jalur Strategi AP (Action Path 1 s/d 8).

### 5.2. Keamanan Data, Audit Trail & Kepatuhan UU PDP (Review Point 2.0)
- **Role-Based Access Control (RBAC)**: Pembatasan hak akses berjenjang (`ADMIN`, `AR_HEAD`, `COLLECTOR`).
- **Pemisahan Cabang & Portofolio**: Petugas kantor cabang hanya dapat mengakses debitur di wilayah operasionalnya.
- **Masking Data Sensitif**: Nomor telepon, alamat, dan NIK disamarkan pada tampilan umum untuk mencegah kebocoran data.
- **Zero Local Storage**: Aplikasi mobile kolektor dilarang menyimpan data nasabah secara permanen di memori perangkat; akses ditarik otomatis begitu penugasan berakhir.
- **Audit Trail Permanen**: Setiap aktivitas penagihan, perubahan status, pengiriman pesan, pembaruan janji bayar, dan perpindahan tahapan pemulihan dicatat dengan stempel waktu tidak dapat diubah (*immutable timestamp*).

### 5.3. Penomoran Kolom Urut Baris (Row Number) (Review Point 3.0)
- Seluruh tabel penagihan (Dashboard Utama, PIC Workbench, dan Portal VIP) kini dilengkapi kolom **`No.`** urut dinamis (1, 2, 3...) guna mempermudah verifikasi dan rekonsiliasi manual oleh supervisor.

### 5.4. Fitur Pencarian Instan Debitur & Rekening Pinjaman (Review Point 4.0)
- Kotak pencarian (*Search Bar*) instan di bagian atas tabel memungkinkan pencarian cepat berdasarkan:
  - Nomor Rekening Pinjaman / Kontrak (contoh: `CRMS-KPR-...`, `CRMS-KMK-...`)
  - Nama Lengkap Debitur
  - Kota Domisili atau Tipe Agunan.

### 5.5. Pengawasan Desk & Mobile Field Collection (Review Point 5.0)
- **Geotagging GPS Anti-Fraud**: Petugas lapangan wajib menyematkan koordinat latitude/longitude saat mencatat Berita Acara Kunjungan.
- **Rekomendasi Rute & Klaster Kunjungan**: Sistem mengelompokkan debitur lapangan berdasarkan kelurahan/kecamatan terdekat untuk meminimalkan waktu dan biaya transportasi kolektor.

### 5.6. Fitur Re-Assignment Manual Penugasan Kolektor (Review Point 6.0)
- Jika seorang petugas kolektor mengalami beban kerja berlebih (*overload*), sakit/cuti (*out-of-office*), rotasi zonasi wilayah domisili, atau diperlukan eskalasi penanganan khusus, supervisor (*AR Head* atau *Team Leader*) memiliki wewenang untuk mengalihkan penugasan akun secara manual dari Kolektor Asal ke Kolektor Tujuan:
  - **Dukungan Single & Bulk Reassignment**: Supervisor dapat memilih satu atau banyak akun kontrak secara simultan melalui antarmuka visual.
  - **Pilihan Alasan Operasional Baku**: Sistem menyediakan klasifikasi alasan terstandarisasi (`OVERLOAD`, `SICK_LEAVE`, `AREA_ROTATION`, `PERFORMANCE_ESCALATION`, `OTHER`) beserta kolom catatan instruksi khusus.
  - **Sinkronisasi Otomatis ke Today's Plan**: Jadwal kunjungan pada kolektor lama otomatis dipindahkan atau diperbarui ke kolektor baru.
  - **Audit Trail Terpadu (`collector_reassignment_logs`)**: Seluruh mutasi penugasan dicatat ke dalam tabel audit terpisah dan log aktivitas `collection_activities` lengkap dengan stempel waktu dan identitas supervisor pemroses.

### 5.7. Fitur Takeout Task Assignment Otomatis (Review Point 7.0)
- **Real-Time Payment Clearance**: Begitu core banking atau payment gateway menerima setoran debitur (via Virtual Account, transfer BI-FAST, atau teller), sistem CRMS secara instan mengubah status akun menjadi `PAID` dan menghapusnya dari antrean penagihan harian (*takeout task*).
- Menghilangkan risiko debitur yang sudah membayar tetap ditagih oleh bot atau kolektor lapangan.

### 5.8. Perhitungan Insentif Kolektor Terintegrasi (CMS Flow Rate Engine - Review Point 8.0)
Sistem CRMS mengintegrasikan modul perhitungan insentif berbasis *Collection Management System* (CMS) yang menggabungkan variabel **Bucket Flow Rate** (tingkat kegagalan menagih sehingga akun bergeser ke tingkat tunggakan yang lebih parah) sebagai faktor pengali bonus atau pengurang penalti:
- **1. Variabel Penilaian Utama**:
  - *Insentif Dasar (Base Incentive)*: Standar acuan awal (default Rp 3.000.000, dapat dikonfigurasi).
  - *Target KPI Utama*: Persentase jumlah uang berhasil ditagih (*Collection Rate %*) atau jumlah akun tertangani (*Rollback Rate %*).
    $$\text{Insentif Berjalan} = \text{Pencapaian KPI Utama (\%)} \times \text{Insentif Dasar}$$
- **2. Matriks Aturan Bucket Flow Rate Modifier** (Target Toleransi Maksimal Manajemen: **15%**):
  | Realisasi Flow Rate | Status Kinerja | Faktor Pengali / Pengurang (Modifier) | Dampak terhadap Insentif |
  | :---: | :---: | :---: | :---: |
  | **< 10%** | **Sangat Bagus** | **Pengali: 1.2** | **Bonus**: Insentif naik 20% |
  | **10% – 15%** | **Memenuhi Target** | **Pengali: 1.0** | **Utuh**: Insentif diterima 100% |
  | **15.1% – 20%** | **Buruk** | **Pengurang: 0.8** | **Penalti**: Insentif dipotong 20% |
  | **> 20%** | **Sangat Buruk** | **Pengurang: 0.5** | **Penalti Berat**: Insentif dipotong 50% |
- **3. Rumus Insentif Akhir**:
  $$\text{Insentif Akhir} = \text{Insentif Berjalan} \times \text{Bucket Flow Rate Modifier}$$
- **4. Pembuktian Skenario Simulasi (Andi Pratama - Portofolio Bucket 1)**:
  - Insentif Dasar: Rp 3.000.000 | Pencapaian KPI Utama Penagihan: 90%
  - Insentif Berjalan: $90\% \times \text{Rp } 3.000.000 = \text{Rp } 2.700.000$
  - **Skenario A (Flow Rate Bagus = 8%)**: Modifier 1.2 $\rightarrow$ $\text{Rp } 2.700.000 \times 1.2 = \mathbf{\text{Rp } 3.240.000}$ *(Bonus Tambahan Rp 540.000 karena berhasil menahan arus kemacetan kredit)*.
  - **Skenario B (Flow Rate Buruk = 18%)**: Modifier 0.8 $\rightarrow$ $\text{Rp } 2.700.000 \times 0.8 = \mathbf{\text{Rp } 2.160.000}$ *(Insentif dipotong Rp 540.000 karena membiarkan kemacetan baru membengkak)*.
- **5. Fitur Interaktif pada Antarmuka**:
  - *Interactive Slider Simulator*: Uji cepat kombinasi nilai insentif dasar, KPI penagihan %, dan flow rate % dengan visualisasi rumus instan.
  - *Tabel Rekapitulasi Portofolio Kolektor*: Rekap bulanan seluruh kolektor (Andi, Budi, Rian, Doni, Dimas) secara real-time.
  - *Cetak Slip Insentif Digital*: Penerbitan lembar rincian slip insentif resmi per kolektor.

### 5.9. Penanganan Khusus Portofolio Payroll ASN/PNS Pemprov DKI
- Sistem menyediakan logika kalender fleksibel yang mengakomodasi jadwal pembayaran gaji pokok dan tunjangan kinerja (tukin) Pemprov DKI.
- Keterlambatan akibat pergeseran rapel tukin ditandai secara khusus dalam Decision Engine sehingga tidak diperlakukan sebagai kredit macet kronis, melainkan diberikan jadwal pengingat persuasif bertahap.

### 5.10. Tata Kelola Surat Peringatan: Surat Pemberitahuan & Jeda 14 Hari
- Sistem mengotomatisasi siklus penerbitan surat:
  1. *Surat Pemberitahuan Awal*: Dikirimkan secara digital mendahului SP 1.
  2. *Surat Peringatan I (SP 1)*: Diterbitkan pada DPD yang ditentukan kebijakan kredit.
  3. *Jeda 14 Hari Kalender Terkunci*: Sistem secara otomatis mengunci penerbitan SP 2 hingga jeda 14 hari kalender terpenuhi, mematuhi prinsip kehati-hatian dan kepatuhan hukum perbankan.
  4. *Surat Peringatan II (SP 2) & Somasi Terakhir (SP 3)*: Dilengkapi nomor registrasi surat resmi dan tanda tangan digital.

---

## 6. Arsitektur Bisnis & Aturan Segmentasi Overdue Bucket

### 6.1. Klasifikasi 10 Bucket Overdue (Days Past Due / DPD)
```
[--- PRE-DELINQUENCY & DECISION ENGINE (DPD <= 30) ---] | [--- FASE LANJUT / CORE BANKING SYSTEM RULE (>30 DPD) ---]
+--------+-------+-------+--------+---------+---------+---------+----------+-----------+--------+
| -3 - 0 |  1-3  |  4-7  |  8-13  |  14-18  |  19-25  |  26-30  |  31-60   |  61-150   |  >150  |
+--------+-------+-------+--------+---------+---------+---------+----------+-----------+--------+
```

### 6.2. Logika Pembagian Wewenang: Pre-Delinquency, Decision Engine vs Core Banking
1. **DPD -3 s/d 0 (Pre-Delinquency Management / PDM Phase)**:
   - Pengawasan preventif sebelum jatuh tempo (H-3 s.d H-0) berbasis deteksi saldo autodebet CASA tabungan dan kalender payroll/Tukin ASN Pemprov DKI.
   - Menggunakan saluran digital non-intrusif (Gentle WhatsApp Auto-Reminder) untuk debitur risiko rendah/sedang, dan Smart Robo Call / Desk Alert untuk risiko tinggi.
2. **DPD 1–30 (Decision Engine Phase)**:
   - Dikelola oleh Decision Engine cerdas berbasis skor risiko (*behavioral scoring 0-1000 poin*).
   - Membagi akun ke dalam strategi **Champion** (proses konvensional baseline 80%) dan **Challenger** (otomasi adaptif berbasis risiko 20%).
3. **DPD > 30 (Core Banking & Remedial Phase)**:
   - Dikelola oleh aturan ketat perbankan, berfokus pada pengamanan fisik agunan, somasi berjenjang (SP 1–3), penugasan Senior Field Collector, dan pemulihan aset macet / lelang KPKNL (*Remedial & Special Asset Management*).

### 6.3. Matriks Action Path & Penugasan PIC Resmi (10 Bucket x Grade 1–8 & VIP)
Matriks di bawah ini merupakan tabel pemetaan resmi penugasan PIC (Person in Charge) berdasarkan kombinasi **Grade (1 s.d 8 & VIP)** pada sumbu vertikal dan **Bucket DPD (-3 s.d >150)** pada sumbu horizontal:

| Grade | DPD -3-0 | DPD 1-3 | DPD 4-7 | DPD 8-13 | DPD 14-18 | DPD 19-25 | DPD 26-30 | DPD 31-60 | DPD 61-150 | DPD > 150 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | WA | Robot | DC | DC | DC | DC | DC | FC | Senior Field | Remedial |
| **2** | WA | Robot | DC | DC | DC | DC | DC | FC | Senior Field | Remedial |
| **3** | WA | WA | Robot | Robot | DC | DC | DC | FC | Senior Field | Remedial |
| **4** | WA | WA | Robot | DC | DC | DC | DC | FC | Senior Field | Remedial |
| **5** | Robot | DC | DC | FC | FC | FC | FC | Senior Field | Senior Field | Remedial |
| **6** | Robot | DC | FC | FC | FC | FC | FC | Senior Field | Senior Field | Remedial |
| **7** | DC | FC | FC | FC | FC | SFC | SFC | Senior Field | Senior Field | Remedial |
| **8** | DC | FC | FC | SFC | SFC | SFC | SFC | Senior Field | Senior Field | Remedial |
| **VIP** | **Special Team** | **Special Team** | **Special Team** | **Special Team** | **Special Team** | **Special Team** | **Special Team** | **Special Team** | **Special Team** | **Special Team** |

*Keterangan Singkatan PIC*:
* **WA**: WhatsApp Business API / AutoBot Blaster (Pesan interaktif pengingat pembayaran & link pembayaran instan).
* **Robot**: Smart IVR Interactive Robo-Call (Panggilan suara robotik otomatis dengan deteksi nada DTMF konfirmasi janji bayar).
* **DC**: Desk Collector / Phone Banking Telephony (Petugas penagih via telepon kantor dengan skrip dialog terpandu).
* **FC**: Field Collector (Petugas penagihan lapangan cabang dengan aplikasi mobile mCollect).
* **SFC**: Senior Field Collector (Kolektor lapangan senior untuk mediasi restrukturisasi dan penanganan kasus resisten).
* **Senior Field**: Senior Field Collector khusus penanganan DPD 31–150 (pengecekan legalitas fisik agunan dan mitigasi sengketa).
* **Remedial**: Divisi Remedial & Recovery Khusus NPL (Penanganan hukum litigasi, repossession aset, dan lelang KPKNL DPD > 150).
* **Special Team**: Tim Khusus Eksekutif / AR Head (Penanganan personal eksklusif nasabah VIP / komersial bernilai tinggi).

### 6.4. Jawaban Komprehensif: Bagaimana Scoring Collection Menentukan Grade (1–8 & VIP)

Sering timbul dua pertanyaan mendasar dari manajemen risiko, operasional perbankan, dan auditor:
> **Pertanyaan 1**: *"Apakah penentuan Grade (1 s.d 8 & VIP) menggunakan Scoring Collection?"*  
> **Pertanyaan 2**: *"Jika ya, bagaimana caranya karena di dalam formulir/tabel Scoring Collection tidak ditemukan label atau kolom Grade?"*

Berikut adalah penjelasan arsitektur logis dan alur penentuan Grade secara komprehensif:

#### 1. Jawaban Langsung
* **Jawaban Pertanyaan 1**: **YA, MUTLAK**. Penentuan Grade 1 hingga 8 dan segmen VIP sepenuhnya didasarkan pada hasil evaluasi **Collection Scoring (0–1000 Poin)**.
* **Jawaban Pertanyaan 2**: Label "Grade" tidak ditemukan langsung di dalam kartu scoring karena **Scoring Model dan Matriks Grade adalah dua lapisan arsitektur terpisah (Two-Stage Architecture)**:
  - **Lapisan 1 (Scoring Model)**: Bertindak sebagai **Evaluator Tingkat Risiko (Input Layer)** yang menghasilkan nilai kontinu $0 \le 	ext{Score} \le 1000$.
  - **Lapisan 2 (Action Path Matrix)**: Bertindak sebagai **Katalog Strategi Operasional (Execution Layer)** yang mendefinisikan kanal dan PIC penagihan untuk setiap kombinasi strategi dan bucket keterlambatan.
  - **Jembatan Penghubung (*The Bridge*)**: Decision Engine CRMS bertindak sebagai jembatan yang menghubungkan kedua lapisan tersebut melalui **3 Tahap Eksekusi**.

#### 2. Pipeline 3 Langkah Konversi Skor ke Grade & PIC
```mermaid
flowchart TD
    subgraph S1["LANGKAH 1: PERHITUNGAN MULTI-FAKTOR SCORING"]
        direction TB
        RAW["Data Nasabah & Fasilitas Pinjaman"] --> CALC["Kalkulasi Bobot Tertimbang (0 - 1000 Poin)"]
        W1["1. Riwayat Pembayaran (Payment History): 35%"]
        W2["2. Hari Keterlambatan Berjalan (Current DPD): 25%"]
        W3["3. Rasio Beban Utang (DSR / Angsuran vs Gaji): 20%"]
        W4["4. Karakteristik Fasilitas & Agunan: 10%"]
        W5["5. Stabilitas Pekerjaan ASN/PNS DKI: 10%"]
        CALC --- W1 & W2 & W3 & W4 & W5
    end

    subgraph S2["LANGKAH 2: KLASIFIKASI RISK LEVEL & PEMBAGIAN TRAFFIC"]
        direction TB
        SCORE_RES{"Total Skor (0 - 1000)"}
        CALC --> SCORE_RES
        
        SCORE_RES -->|Flag is_vip = True| VIP_BOX["VIP PORTFOLIO<br>-> GRADE VIP"]
        SCORE_RES -->|Skor >= 700| LOW_BOX["LOW RISK<br>(Nasabah Disiplin / Keterlambatan Temporer)"]
        SCORE_RES -->|Skor 450 - 699| MED_BOX["MEDIUM RISK<br>(Arus Kas Fluktuatif / Butuh Edukasi)"]
        SCORE_RES -->|Skor < 450| HIGH_BOX["HIGH RISK<br>(Riwayat Ingkar Janji / Rawan Macet)"]
        
        SPLIT{"Traffic Router<br>(Champion vs Challenger)"}
        LOW_BOX & MED_BOX & HIGH_BOX --> SPLIT
        
        SPLIT -->|80% Traffic Baseline| CHAMP_AP["CHAMPION GROUP<br>• Varian A -> GRADE 1<br>• Varian B -> GRADE 2"]
        SPLIT -->|20% Traffic Adaptif| CHAL_AP["CHALLENGER GROUP<br>• Low Risk -> GRADE 3 (A) / GRADE 4 (B)<br>• Medium Risk -> GRADE 5 (A) / GRADE 6 (B)<br>• High Risk -> GRADE 7 (A) / GRADE 8 (B)"]
    end

    subgraph S3["LANGKAH 3: INTERSEKSI GRADE X BUCKET DPD -> PIC"]
        direction TB
        GRADE_BOX["Grade Terpilih (1 s.d 8 atau VIP)"]
        DPD_BOX["Bucket DPD Berjalan (-3-0 s.d >150)"]
        CHAMP_AP & CHAL_AP & VIP_BOX --> GRADE_BOX
        
        INTERSECT{"Lookup Matriks Action Path"}
        GRADE_BOX & DPD_BOX --> INTERSECT
        
        INTERSECT --> ASSIGN["Penugasan Petugas Resmi (PIC):<br>WA Bot | Smart Robot | Desk Collector (DC)<br>Field Collector (FC) | Senior Field Collector (SFC)<br>Senior Field | Remedial | Special Team"]
    end

    S1 ==> S2
    S2 ==> S3
```

* **Langkah 1: Perhitungan Skor Multi-Faktor (Continuous Score 0–1000)**:
  Sistem menghitung skor debitur berdasarkan 5 parameter utama:
  $$	ext{Score} = \sum_{i=1}^{5} (w_i 	imes S_i)$$
  Hasilnya adalah angka kontinu antara 0 hingga 1000.
* **Langkah 2: Klasifikasi Risk Level & Alokasi Traffic (Mapping to Grade 1–8 & VIP)**:
  1. *Nasabah VIP (`is_vip = true`)*: Tanpa melihat skor, langsung dialokasikan ke **Grade VIP** (Special Team / AR Head).
  2. *Champion Traffic (80% portofolio)*: Dialokasikan ke **Grade 1** (varian A) atau **Grade 2** (varian B) sebagai baseline performa konvensional bank.
  3. *Challenger Traffic (20% portofolio)*:
     - Skor $\ge 700$ (`LOW_RISK`) $ightarrow$ Dialokasikan ke **Grade 3** atau **Grade 4** (Strategi *Digital-First*).
     - Skor $450 - 699$ (`MEDIUM_RISK`) $ightarrow$ Dialokasikan ke **Grade 5** atau **Grade 6** (Strategi *Hybrid Desk & Field*).
     - Skor $< 450$ (`HIGH_RISK`) $ightarrow$ Dialokasikan ke **Grade 7** atau **Grade 8** (Strategi *Intensive Field*).
* **Langkah 3: Interseksi Matriks Dua Dimensi (Grade x Bucket DPD $ightarrow$ PIC)**:
  Setelah Grade debitur ditetapkan (sumbu vertikal), sistem mencocokkannya dengan Bucket keterlambatan debitur saat ini (sumbu horizontal). Titik temu kedua sumbu ini secara otomatis menentukan siapa PIC yang ditugaskan dan kanal apa yang digunakan.

#### 3. Logika Penetapan Pasangan Grade Ganjil vs Genap (Sub-Variant A/B Testing)
Mengapa setiap tingkatan risiko memiliki dua Grade berdampingan (Grade 1 vs 2, Grade 3 vs 4, Grade 5 vs 6, Grade 7 vs 8)?  
Ini adalah rancangan kecerdasan sistem untuk melakukan **eksperimentasi A/B testing sub-varian** guna menemukan titik waktu eskalasi paling efisien dan efektif:
* **Grade 1 & 2 (Champion Baseline)**: Standar operasional konvensional bank. Menggunakan Robot pada DPD 1–3, kemudian dilanjutkan oleh Desk Collector (DC) hingga DPD 30, baru diterjunkan Field Collector pada DPD 31+.
* **Grade 3 vs 4 (Challenger Low Risk - Digital-First)**:
  - *Grade 3 (Extended Digital)*: Memberikan ruang digital lebih luas. Menggunakan WhatsApp pada DPD -3 s.d 3, Robot pada DPD 4–13, dan baru masuk Desk Collector pada DPD 14.
  - *Grade 4 (Early DC Intervention)*: Menggunakan WhatsApp pada DPD -3 s.d 3, Robot pada DPD 4–7, namun mempercepat kontak Desk Collector sejak DPD 8.
* **Grade 5 vs 6 (Challenger Medium Risk - Hybrid Desk + Field)**:
  - *Grade 5 (Standard Hybrid)*: Menggunakan Desk Collector pada DPD 1–7, dan mulai menerjunkan Field Collector (FC) ke lapangan pada DPD 8.
  - *Grade 6 (Aggressive Field)*: Mempercepat kunjungan lapangan Field Collector (FC) sejak DPD 4 apabila kontak telepon DC pada DPD 1–3 tidak direspons.
* **Grade 7 vs 8 (Challenger High Risk - Intensive Field Direct)**:
  - *Grade 7 (Standard Intensive)*: Menerjunkan Field Collector (FC) sejak hari pertama keterlambatan (DPD 1–18), dan dieskalasikan ke Senior Field Collector (SFC) pada DPD 19–30.
  - *Grade 8 (Rapid Senior Escalation)*: Menerjunkan Field Collector (FC) pada DPD 1–7, dan langsung dieskalasikan ke Senior Field Collector (SFC) lebih dini pada DPD 8–30 untuk audit fisik agunan dan mitigasi sengketa.
* **Grade VIP (Special Handling)**: Nasabah simpanan besar atau komersial prioritas tidak pernah dialihkan ke bot massal atau debt collector eksternal, melainkan ditangani langsung oleh AR Head / Tim Khusus di semua bucket (-3-0 hingga > 150).

---

## 7. Strategi Risiko & Mekanisme Penanganan (Risk-Based Handling)

```
                   +-----------------------------+
                   |       DECISION ENGINE       |
                   |      (Account Ingestion)    |
                   +--------------+--------------+
                                  |
         +------------------------+------------------------+
         |                                                 |
[ Nasabah Reguler ]                                [ Nasabah VIP Flag ]
         |                                                 |
         v                                                 v
+------------------+                              +------------------+
| Evaluasi Risk DE |                              |     AR HEAD      |
+--------+---------+                              | Dedicated Bucket |
         |                                        +------------------+
   +-----+-----------------------+
   |                             |
   v                             v
[ Champion Path (1-2) ]    [ Challenger Path (3-8) ]
   - Baseline Core Banking    - Low Risk    --> AP 3, 4 (WA / ROBO / DC)
                              - Medium Risk --> AP 5, 6 (ROBO / DC / FC)
                              - High Risk   --> AP 7, 8 (FC / SFC Direct)
```

### 7.1. Low Risk (Digital & Non-Field First)
- **Skor Risiko $\ge 750$** (Debitur berdisiplin baik).
- Ditangani 100% via saluran digital non-lapangan (WhatsApp Bot & Smart Robo Call), menghemat 100% anggaran kunjungan fisik pada DPD 1–30.

### 7.2. Medium Risk (Hybrid: Digital, Desk & Field)
- **Skor Risiko $550 - 749$** (Arus kas fluktuatif namun kooperatif).
- Dimulai dengan kontak telepon desk collector; jika janji bayar (PTP) wanprestasi, segera dieskalasikan ke kunjungan lapangan kantor cabang.

### 7.3. High Risk (Direct Field & Collateral Securitization)
- **Skor Risiko $< 550$** (Histori gagal autodebet berulang, indikasi pengalihan agunan).
- Langsung ditugaskan kepada Field Collector sejak hari pertama (DPD 1) dan eskalasi dini ke Senior Field pada DPD 14 untuk verifikasi fisik agunan.

### 7.4. Segmen Khusus: Nasabah VIP / Priority Banking
- Nasabah Prioritas Bank DKI / Bank Jakarta dialokasikan secara eksklusif ke Portal AR Head.
- Auto-blast bot diblokir secara otomatis guna melindungi hubungan perbankan bernilai tinggi.

---

## 8. Unified Customer 360° & Skrip Percakapan Terpandu Kolektor

### 8.1. Agregasi Total Eksposur Lintas Fasilitas Pinjaman (Cross-Facility Liability)
Mengonsolidasikan seluruh pinjaman debitur di bawah satu nomor identitas (CIF):
- **Total Plafon Pembiayaan Aktif**
- **Total Angsuran Bulanan Berjalan**
- **Total Tunggakan Gabungan & Denda**
- **Status Jaminan Agunan (SHM, SHGB, BPKB, Deposito Penjamin)**.

**Contoh Portofolio Multi-Fasilitas Nyata di Sistem:**
1. **Budi Santoso (PNS Bappeda Pemprov DKI) — `CIF-010007` (Customer ID: 7)**:
   - **Fasilitas 1**: KPR Griya Utama Primary (`BANK-KPR-2024-100822`), Plafon Rp 850.000.000, Angsuran Rp 7.800.000/bln, Status: **Overdue DPD 2** (Tunggakan Rp 7.800.000), Agunan: SHM No. 4182/Kebayoran.
   - **Fasilitas 2**: KTA Payroll ASN Pemprov DKI (`BANK-KTA-2024-800822`), Plafon Rp 75.000.000, Angsuran Rp 2.850.000/bln, Status: **Lancar (Kol-1 / DPD 0)**, Agunan: Potong Gaji Payroll ASN.
   - **Total Eksposur 360° Gabungan**: Plafon Rp 925.000.000, Total Kewajiban Overdue Rp 7.800.000, Max DPD: 2 Hari (LOW RISK), Banner Kalender Payroll ASN Pemprov DKI Aktif.

2. **Ir. Kusuma Hartono (Private Banking VIP) — `CIF-010054` (Customer ID: 54)**:
   - **Fasilitas 1**: KMK Konstruksi & Dagang (`BANK-KMK-2024-107261`), Plafon Rp 1.500.000.000, Angsuran Rp 14.500.000/bln, Status: **Overdue DPD 15** (Tunggakan Rp 14.500.000), Agunan: SHGB No. 581/Ruko Roxy Niaga.
   - **Fasilitas 2**: Kartu Kredit World Platinum (`BANK-CC-2025-107262`), Limit Rp 100.000.000, Angsuran Rp 4.500.000/bln, Status: **Overdue DPD 9** (Tunggakan Rp 4.500.000), Agunan: Limit Revolving Credit.
   - **Total Eksposur 360° Gabungan**: Plafon Rp 1.600.000.000, Total Tunggakan Gabungan Rp 19.000.000, Max DPD: 15 Hari (VIP Handling via AR Head).

### 8.2. Linimasa Interaksi Omnichannel Interaktif (Chronological Timeline)
Menyajikan rekam jejak lengkap:
- Riwayat pengiriman notifikasi WhatsApp dan interaksi bot.
- Rekaman konfirmasi janji bayar dari Robo Call.
- Berita acara kunjungan petugas lapangan lengkap dengan stempel waktu dan koordinat GPS.
- Catatan mutasi pelunasan dari core banking.

### 8.3. Skrip Percakapan Terpandu Kolektor (Script-Driven Dynamic Dialogue)
Menghasilkan skrip percakapan terstandarisasi sesuai profil risiko:
- Salam pembuka sopan perbankan.
- Perincian tagihan pokok, bunga, denda, dan nomor Virtual Account.
- Taktik negosiasi terarah (kemudahan pembayaran instan vs peringatan penurunan skor SLIK OJK).
- Tombol **"Salin Skrip untuk WhatsApp"** memudahkan petugas mengirimkan pesan resmi dalam hitungan detik.

---

## 9. Alur Kerja Siklus Pemulihan Lanjutan (Advanced Collections Lifecycle)

```
[ STAGE_COLLECTION ] ──► Penagihan Persuasif (WA, Robo, Desk, Field)
         │ (Debitur hilang kontak / alamat tidak valid)
         ▼
[ STAGE_SKIP_TRACING ] ──► Pelacakan Kontak, Kantor, & Penjamin
         │ (Kontak ditemukan, memiliki itikad baik tapi kendala likuiditas)
         ▼
[ STAGE_RESTRUCTURING ] ──► Relaksasi POJK (Rescheduling, Reconditioning) ──► [ STAGE_CLOSED ]
         │ (Debitur menolak restrukturisasi / wanprestasi berkelanjutan)
         ▼
[ STAGE_LEGAL_NOTICE ] ──► Surat Pemberitahuan, SP 1, Jeda 14 Hari, SP 2, Somasi SP 3
         │ (Somasi diabaikan)
         ▼
[ STAGE_LITIGATION_AUCTION ] ──► Gugatan Pengadilan & Lelang Agunan KPKNL
         │ (Negosiasi pelunasan damai / haircut denda)
         ▼
[ STAGE_SETTLEMENT ] ──► Pelunasan Diskon Khusus ──► [ STAGE_CLOSED ] (Roya Sertifikat)
```

---

## 10. Struktur Organisasi & Ekosistem Kanal Operasional

```mermaid
graph TD
    subgraph HO["KANTOR PUSAT (Digital Automation & Centralized Desk)"]
        WA["WA: WhatsApp Business API Bot"]
        ROBO["ROBO: Smart IVR Robo Call"]
        DC["DC: Centralized Desk Collector"]
    end

    subgraph BR["KANTOR CABANG (Field Operational)"]
        ARH["AR Head (Supervisor & VIP Dedicated)"]
        FC["FC: Field Collector (Kunjungan DPD 8-30)"]
        SFC["SFC: Senior Field Collector (Eskalasi DPD >30)"]
    end

    subgraph REM["REMEDIAL & SPECIAL ASSET MANAGEMENT"]
        LIT["Spesialis Litigasi & Hukum"]
        AUC["Petugas Lelang Agunan (KPKNL)"]
        SET["Spesialis Restrukturisasi & Settlement"]
        AGN["Agency Management (Mitra Eksternal)"]
    end

    WA --> DC
    ROBO --> DC
    DC --> FC
    FC --> SFC
    SFC --> LIT
    LIT --> AUC
    AUC --> SET
    SET --> AGN
    ARH -.->|Instruksi VIP Khusus| FC
    ARH -.->|Supervisi Kasus Berat| SFC
```

---

## 11. Desain Arsitektur Sistem, Komponen & Aliran Data (Enterprise System Architecture)

Sistem **Collection & Recovery Management System (CRMS)** dibangun dengan standar arsitektur perbankan berskala enterprise (*Tier-1 Enterprise Banking Architecture*). Arsitektur dirancang dengan prinsip *high cohesion, low coupling, high resilience*, dan *strict regulatory compliance* (POJK & UU Perlindungan Data Pribadi No. 27/2022). Sistem ini bertindak sebagai *intelligent surrounding system* yang menghubungkan *Core Banking System (CBS)*, infrastruktur pembayaran nasional (BI-FAST & Virtual Account Bank), dan saluran omnichannel digital.

---

### 11.1. Diagram Ekosistem Perbankan CRMS Level-0 (Platform Overview & Lending Lifecycle Pillars)

Diagram Level-0 di bawah ini menggambarkan posisi strategis **Collection & Recovery Management System (CRMS)** di dalam arsitektur platform digital lending perbankan end-to-end. Sistem terintegrasi dengan seluruh siklus fasilitas kredit—mulai dari akuisisi nasabah, tata kelola pinjaman, pemulihan piutang, hingga manajemen agunan dan dokumen hukum:

```mermaid
flowchart TB
    subgraph OVERVIEW["CRMS ENTERPRISE BANKING PLATFORM OVERVIEW — LEVEL-0 ECOSYSTEM"]
        direction TB
        
        subgraph TOP_BAR["PORTFOLIO SEGMENTATION & OPEN API INTEGRATION HUB"]
            direction LR
            SEG1["🏦 Retail Lending<br/>(KPR, KTA, CC, KUR)"]
            SEG2["🏢 Commercial & Corporate<br/>(KMK, KI, Sindikasi)"]
            SEG3["🏛️ Payroll ASN / PNS<br/>(Pemprov DKI & BUMD)"]
            SEG4["🚗 Leasing & Multifinance<br/>(Kendaraan & Alat Berat)"]
            API_HUB["🔌 80+ Enterprise Plug & Play APIs<br/>(RESTful / ISO-8583 / BI-FAST / Webhooks)"]
        end

        subgraph LIFECYCLE_PILLARS["6 PILAR UTAMA SIKLUS HIDUP PINJAMAN (LENDING LIFECYCLE PILLARS)"]
            direction LR
            
            CAS["1. CUSTOMER ACQUISITION<br/>(CAS / LOS)<br/>───────────────<br/>• Party & CIF Master<br/>• Dukcapil Identity Verification<br/>• SLIK OJK & Credit Scoring<br/>• Limit Setup & Disbursal Approval"]
            
            LMS["2. LOAN MANAGEMENT<br/>(LMS / Core Banking)<br/>───────────────<br/>• Servicing Post-Origination<br/>• Schedule & Billing Accrual<br/>• CASA Autodebet Engine<br/>• Payoff & Termination Ledger"]
            
            CRMS["3. LOAN COLLECTIONS & RECOVERY<br/>★ CRMS CORE FOCUS ★<br/>───────────────<br/>• Pre-Delinquency DPD 0 (PDM)<br/>• Scoring Engine (0-1000 Poin)<br/>• Overdue Matrix (Action Path 1-8)<br/>• 6-Stage Settlement & Tranches<br/>• mCollect PWA & GeoTracker GPS<br/>• Legal Litigation & KPKNL Auction"]
            
            ECM["4. ENTERPRISE CONTENT<br/>(ECM / DMS)<br/>───────────────<br/>• Digital PK & Notarial Deeds<br/>• APHT & SKMHT Binding<br/>• Surat Peringatan (SP 1-3)<br/>• Court Filings & Risalah Lelang"]
            
            CMS["5. COLLATERAL MANAGEMENT<br/>(CMS)<br/>───────────────<br/>• Asset Register (SHM/BPKB)<br/>• KJPP Valuation (FMV & Liquidation)<br/>• Custody Vault Management<br/>• Stockyard & Repo Tracking"]
            
            DFE["6. DIGITAL FRONT END<br/>(Omnichannel Touchpoints)<br/>───────────────<br/>• Web Operations Portal<br/>• mCollect Field PWA<br/>• WhatsApp Cloud Gateway<br/>• Smart IVR Robo-Call Dialer<br/>• Self-Service Payment Link (VA/QRIS)"]
        end

        TOP_BAR ==> LIFECYCLE_PILLARS
        CAS -->|Disbursed Loan Contracts| LMS
        LMS -->|Delinquent & Pre-Delinquent Accounts| CRMS
        CRMS -->|Archived Notices & Legal Proofs| ECM
        CRMS <-->|Collateral Status & Valuation| CMS
        CRMS <-->|Staff & Customer Interaction| DFE
        CRMS -.->|Takeout Task & Clearance Webhook| LMS
    end
```

#### Rincian 6 Pilar Siklus Hidup Pinjaman (Lending Lifecycle Pillars):

1. **Customer Acquisition (CAS / LOS - Customer Acquisition System)**:
   - Mengelola tata kelola pihak pemohon (*party management*), pendaftaran nomor CIF terpusat, dan verifikasi biometrik/NIK KTP melalui integrasi Ditjen Dukcapil Kemendagri.
   - Melakukan evaluasi kelayakan kredit awal melalui integrasi riwayat SLIK OJK, analisis rasio kemampuan mencicil (*Debt Service Ratio* / DSR), penentuan skor persetujuan (*application underwriting score*), penetapan pagu limit fasilitas kredit (*limit setup and maintenance*), hingga pengesahan pencairan dana (*funding approval*).
2. **Loan Management System (LMS / Core Banking System)**:
   - Mengelola siklus fasilitas pinjaman pasca-pencairan (*post-origination*) hingga kredit lunas tuntas (*termination*).
   - Menghasilkan jadwal angsuran (*repayment billing schedule*), perhitungan akrual bunga harian, administrasi biaya provisi dan denda keterlambatan, penarikan saldo rekening tabungan secara otomatis (*CASA autodebet*), serta rekonsiliasi mutasi rekening koran pinjaman.
3. **Loan Collections & Recovery (CRMS - Fokus Utama Platform)**:
   - Bertindak sebagai motor intelijen utama perbankan dalam memantau dan memulihkan kredit bermasalah di seluruh kontinum risiko.
   - Mencakup pengawasan dini H-3 s.d H-0 (*Pre-Delinquency Management* / PDM DPD 0), pemantauan autodebet tabungan dan kalender rapel Tunjangan Kinerja (Tukin) ASN Pemprov DKI, perhitungan skor risiko perilaku (*Behavioral Risk Scoring 0–1000 Poin*), alokasi penugasan antrean otomatis (Action Path Grade 1–8), pengujian *Champion vs Challenger*, alur kompromi pelunasan berjenjang (*6-Stage Settlement Lifecycle & Multi-Tranches*), aplikasi penagihan lapangan (*mCollect Workbench*), pemantauan GPS telemetri (*GeoTracker Real-Time Monitoring*), somasi hukum (SP 1, SP 2, SP 3), litigasi perdata pengadilan (6 tahapan), dan lelang eksekusi agunan Hak Tanggungan/Fidusia di KPKNL (8 tahapan).
4. **Enterprise Content Management (ECM / Document Management System)**:
   - Mengotomatiskan penyimpanan, pengindeksan, pengarsipan aman, dan penelusuran dokumen legal di seluruh siklus kredit.
   - Mengelola dokumen digital: Akta Perjanjian Kredit (PK) notariil, Akta Pembebanan Hak Tanggungan (APHT), Surat Kuasa Membebankan Hak Tanggungan (SKMHT), Sertifikat Jaminan Fidusia, tanda terima penyerahan agunan, salinan Surat Peringatan (SP 1, SP 2, Somasi), berkas gugatan Pengadilan Negeri, dan Risalah Lelang KPKNL berkekuatan hukum.
5. **Collateral Management System (CMS)**:
   - Mengotomatiskan manajemen agunan secara komprehensif dari awal pengikatan hingga pelepasan hak (*roya*) atau eksekusi sita lelang.
   - Mencakup pendaftaran fisik agunan (Sertifikat Hak Milik / SHM, SHGB, BPKB kendaraan bermotor), pencatatan taksiran Nilai Pasar Wajar (*Fair Market Value*) dan Nilai Likuidasi oleh Kantor Jasa Penilai Publik (KJPP) independen rekanan bank, pemantauan batas rasio *Loan-to-Value* (LTV), tata kelola brankas fisik (*custody vault management*), serta pengawasan barang sitaan jaminan bergerak di *Stockyard* resmi perbankan.
6. **Digital Front End (Omnichannel Touchpoints)**:
   - Saluran portal web terintegrasi dan aplikasi mobile bagi nasabah dan seluruh staf lintas unit operasional perbankan.
   - Menyediakan antarmuka operasional: Operations Portal meja penagihan (*Desk Collector*), portal eksklusif nasabah prioritas (*VIP Desk AR Head*), workbench kolektor lapangan ramah seluler (*mCollect PWA*), gerbang notifikasi otomatis WhatsApp Business API, robot pemanggil pintar (*Smart IVR Robo-Call*), dan fasilitas pembayaran mandiri 24 jam berbasis Virtual Account Bank dan QRIS Dinamis.

---

### 11.2. Diagram Aliran Data ETL Level-1 (Core System Integration & Data Transfer Pipeline)

Diagram Level-1 berikut memetakan arsitektur pemindahan data (*Data Transfer Architecture*) menggunakan *Extract, Transform, Load (ETL)* dari sistem-sistem inti perbankan (*Customer Acquisition, Loan Management, Collateral Management, ECM, Payment Switch*) ke dalam repositori data operasional CRMS:

```mermaid
flowchart TB
    subgraph SOURCES["CORE SOURCE SYSTEMS (SISTEM SUMBER DATA PERBANKAN)"]
        direction LR
        SRC_CAS["1. Customer Acquisition (CAS/LOS)<br/>• CIF Master, NIK KTP, Profil Nasabah<br/>• Instansi ASN / Payroll Employer<br/>• Kontak Telepon & Emergency Contact<br/>• SLIK Score & Approved Limit"]
        SRC_LMS["2. Loan Management (LMS/CBS)<br/>• No Kontrak, Baki Debet, Tenor<br/>• DPD, Tunggakan Pokok/Bunga/Denda<br/>• CASA Autodebet & Tukin Calendar<br/>• Historical Repayment Ledger"]
        SRC_CMS["3. Collateral Management (CMS)<br/>• Agunan SHM/SHGB/BPKB, LTV<br/>• Penilaian KJPP (Pasar & Likuidasi)<br/>• Akta APHT & Fidusia Notariil<br/>• Lokasi Fisik Agunan & Vault"]
        SRC_ECM["4. Content Management (ECM)<br/>• Berkas Digital Perjanjian Kredit<br/>• Sertifikat Agunan & Surat Kuasa<br/>• Arsip Somasi & Berkas Hukum"]
        SRC_PAY["5. Payment Switch (BI-FAST/VA)<br/>• Real-Time Payment Transaction Stream<br/>• Setoran M-Banking / QRIS Dinamis<br/>• Webhook Event Settlement"]
    end

    subgraph ETL_PIPELINE["INTEGRATION & ETL PIPELINE LAYER (CRMS DATA INTEGRATOR)"]
        direction TB
        
        subgraph INGESTION["1. EXTRACTION & INGESTION STAGE"]
            EXT_BATCH["Nightly EOD Batch Extractor<br/>(Cron 02:00 WIB / SFTP & REST mTLS)"]
            EXT_CDC["Real-Time Event Listener / Webhook<br/>(Payment Stream & CASA Balance)"]
        end

        subgraph CLEANSING["2. STAGING & DATA CLEANSING"]
            CLEAN_VAL["Schema Validation & Type Normalization"]
            CLEAN_MASK["UU PDP Masking Guard (PII Protection)"]
            CLEAN_DEDUP["Deduplication & Anomaly Cleansing"]
        end

        subgraph ENRICHMENT["3. TRANSFORMATION & ENRICHMENT ENGINES"]
            ENR_360["Customer 360 Aggregator<br/>(Cross-Facility Liability Consolidation)"]
            ENR_STAMP["Case Stamping Engine<br/>(Combo 1: KPR+KPA, Combo 2: KTA+CC)"]
            ENR_PDM["Pre-Delinquency Evaluator<br/>(CASA Balance Sufficiency & ASN Payroll Watcher)"]
            ENR_SCORE["Behavioral Scoring Engine<br/>(Calculates Risk Score: 0 - 1000 Poin)"]
            ENR_PATH["Action Path Classifier<br/>(AP Grade 1 - 8 & Champion vs Challenger)"]
        end

        subgraph LOADING["4. PERSISTENCE LOADING (crms_db)"]
            LOAD_UPSERT["Transactional Batch Upsert Engine<br/>• public.customers<br/>• public.agreements<br/>• public.pre_delinquency_accounts<br/>• public.overdue_accounts"]
        end

        INGESTION ==> CLEANSING
        CLEANSING ==> ENRICHMENT
        ENRICHMENT ==> LOADING
    end

    subgraph TARGET_QUEUES["CRMS OPERATIONAL WORK QUEUES & WORKBENCHES"]
        direction LR
        Q_PDM["Queue DPD 0 (PDM)<br/>• Gentle WA Auto-Reminder<br/>• CASA Insufficiency Alert"]
        Q_DIGITAL["Queue DPD 1-14 (Low Risk)<br/>• WhatsApp Bot Blaster<br/>• Smart IVR Robo-Call"]
        Q_DESK["Queue DPD 4-30 (Medium Risk)<br/>• Desk Telephony CRM<br/>• Guided Dialogue Script"]
        Q_FIELD["Queue DPD 14-90 (High Risk)<br/>• mCollect Field Queue<br/>• GeoTracker Real-Time GPS"]
        Q_REMEDIAL["Queue DPD 90+ (Remedial)<br/>• 6-Stage Legal Recourse<br/>• 8-Stage KPKNL Auction<br/>• 6-Stage Settlement Tranches"]
    end

    subgraph REVERSE_SYNC["REAL-TIME REVERSE SYNC & TAKEOUT TASK"]
        direction LR
        REV_PAY["Debitur Bayar via VA / BI-FAST"] --> REV_HOOK["Instant Webhook POST /confins/simulate-payment"]
        REV_HOOK --> REV_CLEAR["Auto Clearance Saldo Tunggakan = Rp 0"]
        REV_CLEAR --> REV_CANCEL["Instant Takeout Task: Cabut Akun dari Antrean Kolektor (<5 Menit)"]
        REV_CANCEL --> REV_RECEIPT["Kirim Bukti Bayar Resmi (PIS) via WhatsApp ke Nasabah"]
    end

    SRC_CAS & SRC_LMS & SRC_CMS & SRC_ECM --> EXT_BATCH
    SRC_PAY --> EXT_CDC
    LOADING ==> TARGET_QUEUES
    TARGET_QUEUES -.->|Interaksi Penagihan & Janji Bayar PTP| ETL_PIPELINE
    SRC_PAY ==> REVERSE_SYNC
    REVERSE_SYNC -.->|Update Status Akun Lunas| LOADING
    REVERSE_SYNC -.->|Notifikasi Pembatalan Kunjungan Lapangan| Q_FIELD
```

#### Rincian Data yang Ditransfer dari Tiap Sistem Sumber:

| Sistem Sumber (*Source*) | Entitas & Variabel Data yang Diekstrak | Protokol & Frekuensi Transfer | Peran & Penggunaan di CRMS |
|:---|:---|:---:|:---|
| **Customer Acquisition (CAS / LOS)** | • Nomor CIF Nasabah<br>• NIK KTP (dimasking)<br>• Nama Lengkap & Alamat Domisili<br>• Instansi Payroll (ASN DKI / SKPD / BUMD)<br>• Nomor Handphone & No WA<br>• Nomor Kontak Darurat (*Emergency*)<br>• Skor SLIK Awal & Catatan Underwriting | Batch EOD (02:00 WIB) via REST mTLS / SFTP JSON | Membentuk profil debitur terpadu (*Customer Master*), penentuan segmentasi ASN DKI, serta penyediaan kanal kontak untuk skrip penagihan terpandu. |
| **Loan Management (LMS / CBS)** | • Nomor Rekening Pinjaman / Kontrak<br>• Plafon Fasilitas & Suku Bunga<br>• Baki Debet Pokok (*Outstanding*)<br>• Rincian Tunggakan Pokok, Bunga, Denda<br>• Hari Keterlambatan (DPD) & Kolektibilitas<br>• Saldo Rekening Autodebet (CASA)<br>• Tanggal Transfer Gaji & Rapel Tukin ASN | Batch EOD Harian (02:00 WIB) & Sinkronisasi Near-Real-Time REST | Input utama perhitungan DPD, pembentukan bucket penagihan (DPD 1–30, DPD 30+), evaluasi Early Warning DPD 0 (PDM), serta penentuan level risiko. |
| **Collateral Management (CMS)** | • Nomor ID Agunan<br>• Tipe Jaminan (SHM, SHGB, BPKB)<br>• Nilai Pasar Wajar (FMV) & Likuidasi KJPP<br>• Rasio Pinjaman terhadap Agunan (LTV)<br>• Nomor Akta APHT / SKMHT / Fidusia<br>• Nama Notaris Rekanan<br>• Lokasi Penyimpanan Brankas / Stockyard | Batch EOD Harian via Database View / REST JSON | Memetakan bobot kualitas agunan (15% dalam skoring risiko), penentuan prioritas lelang KPKNL (DPD 90+), serta pembuatan berkas eksekusi agunan. |
| **Enterprise Content Management (ECM)** | • ID Berkas Digital Dokumen<br>• URL / Endpoint Berkas PK Notariil<br>• Salinan Pindai Sertifikat Agunan<br>• Arsip Riwayat Surat Peringatan (SP 1–3)<br>• Dokumen Gugatan & Risalah Lelang | Terjadwal EOD & On-Demand REST API | Menampilkan lampiran dokumen legal secara instan di Customer 360°, modul litigasi hukum (6 tahapan), dan modul lelang agunan (8 tahapan). |
| **Payment Switch (BI-FAST & VA)** | • ID Transaksi Settlement<br>• Nomor Virtual Account Bank<br>• Nominal Pembayaran<br>• Kanal Bayar (BI-FAST / VA / QRIS / ATM)<br>• Timestamp Transaksi (Presisi Detik) | **Real-Time Event Stream** (Webhook Push Listener) | Menjalankan **Instant Takeout Task**: mengosongkan saldo tunggakan, mencabut akun dari antrean kerja kolektor (< 5 menit), dan mengirim bukti bayar WhatsApp. |

#### Tahapan Pemrosesan Pipeline ETL (ETL Processing Stages):
1. **Tahap 1 - Ingestion & Extraction**: Mengekstrak data inkremental harian (delta records) setiap malam pukul 02:00 WIB dan menangkap event pembayaran real-time 24/7.
2. **Tahap 2 - Staging & Data Cleansing**: Normalisasi tipe data, eliminasi duplikasi akun, serta penerapan perlindungan privasi data sesuai UU PDP No. 27/2022 (masking nomor NIK KTP dan nomor telepon nasabah).
3. **Tahap 3 - Transformation, Case Stamping & Scoring Enrichment**:
   - *Customer 360 Aggregator*: Menyatukan seluruh fasilitas kredit aktif nasabah (KPR, KMK, KTA, Kartu Kredit) dalam satu nomor CIF.
   - *Case Stamping Engine*: Mengelompokkan pinjaman menjadi Combo 1 Properti, Combo 2 Non-Collateral, atau Combo 3 Komersial.
   - *Pre-Delinquency Evaluator*: Mendeteksi defisit saldo autodebet CASA (H-3..H-0) dan tanggal transfer rapel Tukin ASN.
   - *Behavioral Scoring Engine*: Menghitung skor risiko kredit (0–1000 poin) secara objektif.
   - *Action Path Classifier*: Menetapkan kode penanganan (AP 1–8) dan mengalokasikan akun ke grup Champion atau Challenger.
4. **Tahap 4 - Persistence Loading**: Memasukkan data terenkripsi ke tabel basis data PostgreSQL `crms_db`.
5. **Tahap 5 - Queue Dispatching**: Menyajikan antrean kerja siap aksi pada dashboard kolektor meja, bot WhatsApp, smart IVR, dan aplikasi lapangan mCollect.
6. **Tahap 6 - Real-Time Reverse Sync & Takeout**: Menyelesaikan pelunasan seketika saat debitur membayar via kanal digital, memastikan petugas penagihan tidak menghubungi nasabah yang sudah melunasi kewajibannya (*anti-overcollection*).

---

### 11.3. Diagram & Model Arsitektur Enterprise 5-Tier (High-Level 5-Tier Architecture Model)

Arsitektur CRMS dibagi menjadi lima lapisan modular (*5-Tier Architecture*) yang terisolasi secara logis dan fisik:

```mermaid
flowchart TB
    subgraph TIER1["TIER 1: PRESENTATION & TOUCHPOINTS (FRONTEND CLIENTS)"]
        direction LR
        UI_SPA["Web SPA Operations Portal<br/>(React 18 + Vite + Tailwind CSS)<br/>• Overdue Matrix DPD 1-30<br/>• Unified Customer 360°<br/>• VIP Desk (AR Head Portal)<br/>• Pre-Delinquency DPD 0 Dashboard<br/>• Legal (6-Stage) & Repo (8-Stage)"]
        UI_MOB["mCollect Field Workbench (PWA)<br/>• Mobile Field Visit Queue<br/>• Payment Recording & Geotagging<br/>• Digital PIS WhatsApp Slip<br/>• QRIS / VA Link Generator<br/>• Foreclosure Payoff Calculator"]
        UI_GEO["GeoTracker Command Center<br/>• Live Jakarta Vector Map<br/>• Animated Route Playback<br/>• Time Analytics & Velocity<br/>• Idle Outlier Alert (>120m)"]
        UI_SUP["Supervisory & Admin Console<br/>• Agency Onboarding & SLA<br/>• Balanced Round-Robin Queue<br/>• Out of Office (OOO) Delegation<br/>• Easy Rule & Scoring Config"]
    end

    subgraph TIER2["TIER 2: API GATEWAY & SECURITY ROUTING LAYER"]
        direction TB
        NGINX["Nginx Reverse Proxy & SSL Offloader<br/>(External HTTPS Port 3030 / WSS WebSocket / TLS 1.3)"]
        GW_SEC["Security Middleware & Traffic Controller<br/>• JWT Token Verification & Session State<br/>• Strict CORS & HTTP Security Headers<br/>• RBAC Guard (ADMIN, AR_HEAD, COLLECTOR)<br/>• Rate Limiting & DoS Mitigation<br/>• JSON Audit Logger with Client Tracing"]
        NGINX --> GW_SEC
    end

    subgraph TIER3["TIER 3: CORE DOMAIN APPLICATION SERVICES (GOLANG GIN ENGINE)"]
        direction TB
        subgraph ENGINES["Modular Domain Engines (:8030)"]
            DE_ENG["Decision & Scoring Engine<br/>• 0-1000 Behavioral Scoring<br/>• Action Path Matrix (Grade 1-8)<br/>• Champion vs Challenger Router<br/>• Dynamic Re-Evaluation Sandbox"]
            PDM_ENG["Pre-Delinquency Engine (PDM)<br/>• CASA Balance Watcher (H-3..H-0)<br/>• ASN Tukin/Payroll Calendar<br/>• First Payment Default (FPD) Alert"]
            SETTLE_ENG["Settlement & Rebate Engine<br/>• 6-Stage Lifecycle State Machine<br/>• Multi-Tranches Allocator (1-6)<br/>• Rule 78 Rebate Calculator<br/>• Approval Authority Limit Matrix"]
            SUPER_ENG["Supervisory & Workforce Engine<br/>• Balanced Round-Robin Allocator<br/>• Capacity Tracker (Opt/Overload)<br/>• Out-of-Office (OOO) Delegator<br/>• Agency SLA & Recovery Monitor"]
            FIELD_ENG["mCollect & Telemetry Service<br/>• GPS Heartbeat Telemetry Ingestion<br/>• Anomaly Detection (Idle/Jump)<br/>• Route Point Aggregator & Playback<br/>• Digital Receipt Slip (PIS) Engine"]
            OMNI_ENG["Omnichannel Messaging Gateway<br/>• WhatsApp Cloud API / Fonnte<br/>• Smart IVR Robo-Call Dialer<br/>• SMS Failover Gateway<br/>• Dynamic Persona Script Parser"]
            LEGAL_ENG["Legal & Liquidation Manager<br/>• 6-Stage Litigation Workflow<br/>• 8-Stage Auction & Repossession<br/>• Stockyard & KJPP Appraisal Tracker"]
            RECON_ENG["Payment Recon & Takeout Engine<br/>• Real-Time Webhook Listener<br/>• Instant Balance Match-off<br/>• <5 Min Task Cancellation (Anti-Overcollect)"]
        end
    end

    subgraph TIER4["TIER 4: PERSISTENCE & DATA GOVERNANCE LAYER"]
        direction TB
        DB_PG[("PostgreSQL 14+ / 18+ Relational Database (crms_db)<br/>Connection Pool (MaxOpen: 50, MaxIdle: 10, Lifetime: 1h)")]
        subgraph TABLES["Core Relational Schemas & Entities"]
            T_CUST["Customers, Agreements, Overdue Accounts, Pre-Delinquency"]
            T_ACT["Collection Activities, Payment Slips (PIS), Decision Rules"]
            T_LEGAL["Legal Cases, Repo Cases, Settlement Proposals & Tranches"]
            T_GEO["Collector Geo Locations, Route Points, Agencies, Delegations"]
            T_SEC["Users, Global Parameters, Audit Log Trails"]
        end
        DB_PG --- TABLES
    end

    subgraph TIER5["TIER 5: EXTERNAL ENTERPRISE INTEGRATION BACKBONE"]
        direction LR
        EXT_CBS["Core Banking System (CBS)<br/>• Batch EOD 02:00 AM Sync<br/>• Real-Time Loan Ledger REST API"]
        EXT_PAY["Payment Infrastructure<br/>• BI-FAST Payment Switching<br/>• Bank Virtual Account (VA)<br/>• Dynamic QRIS Gateway"]
        EXT_COMM["Communication Networks<br/>• WhatsApp Business API<br/>• Telecom Smart IVR / PSTN<br/>• National SMS Center"]
        EXT_GOV["Registry & Judicial Panels<br/>• Dukcapil KTP Identity API<br/>• ATR/BPN Hak Tanggungan<br/>• KPKNL Balai Lelang Negara<br/>• Panel KJPP & Law Firm Rekanan"]
    end

    TIER1 ==>|HTTPS REST / WSS| TIER2
    TIER2 ==>|Internal HTTP Proxy :8030| TIER3
    TIER3 ==>|GORM / SQL Connection Pool :5432| TIER4
    TIER3 <==>|Mutual TLS / REST / Webhooks| TIER5
```

#### Rincian Spesifikasi & Peran Tiap Lapisan (Tier Breakdown):

1. **Tier 1: Presentation & Touchpoints (Frontend Clients)**
   - **Teknologi**: React 18.3+, Vite Compiler, Tailwind CSS 3.4, Lucide React Icons.
   - **Karakteristik**: Single Page Application (SPA) responsif multi-platform (Desktop PC, Tablet, dan Smartphone Android/iOS).
   - **Antarmuka Utama**:
     - *Operations Portal*: Matriks Overdue DPD 1-30, Dynamic Filters, Penomoran Urut (Row Number), VIP Portal, PDM Dashboard, Legal & Repo steppers.
     - *mCollect Workbench*: Antarmuka lapangan ramah jempol (*thumb-friendly*), PWA offline-ready, perekaman pelunasan tunai/transfer, generator tautan QRIS/VA, dan simulator pelunasan dipercepat (Rule 78).
     - *GeoTracker Visualizer*: Peta vektor interaktif DKI Jakarta (Jakarta Pusat, Barat, Selatan, Timur, Utara & Bodetabek), visualisasi status gerak kolektor (*pulse markers*), pemutaran ulang rute (*route playback*), dan indikator anomali waktu diam.
     - *Supervisory Portal*: Monitoring agensi eksternal, kapasitas kolektor, pendelegasian wewenang OOO, dan simulasi aturan baru.

2. **Tier 2: API Gateway & Security Routing Layer**
   - **Teknologi**: Nginx Web Server (Reverse Proxy), OpenSSL (TLS 1.3 / HTTP/2), Gin Engine Middleware Pipeline.
   - **Port Operasional**: Eksternal Port `3030` (HTTPS SSL), Internal Routing Port `8030` (Golang HTTP Service).
   - **Tugas Utama**:
     - *SSL Termination*: Enkripsi ujung-ke-ujung (*end-to-end encryption*) menggunakan sertifikat digital X.509.
     - *Security Middlewares*: Validasi JWT Token, proteksi Cross-Origin Resource Sharing (CORS), filtering Cross-Site Scripting (XSS), Content Security Policy (CSP).
     - *Rate Limiting*: Proteksi DoS/Brute-force dengan pembatasan frekuensi request per alamat IP (120 req/menit untuk API publik, unlimited untuk subnet CBS internal).
     - *Distributed Tracing*: Penyematan `X-Request-ID` unik di setiap request untuk kemudahan penelusuran (*traceability*) lintas log sistem.

3. **Tier 3: Core Domain Application Services (Backend Golang Gin Engine)**
   - **Teknologi**: Go 1.24+ (Compiled Machine Code), Gin Web Framework, GORM Object-Relational Mapping.
   - **Karakteristik**: Arsitektur modular *Domain-Driven Services* dengan pemrosesan *concurrency* tinggi melalui Go Goroutines, konsumsi memori rendah (< 45 MB RAM idle), dan *sub-millisecond latency*.
   - **8 Domain Engine Terintegrasi**:
     - *Decision & Scoring Engine*: Perhitungan skor risiko kredit (0-1000), penentuan Action Path (Grade 1-8), pemisahan Champion vs Challenger, dan evaluasi ulang dinamis.
     - *Pre-Delinquency Management Engine (PDM)*: Pengawasan DPD 0, deteksi saldo rekening autodebet (CASA) H-3 s.d H-0, pemantauan tanggal transfer gaji/tukin ASN DKI, dan peringatan FPD (*First Payment Default*).
     - *Settlement & Rebate Engine*: Pengelolaan siklus 6 tahapan kompromi kredit, penjadwalan *multi-tranches* (1-6 termin), perhitungan potongan bunga Rule 78, dan eskalasi persetujuan berjenjang.
     - *Supervisory & Workforce Engine*: Distribusi antrean berimbang (*Balanced Round-Robin*), pemantauan beban kerja (optimal 25 akun/kolektor), pendelegasian wewenang sementara (*Out of Office*), dan audit SLA agensi penagihan.
     - *mCollect & Telemetry Service*: Penyerapan koordinat GPS telemetri kolektor harian, pencatatan titik rute (*route points*), deteksi anomali waktu diam (>120 menit), dan penerbitan kuitansi elektronik (PIS).
     - *Omnichannel Messaging Gateway*: Integrasi WhatsApp API (Fonnte/Meta Cloud API), Smart IVR Robo-Call, dan SMS fallback dengan skrip pesan dinamis ter-encode.
     - *Legal & Asset Liquidation Engine*: Pelacakan alur perkara perdata perbankan (6 tahapan) dan eksekusi lelang agunan SHM/BPKB di KPKNL (8 tahapan).
     - *Payment Reconciliation & Takeout Task Engine*: Pendengar webhook pembayaran instan (BI-FAST & VA) yang seketika mematikan antrean penagihan aktif (*instant task cancellation*) dalam tempo < 5 menit.

4. **Tier 4: Persistence & Data Governance Layer**
   - **Teknologi**: PostgreSQL 14+ / 18+ Enterprise RDBMS (`crms_db`), GORM Database Abstraction.
   - **Integritas & Keamanan**:
     - *Connection Pooling*: Pengaturan `MaxOpenConns = 50`, `MaxIdleConns = 10`, `ConnMaxLifetime = 1 Hour` untuk efisiensi koneksi *multi-threaded*.
     - *Indeks Khusus Performa*: B-Tree indexes pada kolom pencarian intensif (`cif`, `agreement_no`, `account_no`, `dpd`, `risk_level`, `collector_id`, `created_at`).
     - *Perlindungan Data Pribadi (UU PDP No. 27/2022)*: Masking otomatis nomor KTP/NIK (`3171************`), nomor HP (`0812****8890`), dan nomor rekening; penyimpanan data terenkripsi *at-rest*; pencatatan audit log tak terhapuskan (*append-only immutable audit trail*).

5. **Tier 5: External Enterprise Integration Backbone**
   - **Core Banking System (CBS)**: Sinkronisasi data saldo dan DPD harian (*Batch EOD* pukul 02:00 WIB) serta sinkronisasi *near-real-time* status pinjaman melalui REST API terproteksi mTLS.
   - **Payment Infrastructure (BI-FAST & Virtual Account)**: Jalur verifikasi dan notifikasi pembayaran digital 24/7/365 untuk pemulihan kredit tanpa batas waktu operasional bank.
   - **Communication Networks**: Meta WhatsApp Cloud API / Mitra Resmi BSP (Fonnte), SIP/PSTN Telephony Provider untuk Smart IVR Robo Call.
   - **Registry & Judicial Panels**: API Kependudukan Kemendagri (Dukcapil) untuk validasi KTP & skip tracing, portal lelang DJKN Kemenkeu (KPKNL) untuk lelang hak tanggungan, dan Sistem Informasi Penelusuran Perkara (SIPP) Pengadilan Negeri.

---

### 11.4. Arsitektur Komponen Layanan Modular Backend (Domain Micro-Services Topology)

Diagram berikut mengilustrasikan topologi internal komponen modular backend Golang Gin, pemisahan layer controller/handler, domain service, dan data access repository:

```mermaid
graph TD
    ClientReq["Incoming HTTP/HTTPS Request<br/>(:3030 -> :8030)"] --> GinRouter["Gin Router Engine (/api/v1)"]
    
    subgraph MIDDLEWARES["Security & Filter Middleware Pipeline"]
        GinRouter --> M_CORS["CORS Middleware"]
        M_CORS --> M_RATE["Rate Limiter (Token Bucket)"]
        M_RATE --> M_AUTH["JWT Auth & Session Validator"]
        M_AUTH --> M_RBAC["RBAC Authorizer (Role Guard)"]
        M_RBAC --> M_LOG["Request Tracing & JSON Audit Logger"]
    end

    subgraph HANDLERS["API Route Controllers (Handlers Layer)"]
        M_LOG --> H_OVERDUE["Overdue & Account Handler"]
        M_LOG --> H_DECISION["Decision Engine Handler"]
        M_LOG --> H_PDM["Pre-Delinquency Handler"]
        M_LOG --> H_SETTLE["Settlement & Rebate Handler"]
        M_LOG --> H_MCOLLECT["mCollect & Payment Handler"]
        M_LOG --> H_GEO["GeoTracker Telemetry Handler"]
        M_LOG --> H_SUPER["Supervisory & Agency Handler"]
        M_LOG --> H_LEGAL["Legal & Repo Auction Handler"]
        M_LOG --> H_PAY["Payment Webhook Handler"]
    end

    subgraph SERVICES["Core Domain Business Services"]
        H_OVERDUE --> S_ACCOUNT["Account & Customer 360 Aggregator"]
        H_DECISION --> S_SCORING["0-1000 Scoring & Action Path Service"]
        H_PDM --> S_PDM["CASA Watcher & Payroll Tukin Service"]
        H_SETTLE --> S_SETTLE["6-Stage Settlement & Rule 78 Service"]
        H_MCOLLECT --> S_MCOLLECT["Field Slip & QRIS Link Service"]
        H_GEO --> S_GEO["GPS Telemetry & Anomaly Detector"]
        H_SUPER --> S_SUPER["Round-Robin Queue & Delegation Service"]
        H_LEGAL --> S_LEGAL["Litigation & Repossession Service"]
        H_PAY --> S_RECON["Takeout Task & Instant Match-off Service"]
    end

    subgraph REPOSITORIES["Data Persistence Repositories (GORM Engine)"]
        S_ACCOUNT & S_SCORING & S_PDM & S_SETTLE & S_MCOLLECT & S_GEO & S_SUPER & S_LEGAL & S_RECON --> DB_CONN["PostgreSQL Connection Pool (crms_db)"]
    end
```

---

### 11.5. Diagram Aliran Data End-to-End & Siklus Sinkronisasi

Aliran data dalam sistem CRMS terbagi menjadi dua siklus fundamental: **Siklus Batch Harian EOD (Nightly Batch Data Sync)** dan **Siklus Real-Time Event-Driven (Instant Payment Takeout & Telemetry)**.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Debitur (Nasabah)
    participant FieldApp as mCollect / Collector
    participant CRMS_API as CRMS Backend API (:8030)
    participant DecisionEng as Decision & Scoring Engine
    participant DB as PostgreSQL (crms_db)
    participant CoreBank as Core Banking System (CBS)
    participant PaymentGW as BI-FAST / Virtual Account
    participant WAGateway as WhatsApp Cloud Gateway

    %% SIKLUS 1: EOD BATCH CYCLE
    rect rgb(240, 248, 255)
        Note over CRMS_API,CoreBank: SIKLUS 1: Siklus Batch Harian End of Day (EOD - 02:00 WIB)
        CoreBank->>CRMS_API: 1. Transmit Data Rekening Tertunggak EOD (CIF, DPD, Pokok, Bunga, Denda)
        CRMS_API->>DecisionEng: 2. Kirim Data Rekening untuk Evaluasi Koleksi
        DecisionEng->>DecisionEng: 3. Kalkulasi Skor Risiko (0-1000) & Penentuan Action Path (AP 1-8)
        DecisionEng->>DecisionEng: 4. A/B Testing Segmentasi: Champion (Baseline) vs Challenger (Cerdas)
        DecisionEng->>DB: 5. Simpan Status Rekening, Bucket DPD Baru, & Penugasan PIC Antrean
        CRMS_API->>WAGateway: 6. Trigger Otomatis Gentle Reminder DPD 0 (PDM) & Blast DPD 1-7 (AP 3/4)
        WAGateway-->>Customer: 7. Notifikasi Tagihan Personal Ramah (+ Tautan Bayar VA/QRIS)
    end

    %% SIKLUS 2: REAL-TIME PAYMENT TAKEOUT
    rect rgb(240, 255, 240)
        Note over Customer,CRMS_API: SIKLUS 2: Siklus Pembayaran Real-Time & Takeout Task (< 5 Menit)
        Customer->>PaymentGW: 8. Nasabah Membayar via BI-FAST / M-Banking Virtual Account
        PaymentGW->>CoreBank: 9. Setoran Berhasil & Pembukuan Mutasi Kredit
        CoreBank->>CRMS_API: 10. Webhook Instan Notifikasi Pelunasan (POST /confins/simulate-payment)
        CRMS_API->>DB: 11. Update Saldo Tunggakan = 0, Status = 'PAID', Catat Audit Trail
        CRMS_API->>CRMS_API: 12. Instant Task Takeout: Hapus Rekening dari Antrean Kerja Kolektor
        CRMS_API->>WAGateway: 13. Kirim Kuitansi Digital (PIS) & Ucapan Terima Kasih via WhatsApp
        WAGateway-->>Customer: 14. Bukti Bayar Digital Diterima Nasabah Seketika
        CRMS_API-->>FieldApp: 15. Notifikasi Push ke Kolektor: "Tugas Dibatalkan - Nasabah Telah Bayar"
    end
```

---

### 11.6. Decision Engine (Scoring Model & Rule Engine)

Decision Engine CRMS adalah otak analitis cerdas yang mengevaluasi setiap akun kredit tertunggak pada siklus harian EOD maupun pembaruan transaksi *near-real-time*. Arsitektur engine ini memadukan dua subsistem inti: **Collection Scoring Model (Behavioral & Multi-Factor Scoring 0–1000 Poin)** dan **Rule-Based Allocation Engine (Action Path Matrix Grade 1–8 & VIP)**.

```mermaid
graph TD
    A["Data Debitur & Fasilitas Kredit"] --> B["Collection Scoring Engine"]
    
    subgraph SCORING_MODEL["1. Model Skoring Multi-Faktor Koleksi (Skala 0 - 1000 Poin)"]
        B1["Riwayat Pembayaran (Payment History - 35%)<br>• Keberhasilan Janji Bayar (Kept PTP Ratio)<br>• Frekuensi DPD 12 Bulan Terakhir<br>• Kecepatan Cure Kol-1"]
        B2["Hari Keterlambatan Berjalan (Current DPD - 25%)<br>• Posisi Bucket Keterlambatan Saat Ini<br>• Lonjakan DPD (Roll Rate Severity)"]
        B3["Rasio Beban Utang / DSR (20%)<br>• Rasio Angsuran terhadap Gaji Bulanan<br>• Total Eksposur Fasilitas di Bank"]
        B4["Tipe Fasilitas & Agunan (10%)<br>• Pinjaman Beragun Properti SHM vs Unsecured<br>• Rasio Loan-to-Value (LTV)"]
        B5["Stabilitas Pekerjaan ASN/PNS DKI (10%)<br>• Status PNS/PPPK Pemprov DKI Jakarta<br>• Payroll Autodebet & Rekening Kasda"]
        B --> B1 & B2 & B3 & B4 & B5
    end

    B1 & B2 & B3 & B4 & B5 --> C["Agregasi Skor Risiko Kredit: 0 - 1000"]

    C --> D{"Klasifikasi Level Risiko"}
    D -->|Flag VIP = True| D4["VIP PORTFOLIO<br>(Nasabah Prioritas Bank)"]
    D -->|Skor >= 700| D1["LOW RISK<br>(Kredit Baik / Risiko Rendah)"]
    D -->|Skor 450 - 699| D2["MEDIUM RISK<br>(Kredit Perhatian / Risiko Sedang)"]
    D -->|Skor < 450| D3["HIGH RISK<br>(Kredit Rawan / Risiko Tinggi)"]

    subgraph STRATEGY_ASSIGNMENT["2. Alokasi Strategi Penagihan (Grade 1 - 8 & VIP)"]
        D4 --> E4["Grade VIP (Special Team / AR Head)<br>(Penanganan Personal Eksklusif)"]
        D1 --> E1["Challenger Grade 3 & 4 (Low Risk)<br>(Digital-First: WA Bot -> Robo Call)"]
        D2 --> E2["Challenger Grade 5 & 6 (Medium Risk)<br>(Hybrid: Robo Call / DC -> Field Visit)"]
        D3 --> E3["Challenger Grade 7 & 8 (High Risk)<br>(Field Officer Langsung DPD 1)"]
    end

    E1 & E2 & E3 --> F["Matriks Action Path x 10 Bucket DPD (-3-0 s/d >150)"]
    F --> G["Penugasan PIC Otomatis<br>(WA, Robot, DC, FC, SFC, Senior Field, Remedial)"]
```

#### 11.6.1. Filosofi & Perbedaan Collection Scoring vs Application Scoring
* **Application Scoring (Credit Origination)**: Menilai kelayakan calon debitur saat permohonan kredit diajukan berdasarkan data historis statis (slip gaji, rekening koran, riwayat SLIK OJK). Tujuannya adalah keputusan biner: *Approve* atau *Reject*.
* **Collection Scoring (Behavioral Recovery Scoring)**: Menilai **kemungkinan debitur memulihkan pembayarannya (*Cure Probability*)** dan **probabilitas akun melompat ke bucket keterlambatan yang lebih dalam (*Roll Rate Probability*)** setelah debitur mengalami keterlambatan pembayaran (DPD 1+) atau menjelang jatuh tempo (DPD 0). Tujuannya adalah menentukan **rekomendasi kanal penagihan paling hemat biaya** dan **urgensi intervensi petugas penagih lapangan**.

#### 11.6.2. Parameter & Bobot Pembentuk Skor Koleksi (Collection Scoring Variables)
CRMS menerapkan algoritma pembobotan multi-faktor standar industri perbankan dengan rentang skor **0 s/d 1000 Poin**:

$$	ext{Risk Score} = \sum_{i=1}^{5} (w_i 	imes S_i)$$

| Kategori Parameter | Bobot ($w_i$) | Variabel Pengukuran | Indikator Skor Tinggi (Skor $\ge 700$) | Indikator Skor Rendah (Skor $< 450$) |
|---|:---:|---|---|---|
| **Riwayat Pembayaran (*Payment History*)** | **35%** | • Keberhasilan janji bayar (*Kept PTP Ratio*)<br>• Frekuensi menunggak 12 bulan terakhir<br>• Kecepatan pelunasan (*average days to cure*) | PTP selalu ditepati ($> 85\%$), jarang menunggak, cepat kembali ke Kol-1 dalam tempo $\le 5$ hari. | Sering ingkar janji (*broken PTP* $> 50\%$), menunggak berulang hampir setiap bulan, lambat bayar. |
| **Hari Keterlambatan Berjalan (*Current DPD*)** | **25%** | • Posisi bucket keterlambatan saat ini<br>• Lonjakan hari tunggakan (*DPD acceleration*) | Berada pada fase preventif DPD 0 s.d DPD 3 dengan tren penurunan. | Menunggak melebihi DPD 14 dengan tren memburuk menuju NPL. |
| **Rasio Beban Utang (*Debt Service Ratio / DSR*)** | **20%** | • Rasio total angsuran terhadap estimasi gaji<br>• Total baki debet pinjaman aktif di bank | Angsuran proporsional terhadap penghasilan ($DSR \le 35\%$), sisa plafon likuid aman. | Beban utang sangat berat ($DSR > 50\%$), gaji tidak mencukupi untuk memenuhi kewajiban bulanan. |
| **Tipe Fasilitas & Agunan (*Facility & Collateral*)** | **10%** | • Ada/tidaknya agunan fisik<br>• Rasio nilai pinjaman terhadap taksiran agunan (*LTV*)<br>• Legalitas sertifikat (SHM/SHGB/BPKB) | Agunan properti bernilai likuid tinggi dengan $LTV \le 60\%$, sertifikat SHM terikat Hak Tanggungan sempurna. | Kredit tanpa agunan (unsecured / KTA / CC) atau agunan bergerak dengan depresiasi tinggi ($LTV > 90\%$). |
| **Stabilitas Pekerjaan ASN/PNS DKI (*Employment Stability*)** | **10%** | • Status kepegawaian institusi Pemprov DKI Jakarta<br>• Mekanisme autodebet rekening penggajian | ASN/PNS/PPPK aktif Pemprov DKI Jakarta, pegawai tetap BUMD DKI, autodebet terjadwal rapi dari kasda. | Pegawai kontrak non-ASN, pekerja lepas, atau debitur dengan riwayat rekening payroll pasif. |

#### 11.6.3. Matriks Klasifikasi Level Risiko & Strategi Penagihan

| Level Risiko | Rentang Skor | Karakteristik Debitur | Saluran Rekomendasi Utama | Tindakan Decision Engine | Estimasi Efisiensi Biaya |
|---|:---:|---|---|---|:---:|
| **`LOW_RISK`** | **700 – 1000** | Debitur prima, menunggak akibat kelalaian jadwal/libur perbankan atau kendala autodebet temporer. Kemauan bayar sangat tinggi. | **WhatsApp AutoBot** & SMS Gateway | Masuk ke **Grade 3 atau 4** (Challenger Digital-First). Tanpa kunjungan fisik pada DPD 1–30. | **90% – 95%** |
| **`MEDIUM_RISK`** | **450 – 699** | Debitur musiman (*seasonal*), arus kas bisnis berfluktuasi, atau ASN yang menunggu rapel tunjangan kinerja (Tukin). Membutuhkan edukasi dan reminder terjadwal. | **Smart Robo Call** & **Desk Collector (DC)** | Masuk ke **Grade 5 atau 6** (Challenger Hybrid). Kombinasi panggilan otomatis dan telepon personal kolektor. | **70% – 80%** |
| **`HIGH_RISK`** | **0 – 449** | Debitur kronis, riwayat *broken PTP* berulang, nomor telepon kerap tidak aktif, agunan mengalami sengketa/depresiasi. | **Field Collector (FC)** & **Senior Field (SFC)** | Masuk ke **Grade 7 atau 8** (Challenger Intensive Field). Langsung dilakukan verifikasi fisik sejak DPD 1–7. | **Baseline Field** |
| **`VIP`** | **Khusus** | Nasabah simpanan besar / High Net Worth Individuals / Kredit Korporasi & Komersial penting. | **Dedicated Special Team (AR Head)** | Tidak melalui bot digital / outbound call center. Dikelola melalui Portal Eksklusif AR Head. | N/A (Preservasi Hubungan Nasabah) |

#### 11.6.4. Matriks Pemetaan Action Path (Grade 1–8 & VIP) x 10 Bucket DPD
Berdasarkan kombinasi Traffic (Champion vs Challenger) dan Risk Level dari scoring, Decision Engine menentukan petugas (PIC) penangan secara otomatis:

| Action Path (Grade) | Segmentasi & Dasar Penentuan | DPD -3-0 | DPD 1–3 | DPD 4–7 | DPD 8–13 | DPD 14–18 | DPD 19–25 | DPD 26–30 | DPD 31–60 | DPD 61–150 | DPD >150 |
|:---:|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Grade 1** | Champion Group (Baseline A) | WA | Robot | DC | DC | DC | DC | DC | FC | Senior Field | Remedial |
| **Grade 2** | Champion Group (Baseline B) | WA | Robot | DC | DC | DC | DC | DC | FC | Senior Field | Remedial |
| **Grade 3** | Challenger — Low Risk (Digital Extended) | **WA** | **WA** | **Robot** | **Robot** | DC | DC | DC | FC | Senior Field | Remedial |
| **Grade 4** | Challenger — Low Risk (Early DC) | **WA** | **WA** | **Robot** | DC | DC | DC | DC | FC | Senior Field | Remedial |
| **Grade 5** | Challenger — Medium Risk (Standard Hybrid) | Robot | DC | DC | FC | FC | FC | FC | Senior Field | Senior Field | Remedial |
| **Grade 6** | Challenger — Medium Risk (Early FC) | Robot | DC | FC | FC | FC | FC | FC | Senior Field | Senior Field | Remedial |
| **Grade 7** | Challenger — High Risk (Standard Field) | DC | FC | FC | FC | FC | SFC | SFC | Senior Field | Senior Field | Remedial |
| **Grade 8** | Challenger — High Risk (Early SFC) | DC | FC | FC | SFC | SFC | SFC | SFC | Senior Field | Senior Field | Remedial |
| **VIP** | VIP Portfolio (Exclusive Handling) | **Special** | **Special** | **Special** | **Special** | **Special** | **Special** | **Special** | **Special** | **Special** | **Special** |

#### 11.6.5. Simulasi Evaluasi Ulang Dinamis (A/B Testing Champion vs Challenger)
* Sistem CRMS memungkinkan manajemen risiko melakukan **A/B Testing** perbandingan performa antara strategi penagihan konvensional (`CHAMPION`) dengan strategi cerdas berbasis skor risiko (`CHALLENGER`).
* Endpoint `POST /api/v1/overdue-accounts/:id/reevaluate` memungkinkan evaluasi instan jika terjadi perubahan profil debitur (misalnya penambahan komitmen PTP, perbaikan riwayat bayar, atau perubahan data kontak).

---

### 11.7. Gerbang Omnichannel & Arsitektur Pesan Pintar

1. **WhatsApp Enterprise Messaging Gateway (Arsitektur Teruji)**:
   - Terkoneksi dengan HTTP API Gateway (Meta Cloud API / Fonnte Provider) dan protokol direct URL fallback (`https://wa.me/...`).
   - Mesin parser pesan otomatis melakukan substitusi token: nama nasabah, nomor kontrak, baki debet, rincian bunga dan denda, nomor Virtual Account Bank, tautan QRIS dinamis, dan tanggal jatuh tempo.
   - Perekaman otomatis ke audit trail kronologis pada tabel `collection_activities` seketika saat pesan terkirim.
2. **Smart IVR Interactive Robo-Call**:
   - Panggilan otomatis robot cerdas dengan sintesis suara berbasis teks (*Text-to-Speech*) untuk mengonfirmasi komitmen bayar nasabah melalui penekanan tombol nada panggil (*Dual-Tone Multi-Frequency / DTMF response*).
   - Jawaban nasabah (misal: Tekan 1 untuk konfirmasi bayar hari ini, Tekan 2 untuk penundaan) langsung memicu pembuatan komitmen PTP otomatis pada basis data CRMS.
3. **Desk Telephony CRM & Skrip Dinamis Terpandu**:
   - Dashboard kolektor meja (*desk collector*) menyajikan antarmuka terpandu 5 segmen: Pembukaan & Verifikasi Identitas, Edukasi Tagihan, Negosiasi & Komitmen Bayar, Penyampaian Nomor Rekening/VA, dan Penutup Resmi yang patuh regulasi POJK Perlindungan Konsumen.
4. **Digital Payment Slip (PIS) Dispatcher**:
   - Menghasilkan bukti setor digital elektronik (PIS) seketika setelah pembayaran lapangan dicatat, lengkap dengan kode QR verifikasi dan link dokumen yang langsung diteruskan ke WhatsApp nasabah.

---

### 11.8. Arsitektur Workbench Lapangan (mCollect) & Sistem Telemetri GeoTracker

```mermaid
graph LR
    subgraph FIELD_DEVICE["Perangkat Petugas Lapangan (Smartphone Android/iOS)"]
        mCollectApp["mCollect Web PWA<br/>• Antrean Kunjungan Harian<br/>• Pencatatan Bayar (Cash/VA)<br/>• Foreclosure Payoff Calculator<br/>• GeoLocation Watcher (HTML5)"]
    end

    subgraph TELEMETRY_INGESTION["CRMS Telemetry Ingestion Layer (:8030)"]
        GeoHandler["GeoTracker Handler<br/>(POST /collectors/locations)"]
        AnomalyEngine["Anomaly Detection Engine<br/>• Idle Outlier Filter (>120 mnt)<br/>• Velocity / GPS Jump Filter"]
    end

    subgraph STORAGE_LAYER["PostgreSQL Database (crms_db)"]
        T_LOC["collector_geo_locations<br/>(lat, lng, speed, status, idle_min)"]
        T_ROUTE["collector_route_points<br/>(sequence_no, action, notes)"]
    end

    subgraph SUPERVISOR_MONITOR["Ruang Kontrol Supervisor (Web Console)"]
        GeoTrackerUI["GeoTracker Command Center<br/>• Live Jakarta Vector Map<br/>• Animated Route Playback<br/>• Time Analytics Dashboard<br/>• Red Alert Anomaly Indicator"]
    end

    mCollectApp -->|Heartbeat GPS Telemetri Tiap 5 Menit| GeoHandler
    GeoHandler --> AnomalyEngine
    AnomalyEngine --> T_LOC & T_ROUTE
    T_LOC & T_ROUTE -->|Real-Time Polling / Query| GeoTrackerUI
```

1. **mCollect Field Workbench**:
   - Antarmuka *mobile-first* dirancang untuk kolektor lapangan (*Field Collector* dan *Senior Field*) dengan dukungan luring ringan (*offline resilience*).
   - Dilengkapi generator tautan bayar mandiri (QRIS Dinamis & Virtual Account 24 jam) yang langsung dikirimkan ke WhatsApp debitur saat negosiasi tatap muka.
   - **Simulator Pelunasan Dipercepat (Foreclosure Calculator)**: Menghitung seketika pelunasan kredit berdasarkan rumus bunga *Rule of 78*:
     $$\text{Interest Rebate} = \text{Total Interest} \times \frac{k(k+1)}{n(n+1)}$$
     Di mana $n$ adalah tenor total bulan, dan $k$ adalah sisa bulan yang belum dijalani. Menghitung penalti pelunasan dipercepat (standar 3.5%), potongan denda, dan total pelunasan bersih (*Total Net Payoff*).
2. **GeoTracker Telemetry Engine**:
   - **Perekaman Koordinat**: Mengambil posisi GPS perangkat secara presisi (Latitude, Longitude, Akurasi dalam meter, dan Kecepatan dalam km/jam).
   - **Deteksi Anomali Waktu Diam (Idle Outlier Alert)**: Menganalisis jeda waktu antar-aktivitas kunjungan. Jika kolektor berada pada status `IDLE` melebihi ambang batas toleransi (> 120 menit) tanpa adanya pencatatan hasil kunjungan baru, sistem secara otomatis menerbitkan tanda peringatan (*anomaly alert*) berwarna merah pada dashboard supervisor.
   - **Pencegahan GPS Palsu (Anti-Spoofing & Velocity Jump)**: Mendeteksi perpindahan lokasi yang tidak masuk akal secara fisik (kecepatan pergerakan $> 120$ km/jam di wilayah perkotaan) untuk menjamin validitas kunjungan nyata.

---

### 11.9. Arsitektur Settlement 6-Stage & Supervisory Control Engine

1. **6-Stage Settlement Lifecycle**:
   - **Stage 1 (Initiate Settlement)**: Pengajuan diskon kompromi (Net Settlement, Charge-Wise Waive, atau Auto Charge Allocation).
   - **Stage 2 (Generate Schedule)**: Penjadwalan bertahap (*Single* atau *Multi-Tranches* 1 s.d 6 termin).
   - **Stage 3 (Draw Payment Plan)**: Simulasi alokasi pelunasan pokok dan mitigasi gagal bayar termin lanjutan.
   - **Stage 4 (Recommend & Approval Matrix)**: Eskalasi persetujuan berjenjang:
     - Collector / Staff: Plafon rekomendasi s.d Rp 10 Juta
     - Branch Manager: Limit persetujuan s.d Rp 50 Juta
     - AR Head / Head of Recovery: Limit persetujuan s.d Rp 150 Juta
     - BOD / Komite Remedial: Limit > Rp 150 Juta atau diskon pokok > 30%
   - **Stage 5 (Payment Tracking)**: Pemantauan realisasi setoran per termin (PAID vs PENDING vs OVERDUE).
   - **Stage 6 (Settlement Closure)**: Rekonsiliasi akuntansi akhir, *match-off* core banking, status `STAGE_CLOSED`, dan penerbitan Surat Keterangan Lunas (SKL).
2. **Supervisory & Workforce Management Engine**:
   - **Balanced Round-Robin Queue Allocator**: Membagi antrean akun tertunggak baru secara berimbang antar-kolektor yang aktif dalam portofolio yang sama.
   - **Capacity Planning & Overload Guard**: Menghitung utilisasi beban kerja harian kolektor (optimal 25 akun aktif). Status terbagi menjadi: **OPTIMAL** (<70%), **NEAR CAPACITY** (70-90%), dan **OVERLOADED** (>90%).
   - **Out of Office (OOO) Authority Delegation**: Pelimpahan wewenang persetujuan kompromi sementara dari pejabat berwenang (misal AR Head) kepada pelaksana tugas (misal Senior Remedial Officer) selama periode cuti atau dinas luar kota dengan batas limit dan tanggal kadaluarsa yang ketat.
   - **Agency Onboarding & SLA Monitoring**: Pengelolaan mitra agensi penagihan pihak ketiga (*External Agencies*), mencakup nomor izin, masa berlaku kontrak, tarif komisi sukses, dan rasio pemulihan (*Recovery Rate %*).

---

### 11.10. Arsitektur Keamanan, Kepatuhan UU PDP No. 27/2022 & Audit Trail

Keamanan sistem CRMS dirancang selaras dengan regulasi Otoritas Jasa Keuangan (POJK Tata Kelola Teknologi Informasi) dan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022):

1. **Data Masking (Penyamaran Data Sensitif)**:
   - Data Pribadi (PII) disamarkan di antarmuka pengguna: Nomor NIK KTP disamarkan (`317102********01`), Nomor Handphone disamarkan (`0812****8890`), dan Nomor Rekening disamarkan (`101-**-*****-9`).
   - Pembukaan masking data hanya dapat dilakukan oleh peran `AR_HEAD` atau `ADMIN` dengan perekaman alasan pembukaan di log audit (*justified unmasking audit*).
2. **Enkripsi Data (Data Encryption)**:
   - *In-Transit*: Seluruh komunikasi jaringan melalui jalur aman HTTPS / TLS 1.3 dengan cipher suite modern (*AES-GCM / ChaCha20-Poly1305*).
   - *At-Rest*: Kolom data kredensial dan informasi sensitif di database terenkripsi menggunakan AES-256.
3. **Role-Based Access Control (RBAC)**:
   - Pemisahan hak akses ketat antara `ADMIN`, `AR_HEAD`, `COLLECTOR`, dan `SUPERVISOR`. Kolektor hanya memiliki akses terhadap daftar akun yang ditugaskan (*assigned queue only*) dan dilarang mengekspor data massal.
4. **Immutable Append-Only Audit Trail**:
   - Setiap interaksi penagihan, perubahan status, pengajuan kompromi, persetujuan diskon, dan mutasi antrean dicatat ke tabel `collection_activities` dengan timestamp UTC+7, identitas pengguna, alamat IP, dan data sebelum/sesudah perubahan. Data audit trail tidak dapat diubah atau dihapus (*append-only*).

---

### 11.11. Arsitektur Jaringan, Topologi Infrastruktur & Deployment (Production Stack)

Diagram berikut menampilkan topologi fisik dan jaringan implementasi server produksi CRMS pada lingkungan Virtual Private Server (VPS) atau On-Premise Data Center Bank:

```mermaid
graph TB
    subgraph WAN["PUBLIC INTERNET / SECURE BANK NETWORK"]
        BrowserUser["Users (Web Browser Desk / Admin / AR Head)<br/>IP Public / Internal VPN"]
        MobileUser["Field Collectors (mCollect Smartphone)<br/>Mobile Cellular 4G/5G"]
        CBS_Host["Core Banking System (CBS) Host<br/>Private Bank Network / Subnet"]
    end

    subgraph FIREWALL["Edge Firewall & Port Forwarding"]
        FW["Hardware / Cloud Firewall<br/>Allow: Port 80 (Redirect HTTP), Port 443/3030 (HTTPS)<br/>Drop: All Other Direct Ports"]
    end

    subgraph PROD_HOST["Linux Production Server (Ubuntu / RHEL Enterprise)"]
        direction TB
        
        subgraph WEB_PROXY["Web Proxy Tier"]
            NGINX_SRV["Nginx Web Server (:3030 SSL)<br/>• TLS 1.3 Termination (SSL Cert)<br/>• Static React Dist (/dist)<br/>• Reverse Proxy /api/v1 -> :8030<br/>• Gzip / Brotli Compression"]
        end

        subgraph APP_DAEMON["Application Daemon Tier (Systemd Managed)"]
            GIN_APP["Golang CRMS Server Daemon (:8030)<br/>• Binary: /home/crms/backend/crms-server-linux<br/>• Service: crms-backend.service (systemctl)<br/>• Auto-Restart on Failure (RestartSec=5s)<br/>• Standard Log: /home/crms/backend/backend.log"]
        end

        subgraph DB_CLUSTER["Database Tier"]
            PG_SRV["PostgreSQL Database Server (:5432)<br/>• Cluster: crms_db (Owner: crms_user)<br/>• Listen: localhost:5432 (No External Access)<br/>• Storage: /var/lib/postgresql/data (SSD NVMe)<br/>• Automated Daily Backup (pg_dump cron 01:00)"]
        end
    end

    BrowserUser & MobileUser -->|HTTPS :3030| FW
    CBS_Host -->|Internal mTLS REST / Webhook| FW
    FW --> NGINX_SRV
    NGINX_SRV -->|Proxy Pass HTTP :8030| GIN_APP
    GIN_APP -->|Local TCP Loopback :5432| PG_SRV
```

#### Spesifikasi Rekomendasi Mesin Produksi (Hardware & OS Specs):
* **Sistem Operasi**: Ubuntu Server 22.04 LTS / 24.04 LTS atau Red Hat Enterprise Linux (RHEL) 9+.
* **Processor (vCPU)**: Minimal 4 vCPU (Rekomendasi: 8 vCPU Intel Xeon / AMD EPYC).
* **RAM**: Minimal 8 GB RAM (Rekomendasi: 16 GB RAM DDR4/DDR5).
* **Penyimpanan (Storage)**: Minimal 100 GB NVMe SSD (Pemisahan partisi `/var/log` dan `/var/lib/postgresql`).
* **High Availability & RPO/RTO**:
  - *Recovery Point Objective (RPO)*: $\le 15$ Menit (Streaming WAL Archiving PostgreSQL).
  - *Recovery Time Objective (RTO)*: $\le 2$ Jam (Automated failover / Standby instance).


---

## 12. Spesifikasi Teknis & Skema Basis Data (Technical Specs & Data Model)

### 12.1. Arsitektur Komponen Terimplementasi (Production Stack)
| Komponen | Teknologi Terpasang | Konfigurasi Operasional | Deskripsi Peran Sistem |
|---|---|---|---|
| **Backend API** | Golang 1.24+ / Gin & GORM | Port `8030` (`http://localhost:8030`) | RESTful API, Decision Engine, Customer 360 Aggregator, Audit Trail Logging |
| **Frontend Web** | React 18+ (Vite, Tailwind CSS, Lucide Icons) | Port `3030` (`https://...:3030` SSL) | SPA, Bucket Matrix Dashboard, Customer 360 Modal, VIP Portal, Row Number |
| **Database RDBMS** | PostgreSQL 14+ / 18+ | Host `localhost:5432` / DB `crms_db` | Relational database ternormalisasi, integritas referensial dan indeks performa |
| **Web Server & SSL** | Nginx Reverse Proxy | Port `3030` SSL (`fullchain.pem` & `privkey.pem`) | Terminasi SSL/TLS 1.3, kompresi aset, dan reverse proxy internal ke API port 8030 |
| **Global Parameters** | Dynamic Configuration Table (`public.global_parameters`) | `GENERAL_NAMA_PT` & `GENERAL_SIMBOL_PT` | Konfigurasi terpusat nama bank, inisial lembaga, dan parameter operasional |

---

### 12.2. Taksonomi & Daftar Lengkap Tabel Basis Data CRMS (Data Catalog & Sourcing)

Basis data **CRMS (Collection & Recovery Management System)** didesain dengan skema relasional ternormalisasi tingkat ketiga (3NF) pada engine PostgreSQL enterprise. Struktur tabel dalam sistem CRMS diklasifikasikan ke dalam **3 (tiga) kategori utama** berdasarkan sumber asal data (*data sourcing*), siklus hidup (*lifecycle*), dan entitas yang memiliki otoritas modifikasi:

```mermaid
flowchart LR
    subgraph KAT_A["KATEGORI A: EXTERNAL FEEDING MASTER"]
        direction TB
        TA1["customers<br/>(Master Debitur CAS & LMS)"]
        TA2["agreements<br/>(Master Rekening Kredit LMS/CBS)"]
    end

    subgraph KAT_B["KATEGORI B: CRMS ENGINE & ETL GENERATED"]
        direction TB
        TB1["pre_delinquency_accounts<br/>(DPD 0 PDM Watcher)"]
        TB2["overdue_accounts<br/>(DPD 1+ Action Path 1-8)"]
        TB3["decision_rules<br/>(Champion vs Challenger Rules)"]
    end

    subgraph KAT_C["KATEGORI C: CRMS NATIVE OPERATIONAL & TRANSACTIONAL"]
        direction TB
        TC1["collection_activities (Audit Log)"]
        TC2["settlement_proposals & tranches"]
        TC3["skip_tracing_cases"]
        TC4["legal_cases & repossession_cases"]
        TC5["payment_receipt_slips (Digital PIS)"]
        TC6["collector_geo_locations & route_points"]
        TC7["collection_agencies & authority_delegations"]
        TC8["users & global_parameters"]
    end

    KAT_A -->|Nightly Ingestion & Staging| KAT_B
    KAT_B -->|Work Queues & Benchmarks| KAT_C
    KAT_C -.->|Reverse Webhook & Takeout Task| KAT_A
```

#### Tabel Ringkasan Taksonomi 21 Entitas Basis Data CRMS:
| No | Nama Tabel Fisik | Kategori Data | Sistem Asal / Sumber Data (*Source System*) | Dibuat / Dikelola di CRMS? | Deskripsi Fungsional Entitas Perbankan |
|:---:|---|:---:|---|:---:|---|
| **1** | `customers` | **Kategori A** (Replikasi Master) | **Customer Acquisition System (CAS / LOS)** & **Loan Management System (LMS / CBS)** | Dikelola via ETL Sync (Replikasi Read/Update) | Menyimpan master profil identitas debitur: CIF (*Customer Identification File*), NIK (di-masking UU PDP), nama lengkap, kontak ponsel/WhatsApp, email domisili, instansi pekerjaan (ASN Pemprov DKI / BUMD / Swasta), dan indikator nasabah prioritas (`is_vip`). |
| **2** | `agreements` | **Kategori A** (Replikasi Master) | **Loan Management System (LMS / CBS)** | Dikelola via ETL Sync (Replikasi Read/Update) | Menyimpan seluruh fasilitas rekening kredit aktif perbankan: No Kontrak, LOB (*KPR, KMK, KTA, KUR, CC*), plafon pembiayaan, kewajiban angsuran bulanan pokok+bunga, jangka waktu tenor, tenor terbayar, data agunan (SHM, SHGB, Fidusia), kode/nama cabang, dan pengelompokan portofolio (`combo_group`). |
| **3** | `pre_delinquency_accounts` | **Kategori B** (Generated Engine) | **CRMS Pre-Delinquency Engine** (Kombinasi LMS + API Saldo CASA Tabungan + Kalender Tukin ASN) | Dihasilkan Otomatis oleh CRMS | Memantau rekening berstatus DPD 0 pada jendela H-3 s.d H-0 sebelum jatuh tempo, mendeteksi ketidakcukupan saldo autodebet CASA tabungan, dan memicu pengingat ramah (*gentle reminder*) via WhatsApp. |
| **4** | `overdue_accounts` | **Kategori B** (Generated Engine) | **CRMS Data Transformer & Decision Engine** (Dipicu mutasi saldo tunggakan dari LMS) | Dihasilkan Otomatis oleh CRMS | Antrean kerja operasional utama penagihan: menghitung hari keterlambatan (*DPD*), nominal overdue, penentuan *Bucket* (1-3 s.d >150), scoring risiko multi-faktor (0–1000 poin), penetapan *Action Path* (Grade 1–8), penugasan PIC & kanal penanganan, serta pelacakan *Recovery Stage*. |
| **5** | `decision_rules` | **Kategori B** (Engine Config) | **CRMS Risk Management** | Dibuat & Dikelola di CRMS | Tabel konfigurasi matriks Decision Engine: memetakan kombinasi *Strategy Group* (*Champion/Challenger*), kategori risiko, dan bucket ke dalam *Action Path*, jenis penanganan (*Handling Type*), dan kriteria alokasi PIC. |
| **6** | `collection_activities` | **Kategori C** (Native Operational) | **CRMS Touchpoints** (Desk Collector, Field Officer mCollect, WhatsApp Bot, Smart IVR) | Dibuat Langsung di CRMS | Buku besar catatan penagihan (*Append-Only Audit Trail*): mencatat kronologis kontak, respon debitur, komitmen janji bayar (*Promise to Pay / PTP*), koordinat GPS kunjungan, dan berita acara negosiasi. |
| **7** | `collector_daily_plans` | **Kategori C** (Native Operational) | **CRMS Collector Workbench** (Petugas Lapangan) | Dibuat Langsung di CRMS | Rencana kunjungan kerja harian kolektor (*Today's Plan*): memuat urutan rute perjalanan (*Route Sequence*), estimasi waktu kedatangan, prioritas penagihan, status eksekusi (*PLANNED/VISITED/PTP/PAID*), dan catatan lapangan. |
| **8** | `collector_reassignment_logs` | **Kategori C** (Native Operational) | **CRMS Supervisory Module** (Supervisor / AR Head) | Dibuat Langsung di CRMS | Catatan audit trail pengalihan penugasan akun antar kolektor (*Reassign Collector*): merekam akun dipindahkan, kolektor asal, kolektor tujuan, alasan baku (*OVERLOAD/SICK_LEAVE/AREA_ROTATION*), dan supervisor penanggung jawab. |
| **9** | `collector_incentive_rules` | **Kategori C** (Native Operational) | **CRMS Incentive Administration** | Dibuat & Dikelola di CRMS | Parameter acuan matriks *Bucket Flow Rate Modifier* untuk perhitungan insentif berbasis CMS: rentang flow rate, status kinerja (Sangat Bagus s.d Sangat Buruk), dan faktor pengali bonus/pengurang penalti (1.2, 1.0, 0.8, 0.5). |
| **10** | `settlement_proposals` | **Kategori C** (Native Operational) | **CRMS Remedial & Restructuring** (Collector, Supervisor, Debitur) | Dibuat Langsung di CRMS | Mengelola usulan program kompromi / diskon pelunasan kredit bermasalah: jenis settlement (*Net Settlement / Charge-Wise*), diskon denda/bunga, nominal pelunasan netto, dan alur persetujuan bertingkat 6-stage (*Maker-Checker-Approver*). |
| **11** | `settlement_tranches` | **Kategori C** (Native Operational) | **CRMS Settlement Engine** | Dihasilkan & Dikelola di CRMS | Memecah jadwal pembayaran kompromi ke dalam 1 s.d 6 termin cicilan, memantau tanggal jatuh tempo termin, kanal setor (Virtual Account / QRIS / Tunai), dan status pelunasan per termin. |
| **12** | `skip_tracing_cases` | **Kategori C** (Native Operational) | **CRMS Skip Tracing Unit** (Remedial & Investigator) | Dibuat Langsung di CRMS | Mengelola investigasi pelacakan debitur yang hilang kontak (*unreachable*): penelusuran nomor telepon baru, alamat tempat kerja baru, koordinasi RT/RW kelurahan, dan histori penelusuran identitas. |
| **13** | `legal_cases` | **Kategori C** (Native Operational) | **CRMS Legal Department** (Litigation Officer) | Dibuat Langsung di CRMS | Mengelola 6 tahapan alur penegakan hukum perbankan (*Legal Recourse*): somasi tertulis, penunjukan kuasa hukum rekanan, legal drafting somasi/gugatan sederhana, persidangan Pengadilan Negeri, audit kepatuhan, hingga putusan/perdamaian. |
| **14** | `repossession_cases` | **Kategori C** (Native Operational) | **CRMS Asset Recovery Unit** (Remedial & Auction Specialist) | Dibuat Langsung di CRMS | Mengelola 8 tahapan eksekusi agunan dan lelang: penandaan agunan (*marking*), penarikan fisik agunan, penitipan di stockyard, penunjukan KJPP (*appraisal*), penetapan nilai pasar/likuidasi, registrasi lelang KPKNL, transaksi penjualan, hingga penyerahan aset. |
| **15** | `payment_receipt_slips` | **Kategori C** (Native Operational) | **CRMS mCollect Mobile Workbench** (Field Officer di Lapangan) | Dibuat Langsung di CRMS | Menerbitkan Kuitansi Pembayaran Digital Resmi (*Payment Information Slip / PIS*) saat kolektor menerima setoran tunai atau verifikasi transfer VA/QRIS di lapangan, lengkap dengan nomor slip seri unik, geotagging GPS, dan pengiriman otomatis via WhatsApp. |
| **16** | `collector_geo_locations` | **Kategori C** (Native Operational) | **CRMS Telemetry Ingestion Service** (Background GPS Smartphone mCollect) | Dibuat & Diperbarui di CRMS | Menyimpan status telemetri GPS *real-time* petugas lapangan: koordinat lintang/bujur terkini, radius akurasi, status operasional (*Visiting, In-Transit, Idle*), persentase baterai ponsel, dan indikator deteksi anomali waktu diam (> 120 menit). |
| **17** | `collector_route_points` | **Kategori C** (Native Operational) | **CRMS GeoTracker Service** | Dibuat Langsung di CRMS | Rekam jejak kronologis titik-titik koordinat rute perjalanan harian kolektor untuk keperluan pemutaran ulang rute animasi (*route playback*), audit efisiensi mobilitas, dan verifikasi kehadiran fisik di alamat debitur. |
| **18** | `collection_agencies` | **Kategori C** (Native Operational) | **CRMS Supervisory Module** (Head of Collection / AR Head) | Dibuat & Dikelola di CRMS | Mengelola administrasi agensi penagihan pihak ketiga (eksternal): pendaftaran mitra, legalitas kontrak PKS, nomor izin, jumlah tenaga penagih terafiliasi, kuota akun yang ditugaskan, persentase komisi, dan evaluasi *Recovery Rate* berbasis SLA. |
| **19** | `authority_delegations` | **Kategori C** (Native Operational) | **CRMS Supervisory Module** (AR Head / Pejabat Pemutus) | Dibuat & Dikelola di CRMS | Mengelola pendelegasian wewenang persetujuan (*approval limit delegation*) saat pejabat definitif berhalangan / cuti (*Out of Office / OOO*), mencakup identitas delegator, delegasi, tanggal masa berlaku, batas nominal limit wewenang, dan alasan pendelegasian. |
| **20** | `users` | **Kategori C** (Native Operational) | **CRMS Identity Management** (Admin Sistem / Integrasi SSO IAM Bank) | Dibuat & Dikelola di CRMS | Mengelola otentikasi akun pengguna CRMS, enkripsi kata sandi Bcrypt, hak akses berbasis peran (RBAC: `ADMIN`, `AR_HEAD`, `COLLECTOR`), status keaktifan akun, dan pencatatan waktu login terakhir. |
| **21** | `global_parameters` | **Kategori C** (Native Operational) | **CRMS System Administration** | Dibuat & Dikelola di CRMS | Menyimpan konfigurasi parameter dinamis institusi perbankan (`GENERAL_NAMA_PT`, `GENERAL_SIMBOL_PT`), ambang batas toleransi, SLA, dan pengaturan sistem tanpa melakukan *hardcoding* pada source code. |

---

### 12.3. Kebijakan & Strategi Pemrosesan ETL Data Eksternal serta Tata Kelola Data Inputan CRMS

Bagian ini menguraikan arsitektur tata kelola data (*Data Governance Architecture*), mekanisme sinkronisasi *Extract-Transform-Load* (ETL), serta aturan perlakuan data operasional penagihan sesuai regulasi ketat Otoritas Jasa Keuangan (OJK) dan UU Perlindungan Data Pribadi (PDP No. 27/2022).

#### 12.3.1. Kebijakan Refresh Data ETL Eksternal: Mengapa Bukan Truncate-and-Insert, Melainkan Incremental Upsert?

Dalam perancangan sistem perbankan skala enterprise, timbul pertanyaan mendasar: **Apakah tabel yang berasal dari sistem eksternal (seperti `customers` dan `agreements`) di-refresh setiap hari dengan cara me-truncate seluruh data lalu meng-insert ulang dari awal?**

> [!IMPORTANT]
> **JAWABAN ARSITEKTURAL TEGAS: TABEL OPERASIONAL CRMS TIDAK PERNAH DI-TRUNCATE SECARA PENUH PADA BASIS DATA OPERASIONAL.**
> Pendekatan yang wajib diterapkan adalah **Incremental Upsert (Merge on Unique Conflict Key)** yang dikombinasikan dengan arsitektur **Staging Layer Perantara**.

##### 1. Hambatan Integritas Referensial (Foreign Key Constraints):
* Tabel `customers` dan `agreements` merupakan **tabel induk (*parent tables*)** yang direferensikan secara langsung oleh hampir seluruh tabel operasional transaksional di CRMS, antara lain:
  - `collection_activities` mereferensikan `agreement_no`.
  - `payment_receipt_slips` mereferensikan `agreement_no` dan `customer_id`.
  - `settlement_proposals` dan `settlement_tranches` mereferensikan `agreement_no` dan `customer_id`.
  - `legal_cases` dan `repossession_cases` mereferensikan `agreement_no` dan `customer_id`.
  - `pre_delinquency_accounts` mereferensikan `agreement_no` dan `customer_id`.
* Jika perintah `TRUNCATE TABLE agreements` atau `TRUNCATE TABLE customers` dieksekusi pada PostgreSQL, mesin basis data akan **menolak keras dan mengembalikan pesan kesalahan fatal**:
  ```text
  ERROR: cannot truncate a table referenced in a foreign key constraint
  DETAIL: Table "collection_activities" references "agreements" via foreign key.
  ```
* Jika dipaksakan menggunakan opsi destruktif `TRUNCATE TABLE agreements CASCADE;`, maka PostgreSQL akan secara otomatis menghapus bersih seluruh baris pada tabel-tabel anak yang berelasi dengannya. Akibatnya: **Seluruh histori penagihan, kuitansi digital pembayaran yang sah (PIS), berkas perkara pengadilan, dan jejak audit perbankan bertahun-tahun akan MUSNAH TERHAPUS SECARA PERMANEN!** Tindakan ini merupakan pelanggaran berat standar audit sistem informasi perbankan.

##### 2. Kepatuhan Regulasi Audit Perbankan (POJK & UU PDP):
Berdasarkan regulasi POJK No. 11/POJK.03/2016 tentang Penerapan Manajemen Risiko dalam Penggunaan Teknologi Informasi oleh Bank Umum dan UU PDP No. 27/2022, data histori transaksi nasabah, komunikasi penagihan, dan dokumen hukum wajib dipertahankan secara utuh (*immutable audit trail*) dengan masa retensi minimal 5 hingga 10 tahun. Penghapusan data secara masal melalui truncate melanggar kepatuhan hukum perbankan.

##### 3. Mekanisme Standar yang Diimplementasikan: Incremental Upsert
CRMS menerapkan pola integrasi *idempotent* menggunakan sintaks **PostgreSQL `INSERT ... ON CONFLICT DO UPDATE`**:

```sql
-- Pola Sinkronisasi ETL Incremental Upsert pada agreements
INSERT INTO agreements (
    agreement_no, customer_id, lob, asset_brand, asset_model, 
    plate_no, total_financing, installment_amount, tenor_months, 
    paid_tenor_months, branch_code, branch_name, combo_group, 
    created_at, updated_at
)
VALUES (
    :agreement_no, :customer_id, :lob, :asset_brand, :asset_model,
    :plate_no, :total_financing, :installment_amount, :tenor_months,
    :paid_tenor_months, :branch_code, :branch_name, :combo_group,
    NOW(), NOW()
)
ON CONFLICT (agreement_no) DO UPDATE SET
    total_financing    = EXCLUDED.total_financing,
    installment_amount = EXCLUDED.installment_amount,
    paid_tenor_months  = EXCLUDED.paid_tenor_months,
    branch_code        = EXCLUDED.branch_code,
    branch_name        = EXCLUDED.branch_name,
    combo_group        = EXCLUDED.combo_group,
    updated_at         = NOW();
```

##### 4. Arsitektur Staging Area (Tempat Diperbolehkannya Truncate):
Proses ETL batch malam hari (*Nightly EOD Ingestion*) memisahkan lingkungan transfer data menjadi 2 lapisan:
1. **Staging Schema (`stg_*`)**: File data mentah dari Core Banking diimpor ke tabel penampungan sementara (`stg_customers`, `stg_agreements`). Tabel-tabel di lapisan staging ini **tidak memiliki foreign key ke tabel operasional CRMS**. Oleh karena itu, tabel staging **boleh di-truncate setiap malam** sebelum proses *extract* dimulai.
2. **Operational Schema (`public.*`)**: Setelah data pada staging dibersihkan (*data cleansing*), divalidasi tipe datanya, dan di-masking NIK-nya sesuai UU PDP, prosedur ETL menjalankan operasi *Upsert* dari tabel staging ke tabel operasional utama (`public.customers`, `public.agreements`).

##### 5. Penanganan Rekening yang Sudah Lunas (Paid Off / Closed):
Jika sebuah rekening pinjaman telah dilunasi di Core Banking, data rekening tersebut pada tabel `agreements` di CRMS **tidak dihapus secara fisik (*no physical hard delete*)**. Status rekening hanya diperbarui menjadi `PAID_OFF` / `CLOSED` pada tabel antrean `overdue_accounts`. Hal ini bertujuan agar histori pinjaman nasabah tetap dapat ditinjau kapan saja melalui modul **Customer 360° View**.

---

#### 12.3.2. Cakupan Data Transfer Eksternal: Mengapa Seluruh Fasilitas Kredit Aktif (Termasuk DPD 0 Lancar) Ditransfer ke CRMS?

Pertanyaan mendasar berikutnya: **Apakah seluruh data pinjaman dari Core Banking ditransfer secara komprehensif ke CRMS, termasuk pinjaman berstatus lancar yang belum overdue (DPD-0), atau hanya pinjaman yang sudah menunggak saja?**

> [!IMPORTANT]
> **JAWABAN ARSITEKTURAL TEGAS: YA, SELURUH FASILITAS KREDIT AKTIF (BAIK YANG BERSTATUS LANCAR DPD 0 MAUPUN MENUNGGAK DPD 1+) DITRANSFER DAN DISINKRONISASIKAN KE CRMS SECARA BERKALA.**

Alasan teknis dan bisnis perbankan di balik transfer menyeluruh ini meliputi:

##### 1. Kebutuhan Pre-Delinquency Management (PDM - DPD 0 Early Warning):
* Paradigma penagihan modern bertransformasi dari *reaktif pasif* menjadi **proaktif preventif**. CRMS dilengkapi modul PDM yang bertugas mengawasi fasilitas pinjaman pada rentang **H-3 s.d H-0 (DPD 0)** sebelum tanggal jatuh tempo angsuran.
* Modul PDM memerlukan data seluruh pinjaman lancar untuk:
  - Memeriksa kecukupan saldo autodebet rekening tabungan/CASA nasabah melalui API internal.
  - Memverifikasi kalender pencairan gaji dan rapel Tunjangan Kinerja Daerah (Tukin) ASN/PNS Pemprov DKI Jakarta (biasanya tanggal 25 s.d akhir bulan).
  - Mengirimkan pengingat ramah (*gentle reminder*) melalui WhatsApp otomatis sebelum timbul denda keterlambatan.
* Jika data fasilitas pinjaman DPD 0 tidak ditransfer ke CRMS, maka modul PDM akan mengalami *blind spot* (kebutaan informasi) dan tidak dapat menjalankan fungsi pencegahan kredit bermasalah.

##### 2. Tampilan Terpadu Nasabah (Unified Customer 360° View) & Liabilitas Lintas Fasilitas (*Cross-Facility Liability*):
* Karakteristik nasabah perbankan modern seringkali memiliki lebih dari satu fasilitas kredit secara simultan (misalnya: fasilitas KPR Griya, pinjaman modal kerja KMK, fasilitas multiguna KTA, dan Kartu Kredit).
* Apabila seorang nasabah menunggak pada fasilitas KTA (misalnya DPD 18), petugas penagih di CRMS **wajib mengetahui seluruh fasilitas lain yang dimiliki nasabah tersebut di bank**, meskipun fasilitas lainnya (seperti KPR) berstatus **LANCAR (DPD 0)**.
* **Manfaat Strategis:**
  - Kolektor dapat mengetahui total eksposur kewajiban nasabah di bank (*total exposure*).
  - Kolektor dapat memanfaatkan agunan sertifikat tanah (SHM/SHGB) pada fasilitas KPR yang lancar sebagai instrumen daya tawar dan negosiasi (*cross-collateral leverage*).
  - Mengantisipasi risiko *contagion default* (kegagalan bayar merambat dari satu produk tanpa agunan ke produk beragun properti).

##### 3. Pengawasan Risiko Gagal Bayar Dini (First Payment Default / FPD):
Seluruh fasilitas kredit baru yang baru saja dicairkan dari CAS ke LMS langsung dimonitor di CRMS pada angsuran ke-1 hingga ke-3 (*vintage analysis*). Fasilitas baru berstatus DPD 0 yang menunjukkan tanda-tanda saldo autodebet kosong langsung diberi flag peringatan dini guna mendeteksi potensi *origination fraud* atau penurunan likuiditas nasabah.

##### 4. Data yang Dikecualikan dari Transfer Rutin (Out of Scope):
Untuk menjaga efisiensi kapasitas disk penyimpanan dan kecepatan pembacaan indeks query basis data, sistem mengecualikan:
- Rekening kredit yang telah lunas tuntas bertahun-tahun sebelumnya (*historical archived contracts*). Data ini disimpan di Data Warehouse / Data Lake bank dan hanya ditarik via on-demand API jika diperlukan.
- Aplikasi kredit yang dibatalkan (*cancelled*) atau ditolak (*rejected*) pada tahap Customer Acquisition (CAS).

---

#### 12.3.3. Tata Kelola & Proteksi Data Inputan Operasional CRMS (Treatment of Native Data)

Tabel-tabel operasional yang datanya diinputkan langsung oleh pengguna atau dihasilkan oleh aktivitas sistem di CRMS (**Kategori C**) memiliki tata kelola (*data treatment*) khusus dengan prinsip keamanan tingkat tinggi:

```mermaid
flowchart TD
    subgraph TREAT["TATA KELOLA DATA INPUTAN OPERASIONAL CRMS (5 PRINSIP UTAMA)"]
        direction TB
        P1["1. Immutability & Append-Only<br/>(Histori Aktivitas, Kuitansi PIS & GPS Permanen)"]
        P2["2. Dual-Control & State Machine<br/>(6-Stage Settlement, Litigasi Hukum & Lelang)"]
        P3["3. Isolasi dari Timpaan Batch ETL<br/>(ETL Malam Hari Tidak Menimpa Catatan Kolektor & PTP)"]
        P4["4. Real-Time Reverse Webhook Sync<br/>(Setoran Lapangan Langsung Memotong Saldo Core Banking)"]
        P5["5. Partisi & Siklus Retensi Regulasi<br/>(Telemetri GPS 90 Hari, Rekam Audit Finansial 5-10 Tahun)"]
    end
```

##### 1. Prinsip Append-Only & Immutability (Buku Besar Tanpa Ubah/Hapus):
* Seluruh pencatatan pada tabel `collection_activities` dan `payment_receipt_slips` bersifat **abadi dan tidak dapat diubah maupun dihapus (*immutable records*)**.
* Tidak disediakan query `UPDATE` maupun `DELETE` pada level API untuk tabel log aktivitas. Setiap interaksi kolektor (telepon, kunjungan, pengiriman pesan bot) dicatat sebagai baris data baru lengkap dengan identitas petugas (`performed_by`), stempel waktu server yang tidak dapat dimanipulasi (*tamper-proof timestamp*), dan koordinat GPS.
* Bukti pembayaran kuitansi digital PIS (`payment_receipt_slips`) memiliki nomor seri slip acak yang unik dan tercatat secara permanen untuk mencegah manipulasi setoran tunai oleh oknum kolektor (*anti-fraud embezzlement*).

##### 2. Validasi Alur Kerja Mesin Status (*State Machine*) & Persetujuan Berjenjang (*Dual-Control*):
* Transaksi bernilai finansial dan proses hukum tidak dapat diubah statusnya secara sepihak oleh seorang operator, melainkan diatur oleh *State Machine* dengan matriks batas wewenang:
  - **Settlement 6-Stage**: Proposal kompromi diskon pelunasan wajib melalui tahapan berurutan: *Initiate -> Schedule -> Plan -> Recommend & Approval -> Payment Tracking -> Closure*. Persetujuan diskon di atas plafon tertentu wajib ditandatangani oleh pejabat dengan level kewenangan yang sesuai (Collector < Rp 5 jt, BM < Rp 25 jt, AR Head < Rp 100 jt, Direksi > Rp 100 jt).
  - **Litigasi & Lelang**: Perubahan tahapan perkara hukum (`legal_cases`) dan eksekusi agunan (`repossession_cases`) wajib disertai lampiran nomor surat somasi resmi, akta risalah lelang KPKNL, atau laporan penilaian dari Lembaga Penilai Independen (KJPP).

##### 3. Isolasi Mutlak dari Proses Batch ETL (Non-Destructive Overwrite Policy):
* Proses batch sinkronisasi ETL malam hari dari LMS/Core Banking **didesain secara ketat hanya memperbarui data saldo pokok, denda sistem, dan tenor** pada tabel master `agreements` dan antrean `overdue_accounts`.
* Proses ETL **TIDAK AKAN PERNAH menimpa, menghapus, atau mereset data inputan operasional kolektor**, antara lain:
  - Kolom catatan berita acara dan negosiasi (`notes`).
  - Kolom janji bayar debitur (`ptp_date`, `ptp_amount`).
  - Penugasan PIC yang telah diatur secara khusus oleh Supervisor / AR Head.
  - Berkas pengajuan settlement yang sedang menunggu persetujuan komite kredit.

##### 4. Real-Time Reverse Webhook ke Core Banking (Takeout Task Automation):
* Ketika seorang kolektor lapangan menerima setoran pembayaran melalui aplikasi mobile mCollect dan mencatatkannya pada tabel `payment_receipt_slips`, sistem CRMS secara instan menembakkan *HTTP Webhook event* ke endpoint pembayaran Core Banking / Payment Gateway (Virtual Account BI-FAST).
* Begitu Core Banking memvalidasi pembukuan saldo masuk, sistem secara otomatis mengeksekusi **Takeout Task** dalam hitungan kurang dari 5 menit:
  - Mengubah status akun di `overdue_accounts` menjadi `PAID`.
  - Mencabut akun dari daftar kunjungan harian kolektor lapangan secara *real-time*.
  - Menghindarkan risiko penagihan berulang yang memalukan nasabah yang telah melunasi kewajibannya (*post-payment disturbance mitigation*).

##### 5. Partisi Data & Siklus Retensi Regulasi (Data Retention Lifecycle):
* **Data Telemetri Geografis Berfrekuensi Tinggi**: Tabel `collector_geo_locations` dan `collector_route_points` menghasilkan volume jutaan titik koordinat GPS setiap bulannya. Data ini disimpan secara aktif pada tabel utama selama **90 hari kalender** untuk keperluan pemutaran ulang rute dan evaluasi produktivitas. Setelah 90 hari, data dipindahkan secara otomatis ke tabel partisi arsip (*archival partition*) agar ukuran basis data operasional tetap ramping dan performa indeks query tetap prima.
* **Data Transaksional & Audit Trail Finansial**: Data nasabah, kontrak kredit, log penagihan, kuitansi bayar, dan berkas perkara hukum disimpan secara permanen di basis data selama fasilitas kredit aktif ditambah **minimal 5 tahun (dan hingga 10 tahun)** pasca penyelesaian kredit, memenuhi ketentuan POJK Manajemen Risiko TI Perbankan dan UU PDP.

---

### 12.4. Entity Relationship Model (ERD) Enterprise & Kamus Data Tabel Fisik

Diagram Entity Relationship Model (ERD) enterprise di bawah ini menggambarkan arsitektur relasional komprehensif yang menghubungkan seluruh 21 tabel pada basis data `crms_db`:

```mermaid
erDiagram
    CUSTOMERS ||--o{ AGREEMENTS : "memiliki 1..n rekening"
    CUSTOMERS ||--o{ PRE_DELINQUENCY_ACCOUNTS : "pengawasan DPD 0"
    CUSTOMERS ||--o{ SETTLEMENT_PROPOSALS : "mengajukan kompromi"
    CUSTOMERS ||--o{ SKIP_TRACING_CASES : "pelacakan kontak"
    CUSTOMERS ||--o{ LEGAL_CASES : "perkara perdata"
    CUSTOMERS ||--o{ REPOSSESSION_CASES : "eksekusi agunan"
    CUSTOMERS ||--o{ PAYMENT_RECEIPT_SLIPS : "penerima kuitansi"

    AGREEMENTS ||--|| OVERDUE_ACCOUNTS : "memantau DPD 1+"
    AGREEMENTS ||--o{ PRE_DELINQUENCY_ACCOUNTS : "relasi rekening"
    AGREEMENTS ||--o{ COLLECTION_ACTIVITIES : "riwayat log interaksi"
    AGREEMENTS ||--o{ SETTLEMENT_PROPOSALS : "rekening settlement"
    AGREEMENTS ||--o{ LEGAL_CASES : "objek gugatan"
    AGREEMENTS ||--o{ REPOSSESSION_CASES : "objek lelang"
    AGREEMENTS ||--o{ PAYMENT_RECEIPT_SLIPS : "pembayaran angsuran"

    OVERDUE_ACCOUNTS ||--o{ COLLECTION_ACTIVITIES : "mencatat aktivitas"
    OVERDUE_ACCOUNTS ||--o{ COLLECTOR_DAILY_PLANS : "tugas kunjungan harian"
    OVERDUE_ACCOUNTS ||--o{ COLLECTOR_REASSIGNMENT_LOGS : "riwayat reassign akun"
    
    SETTLEMENT_PROPOSALS ||--o{ SETTLEMENT_TRANCHES : "memiliki 1..6 termin"
    
    COLLECTION_AGENCIES ||--o{ OVERDUE_ACCOUNTS : "alokasi agensi eksternal"

    COLLECTOR_GEO_LOCATIONS ||--o{ COLLECTOR_ROUTE_POINTS : "titik rute harian"

    USERS ||--o{ COLLECTION_ACTIVITIES : "petugas pelaksana"
    USERS ||--o{ AUTHORITY_DELEGATIONS : "delegator & penerima wewenang"
    USERS ||--o{ COLLECTOR_DAILY_PLANS : "petugas rute harian"
    USERS ||--o{ COLLECTOR_REASSIGNMENT_LOGS : "kolektor asal / baru / reassigner"
    USERS ||--o{ COLLECTOR_INCENTIVE_RULES : "dikelola administrator"

    GLOBAL_PARAMETERS {
        bigserial id PK
        varchar param_key UK
        text param_value
        varchar description
    }

    USERS {
        bigserial id PK
        varchar username UK
        varchar password "Bcrypt Hash"
        varchar full_name
        varchar email
        varchar role "ADMIN, AR_HEAD, COLLECTOR"
        boolean is_active
        timestamptz last_login
    }

    CUSTOMERS {
        bigserial id PK
        varchar customer_no UK "Nomor CIF Debitur"
        varchar name "Nama Lengkap Debitur"
        varchar phone "Nomor Telepon / WA (Masked)"
        varchar email "Email Domisili"
        text address "Alamat KTP (Masked)"
        varchar city "Kota Domisili"
        varchar occupation "Instansi / PNS Pemprov DKI"
        boolean is_vip "Flag Nasabah Prioritas"
    }

    AGREEMENTS {
        bigserial id PK
        varchar agreement_no UK "Nomor Rekening Pinjaman"
        bigint customer_id FK
        varchar lob "KPR, KMK, KTA, KUR, CC"
        varchar asset_brand "Tipe Agunan (SHM, SHGB, Fidusia)"
        varchar asset_model "Spesifikasi Jaminan"
        varchar plate_no "No Sertifikat Tanah / BPKB"
        numeric total_financing "Plafon Pinjaman"
        numeric installment_amount "Angsuran Bulanan"
        int tenor_months "Tenor Total"
        int paid_tenor_months "Tenor Berjalan"
        varchar branch_code "Kode Cabang"
        varchar branch_name "Nama Cabang"
        varchar combo_group "COMBO_1_PROPERTY, COMBO_2_UNSECURED"
    }

    OVERDUE_ACCOUNTS {
        bigserial id PK
        varchar agreement_no UK FK
        int dpd "Days Past Due"
        numeric overdue_amount "Nilai Tunggakan"
        varchar current_bucket "1-3, 4-7, ... >150"
        int risk_score "Skor Risiko (0-1000)"
        varchar risk_level "LOW, MEDIUM, HIGH, VIP"
        varchar strategy_group "CHAMPION, CHALLENGER, VIP"
        varchar action_path "1 s/d 8, VIP"
        varchar assigned_pic "Petugas / Kanal PIC"
        varchar pic_channel "AUTOMATION, HEAD_OFFICE, BRANCH, REMEDIAL"
        varchar status "OPEN, PROMISE_TO_PAY, PAID"
        varchar recovery_stage "STAGE_COLLECTION s/d STAGE_CLOSED"
        varchar recommended_channel "WA, ROBO, DESK, FIELD"
        numeric cost_efficiency_rate "Tingkat Efisiensi Biaya"
        timestamptz ptp_date "Tanggal Janji Bayar"
        numeric ptp_amount "Nominal Janji Bayar"
    }

    COLLECTION_ACTIVITIES {
        bigserial id PK
        bigint overdue_account_id FK
        varchar agreement_no FK
        varchar channel_type "WA, ROBO, DC, FC, SFC, REMEDIAL"
        varchar performed_by "Username Petugas / Sistem"
        varchar contact_status "CONTACTED, UNREACHABLE, PTP_MADE, PAID"
        varchar result_code "Hasil Interaksi"
        timestamptz ptp_date "Tanggal Komitmen Bayar"
        numeric ptp_amount "Nominal Janji Bayar"
        numeric geo_lat "Latitude GPS Kunjungan"
        numeric geo_lng "Longitude GPS Kunjungan"
        text notes "Berita Acara Negosiasi"
        timestamptz created_at "Audit Timestamp Server"
    }

    PRE_DELINQUENCY_ACCOUNTS {
        bigserial id PK
        varchar agreement_no FK
        bigint customer_id FK
        timestamptz due_date "Jatuh Tempo Angsuran"
        numeric installment_amount "Kewajiban Angsuran"
        numeric casa_balance "Saldo Rekening Tabungan Autodebet"
        int salary_date "Tanggal Siklus Payroll / Tukin"
        varchar pdm_trigger_reason "INSUFFICIENT_CASA, SALARY_DELAY"
        varchar reminder_status "PENDING, WA_SENT, CURED"
    }

    SETTLEMENT_PROPOSALS {
        bigserial id PK
        varchar proposal_no UK
        varchar agreement_no FK
        bigint customer_id FK
        varchar settlement_stage "STAGE_INITIATE s/d STAGE_CLOSURE"
        varchar settlement_type "NET_SETTLEMENT, CHARGE_WISE"
        numeric original_overdue "Total Tunggakan Awal"
        numeric waived_penalty "Diskon Denda"
        numeric waived_interest "Diskon Bunga"
        numeric net_settlement_amount "Nominal Bayar Netto"
        varchar approval_status "PENDING, RECOMMENDED, APPROVED, REJECTED"
        varchar recommendation_tier "COLLECTOR, BM, AR_HEAD, DIRECTOR"
        int total_tranches "Jumlah Termin (1-6)"
    }

    SETTLEMENT_TRANCHES {
        bigserial id PK
        bigint settlement_proposal_id FK
        int tranche_no "Termin Ke-N"
        timestamptz due_date "Jatuh Tempo Termin"
        numeric amount "Nominal Termin"
        string payment_method "ONLINE_VA, QRIS, CASH"
        string payment_status "PENDING, PAID, OVERDUE"
        string receipt_no "Nomor Kuitansi PIS"
    }

    LEGAL_CASES {
        bigserial id PK
        varchar case_no UK
        varchar agreement_no FK
        bigint customer_id FK
        varchar legal_stage "6 Tahapan Litigasi"
        varchar lawyer_name "Kuasa Hukum"
        varchar law_firm "Kantor Advokat Rekanan"
        varchar court_name "Pengadilan Negeri"
        numeric claim_amount "Nilai Gugatan"
        varchar status "ACTIVE, WON, SETTLED"
    }

    REPOSSESSION_CASES {
        bigserial id PK
        varchar repo_no UK
        varchar agreement_no FK
        bigint customer_id FK
        varchar repo_stage "8 Tahapan Repo & Lelang"
        varchar asset_type "PROPERTI_SHM, FIDUSIA"
        varchar stockyard_location "Lokasi Penyimpanan"
        numeric market_value "Nilai Pasar Wajar KJPP"
        numeric liquidation_value "Nilai Likuidasi KJPP"
        numeric highest_bid_amount "Penawaran Lelang KPKNL"
        varchar status "IN_REPO, SOLD, RELEASED"
    }

    SKIP_TRACING_CASES {
        bigserial id PK
        varchar case_no UK
        varchar agreement_no FK
        bigint customer_id FK
        varchar tracer_pic "Petugas Pelacak"
        varchar tracing_status "INITIATED, IN_PROGRESS, FOUND, UNTRACEABLE"
        varchar new_phone "Nomor Kontak Baru Ditemukan"
        text new_address "Alamat Baru Terverifikasi"
        varchar source_info "DUKCAPIL, CASA, RT_RW, SURVEY"
    }

    PAYMENT_RECEIPT_SLIPS {
        bigserial id PK
        varchar receipt_no UK "Nomor Seri Kuitansi Digital PIS"
        varchar agreement_no FK
        bigint customer_id FK
        numeric amount_paid "Nominal Disetor"
        varchar payment_method "CASH, QRIS, ONLINE_VA"
        int tranche_number "Termin Bayar"
        varchar collector_username "Kolektor Penerima"
        boolean whatsapp_sent "Status Kirim WA Kuitansi"
        numeric geotag_lat "Latitude Geotagging"
        numeric geotag_lng "Longitude Geotagging"
        timestamptz issued_at "Waktu Penerbitan Slip"
    }

    COLLECTOR_GEO_LOCATIONS {
        bigserial id PK
        varchar collector_username UK
        varchar collector_name
        varchar agency_name "Agensi Rekanan / Internal"
        numeric current_lat "Latitude Terkini"
        numeric current_lng "Longitude Terkini"
        numeric accuracy_meters "Akurasi GPS (Meter)"
        varchar status "VISITING, IN_TRANSIT, IDLE"
        timestamptz last_heartbeat "Ping GPS Terakhir"
        int today_visits_count "Kunjungan Hari Ini"
        int today_idle_minutes "Total Waktu Diam"
        boolean anomaly_flag "Indikasi Anomali / GPS Palsu"
        int battery_pct "Sisa Daya Baterai"
    }

    COLLECTOR_ROUTE_POINTS {
        bigserial id PK
        varchar collector_username FK
        int sequence_order "Urutan Titik Rute"
        numeric lat "Latitude"
        numeric lng "Longitude"
        varchar activity_type "CHECKIN, PAYMENT, RTS, PTP, IDLE"
        varchar agreement_no
        timestamptz recorded_at "Waktu Rekam Titik"
        numeric speed_kmh "Kecepatan Bergerak"
    }

    COLLECTION_AGENCIES {
        bigserial id PK
        varchar agency_code UK
        varchar agency_name "Nama Agensi Pihak Ketiga"
        varchar contract_no "Nomor Kontrak PKS"
        timestamptz license_expiry "Masa Berlaku Izin"
        int active_collectors_count "Jumlah Petugas Aktif"
        numeric recovery_rate "Persentase Pemulihan Tagihan (%)"
        numeric commission_rate "Komisi Agensi (%)"
        varchar status "ACTIVE, SUSPENDED"
    }

    AUTHORITY_DELEGATIONS {
        bigserial id PK
        varchar delegator_username
        varchar delegate_username
        timestamptz start_date "Mulai Pendelegasian"
        timestamptz end_date "Selesai Pendelegasian"
        numeric approval_limit_amount "Batas Wewenang Nominal"
        varchar reason "Alasan Cuti / Dinas Luar"
        boolean is_active "Status Keaktifan OOO"
    }

    COLLECTOR_DAILY_PLANS {
        bigserial id PK
        varchar collector_username FK "Username Petugas Kolektor"
        bigint overdue_account_id FK "ID Antrean Overdue"
        varchar agreement_no FK "Nomor Rekening Kredit"
        date plan_date "Tanggal Rencana Kunjungan"
        int route_order "Nomor Urut Prioritas Rute"
        time estimated_time "Estimasi Jam Tiba"
        numeric target_amount "Target Penagihan (Rp)"
        numeric collected_amount "Realisasi Penerimaan (Rp)"
        varchar status "PLANNED, IN_PROGRESS, VISITED, CANCELLED"
        text visit_notes "Catatan Kunjungan Petugas"
        timestamptz visited_at "Waktu Penyelesaian Kunjungan"
    }

    COLLECTOR_REASSIGNMENT_LOGS {
        bigserial id PK
        bigint overdue_account_id FK "ID Antrean Overdue"
        varchar agreement_no FK "Nomor Rekening Kredit"
        varchar from_collector_username FK "Kolektor Asal"
        varchar to_collector_username FK "Kolektor Tujuan"
        varchar reassigned_by FK "Supervisor / AR Head"
        varchar reason_code "OVERLOAD, SICK_LEAVE, AREA_ROTATION, PERFORMANCE_ESCALATION, OTHER"
        text notes "Catatan Alasan Pengalihan"
        timestamptz created_at "Waktu Pengalihan Tugas"
    }

    COLLECTOR_INCENTIVE_RULES {
        bigserial id PK
        varchar rule_name "Nama Aturan Insentif"
        numeric base_incentive "Insentif Dasar (Rp)"
        numeric target_collection_rate "Target Collection Rate (%)"
        numeric flow_rate_min "Batas Minimal Flow Rate (%)"
        numeric flow_rate_max "Batas Maksimal Flow Rate (%)"
        numeric modifier "Faktor Pengali (Modifier)"
        text notes "Keterangan Kategori Kinerja"
        boolean is_active "Status Keaktifan Aturan"
    }
```

---

### 12.5. Spesifikasi REST API v1 Terintegrasi

Backend CRMS mengimplementasikan 35+ endpoint RESTful API terstandarisasi yang mendukung operasi penagihan omnichannel, *decisioning*, administrasi, dan integrasi eksternal:

| Kelompok Modul | Method | Endpoint URI | Deskripsi Fungsi Operasional | Parameter / Payload Request |
|---|:---:|---|---|---|
| **System & Health** | `GET` | `/health` | Pemeriksaan kesehatan service dan parameter bank | Respons status server, DB connection, waktu server |
| **Authentication** | `POST` | `/api/v1/auth/login` | Otentikasi pengguna & penerbitan token sesi JWT | `{"username": "...", "password": "..."}` |
| **Authentication** | `GET` | `/api/v1/auth/me` | Validasi sesi aktif, identitas, dan peran pengguna (RBAC) | Header: `Authorization: Bearer <token>` |
| **Authentication** | `POST` | `/api/v1/auth/logout` | Mengakhiri sesi login pengguna secara aman | Header: `Authorization: Bearer <token>` |
| **User Management** | `GET` | `/api/v1/users` | Mengambil daftar seluruh pengguna terdaftar di CRMS | Filter query: `role`, `is_active` |
| **Dashboard KPI** | `GET` | `/api/v1/dashboard/summary` | Ringkasan metrik eksekutif, cure rate, roll rate & matriks Action Path | Agregasi total overdue, total akun, filter LOB |
| **Overdue Worklist** | `GET` | `/api/v1/overdue-accounts` | Antrean penagihan dengan filter multi-parameter | Query: `bucket`, `action_path`, `assigned_pic`, `status`, `recovery_stage`, `search` |
| **Overdue Worklist** | `GET` | `/api/v1/overdue-accounts/:id` | Detail komprehensif satu akun tertunggak | Path Param: ID Akun |
| **Overdue Worklist** | `POST` | `/api/v1/overdue-accounts/:id/reevaluate` | Memicu simulasi evaluasi ulang Decision Engine secara dinamis | `{"is_champion": true/false}` |
| **Overdue Worklist** | `PUT` | `/api/v1/overdue-accounts/:id/status` | Pembaharuan status penagihan, komitmen janji bayar (PTP), atau catatan | `{"status": "PROMISE_TO_PAY", "ptp_date": "...", "ptp_amount": ..., "notes": "..."}` |
| **Customer 360°** | `GET` | `/api/v1/customers/:id/exposure-360` | Tampilan terpadu Customer 360° lintas fasilitas (lancar vs overdue), agunan, dan skrip dialog | Path Param: ID Nasabah (`customer_id`) |
| **Customer 360°** | `PUT` | `/api/v1/customers/:id/phone` | Pembaruan nomor kontak telepon/WA nasabah terverifikasi | `{"phone": "0812xxxxxxxx"}` |
| **Omnichannel WA** | `POST` | `/api/v1/customers/:id/send-whatsapp` | Pengiriman pesan notifikasi penagihan tertarget via gateway WhatsApp | `{"template_type": "REMINDER_1", "notes": "..."}` |
| **Recovery Lifecycle** | `PUT` | `/api/v1/overdue-accounts/:id/recovery-stage` | Perubahan tahapan siklus pemulihan lanjutan (Skip Tracing, Somasi, Litigasi, Settlement) | `{"recovery_stage": "STAGE_RESTRUCTURING", "reason": "...", "notes": "..."}` |
| **Activity Trail** | `POST` | `/api/v1/activities` | Pencatatan rekam jejak aktivitas penagihan (Audit Trail Permanen) | `channel_type`, `contact_status`, `result_code`, `ptp_date`, `ptp_amount`, `notes` |
| **Activity Trail** | `GET` | `/api/v1/activities/agreement/:agreement_no` | Riwayat kronologis seluruh interaksi penagihan pada nomor kontrak | Path Param: `agreement_no` |
| **Pre-Delinquency** | `GET` | `/api/v1/pdm/accounts` | Antrean pengawasan rekening sebelum jatuh tempo (DPD 0 H-3..H-0) | Filter: `trigger_reason`, `reminder_status` |
| **Pre-Delinquency** | `POST` | `/api/v1/pdm/:id/send-reminder` | Pengiriman pengingat dini ramah (*gentle reminder*) via WhatsApp | Path Param: ID PDM Account |
| **Legal Recourse** | `GET` | `/api/v1/legal/cases` | Daftar seluruh perkara hukum perbankan dalam penanganan | Filter: `legal_stage`, `law_firm`, `status` |
| **Legal Recourse** | `PUT` | `/api/v1/legal/cases/:id/stage` | Pembaruan tahapan alur litigasi pengadilan (6 Stages) | `{"legal_stage": "STAGE_PROCEEDINGS", "court_name": "...", "hearing_date": "..."}` |
| **Asset Repo & Auction** | `GET` | `/api/v1/repo/cases` | Daftar perkara eksekusi agunan dan lelang KPKNL (8 Stages) | Filter: `repo_stage`, `asset_type`, `status` |
| **Asset Repo & Auction** | `PUT` | `/api/v1/repo/cases/:id/stage` | Pembaruan tahapan penyitaan, penilaian KJPP, dan risalah lelang | `{"repo_stage": "STAGE_AUCTION", "market_value": ..., "liquidation_value": ...}` |
| **Settlement Lifecycle**| `GET` | `/api/v1/settlement/proposals` | Daftar usulan program kompromi / diskon pelunasan (6 Stages) | Filter: `settlement_stage`, `approval_status` |
| **Settlement Lifecycle**| `POST` | `/api/v1/settlement/proposals` | Pengajuan proposal kompromi pelunasan diskon denda/bunga baru | `agreement_no`, `waived_penalty`, `waived_interest`, `net_amount`, `total_tranches` |
| **Settlement Lifecycle**| `PUT` | `/api/v1/settlement/proposals/:id/stage` | Pembaruan tahapan alur proposal settlement (*state machine*) | `{"settlement_stage": "STAGE_PLAN", "notes": "..."}` |
| **Settlement Tranches** | `POST` | `/api/v1/settlement/proposals/:id/tranches` | Penyusunan jadwal termin cicilan settlement (1 s.d 6 termin) | `[{"tranche_no": 1, "due_date": "...", "amount": ...}]` |
| **Settlement Tranches** | `POST` | `/api/v1/settlement/tranches/:id/pay` | Pencatatan realisasi setoran termin settlement | `{"payment_method": "ONLINE_VA", "paid_amount": ...}` |
| **Settlement Approval** | `POST` | `/api/v1/settlement/proposals/:id/recommend` | Rekomendasi proposal settlement ke level persetujuan di atasnya | `{"recommend_to": "AR_HEAD", "notes": "..."}` |
| **Settlement Approval** | `PUT` | `/api/v1/settlement/proposals/:id/action` | Keputusan persetujuan / penolakan (*Approve / Reject / Send Back*) | `{"action": "APPROVE", "notes": "Disetujui komite"}` |
| **Skip Tracing** | `GET` | `/api/v1/skip-tracing/cases` | Daftar kasus investigasi pelacakan debitur hilang kontak | Filter: `tracing_status`, `tracer_pic` |
| **Skip Tracing** | `PUT` | `/api/v1/skip-tracing/cases/:id/feedback` | Input umpan balik kontak atau domisili baru yang ditemukan | `{"tracing_status": "FOUND", "new_phone": "...", "new_address": "..."}` |
| **GeoTracker Telemetry**| `GET` | `/api/v1/geotracker/collectors` | Pemantauan posisi GPS live seluruh armada kolektor DKI Jakarta | Menampilkan koordinat, status, baterai, idle alert |
| **GeoTracker Telemetry**| `GET` | `/api/v1/geotracker/collectors/:username/route` | Histori titik rute perjalanan harian untuk pemutaran animasi (*playback*) | Path Param: `username` |
| **GeoTracker Telemetry**| `POST` | `/api/v1/geotracker/ping` | Penerimaan heartbeat GPS background dari aplikasi smartphone mCollect | `{"lat": -6.2088, "lng": 106.8456, "status": "VISITING", "battery": 92}` |
| **mCollect Workbench** | `GET` | `/api/v1/mcollect/accounts` | Antrean penugasan kunjungan lapangan kolektor mCollect | Filter otomatis wilayah cabang & status kunjungan |
| **mCollect Payments** | `POST` | `/api/v1/mcollect/record-payment` | Perekaman setoran bayar tunai/transfer, pembuatan kuitansi digital PIS | `agreement_no`, `amount_paid`, `payment_method`, `geotag_lat`, `geotag_lng` |
| **mCollect Payments** | `POST` | `/api/v1/mcollect/request-payment-link` | Pembuatan tautan pembayaran mandiri online (VA BI-FAST / QRIS) | `{"agreement_no": "...", "amount": ...}` |
| **mCollect Receipts** | `GET` | `/api/v1/mcollect/receipts` | Daftar seluruh bukti kuitansi pembayaran resmi (PIS) | Filter: `collector_username`, `date` |
| **mCollect Receipts** | `POST` | `/api/v1/mcollect/receipts/:id/send-whatsapp` | Pengiriman ulang kuitansi digital resmi (PIS) ke nomor WhatsApp debitur | Path Param: ID Kuitansi (`receipt_id`) |
| **Foreclosure Payoff** | `POST` | `/api/v1/mcollect/foreclosure-simulate` | Simulasi perhitungan pelunasan dipercepat metode bunga menurun (*Rule 78*) | `{"agreement_no": "...", "penalty_rate": 0.02}` |
| **External Agency** | `GET` | `/api/v1/agencies` | Daftar rekanan agensi penagihan eksternal dan evaluasi SLA | Filter: `status` (`ACTIVE`/`SUSPENDED`) |
| **External Agency** | `POST` | `/api/v1/agencies` | Pendaftaran mitra agensi penagihan pihak ketiga baru | `agency_code`, `agency_name`, `contract_no`, `commission_rate` |
| **Supervisory & OOO** | `GET` | `/api/v1/delegations` | Daftar pendelegasian wewenang aktif (*Out of Office*) | Filter status aktif |
| **Supervisory & OOO** | `POST` | `/api/v1/delegations` | Penetapan pendelegasian batas wewenang persetujuan sementara | `delegate_username`, `start_date`, `end_date`, `limit_amount`, `reason` |
| **Supervisory & OOO** | `DELETE` | `/api/v1/delegations/:id` | Pencabutan lebih awal wewenang pendelegasian pejabat pengganti | Path Param: ID Pendelegasian |
| **Capacity Planning** | `GET` | `/api/v1/capacity-planning` | Analisis kapasitas beban kerja harian kolektor (Round-Robin Optimization) | Menampilkan akun assigned, status overload/optimal |
| **Batch Simulator** | `POST` | `/api/v1/confins/eod-sync` | Simulasi sinkronisasi batch harian End of Day (EOD) | `{"increment_days": 1, "auto_cure_ratio": 0.08}` |
| **Batch Simulator** | `POST` | `/api/v1/confins/simulate-payment` | Simulasi pembayaran masuk (memotong saldo & memicu Takeout Task) | `{"agreement_no": "...", "amount": 5000000}` |
| **Batch Simulator** | `POST` | `/api/v1/confins/reset-demo` | Mengembalikan kondisi basis data ke seeder awal portofolio bank | Tanpa payload |
| **VIP Desk** | `GET` | `/api/v1/vip/accounts` | Portofolio debitur VIP khusus di bawah kendali eksklusif AR Head | Filter otomatis `action_path = 'VIP'` |
| **VIP Desk** | `POST` | `/api/v1/vip/accounts/:agreement_no/action` | Penerapan instruksi perlakuan khusus nasabah prioritas oleh AR Head | `action_plan`, `assigned_specialist`, `notes`, `ptp_date` |
| **Collector Tasks** | `GET` | `/api/v1/collector/tasks` | Mengambil seluruh antrean task yang ditugaskan ke kolektor | Filter query: `search`, `bucket` |
| **Collector Daily Plan** | `GET` | `/api/v1/collector/today-plan` | Mengambil daftar tugas yang dipilih untuk dikerjakan hari ini (Today's Plan) | Filter query: `date` |
| **Collector Daily Plan** | `POST` | `/api/v1/collector/today-plan` | Menambahkan single task ke Today's Plan kolektor | `{"overdue_account_id": ..., "plan_date": "...", "route_order": ..., "target_amount": ...}` |
| **Collector Daily Plan** | `POST` | `/api/v1/collector/today-plan/bulk` | Menambahkan multi-task sekaligus ke Today's Plan | `{"task_ids": [1, 2, ...], "plan_date": "..."}` |
| **Collector Daily Plan** | `PUT` | `/api/v1/collector/today-plan/:id/status` | Memperbarui status kunjungan Today's Plan (`VISITED`, `CANCELLED`) | `{"status": "VISITED", "collected_amount": ..., "notes": "..."}` |
| **Collector Daily Plan** | `DELETE` | `/api/v1/collector/today-plan/:id` | Menghapus item dari Today's Plan | Path Param: ID Plan |
| **Collector Reassignment** | `POST` | `/api/v1/collector/reassign` | Mengalihkan tugas penagihan antar kolektor (Single/Bulk) dengan audit log | `{"task_ids": [...], "to_collector_username": "...", "reason_code": "...", "notes": "..."}` |
| **Collector Reassignment** | `GET` | `/api/v1/collector/reassignments` | Mengambil log riwayat pengalihan tugas kolektor (Audit Trail) | Filter: `from_collector`, `to_collector` |
| **Collector Incentive** | `GET` | `/api/v1/collector/incentives` | Mengambil aturan dan simulasi insentif CMS Flow Rate kolektor | Filter: `collector_username` |
| **Collector Incentive** | `POST` | `/api/v1/collector/incentives/simulate` | Melakukan simulasi interaktif perhitungan insentif CMS Flow Rate | `{"base_incentive": ..., "collection_rate": ..., "flow_rate": ...}` |

---

### 12.6. Manajemen Pengguna & Role-Based Access Control (RBAC)

1. **`ADMIN` (Administrator Sistem & IT Ops)**:
   - Hak penuh konfigurasi sistem, parameter global bank, simulasi batch EOD, dan re-evaluasi Decision Engine.
2. **`AR_HEAD` (Head of Accounts Receivable & Credit Recovery)**:
   - Wewenang eksklusif penanganan portofolio VIP, persetujuan restrukturisasi kredit, somasi hukum, re-assignment manual kolektor, dan diskon pelunasan (*settlement*).
3. **`COLLECTOR` (Field & Desk Specialist)**:
   - Akses PIC Workbench, pemanggilan Customer 360°, penggunaan skrip dialog dinamis, dan pencatatan berita acara penagihan.

#### Kredensial Pengguna Default:
| Username | Password | Role | Deskripsi Pengguna |
|---|---|---|---|
| `admin` | `admin123` | `ADMIN` | Administrator Sistem CRMS |
| `ar_head` | `arhead123` | `AR_HEAD` | Bambang Wijaya (AR Head & Recovery Lead) |
| `collector` | `collector123` | `COLLECTOR` | Dimas Kurniawan (Senior Field & Desk Specialist) |

---

### 12.7. Parameter Dinamis Lembaga Perbankan (`global_parameters`)
Identitas lembaga perbankan tidak di-hardcode melainkan dikonfigurasi melalui tabel `public.global_parameters`:
- **`GENERAL_NAMA_PT`**: Nama resmi bank (contoh: `"BANK DKI"` atau `"BANK JAKARTA"`).
- **`GENERAL_SIMBOL_PT`**: Simbol institusi (contoh: `"BDKI"` atau `"CRMS"`), otomatis menjadi prefix nomor rekening pinjaman (`BDKI-KPR-...`, `BDKI-KMK-...`), logo badge navigasi, dan kop dokumen tagihan.

---

### 12.8. Panduan Kompilasi & Deployment Mandiri ke VPS (Linux Systemd & Nginx SSL Port 3030)

#### Alokasi Port Server VPS:
- **Backend Golang API**: Port **`8030`** (`http://127.0.0.1:8030` internal)
- **Frontend Nginx Reverse Proxy (SSL)**: Port **`3030`** (`https://...:3030`)
- **Database PostgreSQL**: Port **`5432`** (`crms_db`)

#### 1. Kompilasi Binary Backend Linux:
```bash
cd backend
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o crms-server-linux ./cmd/server
```

#### 2. Kompilasi Bundle Frontend Produksi:
```bash
cd frontend
npm run build
```

#### 3. Pengemasan & Pengiriman Berkas ke VPS:
```bash
tar -czvf crms-vps-deploy.tar.gz \
  backend/crms-server-linux \
  backend/.env.example \
  frontend/dist \
  system_doc_crms.md \
  setup_db.sql \
  crms_db_ddl.sql

scp crms-vps-deploy.tar.gz lims@srv1801975:/home/crms/
```

#### 4. Konfigurasi Service Systemd Backend (`/etc/systemd/system/crms-backend.service`):
```ini
[Unit]
Description=CRMS Golang Backend Service
After=network.target postgresql.service

[Service]
Type=simple
User=lims
WorkingDirectory=/home/crms/backend
ExecStart=/home/crms/backend/crms-server-linux
Restart=always
RestartSec=5
Environment=PORT=8030
Environment=DATABASE_URL=postgres://admin_lims:Nkl@130200@localhost:5432/crms_db?sslmode=disable

[Install]
WantedBy=multi-user.target
```

Perintah aktivasi service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable crms-backend
sudo systemctl restart crms-backend
```

#### 5. Konfigurasi Nginx SSL HTTPS Port 3030 (`/etc/nginx/conf.d/crms.conf`):
```nginx
server {
    listen 3030 ssl;
    server_name lims-d4551821.nip.io lims.local localhost _;

    # Sertifikat SSL Let's Encrypt / Multi-domain
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Redirect otomatis jika pengguna mengakses via HTTP ke port SSL
    error_page 497 https://$host:3030$request_uri;

    root /home/crms/frontend/dist;
    index index.html;

    # Frontend SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Reverse proxy ke Backend Golang API (Port 8030)
    location /api/ {
        proxy_pass http://127.0.0.1:8030;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

Terapkan konfigurasi web server:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

### 12.9. Manajemen Repositori Source Code & Git Workflow (GitHub)

Seluruh kode sumber sistem **CRMS (Collection & Recovery Management System)** dikelola dan dipelihara secara terpusat melalui repositori GitHub resmi:

#### 1. Informasi Repositori Resmi
| Parameter | Nilai Konfigurasi | Keterangan |
|---|---|---|
| **Repository Web URL** | `https://github.com/nurkholim15-bot/crms` | Portal web repositori, riwayat commit, pull requests & issues |
| **Git Clone / Push (SSH)** | `git@github.com:nurkholim15-bot/crms.git` | **Rekomendasi Utama** (otentikasi otomatis via SSH key `id_ed25519`) |
| **Git Clone / Push (HTTPS)**| `https://github.com/nurkholim15-bot/crms.git` | Memerlukan Personal Access Token (PAT) |
| **Organization / Owner** | `nurkholim15-bot` | Akun pemilik repositori resmi |
| **Default Branch** | `main` | Cabang produksi utama |

#### 2. Konfigurasi Autentikasi SSH Key
Untuk keamanan tingkat enterprise tanpa perlu memasukkan password berulang kali pada setiap operasi push/pull, repositori dihubungkan menggunakan kunci SSH:
- **Verifikasi Status Koneksi SSH (Terminal WSL)**:
  ```bash
  ssh -T git@github.com
  # Respon sukses:
  # Hi nurkholim15-bot! You've successfully authenticated, but GitHub does not provide shell access.
  ```
- **Mengatur Remote URL ke SSH**:
  ```bash
  git remote set-url origin git@github.com:nurkholim15-bot/crms.git
  ```

#### 3. Standar Berkas Proteksi (`.gitignore`)
Berkas `.gitignore` telah dikonfigurasi secara ketat untuk mencegah kebocoran kredensial serta mencegah pengunggahan berkas biner/dependensi raksasa:
* **Dependensi Pustaka**: `node_modules/`, `frontend/node_modules/`
* **Hasil Build & Biner**: `frontend/dist/`, `backend/crms-server`, `backend/crms-server-linux`, `*.exe`
* **Berkas Lingkungan & Kredensial**: `.env`, `backend/.env`, `frontend/.env`, `*.local`
* **Arsip & Log Server**: `*.tar.gz`, `*.zip`, `*.log`, `backend/*.log`

#### 4. Prosedur Siklus Kerja Git (Git Workflow)
```bash
# 1. Pengecekan status perubahan file lokal
git status

# 2. Penambahan seluruh perubahan yang telah diverifikasi ke staging
git add .

# 3. Pembuatan commit dengan pesan deskriptif
git commit -m "feat: implement CRMS complete system with banking portfolio, customer 360, and decision engine"

# 4. Pengunggahan ke repositori GitHub cabang main
git push -u origin main
```

---

## 13. Panduan Operasional & Cara Verifikasi 9 Dimensi Penagihan Modern

Bagian ini menyajikan panduan operasional komprehensif bagi manajemen risiko, supervisor penagihan, serta tim auditor TI Bank DKI / Bank Jakarta untuk mengecek dan memverifikasi kapabilitas sistem yang telah ditingkatkan mengacu pada standar *Enterprise Modern Collections* dan kesepakatan MoM 4 September 2026.

### 13.1. Matriks Evaluasi 9 Dimensi Penagihan (Sebelum vs Sesudah Upgrade)

| No | Dimensi Penagihan | Sebelum Upgrade (Legacy CRMS) | Sesudah Upgrade (Enterprise CRMS) | Indikator Pembuktian di Sistem |
|:---:|:---|:---|:---|:---|
| **1** | **Tampilan Nasabah (Customer View)** | **Silo per Kontrak Pinjaman**: Penagihan dilakukan per rekening terpisah tanpa mengetahui eksposur fasilitas lainnya. | **Unified Customer 360° View**: Agregasi total plafon, angsuran bulanan, dan tunggakan gabungan lintas produk (KPR, KMK, KTA, KUR, CC) dalam 1 nomor CIF. | Tombol `360°` pada setiap baris tabel; Modal Customer 360° menampilkan Tab Fasilitas Kredit multi-produk dan Banner ASN Pemprov DKI. |
| **2** | **Efisiensi Biaya Kanal (Cost Recovery)** | **One-Size-Fits-All**: Semua akun DPD awal diproses seragam (telepon/surat) tanpa perhitungan efisiensi biaya kanal. | **Cost-Effective Channel Recommendation**: Rekomendasi otomatis kanal digital-first (WA AutoBot hemat 95%, Robo Call hemat 80%, Desk Phone hemat 75%, Field Visit baseline). | Kolom "Tahapan & Kanal Rekomendasi" di Dashboard memuat badge efisiensi biaya; Tab Skrip 360° memuat badge kalkulasi net cost saving. |
| **3** | **Dialog & Komunikasi Kolektor** | **Manual & Tidak Terstandarisasi**: Petugas menyusun narasi bebas; rawan intimidasi, salah informasi, dan komplain nasabah. | **Script-Driven Dynamic Dialogue**: Skrip terpandu otomatis disesuaikan dengan profil risiko (Low/Medium/High/VIP) & POJK Perlindungan Konsumen. | Tab "Skrip Percakapan Terpandu" memuat salam pembuka resmi, detail tagihan & VA, taktik negosiasi, tombol "Salin ke WA", dan direct WhatsApp. |
| **4** | **Alur Kerja Pemulihan (Lifecycle)** | **Statis & Kaku Berbasis DPD**: Akun tertahan di bucket penagihan tanpa alur penyelamatan atau tindakan hukum terstruktur. | **7-Stage Recovery Lifecycle Pipeline**: `COLLECTION` $\rightarrow$ `SKIP_TRACING` $\rightarrow$ `RESTRUCTURING` $\rightarrow$ `LEGAL_NOTICE` $\rightarrow$ `LITIGATION_AUCTION` $\rightarrow$ `SETTLEMENT` $\rightarrow$ `CLOSED`. | Dropdown Filter Stage di Dashboard; Tab "Advanced Collections Lifecycle" memuat Stage Stepper dengan validasi alasan bisnis (*Reason Mandatory*). |
| **5** | **Real-Time Rekonsiliasi Pembayaran** | **Batch End-of-Day (EOD)**: Pembayaran baru tercatat H+1, memicu salah tagih (*post-payment harassment*) pada nasabah yang sudah bayar siang hari. | **Instant Takeout Task via Webhook**: Pembayaran via Virtual Account / BI-FAST langsung mengubah status `PAID`, tunggakan Rp 0, dan mengeluarkan akun dari antrean kerja. | Tombol `Simulasi Bayar Real-time (Webhook)` di Operations Workbench seketika mengubah status menjadi PAID dan mendisposisi antrean kerja. |
| **6** | **Kalender Portofolio Payroll ASN** | **Pola Tanggal Standar**: Diperlakukan sama seperti karyawan swasta gajian akhir bulan. Penagihan keras saat dana belum cair. | **Payroll Calendar Logic & Grace Period**: Pemetaan siklus Gaji Pokok (Tgl 1–3) vs Tukin/TKD (Tgl 15–20) dengan periode tenggang autodebet aktif (Tgl 5–19). | Banner biru `ASN PEMPROV DKI` di modal 360° debitur ASN (Budi Santoso CIF-010007); mode gentle reminder tanpa ancaman denda saat jeda tukin. |
| **7** | **Tata Kelola Surat Peringatan (SP)** | **Penerbitan Manual di Cabang**: Tidak ada kontrol jeda kalender; rawan cacat formil hukum acara perdata. | **14-Day Calendar Gap Governance**: Sistem mengunci (*locks*) SP berikutnya (SP 1 DPD 30 $\rightarrow$ SP 2 DPD 45 $\rightarrow$ Somasi SP 3 DPD 60) sebelum jeda 14 hari terpenuhi. | Kartu kontrol visual checklist pada Tab 3 Customer 360° Modal dengan penanda tahapan terkunci otomatis jika syarat jeda 14 hari belum lewat. |
| **8** | **Pengawasan Lapangan & Anti-Fraud** | **Laporan Kertas / Tanpa Validasi Lokasi**: Potensi *phantom visit* (petugas mengaku berkunjung tapi tidak ke lokasi agunan) dan jam HP palsu. | **GPS Geotagging & Server NTP Timestamp**: Perekaman koordinat lintang/bujur perangkat dan waktu server pusat yang tidak dapat diubah secara lokal. | Badge `GPS Anti-Fraud Verified: Lat/Lng | Server NTP: Synced` pada Tab Timeline 360° dan panel penguncian koordinat di modal pencatatan aktivitas. |
| **9** | **Navigasi Data Table & Kontrol** | **Tabel Statis Sederhana**: Tanpa nomor baris, pencarian terbatas, dan pemindahan kapasitas petugas kaku. | **Advanced Operational Controls**: Penomoran baris (`No.`), filter multi-parameter (DPD, Bucket, Stage), pencarian instan (nama/rekening/CIF), dan manual re-assignment. | Kolom `No.` di seluruh tabel; search bar responsif instan; filter stage dinamis; fitur pemindahan tugas antar-kolektor di Workbench. |

---

### 13.2. Prosedur Pengecekan Mendalam: Dimensi 2 s/d Dimensi 9

Berikut adalah tata cara rinci pengujian operasional pada antarmuka CRMS dan API backend:

#### Dimensi 2: Efisiensi Biaya Kanal (Cost Recovery & Net Efficiency)
* **Kalkulasi Matematis**:
  $$\text{Efisiensi Biaya Kanal (\%)} = \frac{\text{Biaya Baseline Field Visit} - \text{Biaya Kanal Terpilih}}{\text{Biaya Baseline Field Visit}} \times 100\%$$
  - *Field Visit Baseline*: Rp 100.000 / kunjungan (Efisiensi 0%)
  - *Desk Phone*: Rp 15.000 / kontak (Net Efficiency 45% - 75%)
  - *Smart Robo Call IVR*: Rp 1.000 / panggilan (Net Efficiency 80%)
  - *WhatsApp AutoBot*: Rp 450 / blast (Net Efficiency 95%)
* **Langkah Pengecekan di UI**:
  1. Akses **Dashboard** (`http://localhost:3030`).
  2. Perhatikan kolom ke-5 bertajuk **"Tahapan & Kanal Rekomendasi"**.
  3. Setiap debitur memiliki badge kanal dan persentase efisiensi (misal: badge hijau `WhatsApp [Hemat 95%]`, ungu `Robo Call [Hemat 80%]`, biru `Desk Phone [Hemat 75%]`, oranye `Field Visit [Hemat 45%]`).
  4. Klik tombol **`360°`** $\rightarrow$ Buka tab **"Skrip Percakapan Terpandu"**. Di kartu atas tertera informasi biaya kanal operasional beserta badge penghematan biaya.

#### Dimensi 3: Dialog & Komunikasi Kolektor (Script-Driven Dynamic Dialogue)
* **Langkah Pengecekan di UI**:
  1. Klik tombol **`360°`** pada baris debitur pilihan Anda:
     - Untuk profil *Low Risk DPD 2* (contoh: Budi Santoso CIF-010007): Muncul narasi santun, apresiasi nasabah, dan edukasi autodebet tanpa ancaman denda.
     - Untuk profil *High Risk DPD >30* (contoh: Bambang Soediro): Muncul narasi formal penanganan aset macet, risiko penurunan skor SLIK OJK, dan peringatan mitigasi agunan.
     - Untuk profil *VIP / Priority* (contoh: Ir. Kusuma Hartono CIF-010054): Muncul salam hormat Priority Banking RM tanpa kata-kata somasi atau denda.
  2. Klik tombol **"Salin Skrip untuk WhatsApp"**: Muncul notifikasi konfirmasi salin teks.
  3. Klik tombol hijau **"Buka WhatsApp Debitur"** di footer modal: Sistem membuka jendela interaksi WhatsApp resmi dengan pesan yang sudah terisi otomatis.

#### Dimensi 4: Alur Kerja Pemulihan Lanjutan (7-Stage Recovery Lifecycle)
* **Langkah Pengecekan di UI**:
  1. Di **Dashboard**, gunakan dropdown **"Filter Stage"** di atas tabel. Pilih misalnya `Restrukturisasi Kredit` atau `Surat Peringatan & Legal` untuk menyaring akun sesuai tahapan pemulihan.
  2. Buka modal **`360°`** untuk nasabah yang ingin dipindahkan tahapannya.
  3. Buka tab **"Advanced Collections Lifecycle"**.
  4. Pada formulir **"Ubah Tahapan Penanganan Akun"**:
     - Pilih tahapan tujuan (contoh: `STAGE_RESTRUCTURING - Restrukturisasi Kredit (POJK Relaxation)`).
     - Wajib isi alasan (*Reason Mandatory*): misalnya `"Debitur ASN mengajukan permohonan restrukturisasi perpanjangan tenor"`.
     - Isi catatan pendukung.
     - Klik **"Simpan & Perbarui Tahapan"**.
  5. Perhatikan bahwa badge tahapan pada header modal langsung ter-update, dan riwayat perpindahan tahapan tercatat otomatis pada tab **"Timeline Interaksi"**.

#### Dimensi 5: Real-Time Rekonsiliasi Pembayaran (Takeout Task Assignment via VA / BI-FAST)
* **Langkah Pengecekan di UI**:
  1. Masuk ke menu **Operations Workbench** (`/workbench`).
  2. Pilih tab antrean kanal apa saja (misalnya tab **WhatsApp AutoBot** atau **Desk Phone**).
  3. Cari debitur yang berstatus `OPEN`.
  4. Klik tombol hijau **"Simulasi Bayar Real-time (Webhook)"** pada baris debitur tersebut.
  5. Seketika status akun berubah menjadi **`PAID`** berwarna hijau, nilai tunggakan menjadi **`Rp 0`**, dan tombol kontak terkunci dengan keterangan "Lunas / Selesai" guna mencegah penagihan ganda pasca-pembayaran (*anti post-payment harassment*).

#### Dimensi 6: Kalender Portofolio Payroll ASN Pemprov DKI (Gaji & Tukin)
* **Langkah Pengecekan di UI**:
  1. Cari debitur berprofesi ASN di Dashboard, misalnya: **Budi Santoso (PNS Bappeda Pemprov DKI)** (`CIF-010007`) atau **Siti Rahmawati, S.Pd (PNS Pemprov)** (`CIF-010004`).
  2. Klik tombol **`360°`**.
  3. Tepat di bawah ringkasan metrik angka, perhatikan banner biru terang bertuliskan:
     > **[ASN PEMPROV DKI]** *Kalender Payroll Terpantau: Gaji Pokok (Tgl 1–3) & Rapel Tunjangan Kinerja/Tukin (Tgl 15–20).*  
     > **✓ Grace Autodebet: Aktif | Mode: Gentle Reminder**
  4. Buka tab **"Skrip Percakapan Terpandu"**: Dialog mengarahkan petugas untuk mengonfirmasi jadwal pencairan tunjangan daerah tanpa melakukan intimidasi penagihan.

#### Dimensi 7: Tata Kelola Surat Peringatan (14-Day Calendar Gap SP Governance)
* **Langkah Pengecekan di UI**:
  1. Buka modal **`360°`** $\rightarrow$ Tab **"Advanced Collections Lifecycle"**.
  2. Gulir ke bawah pada kartu bertajuk **"Tata Kelola Surat Peringatan (14-Day Calendar Gap Rule)"**.
  3. Periksa status indikator otomatis:
     - **Surat Pemberitahuan Awal (Pre-Notice DPD 15)**: Tersedia / Terkirim.
     - **Surat Peringatan 1 (SP 1 - DPD 30)**: Aktif jika DPD $\ge$ 30.
     - **Surat Peringatan 2 (SP 2 - Min DPD 45)**: Berstatus *Terkunci Otomatis* jika selang waktu kalender dari SP 1 belum melewati 14 hari penuh.
     - **Somasi Terakhir (SP 3 - Min DPD 60)**: Terkunci hingga jeda 14 hari SP 2 terlampaui.

#### Dimensi 8: Pengawasan Lapangan & Anti-Fraud (Field Geotagging & NTP Timestamp)
* **Langkah Pengecekan di UI**:
  1. Buka modal **`360°`** $\rightarrow$ Tab **"Timeline Interaksi"**.
  2. Pada setiap kartu aktivitas yang dilakukan oleh petugas *Field Collection* atau *Special Team*, perhatikan indikator keamanan:
     `GPS Anti-Fraud Verified: -6.194000, 106.822666 | Server NTP: Synced`.
  3. Di menu Dashboard / Workbench, klik tombol **"+ Aktivitas"**: Formulir pencatatan interaksi lapangan menampilkan koordinat GPS terkunci dan jam server tersinkronisasi tanpa bisa diubah manual di perangkat pengguna.

#### Dimensi 9: Navigasi Data Table & Kontrol Operasional
* **Langkah Pengecekan di UI**:
  1. **Nomor Urut Baris (`No.`)**: Periksa kolom pertama paling kiri di tabel Dashboard, Workbench, maupun VIP Management. Seluruh baris dilengkapi nomor urut berurutan (1, 2, 3, dst.) untuk mempermudah cross-check dokumen audit.
  2. **Pencarian Instan (Real-Time Search Bar)**: Ketikkan nama debitur (misal `Budi`, `Kusuma`) atau nomor kontrak (`BANK-KPR...`) atau nomor CIF (`010007`) di kotak pencarian. Tabel menyaring data seketika tanpa perlu menekan tombol submit.
  3. **Multi-Parameter Filtering**: Padukan filter pencarian teks dengan filter DPD (misal: `DPD 1-3 Hari`), filter Bucket, dan filter Stage.
  4. **Manual Re-Assignment Kolektor**: Pada menu Workbench, supervisor dapat memilih nama petugas baru dari dropdown untuk mengalihkan beban kerja jika petugas sebelumnya berhalangan.

---

### 13.3. Panduan Khusus Verifikasi: Tahapan & Kanal Rekomendasi serta Customer 360°

#### A. Memverifikasi Kolom "Tahapan & Kanal Rekomendasi" di Tabel Utama
Kolom **"Tahapan & Kanal Rekomendasi"** di Dashboard menggabungkan dua output kecerdasan sistem:
1. **Tahapan Pemulihan (*Recovery Stage*)**: Menunjukkan posisi akun pada alur pemulihan (*Workflow State Machine*).
2. **Kanal Rekomendasi AI (*Cost-Effective Channel*)**: Menunjukkan kanal kontak terbaik berdasarkan kalkulasi skor risiko dan efisiensi biaya terendah.

**Cara Membaca Kombinasi Badge:**
* Akun baru menunggak DPD 1–3 berisiko rendah $\rightarrow$ Tahap: `Penagihan Reguler`, Kanal: `WhatsApp [Hemat 95%]`.
* Akun menunggak DPD 4–7 $\rightarrow$ Tahap: `Penagihan Reguler`, Kanal: `Robo Call [Hemat 80%]`.
* Akun menunggak DPD 8–30 $\rightarrow$ Tahap: `Penagihan Reguler`, Kanal: `Desk Phone [Hemat 75%]`.
* Akun menunggak DPD >30 $\rightarrow$ Tahap: `Penagihan Reguler` / `Surat Peringatan`, Kanal: `Field Visit [Hemat 45%]`.
* Akun yang sedang dalam proses pengajuan keringanan $\rightarrow$ Tahap: `Restrukturisasi Kredit`, Kanal: `Analis Kredit`.

#### B. Memverifikasi Modal Customer 360° View
Modal Customer 360° memadukan informasi debitur dari berbagai sudut pandang portofolio perbankan:
1. **Header Agregasi Eksekutif**:
   * Menampilkan nama debitur, CIF, kategori debitur perbankan, nomor telepon, dan domisili kota.
   * Empat kotak ringkasan: **Total Fasilitas**, **Total Plafon Pinjaman**, **Total Kewajiban Overdue**, dan **Max DPD & Tingkat Risiko**.
2. **Tab 1 — Fasilitas Kredit (Cross-Facility Exposure)**:
   * Menampilkan kartu terpisah untuk setiap produk kredit aktif atas nama nasabah tersebut.
   * Menunjukkan status apakah fasilitas bersangkutan sedang lancar (Kol-1) atau tertunggak (Overdue), nomor perjanjian kredit, cabang pembukuan, nominal angsuran, serta detail dokumen agunan (SHM, SHGB, Potong Gaji ASN).
3. **Tab 2 — Skrip Percakapan Terpandu (Dynamic Dialogue)**:
   * Skrip kolektor dinamis 4 segmen dengan tombol salin teks dan integrasi WhatsApp Web langsung.
4. **Tab 3 — Advanced Collections Lifecycle**:
   * Form pengalihan tahapan pemulihan terintegrasi audit trail dan kartu kontrol jeda 14 hari kalender Surat Peringatan.
5. **Tab 4 — Timeline Interaksi**:
   * Rekam jejak seluruh riwayat kontak dari seluruh kanal dengan badge anti-fraud GPS & stempel waktu server NTP.

---

### 13.4. Bedah Rinci Struktur Data & Kolom Tabel Antrean Penagihan (Kolom 1 s/d Kolom 11)

Tabel utama antrean penagihan (*Collection Work Queue*) dirancang sebagai instrumen kerja operasional harian para petugas penagihan (*desk/field collectors*) dan supervisor. Setiap baris mewakili satu rekening perjanjian kredit aktif yang sedang berada dalam status keterlambatan (*overdue*).

#### 13.4.1. Agregasi Multi-Fasilitas: Perjanjian Kredit (Tabel Utama) vs Entitas Debitur (Customer 360°)
* **Prinsip Tampilan Tabel Antrean Utama (Agreement-Level Grain)**:
  * Di lingkungan perbankan modern, satu nasabah (*Customer Identification File* / CIF) dapat memiliki lebih dari satu fasilitas pembiayaan secara bersamaan (misalnya: 1 fasilitas KPR Griya, 1 fasilitas Pinjaman Rekening Koran KMK, dan 1 fasilitas Kartu Kredit).
  * Masing-masing fasilitas pinjaman tersebut memiliki nomor rekening kontrak yang berbeda, tanggal jatuh tempo yang berbeda, agunan yang berbeda (Sertifikat Hak Milik vs Fidusia Kendaraan/Piutang Usaha), nomor Virtual Account (VA) pembayaran yang berbeda, serta tingkat keterlambatan (DPD) yang independen.
  * **Oleh karena itu, jika seorang debitur memiliki 2 fasilitas yang menunggak secara bersamaan, tabel antrean CRMS akan menampilkan 2 baris terpisah**. Hal ini esensial bagi tim operasional penagihan karena setiap fasilitas pinjaman memerlukan tindakan legalitas, berita acara eksekusi, serta pelacakan agunan yang spesifik per perjanjian kredit.
* **Prinsip Tampilan Customer 360° View (CIF-Level Consolidation)**:
  * Ketika tombol **`360°`** pada salah satu baris diklik, sistem secara otomatis beralih dari sudut pandang nomor kontrak ke sudut pandang **Konsolidasi Nasabah Utuh (Debtor-Centric)**.
  * Sistem mengonsolidasikan seluruh fasilitas atas nama nasabah tersebut (baik yang sedang menunggak maupun yang berstatus lancar / Kol-1), menghitung akumulasi total plafon, total tunggakan, mendeteksi DPD terburuk (*Max DPD*), serta menetapkan tingkat risiko terberat (*Worst Risk Level*) untuk memandu collector dalam negosiasi menyeluruh.

#### 13.4.2. Kolom-3: Hari Menunggak (DPD) & 7 Klasifikasi Overdue Bucket
* **DPD (Days Past Due)**: Jumlah hari kalender terhitung sejak tanggal jatuh tempo angsuran yang belum diselesaikan hingga hari tanggal kalender berjalan.
* **Segmentasi 7 Bucket Keterlambatan Perbankan**:
  1. `Bucket 1-3` (DPD 1–3 Hari): *Pre-Delinquency / Grace Period*. Keterlambatan administratif awal (nasabah lupa tanggal, kegagalan autodebet teknis, atau menunggu kliring payroll).
  2. `Bucket 4-7` (DPD 4–7 Hari): *Early Delinquency*. Pengingat digital intensif melalui WhatsApp AI Bot dan Interactive Robo Call.
  3. `Bucket 8-14` (DPD 8–14 Hari): *Mid Early Delinquency*. Eskalasi peringatan sebelum pertengahan bulan dan persiapan alokasi tele-desk.
  4. `Bucket 15-30` (DPD 15–30 Hari): *Late Early / Kolektibilitas 2 (Dalam Perhatian Khusus)*. Intervensi panggilan telepon personal oleh *Desk Relationship Officer* (DERO).
  5. `Bucket 31-60` (DPD 31–60 Hari): *Bucket 2 / Medium Delay*. Penerbitan Surat Peringatan I (SP-1) dan persiapan kunjungan petugas lapangan (*Field Officer* / FO).
  6. `Bucket 61-90` (DPD 61–90 Hari): *Bucket 3 / Pre-NPL (Kolektibilitas 3 Kurang Lancar)*. Evaluasi restrukturisasi kredit atau Somasi Hukum bertahap.
  7. `Bucket 90+` (DPD > 90 Hari): *Non-Performing Loan (NPL / Kolektibilitas 4 Diragukan & 5 Macet)*. Penyerahan berkas ke Divisi Remedial & Litigasi untuk eksekusi agunan via lelang KPKNL atau gugatan pengadilan.

#### 13.4.3. Kolom-5: Kriteria 6 Lifecycle Penagihan & Formula Efisiensi Biaya
Kolom ini memadukan status tahapan penanganan (*Recovery Stage*) dan rekomendasi kanal kontak berbiaya terendah (*Cost-Effective Channel Recommendation*).

* **Formula Kalkulasi Efisiensi Biaya (Cost Efficiency Rate)**:
  Tingkat efisiensi biaya dihitung secara matematis dengan menjadikan biaya penagihan manual konvensional (kunjungan langsung petugas lapangan / *Field Visit* dengan estimasi biaya Rp 150.000 – Rp 200.000 per akun) sebagai tolok ukur acuan (*baseline*):
  $$\text{Efisiensi Biaya (\%)} = \frac{\text{Biaya Kunjungan Fisik FO (Rp 150.000)} - \text{Biaya Kanal Terpilih}}{\text{Biaya Kunjungan Fisik FO (Rp 150.000)}} \times 100\%$$
  * **Kanal Digital WhatsApp AI & Robo Call**: Biaya ~Rp 500 – Rp 2.000 $\rightarrow$ **Tingkat Penghematan: 95% hemat**.
  * **Kanal Tele-Calling (Desk DERO)**: Biaya ~Rp 25.000 – Rp 35.000 $\rightarrow$ **Tingkat Penghematan: 75% hemat**.
  * **Kanal Skip Tracing**: Biaya investigasi kontak ~Rp 75.000 $\rightarrow$ **Tingkat Penghematan: 50% hemat**.
  * **Kanal Kunjungan Lapangan & Remedial/Litigasi**: Biaya operasional penuh $\rightarrow$ **Tingkat Penghematan: 30% – 45% hemat**.

* **Kriteria Masuk 6 Lifecycle Penanganan Khusus (*Advanced Collections*)**:
  1. `STAGE_COLLECTION` (*Koleksi Reguler*): DPD 1–30 hari (Kol-1 s/d Kol-2 awal). Penagihan standar via kanal digital, SMS/WA blast, dan panggilan desk.
  2. `STAGE_SKIP_TRACING` (*Skip Tracing / Pelacakan Kontak*): Debitur tidak dapat dihubungi (*Unreachable*) $\ge 7$ hari kerja berturut-turut, nomor telepon tidak aktif, atau alamat domisili tidak ditemukan saat kunjungan awal. Dilakukan pelacakan kontak darurat, instansi/tempat kerja, serta verifikasi database kependudukan.
  3. `STAGE_RESTRUCTURING` (*Restrukturisasi Kredit 3R*): DPD 15–90 hari, debitur memiliki kemauan membayar (*willingness to pay*) yang tinggi namun mengalami penurunan kemampuan finansial (*capacity to pay* menurun, misal penurunan omzet usaha atau pemutusan hubungan kerja). Dilakukan penataan jadwal tenor (*Rescheduling*), relaksasi bunga (*Reconditioning*), atau penataan kembali pokok (*Restructuring*).
  4. `STAGE_LEGAL_NOTICE` (*Surat Peringatan & Somasi Hukum*): DPD 30–60 hari (Kol-2 s/d Kol-3), ingkar janji bayar (*broken PTP*) berulang, nasabah uncooperative. Melibatkan kepatuhan hukum berjenjang SP-1, SP-2, dan SP-3 dengan jeda waktu minimal 14 hari kalender.
  5. `STAGE_LITIGATION_AUCTION` (*Litigasi & Lelang Agunan*): DPD > 90 hari (Kol-4 & Kol-5 Macet Total), penagihan persuasif tidak menghasilkan penyelesaian. Dilakukan pendaftaran eksekusi Hak Tanggungan (UUHT No. 4/1996) / Fidusia ke Kantor Pelayanan Kekayaan Negara dan Lelang (KPKNL) atau balai lelang resmi.
  6. `STAGE_SETTLEMENT` (*Settlement Khusus & Haircut Pelunasan*): Debitur macet atau portofolio Hapus Buku (*Write-Off*) yang berniat melunasi pinjaman sekaligus (*lump-sum payment*) dengan fasilitas diskon denda hingga 100% dan haircut bunga/pokok dengan persetujuan Komite Kredit/AR Head.

#### 13.4.4. Kolom-6: Matriks Strategi (Champion, Challenger, VIP) & Action Path (AP 1 s/d AP 8 & VIP)
* **Strategi Penagihan (Strategy Group)**:
  * `CHAMPION`: Strategi penagihan utama perbankan berbasis *best practice* dengan tingkat pemulihan piutang (*recovery rate*) tertinggi.
  * `CHALLENGER`: Rute strategi alternatif untuk pengujian performa (*A/B Testing*), misalnya intervensi panggilan telepon lebih awal atau tawaran restrukturisasi cepat untuk mengukur perbandingan efektivitas.
  * `VIP`: Jalur penanganan khusus nasabah prioritas (*Private Banking*, High Net Worth Individuals, atau debitur korporasi) yang berada di bawah pengawasan langsung *Account Receivable (AR) Head*.
* **Pohon Keputusan Tindakan (*Action Path* / AP)**:
  * `AP 1`: Reminder digital otomatis via WhatsApp Interactive & SMS Gateway (DPD 1–3).
  * `AP 2`: Smart Robo Call pengingat otomatis berulang (DPD 4–7).
  * `AP 3`: Panggilan tele-collection langsung oleh Desk Relationship Officer / DERO (DPD 8–14).
  * `AP 4`: Penugasan kunjungan tatap muka pertama oleh Field Officer / FO (DPD 15–30).
  * `AP 5`: Pelacakan alamat domisili dan investigasi nomor kontak baru (*Skip Tracing*).
  * `AP 6`: Penerbitan Surat Peringatan formal dan analisis restrukturisasi kredit.
  * `AP 7`: Penerbitan Surat Peringatan Terakhir SP-3, Somasi Legal, dan pengamanan fisik agunan.
  * `AP 8`: Eksekusi Lelang Agunan melalui KPKNL atau pendaftaran gugatan perdata sederhana (*Small Claim Court*).
  * `VIP`: *Executive Dedicated Handling* (layanan personal relationship manager tanpa intervensi bot/robot).

#### 13.4.5. Kolom-7: Scoring Model Risiko Gagal Bayar (Skala 0–1000 & Klasifikasi Level Risiko)
* **Skala Penilaian**: **0 s/d 1000 Poin** (Standar Penilaian Kredit FICO / Credit Bureau).
  * Semakin tinggi skor, semakin prima profil debitur dan semakin **rendah risiko gagal bayar** (*Low Risk*). Sebaliknya, skor rendah mengindikasikan probabilitas default yang tinggi (*High Risk*).
* **Klasifikasi Level Risiko & Tampilan Badge di Sistem**:
  * `LOW_RISK` (**Skor 700 – 1000**, Badge Hijau): Debitur berkarakter unggul dengan riwayat pembayaran tepat waktu, status SLIK OJK Kolektibilitas 1 (Lancar), serta sumber penghasilan tetap terjamin (misal: ASN/PNS Pemprov DKI dengan payroll terjamin atau karyawan tetap BUMN). Ditangani via kanal digital otomatis hemat biaya (WhatsApp AutoBot hemat 95%).
  * `MEDIUM_RISK` (**Skor 450 – 699**, Badge Kuning): Debitur dengan pola keterlambatan musiman (*seasonal*), arus kas usaha yang fluktuatif, atau rasio beban cicilan (*Debt Service Ratio*) yang mendekati batas toleransi bank. Ditangani via strategi hybrid (Robo Call & Desk Collector).
  * `HIGH_RISK` (**Skor 0 – 449**, Badge Merah): Debitur dengan rekam jejak menunggak kronis, ingkar janji berulang (*broken PTP*), nomor telepon kerap tidak aktif, atau agunan yang mengalami risiko penurunan nilai pasar (*depreciation*). Memerlukan intervensi langsung petugas lapangan (Field Officer DPD 1+).
  * `VIP` (Badge Ungu): Portofolio nasabah prioritas/komersial penting yang dikelola khusus oleh Senior Special Team / AR Head tanpa intervensi bot/robot.

#### 13.4.6. Kolom-10: Modal Log PIC Penagihan (Debitur Snapshot, Default Nilai, & Quick Templates)
Tombol **"Log PIC"** membuka formulir pencatatan interaksi resmi bagi petugas pengelola akun:
1. **Debitur Overview Strip**: Menampilkan secara instan nominal tunggakan overdue, jumlah hari DPD, bucket keterlambatan, dan PIC penugasan saat modal dibuka.
2. **Pengisian Default Cerdas**:
   * Tanggal Janji Bayar (*PTP Date*) otomatis terisi **H+2** dari tanggal hari ini.
   * Nominal Janji Bayar (*PTP Amount*) otomatis terisi sesuai total kewajiban overdue debitur.
   * Petugas pelaksana dan kanal penanganan otomatis menyesuaikan identitas PIC akun.
3. **Tombol Template Cepat 1-Klik (Quick Note Chips)**:
   * `⚡ Janji Bayar VA`: *"Debitur berjanji melakukan pembayaran angsuran via Virtual Account resmi sebelum pukul 17:00 WIB."*
   * `🏛️ ASN Rapel Tukin`: *"Debitur ASN Pemprov DKI konfirmasi pembayaran tertunda menunggu rapel Tunjangan Kinerja (Tukin) tgl 15."*
   * `📞 Telepon Terhubung`: *"Panggilan terhubung dengan debitur. Konfirmasi kendala autodebet teratasi dan rincian VA telah dikirimkan."*
   * `📍 Kunjungan FO`: *"Kunjungan fisik FO ke domisili/usaha: Usaha operasional aktif, debitur kooperatif menyetujui jadwal pembayaran."*
   * `🔄 Ajukan Relaksasi`: *"Debitur memohon restrukturisasi kredit (keringanan angsuran / perpanjangan tenor) akibat penurunan kapasitas arus kas."*
   * `❌ Tidak Diangkat`: *"Telepon berdering namun tidak diangkat. Rincian kewajiban dan nomor VA telah diteruskan via WhatsApp debitur."*
4. **Validasi Anti-Fraud Geotagging & Server Timestamp**: Setiap penyimpanan log menyertakan koordinat GPS valid dan stempel waktu server NTP yang tidak dapat diubah secara manual oleh petugas.

#### 13.4.7. Tombol Aksi Bayar (Simulasi Overdue Bulanan) vs Pelunasan Total (Full Payoff)
* **Tombol Cepat "Bayar" di Baris Tabel**:
  * Berfungsi untuk **simulasi penerimaan setoran angsuran bulanan / pelunasan tunggakan bulan berjalan (*Overdue Installment Payment*)** yang diterima dari Core Banking System (CBS) via Virtual Account.
  * Ketika tombol ini diklik:
    1. Nilai tunggakan `overdue_amount` menjadi `Rp 0`.
    2. Status rekening berubah menjadi `PAID` (Lunas angsuran bulan ini).
    3. Otomatis mencatat riwayat transaksi audit trail: *"Pembayaran diterima sebesar Rp X melalui Virtual Account BANK"*.
* **Pelunasan Total Dipercepat / Pelunasan Khusus (*Full Settlement / Haircut*)**:
  * Dilakukan secara khusus melalui **Customer 360° $\rightarrow$ Tab Advanced Collections $\rightarrow$ Tahap 6 (Settlement)**.
  * Di tahap ini, AR Head dan Komite Kredit menyetujui penghapusan denda keterlambatan (*penalty haircut*), kalkulasi pelunasan penuh seluruh sisa pokok pinjaman, penerbitan **Surat Keterangan Lunas (SKL)**, dan permohonan **Roya Jaminan** ke Kantor Pertanahan (BPN).

---

### 13.5. Bedah Antarmuka Customer 360° & Alur Testing Lengkap

Modal Customer 360° mengadopsi prinsip *Unified Customer View* standar industri perbankan terintegrasi dengan arsitektur 4 tab fungsional:

#### 13.5.1. Tab 1 — Fasilitas Pembiayaan Terpadu (Cross-Facility Aggregation)
* Menampilkan seluruh kartu fasilitas aktif nasabah (KPR, KMK, KTA, Kartu Kredit).
* Menampilkan pembedaan visual yang jelas antara fasilitas yang **Lancar (Kol-1)** (badge hijau) dan fasilitas yang **Overdue** (badge merah dengan rincian DPD, tunggakan, PIC, dan nomor agunan).

#### 13.5.2. Tab 2 — Skrip Percakapan Terpandu (Script-Driven Dynamic Guidance)
* **Banner Efisiensi Biaya**: Menampilkan rekomendasi kanal terbaik beserta persentase penghematan (misal: *Hemat Biaya ~95%*).
* **Persona Profil Debitur**: Mengidentifikasi karakter debitur secara psikologis dan risiko (*Low Risk*, *Medium Risk*, *High Risk*, atau *VIP Priority Banking*).
* **5 Struktur Percakapan Standar Perbankan**:
  1. *Salam & Pembuka (Opening)*: Naskah sapaan profesional dengan menyebutkan nama instansi resmi bank.
  2. *Penyampaian Kewajiban (Obligation Notice)*: Rincian nominal tertunggak dan jumlah hari kalender yang terlewati.
  3. *Taktik Negosiasi (Negotiation Tactic)*: Opsi solusi instan melalui pembayaran Virtual Account, QRIS, atau restrukturisasi.
  4. *Penguncian Komitmen (Closing Commitment)*: Penegasan tanggal dan batas jam realisasi janji bayar (PTP).
  5. *Batasan & Peringatan Hukum (Escalation Warning)*: Edukasi pentingnya menjaga riwayat kredit lancar di SLIK OJK.
* **Fitur Salin Teks Skrip 1-Klik**: Memudahkan kolektor menyalin naskah lengkap ke clipboard dalam format percakapan siap kirim.

#### 13.5.3. Tab 3 — Advanced Collections Lifecycle Interaktif
* **Stepper Interaktif 6 Tahapan**:
  * Seluruh kotak tahap (Tahap 1: Koleksi Reguler, Tahap 2: Skip Tracing, Tahap 3: Restrukturisasi, Tahap 4: Surat Peringatan & Somasi, Tahap 5: Lelang Agunan, Tahap 6: Settlement) **dapat diklik secara aktif**.
* **Panel Detail Inspeksi Tahapan Koleksi**:
  * Menampilkan **🎯 Kriteria Pemicu (Trigger Criteria)**, **📋 Standar Prosedur Operasional (SOP) & Eksekusi**, serta **📑 Dokumen Legalitas & Output** untuk masing-masing tahapan.
  * Dilengkapi tombol pintas *"👉 Jadikan Target Tahapan Pada Form Di Bawah"* untuk langsung memuat tahapan yang diinspeksi ke dalam formulir eskalasi.
* **Tata Kelola Jeda 14 Hari Kalender SP**:
  * Memberikan kepatuhan regulasi hukum formal bahwa antara penerbitan SP-1, SP-2, dan SP-3/Somasi wajib memiliki jeda minimal 14 hari kalender.

#### 13.5.4. Tab 4 — Linimasa Interaksi Omnichannel (Audit Trail Terpadu)
* Menampilkan jumlah riwayat aktivitas secara akurat pada badge tab (misal: **`Timeline Interaksi (2)`**).
* Menyajikan audit trail kronologis yang mencakup kanal (`WA`, `ROBO`, `DERO`, `FIELD`, `CONFINS_CORE`), pelaksana/petugas, catatan berita acara, status kontak, hasil interaksi, nominal komitmen PTP, serta verifikasi koordinat GPS Geotag.

#### 13.5.5. Prosedur Pengujian WhatsApp Engine & Pengubahan Nomor HP (Testing Flow)

Sistem CRMS mengadopsi modul pengiriman WhatsApp berstandar enterprise (arsitektur setara dengan modul notifikasi **Kopkara-EWA**) yang mendukung **Dual Mode Dispatch**:

1. **Modul WhatsApp Gateway API (Automated HTTP Service)**:
   - Menggunakan backend service adapter yang mendukung gateway industri:
     - **Fonnte Gateway**: Menggunakan header otentikasi token (`FONNTE_TOKEN`) menuju `https://api.fonnte.com/send`.
     - **Meta Cloud API (Official WhatsApp Business API)**: Mendukung `META_WA_PHONE_NUMBER_ID` dan `META_WA_ACCESS_TOKEN` untuk broadcast resmi skala besar.
   - **Audit Trail Otomatis**: Setiap pesan yang dikirimkan via API Gateway seketika dicatat ke tabel `collection_activities` dengan kanal `WA`, status `SENT`, dan ringkasan isi pesan.
   - **Tombol di Tab 2 (Skrip Percakapan)**: Tombol hijau **`[Kirim WA Gateway (API)]`** langsung menembak endpoint backend `POST /api/v1/customers/:id/send-whatsapp`. Jika token gateway belum dikonfigurasi, sistem memberikan notifikasi cerdas disertai tautan instan `wa_web_url`.

2. **Modul WhatsApp Direct Web / App (Auto-Text Encoded)**:
   - Tersedia tombol **`[Buka WA Web (Auto-Text)]`** pada Tab 2 dan tombol **`[Buka WhatsApp Debitur]`** pada footer modal.
   - Menggunakan protokol URL standar WhatsApp:
     $$\text{https://wa.me/628xxxxxxxxxx?text=<encoded\_script\_dialogue>}$$
   - Sistem secara otomatis membersihkan karakter non-numerik, mengonversi format lokal `08...` ke format internasional `628...`, dan menyisipkan seluruh teks skrip penagihan resmi yang telah terisi nama nasabah, rincian tunggakan, nomor Virtual Account, dan komitmen pembayaran. Kolektor cukup menekan tombol `Send` di WhatsApp tanpa perlu mengetik ulang.

3. **Cara Mengubah Nomor HP / WhatsApp Debitur untuk Testing**:
   Untuk memudahkan pengujian tanpa perlu mengubah data manual lewat terminal/database:
   - **Metode 1: Inline Edit Langsung di Antarmuka Modal 360° (UI)**:
     1. Buka modal **Customer 360°** pada debitur yang ingin diuji (misal: Budi Santoso).
     2. Pada bagian header identitas nasabah, terdapat tombol abu-abu **`[✎ Ubah No. HP (Test WA)]`** di samping nomor telepon.
     3. Klik tombol tersebut, kotak input akan terbuka. Masukkan nomor WhatsApp tujuan pengujian (contoh: `081234567890`).
     4. Klik tombol biru **`[Simpan]`**.
     5. Sistem seketika memperbarui nomor di database PostgreSQL, mencatat aktivitas pembaruan nomor pada audit trail, dan memperbarui tampilan modal secara real-time.
   - **Metode 2: Melalui REST API**:
     Endpoint: `PUT /api/v1/customers/:id/phone`
     Payload: `{"phone": "081234567890"}`
     Dapat dijalankan melalui Postman, cURL, maupun PowerShell.

4. **Langkah Pengujian Pengiriman Pesan WhatsApp**:
   1. Buka modal **`360°`** debitur.
   2. Klik **`[✎ Ubah No. HP (Test WA)]`** dan masukkan nomor WhatsApp Anda sendiri, lalu klik **`[Simpan]`**.
   3. Buka **Tab 2 (Skrip Percakapan Terpandu)**.
   4. Klik tombol **`Kirim WA Gateway (API)`** untuk menguji modul gateway API backend (atau klik **`Buka WA Web (Auto-Text)`**).
   5. WhatsApp Web / Aplikasi WhatsApp akan terbuka langsung ke ruang chat nomor Anda dengan draf pesan penagihan resmi perbankan yang lengkap.
   6. Buka **Tab 4 (Timeline Interaksi)** di modal 360°: Verifikasi bahwa riwayat pengiriman pesan WhatsApp telah otomatis tercatat ke dalam audit trail sistem.

---

## 14. Kepatuhan Regulasi Perbankan & Manajemen Risiko (POJK & Bank Indonesia)

Implementasi CRMS sepenuhnya tunduk pada regulasi OJK dan Bank Indonesia:
1. **POJK No. 11/POJK.03/2020 tentang Kualitas Aset Produktif**:
   - Memastikan kriteria kolektibilitas kredit (Kol-1 Lancar s/d Kol-5 Macet) terhitung akurat sesuai hari keterlambatan (DPD).
   - Menyediakan tata kelola restrukturisasi kredit formal yang dapat dipertanggungjawabkan dalam audit berkala OJK.
2. **POJK No. 6/POJK.07/2022 tentang Perlindungan Konsumen Sektor Jasa Keuangan**:
   - Penagihan hanya dilakukan pada pukul 08:00 – 20:00 waktu wilayah debitur.
   - Peniadaan intimidasi dan kekerasan verbal melalui penerapan skrip percakapan terpandu (*script-driven dialogue*).
3. **UU Perlindungan Data Pribadi (UU PDP No. 27/2022)**:
   - Larangan penagihan ke pihak ketiga atau kontak darurat di luar persetujuan perjanjian kredit.
   - Enkripsi data sensitif (PII) dengan TLS 1.3 pada transmisi data dan enkripsi AES-256 pada media penyimpanan.
4. **Audit Trail Komprehensif**:
   - Setiap interaksi penagihan terekam permanen (*immutable timestamp*) untuk kebutuhan pemeriksaan audit internal dan regulator.

---

## 15. Rencana Implementasi & Roadmap Bertahap (Quick Wins hingga 24 Bulan)

Berdasarkan kesepakatan MoM Bank DKI tanggal 4 September 2026, implementasi dijalankan dalam 3 fase bertahap:

```
+-----------------------------------------------------------------------------------------------+
| FASE 1: QUICK WINS (< 6 BULAN)                                                                 |
| - Collection Strategy & Decision Engine                                                       |
| - Preventive & Early Collection (WA Bot & Robo Call)                                          |
| - Desk Collection Work Queue                                                                  |
| - Mobile Field Collection (Geotagging GPS & Rute)                                             |
| - Rekonsiliasi Pembayaran Real-Time (BI-FAST / VA Takeout Task)                               |
| - Dashboard Operasional, Penomoran Baris & Filter Multi-Parameter                             |
| - Document Management (Surat Pemberitahuan & Jeda SP 14 Hari)                                 |
| - Keamanan & Kontrol PDP                                                                      |
+-----------------------------------------------------------------------------------------------+
                                                │
                                                ▼
+-----------------------------------------------------------------------------------------------+
| FASE 2: GO-LIVE KAPABILITAS UTAMA (12 BULAN / SEMESTER I)                                     |
| - Integrasi Penuh Host-to-Host Core Banking                                                   |
| - Perhitungan Insentif Kolektor Transparan                                                    |
| - Advanced Collections Lifecycle: Restrukturisasi POJK & Somasi Terintegrasi                  |
| - Roll-Out Seluruh Kantor Cabang                                                             |
+-----------------------------------------------------------------------------------------------+
                                                │
                                                ▼
+-----------------------------------------------------------------------------------------------+
| FASE 3: FULL JOURNEY SAMPAI RECOVERY (~24 BULAN)                                              |
| - Agency Management (Distribusi Akun & Penilaian Kinerja Vendor)                              |
| - Collateral & Auction Management (Integrasi KPKNL & Balai Lelang)                            |
| - Recovery & Write-Off Bucket Khusus                                                          |
| - Insurance & Guarantee Management (Host-to-Host Klaim Askrindo/Jamkrindo)                    |
+-----------------------------------------------------------------------------------------------+
```

---

## 16. Analisis Kelayakan Finansial & Dampak Bisnis (ROI Analysis)

Proyeksi pengembalian investasi (*Return on Investment* / ROI) pada tahun pertama implementasi CRMS:

```
[ Proyeksi Manfaat Finansial Tahunan ]
1. Penghematan Biaya Kunjungan Lapangan (Otomasi Digital DPD 1-30) : Rp  4.800.000.000 / Tahun
2. Penurunan Beban CKPN / Kerugian Akibat Pencegahan NPL Roll Rate  : Rp 11.200.000.000 / Tahun
3. Peningkatan Arus Kas Pemulihan Aset Macet (Lelang & Settlement) : Rp  3.500.000.000 / Tahun
4. Peningkatan Produktivitas Petugas Kolektor via Skrip Dinamis   : Rp  1.800.000.000 / Tahun
---------------------------------------------------------------------------------------------
TOTAL NILAI MANFAAT EKONOMI TAHUNAN                                : Rp 21.300.000.000 / Tahun

[ Estimasi Biaya Investasi Implementasi (Tahun ke-1) ]             : Rp  5.500.000.000
---------------------------------------------------------------------------------------------
NILAI MANFAAT BERSIH (NET ECONOMIC BENEFIT TAHUN KE-1)             : Rp 15.800.000.000
PERKIRAAN PENGEMBALIAN INVESTASI (ROI)                             : 287%
PERIODE PENGEMBALIAN MODAL (PAYBACK PERIOD)                        : 3.8 Bulan
```

---

## 17. Arsitektur Enterprise Lengkap (Enterprise Collections Architecture Patching)

Pembaruan arsitektur enterprise (*Enterprise Architecture Patching*) mengintegrasikan modul-modul pemulihan kredit tingkat lanjut yang diadaptasi dari arsitektur penagihan perbankan modern berskala enterprise.

```
+===================================================================================================+
|                    ARSITEKTUR FUNGSIONAL LENGKAP - ENTERPRISE CRMS ENGINE                         |
+===================================================================================================+
|  CHANNELS & TOUCHPOINTS                                                                           |
|  [ WA Business API ]   [ Robocall / IVR ]   [ SMS Gateway ]   [ Field Officer Mobile ]            |
|  [ Desk Collector ]    [ Remedial Officer ] [ AR Head Portal] [ In-House Legal & Litigasi ]       |
+---------------------------------------------------------------------------------------------------+
|  CORE FUNCTIONAL MODULES                                                                          |
|  1. Pre-Delinquency Management (PDM) - Early Warning DPD 0 (CASA & Payroll ASN Check)            |
|  2. Regular Collection & Overdue Matrix (DPD 1-30, Action Path 1-8, Champion/Challenger)         |
|  3. Case Stamping & Combo Definition (Single vs Multi-Facility: KPR+KPA, KMK+CC)                  |
|  4. Skip Tracing Management (Tracer PIC, Dukcapil, Mutasi CASA, Emergency Contact)                |
|  5. Legal Recourse Management (6-Stage Alur Litigasi, Somasi, Pengadilan & Aanmaning)             |
|  6. Repossession & Auction Workflow (8-Stage Eksekusi Agunan, Stockyard, KJPP & Lelang KPKNL)     |
|  7. Structured Settlement Engine (Net Settlement, Charge-Wise Waive, Auto Charge Allocation)     |
+---------------------------------------------------------------------------------------------------+
|  INTELLIGENT ENGINES & DECISIONING                                                                |
|  * Predictive Behavioral Scoring (0-1000)       * Cost-Efficiency Channel Router (95% WA vs FC)   |
|  * Multi-Facility Exposure Aggregator           * Exception & Capacity Planning Queue Router      |
+---------------------------------------------------------------------------------------------------+
|  INTERFACES & BACKBONE INTEGRATION                                                                |
|  [ Core Banking System (CBS) ]  [ CASA & Payroll API ]  [ Dukcapil & SLIK OJK ]                   |
|  [ Panel KJPP Penilai Publik ]  [ Balai Lelang & KPKNL ] [ Panel Law Firm Eksternal ]              |
+===================================================================================================+
```

### 17.1 Pre-Delinquency Management (PDM) - DPD 0 Early Warning
Modul PDM bertindak sebagai garda terdepan pencegahan kredit bermasalah sebelum rekening bergulir ke status menunggak (*prevention over cure*):
1. **Pengecekan Saldo Tabungan (CASA Balance Check)**: Membandingkan saldo rekening autodebet dengan jumlah angsuran yang akan jatuh tempo pada H-3 s.d H-0.
2. **Flagging Keterlambatan Gaji / Tukin ASN**: Khusus debitur ASN Pemprov DKI dan BUMD, sistem mendeteksi siklus transfer payroll dan keterlambatan pembayaran tambahan penghasilan pegawai (TPP/Tukin).
3. **First Payment Default (FPD) Alert**: Pengawasan intensif terhadap debitur baru pada angsuran ke-1 s.d ke-3.
4. **Gentle Reminder Otomatis via WhatsApp**: Mengirimkan notifikasi ramah tanpa nada penagihan, memfasilitasi *self-cure* debitur dengan efisiensi biaya kanal 95%.

### 17.2 Functional Journey & Case Stamping
Mengatasi fragmentasi penanganan nasabah yang memiliki lebih dari satu fasilitas pinjaman:
- **Combo 1 (Properti)**: KPR Griya Idaman + KPA Apartemen (Aset agunan properti sejenis dianalisis bersamaan).
- **Combo 2 (Non-Collateral)**: Kredit Multi Guna / KTA + Kartu Kredit (Penanganan tanpa jaminan fidusia dengan strategi restrukturisasi tunai).
- **Combo 3 (Komersial & UMKM)**: Kredit Modal Kerja (KMK) + KUR Ritel Mikro.
- **Routing Antrean Khusus (Queues)**: Pemisahan otomatis antara antrean reguler (*digital-first*) dengan antrean *exceptional/VIP* yang ditangani langsung oleh AR Head atau Special Asset Management Team.

### 17.3 Alur Penanganan Hukum (6-Stage Legal Recourse Workflow)
Standar operasional litigasi perbankan dalam 6 tahapan terstruktur:
1. **STAGE 1 - INITIATE LEGAL**: Penerbitan Surat Peringatan SP-1, SP-2, dan Somasi Hukum Formal.
2. **STAGE 2 - LAWYER & LAW FIRM ALLOCATION**: Penunjukan Advokat In-House atau Kantor Hukum Panel Rekanan Bank dan penerbitan Surat Kuasa Khusus.
3. **STAGE 3 - DOCUMENT UPLOAD & APPROVAL**: Verifikasi kelengkapan berkas Akta Perjanjian Kredit notariil, sertifikat Hak Tanggungan (APHT), SKMHT, dan Jaminan Fidusia.
4. **STAGE 4 - SECTIONS & PROCEEDINGS**: Pendaftaran Gugatan Sederhana (*Small Claim Court*) atau Gugatan Perdata Biasa di Pengadilan Negeri serta proses mediasi.
5. **STAGE 5 - MULTIPLE CASES & AUDIT TRAIL**: Penelusuran sengketa ganda, gugatan balik (rekonvensi), dan pencatatan audit jejak perkara hukum.
6. **STAGE 6 - CASE JUDGEMENT / WITHDRAWAL**: Eksekusi putusan berkekuatan hukum tetap (*Inkrah*), Aanmaning, atau pencabutan perkara resmi karena adanya Akta Perdamaian (*Dading*).

### 17.4 Eksekusi Agunan & Pelelangan (8-Stage Repossession & Auction Workflow)
Tata kelola pemulihan aset agunan yang transparan dan akuntabel dalam 8 tahapan:
1. **STAGE 1 - MARKING**: Penandaan otomatis pada sistem bagi fasilitas macet DPD > 90 hari dengan agunan bernilai ekonomis.
2. **STAGE 2 - INITIATE REPO**: Penerbitan Surat Tugas Penarikan, SP-3 Eksekusi Agunan, dan koordinasi dengan aparat berwenang.
3. **STAGE 3 - ASSET DETAIL CAPTURING**: Penarikan aset fisik, verifikasi nomor rangka/mesin atau pemasangan plang pengawasan agunan, dan penyimpanan di *Stockyard* resmi.
4. **STAGE 4 - VALUATION ALLOCATION**: Penunjukan Kantor Jasa Penilai Publik (KJPP) independen rekanan bank.
5. **STAGE 5 - ASSET VALUATION**: Penetapan Nilai Pasar Wajar (*Fair Market Value*) dan Nilai Likuidasi (*Liquidation Value*).
6. **STAGE 6 - ASSET AUCTION / BIDDING**: Pendaftaran lelang eksekusi Hak Tanggungan/Fidusia ke KPKNL atau Balai Lelang swasta secara *open-bidding*.
7. **STAGE 7 - ASSET SALE**: Penetapan pemenang lelang, verifikasi pembayaran uang lelang, dan bea lelang negara.
8. **STAGE 8 - ASSET RELEASE**: Penerbitan Risalah Lelang resmi oleh Pejabat Lelang KPKNL, penghapusan hak tanggungan (roya), dan penyetoran hasil lelang untuk pelunasan baki debet pinjaman.

### 17.5 Manajemen Kompromi & Diskon (Settlement Management - 6-Stage Lifecycle & Multi-Tranches)
Siklus komprehensif penyelesaian kredit bermasalah melalui skema kompromi pelunasan terstruktur (berdasarkan arsitektur *Settlement Workflow*):

```mermaid
graph TD
    S1["1. Initiate Settlement<br/>(Verifikasi Kapasitas Debitur)"] --> S2["2. Generate Schedule<br/>(Single / Multi-Tranches)"]
    S2 --> S3["3. Draw Payment Plan<br/>(Alokasi Pokok vs Denda)"]
    S3 --> S4["4. Recommend & Approval Matrix<br/>(Jenjang Limit Komite)"]
    S4 --> S5["5. Payment Tracking<br/>(Realisasi Setoran & Bukti Bayar)"]
    S5 --> S6["6. Settlement Closure<br/>(Match-off & Penutupan Rekening)"]
```

1. **Stage 1 - INITIATE SETTLEMENT**: Inisiasi pengajuan permohonan diskon kompromi oleh kolektor/debitur. Mengakomodasi 3 skema:
   - **Net Settlement**: Kesepakatan nominal bersih lump-sum pelunasan dengan diskon total denda dan sebagian bunga tunggakan.
   - **Charge-Wise Settlement**: Keringanan spesifik per komponen (penghapusan denda keterlambatan 100%, potongan biaya penagihan, pelunasan pokok penuh).
   - **Auto Charge Allocation**: Penerimaan pembayaran sekaligus dari debitur yang langsung didistribusikan secara otomatis oleh mesin *recovery* perbankan dengan prioritas: **Pokok Pinjaman -> Bunga Berjalan/Tunggakan -> Biaya Administrasi & Denda**.
2. **Stage 2 - GENERATE SETTLEMENT SCHEDULE**: Pembuatan jadwal termin pembayaran bertahap (*Single* atau *Multi-Tranches* 1 s.d 6 termin), dengan penetapan tanggal jatuh tempo, metode pembayaran per termin (CASH, ONLINE_VA, QRIS, CHEQUE), dan nominal terinci.
3. **Stage 3 - DRAW PAYMENT PLAN**: Penyusunan matriks simulasi alokasi pelunasan kredit, pemisahan porsi pokok terbayar (*Principal Write-off Balance*), dan mitigasi risiko gagal bayar termin lanjutan.
4. **Stage 4 - RECOMMEND & APPROVAL MATRIX**: Proses eskalasi berjenjang sesuai batas kewenangan pemutus kredit (*Approval Authority Limit Matrix*):
   - **Collector / Staff**: Limit s.d Rp 10 Juta (Rekomendasi inisial)
   - **Branch Manager**: Limit s.d Rp 50 Juta (Persetujuan tingkat cabang)
   - **AR Head / Head of Recovery**: Limit s.d Rp 150 Juta (Persetujuan tingkat wilayah)
   - **Board of Directors / Komite Remedial Wilayah**: Limit > Rp 150 Juta atau diskon pokok > 30%
5. **Stage 5 - SETTLEMENT PAYMENT TRACKING**: Pemantauan real-time status setoran debitur per termin (*PAID* vs *PENDING* vs *OVERDUE*), integrasi notifikasi pengingat H-3 sebelum jatuh tempo termin, dan pencatatan nomor kuitansi resmi pelunasan.
6. **Stage 6 - SETTLEMENT CLOSURE & MATCH-OFF**: Rekonsiliasi akuntansi akhir, *match-off* pembukuan baki debet pada *Core Banking System*, penghapusan status tunggakan ke `STAGE_CLOSED` / `PAID_OFF`, penerbitan Surat Keterangan Lunas (SKL), dan pengembalian dokumen agunan (SHM/BPKB).

---

### 17.6 Fitur Pembeda Enterprise (Value Differentiators)
Fitur tata kelola strategis pengawasan tim penagihan internal dan agensi eksternal:

1. **Agency & Agent Onboarding (Alih Daya Penagihan)**:
   - Pendaftaran dan standarisasi agensi penagihan pihak ketiga (*External Collection Agencies*).
   - Pencatatan nomor kontrak kerja sama, masa berlaku izin operasional (*license expiry tracking*), jumlah tenaga kolektor aktif, tarif komisi sukses (*commission rate*), dan pemantauan performa rasio pemulihan (*recovery rate %*).
2. **Supervisory Review & Escalation**:
   - Peringatan otomatis bagi supervisor jika terdapat akun dengan DPD tinggi tanpa aktivitas penagihan melebihi SLA (*Action SLA Breached*).
   - Pengalihan antrean (*re-assignment*) instan secara massal (*bulk transfer*) antar kolektor.
3. **Authority Delegation (Out of Office / OOO Enablement)**:
   - Pendelegasian sementara hak persetujuan (*approval authority*) dari pejabat berwenang (misal: AR Head) kepada pejabat pelaksana tugas (misal: Senior Remedial Officer) saat cuti atau dinas luar kota.
   - Dilengkapi batas tanggal mulai & berakhir serta plafon limit wewenang maksimal (misal: limit s.d Rp 100 Juta).
4. **Round-Robin Allocation & Capacity Planning**:
   - Algoritma pembagian antrean penagihan secara dinamis dan seimbang (*Balanced Round-Robin Distribution*).
   - Pemantauan utilisasi kapasitas penagihan per petugas (standar optimal: 25 akun aktif per kolektor), dengan indikator status kesehatan beban: **OPTIMAL** (<70%), **NEAR CAPACITY** (70-90%), dan **OVERLOADED** (>90%).
5. **Frontend Easy Rule Creation (No-Code Rule Engine)**:
   - Konfigurasi parameter strategi penagihan secara visual tanpa memerlukan penulisan ulang kode program sumber (*source code*).

---

### 17.7 mCollect - Workbench Penagihan Lapangan Digital & CMS Incentive Engine
Modul operasional *mobile-first* terpadu bagi petugas kolektor lapangan (*Field Collector* / *Field Recovery Officer*) serta mesin insentif berbasis risiko:

1. **📋 Task List (Master Antrean Penugasan Kolektor)**:
   - Menampilkan seluruh daftar task/akun kredit bermasalah yang dialokasikan ke kolektor berdasarkan algoritma *Decision Engine* dan beban kerja.
   - Filter multi-dimensi berdasarkan kolektor spesifik (Andi Pratama, Budi Santoso, Rian Pratama, Dimas Kurniawan, dll.), bucket keterlambatan (1-3 s.d 31-60 DPD), dan status akun.
   - Fitur *Multi-Select Checkbox* untuk memilih beberapa akun sekaligus dan menekan tombol **`+ Masukkan ke Today's Plan`** secara massal.
   - Badge penanda status (*Sudah di Plan Rute #X* vs *Belum di Plan*).
   - Mengetuk baris task langsung memunculkan **Customer Form** interaktif.

2. **📅 Today's Plan (Rencana Rute & Target Harian Terpilih)**:
   - Daftar task penagihan yang telah dipilih kolektor untuk dieksekusi hari ini.
   - Disusun berdasarkan urutan rute perjalanan logis (*Route Sequence #1, #2, #3...*) dan estimasi waktu kunjungan (*09:00 WIB, 11:00 WIB*).
   - Metrik ringkasan target harian: Total Kunjungan Terencana, Jumlah Selesai / Dikunjungi (*Progress Bar %*), Target Nominal Tagihan Rute, dan Realisasi Uang Terkumpul Lapangan.
   - Pembaruan status eksekusi kunjungan secara dinamis: `PLANNED` (Belum), `IN_PROGRESS` (Menuju Lokasi), `VISITED` (Selesai Bertemu), `PTP` (Janji Bayar), dan `PAID` (Lunas).
   - Tombol aksi cepat untuk membuka Customer Form, catat bayar PIS, atau hapus dari jadwal harian.

3. **📄 Customer Form (Modal Informasi Lengkap Saat Task Di-klik)**:
   - Formulir detail komprehensif yang muncul saat task di-klik pada Task List maupun Today's Plan:
     - **Profil & Identitas**: CIF, NIK, Nama Lengkap, Pekerjaan, Alamat Domisili, dan Kota.
     - **Kontak & Komunikasi Cepat**: Tombol panggilan telepon langsung (`tel:`) dan chat WhatsApp otomatis (`wa.me`) dengan nomor debitur.
     - **Fasilitas Pinjaman**: Plafon Kredit, Model Aset/Jaminan, Angsuran Pokok+Bunga per bulan, Tenor Total & Terbayar.
     - **Status Tunggakan**: Nominal Overdue, DPD, Bucket Saat Ini, Risk Score & Level.
     - **Formulir Laporan Eksekusi Kunjungan Petugas**: Pencatatan status kontak (*Bertemu Debitur Langsung, Bertemu Pasangan/Keluarga, Debitur Pindah Alamat, Tidak di Tempat, Menolak Bayar*), input komitmen PTP (tanggal janji bayar & nominal PTP), serta catatan kunjungan lapangan (*Field Notes*).
     - **Integrasi Cepat 3 Alat Lapangan**: Terima bayar langsung (PIS), kirim link QRIS/VA ke WhatsApp, dan simulator pelunasan Rule 78.

4. **🔄 Reassign Collector (Pengalihan Tugas Antar Kolektor)**:
   - Memfasilitasi supervisor / AR Head untuk memindahkan portofolio penagihan antar kolektor (tunggal atau massal).
   - Pilihan alasan operasional baku: `OVERLOAD` (Kapasitas Penuh), `SICK_LEAVE` (Petugas Sakit/Cuti/OOO), `AREA_ROTATION` (Rotasi Wilayah Domisili), `PERFORMANCE_ESCALATION` (Eskalasi Kinerja Khusus), dan `OTHER`.
   - Sinkronisasi otomatis ke Today's Plan dan pencatatan audit trail permanen pada tabel `collector_reassignment_logs`.

5. **💰 CMS Incentive Engine Berbasis Bucket Flow Rate Modifier**:
   - Perhitungan insentif otomatis yang mengintegrasikan variabel **Bucket Flow Rate** (kemacetan bergeser ke tingkat lebih parah) sebagai faktor pengali bonus atau pengurang penalti:
     - **Insentif Dasar**: Standar Rp 3.000.000.
     - **Target KPI Utama**: Persentase uang tertagih (*Collection Rate %*) $\rightarrow$ $\text{Insentif Berjalan} = \text{KPI \%} \times \text{Insentif Dasar}$.
     - **Matriks Aturan Flow Rate Modifier** (Target Maksimal Toleransi Manajemen: **15%**):
       - `< 10%`: **Sangat Bagus** $\rightarrow$ Pengali **1.2** (Bonus naik 20%).
       - `10% – 15%`: **Memenuhi Target** $\rightarrow$ Pengali **1.0** (Insentif utuh 100%).
       - `15.1% – 20%`: **Buruk** $\rightarrow$ Pengurang **0.8** (Insentif dipotong 20%).
       - `> 20%`: **Sangat Buruk** $\rightarrow$ Pengurang **0.5** (Insentif dipotong 50%).
     - **Rumus Akhir**: $\text{Insentif Akhir} = \text{Insentif Berjalan} \times \text{Modifier}$.
     - **Contoh Pembuktian Kolektor Andi Pratama (KPI 90% $\rightarrow$ Insentif Berjalan Rp 2.700.000)**:
       - *Skenario A (Flow Rate 8%)*: $\text{Rp } 2.700.000 \times 1.2 = \mathbf{\text{Rp } 3.240.000}$ (Bonus).
       - *Skenario B (Flow Rate 18%)*: $\text{Rp } 2.700.000 \times 0.8 = \mathbf{\text{Rp } 2.160.000}$ (Penalti).
     - Dilengkapi **Live Interactive Slider Simulator**, **Tabel Rekapitulasi Portofolio Kolektor**, dan **Cetak Slip Insentif Digital Resmi**.

6. **Pencatatan Pembayaran Lapangan & Kuitansi Digital PIS (Payment Recording)**:
   - Pencatatan penerimaan pembayaran tunai (*CASH*), transfer *Virtual Account*, atau scan *QRIS* dinamis.
   - Perekaman koordinat GPS (*Geotagging*) dan cap waktu seketika saat uang diterima untuk mencegah *fraud*.
   - Penerbitan kuitansi digital elektronik (PIS) berstandar perbankan lengkap dengan nomor kuitansi unik berurutan, rincian pembayaran, kode validasi QR, nama kolektor, dan pengiriman otomatis ke WhatsApp nasabah (*Instant WhatsApp Receipt*).

7. **Permintaan Tautan Bayar Mandiri (Request Payment Link - QRIS & VA)**:
   - Debitur yang tidak memegang uang tunai dapat meminta dibuatkan tautan bayar mandiri.
   - Sistem men-*generate* kode QRIS dinamis atau nomor Virtual Account instan 24 jam dan langsung mengirimkan pesan instruksi bayar ke WhatsApp debitur.

8. **Simulator Pelunasan Dipercepat (Foreclosure / Early Payoff Calculator Rule 78)**:
   - Menghitung secara otomatis sisa pokok pinjaman (*Outstanding Principal*), bunga berjalan belum jatuh tempo (*Unbilled Interest*), potongan keringanan bunga (*Interest Rebate Rule 78*), biaya penalti pelunasan dipercepat (*Early Termination Fee* standar 3.5%), denda keterlambatan terhutang (*Late Fee Arrears*), serta total bersih pelunasan dipercepat (*Total Net Payoff Amount*).
   - Mengirimkan lembar penawaran resmi estimasi pelunasan langsung ke WhatsApp debitur dengan masa berlaku 7 hari kalender.

---

### 17.8 GeoTracker - Pemantauan GPS Lapangan Real-Time
Modul pengawasan posisi dan audit kepatuhan rute petugas lapangan bagi supervisor penagihan:

1. **Peta Interaktif Koridor DKI Jakarta (Interactive Vector Map)**:
   - Menampilkan posisi *live* seluruh armada kolektor internal dan agensi rekanan di wilayah operasional DKI Jakarta dan sekitarnya.
   - Penandaan warna status:
     - 🟢 **VISITING**: Petugas sedang melakukan kunjungan tatap muka di lokasi debitur (*Pulse marker*).
     - 🔵 **IN TRANSIT**: Petugas sedang dalam perjalanan bergerak menuju lokasi tujuan.
     - 🟡 **IDLE**: Petugas sedang diam/istirahat.
     - 🔴 **ANOMALY ALERT**: Terdeteksi indikasi anomali lapangan.
2. **Rekam Jejak Titik Rute & Animated Route Playback**:
   - Menampilkan kronologi seluruh titik perjalanan harian petugas (dari *Check-in* awal di kantor cabang, kunjungan 1 PTP, kunjungan 2 pembayaran, hingga negosiasi terkini).
   - Fitur *Playback* animasi: Mensimulasikan pergerakan petugas menyusuri rute harian secara berurutan dengan indikator kecepatan (*km/jam*), waktu tiba, dan durasi berhenti (*stop duration*).
3. **Analitik Waktu Produktif (Time Analytics)**:
   - Menganalisis alokasi waktu petugas: *Today Visits Count*, *Today Spent Minutes* (waktu efektif interaksi), *Transit Time Minutes* (waktu tempuh perjalanan), dan *Today Idle Minutes* (waktu tidak produktif).
4. **Deteksi Anomali Waktu Jeda & Kecepatan (Anomaly Detection Engine)**:
   - **Idle Time Outlier**: Memberikan tanda peringatan (*alert*) otomatis kepada supervisor jika durasi *idle* petugas melampaui batas wajar (> 120 menit) tanpa adanya pencatatan aktivitas kunjungan.
   - **Speed / Location Jump Outlier**: Mendeteksi lompatan titik koordinat yang tidak realistis atau kecepatan melebihi batas wajar (> 120 km/jam) untuk mencegah manipulasi GPS (*anti-GPS spoofing*).

---

## 18. Matriks Perbandingan Komprehensif: Sebelum vs Sesudah Patching

Tabel berikut menyajikan ringkasan perbedaan mendasar arsitektur CRMS sebelum dan sesudah pelaksanaan *Enterprise Architecture Patching*:

| Parameter Evaluasi | Sebelum Patching (Sistem Eksisting) | Sesudah Patching (Enterprise CRMS Engine) |
|:---|:---|:---|
| **Cakupan Lifecycle Penagihan** | Hanya DPD 1 s.d DPD 180 (Penagihan harian desk & field collection sederhana). | Menyeluruh dari **DPD 0 (Pre-Delinquency)** hingga litigasi hukum, lelang KPKNL, settlement 6 tahapan, dan match-off penutupan rekening. |
| **Siklus Settlement & Diskon** | Memo diskon manual ad-hoc tanpa pembagian tahapan dan tanpa jadwal cicilan bertahap. | **6-Stage Settlement Lifecycle**: Inisiasi, penjadwalan multi-tranches (1-6 termin), rencana bayar, approval matrix, payment tracking, & closure match-off. |
| **Pencegahan DPD 0 (Pre-Delinquency)** | Tidak ada pengawasan sebelum jatuh tempo. Akun baru ditangani saat DPD 1. | **Aktif Terintegrasi**: Pengecekan saldo CASA, kalender Tukin/Payroll ASN, dan alert FPD (Early Warning H-3 s.d H-0). |
| **Penanganan Multi-Fasilitas** | Terfragmentasi per nomor kontrak pinjaman. Tidak ada konsolidasi eksposur. | **Unified Customer 360° & Case Stamping**: Combo 1 Properti (KPR+KPA), Combo 2 (KTA+CC), single queue cross-facility. |
| **Alur Hukum (Legal Recourse)** | Dokumen hukum manual di luar sistem. Tidak terpantau tahapan persidangan. | **6-Stage Legal Recourse Workflow**: Somasi, alokasi lawyer, audit berkas APHT, jadwal sidang PN, hingga putusan Inkrah. |
| **Eksekusi Agunan & Lelang** | Penarikan aset sporadis tanpa standar pencatatan nilai pasar dan lelang. | **8-Stage Repossession & Auction Workflow**: Penandaan, stockyard tracking, appraisal KJPP, open bidding KPKNL, risalah lelang. |
| **Workbench Lapangan (mCollect)** | Kolektor membawa lembar tagihan fisik (*hardcopy*) dan kuitansi manual kertas. | **mCollect Digital Workbench**: Perekaman bayar lapangan instan, penerbitan kuitansi resmi digital (PIS), dan tautan bayar mandiri QRIS/VA ke WA debitur. |
| **Simulasi Pelunasan Dipercepat** | Debitur harus datang ke kantor cabang dan menunggu perhitungan manual petugas CS. | **Foreclosure Simulator Instan**: Hitung sisa pokok, rebate bunga Rule 78, penalti, denda, dan kirim surat penawaran pelunasan langsung ke WhatsApp. |
| **Pengawasan GPS Kolektor (GeoTracker)** | Posisi kolektor tidak terpantau secara real-time. Tidak ada riwayat rute harian. | **GeoTracker Live GPS**: Peta interaktif DKI Jakarta, pemantauan status real-time, animated route playback, dan deteksi anomali waktu idle (>120 mnt). |
| **Manajemen Agensi Eksternal** | Penugasan agensi dilakukan melalui email/surat manual tanpa integrasi sistem. | **Agency & Agent Onboarding**: Monitoring kontrak, izin, jumlah kolektor, recovery rate, dan tarif komisi sukses. |
| **Delegasi Wewenang (Out of Office)** | Pengajuan persetujuan macet saat pejabat komite cuti atau dinas luar kota. | **Authority Delegation (OOO)**: Pelimpahan hak persetujuan kompromi sementara dengan limit plafon dan batas waktu terkonfigurasi. |
| **Alokasi Beban Kerja Tim** | Pembagian akun tidak merata, berpotensi overload pada kolektor tertentu. | **Balanced Round-Robin & Capacity Planning**: Visualisasi utilitas kapasitas per kolektor (optimal 25 akun) dengan status optimal vs overloaded. |
| **Pelacakan Nasabah (Skip Tracing)** | Informasi debitur hilang kontak hanya di catatan kunjungan kolektor. | **Dedicated Skip Tracing Workflow**: Pelacak assigned, integrasi Dukcapil, mutasi CASA, dan verifikasi geo-tagging. |
| **Skrip & Personalisasi Komunikasi** | Template penagihan seragam tanpa mempertimbangkan profil risiko. | **Dynamic Persona Guidance Script**: Skrip dinamis adaptif profil risiko (Rendah/Sedang/Tinggi) & WhatsApp API gateway. |
| **Efisiensi Biaya Operasional** | Biaya lapangan tinggi akibat kunjungan fisik pada debitur berkategori ringan. | **Cost Efficiency Optimizer**: Hemat biaya hingga 95% dengan memprioritaskan kanal digital terarah pada DPD 0-14. |
| **Kepatuhan Regulasi & Audit Trail** | Catatan penagihan tersebar dan berisiko tidak memenuhi standar OJK. | **Full Audit Trail Compliance**: Setiap aksi tercatat dengan cap waktu, pelaksana, hasil penagihan, dan koordinat GPS anti-fraud. |
| **Kemandirian Brand & Lisensi** | Ketergantungan pada istilah platform proprietary pihak ketiga. | **100% Brand Netral & Mandiri**: Tanpa ketergantungan terminologi pihak ketiga, sesuai kebutuhan internal perbankan. |

---

## 19. Penutup & Lembar Persetujuan Dokumen

Implementasi **Collection & Recovery Management System (CRMS)** ini menjawab tuntas seluruh kebutuhan modernisasi penagihan Bank DKI / Bank Jakarta dengan mengadopsi pilar unggulan modernisasi sistem penagihan perbankan skala enterprise.

Sistem ini memastikan penagihan berjalan secara efisien biaya (*digital-first*), adil dan patuh regulasi (*script-driven & PDP compliance*), serta mampu memulihkan kredit bermasalah secara maksimal melalui alur kerja *Advanced Collections Lifecycle* yang terstruktur dan teruji.

---

### Lembar Persetujuan Dokumen Proposal (Sign-Off Sheet)

| Diajukan Oleh: | Ditinjau Oleh: | Disetujui Oleh: |
|:---:|:---:|:---:|
| <br><br>____________________<br>**CRMS Lead Architect**<br>Digital Banking & IT Solution | <br><br>____________________<br>**Head of Collection & Recovery**<br>Divisi Manajemen Risiko & Operasional | <br><br>____________________<br>**Direktur Teknologi & Operasional**<br>Bank DKI / Bank Jakarta |
| Tanggal: ........................ | Tanggal: ........................ | Tanggal: ........................ |

