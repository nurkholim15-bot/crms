package handlers

import (
	"fmt"
	"net/http"
	"time"

	"crms-backend/internal/database"
	"crms-backend/internal/models"
	"github.com/gin-gonic/gin"
)

type VIPActionRequest struct {
	AssignedSpecialist string     `json:"assigned_specialist"`
	ActionPlan         string     `json:"action_plan"`
	PTPDate            *time.Time `json:"ptp_date"`
	PTPAmount          float64    `json:"ptp_amount"`
	Notes              string     `json:"notes"`
}

func GetVIPAccounts(c *gin.Context) {
	var accounts []models.OverdueAccount
	err := database.DB.Preload("Agreement.Customer").
		Where("strategy_group = ? OR action_path = ?", "VIP", "VIP").
		Order("overdue_amount desc").
		Find(&accounts).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"total":  len(accounts),
		"data":   accounts,
	})
}

func AssignVIPAction(c *gin.Context) {
	agrNo := c.Param("agreement_no")

	var req VIPActionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var account models.OverdueAccount
	if err := database.DB.Where("agreement_no = ?", agrNo).First(&account).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "VIP Account not found"})
		return
	}

	now := time.Now()
	account.Notes = fmt.Sprintf("AR Head Action: %s. Specialist: %s. %s", req.ActionPlan, req.AssignedSpecialist, req.Notes)
	if req.PTPDate != nil {
		account.PTPDate = req.PTPDate
		account.PTPAmount = req.PTPAmount
		account.Status = "PROMISE_TO_PAY"
	}
	account.LastContactAt = &now
	account.UpdatedAt = now

	database.DB.Save(&account)

	act := models.CollectionActivity{
		OverdueAccountID: account.ID,
		AgreementNo:      account.AgreementNo,
		ChannelType:      "AR Head",
		PerformedBy:      "AR_HEAD_BRANCH_01",
		ContactStatus:    "VIP_DIRECT_HANDLED",
		ResultCode:       "CUSTOM_TREATMENT_APPLIED",
		PTPDate:          req.PTPDate,
		PTPAmount:        req.PTPAmount,
		Notes:            fmt.Sprintf("AR Head penanganan eksklusif: %s (PIC: %s)", req.ActionPlan, req.AssignedSpecialist),
		CreatedAt:        now,
	}
	database.DB.Create(&act)

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "VIP account action successfully recorded by AR Head",
		"data":    account,
	})
}
