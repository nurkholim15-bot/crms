-- ==============================================================================
-- DATABASE DEFINITION LANGUAGE (DDL)
-- Project      : CRMS (Collection & Recovery Management System)
-- Segment      : Retail (Semua LOB Selain Fleet)
-- Client       : PT Toyota Astra Financial Services (TAF)
-- Engine       : PostgreSQL 14+ / 18+
-- Target DB    : crms_db
-- User / Role  : admin_lims
-- Password     : Nkl@130200
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PEMBUATAN ROLE & DATABASE (Jalankan sebagai superuser 'postgres' jika belum ada)
-- ------------------------------------------------------------------------------
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'admin_lims') THEN
      CREATE USER admin_lims WITH ENCRYPTED PASSWORD 'Nkl@130200';
   ELSE
      ALTER USER admin_lims WITH ENCRYPTED PASSWORD 'Nkl@130200';
   END IF;
END
$do$;

SELECT 'CREATE DATABASE crms_db OWNER admin_lims'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'crms_db')\gexec

GRANT ALL PRIVILEGES ON DATABASE crms_db TO admin_lims;

-- Sambungkan ke database crms_db:
-- \c crms_db admin_lims

-- ------------------------------------------------------------------------------
-- 2. RESET SCHEMA (OPSIONAL / UNTUK BUILD BARU)
-- ------------------------------------------------------------------------------
-- DROP TABLE IF EXISTS collection_activities CASCADE;
-- DROP TABLE IF EXISTS overdue_accounts CASCADE;
-- DROP TABLE IF EXISTS decision_rules CASCADE;
-- DROP TABLE IF EXISTS agreements CASCADE;
-- DROP TABLE IF EXISTS customers CASCADE;

-- ------------------------------------------------------------------------------
-- 3. TABEL: CUSTOMERS (Debitur)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id bigserial PRIMARY KEY,
    customer_no character varying(50),
    name character varying(150) NOT NULL,
    phone character varying(30),
    email character varying(100),
    address text,
    city character varying(100),
    is_vip boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_customer_no ON public.customers USING btree (customer_no);
CREATE INDEX IF NOT EXISTS idx_customers_is_vip ON public.customers USING btree (is_vip);

COMMENT ON TABLE public.customers IS 'Master data nasabah/debitur Retail TAF';
COMMENT ON COLUMN public.customers.is_vip IS 'Penanda nasabah prioritas/VIP yang wajib ditangani khusus oleh AR Head';

-- ------------------------------------------------------------------------------
-- 4. TABEL: AGREEMENTS (Kontrak Pembiayaan Kendaraan)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.agreements (
    id bigserial PRIMARY KEY,
    agreement_no character varying(50) NOT NULL,
    customer_id bigint NOT NULL,
    lob character varying(50) DEFAULT 'Retail Passenger',
    asset_brand character varying(50) DEFAULT 'Toyota',
    asset_model character varying(100) NOT NULL,
    plate_no character varying(20),
    total_financing numeric(15,2),
    installment_amount numeric(15,2),
    tenor_months bigint,
    paid_tenor_months bigint,
    branch_code character varying(20),
    branch_name character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_agreements_customer FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_agreements_agreement_no ON public.agreements USING btree (agreement_no);
CREATE INDEX IF NOT EXISTS idx_agreements_customer_id ON public.agreements USING btree (customer_id);
CREATE INDEX IF NOT EXISTS idx_agreements_branch_code ON public.agreements USING btree (branch_code);

COMMENT ON TABLE public.agreements IS 'Master data perjanjian pembiayaan otomotif Retail non-Fleet TAF';

-- ------------------------------------------------------------------------------
-- 5. TABEL: OVERDUE_ACCOUNTS (Portofolio Tunggakan Aktif CRMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.overdue_accounts (
    id bigserial PRIMARY KEY,
    agreement_no character varying(50) NOT NULL,
    dpd bigint NOT NULL,
    overdue_amount numeric(15,2) NOT NULL,
    current_bucket character varying(20) NOT NULL,
    risk_score bigint NOT NULL,
    risk_level character varying(30) NOT NULL,
    strategy_group character varying(30) NOT NULL,
    action_path character varying(10) NOT NULL,
    assigned_pic character varying(30) NOT NULL,
    pic_channel character varying(50) NOT NULL,
    status character varying(30) DEFAULT 'OPEN',
    last_contact_at timestamp with time zone,
    next_action_at timestamp with time zone,
    ptp_date timestamp with time zone,
    ptp_amount numeric(15,2) DEFAULT 0,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_overdue_agreements FOREIGN KEY (agreement_no) REFERENCES public.agreements(agreement_no) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_overdue_accounts_agreement_no ON public.overdue_accounts USING btree (agreement_no);
CREATE INDEX IF NOT EXISTS idx_overdue_accounts_dpd ON public.overdue_accounts USING btree (dpd);
CREATE INDEX IF NOT EXISTS idx_overdue_accounts_current_bucket ON public.overdue_accounts USING btree (current_bucket);
CREATE INDEX IF NOT EXISTS idx_overdue_accounts_assigned_pic ON public.overdue_accounts USING btree (assigned_pic);
CREATE INDEX IF NOT EXISTS idx_overdue_accounts_strategy_group ON public.overdue_accounts USING btree (strategy_group);
CREATE INDEX IF NOT EXISTS idx_overdue_accounts_risk_level ON public.overdue_accounts USING btree (risk_level);
CREATE INDEX IF NOT EXISTS idx_overdue_accounts_status ON public.overdue_accounts USING btree (status);

COMMENT ON TABLE public.overdue_accounts IS 'Akun penagihan tertunggak dengan status bucket DPD dan penugasan PIC';
COMMENT ON COLUMN public.overdue_accounts.current_bucket IS 'Bucket: 1-3, 4-7, 8-13, 14-18, 19-25, 26-30, 31-60, 61-150, >150';
COMMENT ON COLUMN public.overdue_accounts.strategy_group IS 'Kelompok strategi: CHAMPION, CHALLENGER, atau VIP';
COMMENT ON COLUMN public.overdue_accounts.action_path IS 'Jalur tindakan: 1 s/d 8 atau VIP';
COMMENT ON COLUMN public.overdue_accounts.assigned_pic IS 'PIC: ROBO, DERO, WA, FO, FRO, RSO, RRO, AR Head';

-- ------------------------------------------------------------------------------
-- 6. TABEL: COLLECTION_ACTIVITIES (Audit Trail & Log Interaksi Penagihan)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.collection_activities (
    id bigserial PRIMARY KEY,
    overdue_account_id bigint NOT NULL,
    agreement_no character varying(50) NOT NULL,
    channel_type character varying(30) NOT NULL,
    performed_by character varying(100) NOT NULL,
    contact_status character varying(50) NOT NULL,
    result_code character varying(50),
    ptp_date timestamp with time zone,
    ptp_amount numeric(15,2) DEFAULT 0,
    geo_lat numeric(10,6),
    geo_lng numeric(10,6),
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activities_overdue_account FOREIGN KEY (overdue_account_id) REFERENCES public.overdue_accounts(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_collection_activities_overdue_account_id ON public.collection_activities USING btree (overdue_account_id);
CREATE INDEX IF NOT EXISTS idx_collection_activities_agreement_no ON public.collection_activities USING btree (agreement_no);
CREATE INDEX IF NOT EXISTS idx_collection_activities_channel_type ON public.collection_activities USING btree (channel_type);
CREATE INDEX IF NOT EXISTS idx_collection_activities_created_at ON public.collection_activities USING btree (created_at);

COMMENT ON TABLE public.collection_activities IS 'Log rekam jejak aktivitas penagihan fisik, panggilan, bot WA, dan janji bayar';

-- ------------------------------------------------------------------------------
-- 7. TABEL: DECISION_RULES (Matriks Aturan Action Path Decision Engine)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.decision_rules (
    id bigserial PRIMARY KEY,
    strategy_group character varying(30) NOT NULL,
    risk_category character varying(30) NOT NULL,
    action_path character varying(10) NOT NULL,
    bucket character varying(20) NOT NULL,
    assigned_pic character varying(30) NOT NULL,
    handling_type character varying(100),
    is_active boolean DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_decision_rules_lookup ON public.decision_rules USING btree (action_path, bucket);

COMMENT ON TABLE public.decision_rules IS 'Tabel konfigurasi matriks Action Path x Bucket terhadap PIC penanganan';

-- ------------------------------------------------------------------------------
-- 8. INITIAL DATA: SEEDING MATRIKS ATURAN ACTION PATH TAF
-- ------------------------------------------------------------------------------
INSERT INTO public.decision_rules (strategy_group, risk_category, action_path, bucket, assigned_pic, handling_type, is_active)
VALUES
  -- CHAMPION (AP 1)
  ('CHAMPION', 'MEDIUM_RISK', '1', '1-3', 'DERO', 'Desk Call', true),
  ('CHAMPION', 'MEDIUM_RISK', '1', '4-7', 'DERO', 'Desk Call', true),
  ('CHAMPION', 'MEDIUM_RISK', '1', '8-13', 'FO', 'Field Officer Visit', true),
  ('CHAMPION', 'MEDIUM_RISK', '1', '14-18', 'FO', 'Field Officer Visit', true),
  ('CHAMPION', 'MEDIUM_RISK', '1', '19-25', 'FO', 'Field Officer Visit', true),
  ('CHAMPION', 'MEDIUM_RISK', '1', '26-30', 'FO', 'Field Officer Visit', true),
  ('CHAMPION', 'MEDIUM_RISK', '1', '31-60', 'FRO', 'Field Repossession', true),
  ('CHAMPION', 'MEDIUM_RISK', '1', '61-150', 'RSO', 'Recovery & Solution', true),
  ('CHAMPION', 'MEDIUM_RISK', '1', '>150', 'RRO', 'Remedial Recovery', true),

  -- CHAMPION (AP 2)
  ('CHAMPION', 'MEDIUM_RISK', '2', '1-3', 'ROBO', 'Robo Call Automated IVR', true),
  ('CHAMPION', 'MEDIUM_RISK', '2', '4-7', 'DERO', 'Desk Call', true),
  ('CHAMPION', 'MEDIUM_RISK', '2', '8-13', 'FO', 'Field Officer Visit', true),
  ('CHAMPION', 'MEDIUM_RISK', '2', '14-18', 'FO', 'Field Officer Visit', true),
  ('CHAMPION', 'MEDIUM_RISK', '2', '19-25', 'FO', 'Field Officer Visit', true),
  ('CHAMPION', 'MEDIUM_RISK', '2', '26-30', 'FO', 'Field Officer Visit', true),
  ('CHAMPION', 'MEDIUM_RISK', '2', '31-60', 'FRO', 'Field Repossession', true),
  ('CHAMPION', 'MEDIUM_RISK', '2', '61-150', 'RSO', 'Recovery & Solution', true),
  ('CHAMPION', 'MEDIUM_RISK', '2', '>150', 'RRO', 'Remedial Recovery', true),

  -- CHALLENGER: LOW RISK (AP 3 & 4)
  ('CHALLENGER', 'LOW_RISK', '3', '1-3', 'WA', 'WhatsApp Notification', true),
  ('CHALLENGER', 'LOW_RISK', '3', '4-7', 'WA', 'WhatsApp Notification', true),
  ('CHALLENGER', 'LOW_RISK', '3', '8-13', 'ROBO', 'Robo Call Automated IVR', true),
  ('CHALLENGER', 'LOW_RISK', '3', '14-18', 'ROBO', 'Robo Call Automated IVR', true),
  ('CHALLENGER', 'LOW_RISK', '3', '19-25', 'DERO', 'Desk Call', true),
  ('CHALLENGER', 'LOW_RISK', '3', '26-30', 'DERO', 'Desk Call', true),
  ('CHALLENGER', 'LOW_RISK', '3', '31-60', 'FRO', 'Field Repossession', true),
  ('CHALLENGER', 'LOW_RISK', '3', '61-150', 'RSO', 'Recovery & Solution', true),
  ('CHALLENGER', 'LOW_RISK', '3', '>150', 'RRO', 'Remedial Recovery', true),

  ('CHALLENGER', 'LOW_RISK', '4', '1-3', 'WA', 'WhatsApp Notification', true),
  ('CHALLENGER', 'LOW_RISK', '4', '4-7', 'WA', 'WhatsApp Notification', true),
  ('CHALLENGER', 'LOW_RISK', '4', '8-13', 'ROBO', 'Robo Call Automated IVR', true),
  ('CHALLENGER', 'LOW_RISK', '4', '14-18', 'ROBO', 'Robo Call Automated IVR', true),
  ('CHALLENGER', 'LOW_RISK', '4', '19-25', 'DERO', 'Desk Call', true),
  ('CHALLENGER', 'LOW_RISK', '4', '26-30', 'DERO', 'Desk Call', true),
  ('CHALLENGER', 'LOW_RISK', '4', '31-60', 'FRO', 'Field Repossession', true),
  ('CHALLENGER', 'LOW_RISK', '4', '61-150', 'RSO', 'Recovery & Solution', true),
  ('CHALLENGER', 'LOW_RISK', '4', '>150', 'RRO', 'Remedial Recovery', true),

  -- CHALLENGER: MEDIUM RISK (AP 5 & 6)
  ('CHALLENGER', 'MEDIUM_RISK', '5', '1-3', 'DERO', 'Desk Call', true),
  ('CHALLENGER', 'MEDIUM_RISK', '5', '4-7', 'DERO', 'Desk Call', true),
  ('CHALLENGER', 'MEDIUM_RISK', '5', '8-13', 'FO', 'Field Officer Visit', true),
  ('CHALLENGER', 'MEDIUM_RISK', '5', '14-18', 'FO', 'Field Officer Visit', true),
  ('CHALLENGER', 'MEDIUM_RISK', '5', '19-25', 'FO', 'Field Officer Visit', true),
  ('CHALLENGER', 'MEDIUM_RISK', '5', '26-30', 'FO', 'Field Officer Visit', true),
  ('CHALLENGER', 'MEDIUM_RISK', '5', '31-60', 'FRO', 'Field Repossession', true),
  ('CHALLENGER', 'MEDIUM_RISK', '5', '61-150', 'RSO', 'Recovery & Solution', true),
  ('CHALLENGER', 'MEDIUM_RISK', '5', '>150', 'RRO', 'Remedial Recovery', true),

  ('CHALLENGER', 'MEDIUM_RISK', '6', '1-3', 'ROBO', 'Robo Call Automated IVR', true),
  ('CHALLENGER', 'MEDIUM_RISK', '6', '4-7', 'DERO', 'Desk Call', true),
  ('CHALLENGER', 'MEDIUM_RISK', '6', '8-13', 'FO', 'Field Officer Visit', true),
  ('CHALLENGER', 'MEDIUM_RISK', '6', '14-18', 'FO', 'Field Officer Visit', true),
  ('CHALLENGER', 'MEDIUM_RISK', '6', '19-25', 'FO', 'Field Officer Visit', true),
  ('CHALLENGER', 'MEDIUM_RISK', '6', '26-30', 'FO', 'Field Officer Visit', true),
  ('CHALLENGER', 'MEDIUM_RISK', '6', '31-60', 'FRO', 'Field Repossession', true),
  ('CHALLENGER', 'MEDIUM_RISK', '6', '61-150', 'RSO', 'Recovery & Solution', true),
  ('CHALLENGER', 'MEDIUM_RISK', '6', '>150', 'RRO', 'Remedial Recovery', true),

  -- CHALLENGER: HIGH RISK (AP 7 & 8)
  ('CHALLENGER', 'HIGH_RISK', '7', '1-3', 'FO', 'Early Field Officer Visit', true),
  ('CHALLENGER', 'HIGH_RISK', '7', '4-7', 'FO', 'Early Field Officer Visit', true),
  ('CHALLENGER', 'HIGH_RISK', '7', '8-13', 'FO', 'Early Field Officer Visit', true),
  ('CHALLENGER', 'HIGH_RISK', '7', '14-18', 'FRO', 'Early Repossession Protocol', true),
  ('CHALLENGER', 'HIGH_RISK', '7', '19-25', 'FRO', 'Early Repossession Protocol', true),
  ('CHALLENGER', 'HIGH_RISK', '7', '26-30', 'FRO', 'Early Repossession Protocol', true),
  ('CHALLENGER', 'HIGH_RISK', '7', '31-60', 'FRO', 'Field Repossession', true),
  ('CHALLENGER', 'HIGH_RISK', '7', '61-150', 'RSO', 'Recovery & Solution', true),
  ('CHALLENGER', 'HIGH_RISK', '7', '>150', 'RRO', 'Remedial Recovery', true),

  ('CHALLENGER', 'HIGH_RISK', '8', '1-3', 'FO', 'Early Field Officer Visit', true),
  ('CHALLENGER', 'HIGH_RISK', '8', '4-7', 'FO', 'Early Field Officer Visit', true),
  ('CHALLENGER', 'HIGH_RISK', '8', '8-13', 'FO', 'Early Field Officer Visit', true),
  ('CHALLENGER', 'HIGH_RISK', '8', '14-18', 'FRO', 'Early Repossession Protocol', true),
  ('CHALLENGER', 'HIGH_RISK', '8', '19-25', 'FRO', 'Early Repossession Protocol', true),
  ('CHALLENGER', 'HIGH_RISK', '8', '26-30', 'FRO', 'Early Repossession Protocol', true),
  ('CHALLENGER', 'HIGH_RISK', '8', '31-60', 'FRO', 'Field Repossession', true),
  ('CHALLENGER', 'HIGH_RISK', '8', '61-150', 'RSO', 'Recovery & Solution', true),
  ('CHALLENGER', 'HIGH_RISK', '8', '>150', 'RRO', 'Remedial Recovery', true),

  -- VIP CUSTOMER PATH
  ('VIP', 'VIP_PORTFOLIO', 'VIP', '1-3', 'AR Head', 'AR Head Special Treatment', true),
  ('VIP', 'VIP_PORTFOLIO', 'VIP', '4-7', 'AR Head', 'AR Head Special Treatment', true),
  ('VIP', 'VIP_PORTFOLIO', 'VIP', '8-13', 'AR Head', 'AR Head Special Treatment', true),
  ('VIP', 'VIP_PORTFOLIO', 'VIP', '14-18', 'AR Head', 'AR Head Special Treatment', true),
  ('VIP', 'VIP_PORTFOLIO', 'VIP', '19-25', 'AR Head', 'AR Head Special Treatment', true),
  ('VIP', 'VIP_PORTFOLIO', 'VIP', '26-30', 'AR Head', 'AR Head Special Treatment', true),
  ('VIP', 'VIP_PORTFOLIO', 'VIP', '31-60', 'AR Head', 'AR Head Special Treatment', true),
  ('VIP', 'VIP_PORTFOLIO', 'VIP', '61-150', 'AR Head', 'AR Head Special Treatment', true),
  ('VIP', 'VIP_PORTFOLIO', 'VIP', '>150', 'AR Head', 'AR Head Special Treatment', true)
ON CONFLICT DO NOTHING;

-- Selesai
