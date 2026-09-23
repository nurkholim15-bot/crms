package handlers

import (
	"fmt"
	"math"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"time"

	"crms-backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AdvancedCollectionsHandler struct {
	db *gorm.DB
}

func NewAdvancedCollectionsHandler(db *gorm.DB) *AdvancedCollectionsHandler {
	return &AdvancedCollectionsHandler{db: db}
}

// -------------------------------------------------------------
// 1. PRE-DELINQUENCY MANAGEMENT (PDM) - DPD 0 EARLY WARNING
// -------------------------------------------------------------

func (h *AdvancedCollectionsHandler) GetPreDelinquencyAccounts(c *gin.Context) {
	var accounts []models.PreDelinquencyAccount
	query := h.db.Preload("Customer").Preload("Agreement").Order("due_date asc")

	trigger := c.Query("trigger")
	if trigger != "" {
		query = query.Where("pdm_trigger_reason = ?", trigger)
	}

	status := c.Query("status")
	if status != "" {
		query = query.Where("reminder_status = ?", status)
	}

	if err := query.Find(&accounts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data Pre-Delinquency: " + err.Error()})
		return
	}

	var totalCases int64 = int64(len(accounts))
	var curedCount int64 = 0
	var totalCASA float64 = 0
	var totalOverduePrevented float64 = 0

	for _, a := range accounts {
		totalCASA += a.CASABalance
		totalOverduePrevented += a.InstallmentAmount
		if a.ReminderStatus == "CURED" || a.ReminderStatus == "WA_SENT" {
			curedCount++
		}
	}

	resolutionRate := 0.0
	if totalCases > 0 {
		resolutionRate = float64(curedCount) / float64(totalCases) * 100.0
	}

	var avgCASA float64 = 0
	if totalCases > 0 {
		avgCASA = totalCASA / float64(totalCases)
	}

	c.JSON(http.StatusOK, gin.H{
		"data": accounts,
		"metrics": gin.H{
			"total_cases":             totalCases,
			"cured_cases":             curedCount,
			"resolution_rate":         resolutionRate,
			"total_potential_overdue": totalOverduePrevented,
			"estimated_cost_saving":   totalOverduePrevented * 0.085,
			"average_casa_balance":    avgCASA,
		},
	})
}

func (h *AdvancedCollectionsHandler) SendPreDelinquencyReminder(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID akun PDM tidak valid"})
		return
	}

	var acc models.PreDelinquencyAccount
	if err := h.db.Preload("Customer").Preload("Agreement").First(&acc, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Akun PDM tidak ditemukan"})
		return
	}

	acc.ReminderStatus = "WA_SENT"
	now := time.Now()
	acc.CuredAt = &now
	acc.Notes = fmt.Sprintf("Gentle reminder via WhatsApp terkirim pada %s. Nasabah konfirmasi persiapan dana.", now.Format("02 Jan 2006 15:04"))
	h.db.Save(&acc)

	cleanPhone := cleanPhoneNum(acc.Customer.Phone)
	message := fmt.Sprintf(
		"Yth. Bapak/Ibu %s,\n\nKami mengingatkan tagihan %s No. Rekening %s sebesar Rp %.0f akan jatuh tempo pada %s. Saldo tabungan Anda tercatat Rp %.0f. Mohon pastikan ketersediaan dana sebelum jadwal autodebet perbankan.\n\nTerima kasih,\nBank CRMS Care",
		acc.Customer.Name,
		acc.Agreement.AssetModel,
		acc.AgreementNo,
		acc.InstallmentAmount,
		acc.DueDate.Format("02/01/2006"),
		acc.CASABalance,
	)

	waURL := fmt.Sprintf("https://wa.me/%s?text=%s", cleanPhone, url.QueryEscape(message))

	c.JSON(http.StatusOK, gin.H{
		"status":          "success",
		"message":         "Pengingat ramah (Gentle Reminder) PDM berhasil diproses",
		"wa_url":          waURL,
		"account_id":      acc.ID,
		"reminder_status": acc.ReminderStatus,
	})
}

// -------------------------------------------------------------
// 2. LEGAL WORKFLOW MANAGEMENT (6-STAGE LEGAL RECOURSE)
// -------------------------------------------------------------

func (h *AdvancedCollectionsHandler) GetLegalCases(c *gin.Context) {
	var cases []models.LegalCase
	query := h.db.Preload("Customer").Preload("Agreement").Order("id desc")

	stage := c.Query("stage")
	if stage != "" {
		query = query.Where("legal_stage = ?", stage)
	}

	if err := query.Find(&cases).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data kasus legal: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cases})
}

type UpdateLegalStageRequest struct {
	LegalStage    string `json:"legal_stage" binding:"required"`
	LawyerName    string `json:"lawyer_name"`
	LawFirm       string `json:"law_firm"`
	CourtName     string `json:"court_name"`
	PoliceStation string `json:"police_station"`
	LegalSection  string `json:"legal_section"`
	Status        string `json:"status"`
	HearingDate   string `json:"hearing_date"`
	Notes         string `json:"notes"`
}

func (h *AdvancedCollectionsHandler) UpdateLegalStage(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID kasus legal tidak valid"})
		return
	}

	var legalCase models.LegalCase
	if err := h.db.First(&legalCase, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kasus legal tidak ditemukan"})
		return
	}

	var req UpdateLegalStageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data tidak valid: " + err.Error()})
		return
	}

	legalCase.LegalStage = req.LegalStage
	if req.LawyerName != "" {
		legalCase.LawyerName = req.LawyerName
	}
	if req.LawFirm != "" {
		legalCase.LawFirm = req.LawFirm
	}
	if req.CourtName != "" {
		legalCase.CourtName = req.CourtName
	}
	if req.PoliceStation != "" {
		legalCase.PoliceStation = req.PoliceStation
	}
	if req.LegalSection != "" {
		legalCase.LegalSection = req.LegalSection
	}
	if req.Status != "" {
		legalCase.Status = req.Status
	}
	if req.Notes != "" {
		legalCase.Notes = req.Notes
	}
	if req.HearingDate != "" {
		t, err := time.Parse("2006-01-02", req.HearingDate)
		if err == nil {
			legalCase.HearingDate = &t
		}
	}

	h.db.Save(&legalCase)

	activity := models.CollectionActivity{
		OverdueAccountID: 1,
		AgreementNo:      legalCase.AgreementNo,
		ChannelType:      "LEGAL_DIV",
		PerformedBy:      "Legal & Litigasi Specialist",
		ContactStatus:    "LEGAL_PROCEEDING",
		ResultCode:       legalCase.LegalStage,
		Notes:            fmt.Sprintf("Update Legal Stage ke %s: %s (Lawyer: %s)", legalCase.LegalStage, legalCase.Notes, legalCase.LawyerName),
		CreatedAt:        time.Now(),
	}
	h.db.Create(&activity)

	c.JSON(http.StatusOK, gin.H{
		"message": "Tahapan legal berhasil diperbarui",
		"data":    legalCase,
	})
}

// -------------------------------------------------------------
// 3. REPOSSESSION & AUCTION MANAGEMENT (8-STAGE REPO WORKFLOW)
// -------------------------------------------------------------

func (h *AdvancedCollectionsHandler) GetRepossessionCases(c *gin.Context) {
	var cases []models.RepossessionCase
	query := h.db.Preload("Customer").Preload("Agreement").Order("id desc")

	stage := c.Query("stage")
	if stage != "" {
		query = query.Where("repo_stage = ?", stage)
	}

	if err := query.Find(&cases).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data eksekusi agunan: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cases})
}

type UpdateRepoStageRequest struct {
	RepoStage         string  `json:"repo_stage" binding:"required"`
	ValuationAgency   string  `json:"valuation_agency"`
	StockyardLocation string  `json:"stockyard_location"`
	MarketValue       float64 `json:"market_value"`
	LiquidationValue  float64 `json:"liquidation_value"`
	HighestBidAmount  float64 `json:"highest_bid_amount"`
	BuyerName         string  `json:"buyer_name"`
	Status            string  `json:"status"`
	Notes             string  `json:"notes"`
}

func (h *AdvancedCollectionsHandler) UpdateRepoStage(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID kasus repo tidak valid"})
		return
	}

	var repoCase models.RepossessionCase
	if err := h.db.First(&repoCase, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kasus eksekusi agunan tidak ditemukan"})
		return
	}

	var req UpdateRepoStageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data tidak valid: " + err.Error()})
		return
	}

	repoCase.RepoStage = req.RepoStage
	if req.ValuationAgency != "" {
		repoCase.ValuationAgency = req.ValuationAgency
	}
	if req.StockyardLocation != "" {
		repoCase.StockyardLocation = req.StockyardLocation
	}
	if req.MarketValue > 0 {
		repoCase.MarketValue = req.MarketValue
	}
	if req.LiquidationValue > 0 {
		repoCase.LiquidationValue = req.LiquidationValue
	}
	if req.HighestBidAmount > 0 {
		repoCase.HighestBidAmount = req.HighestBidAmount
	}
	if req.BuyerName != "" {
		repoCase.BuyerName = req.BuyerName
	}
	if req.Status != "" {
		repoCase.Status = req.Status
	}
	if req.Notes != "" {
		repoCase.Notes = req.Notes
	}

	h.db.Save(&repoCase)

	c.JSON(http.StatusOK, gin.H{
		"message": "Tahapan eksekusi agunan & lelang berhasil diperbarui",
		"data":    repoCase,
	})
}

// -------------------------------------------------------------
// 4. SETTLEMENT MANAGEMENT (3 TYPES OF SETTLEMENT)
// -------------------------------------------------------------

func (h *AdvancedCollectionsHandler) GetSettlementProposals(c *gin.Context) {
	var proposals []models.SettlementProposal
	query := h.db.Preload("Customer").Preload("Agreement").Preload("Tranches").Order("id desc")

	sType := c.Query("type")
	if sType != "" {
		query = query.Where("settlement_type = ?", sType)
	}

	status := c.Query("status")
	if status != "" {
		query = query.Where("approval_status = ?", status)
	}

	stage := c.Query("stage")
	if stage != "" {
		query = query.Where("settlement_stage = ?", stage)
	}

	if err := query.Find(&proposals).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data pengajuan settlement: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": proposals})
}

type CreateSettlementProposalRequest struct {
	AgreementNo         string    `json:"agreement_no" binding:"required"`
	SettlementType      string    `json:"settlement_type" binding:"required"` // NET_SETTLEMENT, CHARGE_WISE_SETTLEMENT, AUTO_CHARGE_ALLOCATION
	OriginalOverdue     float64   `json:"original_overdue"`
	WaivedPenalty       float64   `json:"waived_penalty"`
	WaivedInterest      float64   `json:"waived_interest"`
	NetSettlementAmount float64   `json:"net_settlement_amount" binding:"required"`
	TotalTranches       int       `json:"total_tranches"`
	PaymentDueDate      string    `json:"payment_due_date"`
	Notes               string    `json:"notes"`
	RecommendationTier  string    `json:"recommendation_tier"`
	RecommendedTo       string    `json:"recommended_to"`
}

// CreateSettlementProposal membuat inisiasi pengajuan kompromi pelunasan (Stage 1: Initiate Settlement)
func (h *AdvancedCollectionsHandler) CreateSettlementProposal(c *gin.Context) {
	var req CreateSettlementProposalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format request tidak valid: " + err.Error()})
		return
	}

	var overdue models.OverdueAccount
	if err := h.db.Preload("Agreement").Preload("Agreement.Customer").
		Where("agreement_no = ?", req.AgreementNo).First(&overdue).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Akun perjanjian tidak ditemukan: " + req.AgreementNo})
		return
	}

	origOverdue := req.OriginalOverdue
	if origOverdue <= 0 {
		origOverdue = overdue.OverdueAmount
	}

	totalTranches := req.TotalTranches
	if totalTranches <= 0 {
		totalTranches = 1
	}

	now := time.Now()
	propNo := fmt.Sprintf("STL-%s-%04d", now.Format("20060102"), now.UnixNano()%10000)

	var dueDate *time.Time
	if req.PaymentDueDate != "" {
		parsedDate, err := time.Parse("2006-01-02", req.PaymentDueDate)
		if err == nil {
			dueDate = &parsedDate
		}
	}
	if dueDate == nil {
		defDate := now.AddDate(0, 0, 14)
		dueDate = &defDate
	}

	recTier := req.RecommendationTier
	if recTier == "" {
		recTier = "BRANCH_MANAGER"
	}
	recTo := req.RecommendedTo
	if recTo == "" {
		recTo = "Branch Manager Cabang"
	}

	prop := models.SettlementProposal{
		ProposalNo:          propNo,
		AgreementNo:         req.AgreementNo,
		CustomerID:          overdue.Agreement.CustomerID,
		SettlementStage:     "STAGE_INITIATE",
		SettlementType:      req.SettlementType,
		OriginalOverdue:     origOverdue,
		WaivedPenalty:       req.WaivedPenalty,
		WaivedInterest:      req.WaivedInterest,
		NetSettlementAmount: req.NetSettlementAmount,
		ApprovalStatus:      "PENDING_APPROVAL",
		RecommendationTier:  recTier,
		RecommendedTo:       recTo,
		PaymentDueDate:      dueDate,
		TotalTranches:       totalTranches,
		Notes:               req.Notes,
		CreatedAt:           now,
		UpdatedAt:           now,
	}

	if err := h.db.Create(&prop).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan proposal settlement: " + err.Error()})
		return
	}

	// Auto generate initial tranches if requested
	trancheAmount := req.NetSettlementAmount / float64(totalTranches)
	for i := 1; i <= totalTranches; i++ {
		tDueDate := now.AddDate(0, 0, i*14)
		tranche := models.SettlementTranche{
			SettlementProposalID: prop.ID,
			TrancheNo:           i,
			DueDate:             tDueDate,
			Amount:              trancheAmount,
			PaymentMethod:       "ONLINE_VA",
			PaymentStatus:       "PENDING",
			CreatedAt:           now,
			UpdatedAt:           now,
		}
		h.db.Create(&tranche)
	}

	// Update recovery stage pada overdue account
	h.db.Model(&overdue).Update("recovery_stage", "STAGE_SETTLEMENT")

	// Preload Tranches untuk respons
	h.db.Preload("Customer").Preload("Agreement").Preload("Tranches").First(&prop, prop.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Inisiasi proposal settlement berhasil dibuat (Stage 1: Initiate)",
		"data":    prop,
	})
}

type UpdateSettlementStageRequest struct {
	Stage string `json:"stage" binding:"required"` // STAGE_INITIATE, STAGE_SCHEDULE, STAGE_PLAN, STAGE_RECOMMEND_APPROVAL, STAGE_PAYMENT_TRACKING, STAGE_CLOSURE
	Notes string `json:"notes"`
}

// UpdateSettlementStage memperbarui tahapan pada siklus 6-Stage Settlement Lifecycle
func (h *AdvancedCollectionsHandler) UpdateSettlementStage(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID proposal settlement tidak valid"})
		return
	}

	var prop models.SettlementProposal
	if err := h.db.Preload("Tranches").First(&prop, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Proposal settlement tidak ditemukan"})
		return
	}

	var req UpdateSettlementStageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format request tidak valid: " + err.Error()})
		return
	}

	prop.SettlementStage = req.Stage
	if req.Notes != "" {
		prop.Notes = req.Notes
	}

	// Jika stage berubah ke STAGE_CLOSURE, tandai overdue account selesai
	if req.Stage == "STAGE_CLOSURE" {
		prop.ApprovalStatus = "PAID_OFF"
		h.db.Model(&models.OverdueAccount{}).
			Where("agreement_no = ?", prop.AgreementNo).
			Updates(map[string]interface{}{
				"overdue_amount": 0,
				"status":         "PAID",
				"recovery_stage": "STAGE_CLOSED",
				"notes":          "Pelunasan kompromi kredit selesai penuh (Settlement Stage Closure).",
			})
	}

	h.db.Save(&prop)

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Tahapan settlement berhasil diperbarui menjadi %s", req.Stage),
		"data":    prop,
	})
}

type SaveTranchesRequest struct {
	Tranches []models.SettlementTranche `json:"tranches" binding:"required"`
}

// SaveSettlementTranches menyimpan atau memperbarui jadwal termin bertahap (Stage 2: Generate Settlement Schedule)
func (h *AdvancedCollectionsHandler) SaveSettlementTranches(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID proposal settlement tidak valid"})
		return
	}

	var prop models.SettlementProposal
	if err := h.db.First(&prop, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Proposal settlement tidak ditemukan"})
		return
	}

	var req SaveTranchesRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format jadwal termin tidak valid: " + err.Error()})
		return
	}

	// Hapus termin sebelumnya dan simpan yang baru
	h.db.Where("settlement_proposal_id = ?", prop.ID).Delete(&models.SettlementTranche{})

	now := time.Now()
	for i, tr := range req.Tranches {
		tr.SettlementProposalID = prop.ID
		tr.TrancheNo = i + 1
		if tr.PaymentStatus == "" {
			tr.PaymentStatus = "PENDING"
		}
		tr.CreatedAt = now
		tr.UpdatedAt = now
		h.db.Create(&tr)
	}

	prop.TotalTranches = len(req.Tranches)
	prop.SettlementStage = "STAGE_SCHEDULE"
	h.db.Save(&prop)

	h.db.Preload("Customer").Preload("Agreement").Preload("Tranches").First(&prop, prop.ID)

	c.JSON(http.StatusOK, gin.H{
		"message": "Jadwal termin settlement berhasil disimpan",
		"data":    prop,
	})
}

type PayTrancheRequest struct {
	PaidAmount    float64 `json:"paid_amount" binding:"required"`
	PaymentMethod string  `json:"payment_method"` // CASH, ONLINE_VA, QRIS, CHEQUE
	ReceiptNo     string  `json:"receipt_no"`
	Notes         string  `json:"notes"`
}

// PaySettlementTranche mencatat pembayaran satu termin settlement (Stage 5: Settlement Payment Tracking)
func (h *AdvancedCollectionsHandler) PaySettlementTranche(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID termin settlement tidak valid"})
		return
	}

	var tranche models.SettlementTranche
	if err := h.db.First(&tranche, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Termin settlement tidak ditemukan"})
		return
	}

	var req PayTrancheRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format request tidak valid: " + err.Error()})
		return
	}

	now := time.Now()
	tranche.PaidAmount = req.PaidAmount
	tranche.PaidAt = &now
	tranche.PaymentStatus = "PAID"
	if req.PaymentMethod != "" {
		tranche.PaymentMethod = req.PaymentMethod
	}
	if req.ReceiptNo != "" {
		tranche.ReceiptNo = req.ReceiptNo
	} else {
		tranche.ReceiptNo = fmt.Sprintf("STL-RCP-%s-%d", now.Format("20060102"), tranche.ID)
	}
	h.db.Save(&tranche)

	// Periksa apakah semua tranche untuk proposal ini sudah lunas
	var allTranches []models.SettlementTranche
	h.db.Where("settlement_proposal_id = ?", tranche.SettlementProposalID).Find(&allTranches)

	allPaid := true
	for _, t := range allTranches {
		if t.PaymentStatus != "PAID" {
			allPaid = false
			break
		}
	}

	var prop models.SettlementProposal
	h.db.Preload("Customer").Preload("Agreement").Preload("Tranches").
		First(&prop, tranche.SettlementProposalID)

	if allPaid {
		// Stage 6: Closure & Match-Off
		prop.SettlementStage = "STAGE_CLOSURE"
		prop.ApprovalStatus = "PAID_OFF"
		h.db.Save(&prop)

		h.db.Model(&models.OverdueAccount{}).
			Where("agreement_no = ?", prop.AgreementNo).
			Updates(map[string]interface{}{
				"overdue_amount": 0,
				"status":         "PAID",
				"recovery_stage": "STAGE_CLOSED",
				"notes":          fmt.Sprintf("Seluruh termin settlement (%d termin) lunas penuh. Rekening ditutup.", len(allTranches)),
			})
	} else {
		prop.SettlementStage = "STAGE_PAYMENT_TRACKING"
		h.db.Save(&prop)
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Pembayaran termin settlement berhasil dicatat",
		"tranche":  tranche,
		"all_paid": allPaid,
		"proposal": prop,
	})
}

type RecommendSettlementRequest struct {
	RecommendationTier string `json:"recommendation_tier" binding:"required"` // COLLECTOR, BRANCH_MANAGER, AR_HEAD, DIRECTOR
	RecommendedTo      string `json:"recommended_to" binding:"required"`
	Notes              string `json:"notes"`
}

// RecommendSettlementProposal mengajukan rekomendasi berjenjang (Stage 4: Recommend & Approval Matrix)
func (h *AdvancedCollectionsHandler) RecommendSettlementProposal(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID proposal settlement tidak valid"})
		return
	}

	var prop models.SettlementProposal
	if err := h.db.First(&prop, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Proposal settlement tidak ditemukan"})
		return
	}

	var req RecommendSettlementRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format request tidak valid: " + err.Error()})
		return
	}

	prop.RecommendationTier = req.RecommendationTier
	prop.RecommendedTo = req.RecommendedTo
	prop.SettlementStage = "STAGE_RECOMMEND_APPROVAL"
	prop.ApprovalStatus = "RECOMMENDED"
	if req.Notes != "" {
		prop.Notes = req.Notes
	}

	h.db.Save(&prop)

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Proposal settlement direkomendasikan ke jenjang: %s (%s)", req.RecommendationTier, req.RecommendedTo),
		"data":    prop,
	})
}

type ApproveSettlementRequest struct {
	Action     string `json:"action" binding:"required"` // APPROVE, REJECT, PAID
	ApprovedBy string `json:"approved_by"`
	Notes      string `json:"notes"`
}

func (h *AdvancedCollectionsHandler) ApproveSettlementProposal(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID proposal settlement tidak valid"})
		return
	}

	var prop models.SettlementProposal
	if err := h.db.First(&prop, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Proposal settlement tidak ditemukan"})
		return
	}

	var req ApproveSettlementRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format request tidak valid: " + err.Error()})
		return
	}

	if req.Action == "APPROVE" {
		prop.ApprovalStatus = "APPROVED_BY_COMMITTEE"
		prop.ApprovedBy = req.ApprovedBy
		if prop.ApprovedBy == "" {
			prop.ApprovedBy = "Komite Pemulihan Kredit / AR Head"
		}
		prop.SettlementStage = "STAGE_PAYMENT_TRACKING"
	} else if req.Action == "REJECT" {
		prop.ApprovalStatus = "REJECTED"
	} else if req.Action == "PAID" {
		prop.ApprovalStatus = "PAID_OFF"
		prop.SettlementStage = "STAGE_CLOSURE"
		h.db.Model(&models.OverdueAccount{}).
			Where("agreement_no = ?", prop.AgreementNo).
			Updates(map[string]interface{}{
				"overdue_amount": 0,
				"status":         "PAID",
				"recovery_stage": "STAGE_CLOSED",
				"notes":          "Pelunasan khusus via Settlement (" + prop.SettlementType + ") lunas.",
			})
	}
	if req.Notes != "" {
		prop.Notes = req.Notes
	}

	h.db.Save(&prop)

	c.JSON(http.StatusOK, gin.H{
		"message": "Status pengajuan settlement berhasil diperbarui",
		"data":    prop,
	})
}

// -------------------------------------------------------------
// 6. EXTERNAL AGENCY ONBOARDING & CAPACITY PLANNING
// -------------------------------------------------------------

func (h *AdvancedCollectionsHandler) GetAgencies(c *gin.Context) {
	var agencies []models.CollectionAgency
	if err := h.db.Order("recovery_rate desc").Find(&agencies).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data agensi: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": agencies})
}

func (h *AdvancedCollectionsHandler) CreateAgency(c *gin.Context) {
	var agency models.CollectionAgency
	if err := c.ShouldBindJSON(&agency); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data agensi tidak valid: " + err.Error()})
		return
	}

	now := time.Now()
	agency.CreatedAt = now
	agency.UpdatedAt = now
	if agency.Status == "" {
		agency.Status = "ACTIVE"
	}

	if err := h.db.Create(&agency).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mendaftarkan agensi: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Agensi penagihan eksternal berhasil didaftarkan",
		"data":    agency,
	})
}

// -------------------------------------------------------------
// 7. SUPERVISORY REVIEW & AUTHORITY DELEGATION (OUT OF OFFICE)
// -------------------------------------------------------------

func (h *AdvancedCollectionsHandler) GetDelegations(c *gin.Context) {
	var delegations []models.AuthorityDelegation
	if err := h.db.Order("start_date desc").Find(&delegations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data pendelegasian wewenang: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": delegations})
}

func (h *AdvancedCollectionsHandler) CreateDelegation(c *gin.Context) {
	var del models.AuthorityDelegation
	if err := c.ShouldBindJSON(&del); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data pendelegasian tidak valid: " + err.Error()})
		return
	}

	now := time.Now()
	del.CreatedAt = now
	del.UpdatedAt = now
	del.IsActive = true

	if err := h.db.Create(&del).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat delegasi wewenang: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Pendelegasian wewenang (Out of Office) berhasil diaktifkan",
		"data":    del,
	})
}

func (h *AdvancedCollectionsHandler) CancelDelegation(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID delegasi tidak valid"})
		return
	}

	var del models.AuthorityDelegation
	if err := h.db.First(&del, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Delegasi tidak ditemukan"})
		return
	}

	del.IsActive = false
	h.db.Save(&del)

	c.JSON(http.StatusOK, gin.H{
		"message": "Pendelegasian wewenang berhasil dicabut/dinonaktifkan",
		"data":    del,
	})
}

// GetCapacityPlanning mengembalikan data alokasi beban kerja (Capacity Planning & Round-Robin)
func (h *AdvancedCollectionsHandler) GetCapacityPlanning(c *gin.Context) {
	type CollectorWorkload struct {
		PICName         string  `json:"pic_name"`
		Channel         string  `json:"channel"`
		ActiveAccounts  int64   `json:"active_accounts"`
		TotalExposure   float64 `json:"total_exposure"`
		CapacityPct     float64 `json:"capacity_pct"`
		Status          string  `json:"status"` // OPTIMAL, NEAR_CAPACITY, OVERLOADED
	}

	var workloads []CollectorWorkload
	rows, err := h.db.Table("overdue_accounts").
		Select("assigned_pic as pic_name, pic_channel as channel, count(*) as active_accounts, COALESCE(sum(overdue_amount), 0) as total_exposure").
		Where("status = 'OVERDUE'").
		Group("assigned_pic, pic_channel").
		Order("active_accounts desc").
		Rows()

	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var w CollectorWorkload
			if err := rows.Scan(&w.PICName, &w.Channel, &w.ActiveAccounts, &w.TotalExposure); err == nil {
				// Kapasitas optimal per agen ~ 25 akun
				w.CapacityPct = math.Min(100.0, float64(w.ActiveAccounts)/25.0*100.0)
				if w.CapacityPct >= 90.0 {
					w.Status = "OVERLOADED"
				} else if w.CapacityPct >= 70.0 {
					w.Status = "NEAR_CAPACITY"
				} else {
					w.Status = "OPTIMAL"
				}
				workloads = append(workloads, w)
			}
		}
	}

	var totalAgencies int64
	h.db.Model(&models.CollectionAgency{}).Count(&totalAgencies)

	var activeDelegations int64
	h.db.Model(&models.AuthorityDelegation{}).Where("is_active = true").Count(&activeDelegations)

	c.JSON(http.StatusOK, gin.H{
		"workloads":          workloads,
		"total_collectors":   len(workloads),
		"total_agencies":     totalAgencies,
		"active_delegations": activeDelegations,
		"round_robin_mode":   "DYNAMIC_BALANCED",
	})
}

func (h *AdvancedCollectionsHandler) GetSkipTracingCases(c *gin.Context) {
	var cases []models.SkipTracingCase
	query := h.db.Preload("Customer").Preload("Agreement").Order("id desc")

	if err := query.Find(&cases).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data skip tracing: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cases})
}

type UpdateSkipTracingRequest struct {
	TracingStatus string `json:"tracing_status"`
	NewPhone      string `json:"new_phone"`
	NewAddress    string `json:"new_address"`
	NewEmployer   string `json:"new_employer"`
	SourceInfo    string `json:"source_info"`
	Notes         string `json:"notes"`
}

func (h *AdvancedCollectionsHandler) UpdateSkipTracingFeedback(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID kasus skip tracing tidak valid"})
		return
	}

	var trace models.SkipTracingCase
	if err := h.db.First(&trace, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kasus skip tracing tidak ditemukan"})
		return
	}

	var req UpdateSkipTracingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format request tidak valid: " + err.Error()})
		return
	}

	if req.TracingStatus != "" {
		trace.TracingStatus = req.TracingStatus
	}
	if req.NewPhone != "" {
		trace.NewPhone = req.NewPhone
		h.db.Model(&models.Customer{}).Where("id = ?", trace.CustomerID).Update("phone", req.NewPhone)
	}
	if req.NewAddress != "" {
		trace.NewAddress = req.NewAddress
		h.db.Model(&models.Customer{}).Where("id = ?", trace.CustomerID).Update("address", req.NewAddress)
	}
	if req.NewEmployer != "" {
		trace.NewEmployer = req.NewEmployer
	}
	if req.SourceInfo != "" {
		trace.SourceInfo = req.SourceInfo
	}
	if req.Notes != "" {
		trace.Notes = req.Notes
	}

	h.db.Save(&trace)

	c.JSON(http.StatusOK, gin.H{
		"message": "Umpan balik pelacakan (Skip Tracing Feedback) berhasil disimpan",
		"data":    trace,
	})
}

// Helpers
func cleanPhoneNum(phone string) string {
	reg := regexp.MustCompile("[^0-9]")
	cleaned := reg.ReplaceAllString(phone, "")
	if strings.HasPrefix(cleaned, "0") {
		cleaned = "62" + cleaned[1:]
	}
	return cleaned
}
