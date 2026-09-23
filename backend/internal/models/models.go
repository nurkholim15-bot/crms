package models

import (
	"time"
)

// Customer merepresentasikan debitur
type Customer struct {
	ID         uint        `gorm:"primaryKey" json:"id"`
	CustomerNo string      `gorm:"uniqueIndex;size:50" json:"customer_no"`
	Name       string      `gorm:"size:150;not null" json:"name"`
	Phone      string      `gorm:"size:30" json:"phone"`
	Email      string      `gorm:"size:100" json:"email"`
	Address    string      `gorm:"type:text" json:"address"`
	City       string      `gorm:"size:100" json:"city"`
	Occupation string      `gorm:"size:100" json:"occupation"`
	IsVIP      bool        `gorm:"column:is_vip;default:false" json:"is_vip"`
	Agreements []Agreement `gorm:"foreignKey:CustomerID" json:"agreements,omitempty"`
	CreatedAt  time.Time   `json:"created_at"`
	UpdatedAt  time.Time   `json:"updated_at"`
}

// Agreement merepresentasikan kontrak kredit / rekening pinjaman retail perbankan
type Agreement struct {
	ID                uint      `gorm:"primaryKey" json:"id"`
	AgreementNo       string    `gorm:"uniqueIndex;size:50;not null" json:"agreement_no"`
	CustomerID        uint      `gorm:"not null" json:"customer_id"`
	Customer          Customer  `gorm:"foreignKey:CustomerID" json:"customer"`
	LOB               string    `gorm:"size:50;default:'Kredit Konsumer'" json:"lob"` // Kredit Konsumer, Kredit Komersial, UMKM, Kartu Kredit
	AssetBrand        string    `gorm:"size:50;default:'KPR'" json:"asset_brand"`      // KPR, KMK, KTA, KUR, KPA, Multiguna, CC
	AssetModel        string    `gorm:"size:100;not null" json:"asset_model"`          // e.g. KPR Griya Utama, Modal Kerja Ritel, dll.
	PlateNo           string    `gorm:"size:150" json:"plate_no"`                      // Keterangan Agunan: No SHM/SHGB, Bilyet Deposito, Payroll
	TotalFinancing    float64   `gorm:"type:numeric(15,2)" json:"total_financing"`     // Plafon Kredit
	InstallmentAmount float64   `gorm:"type:numeric(15,2)" json:"installment_amount"` // Angsuran Pokok + Bunga
	TenorMonths       int       `json:"tenor_months"`
	PaidTenorMonths   int       `json:"paid_tenor_months"`
	BranchCode        string    `gorm:"size:20" json:"branch_code"`
	BranchName        string    `gorm:"size:100" json:"branch_name"`
	ComboGroup        string    `gorm:"size:100" json:"combo_group"` // e.g. COMBO_1_PROPERTY (KPR+KPA), COMBO_2_UNSECURED (KTA+CC)
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

// OverdueAccount merepresentasikan akun dalam proses penagihan (CRMS)
type OverdueAccount struct {
	ID                 uint       `gorm:"primaryKey" json:"id"`
	AgreementNo        string     `gorm:"uniqueIndex;size:50;not null" json:"agreement_no"`
	Agreement          Agreement  `gorm:"foreignKey:AgreementNo;references:AgreementNo;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"agreement"`
	DPD                int        `gorm:"not null;index" json:"dpd"`
	OverdueAmount      float64    `gorm:"type:numeric(15,2);not null" json:"overdue_amount"`
	CurrentBucket      string     `gorm:"size:20;not null;index" json:"current_bucket"` // 1-3, 4-7, 8-13, 14-18, 19-25, 26-30, 31-60, 61-150, >150
	RiskScore          int        `gorm:"not null" json:"risk_score"`                   // 0 - 1000
	RiskLevel          string     `gorm:"size:30;not null" json:"risk_level"`           // LOW_RISK, MEDIUM_RISK, HIGH_RISK
	StrategyGroup      string     `gorm:"size:30;not null" json:"strategy_group"`       // CHAMPION, CHALLENGER, VIP
	ActionPath         string     `gorm:"size:10;not null" json:"action_path"`          // 1 - 8, VIP
	AssignedPIC        string     `gorm:"size:30;not null" json:"assigned_pic"`         // ROBO, DERO, WA, FO, FRO, RSO, RRO, AR Head
	PICChannel         string     `gorm:"size:50;not null" json:"pic_channel"`          // HEAD_OFFICE, BRANCH, REMEDIAL, AR_HEAD
	RecoveryStage      string     `gorm:"size:50;default:'STAGE_COLLECTION';index" json:"recovery_stage"` // STAGE_COLLECTION, STAGE_SKIP_TRACING, STAGE_RESTRUCTURING, STAGE_LEGAL_NOTICE, STAGE_LITIGATION_AUCTION, STAGE_SETTLEMENT, STAGE_CLOSED
	RecommendedChannel string     `gorm:"size:50;default:'WA'" json:"recommended_channel"` // Smart Cost-Effective Channel
	CostEfficiencyRate float64    `gorm:"default:95.0" json:"cost_efficiency_rate"`    // Estimasi efisiensi biaya kanal (%)
	Status             string     `gorm:"size:30;default:'OPEN'" json:"status"`         // OPEN, PROMISE_TO_PAY, PAID, REPOSSESSED, LEGAL
	LastContactAt      *time.Time `json:"last_contact_at"`
	NextActionAt       *time.Time `json:"next_action_at"`
	PTPDate            *time.Time `json:"ptp_date"`
	PTPAmount          float64    `gorm:"type:numeric(15,2);default:0" json:"ptp_amount"`
	Notes              string     `gorm:"type:text" json:"notes"`
	CreatedAt          time.Time  `json:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at"`
}

// CollectionActivity mencatat rekam jejak histori penagihan (Audit Trail)
type CollectionActivity struct {
	ID               uint       `gorm:"primaryKey" json:"id"`
	OverdueAccountID uint       `gorm:"not null;index" json:"overdue_account_id"`
	AgreementNo      string     `gorm:"size:50;not null;index" json:"agreement_no"`
	ChannelType      string     `gorm:"size:30;not null" json:"channel_type"` // WA, ROBO, DERO, FO, FRO, RSO, RRO, AR Head
	PerformedBy      string     `gorm:"size:100;not null" json:"performed_by"`
	ContactStatus    string     `gorm:"size:50;not null" json:"contact_status"` // CONTACTED, UNREACHABLE, VISITED, REFUSED, PTP_MADE, PAID
	ResultCode       string     `gorm:"size:50" json:"result_code"`
	PTPDate          *time.Time `json:"ptp_date"`
	PTPAmount        float64    `gorm:"type:numeric(15,2);default:0" json:"ptp_amount"`
	GeoLat           float64    `gorm:"type:numeric(10,6)" json:"geo_lat"`
	GeoLng           float64    `gorm:"type:numeric(10,6)" json:"geo_lng"`
	Notes            string     `gorm:"type:text" json:"notes"`
	CreatedAt        time.Time  `json:"created_at"`
}

// DecisionRule menyimpan aturan acuan penugasan action path
type DecisionRule struct {
	ID            uint   `gorm:"primaryKey" json:"id"`
	StrategyGroup string `gorm:"size:30;not null" json:"strategy_group"`
	RiskCategory  string `gorm:"size:30;not null" json:"risk_category"`
	ActionPath    string `gorm:"size:10;not null" json:"action_path"`
	Bucket        string `gorm:"size:20;not null" json:"bucket"`
	AssignedPIC   string `gorm:"size:30;not null" json:"assigned_pic"`
	HandlingType  string `gorm:"size:100" json:"handling_type"`
	IsActive      bool   `gorm:"default:true" json:"is_active"`
}

// GlobalParameter memetakan tabel public.global_parameters
type GlobalParameter struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	ParamKey    string    `gorm:"size:100;uniqueIndex" json:"param_key"`
	ParamValue  string    `gorm:"type:text" json:"param_value"`
	Description string    `gorm:"size:225" json:"description"`
	CreatedAt   *time.Time `json:"created_at"`
	CreatedUser string    `gorm:"size:30" json:"created_user"`
	UpdatedAt   *time.Time `json:"updated_at"`
	UpdatedUser string    `gorm:"size:30" json:"updated_user"`
}

func (GlobalParameter) TableName() string {
	return "public.global_parameters"
}

// User merepresentasikan tabel users untuk otentikasi dan hak akses CRMS
type User struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	Username  string     `gorm:"size:50;uniqueIndex;not null" json:"username"`
	Password  string     `gorm:"size:255;not null" json:"-"`
	FullName  string     `gorm:"size:100;not null" json:"full_name"`
	Email     string     `gorm:"size:100" json:"email"`
	Role      string     `gorm:"size:30;not null;default:'COLLECTOR'" json:"role"` // ADMIN, AR_HEAD, COLLECTOR
	IsActive  bool       `gorm:"default:true" json:"is_active"`
	LastLogin *time.Time `json:"last_login"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

func (User) TableName() string {
	return "public.users"
}

// PreDelinquencyAccount merepresentasikan akun dalam pengawasan sebelum menunggak (DPD 0)
type PreDelinquencyAccount struct {
	ID                uint       `gorm:"primaryKey" json:"id"`
	AgreementNo       string     `gorm:"size:50;not null;index" json:"agreement_no"`
	Agreement         Agreement  `gorm:"foreignKey:AgreementNo;references:AgreementNo;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"agreement"`
	CustomerID        uint       `gorm:"not null;index" json:"customer_id"`
	Customer          Customer   `gorm:"foreignKey:CustomerID" json:"customer"`
	DueDate           time.Time  `json:"due_date"`
	InstallmentAmount float64    `gorm:"type:numeric(15,2);not null" json:"installment_amount"`
	CASABalance       float64    `gorm:"type:numeric(15,2);default:0" json:"casa_balance"`
	SalaryDate        int        `gorm:"default:25" json:"salary_date"` // Tanggal perkiraan payroll/tukin ASN
	PDMTriggerReason  string     `gorm:"size:100;not null" json:"pdm_trigger_reason"` // INSUFFICIENT_CASA, SALARY_DELAY_TUKIN, HIGH_UTILIZATION
	ReminderStatus    string     `gorm:"size:50;default:'PENDING'" json:"reminder_status"` // PENDING, WA_SENT, ROBO_CALLED, CURED
	RiskScore         int        `gorm:"default:750" json:"risk_score"`
	CuredAt           *time.Time `json:"cured_at"`
	Notes             string     `gorm:"type:text" json:"notes"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`
}

// LegalCase merepresentasikan alur penanganan hukum perbankan (6 Tahapan Legal Recourse)
type LegalCase struct {
	ID             uint       `gorm:"primaryKey" json:"id"`
	CaseNo         string     `gorm:"uniqueIndex;size:50;not null" json:"case_no"`
	AgreementNo    string     `gorm:"size:50;not null;index" json:"agreement_no"`
	Agreement      Agreement  `gorm:"foreignKey:AgreementNo;references:AgreementNo;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"agreement"`
	CustomerID     uint       `gorm:"not null;index" json:"customer_id"`
	Customer       Customer   `gorm:"foreignKey:CustomerID" json:"customer"`
	LegalStage     string     `gorm:"size:50;default:'STAGE_INITIATE'" json:"legal_stage"` // STAGE_INITIATE, STAGE_LAWYER_ALLOC, STAGE_DOC_APPROVAL, STAGE_PROCEEDINGS, STAGE_AUDIT_TRAIL, STAGE_JUDGEMENT_WITHDRAWAL
	LawyerName     string     `gorm:"size:100" json:"lawyer_name"`
	LawFirm        string     `gorm:"size:150" json:"law_firm"`
	CourtName      string     `gorm:"size:150" json:"court_name"`
	PoliceStation  string     `gorm:"size:150" json:"police_station"`
	ClaimAmount    float64    `gorm:"type:numeric(15,2);not null" json:"claim_amount"`
	HearingDate    *time.Time `json:"hearing_date"`
	LegalSection   string     `gorm:"size:150" json:"legal_section"` // e.g. Pasal 1243 KUHPerdata, UU Hak Tanggungan 4/1996, Fidusia
	Status         string     `gorm:"size:50;default:'ACTIVE'" json:"status"` // ACTIVE, DECIDED_WON, WITHDRAWN, SETTLED
	Notes          string     `gorm:"type:text" json:"notes"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
}

// RepossessionCase merepresentasikan alur eksekusi agunan & lelang (8 Tahapan Repo)
type RepossessionCase struct {
	ID                uint       `gorm:"primaryKey" json:"id"`
	RepoNo            string     `gorm:"uniqueIndex;size:50;not null" json:"repo_no"`
	AgreementNo       string     `gorm:"size:50;not null;index" json:"agreement_no"`
	Agreement         Agreement  `gorm:"foreignKey:AgreementNo;references:AgreementNo;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"agreement"`
	CustomerID        uint       `gorm:"not null;index" json:"customer_id"`
	Customer          Customer   `gorm:"foreignKey:CustomerID" json:"customer"`
	RepoStage         string     `gorm:"size:50;default:'STAGE_MARKING'" json:"repo_stage"` // STAGE_MARKING, STAGE_INITIATE_REPO, STAGE_ASSET_CAPTURING, STAGE_VALUATION_ALLOC, STAGE_ASSET_VALUATION, STAGE_AUCTION, STAGE_SALE, STAGE_RELEASE
	AssetType         string     `gorm:"size:50;not null" json:"asset_type"` // PROPERTI_SHM, PROPERTI_SHGB, KENDARAAN_BPKB, KIOS_PASAR
	AssetDescription  string     `gorm:"size:255;not null" json:"asset_description"`
	StockyardLocation string     `gorm:"size:150" json:"stockyard_location"`
	ValuationAgency   string     `gorm:"size:150" json:"valuation_agency"`
	MarketValue       float64    `gorm:"type:numeric(15,2);default:0" json:"market_value"`
	LiquidationValue  float64    `gorm:"type:numeric(15,2);default:0" json:"liquidation_value"`
	HighestBidAmount  float64    `gorm:"type:numeric(15,2);default:0" json:"highest_bid_amount"`
	BuyerName         string     `gorm:"size:100" json:"buyer_name"`
	Status            string     `gorm:"size:50;default:'IN_REPO'" json:"status"` // IN_REPO, AUCTION_ACTIVE, SOLD, RELEASED_TO_CUSTOMER
	Notes             string     `gorm:"type:text" json:"notes"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`
}

// SettlementProposal merepresentasikan program kompromi / diskon pelunasan (6 Tahap Lifecycle)
type SettlementProposal struct {
	ID                  uint                `gorm:"primaryKey" json:"id"`
	ProposalNo          string              `gorm:"uniqueIndex;size:50;not null" json:"proposal_no"`
	AgreementNo         string              `gorm:"size:50;not null;index" json:"agreement_no"`
	Agreement           Agreement           `gorm:"foreignKey:AgreementNo;references:AgreementNo;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"agreement"`
	CustomerID          uint                `gorm:"not null;index" json:"customer_id"`
	Customer            Customer            `gorm:"foreignKey:CustomerID" json:"customer"`
	SettlementStage     string              `gorm:"size:50;default:'STAGE_INITIATE'" json:"settlement_stage"` // STAGE_INITIATE, STAGE_SCHEDULE, STAGE_PLAN, STAGE_RECOMMEND_APPROVAL, STAGE_PAYMENT_TRACKING, STAGE_CLOSURE
	SettlementType      string              `gorm:"size:50;not null" json:"settlement_type"` // NET_SETTLEMENT, CHARGE_WISE_SETTLEMENT, AUTO_CHARGE_ALLOCATION
	OriginalOverdue     float64             `gorm:"type:numeric(15,2);not null" json:"original_overdue"`
	WaivedPenalty       float64             `gorm:"type:numeric(15,2);default:0" json:"waived_penalty"`
	WaivedInterest      float64             `gorm:"type:numeric(15,2);default:0" json:"waived_interest"`
	NetSettlementAmount float64             `gorm:"type:numeric(15,2);not null" json:"net_settlement_amount"`
	ApprovalStatus      string              `gorm:"size:50;default:'PENDING_APPROVAL'" json:"approval_status"` // PENDING_APPROVAL, RECOMMENDED, APPROVED_BY_COMMITTEE, REJECTED, SENT_BACK, PAID_OFF
	RecommendationTier  string              `gorm:"size:50;default:'COLLECTOR'" json:"recommendation_tier"` // COLLECTOR, BRANCH_MANAGER, AR_HEAD, DIRECTOR
	RecommendedTo       string              `gorm:"size:100" json:"recommended_to"`
	ApprovedBy          string              `gorm:"size:100" json:"approved_by"`
	PaymentDueDate      *time.Time          `json:"payment_due_date"`
	TotalTranches       int                 `gorm:"default:1" json:"total_tranches"`
	Tranches            []SettlementTranche `gorm:"foreignKey:SettlementProposalID;constraint:OnDelete:CASCADE;" json:"tranches"`
	Notes               string              `gorm:"type:text" json:"notes"`
	CreatedAt           time.Time           `json:"created_at"`
	UpdatedAt           time.Time           `json:"updated_at"`
}

// SkipTracingCase merepresentasikan investigasi pelacakan kontak debitur yang hilang kontak
type SkipTracingCase struct {
	ID            uint       `gorm:"primaryKey" json:"id"`
	CaseNo        string     `gorm:"uniqueIndex;size:50;not null" json:"case_no"`
	AgreementNo   string     `gorm:"size:50;not null;index" json:"agreement_no"`
	Agreement     Agreement  `gorm:"foreignKey:AgreementNo;references:AgreementNo;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"agreement"`
	CustomerID    uint       `gorm:"not null;index" json:"customer_id"`
	Customer      Customer   `gorm:"foreignKey:CustomerID" json:"customer"`
	TracerPIC     string     `gorm:"size:100;not null" json:"tracer_pic"`
	TracingStatus string     `gorm:"size:50;default:'INITIATED'" json:"tracing_status"` // INITIATED, ASSIGNED, IN_PROGRESS, FOUND, UNTRACEABLE
	NewPhone      string     `gorm:"size:50" json:"new_phone"`
	NewAddress    string     `gorm:"type:text" json:"new_address"`
	NewEmployer   string     `gorm:"size:100" json:"new_employer"`
	SourceInfo    string     `gorm:"size:100" json:"source_info"` // DUKCAPIL, CASA_MUTASI, EMERGENCY_CONTACT, FIELD_SURVEY
	Notes         string     `gorm:"type:text" json:"notes"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

// SettlementTranche merepresentasikan jadwal termin pembayaran settlement bertahap
type SettlementTranche struct {
	ID                  uint       `gorm:"primaryKey" json:"id"`
	SettlementProposalID uint       `gorm:"not null;index" json:"settlement_proposal_id"`
	TrancheNo           int        `gorm:"not null" json:"tranche_no"`
	DueDate             time.Time  `json:"due_date"`
	Amount              float64    `gorm:"type:numeric(15,2);not null" json:"amount"`
	PaymentMethod       string     `gorm:"size:50;default:'ONLINE_VA'" json:"payment_method"` // CASH, CHEQUE, ONLINE_VA, QRIS
	PaidAmount          float64    `gorm:"type:numeric(15,2);default:0" json:"paid_amount"`
	PaidAt              *time.Time `json:"paid_at"`
	PaymentStatus       string     `gorm:"size:50;default:'PENDING'" json:"payment_status"` // PENDING, PAID, OVERDUE
	ReceiptNo           string     `gorm:"size:50" json:"receipt_no"`
	CreatedAt           time.Time  `json:"created_at"`
	UpdatedAt           time.Time  `json:"updated_at"`
}

// CollectorGeoLocation merepresentasikan pemantauan GPS live real-time petugas lapangan
type CollectorGeoLocation struct {
	ID                  uint      `gorm:"primaryKey" json:"id"`
	CollectorUsername   string    `gorm:"uniqueIndex;size:100;not null" json:"collector_username"`
	CollectorName       string    `gorm:"size:100;not null" json:"collector_name"`
	AgencyName          string    `gorm:"size:100" json:"agency_name"`
	CurrentLat          float64   `gorm:"type:numeric(10,6);not null" json:"current_lat"`
	CurrentLng          float64   `gorm:"type:numeric(10,6);not null" json:"current_lng"`
	AccuracyMeters      float64   `gorm:"type:numeric(6,2);default:10" json:"accuracy_meters"`
	Status              string    `gorm:"size:50;default:'IDLE'" json:"status"` // VISITING, IN_TRANSIT, IDLE
	CurrentLocationName string    `gorm:"size:255" json:"current_location_name"`
	LastHeartbeat       time.Time `json:"last_heartbeat"`
	TodayVisitsCount    int       `gorm:"default:0" json:"today_visits_count"`
	TodayIdleMinutes    int       `gorm:"default:0" json:"today_idle_minutes"`
	TodaySpentMinutes   int       `gorm:"default:0" json:"today_spent_minutes"`
	TransitTimeMinutes  int       `gorm:"default:0" json:"transit_time_minutes"`
	AnomalyFlag         bool      `gorm:"default:false" json:"anomaly_flag"` // Deteksi transaksi mencurigakan / GPS spoofing
	AnomalyReason       string    `gorm:"size:255" json:"anomaly_reason"`
	BatteryPct          int       `gorm:"default:85" json:"battery_pct"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}

// CollectorRoutePoint merepresentasikan rekam jejak titik rute perjalanan harian (Location History & Animated Route)
type CollectorRoutePoint struct {
	ID                uint      `gorm:"primaryKey" json:"id"`
	CollectorUsername string    `gorm:"size:100;not null;index" json:"collector_username"`
	SequenceOrder     int       `gorm:"not null" json:"sequence_order"`
	Lat               float64   `gorm:"type:numeric(10,6);not null" json:"lat"`
	Lng               float64   `gorm:"type:numeric(10,6);not null" json:"lng"`
	LocationName      string    `gorm:"size:255" json:"location_name"`
	ActivityType      string    `gorm:"size:50;not null" json:"activity_type"` // CHECKIN, PAYMENT, RTS, PTP, TRANSIT, IDLE
	AgreementNo       string    `gorm:"size:50" json:"agreement_no"`
	DebtorName        string    `gorm:"size:100" json:"debtor_name"`
	RecordedAt        time.Time `json:"recorded_at"`
	DurationMinutes   int       `gorm:"default:0" json:"duration_minutes"`
	SpeedKmh          float64   `gorm:"type:numeric(5,2);default:0" json:"speed_kmh"`
	Notes             string    `gorm:"type:text" json:"notes"`
}

// PaymentReceiptSlip merepresentasikan modul PIS (Payment Information Slip / Kuitansi Digital Mobile)
type PaymentReceiptSlip struct {
	ID                uint      `gorm:"primaryKey" json:"id"`
	ReceiptNo         string    `gorm:"uniqueIndex;size:50;not null" json:"receipt_no"`
	AgreementNo       string    `gorm:"size:50;not null;index" json:"agreement_no"`
	CustomerID        uint      `gorm:"not null;index" json:"customer_id"`
	Customer          Customer  `gorm:"foreignKey:CustomerID" json:"customer"`
	AmountPaid        float64   `gorm:"type:numeric(15,2);not null" json:"amount_paid"`
	PaymentMethod     string    `gorm:"size:50;not null" json:"payment_method"` // CASH, QRIS, ONLINE_VA
	TrancheNumber     int       `gorm:"default:1" json:"tranche_number"`
	CollectorUsername string    `gorm:"size:100;not null" json:"collector_username"`
	CollectorName     string    `gorm:"size:100;not null" json:"collector_name"`
	ReceiptURL        string    `gorm:"size:255" json:"receipt_url"`
	WhatsAppSent      bool      `gorm:"default:false" json:"whatsapp_sent"`
	GeotagLat         float64   `gorm:"type:numeric(10,6)" json:"geotag_lat"`
	GeotagLng         float64   `gorm:"type:numeric(10,6)" json:"geotag_lng"`
	Notes             string    `gorm:"type:text" json:"notes"`
	IssuedAt          time.Time `json:"issued_at"`
}

// CollectionAgency merepresentasikan agensi penagihan eksternal (External Agency Onboarding)
type CollectionAgency struct {
	ID                     uint       `gorm:"primaryKey" json:"id"`
	AgencyCode             string     `gorm:"uniqueIndex;size:50;not null" json:"agency_code"`
	AgencyName             string     `gorm:"size:150;not null" json:"agency_name"`
	ContractNo             string     `gorm:"size:100;not null" json:"contract_no"`
	LicenseExpiry          *time.Time `json:"license_expiry"`
	ActiveCollectorsCount  int        `gorm:"default:0" json:"active_collectors_count"`
	AssignedAccountsCount  int        `gorm:"default:0" json:"assigned_accounts_count"`
	RecoveryRate           float64    `gorm:"type:numeric(5,2);default:0" json:"recovery_rate"`
	CommissionRate         float64    `gorm:"type:numeric(5,2);default:10" json:"commission_rate"`
	ContactPerson          string     `gorm:"size:100" json:"contact_person"`
	Phone                  string     `gorm:"size:50" json:"phone"`
	Status                 string     `gorm:"size:50;default:'ACTIVE'" json:"status"` // ACTIVE, SUSPENDED
	CreatedAt              time.Time  `json:"created_at"`
	UpdatedAt              time.Time  `json:"updated_at"`
}

// AuthorityDelegation merepresentasikan pendelegasian wewenang saat pejabat berhalangan (Out of Office Enablement)
type AuthorityDelegation struct {
	ID                 uint      `gorm:"primaryKey" json:"id"`
	DelegatorUsername  string    `gorm:"size:100;not null" json:"delegator_username"`
	DelegatorName      string    `gorm:"size:100;not null" json:"delegator_name"`
	DelegateUsername   string    `gorm:"size:100;not null" json:"delegate_username"`
	DelegateName       string    `gorm:"size:100;not null" json:"delegate_name"`
	StartDate          time.Time `json:"start_date"`
	EndDate            time.Time `json:"end_date"`
	ApprovalLimitAmount float64  `gorm:"type:numeric(15,2);not null" json:"approval_limit_amount"`
	Reason             string    `gorm:"size:255" json:"reason"`
	IsActive           bool      `gorm:"default:true" json:"is_active"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}


