--
-- PostgreSQL database dump
--

\restrict YhdPqdS26IguzkFyEwUIeYqNC73XSt18ekRTyNB7WjeaamBrkZhxwUREcvSlyE9

-- Dumped from database version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)
-- Dumped by pg_dump version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_table_access_method = heap;

--
-- Name: global_parameters; Type: TABLE; Schema: lims; Owner: -
--

CREATE TABLE public.global_parameters (
    id bigint NOT NULL,
    param_key character varying(100) NOT NULL,
    param_value text,
    description character varying(225),
    created_at timestamp with time zone,
    created_user character varying(30),
    updated_at timestamp with time zone,
    updated_user character varying(30),
    deleted_at timestamp with time zone,
    deleted_user character varying(30)
);


--
-- Name: global_parameters_id_seq; Type: SEQUENCE; Schema: lims; Owner: -
--

CREATE SEQUENCE public.global_parameters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: global_parameters_id_seq; Type: SEQUENCE OWNED BY; Schema: lims; Owner: -
--

ALTER SEQUENCE public.global_parameters_id_seq OWNED BY public.global_parameters.id;


--
-- Name: global_parameters id; Type: DEFAULT; Schema: lims; Owner: -
--

ALTER TABLE ONLY public.global_parameters ALTER COLUMN id SET DEFAULT nextval('public.global_parameters_id_seq'::regclass);


--
-- Data for Name: global_parameters; Type: TABLE DATA; Schema: lims; Owner: -
--

COPY public.global_parameters (id, param_key, param_value, description, created_at, created_user, updated_at, updated_user, deleted_at, deleted_user) FROM stdin;
1	PG_BIN_PATH	C:\\Program Files\\PostgreSQL\\18\\bin	Path ke folder BIN PostgreSQL (tempat pg_dump dan psql berada)	\N	\N	\N	\N	\N	\N
2	BACKUP_STORAGE_PATH	D:\\backup\\Postgres	Direktori penyimpanan file backup di sisi server	\N	\N	\N	\N	\N	\N
4	CERT_VALIDITY_DAYS	720	Masa berlaku sertifikat (dalam hari)	\N	\N	\N	\N	\N	\N
5	ENABLE_ASSET_CHECKING	False	Aktifkan validasi lokasi dan status aset saat pelaksanaan pengujian (true/false)	\N	\N	\N	\N	\N	\N
6	MAX_PASSWORD_ATTEMPTS	2	max attempt input password dengan default 3	\N	\N	\N	\N	\N	\N
8	SESSION_EXPIRY_MINUTES	1440	Duration of user session in minutes	\N	\N	\N	\N	\N	\N
9	SESSION_CLEANUP_HOURS	2	Hours to retain expired sessions before cleanup (expired more than X hours ago)	\N	\N	\N	\N	\N	\N
10	PWD_MIN_LENGTH	9	Minimum password length	\N	\N	\N	\N	\N	\N
11	PWD_ROTATION_DAYS	90	Days after which password must be changed	\N	\N	\N	\N	\N	\N
12	APP_NAME	MEC System	Application Name	\N	\N	\N	\N	\N	\N
13	SIDEBAR_BG	#064e3b	Sidebar background color	\N	\N	\N	\N	\N	\N
14	HEADER_BG	#065f46	Header background color	\N	\N	\N	\N	\N	\N
15	CONTENT_BG	#eff6ff	Main content background color	\N	\N	\N	\N	\N	\N
16	PRIMARY_COLOR	#10b981	Primary brand color	\N	\N	\N	\N	\N	\N
20	REPORT_HEADER_TITLE	LAPORAN TEKNIS HASIL PENGUJIAN	Header title for technical report	\N	\N	\N	\N	\N	\N
21	REPORT_SUBHEADER	MEC System	Sub-header title for technical report	\N	\N	\N	\N	\N	\N
22	CERT_HEADER_TITLE	SERTIFIKAT HASIL PENGUJIAN (SHP)	Header title for certificate report	\N	\N	\N	\N	\N	\N
23	CERT_SUBHEADER	MEC System Certification Hub	Sub-header title for certificate report	\N	\N	\N	\N	\N	\N
24	REPORT_INSTITUTION	PUSAT PENELITIAN DAN PENGEMBANGAN - MEC	Institution name in report	\N	\N	\N	\N	\N	\N
25	REPORT_FOOTER_NOTE	Laporan ini dihasilkan secara otomatis oleh MEC System.	Footer note for technical report	\N	\N	\N	\N	\N	\N
26	SCORE_THRESHOLD_PASS	75	General threshold for passing score (≥)	\N	\N	\N	\N	\N	\N
27	SCORE_THRESHOLD_NOTE	60	General threshold for passing with notes (≥)	\N	\N	\N	\N	\N	\N
40	DASHBOARD_STATS_CACHE_MINUTES	60	Menentukan berapa lama data dashboard disimpan di memori sebelum melakukan query ulang ke database. Default 5 (menit)	\N	\N	\N	\N	\N	\N
30	PARTITION_CHECK_INTERVAL_HOURS	0	Menentukan seberapa sering sistem mengecek dan membuat partisi tabel baru. Default 1 (jam)	\N	\N	\N	\N	\N	\N
41	ENABLE_PARTITION	0	sistem akan berhenti mencari atau membuat tabel partisi bulanan (testing_applications_YYYYMM) dan akan langsung membaca tabel utama (testing_applications) jika nilainya 0	\N	\N	\N	\N	\N	\N
47	SCANNER_FPS	30	Kecepatan frame scanner (Semakin tinggi semakin sensitif, default: 25)	\N	\N	\N	\N	\N	\N
48	SCANNER_QRBOX_SCALE	0.8	Ukuran kotak scan relatif terhadap layar (0.1 s/d 1.0, default: 0.7)	\N	\N	\N	\N	\N	\N
49	FRONTEND_DATA_TTL_SECONDS	30	Duration in seconds to cache frontend data before re-fetching from server	\N	\N	\N	\N	\N	\N
7	DASHBOARD_STATS_DAYS	30	Data yang ditampilkan 7 hari terakhir di dashboard	\N	\N	\N	\N	\N	\N
50	HANDOVER_FORMAT	BAP/ASSET/%d/%s	Format dokument BAP Disposal asset	\N	\N	\N	\N	\N	\N
43	ERROR_LOG_PATH	./logs/error.log	folder dan file error.log - win:D:/LIMS/logs/error.log	0001-01-01 07:07:24+07:07:12		2026-05-07 20:53:39.53908+07	nur	\N	
42	TRANS_LOG_PATH	./logs/trans.log	folder dan file trans.log - win:D:/LIMS/logs/trans.log	0001-01-01 07:07:24+07:07:12		2026-05-07 20:53:52.100428+07	nur	\N	
46	TRACE_LEVEL	3	Level detail log API (1: High, 2: Med, 3: Low)	0001-01-01 07:07:12+07:07:12		2026-05-09 13:56:46.62012+07	nur	\N	
28	CERT_NUMBER_FORMAT	CERT/LIMS/%Y/%05d	Format urut nomor sertifikat otomatis	\N	\N	\N	\N	\N	\N
18	WORKFLOW_ADMIN_EMAIL	nurkholim15@gmail.com	Email for administrative verification notification	\N	\N	\N	\N	\N	\N
19	WORKFLOW_PLAN_EMAIL	nkholim@yahoo.com	Email for planning team notification	\N	\N	\N	\N	\N	\N
53	PAGINATION_LIMIT	10	Jumlah data standar yang ditampilkan per halaman pada seluruh table	\N	\N	\N	\N	\N	\N
57	DEFAULT_ASSET_LOCATION	HO	Default lokasi penyimpanan saat registrasi aset	\N	system	\N	\N	\N	\N
58	DEFAULT_ASSET_STATUS	1	Default status aset saat registrasi baru	\N	system	\N	\N	\N	\N
3	ASSET_STATUS_CHECKIN	2	Kode status aset saat dinyatakan sudah di lokasi uji (Check-in)	0001-01-01 07:07:12+07:07:12		2026-04-28 11:12:46.874255+07	nur	\N	
45	DB_LOG_PATH	./logs/db_query.log	Path untuk log Query SQL - win:D:/LIMS/logs/db_query.log	0001-01-01 07:07:48+07:07:12		2026-05-11 09:12:59.053379+07	nur	\N	
56	PAGINATION_DROPDOWN_LIMIT	100	Jumlah data standar yang ditampilkan per dropdown dengan default 50	\N	\N	\N	\N	\N	\N
59	INVOICE_NUMBER_FORMAT	INV/{REG}/{UNIX}	Format Nomor Invoice. Placeholder: {REG}=No Registrasi, {UNIX}=Timestamp, {YYYY}=Tahun	2026-05-02 18:25:07.890159+07		2026-05-02 18:25:07.897688+07		\N	
61	FRONTEND_NOTIF_TTL_SECONDS	60	TTL untuk notifikasi dalam second	2026-05-11 20:51:43.859403+07	nur	2026-05-11 20:51:43.859403+07		\N	
44	API_LOG_PATH	./logs/api_traffic.log	Path untuk log trafik API (Req/Res) -win:D:/LIMS/logs/api_traffic.log	0001-01-01 07:07:24+07:07:12		2026-05-07 20:53:10.917663+07	nur	\N	
17	REG_NUMBER_FORMAT	%Y-%05d	Registration Number Format (%Y=Year, %d=Sequence), misal LIMS-%Y-%05d	0001-01-01 07:07:12+07:07:12		2026-05-27 19:47:23.584029+07	nur	\N	
62	ASSET_STATUS_DISPOSAL	Finalized	Syarat status assett disposal, default Finalized	2026-05-28 16:29:39.192274+07	nur	2026-05-28 17:01:15.406803+07	nur	\N	
67	AI_TIMEOUT	300	Interval Response Time-out AI dalam second (default 120 detik)	2026-06-05 06:53:13.945426+07	nur	2026-06-05 06:54:02.282412+07	nur	\N	
51	RATE_LIMIT_GENERAL_RPM	100	Batas request per menit untuk seluruh API (kecuali login)	0001-01-01 07:08:00+07:07:12		2026-06-24 17:06:03.299534+07	nur	\N	
68	AI_MAX_TOKENS	1000	Batas maksimum token output AI (Ollama). Default 1000, utk groq max 1.000	2026-06-05 13:39:14.197253+07	nur	2026-06-05 16:29:54.494996+07	nur	\N	
52	RATE_LIMIT_LOGIN_RPM	10	Batas percobaan login per menit untuk setiap alamat IP	0001-01-01 07:07:24+07:07:12		2026-08-10 20:35:24.124757+07	nur	\N	
63	ocr_code_col_min	0.05	min posisi field code di file PDF OCR (Default: 0.05 / 5% lebar halaman)	2026-06-01 10:39:07.365118+07	nur	2026-06-01 10:56:33.59491+07	nur	\N	
64	ocr_code_col_max	0.28	max posisi field code di file PDF OCR (Default: 0.22 / 22% lebar halaman)	2026-06-01 10:40:10.270505+07	nur	2026-06-01 10:56:59.802545+07	nur	\N	
69	AI_SIMILARITY_THRESHOLD	0.65	Batas toleransi kemiripan pencarian vektor. Semakin rendah angkanya, semakin ketat kecocokan dokumen yang dibutuhkan, Default 0.65	2026-06-06 12:48:31.628515+07	nur	2026-06-06 12:48:31.628515+07		\N	
70	AI_SEARCH_LIMIT	4	 Jumlah potongan teks (chunks) SOP teratas yang dikirim ke LLM sebagai konteks. Default 4	2026-06-06 12:49:11.422238+07	nur	2026-06-06 12:49:11.422238+07		\N	
82	RATE_LIMIT_HEAVY_ENDPOINTS	/api/applications, /api/reports, /api/assets, /api/users, /api/login, /api/logout, /api/travel-requests, /api/reimbursements, /api/invoices,  /api/payments, /api/invoices	list endpoint yang mengurangi  RATE LIMIT	2026-06-24 11:25:22.289476+07	nur	2026-06-26 18:51:18.07772+07	nur	\N	
71	AI_INTERVAL_CHAT	12000	Interval polling chat bantuan operator oleh UI (dalam milidetik). Default 2500 msec	0001-01-01 07:07:24+07:07:12		2026-06-08 10:22:53.886869+07	nur	\N	
72	AI_CHUNK_SIZE	1000	Ukuran chunk file pdf, default 1000	2026-06-09 07:15:03.532118+07	nur	2026-06-09 07:15:03.532118+07		\N	
73	AI_CHUNK_OVERLAP	200	Overlap Chunk file PDF, default 200	2026-06-09 07:16:02.822134+07	nur	2026-06-09 07:16:02.822134+07		\N	
83	REIMBURSE_NUMBER_FORMAT	REIM-%Y-%05d	Format nomor registrasi otomatis untuk Reimbursement	2026-06-28 17:39:52.976557+07	system	2026-06-28 17:39:52.976557+07	system	\N	\N
84	SPD_NUMBER_FORMAT	SPD-%Y-%05d	Format nomor registrasi otomatis untuk Surat Perjalanan Dinas (SPD)	2026-06-28 17:39:52.976557+07	system	2026-06-28 17:39:52.976557+07	system	\N	\N
75	PWD_EXPIRED_DAYS	3	Notification modal di UI Login akan expired dalam x days, default 7 days	2026-06-14 20:29:04.787096+07	nur	2026-06-14 20:29:04.787096+07		\N	
85	CASH_ADVANCE_NUMBER_FORMAT	ADV-%Y-%05d	Format nomor registrasi otomatis untuk Cash Advance (Kasbon)	2026-06-28 19:54:45.856656+07	system	2026-06-28 19:54:45.856656+07	system	\N	\N
76	AI_OCR_ENABLED	true	Enable AI OCR, default true (enable)	2026-06-15 09:11:13.289774+07	nur	2026-06-15 09:32:33.085988+07	nur	\N	
78	AI_PQC_ENABLED	true	Enable AI PQC (Predictive Quality Control) untuk checking atau deteksi anomaly Score Uji, default true (enable)	2026-06-15 09:13:42.559398+07	nur	2026-06-15 09:32:52.347096+07	nur	\N	
77	AI_REPORT_ENABLED	true	Enable AI Report Writer untuk analysis, default true (enable)	2026-06-15 09:12:24.481099+07	nur	2026-06-15 09:33:05.275809+07	nur	\N	
79	MIN_ANDROID_VERSION	1.2	Versi minimal aplikasi Android LIMS yang diperbolehkan	0001-01-01 07:07:12+07:07:12		2026-06-19 10:09:17.704557+07	nur	\N	
80	ANDROID_DOWNLOAD_URL	https://police-sacred-pound.ngrok-free.dev/downloads/lims-v1.3.apk	folder download Android	2026-06-19 07:25:23.903001+07	nur	2026-06-19 16:08:25.760322+07	nur	\N	
81	TOGGLE_SUB_ASPECT_ENABLE	false	Mengontrol hak akses toggle enable/disable sub-aspek di UI Pengujian	2026-06-22 13:49:23.363936+07	SYSTEM	2026-06-22 21:29:39.743901+07	nur	\N	
87	ALLOW_SESSION_TAKEOVER	true	Mengizinkan user mengambil alih sesi aktif lainnya saat login kembali jika bernilai true.	2026-07-11 20:51:30.296953+07	SYSTEM	2026-07-11 20:51:30.296953+07	SYSTEM	\N	\N
89	LOGIN_MAX_ATTEMPTS	5	Jumlah maksimal percobaan login salah sebelum akun dikunci sementara.	2026-07-11 20:51:30.296953+07	SYSTEM	2026-07-11 20:51:30.296953+07	SYSTEM	\N	\N
90	LOGIN_LOCKOUT_MINUTES	15	Durasi waktu (dalam menit) akun dikunci akibat salah password berturut-turut.	2026-07-11 20:51:30.296953+07	SYSTEM	2026-07-11 20:51:30.296953+07	SYSTEM	\N	\N
86	SINGLE_SESSION_MODE	false	Menentukan apakah user hanya boleh memiliki satu sesi aktif (true) atau multi sesi (false).	2026-07-11 20:51:30.296953+07	SYSTEM	2026-07-16 09:28:21.204486+07	nur	\N	
88	DEFAULT_IDLE_TIMEOUT_MINUTES	120	Batas waktu idle sistem default dalam menit sebelum sesi ditutup otomatis.	2026-07-11 20:51:30.296953+07	SYSTEM	2026-07-16 11:45:49.618453+07	nur	\N	
29	DATA_ARCHIVE_THRESHOLD_MONTHS	3	Ambang batas umur data (bulan) yang dapat diarsipkan (move to ARC tables)	0001-01-01 07:07:48+07:07:12		2026-07-27 13:52:08.496647+07	nur	\N	
97	ALLOWED_UPLOAD_EXTENSIONS	.pdf,.jpg,.jpeg,.png	Pembatasan extension file upload. .pdf,.jpg,.jpeg,.png,.docx,.xlsx,.doc,.xls,.txt,.zip,.rar	2026-08-11 06:41:56.743363+07	nur	2026-08-11 06:41:56.743363+07		\N	
96	MAX_UPLOAD_SIZE	400	Ukuran file upload dalam KB, default 2MB (2.097.152 Bytes)	2026-08-11 06:39:58.02228+07	nur	2026-08-11 06:53:31.233423+07	nur	\N	
98	MAX_SOP_UPLOAD_MB	50	Maksimum file size untuk file SOP yang diupload ke Chatbot dengan default 50MB	2026-09-01 09:21:50.180248+07	nur	2026-09-01 09:21:50.180248+07		\N	
65	ocr_skor_col_min	0.70	min posisi field Skor di file PDF OCR (Default: 0.70 / 70% lebar halaman)	2026-06-01 10:41:03.028051+07	nur	2026-06-01 11:09:40.528641+07	nur	\N	
66	ocr_skor_col_max	0.98	max posisi field Skor di file PDF OCR (Default: 0.98 / 98% lebar halaman)	2026-06-01 10:41:49.804157+07	nur	2026-06-01 10:41:49.804157+07		\N	
99	DROPDOWN_PILIHAN	-- Pilihan --	tampilan baris pertama dropdown pelaksanan uji	2026-09-12 16:54:39.166891+07	nur	2026-09-12 16:59:52.343637+07	nur	\N	
100	BUTTON_BG	#10B981	warna backgound tombol biru (#0078D4) hijau (#10B981)	2026-09-12 21:02:36.163231+07	nur	2026-09-13 12:04:56.235732+07	nur	\N	
101	BUTTON_CANCEL_BG	#F59E0B	Warna background tombol cancel	2026-09-12 21:03:18.124427+07	nur	2026-09-13 12:05:10.245204+07	nur	\N	
102	BUTTON_CLOSED_BG	#475569	Header background color	2026-09-12 21:04:00.211414+07	nur	2026-09-13 12:05:30.495849+07	nur	\N	
103	BUTTON_REVISI_BG	#10B981	Warna background tombol revisi	2026-09-13 10:39:05.860466+07	nur	2026-09-13 12:05:44.752748+07	nur	\N	
104	BUTTON_REPORT_BG	#0078D4	warna backgound tombol biru (#0078D4)	2026-09-13 12:12:01.779041+07	nur	2026-09-13 12:21:07.332079+07	nur	\N	
74	AI_METADATA_FOLDER	/mnt/c/Project/Application/lims/backend/ai_service/models	Shared folder path for AI-ML models (.onnx) and metadata JSON files	2026-06-13 09:04:37.531747+07	system	2026-09-18 16:33:41.657414+07	nur	\N	
\.


--
-- Name: global_parameters_id_seq; Type: SEQUENCE SET; Schema: lims; Owner: -
--

SELECT pg_catalog.setval('public.global_parameters_id_seq', 104, true);


--
-- Name: global_parameters global_parameters_pkey; Type: CONSTRAINT; Schema: lims; Owner: -
--

ALTER TABLE ONLY public.global_parameters
    ADD CONSTRAINT global_parameters_pkey PRIMARY KEY (id);


--
-- Name: global_parameters uni_global_parameters_param_key; Type: CONSTRAINT; Schema: lims; Owner: -
--

ALTER TABLE ONLY public.global_parameters
    ADD CONSTRAINT uni_global_parameters_param_key UNIQUE (param_key);


--
-- Name: idx_global_parameters_deleted_at; Type: INDEX; Schema: lims; Owner: -
--

CREATE INDEX idx_global_parameters_deleted_at ON public.global_parameters USING btree (deleted_at);


--
-- Name: TABLE global_parameters; Type: ACL; Schema: lims; Owner: -
--

GRANT ALL ON TABLE public.global_parameters TO lims_app;


--
-- Name: SEQUENCE global_parameters_id_seq; Type: ACL; Schema: lims; Owner: -
--

GRANT ALL ON SEQUENCE public.global_parameters_id_seq TO lims_app;


--
-- PostgreSQL database dump complete
--

\unrestrict YhdPqdS26IguzkFyEwUIeYqNC73XSt18ekRTyNB7WjeaamBrkZhxwUREcvSlyE9

