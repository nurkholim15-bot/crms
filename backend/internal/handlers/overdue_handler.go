package handlers

import (
	"net/http"
	"strconv"
	"time"

	"crms-backend/internal/database"
	"crms-backend/internal/decisionengine"
	"crms-backend/internal/models"
	"github.com/gin-gonic/gin"
)

func GetOverdueAccounts(c *gin.Context) {
	db := database.DB

	bucket := c.Query("bucket")
	actionPath := c.Query("action_path")
	riskLevel := c.Query("risk_level")
	strategyGroup := c.Query("strategy_group")
	assignedPIC := c.Query("assigned_pic")
	status := c.Query("status")
	search := c.Query("search")

	recoveryStage := c.Query("recovery_stage")

	query := db.Model(&models.OverdueAccount{}).Preload("Agreement.Customer")

	if bucket != "" {
		query = query.Where("current_bucket = ?", bucket)
	}
	if actionPath != "" {
		query = query.Where("action_path = ?", actionPath)
	}
	if riskLevel != "" {
		query = query.Where("risk_level = ?", riskLevel)
	}
	if strategyGroup != "" {
		query = query.Where("strategy_group = ?", strategyGroup)
	}
	if assignedPIC != "" {
		query = query.Where("assigned_pic = ?", assignedPIC)
	}
	if recoveryStage != "" {
		query = query.Where("recovery_stage = ?", recoveryStage)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if search != "" {
		query = query.Joins("JOIN agreements ON agreements.agreement_no = overdue_accounts.agreement_no").
			Joins("JOIN customers ON customers.id = agreements.customer_id").
			Where("overdue_accounts.agreement_no ILIKE ? OR customers.name ILIKE ? OR agreements.asset_model ILIKE ?",
				"%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	var accounts []models.OverdueAccount
	if err := query.Order("dpd desc, overdue_amount desc").Find(&accounts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"total":  len(accounts),
		"data":   accounts,
	})
}

func GetOverdueAccountDetail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var account models.OverdueAccount
	if err := database.DB.Preload("Agreement.Customer").First(&account, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Account not found"})
		return
	}

	var activities []models.CollectionActivity
	database.DB.Where("overdue_account_id = ?", account.ID).Order("created_at desc").Find(&activities)

	c.JSON(http.StatusOK, gin.H{
		"status":     "success",
		"data":       account,
		"activities": activities,
	})
}

type ReevaluateRequest struct {
	IsChampion bool `json:"is_champion"`
}

func ReevaluateAccount(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var req ReevaluateRequest
	_ = c.ShouldBindJSON(&req)

	var account models.OverdueAccount
	if err := database.DB.Preload("Agreement.Customer").First(&account, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Account not found"})
		return
	}

	engine := decisionengine.NewEngine()
	isVIP := account.Agreement.Customer.IsVIP
	eval := engine.Evaluate(account.DPD, account.RiskScore, isVIP, req.IsChampion, int(account.ID))

	account.CurrentBucket = eval.Bucket
	account.RiskLevel = eval.RiskLevel
	account.StrategyGroup = eval.StrategyGroup
	account.ActionPath = eval.ActionPath
	account.AssignedPIC = eval.AssignedPIC
	account.PICChannel = eval.PICChannel
	account.Notes = eval.DecisionRule
	account.UpdatedAt = time.Now()

	if err := database.DB.Save(&account).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":     "success",
		"message":    "Account successfully re-evaluated by Decision Engine",
		"data":       account,
		"evaluation": eval,
	})
}

type UpdateStatusRequest struct {
	Status      string     `json:"status"`
	PTPDate     *time.Time `json:"ptp_date"`
	PTPAmount   float64    `json:"ptp_amount"`
	AssignedPIC string     `json:"assigned_pic"`
	Notes       string     `json:"notes"`
	PerformedBy string     `json:"performed_by"`
}

func UpdateAccountStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var req UpdateStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var account models.OverdueAccount
	if err := database.DB.First(&account, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Account not found"})
		return
	}

	if req.Status != "" {
		account.Status = req.Status
	}
	if req.AssignedPIC != "" {
		account.AssignedPIC = req.AssignedPIC
		account.PICChannel = decisionengine.GetPICChannelName(req.AssignedPIC)
	}
	if req.PTPDate != nil {
		account.PTPDate = req.PTPDate
		account.PTPAmount = req.PTPAmount
	}
	if req.Notes != "" {
		account.Notes = req.Notes
	}

	now := time.Now()
	account.LastContactAt = &now
	account.UpdatedAt = now

	if err := database.DB.Save(&account).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Buat log aktivitas
	performer := req.PerformedBy
	if performer == "" {
		performer = "System_User"
	}
	act := models.CollectionActivity{
		OverdueAccountID: account.ID,
		AgreementNo:      account.AgreementNo,
		ChannelType:      account.AssignedPIC,
		PerformedBy:      performer,
		ContactStatus:    req.Status,
		ResultCode:       req.Status,
		PTPDate:          req.PTPDate,
		PTPAmount:        req.PTPAmount,
		Notes:            req.Notes,
		CreatedAt:        now,
	}
	database.DB.Create(&act)

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Account status updated successfully",
		"data":    account,
	})
}
