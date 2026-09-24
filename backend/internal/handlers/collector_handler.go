package handlers

import (
	"fmt"
	"math"
	"net/http"
	"strconv"
	"time"

	"crms-backend/internal/decisionengine"
	"crms-backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CollectorHandler struct {
	db *gorm.DB
}

func NewCollectorHandler(db *gorm.DB) *CollectorHandler {
	return &CollectorHandler{db: db}
}

// -------------------------------------------------------------
// 1. COLLECTOR TASK LIST & TODAY'S PLAN
// -------------------------------------------------------------

// GetCollectorTasks mengembalikan daftar seluruh tugas penagihan yang dialokasikan ke kolektor
func (h *CollectorHandler) GetCollectorTasks(c *gin.Context) {
	collector := c.Query("collector")
	bucket := c.Query("bucket")
	status := c.Query("status")
	search := c.Query("search")
	todayDate := time.Now().Format("2006-01-02")

	query := h.db.Model(&models.OverdueAccount{}).
		Preload("Agreement.Customer").
		Order("dpd desc, overdue_amount desc")

	if collector != "" && collector != "ALL" {
		query = query.Where("assigned_pic = ? OR assigned_pic ILIKE ?", collector, "%"+collector+"%")
	}

	if bucket != "" && bucket != "ALL" {
		query = query.Where("current_bucket = ?", bucket)
	}

	if status != "" && status != "ALL" {
		query = query.Where("status = ?", status)
	}

	if search != "" {
		query = query.Joins("JOIN agreements ON agreements.agreement_no = overdue_accounts.agreement_no").
			Joins("JOIN customers ON customers.id = agreements.customer_id").
			Where("overdue_accounts.agreement_no ILIKE ? OR customers.name ILIKE ? OR agreements.asset_model ILIKE ?",
				"%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	var accounts []models.OverdueAccount
	if err := query.Find(&accounts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil task list: " + err.Error()})
		return
	}

	// Cek akun mana yang sudah ada di Today's Plan untuk hari ini
	var todayPlans []models.CollectorDailyPlan
	h.db.Where("plan_date = ?", todayDate).Find(&todayPlans)
	planMap := make(map[string]models.CollectorDailyPlan)
	for _, p := range todayPlans {
		planMap[p.AgreementNo] = p
	}

	type TaskItemResponse struct {
		models.OverdueAccount
		InTodayPlan  bool   `json:"in_today_plan"`
		PlanID       uint   `json:"plan_id,omitempty"`
		PlanStatus   string `json:"plan_status,omitempty"`
		PlanPriority string `json:"plan_priority,omitempty"`
		PlanRouteNo  int    `json:"plan_route_no,omitempty"`
		PlanTime     string `json:"plan_estimated_time,omitempty"`
	}

	var result []TaskItemResponse
	for _, a := range accounts {
		item := TaskItemResponse{OverdueAccount: a}
		if p, ok := planMap[a.AgreementNo]; ok {
			item.InTodayPlan = true
			item.PlanID = p.ID
			item.PlanStatus = p.Status
			item.PlanPriority = p.Priority
			item.PlanRouteNo = p.RouteOrder
			item.PlanTime = p.EstimatedTime
		}
		result = append(result, item)
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  result,
		"count": len(result),
		"date":  todayDate,
	})
}

// GetTodayPlan mengembalikan daftar tugas yang sudah dipilih kolektor untuk dikerjakan hari ini
func (h *CollectorHandler) GetTodayPlan(c *gin.Context) {
	collector := c.Query("collector")
	dateStr := c.Query("date")
	if dateStr == "" {
		dateStr = time.Now().Format("2006-01-02")
	}

	query := h.db.Model(&models.CollectorDailyPlan{}).
		Preload("OverdueAccount.Agreement.Customer").
		Where("plan_date = ?", dateStr).
		Order("route_order asc, priority desc")

	if collector != "" && collector != "ALL" {
		query = query.Where("collector_username = ? OR collector_name ILIKE ?", collector, "%"+collector+"%")
	}

	var plans []models.CollectorDailyPlan
	if err := query.Find(&plans).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil Today's Plan: " + err.Error()})
		return
	}

	var totalPlanned = len(plans)
	var completedCount = 0
	var visitedCount = 0
	var ptpCount = 0
	var paidCount = 0
	var totalTargetAmount float64 = 0
	var totalCollectedAmount float64 = 0

	for _, p := range plans {
		totalTargetAmount += p.OverdueAccount.OverdueAmount
		if p.Status == "VISITED" {
			visitedCount++
			completedCount++
		} else if p.Status == "PTP" {
			ptpCount++
			completedCount++
		} else if p.Status == "PAID" {
			paidCount++
			completedCount++
			totalCollectedAmount += p.OverdueAccount.OverdueAmount
		}
	}

	var progressPct float64 = 0
	if totalPlanned > 0 {
		progressPct = math.Round((float64(completedCount) / float64(totalPlanned)) * 100)
	}

	c.JSON(http.StatusOK, gin.H{
		"data": plans,
		"summary": gin.H{
			"plan_date":              dateStr,
			"total_planned":          totalPlanned,
			"completed_count":        completedCount,
			"pending_count":          totalPlanned - completedCount,
			"visited_count":          visitedCount,
			"ptp_count":              ptpCount,
			"paid_count":             paidCount,
			"progress_pct":           progressPct,
			"total_target_amount":    totalTargetAmount,
			"total_collected_amount": totalCollectedAmount,
		},
	})
}

type AddToPlanRequest struct {
	AgreementNo       string `json:"agreement_no" binding:"required"`
	CollectorUsername string `json:"collector_username"`
	CollectorName     string `json:"collector_name"`
	Priority          string `json:"priority"` // HIGH, MEDIUM, LOW
	EstimatedTime     string `json:"estimated_time"`
	Notes             string `json:"notes"`
	PlanDate          string `json:"plan_date"`
}

// AddToTodayPlan menambahkan task ke Today's Plan
func (h *CollectorHandler) AddToTodayPlan(c *gin.Context) {
	var req AddToPlanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Request tidak valid: " + err.Error()})
		return
	}

	var overdue models.OverdueAccount
	if err := h.db.Preload("Agreement.Customer").Where("agreement_no = ?", req.AgreementNo).First(&overdue).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Akun tidak ditemukan: " + req.AgreementNo})
		return
	}

	planDate := req.PlanDate
	if planDate == "" {
		planDate = time.Now().Format("2006-01-02")
	}

	colUser := req.CollectorUsername
	if colUser == "" {
		colUser = overdue.AssignedPIC
	}
	colName := req.CollectorName
	if colName == "" {
		colName = colUser
	}

	// Cek apakah sudah terdaftar di plan hari ini
	var existing models.CollectorDailyPlan
	if err := h.db.Where("plan_date = ? AND agreement_no = ?", planDate, req.AgreementNo).First(&existing).Error; err == nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "Akun sudah ada di Today's Plan",
			"data":    existing,
		})
		return
	}

	// Hitung sequence route_order berikutnya
	var count int64
	h.db.Model(&models.CollectorDailyPlan{}).Where("plan_date = ? AND collector_username = ?", planDate, colUser).Count(&count)
	routeOrder := int(count) + 1

	priority := req.Priority
	if priority == "" {
		if overdue.DPD > 30 || overdue.RiskLevel == "HIGH_RISK" {
			priority = "HIGH"
		} else {
			priority = "MEDIUM"
		}
	}

	estTime := req.EstimatedTime
	if estTime == "" {
		hour := 8 + routeOrder
		estTime = fmt.Sprintf("%02d:30 WIB", hour)
	}

	now := time.Now()
	newPlan := models.CollectorDailyPlan{
		PlanDate:          planDate,
		CollectorUsername: colUser,
		CollectorName:     colName,
		AgreementNo:       req.AgreementNo,
		OverdueAccountID:  overdue.ID,
		Priority:          priority,
		Status:            "PLANNED",
		RouteOrder:        routeOrder,
		EstimatedTime:     estTime,
		Notes:             req.Notes,
		CreatedAt:         now,
		UpdatedAt:         now,
	}

	if err := h.db.Create(&newPlan).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan plan: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Berhasil ditambahkan ke Today's Plan",
		"data":    newPlan,
	})
}

type BulkAddToPlanRequest struct {
	AgreementNos      []string `json:"agreement_nos" binding:"required"`
	CollectorUsername string   `json:"collector_username"`
	CollectorName     string   `json:"collector_name"`
	PlanDate          string   `json:"plan_date"`
}

// BulkAddToTodayPlan menambahkan beberapa akun sekaligus ke Today's Plan
func (h *CollectorHandler) BulkAddToTodayPlan(c *gin.Context) {
	var req BulkAddToPlanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Request tidak valid: " + err.Error()})
		return
	}

	planDate := req.PlanDate
	if planDate == "" {
		planDate = time.Now().Format("2006-01-02")
	}

	var addedCount = 0
	for idx, agrNo := range req.AgreementNos {
		var overdue models.OverdueAccount
		if err := h.db.Where("agreement_no = ?", agrNo).First(&overdue).Error; err != nil {
			continue
		}

		var existing models.CollectorDailyPlan
		if err := h.db.Where("plan_date = ? AND agreement_no = ?", planDate, agrNo).First(&existing).Error; err == nil {
			continue
		}

		colUser := req.CollectorUsername
		if colUser == "" {
			colUser = overdue.AssignedPIC
		}
		colName := req.CollectorName
		if colName == "" {
			colName = colUser
		}

		var count int64
		h.db.Model(&models.CollectorDailyPlan{}).Where("plan_date = ? AND collector_username = ?", planDate, colUser).Count(&count)
		routeOrder := int(count) + 1

		hour := 8 + ((routeOrder + idx) % 8)
		estTime := fmt.Sprintf("%02d:00 WIB", hour)

		p := models.CollectorDailyPlan{
			PlanDate:          planDate,
			CollectorUsername: colUser,
			CollectorName:     colName,
			AgreementNo:       agrNo,
			OverdueAccountID:  overdue.ID,
			Priority:          "MEDIUM",
			Status:            "PLANNED",
			RouteOrder:        routeOrder,
			EstimatedTime:     estTime,
			CreatedAt:         time.Now(),
			UpdatedAt:         time.Now(),
		}
		if err := h.db.Create(&p).Error; err == nil {
			addedCount++
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Berhasil menambahkan %d akun ke Today's Plan", addedCount),
		"count":   addedCount,
	})
}

type UpdatePlanStatusRequest struct {
	Status      string     `json:"status" binding:"required"` // VISITED, PTP, PAID, IN_PROGRESS, CANCELLED
	Notes       string     `json:"notes"`
	PTPDate     *time.Time `json:"ptp_date"`
	PTPAmount   float64    `json:"ptp_amount"`
	AmountPaid  float64    `json:"amount_paid"`
	GeoLat      float64    `json:"geo_lat"`
	GeoLng      float64    `json:"geo_lng"`
	PerformedBy string     `json:"performed_by"`
}

// UpdateTodayPlanStatus mengupdate status eksekusi kunjungan hari ini
func (h *CollectorHandler) UpdateTodayPlanStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID Plan tidak valid"})
		return
	}

	var req UpdatePlanStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format request tidak valid: " + err.Error()})
		return
	}

	var plan models.CollectorDailyPlan
	if err := h.db.Preload("OverdueAccount").First(&plan, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Rencana kunjungan tidak ditemukan"})
		return
	}

	now := time.Now()
	plan.Status = req.Status
	plan.Notes = req.Notes
	plan.UpdatedAt = now
	if plan.CheckinAt == nil {
		plan.CheckinAt = &now
	}
	h.db.Save(&plan)

	// Sinkronisasi status OverdueAccount dan catat CollectionActivity
	var account models.OverdueAccount
	if err := h.db.Where("id = ?", plan.OverdueAccountID).First(&account).Error; err == nil {
		if req.Status == "PTP" {
			account.Status = "PROMISE_TO_PAY"
			account.PTPDate = req.PTPDate
			account.PTPAmount = req.PTPAmount
		} else if req.Status == "PAID" {
			newOverdue := account.OverdueAmount - req.AmountPaid
			if newOverdue < 0 {
				newOverdue = 0
			}
			account.OverdueAmount = newOverdue
			if newOverdue == 0 {
				account.Status = "PAID"
				account.RecoveryStage = "STAGE_CLOSED"
			}
		}
		account.LastContactAt = &now
		account.UpdatedAt = now
		h.db.Save(&account)

		performer := req.PerformedBy
		if performer == "" {
			performer = plan.CollectorName
		}

		h.db.Create(&models.CollectionActivity{
			OverdueAccountID: account.ID,
			AgreementNo:      account.AgreementNo,
			ChannelType:      "FO",
			PerformedBy:      performer,
			ContactStatus:    req.Status,
			ResultCode:       req.Status,
			PTPDate:          req.PTPDate,
			PTPAmount:        req.PTPAmount,
			GeoLat:           req.GeoLat,
			GeoLng:           req.GeoLng,
			Notes:            fmt.Sprintf("[Today's Plan Eksekusi] %s", req.Notes),
			CreatedAt:        now,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Status rencana kunjungan berhasil diperbarui",
		"data":    plan,
	})
}

// RemoveFromTodayPlan menghapus task dari Today's Plan
func (h *CollectorHandler) RemoveFromTodayPlan(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID Plan tidak valid"})
		return
	}

	if err := h.db.Delete(&models.CollectorDailyPlan{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus plan: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task berhasil dihapus dari Today's Plan"})
}

// -------------------------------------------------------------
// 2. REASSIGN COLLECTOR
// -------------------------------------------------------------

type ReassignCollectorRequest struct {
	AgreementNos []string `json:"agreement_nos" binding:"required"`
	ToCollector  string   `json:"to_collector" binding:"required"`
	Reason       string   `json:"reason" binding:"required"` // OVERLOAD, SICK_LEAVE, AREA_ROTATION, PERFORMANCE_ESCALATION, OTHER
	Notes        string   `json:"notes"`
	ReassignedBy string   `json:"reassigned_by"`
}

// ReassignCollector memindahkan akun/task dari satu kolektor ke kolektor lain (single / bulk)
func (h *CollectorHandler) ReassignCollector(c *gin.Context) {
	var req ReassignCollectorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format request reassign tidak valid: " + err.Error()})
		return
	}

	reassignedBy := req.ReassignedBy
	if reassignedBy == "" {
		reassignedBy = "Supervisor_CRMS"
	}

	now := time.Now()
	var successCount = 0

	for _, agrNo := range req.AgreementNos {
		var account models.OverdueAccount
		if err := h.db.Preload("Agreement.Customer").Where("agreement_no = ?", agrNo).First(&account).Error; err != nil {
			continue
		}

		oldCollector := account.AssignedPIC
		newCollector := req.ToCollector

		// Update akun
		account.AssignedPIC = newCollector
		account.PICChannel = decisionengine.GetPICChannelName(newCollector)
		account.UpdatedAt = now
		h.db.Save(&account)

		// Catat ke riwayat log reassignment
		logEntry := models.CollectorReassignmentLog{
			AgreementNo:      agrNo,
			OverdueAccountID: account.ID,
			FromCollector:    oldCollector,
			ToCollector:      newCollector,
			Reason:           req.Reason,
			Notes:            req.Notes,
			ReassignedBy:     reassignedBy,
			ReassignedAt:     now,
		}
		h.db.Create(&logEntry)

		// Catat juga ke CollectionActivity untuk audit trail terpadu
		h.db.Create(&models.CollectionActivity{
			OverdueAccountID: account.ID,
			AgreementNo:      agrNo,
			ChannelType:      "AR_HEAD",
			PerformedBy:      reassignedBy,
			ContactStatus:    "REASSIGNED",
			ResultCode:       "COLLECTOR_CHANGED",
			Notes:            fmt.Sprintf("Akun dialihkan dari %s ke %s. Alasan: %s (%s)", oldCollector, newCollector, req.Reason, req.Notes),
			CreatedAt:        now,
		})

		// Perbarui atau hapus dari Today's Plan kolektor lama jika ada
		h.db.Model(&models.CollectorDailyPlan{}).
			Where("agreement_no = ? AND plan_date >= ?", agrNo, now.Format("2006-01-02")).
			Updates(map[string]interface{}{
				"collector_username": newCollector,
				"collector_name":     newCollector,
				"notes":              fmt.Sprintf("[Reassigned dari %s] %s", oldCollector, req.Notes),
				"updated_at":         now,
			})

		successCount++
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       fmt.Sprintf("Berhasil mereassign %d akun ke %s", successCount, req.ToCollector),
		"reassigned_to": req.ToCollector,
		"count":         successCount,
	})
}

// GetReassignmentLogs mengambil riwayat audit trail pengalihan kolektor
func (h *CollectorHandler) GetReassignmentLogs(c *gin.Context) {
	var logs []models.CollectorReassignmentLog
	query := h.db.Preload("OverdueAccount.Agreement.Customer").Order("reassigned_at desc").Limit(50)

	if err := query.Find(&logs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil log reassignment: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  logs,
		"count": len(logs),
	})
}

// -------------------------------------------------------------
// 3. INSENTIF COLLECTOR DENGAN BUCKET FLOW RATE MODIFIER
// -------------------------------------------------------------

type CollectorPerformanceItem struct {
	CollectorUsername string  `json:"collector_username"`
	CollectorName     string  `json:"collector_name"`
	RoleTitle         string  `json:"role_title"`
	BucketHandled     string  `json:"bucket_handled"`
	BaseIncentive     float64 `json:"base_incentive"`
	TargetCollection  float64 `json:"target_collection"`
	ActualCollection  float64 `json:"actual_collection"`
	CollectionRatePct float64 `json:"collection_rate_pct"` // KPI Utama %
	TotalPortfolio    int     `json:"total_portfolio_accounts"`
	FlowedAccounts    int     `json:"flowed_accounts"`      // Gagal tagih sehingga akun jatuh ke bucket berikutnya
	FlowRatePct       float64 `json:"flow_rate_pct"`        // Realisasi flow rate %
	FlowRateStatus    string  `json:"flow_rate_status"`     // Sangat Bagus, Memenuhi Target, Buruk, Sangat Buruk
	Modifier          float64 `json:"modifier"`             // 1.2, 1.0, 0.8, 0.5
	ModifierLabel     string  `json:"modifier_label"`      // Pengali: 1.2 (Insentif naik 20%), dll
	RunningIncentive  float64 `json:"running_incentive"`    // KPI Utama % x Base Incentive
	FinalIncentive    float64 `json:"final_incentive"`      // Running Incentive x Modifier
	FormulaDetail     string  `json:"formula_detail"`
	ScenarioType      string  `json:"scenario_type,omitempty"`
}

// calculateFlowRateModifier menentukan faktor pengali/pengurang berdasarkan matriks aturan
func calculateFlowRateModifier(flowRate float64) (float64, string, string) {
	switch {
	case flowRate < 10.0:
		return 1.2, "Sangat Bagus", "Faktor Pengali: 1.2 (Insentif naik 20%)"
	case flowRate >= 10.0 && flowRate <= 15.0:
		return 1.0, "Memenuhi Target", "Faktor Pengali: 1.0 (Insentif utuh 100%)"
	case flowRate > 15.0 && flowRate <= 20.0:
		return 0.8, "Buruk", "Faktor Pengurang: 0.8 (Insentif dipotong 20%)"
	default:
		return 0.5, "Sangat Buruk", "Faktor Pengurang: 0.5 (Insentif dipotong 50%)"
	}
}

// GetCollectorIncentives mengembalikan rekapitulasi data insentif seluruh kolektor
func (h *CollectorHandler) GetCollectorIncentives(c *gin.Context) {
	// Matriks aturan flow rate acuan manajemen
	rules := []gin.H{
		{
			"range":       "< 10%",
			"status":      "Sangat Bagus",
			"modifier":    1.2,
			"type":        "Pengali (Bonus)",
			"effect":      "Insentif naik 20%",
			"badge_color": "emerald",
		},
		{
			"range":       "10% - 15%",
			"status":      "Memenuhi Target",
			"modifier":    1.0,
			"type":        "Utuh",
			"effect":      "Insentif utuh (100%)",
			"badge_color": "blue",
		},
		{
			"range":       "15.1% - 20%",
			"status":      "Buruk",
			"modifier":    0.8,
			"type":        "Pengurang (Penalti)",
			"effect":      "Insentif dipotong 20%",
			"badge_color": "amber",
		},
		{
			"range":       "> 20%",
			"status":      "Sangat Buruk",
			"modifier":    0.5,
			"type":        "Pengurang (Penalti)",
			"effect":      "Insentif dipotong 50%",
			"badge_color": "rose",
		},
	}

	baseIncentive := 3000000.0 // Default Rp 3.000.000

	// Buat daftar profil performa kolektor, termasuk contoh Skenario Andi A & B dari spesifikasi user
	collectorsList := []CollectorPerformanceItem{
		// Skenario A: Andi Pratama (Flow Rate 8% - Bagus)
		func() CollectorPerformanceItem {
			kpiPct := 90.0
			flowRate := 8.0
			mod, status, label := calculateFlowRateModifier(flowRate)
			running := (kpiPct / 100.0) * baseIncentive
			finalInc := running * mod
			return CollectorPerformanceItem{
				CollectorUsername: "andi",
				CollectorName:     "Andi Pratama (Skenario A - Bonus)",
				RoleTitle:         "Field Collector Bucket 1",
				BucketHandled:     "Bucket 1 (1-30 DPD)",
				BaseIncentive:     baseIncentive,
				TargetCollection:  100000000,
				ActualCollection:  90000000,
				CollectionRatePct: kpiPct,
				TotalPortfolio:    50,
				FlowedAccounts:    4, // 4 / 50 = 8%
				FlowRatePct:       flowRate,
				FlowRateStatus:    status,
				Modifier:          mod,
				ModifierLabel:     label,
				RunningIncentive:  running,
				FinalIncentive:    finalInc,
				FormulaDetail:     fmt.Sprintf("Rp %.0f x 1.2 = Rp %.0f", running, finalInc),
				ScenarioType:      "BONUS_SCENARIO",
			}
		}(),
		// Skenario B: Andi Pratama (Flow Rate 18% - Buruk)
		func() CollectorPerformanceItem {
			kpiPct := 90.0
			flowRate := 18.0
			mod, status, label := calculateFlowRateModifier(flowRate)
			running := (kpiPct / 100.0) * baseIncentive
			finalInc := running * mod
			return CollectorPerformanceItem{
				CollectorUsername: "andi_alt",
				CollectorName:     "Andi Pratama (Skenario B - Penalti)",
				RoleTitle:         "Field Collector Bucket 1",
				BucketHandled:     "Bucket 1 (1-30 DPD)",
				BaseIncentive:     baseIncentive,
				TargetCollection:  100000000,
				ActualCollection:  90000000,
				CollectionRatePct: kpiPct,
				TotalPortfolio:    50,
				FlowedAccounts:    9, // 9 / 50 = 18%
				FlowRatePct:       flowRate,
				FlowRateStatus:    status,
				Modifier:          mod,
				ModifierLabel:     label,
				RunningIncentive:  running,
				FinalIncentive:    finalInc,
				FormulaDetail:     fmt.Sprintf("Rp %.0f x 0.8 = Rp %.0f", running, finalInc),
				ScenarioType:      "PENALTY_SCENARIO",
			}
		}(),
		// Budi Santoso (RSO - Bucket 2)
		func() CollectorPerformanceItem {
			kpiPct := 102.5
			flowRate := 9.5
			mod, status, label := calculateFlowRateModifier(flowRate)
			running := (kpiPct / 100.0) * baseIncentive
			finalInc := running * mod
			return CollectorPerformanceItem{
				CollectorUsername: "field_rso_1",
				CollectorName:     "Budi Santoso",
				RoleTitle:         "Remedial Settlement Officer (RSO)",
				BucketHandled:     "Bucket 2 (31-60 DPD)",
				BaseIncentive:     baseIncentive,
				TargetCollection:  120000000,
				ActualCollection:  123000000,
				CollectionRatePct: kpiPct,
				TotalPortfolio:    42,
				FlowedAccounts:    4,
				FlowRatePct:       flowRate,
				FlowRateStatus:    status,
				Modifier:          mod,
				ModifierLabel:     label,
				RunningIncentive:  running,
				FinalIncentive:    finalInc,
				FormulaDetail:     fmt.Sprintf("Rp %.0f x %.1f = Rp %.0f", running, mod, finalInc),
				ScenarioType:      "ACTUAL_PERFORMANCE",
			}
		}(),
		// Rian Pratama (FRO - Bucket 1)
		func() CollectorPerformanceItem {
			kpiPct := 96.0
			flowRate := 13.5
			mod, status, label := calculateFlowRateModifier(flowRate)
			running := (kpiPct / 100.0) * baseIncentive
			finalInc := running * mod
			return CollectorPerformanceItem{
				CollectorUsername: "field_fro_1",
				CollectorName:     "Rian Pratama",
				RoleTitle:         "Field Recovery Officer (FRO)",
				BucketHandled:     "Bucket 1 (1-30 DPD)",
				BaseIncentive:     baseIncentive,
				TargetCollection:  95000000,
				ActualCollection:  91200000,
				CollectionRatePct: kpiPct,
				TotalPortfolio:    48,
				FlowedAccounts:    6,
				FlowRatePct:       flowRate,
				FlowRateStatus:    status,
				Modifier:          mod,
				ModifierLabel:     label,
				RunningIncentive:  running,
				FinalIncentive:    finalInc,
				FormulaDetail:     fmt.Sprintf("Rp %.0f x %.1f = Rp %.0f", running, mod, finalInc),
				ScenarioType:      "ACTUAL_PERFORMANCE",
			}
		}(),
		// Dimas Kurniawan (Senior Field - DPD > 30)
		func() CollectorPerformanceItem {
			kpiPct := 82.0
			flowRate := 22.0
			mod, status, label := calculateFlowRateModifier(flowRate)
			running := (kpiPct / 100.0) * baseIncentive
			finalInc := running * mod
			return CollectorPerformanceItem{
				CollectorUsername: "collector",
				CollectorName:     "Dimas Kurniawan",
				RoleTitle:         "Senior Field Collector (SFC)",
				BucketHandled:     "Bucket 3+ (>60 DPD)",
				BaseIncentive:     baseIncentive,
				TargetCollection:  80000000,
				ActualCollection:  65600000,
				CollectionRatePct: kpiPct,
				TotalPortfolio:    35,
				FlowedAccounts:    8,
				FlowRatePct:       flowRate,
				FlowRateStatus:    status,
				Modifier:          mod,
				ModifierLabel:     label,
				RunningIncentive:  running,
				FinalIncentive:    finalInc,
				FormulaDetail:     fmt.Sprintf("Rp %.0f x %.1f = Rp %.0f", running, mod, finalInc),
				ScenarioType:      "ACTUAL_PERFORMANCE",
			}
		}(),
	}

	c.JSON(http.StatusOK, gin.H{
		"period_month":    time.Now().Format("2006-01 (September 2026)"),
		"target_flow_max": 15.0,
		"rules_matrix":    rules,
		"collectors":      collectorsList,
	})
}

type SimulateIncentiveRequest struct {
	BaseIncentive     float64 `json:"base_incentive"`      // e.g. 3000000
	CollectionRatePct float64 `json:"collection_rate_pct"` // e.g. 90%
	FlowRatePct       float64 `json:"flow_rate_pct"`       // e.g. 8% atau 18%
	CollectorName     string  `json:"collector_name"`
}

// SimulateIncentive menghitung simulasi instan insentif dengan conditional logic IF-THEN
func (h *CollectorHandler) SimulateIncentive(c *gin.Context) {
	var req SimulateIncentiveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format request simulasi tidak valid: " + err.Error()})
		return
	}

	base := req.BaseIncentive
	if base <= 0 {
		base = 3000000.0 // Default Rp 3.000.000
	}

	kpiPct := req.CollectionRatePct
	flowRate := req.FlowRatePct

	runningIncentive := (kpiPct / 100.0) * base
	modifier, status, label := calculateFlowRateModifier(flowRate)
	finalIncentive := runningIncentive * modifier

	var impactText string
	if modifier > 1.0 {
		impactText = fmt.Sprintf("Bonus Tambahan +%.0f%% karena berhasil menahan arus kemacetan kredit.", (modifier-1.0)*100)
	} else if modifier == 1.0 {
		impactText = "Insentif Utuh 100% karena realisasi flow rate sesuai target batas manajemen (<=15%)."
	} else {
		impactText = fmt.Sprintf("Penalti Pemotongan -%.0f%% karena membiarkan tingkat kemacetan (flow rate) membengkak.", (1.0-modifier)*100)
	}

	c.JSON(http.StatusOK, gin.H{
		"collector_name":      req.CollectorName,
		"base_incentive":      base,
		"collection_rate_pct": kpiPct,
		"running_incentive":   math.Round(runningIncentive),
		"flow_rate_pct":       flowRate,
		"flow_rate_status":    status,
		"modifier":            modifier,
		"modifier_label":      label,
		"final_incentive":     math.Round(finalIncentive),
		"formula":             fmt.Sprintf("Insentif Akhir = Rp %.0f x %.2f = Rp %.0f", runningIncentive, modifier, finalIncentive),
		"impact_explanation":  impactText,
	})
}
