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

