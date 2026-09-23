package handlers

import (
	"net/http"
	"time"

	"crms-backend/internal/database"
	"crms-backend/internal/models"
	"github.com/gin-gonic/gin"
)

type CreateActivityRequest struct {
	OverdueAccountID uint       `json:"overdue_account_id" binding:"required"`
	AgreementNo      string     `json:"agreement_no" binding:"required"`
	ChannelType      string     `json:"channel_type" binding:"required"` // WA, ROBO, DERO, FO, FRO, RSO, RRO, AR Head
	PerformedBy      string     `json:"performed_by" binding:"required"`
	ContactStatus    string     `json:"contact_status" binding:"required"`
	ResultCode       string     `json:"result_code"`
	PTPDate          *time.Time `json:"ptp_date"`
	PTPAmount        float64    `json:"ptp_amount"`
	GeoLat           float64    `json:"geo_lat"`
	GeoLng           float64    `json:"geo_lng"`
	Notes            string     `json:"notes"`
}

func CreateActivity(c *gin.Context) {
	var req CreateActivityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	act := models.CollectionActivity{
		OverdueAccountID: req.OverdueAccountID,
		AgreementNo:      req.AgreementNo,
		ChannelType:      req.ChannelType,
		PerformedBy:      req.PerformedBy,
		ContactStatus:    req.ContactStatus,
		ResultCode:       req.ResultCode,
		PTPDate:          req.PTPDate,
		PTPAmount:        req.PTPAmount,
		GeoLat:           req.GeoLat,
		GeoLng:           req.GeoLng,
		Notes:            req.Notes,
		CreatedAt:        time.Now(),
	}

	if err := database.DB.Create(&act).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Update OverdueAccount LastContactAt and PTP if present
	var account models.OverdueAccount
	if err := database.DB.First(&account, req.OverdueAccountID).Error; err == nil {
		now := time.Now()
		account.LastContactAt = &now
		if req.PTPDate != nil {
			account.PTPDate = req.PTPDate
			account.PTPAmount = req.PTPAmount
			account.Status = "PROMISE_TO_PAY"
		}
		if req.ResultCode == "PAID" {
			account.Status = "PAID"
		}
		database.DB.Save(&account)
	}

	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "Collection activity logged successfully",
		"data":    act,
	})
}

func GetActivitiesByAgreement(c *gin.Context) {
	agrNo := c.Param("agreement_no")
	var activities []models.CollectionActivity
	if err := database.DB.Where("agreement_no = ?", agrNo).Order("created_at desc").Find(&activities).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"total":  len(activities),
		"data":   activities,
	})
}
