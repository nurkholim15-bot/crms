package handlers

import (
	"fmt"
	"net/http"
	"time"

	"crms-backend/internal/database"
	"crms-backend/internal/decisionengine"
	"crms-backend/internal/models"
	"github.com/gin-gonic/gin"
)

type EODSimulateRequest struct {
	IncrementDays int  `json:"increment_days"` // default 1 day
	AutoCureRatio float64 `json:"auto_cure_ratio"` // e.g. 0.05 (5% accounts make payment during EOD)
}

func SimulateEOD(c *gin.Context) {
	var req EODSimulateRequest
	_ = c.ShouldBindJSON(&req)
	if req.IncrementDays <= 0 {
		req.IncrementDays = 1
	}

	var accounts []models.OverdueAccount
	if err := database.DB.Preload("Agreement.Customer").Where("status != ?", "PAID").Find(&accounts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	engine := decisionengine.NewEngine()
	now := time.Now()

	updatedCount := 0
	curedCount := 0
	bucketChangedCount := 0

	for i := range accounts {
		acc := &accounts[i]

		// Simulasi pembayaran acak jika auto cure ratio diset
		if req.AutoCureRatio > 0 && float64((i*17)%100)/100.0 < req.AutoCureRatio {
			acc.Status = "PAID"
			acc.UpdatedAt = now
			database.DB.Save(acc)

			act := models.CollectionActivity{
				OverdueAccountID: acc.ID,
				AgreementNo:      acc.AgreementNo,
				ChannelType:      "CONFINS_PAYMENT",
				PerformedBy:      "CONFINS_EOD_BATCH",
				ContactStatus:    "PAID",
				ResultCode:       "FULL_INSTALLMENT_RECEIVED",
				Notes:            "Pembayaran angsuran terverifikasi pada proses EOD CONFINS",
				CreatedAt:        now,
			}
			database.DB.Create(&act)
			curedCount++
			continue
		}

		oldBucket := acc.CurrentBucket
		acc.DPD += req.IncrementDays

		isVIP := acc.Agreement.Customer.IsVIP
		isChampion := (acc.StrategyGroup == decisionengine.GroupChampion)

		eval := engine.Evaluate(acc.DPD, acc.RiskScore, isVIP, isChampion, int(acc.ID))

		if oldBucket != eval.Bucket {
			bucketChangedCount++
		}

		acc.CurrentBucket = eval.Bucket
		acc.RiskLevel = eval.RiskLevel
		acc.StrategyGroup = eval.StrategyGroup
		acc.ActionPath = eval.ActionPath
		acc.AssignedPIC = eval.AssignedPIC
		acc.PICChannel = eval.PICChannel
		acc.Notes = fmt.Sprintf("Updated by EOD (+%d hari). %s", req.IncrementDays, eval.DecisionRule)
		acc.UpdatedAt = now

		database.DB.Save(acc)
		updatedCount++
	}

	c.JSON(http.StatusOK, gin.H{
		"status":               "success",
		"message":              fmt.Sprintf("CONFINS EOD Batch run completed (+%d days)", req.IncrementDays),
		"total_processed":      len(accounts),
		"updated_accounts":     updatedCount,
		"cured_accounts":       curedCount,
		"bucket_shifted_count": bucketChangedCount,
	})
}

type PaymentSimulateRequest struct {
	AgreementNo string  `json:"agreement_no" binding:"required"`
	Amount      float64 `json:"amount" binding:"required"`
}

func SimulatePayment(c *gin.Context) {
	var req PaymentSimulateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var account models.OverdueAccount
	if err := database.DB.Where("agreement_no = ?", req.AgreementNo).First(&account).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Account not found"})
		return
	}

	account.Status = "PAID"
	account.Notes = fmt.Sprintf("Lunas via CONFINS Payment Integration Rp %.2f", req.Amount)
	now := time.Now()
	account.UpdatedAt = now
	database.DB.Save(&account)

	simbolPT := GetGlobalParam("GENERAL_SIMBOL_PT", "CRMS")
	act := models.CollectionActivity{
		OverdueAccountID: account.ID,
		AgreementNo:      account.AgreementNo,
		ChannelType:      "CONFINS_CORE",
		PerformedBy:      "CONFINS_INTEGRATION",
		ContactStatus:    "PAID",
		ResultCode:       "PAYMENT_CLEARED",
		PTPAmount:        req.Amount,
		Notes:            fmt.Sprintf("Pembayaran diterima sebesar Rp %.2f melalui Virtual Account %s", req.Amount, simbolPT),
		CreatedAt:        now,
	}
	database.DB.Create(&act)

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Payment recorded and account status set to PAID (Cured)",
		"data":    account,
	})
}

func ResetDemoData(c *gin.Context) {
	db := database.DB

	// Bersihkan data
	db.Exec("TRUNCATE TABLE collection_activities, overdue_accounts, decision_rules, agreements, customers RESTART IDENTITY CASCADE")

	// Re-seed
	database.SeedInitialData(db)

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Demo data successfully re-initialized with 50+ retail overdue accounts!",
	})
}
