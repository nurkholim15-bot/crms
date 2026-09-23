package handlers

import (
	"fmt"
	"math"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"crms-backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type MCollectHandler struct {
	db *gorm.DB
}

func NewMCollectHandler(db *gorm.DB) *MCollectHandler {
	return &MCollectHandler{db: db}
}

// GetMCollectAccounts mengembalikan daftar akun tagihan yang ditugaskan ke petugas lapangan
func (h *MCollectHandler) GetMCollectAccounts(c *gin.Context) {
	var accounts []models.OverdueAccount
	query := h.db.Preload("Agreement").Preload("Agreement.Customer").Order("dpd desc")

	pic := c.Query("collector")
	if pic != "" {
		query = query.Where("assigned_pic = ?", pic)
	}

	bucket := c.Query("bucket")
	if bucket != "" {
		query = query.Where("current_bucket = ?", bucket)
	}

	if err := query.Find(&accounts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil daftar akun koleksi: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": accounts,
		"count": len(accounts),
	})
}

type RecordPaymentRequest struct {
	AgreementNo       string  `json:"agreement_no" binding:"required"`
	AmountPaid        float64 `json:"amount_paid" binding:"required"`
	PaymentMethod     string  `json:"payment_method" binding:"required"` // CASH, QRIS, ONLINE_VA
	CollectorUsername string  `json:"collector_username"`
	CollectorName     string  `json:"collector_name"`
	TrancheNumber     int     `json:"tranche_number"`
	GeotagLat         float64 `json:"geotag_lat"`
	GeotagLng         float64 `json:"geotag_lng"`
	Notes             string  `json:"notes"`
	SendWhatsAppNow   bool    `json:"send_whatsapp_now"`
}

// RecordPayment mencatat pembayaran langsung di lapangan dan menerbitkan PIS (Payment Information Slip)
func (h *MCollectHandler) RecordPayment(c *gin.Context) {
	var req RecordPaymentRequest
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

	now := time.Now()
	receiptNo := fmt.Sprintf("PIS-%s-%04d", now.Format("20060102"), now.UnixNano()%10000)

	collectorUser := req.CollectorUsername
	if collectorUser == "" {
		collectorUser = overdue.AssignedPIC
	}
	collectorName := req.CollectorName
	if collectorName == "" {
		collectorName = collectorUser
	}

	slip := models.PaymentReceiptSlip{
		ReceiptNo:         receiptNo,
		AgreementNo:       req.AgreementNo,
		CustomerID:        overdue.Agreement.CustomerID,
		AmountPaid:        req.AmountPaid,
		PaymentMethod:     req.PaymentMethod,
		TrancheNumber:     req.TrancheNumber,
		CollectorUsername: collectorUser,
		CollectorName:     collectorName,
		ReceiptURL:        fmt.Sprintf("/api/v1/mcollect/receipts/%s", receiptNo),
		WhatsAppSent:      req.SendWhatsAppNow,
		GeotagLat:         req.GeotagLat,
		GeotagLng:         req.GeotagLng,
		Notes:             req.Notes,
		IssuedAt:          now,
	}

	if err := h.db.Create(&slip).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menerbitkan kuitansi PIS: " + err.Error()})
		return
	}

	// Update sisa tunggakan
	newOverdue := overdue.OverdueAmount - req.AmountPaid
	if newOverdue < 0 {
		newOverdue = 0
	}
	overdue.OverdueAmount = newOverdue
	if newOverdue == 0 {
		overdue.RecoveryStage = "STAGE_CLOSED"
	}
	h.db.Save(&overdue)

	// Log ke CollectionActivity
	h.db.Create(&models.CollectionActivity{
		OverdueAccountID: overdue.ID,
		AgreementNo:      req.AgreementNo,
		ChannelType:      "FO",
		PerformedBy:      collectorUser,
		ContactStatus:    "PAID",
		ResultCode:       "PAYMENT_RECEIVED",
		GeoLat:           req.GeotagLat,
		GeoLng:           req.GeotagLng,
		Notes:            fmt.Sprintf("Penerimaan pelunasan lapangan via %s: Rp %.0f. No Bukti: %s", req.PaymentMethod, req.AmountPaid, receiptNo),
		CreatedAt:        now,
	})

	var waURL string
	if req.SendWhatsAppNow {
		phone := cleanPhoneNum(overdue.Agreement.Customer.Phone)
		msg := fmt.Sprintf(
			"Halo Bpk/Ibu %s, pembayaran angsuran kredit No %s sebesar Rp %s via %s telah berhasil kami terima. Bukti setor digital (PIS): %s. Terima kasih atas kerja sama Anda.",
			overdue.Agreement.Customer.Name,
			req.AgreementNo,
			formatRupiah(req.AmountPaid),
			req.PaymentMethod,
			receiptNo,
		)
		waURL = fmt.Sprintf("https://api.whatsapp.com/send?phone=%s&text=%s", phone, url.QueryEscape(msg))
	}

	c.JSON(http.StatusOK, gin.H{
		"message":      "Pembayaran berhasil dicatat & PIS berhasil diterbitkan",
		"receipt":      slip,
		"whatsapp_url": waURL,
	})
}

type RequestPaymentLinkRequest struct {
	AgreementNo string  `json:"agreement_no" binding:"required"`
	Amount      float64 `json:"amount" binding:"required"`
	Method      string  `json:"method"` // QRIS, VIRTUAL_ACCOUNT
	Collector   string  `json:"collector"`
}

// RequestPaymentLink membuat tautan bayar instan (QRIS / VA) dan mengirimkan ke WhatsApp debitur
func (h *MCollectHandler) RequestPaymentLink(c *gin.Context) {
	var req RequestPaymentLinkRequest
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

	method := req.Method
	if method == "" {
		method = "QRIS"
	}

	now := time.Now()
	vaNumber := fmt.Sprintf("8809%s%04d", overdue.AgreementNo[len(overdue.AgreementNo)-4:], now.Unix()%10000)
	qrCodePayload := fmt.Sprintf("00020101021226680016ID.CO.BANKCRMS.WWW011893600002%s52045812530336054%0.2f5802ID5914CRMS_COLLECT6007JAKARTA", req.AgreementNo, req.Amount)
	paymentURL := fmt.Sprintf("https://pay.crms.bank.id/checkout/%s-%d", req.AgreementNo, now.Unix())

	phone := cleanPhoneNum(overdue.Agreement.Customer.Phone)
	waMessage := fmt.Sprintf(
		"Yth. Bpk/Ibu %s,\nPetugas kami (%s) telah membuatkan link pembayaran tagihan perjanjian No %s.\n\nNominal: Rp %s\nMetode: %s\nNomor VA/Kode Bayar: %s\nLink Pembayaran Langsung: %s\n\nLink berlaku selama 24 jam. Abaikan jika sudah membayar.",
		overdue.Agreement.Customer.Name,
		req.Collector,
		req.AgreementNo,
		formatRupiah(req.Amount),
		method,
		vaNumber,
		paymentURL,
	)

	waLink := fmt.Sprintf("https://api.whatsapp.com/send?phone=%s&text=%s", phone, url.QueryEscape(waMessage))

	// Catat audit aktivitas
	h.db.Create(&models.CollectionActivity{
		OverdueAccountID: overdue.ID,
		AgreementNo:      req.AgreementNo,
		ChannelType:      "WA",
		PerformedBy:      req.Collector,
		ContactStatus:    "CONTACTED",
		ResultCode:       "PAYMENT_LINK_SENT",
		Notes:            fmt.Sprintf("Payment Link QRIS/VA Rp %s di-generate oleh %s. VA: %s", formatRupiah(req.Amount), req.Collector, vaNumber),
		CreatedAt:        now,
	})

	c.JSON(http.StatusOK, gin.H{
		"message":         "Tautan pembayaran digital berhasil dibuat",
		"va_number":       vaNumber,
		"payment_url":     paymentURL,
		"qris_code":       qrCodePayload,
		"whatsapp_url":    waLink,
		"amount":          req.Amount,
		"recipient_phone": overdue.Agreement.Customer.Phone,
		"recipient_name":  overdue.Agreement.Customer.Name,
	})
}

// GetReceipts mengembalikan daftar riwayat kuitansi PIS
func (h *MCollectHandler) GetReceipts(c *gin.Context) {
	var slips []models.PaymentReceiptSlip
	query := h.db.Preload("Customer").Order("issued_at desc")

	agreement := c.Query("agreement_no")
	if agreement != "" {
		query = query.Where("agreement_no = ?", agreement)
	}

	collector := c.Query("collector")
	if collector != "" {
		query = query.Where("collector_username = ?", collector)
	}

	if err := query.Find(&slips).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data PIS: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": slips})
}

// SendReceiptWhatsApp mengirim ulang atau membagikan kuitansi digital PIS ke WhatsApp
func (h *MCollectHandler) SendReceiptWhatsApp(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID kuitansi tidak valid"})
		return
	}

	var slip models.PaymentReceiptSlip
	if err := h.db.Preload("Customer").First(&slip, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Data kuitansi tidak ditemukan"})
		return
	}

	slip.WhatsAppSent = true
	h.db.Save(&slip)

	phone := cleanPhoneNum(slip.Customer.Phone)
	msg := fmt.Sprintf(
		"BUKTI PEMBAYARAN ANGSURAN RESMI (PIS)\nNo Kuitansi: %s\nTanggal: %s\nNo Kontrak: %s\nDebitur: %s\nJumlah Bayar: Rp %s\nMetode: %s\nPetugas: %s\nStatus: BERHASIL DITERIMA.\n\nTerima kasih atas pembayaran Anda.",
		slip.ReceiptNo,
		slip.IssuedAt.Format("02/01/2006 15:04 WIB"),
		slip.AgreementNo,
		slip.Customer.Name,
		formatRupiah(slip.AmountPaid),
		slip.PaymentMethod,
		slip.CollectorName,
	)

	waURL := fmt.Sprintf("https://api.whatsapp.com/send?phone=%s&text=%s", phone, url.QueryEscape(msg))

	c.JSON(http.StatusOK, gin.H{
		"message":      "Kuitansi PIS siap dikirim via WhatsApp",
		"whatsapp_url": waURL,
		"data":         slip,
	})
}

type ForeclosureRequest struct {
	AgreementNo      string  `json:"agreement_no" binding:"required"`
	PayoffDate       string  `json:"payoff_date"` // YYYY-MM-DD
	PenaltyPct       float64 `json:"penalty_pct"` // Default 3% - 5%
	InterestDiscount float64 `json:"interest_discount_pct"` // Diskon bunga berjalan (0 - 50%)
}

// SimulateForeclosure menghitung simulasi pelunasan dipercepat (Early Payoff / Foreclosure)
func (h *MCollectHandler) SimulateForeclosure(c *gin.Context) {
	var req ForeclosureRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format request simulasi pelunasan tidak valid: " + err.Error()})
		return
	}

	var overdue models.OverdueAccount
	if err := h.db.Preload("Agreement").Preload("Agreement.Customer").
		Where("agreement_no = ?", req.AgreementNo).First(&overdue).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Akun perjanjian tidak ditemukan: " + req.AgreementNo})
		return
	}

	agr := overdue.Agreement
	remainingTenor := agr.TenorMonths - agr.PaidTenorMonths
	if remainingTenor <= 0 {
		remainingTenor = 1
	}

	// Hitung perkiraan pokok terhutang (outstanding principal)
	monthlyPrincipal := agr.TotalFinancing / float64(agr.TenorMonths)
	outstandingPrincipal := monthlyPrincipal * float64(remainingTenor)

	// Bunga berjalan yang belum ditagih (unbilled interest)
	monthlyInterest := agr.InstallmentAmount - monthlyPrincipal
	if monthlyInterest < 0 {
		monthlyInterest = 0
	}
	unbilledInterest := monthlyInterest * float64(remainingTenor) * 0.45 // Pro-rata rebate rule 78

	penaltyPct := req.PenaltyPct
	if penaltyPct <= 0 {
		penaltyPct = 3.5 // Standar industri 3.5% dari sisa pokok
	}
	penaltyFee := outstandingPrincipal * (penaltyPct / 100.0)

	// Diskon bunga yang diberikan
	discountPct := req.InterestDiscount
	discountAmount := unbilledInterest * (discountPct / 100.0)
	netInterest := unbilledInterest - discountAmount

	// Denda keterlambatan saat ini
	penaltyLate := overdue.OverdueAmount * 0.05

	// Total bersih pelunasan dipercepat
	totalNetPayoff := outstandingPrincipal + netInterest + penaltyFee + penaltyLate

	c.JSON(http.StatusOK, gin.H{
		"agreement_no":           agr.AgreementNo,
		"customer_name":          agr.Customer.Name,
		"phone":                  agr.Customer.Phone,
		"asset_model":            agr.AssetModel,
		"total_financing":        agr.TotalFinancing,
		"tenor_total":            agr.TenorMonths,
		"paid_tenor":             agr.PaidTenorMonths,
		"remaining_tenor":        remainingTenor,
		"outstanding_principal":  math.Round(outstandingPrincipal),
		"unbilled_interest":      math.Round(unbilledInterest),
		"interest_discount_pct":  discountPct,
		"interest_rebate_amount": math.Round(discountAmount),
		"net_interest":           math.Round(netInterest),
		"early_termination_fee":  math.Round(penaltyFee),
		"penalty_pct":            penaltyPct,
		"late_fee_arrears":       math.Round(penaltyLate),
		"total_net_payoff":       math.Round(totalNetPayoff),
		"calculation_date":       time.Now().Format("02 Jan 2006"),
		"valid_until":            time.Now().AddDate(0, 0, 7).Format("02 Jan 2006"),
	})
}

func formatRupiah(amount float64) string {
	str := fmt.Sprintf("%.0f", amount)
	var res string
	length := len(str)
	for i, c := range str {
		res += string(c)
		posFromRight := length - 1 - i
		if posFromRight > 0 && posFromRight%3 == 0 {
			res += "."
		}
	}
	return res
}
