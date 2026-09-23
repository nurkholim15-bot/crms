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
    - 11.1. Diagram & Model Arsitektur Enterprise 5-Tier (High-Level 5-Tier Architecture Model)
    - 11.2. Arsitektur Komponen Layanan Modular Backend (Domain Micro-Services Topology)
    - 11.3. Diagram Aliran Data End-to-End & Siklus Sinkronisasi
    - 11.4. Decision Engine (Scoring Model & Rule Engine)
    - 11.5. Gerbang Omnichannel & Arsitektur Pesan Pintar
    - 11.6. Arsitektur Workbench Lapangan (mCollect) & Sistem Telemetri GeoTracker
    - 11.7. Arsitektur Settlement 6-Stage & Supervisory Control Engine
    - 11.8. Arsitektur Keamanan, Kepatuhan UU PDP No. 27/2022 & Audit Trail
    - 11.9. Arsitektur Jaringan, Topologi Infrastruktur & Deployment (Production Stack)
12. [Spesifikasi Teknis & Skema Basis Data (Technical Specs & Data Model)](#12-spesifikasi-teknis--skema-basis-data-technical-specs--data-model)
    - 12.1. Arsitektur Komponen Terimplementasi (Production Stack)
    - 12.2. Entity Relationship Model (ERD) & Kamus Data Tabel Fisik
    - 12.3. Spesifikasi REST API v1 Terintegrasi
    - 12.4. Manajemen Pengguna & Role-Based Access Control (RBAC)
    - 12.5. Parameter Dinamis Lembaga Perbankan (`global_parameters`)
    - 12.6. Panduan Kompilasi & Deployment Mandiri ke VPS (Linux Systemd & Nginx SSL Port 3030)
    - 12.7. Manajemen Repositori Source Code & Git Workflow (GitHub)
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
- Jika seorang petugas kolektor sakit, cuti, atau berhalangan, supervisor (*AR Head* atau *Team Leader*) memiliki wewenang untuk mengalihkan penugasan akun secara manual dari Kolektor A ke Kolektor B secara individual maupun massal (*bulk re-assignment*).

### 5.7. Fitur Takeout Task Assignment Otomatis (Review Point 7.0)
- **Real-Time Payment Clearance**: Begitu core banking atau payment gateway menerima setoran debitur (via Virtual Account, transfer BI-FAST, atau teller), sistem CRMS secara instan mengubah status akun menjadi `PAID` dan menghapusnya dari antrean penagihan harian (*takeout task*).
- Menghilangkan risiko debitur yang sudah membayar tetap ditagih oleh bot atau kolektor lapangan.

### 5.8. Perhitungan Insentif Kolektor Terintegrasi (Review Point 8.0)
- Modul dashboard supervisor menyediakan penghitungan estimasi insentif penagihan berdasarkan:
  - Tingkat Keberhasilan Penagihan (*Cure Rate*)
  - Rasio Pemenuhan Janji Bayar (*Kept PTP Ratio*)
  - Nominal Pemulihan Piutang (*Recovery Cash Inflow*).

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

### 6.1. Klasifikasi 9 Bucket Overdue (Days Past Due / DPD)
```
[--- FASE AWAL / DECISION ENGINE (1-30 DPD) ---] | [--- FASE LANJUT / CORE BANKING SYSTEM RULE (>30 DPD) ---]
+-------+-------+--------+---------+---------+---------+----------+-----------+--------+
|  1-3  |  4-7  |  8-13  |  14-18  |  19-25  |  26-30  |  31-60   |  61-150   |  >150  |
+-------+-------+--------+---------+---------+---------+----------+-----------+--------+
```

### 6.2. Logika Pembagian Wewenang: Decision Engine vs Core Banking
1. **DPD 1–30 (Decision Engine Phase)**:
   - Dikelola oleh Decision Engine cerdas berbasis skor risiko (*behavioral scoring*).
   - Membagi akun ke dalam strategi **Champion** (proses lama EOD) dan **Challenger** (otomasi digital adaptif).
2. **DPD > 30 (Core Banking & Remedial Phase)**:
   - Dikelola oleh aturan ketat perbankan, berfokus pada pengamanan fisik agunan, somasi berjenjang, dan pemulihan aset macet (*Special Asset Management*).

### 6.3. Matriks Action Path & Penugasan PIC
| Grade | DPD 1-3 | DPD 4-7 | DPD 8-13 | DPD 14-18 | DPD 19-25 | DPD 26-30 | DPD 31-60 | DPD 61-150 | DPD > 150 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | Robot | DC | DC | DC | DC | DC | **Senior Field** | **Senior Field** | **Senior Field** |
| **2** | Robot | DC | DC | DC | DC | DC | **Senior Field** | **Senior Field** | **Senior Field** |
| **3** | WA | Robot | Robot | DC | DC | DC | **Senior Field** | **Senior Field** | **Senior Field** |
| **4** | WA | Robot | DC | DC | DC | DC | **Senior Field** | **Senior Field** | **Senior Field** |
| **5** | DC | DC | FC | FC | FC | FC | **Senior Field** | **Senior Field** | **Senior Field** |
| **6** | DC | FC | FC | FC | FC | FC | **Senior Field** | **Senior Field** | **Senior Field** |
| **7** | FC | FC | FC | FC | SFC | SFC | **Senior Field** | **Senior Field** | **Senior Field** |
| **8** | FC | FC | SFC | SFC | SFC | SFC | **Senior Field** | **Senior Field** | **Senior Field** |
| **VIP** | **Special Team** | **Special Team** | **Special Team** | **Special Team** | **Special Team** | **Special Team** | **Special Team** | **Special Team** | **Special Team** |

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

### 11.1. Diagram & Model Arsitektur Enterprise 5-Tier (High-Level 5-Tier Architecture Model)

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

### 11.2. Arsitektur Komponen Layanan Modular Backend (Domain Micro-Services Topology)

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

### 11.3. Diagram Aliran Data End-to-End & Siklus Sinkronisasi

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

### 11.4. Decision Engine (Scoring Model & Rule Engine)

Decision Engine CRMS adalah otak analitis cerdas yang mengevaluasi setiap akun kredit tertunggak pada siklus harian EOD maupun pembaruan transaksi *near-real-time*. Arsitektur engine ini memadukan dua subsistem inti: **Collection Scoring Model (Behavioral & Risk Scoring)** dan **Rule-Based Allocation Engine (Action Path Matrix)**.

```mermaid
graph TD
    A["Data Debitur & Fasilitas Kredit"] --> B["Collection Scoring Engine"]
    
    subgraph SCORING_MODEL["1. Model Skoring Koleksi (Skala 0 - 1000 Poin)"]
        B1["Karakteristik Pinjaman (30%)<br>• Plafon & Rasio Baki Debet<br>• Jenis Kredit (KPR/KTA/KUR/CC)<br>• Debt Service Ratio (DSR)"]
        B2["Riwayat Perilaku Bayar (35%)<br>• Frekuensi DPD 12 Bulan Terakhir<br>• Kept PTP Ratio vs Broken PTP<br>• Kecepatan Cure Bulan Lalu"]
        B3["Faktor Demografi & Pekerjaan (20%)<br>• Payroll ASN DKI / BUMN<br>• Autodebet vs Transfer Mandiri<br>• Stabilitas Masa Kerja"]
        B4["Kualitas Agunan (15%)<br>• Ada Agunan SHM/SHGB/BPKB<br>• Current Loan-to-Value (LTV)"]
        B --> B1 & B2 & B3 & B4
    end

    B1 & B2 & B3 & B4 --> C["Agregasi Skor Risiko Kredit: 0 - 1000"]

    C --> D{"Klasifikasi Level Risiko"}
    D -->|Skor >= 700| D1["LOW RISK<br>(Kredit Baik / Risiko Rendah)"]
    D -->|Skor 450 - 699| D2["MEDIUM RISK<br>(Kredit Perhatian / Risiko Sedang)"]
    D -->|Skor < 450| D3["HIGH RISK<br>(Kredit Rawan / Risiko Tinggi)"]
    D -->|Flag VIP = True| D4["VIP PORTFOLIO<br>(Nasabah Prioritas Bank)"]

    subgraph STRATEGY_ASSIGNMENT["2. Alokasi Strategi Penagihan (Grade 1 - 8)"]
        D1 --> E1["Challenger Grade 3 & 4<br>(Digital-First: WA Bot -> Robo Call)"]
        D2 --> E2["Challenger Grade 5 & 6<br>(Hybrid: Robo Call / DC -> Field Visit)"]
        D3 --> E3["Challenger Grade 7 & 8<br>(Field Officer Langsung DPD 1)"]
        D4 --> E4["Special Team (AR Head)<br>(Penanganan Personal Eksklusif)"]
    end

    E1 & E2 & E3 --> F["Matriks Action Path x Bucket DPD 1-30"]
    F --> G["Penugasan PIC Otomatis<br>(WA, Robot, DC, FC, SFC, Senior Field)"]
```

#### 11.4.1. Filosofi & Perbedaan Collection Scoring vs Application Scoring
* **Application Scoring (Credit Origination)**: Menilai kelayakan calon debitur saat permohonan kredit diajukan berdasarkan data historis statis (slip gaji, rekening koran, riwayat SLIK OJK). Tujuannya adalah keputusan biner: *Approve* atau *Reject*.
* **Collection Scoring (Behavioral Recovery Scoring)**: Menilai **kemungkinan debitur memulihkan pembayarannya (*Cure Probability*)** dan **probabilitas akun melompat ke bucket keterlambatan yang lebih dalam (*Roll Rate Probability*)** setelah debitur mengalami keterlambatan pembayaran (DPD 1+). Tujuannya adalah menentukan **rekomendasi kanal penagihan paling hemat biaya** dan **urgensi intervensi petugas penagih lapangan**.

#### 11.4.2. Parameter & Bobot Pembentuk Skor Koleksi (Collection Scoring Variables)
CRMS menerapkan algoritma pembobotan multi-faktor standar industri perbankan dengan rentang skor **0 s/d 1000 Poin**:

$$\text{Risk Score} = \sum_{i=1}^{n} (w_i \times S_i)$$

| Kategori Parameter | Bobot ($w_i$) | Variabel Pengukuran | Indikator Skor Tinggi (Skor $\ge 700$) | Indikator Skor Rendah (Skor $< 450$) |
|---|:---:|---|---|---|
| **Riwayat Perilaku Bayar (*Repayment Behavior*)** | **35%** | • Keberhasilan janji bayar (*Kept PTP Ratio*)<br>• Frekuensi menunggak 6–12 bulan terakhir<br>• Kecepatan pelunasan (*average days to cure*) | PTP selalu ditepati ($> 85\%$), jarang menunggak, cepat kembali ke Kol-1 dalam tempo $\le 5$ hari. | Sering ingkar janji (*broken PTP* $> 50\%$), menunggak berulang hampir setiap bulan, lambat bayar. |
| **Karakteristik Kredit (*Loan Profile*)** | **30%** | • Baki debet & rasio pemakaian plafon<br>• Jenis fasilitas pinjaman<br>• Rasio angsuran terhadap estimasi gaji (DSR) | Angsuran proporsional terhadap penghasilan ($DSR \le 35\%$), fasilitas beragunan SHM (KPR), limit kartu kredit terkendali. | DSR tinggi ($> 50\%$), fasilitas tanpa agunan (KTA/CC) dengan utilisasi limit maksimal ($> 90\%$). |
| **Profil Demografi & Pekerjaan** | **20%** | • Jenis instansi pemberi kerja<br>• Mekanisme pembayaran cicilan<br>• Status kepegawaian | ASN/PNS Pemprov DKI Jakarta, pegawai tetap BUMN, skema potong gaji otomatis (*payroll autodebet*). | Pekerja kontrak/lepas, wiraswasta dengan omzet fluktuatif, pembayaran manual transfer. |
| **Kualitas & Nilai Agunan (*Collateral Coverage*)** | **15%** | • Ada/tidaknya agunan fisik<br>• Rasio nilai pinjaman terhadap taksiran agunan (*LTV*)<br>• Legalitas sertifikat (SHM/SHGB/BPKB) | Agunan properti bernilai likuid tinggi dengan $LTV \le 60\%$, sertifikat SHM terikat Hak Tanggungan sempurna. | Kredit tanpa agunan (unsecured) atau agunan bergerak dengan depresiasi tinggi ($LTV > 90\%$). |

#### 11.4.3. Matriks Klasifikasi Level Risiko & Strategi Penagihan

| Level Risiko | Rentang Skor | Karakteristik Debitur | Saluran Rekomendasi Utama | Tindakan Decision Engine | Estimasi Efisiensi Biaya |
|---|:---:|---|---|---|:---:|
| **`LOW_RISK`** | **700 – 1000** | Debitur prima, menunggak akibat kelalaian jadwal/libur perbankan atau kendala autodebet temporer. Kemauan bayar sangat tinggi. | **WhatsApp AutoBot** & SMS Gateway | Masuk ke **Grade 3 atau 4** (Challenger Digital-First). Tidak memerlukan kunjungan lapangan pada DPD 1–30. | **90% – 95%** |
| **`MEDIUM_RISK`** | **450 – 699** | Debitur musiman (*seasonal*), arus kas bisnis berfluktuasi, atau ASN yang menunggu rapel tunjangan kinerja (Tukin). Membutuhkan edukasi dan reminder terjadwal. | **Smart Robo Call** & **Desk Collector (DC)** | Masuk ke **Grade 5 atau 6** (Challenger Hybrid). Kombinasi panggilan otomatis dan telepon personal kolektor. | **70% – 80%** |
| **`HIGH_RISK`** | **0 – 449** | Debitur kronis, riwayat *broken PTP* berulang, nomor telepon kerap tidak aktif, agunan mengalami sengketa/depresiasi. | **Field Collector (FC)** & **Senior Field (SFC)** | Masuk ke **Grade 7 atau 8** (Challenger Intensive Field). Langsung dilakukan verifikasi fisik sejak DPD 1–7. | **Baseline Field** |
| **`VIP`** | **Khusus** | Nasabah simpanan besar / High Net Worth Individuals / Kredit Korporasi & Komersial penting. | **Dedicated Special Team (AR Head)** | Tidak melalui bot digital / outbound call center. Dikelola melalui Portal Eksklusif AR Head. | N/A (Preservasi Hubungan Nasabah) |

#### 11.4.4. Matriks Pemetaan Action Path (Grade 1–8) x 9 Bucket DPD
Berdasarkan kombinasi Traffic (Champion vs Challenger) dan Risk Level dari scoring, Decision Engine menentukan petugas (PIC) penangan:

| Action Path (Grade) | Segmentasi & Dasar Penentuan | DPD 1–3 | DPD 4–7 | DPD 8–13 | DPD 14–18 | DPD 19–25 | DPD 26–30 | DPD 31–60 | DPD 61–150 | DPD >150 |
|:---:|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **AP 1** | Champion Group (Baseline) | Robot | DC | DC | DC | DC | DC | Senior Field | Senior Field | Senior Field |
| **AP 2** | Champion Group (Baseline) | Robot | DC | DC | DC | DC | DC | Senior Field | Senior Field | Senior Field |
| **AP 3** | Challenger — Low Risk | **WA** | **Robot** | **Robot** | DC | DC | DC | Senior Field | Senior Field | Senior Field |
| **AP 4** | Challenger — Low Risk | **WA** | **Robot** | DC | DC | DC | DC | Senior Field | Senior Field | Senior Field |
| **AP 5** | Challenger — Medium Risk | DC | DC | FC | FC | FC | FC | Senior Field | Senior Field | Senior Field |
| **AP 6** | Challenger — Medium Risk | DC | FC | FC | FC | FC | FC | Senior Field | Senior Field | Senior Field |
| **AP 7** | Challenger — High Risk | **FC** | **FC** | FC | FC | SFC | SFC | Senior Field | Senior Field | Senior Field |
| **AP 8** | Challenger — High Risk | **FC** | **FC** | SFC | SFC | SFC | SFC | Senior Field | Senior Field | Senior Field |
| **VIP** | VIP Portfolio | **Special** | **Special** | **Special** | **Special** | **Special** | **Special** | **Special** | **Special** | **Special** |

#### 11.4.5. Simulasi Evaluasi Ulang Dinamis (A/B Testing Champion vs Challenger)
* Sistem CRMS memungkinkan manajemen risiko melakukan **A/B Testing** perbandingan performa antara strategi penagihan konvensional (`CHAMPION`) dengan strategi cerdas berbasis skor risiko (`CHALLENGER`).
* Endpoint `POST /api/v1/overdue-accounts/:id/reevaluate` memungkinkan evaluasi instan jika terjadi perubahan profil debitur (misalnya penambahan komitmen PTP, perbaikan riwayat bayar, atau perubahan data kontak).

---

### 11.5. Gerbang Omnichannel & Arsitektur Pesan Pintar

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

### 11.6. Arsitektur Workbench Lapangan (mCollect) & Sistem Telemetri GeoTracker

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

### 11.7. Arsitektur Settlement 6-Stage & Supervisory Control Engine

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

### 11.8. Arsitektur Keamanan, Kepatuhan UU PDP No. 27/2022 & Audit Trail

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

### 11.9. Arsitektur Jaringan, Topologi Infrastruktur & Deployment (Production Stack)

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

### 12.2. Entity Relationship Model (ERD) & Kamus Data Tabel Fisik

```mermaid
erDiagram
    CUSTOMERS ||--o{ AGREEMENTS : "memiliki"
    AGREEMENTS ||--|| OVERDUE_ACCOUNTS : "memantau"
    OVERDUE_ACCOUNTS ||--o{ COLLECTION_ACTIVITIES : "mencatat log"

    CUSTOMERS {
        bigserial id PK
        varchar customer_no UK "CIF-00001"
        varchar name "Nama Lengkap Debitur"
        varchar phone "Nomor Telepon Seluler / WA"
        varchar email "Alamat Email"
        text address "Alamat Domisili KTP"
        varchar city "Kota Domisili"
        varchar occupation "Pekerjaan / Instansi (PNS Pemprov DKI / Swasta)"
        boolean is_vip "Flag Nasabah Prioritas Bank"
        timestamptz created_at
        timestamptz updated_at
    }

    AGREEMENTS {
        bigserial id PK
        varchar agreement_no UK "Nomor Rekening Pinjaman"
        bigint customer_id FK "Relasi ke customers(id)"
        varchar lob "KPR, KMK, KTA, KUR, CC"
        varchar asset_brand "Tipe Agunan (Properti SHM/SHGB, Deposito, Fidusia)"
        varchar asset_model "Spesifikasi Jaminan"
        varchar plate_no "Nomor Sertifikat / Bukti Kepemilikan Agunan"
        numeric total_financing "Plafon Pinjaman Pokok"
        numeric installment_amount "Kewajiban Angsuran Bulanan"
        bigint tenor_months "Jangka Waktu Pinjaman (Bulan)"
        bigint paid_tenor_months "Tenor Telah Dijalani"
        varchar branch_code "Kode Cabang Bank"
        varchar branch_name "Nama Kantor Cabang"
        timestamptz created_at
        timestamptz updated_at
    }

    OVERDUE_ACCOUNTS {
        bigserial id PK
        varchar agreement_no UK "Relasi ke agreements(agreement_no)"
        bigint dpd "Hari Keterlambatan (Days Past Due)"
        numeric overdue_amount "Nilai Tunggakan Total"
        varchar current_bucket "Bucket Keterlambatan (1-3, 4-7, ... >150)"
        bigint risk_score "Skor Risiko Debitur (0-1000)"
        varchar risk_level "LOW_RISK, MEDIUM_RISK, HIGH_RISK, VIP"
        varchar strategy_group "CHAMPION, CHALLENGER, VIP"
        varchar action_path "Action Path (1 s/d 8, VIP)"
        varchar assigned_pic "WA, Robot, DC, FC, SFC, Special Team"
        varchar pic_channel "AUTOMATION, HEAD_OFFICE, BRANCH, VIP"
        varchar status "OPEN, PROMISE_TO_PAY, PAID"
        varchar recovery_stage "STAGE_COLLECTION, STAGE_SKIP_TRACING, STAGE_RESTRUCTURING, STAGE_LEGAL_NOTICE, STAGE_LITIGATION_AUCTION, STAGE_SETTLEMENT, STAGE_CLOSED"
        varchar recommended_channel "WA_BOT, SMART_ROBOCALL, DESK_TELEPHONY, FIELD_VISIT, LEGAL_REMEDIAL"
        numeric cost_efficiency_rate "Tingkat Penghematan Biaya Kanal (0.00 - 1.00)"
        timestamptz last_contact_at
        timestamptz next_action_at
        timestamptz ptp_date "Tanggal Janji Bayar"
        numeric ptp_amount "Nominal Janji Bayar"
        text notes "Catatan Hasil Penanganan Kolektor"
        timestamptz created_at
        timestamptz updated_at
    }

    COLLECTION_ACTIVITIES {
        bigserial id PK
        bigint overdue_account_id FK "Relasi ke overdue_accounts(id)"
        varchar agreement_no "Nomor Rekening Pinjaman"
        varchar channel_type "WA, ROBO, DC, FC, SFC, AR_HEAD, REMEDIAL"
        varchar performed_by "Petugas / Sistem Pemroses"
        varchar contact_status "CONTACTED, UNREACHABLE, VISITED, PAID, STAGE_UPDATED"
        varchar result_code "PTP_MADE, PAID, ESCALATED, STAGE_MOVED"
        timestamptz ptp_date "Tanggal PTP"
        numeric ptp_amount "Nominal PTP"
        numeric geo_lat "Latitude GPS Kunjungan Lapangan"
        numeric geo_lng "Longitude GPS Kunjungan Lapangan"
        text notes "Berita Acara / Catatan Negosiasi"
        timestamptz created_at
    }

    GLOBAL_PARAMETERS {
        bigserial id PK
        varchar param_key UK "GENERAL_NAMA_PT, GENERAL_SIMBOL_PT"
        text param_value "Nilai Parameter Konfigurasi"
        varchar description "Deskripsi Parameter"
    }

    USERS {
        bigserial id PK
        varchar username UK "admin, ar_head, collector"
        varchar password "Hash Bcrypt"
        varchar full_name "Nama Pengguna"
        varchar email "Email"
        varchar role "ADMIN, AR_HEAD, COLLECTOR"
        boolean is_active "Status Keaktifan Akun"
        timestamptz last_login
        timestamptz created_at
        timestamptz updated_at
    }
```

---

### 12.3. Spesifikasi REST API v1 Terintegrasi

| Method | Endpoint URI | Deskripsi Fungsi | Parameter / Payload |
|---|---|---|---|
| `GET` | `/health` | Pemeriksaan kesehatan layanan (*health check*) | Status server, company name, timestamp |
| `POST` | `/api/v1/auth/login` | Autentikasi pengguna & pembuatan sesi JWT | `{"username": "admin", "password": "..."}` |
| `GET` | `/api/v1/auth/me` | Validasi sesi aktif dan hak akses pengguna | Header: `Authorization: Bearer <token>` |
| `POST` | `/api/v1/auth/logout` | Mengakhiri sesi login pengguna | Header: `Authorization: Bearer <token>` |
| `GET` | `/api/v1/users` | Daftar seluruh pengguna CRMS | Mengembalikan user list & role |
| `GET` | `/api/v1/dashboard/summary` | Ringkasan KPI, cure rate, roll rate & matriks Action Path | Agregasi sel matriks, total overdue, parameter instansi |
| `GET` | `/api/v1/overdue-accounts` | Daftar akun tertunggak dengan filter multi-parameter | Query: `bucket`, `action_path`, `assigned_pic`, `status`, `search`, `recovery_stage` |
| `GET` | `/api/v1/overdue-accounts/:id` | Detail akun tertunggak beserta riwayat penanganan | Path Param: ID akun |
| `POST` | `/api/v1/overdue-accounts/:id/reevaluate` | Pemicu evaluasi ulang Decision Engine secara manual | `{"is_champion": false}` |
| `PUT` | `/api/v1/overdue-accounts/:id/status` | Pembaharuan status akun, komitmen PTP, atau penugasan | `status`, `ptp_date`, `ptp_amount`, `notes` |
| **`GET`** | **`/api/v1/customers/:id/exposure-360`** | **Tampilan Terpadu Customer 360° lintas fasilitas pinjaman, linimasa omnichannel, dan skrip dialog terpandu** | **Path Param: ID Nasabah (`customer_id`)** |
| **`PUT`** | **`/api/v1/overdue-accounts/:id/recovery-stage`** | **Perubahan tahapan siklus pemulihan lanjutan (Skip Tracing, Restrukturisasi, Somasi, Litigasi, Settlement, Closed)** | **`{"recovery_stage": "STAGE_RESTRUCTURING", "reason": "...", "notes": "..."}`** |
| `POST` | `/api/v1/activities` | Pencatatan rekam jejak aktivitas penagihan (Audit Trail) | `channel_type`, `contact_status`, `result_code`, `ptp_date`, `notes` |
| `GET` | `/api/v1/activities/agreement/:no` | Riwayat seluruh interaksi pada satu nomor rekening pinjaman | Path Param: `agreement_no` |
| `POST` | `/api/v1/confins/eod-sync` | Simulasi sinkronisasi batch harian End of Day (EOD) | `{"increment_days": 1, "auto_cure_ratio": 0.08}` |
| `POST` | `/api/v1/confins/simulate-payment` | Simulasi pembayaran angsuran masuk (pelunasan / cure) | `{"agreement_no": "...", "amount": 4500000}` |
| `POST` | `/api/v1/confins/reset-demo` | Reset basis data ke kondisi awal seeder perbankan | Tanpa payload |
| `GET` | `/api/v1/vip/accounts` | Kueri akun debitur VIP khusus di bawah wewenang AR Head | Filter otomatis `action_path = 'VIP'` |
| `POST` | `/api/v1/vip/accounts/:no/action` | Penerapan instruksi perlakuan khusus oleh AR Head | `action_plan`, `assigned_specialist`, `notes`, `ptp_date` |

---

### 12.4. Manajemen Pengguna & Role-Based Access Control (RBAC)

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

### 12.5. Parameter Dinamis Lembaga Perbankan (`global_parameters`)
Identitas lembaga perbankan tidak di-hardcode melainkan dikonfigurasi melalui tabel `public.global_parameters`:
- **`GENERAL_NAMA_PT`**: Nama resmi bank (contoh: `"BANK DKI"` atau `"BANK JAKARTA"`).
- **`GENERAL_SIMBOL_PT`**: Simbol institusi (contoh: `"BDKI"` atau `"CRMS"`), otomatis menjadi prefix nomor rekening pinjaman (`BDKI-KPR-...`, `BDKI-KMK-...`), logo badge navigasi, dan kop dokumen tagihan.

---

### 12.6. Panduan Kompilasi & Deployment Mandiri ke VPS (Linux Systemd & Nginx SSL Port 3030)

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

### 12.7. Manajemen Repositori Source Code & Git Workflow (GitHub)

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

### 17.7 mCollect - Workbench Penagihan Lapangan Digital
Modul operasional *mobile-first* terpadu bagi petugas kolektor lapangan (*Field Collector* / *Field Recovery Officer*):

1. **Field Accounts Management**: Tampilan antrean kunjungan harian yang dioptimalkan untuk perangkat bergerak (*mobile/tablet*), dilengkapi informasi kontak debitur, riwayat DPD, dan rincian agunan.
2. **Pencatatan Pembayaran Lapangan (Payment Recording)**:
   - Pencatatan penerimaan pembayaran tunai (*CASH*), transfer *Virtual Account*, atau scan *QRIS*.
   - Perekaman koordinat GPS (*Geotagging*) dan cap waktu seketika saat uang diterima untuk mencegah *fraud*.
3. **Penerbitan Bukti Setor Digital Resmi (Payment Information Slip / PIS)**:
   - Penerbitan kuitansi digital elektronik (PIS) berstandar perbankan lengkap dengan nomor kuitansi unik berurutan, rincian pembayaran, kode validasi QR, dan nama kolektor.
   - Pengiriman otomatis bukti bayar PIS ke nomor WhatsApp nasabah seketika (*Instant WhatsApp Receipt*).
4. **Permintaan Tautan Bayar Mandiri (Request Payment Link - QRIS & VA)**:
   - Debitur yang tidak memegang uang tunai dapat meminta dibuatkan tautan bayar mandiri.
   - Sistem men-*generate* kode QRIS dinamis atau nomor Virtual Account instan 24 jam dan langsung mengirimkan pesan instruksi bayar ke WhatsApp debitur.
5. **Simulator Pelunasan Dipercepat (Foreclosure / Early Payoff Calculator)**:
   - Menjawab pertanyaan debitur: *"Berapa total yang harus saya bayar jika melunasi kredit hari ini?"*.
   - Menghitung secara otomatis:
     - Sisa Pokok Pinjaman (*Outstanding Principal*)
     - Bunga Berjalan Belum Jatuh Tempo (*Unbilled Interest*)
     - Potongan Keringanan Bunga (*Interest Rebate Rule 78*)
     - Biaya Penalti Pelunasan Dipercepat (*Early Termination Fee* standar 3.5%)
     - Denda Keterlambatan Terhutang (*Late Fee Arrears*)
     - Total Bersih Pelunasan Dipercepat (*Total Net Payoff Amount*)
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

