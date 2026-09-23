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

// SettlementProposal merepresentasikan program kompromi / diskon pelunasan (3 Tipe)
type SettlementProposal struct {
	ID                  uint       `gorm:"primaryKey" json:"id"`
	ProposalNo          string     `gorm:"uniqueIndex;size:50;not null" json:"proposal_no"`
	AgreementNo         string     `gorm:"size:50;not null;index" json:"agreement_no"`
	Agreement           Agreement  `gorm:"foreignKey:AgreementNo;references:AgreementNo;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"agreement"`
	CustomerID          uint       `gorm:"not null;index" json:"customer_id"`
	Customer            Customer   `gorm:"foreignKey:CustomerID" json:"customer"`
	SettlementType      string     `gorm:"size:50;not null" json:"settlement_type"` // NET_SETTLEMENT, CHARGE_WISE_SETTLEMENT, AUTO_CHARGE_ALLOCATION
	OriginalOverdue     float64    `gorm:"type:numeric(15,2);not null" json:"original_overdue"`
	WaivedPenalty       float64    `gorm:"type:numeric(15,2);default:0" json:"waived_penalty"`
	WaivedInterest      float64    `gorm:"type:numeric(15,2);default:0" json:"waived_interest"`
	NetSettlementAmount float64    `gorm:"type:numeric(15,2);not null" json:"net_settlement_amount"`
	ApprovalStatus      string     `gorm:"size:50;default:'PENDING_APPROVAL'" json:"approval_status"` // PENDING_APPROVAL, APPROVED_BY_COMMITTEE, REJECTED, PAID_OFF
	ApprovedBy          string     `gorm:"size:100" json:"approved_by"`
	PaymentDueDate      *time.Time `json:"payment_due_date"`
	Notes               string     `gorm:"type:text" json:"notes"`
	CreatedAt           time.Time  `json:"created_at"`
	UpdatedAt           time.Time  `json:"updated_at"`
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

