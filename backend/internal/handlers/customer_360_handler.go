package handlers

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"crms-backend/internal/database"
	"crms-backend/internal/models"
	"github.com/gin-gonic/gin"
)

// ScriptGuidance merepresentasikan panduan skrip percakapan terpandu (Script-Driven Follow-up)
type ScriptGuidance struct {
	DebtorPersona      string `json:"debtor_persona"`
	OpeningGreeting    string `json:"opening_greeting"`
	ObligationDetail   string `json:"obligation_detail"`
	NegotiationTactic  string `json:"negotiation_tactic"`
	ClosingCommitment  string `json:"closing_commitment"`
	EscalationWarning  string `json:"escalation_warning"`
	RecommendedChannel string `json:"recommended_channel"`
	ChannelCostBadge   string `json:"channel_cost_badge"`
	CostSavingPercent  int    `json:"cost_saving_percent"`
}

// FacilityDetail merepresentasikan detail akun kredit nasabah dalam 360 view
type FacilityDetail struct {
	AgreementNo       string  `json:"agreement_no"`
	ProductCategory   string  `json:"product_category"` // KPR, KMK, KTA, etc
	ProductName       string  `json:"product_name"`     // e.g. KPR Griya Utama Primary
	LOB               string  `json:"lob"`
	CollateralInfo    string  `json:"collateral_info"`  // SHM / SHGB / Bilyet
	TotalFinancing    float64 `json:"total_financing"`
	InstallmentAmount float64 `json:"installment_amount"`
	TenorMonths       int     `json:"tenor_months"`
	PaidTenorMonths   int     `json:"paid_tenor_months"`
	BranchName        string  `json:"branch_name"`
	IsOverdue         bool    `json:"is_overdue"`
	OverdueAccountID  uint    `json:"overdue_account_id"`
	DPD               int     `json:"dpd"`
	OverdueAmount     float64 `json:"overdue_amount"`
	CurrentBucket     string  `json:"current_bucket"`
	RiskLevel         string  `json:"risk_level"`
	ActionPath        string  `json:"action_path"`
	AssignedPIC       string  `json:"assigned_pic"`
	RecoveryStage     string  `json:"recovery_stage"`
	AccountStatus     string  `json:"account_status"`
	ComboGroup        string  `json:"combo_group"`
}

// Customer360Response merepresentasikan respon lengkap Customer Exposure 360°
type Customer360Response struct {
	CustomerID          uint                        `json:"customer_id"`
	CustomerNo          string                      `json:"customer_no"`
	CustomerName        string                      `json:"customer_name"`
	Phone               string                      `json:"phone"`
	Email               string                      `json:"email"`
	Address             string                      `json:"address"`
	City                string                      `json:"city"`
	Occupation          string                      `json:"occupation"`
	IsVIP               bool                        `json:"is_vip"`
	TotalFacilities     int                         `json:"total_facilities"`
	TotalPrincipal      float64                     `json:"total_principal"`
	TotalInstallment    float64                     `json:"total_installment"`
	TotalOverdue        float64                     `json:"total_overdue"`
	MaxDPD              int                         `json:"max_dpd"`
	WorstRiskLevel      string                      `json:"worst_risk_level"`
	PrimaryStage        string                      `json:"primary_stage"`
	ComboCaseStamping   string                      `json:"combo_case_stamping"`
	Facilities          []FacilityDetail            `json:"facilities"`
	TimelineActivities  []models.CollectionActivity `json:"timeline_activities"`
	LegalCases          []models.LegalCase          `json:"legal_cases"`
	RepoCases           []models.RepossessionCase   `json:"repo_cases"`
	SettlementProposals []models.SettlementProposal `json:"settlement_proposals"`
	ScriptGuidance      ScriptGuidance              `json:"script_guidance"`
}

// GetCustomerExposure360 mengembalikan pandangan 360° nasabah, total exposure, skrip penagihan dinamis, dan histori aktivitas
func GetCustomerExposure360(c *gin.Context) {
	db := database.DB
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format Customer ID tidak valid"})
		return
	}

	var customer models.Customer
	if err := db.First(&customer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Nasabah tidak ditemukan"})
		return
	}

	// Ambil semua fasilitas / agreement nasabah
	var agreements []models.Agreement
	if err := db.Where("customer_id = ?", customer.ID).Find(&agreements).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var facilities []FacilityDetail
	var agreementNos []string
	var totalPrincipal float64
	var totalInstallment float64
	var totalOverdue float64
	maxDPD := 0
	worstRisk := "LOW_RISK"
	primaryStage := "STAGE_COLLECTION"

	simbolPT := GetGlobalParam("GENERAL_SIMBOL_PT", "BANK")
	namaPT := GetGlobalParam("GENERAL_NAMA_PT", "PT BANK RAKYAT NUSANTARA TBK")

	for _, agr := range agreements {
		agreementNos = append(agreementNos, agr.AgreementNo)
		totalPrincipal += agr.TotalFinancing
		totalInstallment += agr.InstallmentAmount

		var overdue models.OverdueAccount
		hasOverdue := false
		if err := db.Where("agreement_no = ?", agr.AgreementNo).First(&overdue).Error; err == nil {
			hasOverdue = true
			totalOverdue += overdue.OverdueAmount
			if overdue.DPD > maxDPD {
				maxDPD = overdue.DPD
			}
			if overdue.RiskLevel == "HIGH_RISK" {
				worstRisk = "HIGH_RISK"
			} else if overdue.RiskLevel == "MEDIUM_RISK" && worstRisk != "HIGH_RISK" {
				worstRisk = "MEDIUM_RISK"
			}
			if overdue.RecoveryStage != "" && overdue.RecoveryStage != "STAGE_COLLECTION" {
				primaryStage = overdue.RecoveryStage
			}
		}

		fDetail := FacilityDetail{
			AgreementNo:       agr.AgreementNo,
			ProductCategory:   agr.AssetBrand,
			ProductName:       agr.AssetModel,
			LOB:               agr.LOB,
			CollateralInfo:    agr.PlateNo,
			TotalFinancing:    agr.TotalFinancing,
			InstallmentAmount: agr.InstallmentAmount,
			TenorMonths:       agr.TenorMonths,
			PaidTenorMonths:   agr.PaidTenorMonths,
			BranchName:        agr.BranchName,
			IsOverdue:         hasOverdue,
			ComboGroup:        agr.ComboGroup,
		}

		if hasOverdue {
			fDetail.OverdueAccountID = overdue.ID
			fDetail.DPD = overdue.DPD
			fDetail.OverdueAmount = overdue.OverdueAmount
			fDetail.CurrentBucket = overdue.CurrentBucket
			fDetail.RiskLevel = overdue.RiskLevel
			fDetail.ActionPath = overdue.ActionPath
			fDetail.AssignedPIC = overdue.AssignedPIC
			fDetail.RecoveryStage = overdue.RecoveryStage
			fDetail.AccountStatus = overdue.Status
		}

		facilities = append(facilities, fDetail)
	}

	// Ambil data Legal, Repossession, dan Settlement terkait nasabah
	var legalCases []models.LegalCase
	var repoCases []models.RepossessionCase
	var settlementProposals []models.SettlementProposal
	if len(agreementNos) > 0 {
		db.Where("agreement_no IN ?", agreementNos).Find(&legalCases)
		db.Where("agreement_no IN ?", agreementNos).Find(&repoCases)
		db.Where("agreement_no IN ?", agreementNos).Find(&settlementProposals)
	}

	// Ambil seluruh rekam jejak aktivitas omnichannel nasabah (berdasarkan nomor perjanjian)
	var activities []models.CollectionActivity
	if len(agreementNos) > 0 {
		db.Where("agreement_no IN ?", agreementNos).Order("created_at desc").Limit(20).Find(&activities)
	}

	// Tentukan Combo Case Stamping (misal KPR+KPA atau KTA+CC)
	comboCaseStamping := "Single Facility"
	if len(facilities) > 1 {
		hasMortgage := false
		hasUnsecured := false
		for _, f := range facilities {
			if f.ProductCategory == "KPR" || f.ProductCategory == "KPA" {
				hasMortgage = true
			}
			if f.ProductCategory == "KTA" || f.ProductCategory == "KARTU_KREDIT" {
				hasUnsecured = true
			}
		}
		if hasMortgage && hasUnsecured {
			comboCaseStamping = "COMBO 1+2: Properti & Konsumer (KPR + KTA/CC)"
		} else if hasMortgage {
			comboCaseStamping = "COMBO 1: Portofolio Properti (KPR + KPA)"
		} else if hasUnsecured {
			comboCaseStamping = "COMBO 2: Portofolio Konsumer (KTA + Kartu Kredit)"
		} else {
			comboCaseStamping = "COMBO 3: Portofolio Komersial & UMKM (KMK + KUR)"
		}
	}

	// Generate Dynamic Script Guidance & Cost Recommendation
	script := generateScriptGuidance(customer, maxDPD, worstRisk, totalOverdue, simbolPT, namaPT)

	resp := Customer360Response{
		CustomerID:          customer.ID,
		CustomerNo:          customer.CustomerNo,
		CustomerName:        customer.Name,
		Phone:               customer.Phone,
		Email:               customer.Email,
		Address:             customer.Address,
		City:                customer.City,
		Occupation:          customer.Occupation,
		IsVIP:               customer.IsVIP,
		TotalFacilities:     len(facilities),
		TotalPrincipal:      totalPrincipal,
		TotalInstallment:    totalInstallment,
		TotalOverdue:        totalOverdue,
		MaxDPD:              maxDPD,
		WorstRiskLevel:      worstRisk,
		PrimaryStage:        primaryStage,
		ComboCaseStamping:   comboCaseStamping,
		Facilities:          facilities,
		TimelineActivities:  activities,
		LegalCases:          legalCases,
		RepoCases:           repoCases,
		SettlementProposals: settlementProposals,
		ScriptGuidance:      script,
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   resp,
	})
}

// UpdateRecoveryStageRequest payload untuk mengubah tahapan penagihan lanjutan
type UpdateRecoveryStageRequest struct {
	RecoveryStage string `json:"recovery_stage" binding:"required"` // STAGE_SKIP_TRACING, STAGE_RESTRUCTURING, STAGE_LEGAL_NOTICE, STAGE_LITIGATION_AUCTION, STAGE_SETTLEMENT, STAGE_COLLECTION, STAGE_CLOSED
	Reason        string `json:"reason" binding:"required"`
	Notes         string `json:"notes"`
	PerformedBy   string `json:"performed_by"`
}

// UpdateAccountRecoveryStage memproses perpindahan tahapan Advanced Collections Lifecycle
func UpdateAccountRecoveryStage(c *gin.Context) {
	db := database.DB
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format ID tidak valid"})
		return
	}

	var req UpdateRecoveryStageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var account models.OverdueAccount
	if err := db.Preload("Agreement.Customer").First(&account, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Akun tidak ditemukan"})
		return
	}

	oldStage := account.RecoveryStage
	if oldStage == "" {
		oldStage = "STAGE_COLLECTION"
	}

	now := time.Now()
	account.RecoveryStage = req.RecoveryStage
	account.UpdatedAt = now

	// Update rekomendasi kanal sesuai tahapan
	switch req.RecoveryStage {
	case "STAGE_SKIP_TRACING":
		account.RecommendedChannel = "SKIP_TRACER"
		account.CostEfficiencyRate = 50.0
	case "STAGE_RESTRUCTURING":
		account.RecommendedChannel = "CREDIT_ANALYST"
		account.CostEfficiencyRate = 75.0
	case "STAGE_LEGAL_NOTICE":
		account.RecommendedChannel = "LEGAL_OFFICER"
		account.CostEfficiencyRate = 40.0
	case "STAGE_LITIGATION_AUCTION":
		account.RecommendedChannel = "AUCTION_PARTNER"
		account.CostEfficiencyRate = 30.0
	case "STAGE_SETTLEMENT":
		account.RecommendedChannel = "AR_HEAD_SETTLEMENT"
		account.CostEfficiencyRate = 85.0
	default:
		account.RecommendedChannel = "WA"
		account.CostEfficiencyRate = 95.0
	}

	if err := db.Save(&account).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	performedBy := req.PerformedBy
	if performedBy == "" {
		performedBy = "COLLECTIONS_MANAGER"
	}

	// Buat rekaman audit trail perpindahan tahapan
	stageLog := models.CollectionActivity{
		OverdueAccountID: account.ID,
		AgreementNo:      account.AgreementNo,
		ChannelType:      "ADVANCED_COLLECTIONS_WORKFLOW",
		PerformedBy:      performedBy,
		ContactStatus:    "STAGE_ADVANCED",
		ResultCode:       req.RecoveryStage,
		Notes:            fmt.Sprintf("Perubahan Tahapan Penanganan: %s -> %s. Alasan: %s. Catatan: %s", oldStage, req.RecoveryStage, req.Reason, req.Notes),
		CreatedAt:        now,
	}
	db.Create(&stageLog)

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": fmt.Sprintf("Tahapan penagihan berhasil dialihkan ke %s", req.RecoveryStage),
		"data":    account,
	})
}

// UpdateCustomerPhoneRequest payload untuk memperbarui nomor handphone debitur
type UpdateCustomerPhoneRequest struct {
	Phone string `json:"phone" binding:"required"`
}

// UpdateCustomerPhone memperbarui nomor telepon/WhatsApp debitur untuk keperluan penagihan/testing
func UpdateCustomerPhone(c *gin.Context) {
	db := database.DB
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format Customer ID tidak valid"})
		return
	}

	var req UpdateCustomerPhoneRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nomor telepon/WhatsApp wajib diisi"})
		return
	}

	var customer models.Customer
	if err := db.First(&customer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Debitur tidak ditemukan"})
		return
	}

	oldPhone := customer.Phone
	newPhone := strings.TrimSpace(req.Phone)
	customer.Phone = newPhone
	customer.UpdatedAt = time.Now()

	if err := db.Save(&customer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Rekam riwayat perubahan kontak ke audit trail
	activity := models.CollectionActivity{
		AgreementNo:   "-",
		ChannelType:   "PHONE_UPDATE",
		PerformedBy:   "CRMS_OFFICER",
		ContactStatus: "UPDATED",
		ResultCode:    "PHONE_MODIFIED",
		Notes:         fmt.Sprintf("Pembaruan nomor kontak WhatsApp debitur %s: %s -> %s (Siap untuk Testing WA)", customer.Name, oldPhone, newPhone),
		CreatedAt:     time.Now(),
	}
	db.Create(&activity)

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": fmt.Sprintf("Nomor WhatsApp debitur berhasil diperbarui ke %s", newPhone),
		"data": gin.H{
			"customer_id":   customer.ID,
			"customer_name": customer.Name,
			"phone":         customer.Phone,
		},
	})
}

// SendWhatsAppRequest payload pengiriman pesan WhatsApp ala modul Kopkara-EWA
type SendWhatsAppRequest struct {
	Message          string `json:"message" binding:"required"`
	OverdueAccountID uint   `json:"overdue_account_id"`
	AgreementNo      string `json:"agreement_no"`
}

// SendCustomerWhatsApp mengirimkan pesan WhatsApp ke debitur via Gateway API (Fonnte / Meta Cloud / WA Web Direct)
func SendCustomerWhatsApp(c *gin.Context) {
	db := database.DB
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format Customer ID tidak valid"})
		return
	}

	var req SendWhatsAppRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Teks pesan WhatsApp wajib diisi"})
		return
	}

	var customer models.Customer
	if err := db.First(&customer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Debitur tidak ditemukan"})
		return
	}

	rawPhone := strings.TrimSpace(customer.Phone)
	if rawPhone == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nomor WhatsApp debitur masih kosong. Silakan perbarui nomor terlebih dahulu."})
		return
	}

	cleanPhone := rawPhone
	if strings.HasPrefix(cleanPhone, "0") {
		cleanPhone = "62" + cleanPhone[1:]
	}
	cleanPhone = strings.TrimPrefix(cleanPhone, "+")

	// Modul pengiriman WhatsApp mengadopsi standar Kopkara-EWA:
	// Prioritas 1: Fonnte API Gateway (jika FONNTE_TOKEN tersedia)
	// Prioritas 2: Meta Cloud WhatsApp Business API (jika META_WA_PHONE_NUMBER_ID & META_WA_ACCESS_TOKEN tersedia)
	// Prioritas 3: Direct Web WhatsApp wa.me link
	fonnteToken := strings.TrimSpace(os.Getenv("FONNTE_TOKEN"))
	if fonnteToken == "" {
		fonnteToken = GetGlobalParam("FONNTE_TOKEN", "")
	}

	phoneID := strings.TrimSpace(os.Getenv("META_WA_PHONE_NUMBER_ID"))
	metaToken := strings.TrimSpace(os.Getenv("META_WA_ACCESS_TOKEN"))

	gatewayUsed := "WA_WEB_PREFILLED"
	gatewayStatus := "SUCCESS"
	gatewayNote := ""

	if fonnteToken != "" {
		gatewayUsed = "FONNTE_GATEWAY_API"
		apiUrl := "https://api.fonnte.com/send"
		formData := url.Values{}
		formData.Set("target", cleanPhone)
		formData.Set("message", req.Message)

		httpReq, _ := http.NewRequest("POST", apiUrl, strings.NewReader(formData.Encode()))
		httpReq.Header.Set("Authorization", fonnteToken)
		httpReq.Header.Set("Content-Type", "application/x-www-form-urlencoded")

		client := &http.Client{Timeout: 10 * time.Second}
		resp, err := client.Do(httpReq)
		if err != nil {
			gatewayStatus = "DISPATCH_FAILED"
			gatewayNote = fmt.Sprintf("Fonnte HTTP Error: %v", err)
		} else {
			defer resp.Body.Close()
			buf, _ := io.ReadAll(resp.Body)
			bodyStr := string(buf)
			if resp.StatusCode >= 400 || strings.Contains(bodyStr, `"status":false`) {
				gatewayStatus = "GATEWAY_ERROR"
				gatewayNote = fmt.Sprintf("Fonnte response (%d): %s", resp.StatusCode, bodyStr)
			} else {
				gatewayStatus = "DELIVERED"
				gatewayNote = fmt.Sprintf("Terkirim otomatis via Fonnte Gateway: %s", bodyStr)
			}
		}
	} else if phoneID != "" && metaToken != "" {
		gatewayUsed = "META_CLOUD_API"
		urlStr := fmt.Sprintf("https://graph.facebook.com/v18.0/%s/messages", phoneID)
		bodyPayload := fmt.Sprintf(`{"messaging_product":"whatsapp","to":"%s","type":"text","text":{"body":%q}}`, cleanPhone, req.Message)
		httpReq, _ := http.NewRequest("POST", urlStr, strings.NewReader(bodyPayload))
		httpReq.Header.Set("Authorization", "Bearer "+metaToken)
		httpReq.Header.Set("Content-Type", "application/json")

		client := &http.Client{Timeout: 10 * time.Second}
		resp, err := client.Do(httpReq)
		if err != nil {
			gatewayStatus = "DISPATCH_FAILED"
			gatewayNote = fmt.Sprintf("Meta Cloud Error: %v", err)
		} else {
			defer resp.Body.Close()
			gatewayStatus = "DELIVERED"
			gatewayNote = "Terkirim otomatis via Meta Cloud API"
		}
	} else {
		gatewayNote = "Kredensial gateway otomatis belum diisi; fallback ke WhatsApp Web dengan teks terisi otomatis (prefilled URL)"
	}

	agrNo := req.AgreementNo
	if agrNo == "" {
		agrNo = "CIF-" + customer.CustomerNo
	}

	// Rekam ke Timeline Interaksi (Audit Trail)
	act := models.CollectionActivity{
		OverdueAccountID: req.OverdueAccountID,
		AgreementNo:      agrNo,
		ChannelType:      "WA",
		PerformedBy:      "WhatsApp_Engine_CRMS",
		ContactStatus:    "MESSAGE_SENT",
		ResultCode:       gatewayUsed,
		Notes:            fmt.Sprintf("[%s] Pesan WhatsApp ditujukan ke %s. Status: %s. Catatan: %s", gatewayUsed, cleanPhone, gatewayStatus, gatewayNote),
		CreatedAt:        time.Now(),
	}
	db.Create(&act)

	waWebUrl := fmt.Sprintf("https://wa.me/%s?text=%s", cleanPhone, url.QueryEscape(req.Message))

	c.JSON(http.StatusOK, gin.H{
		"status":         "success",
		"gateway_used":   gatewayUsed,
		"gateway_status": gatewayStatus,
		"phone":          cleanPhone,
		"wa_web_url":     waWebUrl,
		"message":        "Pesan WhatsApp berhasil diproses dan dicatat dalam audit trail penagihan",
	})
}

// generateScriptGuidance membuat skrip percakapan interaktif terpersonalisasi untuk collector
func generateScriptGuidance(cust models.Customer, maxDPD int, riskLevel string, totalOverdue float64, simbolPT, namaPT string) ScriptGuidance {
	overdueStr := fmt.Sprintf("Rp %.0f", totalOverdue)

	if cust.IsVIP {
		return ScriptGuidance{
			DebtorPersona:      "VIP / Priority Banking Relationship",
			OpeningGreeting:    fmt.Sprintf("Selamat pagi/siang Bapak/Ibu %s. Saya dengan perwakilan tim Priority Relationship Management %s.", cust.Name, namaPT),
			ObligationDetail:   fmt.Sprintf("Kami menginformasikan dengan hormat terdapat kewajiban rekening pembiayaan prioritas Bapak/Ibu sebesar %s yang telah melewati tanggal jatuh tempo %d hari.", overdueStr, maxDPD),
			NegotiationTactic:  "Sampaikan opsi layanan perbankan eksklusif, restrukturisasi khusus, atau penyesuaian jadwal autodebet dari rekening giro/tabungan prioritas nasabah.",
			ClosingCommitment:  "Pastikan komitmen tanggal penyelesaian pembayaran dan sampaikan kesiapan kami memfasilitasi jika dibutuhkan layanan jemput dokumen / asistensi khusus.",
			EscalationWarning:  "Dilarang menggunakan narasi ancaman/somasi. Seluruh interaksi wajib dilaporkan langsung kepada AR Head.",
			RecommendedChannel: "Executive Personal Call & Dedicated Specialist",
			ChannelCostBadge:   "High Touch (Dedicated)",
			CostSavingPercent:  80,
		}
	}

	if maxDPD <= 7 && riskLevel == "LOW_RISK" {
		return ScriptGuidance{
			DebtorPersona:      "Low Risk / Pre-Delinquent / Disiplin Tinggi",
			OpeningGreeting:    fmt.Sprintf("Halo Selamat Pagi/Siang Bapak/Ibu %s, kami dari Layanan Informasi Debitur %s.", cust.Name, namaPT),
			ObligationDetail:   fmt.Sprintf("Kami ingin mengingatkan secara ramah bahwa angsuran pinjaman Anda sebesar %s telah jatuh tempo %d hari yang lalu.", overdueStr, maxDPD),
			NegotiationTactic:  "Konfirmasi apakah ada kendala teknis autodebet atau nomor Virtual Account. Tawarkan kemudahan pembayaran instan melalui QRIS atau Mobile Banking.",
			ClosingCommitment:  "Bisa kami konfirmasikan rencana pembayaran Bapak/Ibu hari ini sebelum pukul 17.00 WIB?",
			EscalationWarning:  "Gunakan bahasa santun, ramah, dan solutif. Edukasi debitur mengenai pentingnya menjaga riwayat kredit SLIK OJK tetap lancar (Kolektibilitas 1).",
			RecommendedChannel: "WhatsApp Interactive & Smart Robo Call (Digital-First)",
			ChannelCostBadge:   "Biaya Sangat Rendah (Digital)",
			CostSavingPercent:  95,
		}
	}

	if maxDPD <= 30 && riskLevel == "MEDIUM_RISK" {
		return ScriptGuidance{
			DebtorPersona:      "Medium Risk / Volatilitas Arus Kas Menengah",
			OpeningGreeting:    fmt.Sprintf("Selamat Pagi/Siang Bapak/Ibu %s. Saya dari Tim Desk Collection Kantor Pusat %s.", cust.Name, namaPT),
			ObligationDetail:   fmt.Sprintf("Berdasarkan catatan sistem kami, angsuran pinjaman Bapak/Ibu telah tertunggak selama %d hari dengan total tagihan %s.", maxDPD, overdueStr),
			NegotiationTactic:  "Tanyakan kendala likuiditas debitur secara persuasif. Berikan penawaran restrukturisasi ringan atau pembayaran parsial jika debitur beritikad baik.",
			ClosingCommitment:  "Mohon kepastian tanggal dan jam realisasi komitmen Janji Bayar (PTP) agar sistem kami dapat memblokir penerbitan Surat Peringatan (SP) dan kunjungan petugas lapangan.",
			EscalationWarning:  "Ingatkan bahwa keterlambatan melebihi DPD 30 akan otomatis diterbitkan Surat Peringatan SP-1 dan penugasan Field Officer ke domisili / tempat usaha.",
			RecommendedChannel: "Desk Collection (Tele-Calling) & WhatsApp Push",
			ChannelCostBadge:   "Biaya Efisien (Tele-Desk)",
			CostSavingPercent:  75,
		}
	}

	// High Risk / DPD > 30 / Late Stage
	return ScriptGuidance{
		DebtorPersona:      "High Risk / Keterlambatan Lanjut / Mitigasi Risiko Agunan",
		OpeningGreeting:    fmt.Sprintf("Selamat Pagi/Siang Bapak/Ibu %s. Saya dari Divisi Penanganan Khusus & Pemulihan Aset %s.", cust.Name, namaPT),
		ObligationDetail:   fmt.Sprintf("Kontrak kredit Bapak/Ibu telah menunggak selama %d hari dengan total tunggakan pokok, bunga dan denda sebesar %s.", maxDPD, overdueStr),
		NegotiationTactic:  "Sampaikan konsekuensi hukum dan penurunan status kolektibilitas di SLIK OJK (Kol 2/3/4/5). Tekankan pentingnya kehadiran debitur di kantor cabang atau penyelesaian hari ini.",
		ClosingCommitment:  "Kami membutuhkan pembayaran penuh atau penyerahan komitmen formal tertulis hari ini. Jika tidak, proses hukum eksekusi hak tanggungan/jaminan fidusia akan segera dijalankan.",
		EscalationWarning:  "Akun memenuhi syarat eskalasi ke Surat Peringatan SP-2/SP-3, Somasi Hukum, dan pelelangan agunan melalui Balai Lelang Resmi.",
		RecommendedChannel: "Field Officer Visit & Legal Remedial Team",
		ChannelCostBadge:   "High Cost (Intensive Field & Legal)",
		CostSavingPercent:  45,
	}
}
