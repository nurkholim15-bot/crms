package handlers

import (
	"fmt"
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
	query := h.db.Preload("Customer").Preload("Agreement").Order("id desc")

	sType := c.Query("type")
	if sType != "" {
		query = query.Where("settlement_type = ?", sType)
	}

	status := c.Query("status")
	if status != "" {
		query = query.Where("approval_status = ?", status)
	}

	if err := query.Find(&proposals).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data pengajuan settlement: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": proposals})
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
	} else if req.Action == "REJECT" {
		prop.ApprovalStatus = "REJECTED"
	} else if req.Action == "PAID" {
		prop.ApprovalStatus = "PAID_OFF"
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
// 5. SKIP TRACING MANAGEMENT
// -------------------------------------------------------------

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
