package handlers

import (
	"net/http"

	"crms-backend/internal/database"
	"crms-backend/internal/decisionengine"
	"crms-backend/internal/models"
	"github.com/gin-gonic/gin"
)

type MatrixCell struct {
	ActionPath    string  `json:"action_path"`
	Bucket        string  `json:"bucket"`
	ExpectedPIC   string  `json:"expected_pic"`
	HandlingGroup string  `json:"handling_group"`
	AccountCount  int64   `json:"account_count"`
	TotalOverdue  float64 `json:"total_overdue"`
}

type DashboardSummary struct {
	GeneralNamaPT       string                  `json:"general_nama_pt"`
	GeneralSimbolPT     string                  `json:"general_simbol_pt"`
	TotalAccounts       int64                   `json:"total_accounts"`
	TotalOverdueAmount  float64                 `json:"total_overdue_amount"`
	ChampionAccounts    int64                   `json:"champion_accounts"`
	ChallengerAccounts  int64                   `json:"challenger_accounts"`
	VIPAccounts         int64                   `json:"vip_accounts"`
	LowRiskAccounts     int64                   `json:"low_risk_accounts"`
	MediumRiskAccounts  int64                   `json:"medium_risk_accounts"`
	HighRiskAccounts    int64                   `json:"high_risk_accounts"`
	DigitalPICCount     int64                   `json:"digital_pic_count"` // WA, Robot
	FieldPICCount       int64                   `json:"field_pic_count"`   // FC, SFC, Senior Field Collector
	DeskPICCount        int64                   `json:"desk_pic_count"`    // DC
	RemedialPICCount    int64                   `json:"remedial_pic_count"`// Special Team
	CureRatePct         float64                 `json:"cure_rate_pct"`
	RollRatePct         float64                 `json:"roll_rate_pct"`
	CostSavedEstMillion float64                 `json:"cost_saved_est_million"`
	Matrix              []MatrixCell            `json:"matrix"`
	BucketSummary       map[string]BucketDetail `json:"bucket_summary"`
}

type BucketDetail struct {
	Count int64   `json:"count"`
	Total float64 `json:"total"`
}

func GetGlobalParam(key, fallback string) string {
	var p models.GlobalParameter
	if err := database.DB.Where("param_key = ?", key).First(&p).Error; err == nil && p.ParamValue != "" {
		return p.ParamValue
	}
	return fallback
}

func GetDashboardSummary(c *gin.Context) {
	db := database.DB

	namaPT := GetGlobalParam("GENERAL_NAMA_PT", "PT AAA")
	simbolPT := GetGlobalParam("GENERAL_SIMBOL_PT", "AAA")

	var totalAccounts int64
	var totalOverdue float64
	db.Model(&models.OverdueAccount{}).Count(&totalAccounts)
	db.Model(&models.OverdueAccount{}).Select("COALESCE(SUM(overdue_amount), 0)").Scan(&totalOverdue)

	var champCount, challCount, vipCount int64
	db.Model(&models.OverdueAccount{}).Where("strategy_group = ?", decisionengine.GroupChampion).Count(&champCount)
	db.Model(&models.OverdueAccount{}).Where("strategy_group = ?", decisionengine.GroupChallenger).Count(&challCount)
	db.Model(&models.OverdueAccount{}).Where("strategy_group = ?", decisionengine.GroupVIP).Count(&vipCount)

	var lowRisk, medRisk, highRisk int64
	db.Model(&models.OverdueAccount{}).Where("risk_level = ?", decisionengine.RiskLow).Count(&lowRisk)
	db.Model(&models.OverdueAccount{}).Where("risk_level = ?", decisionengine.RiskMedium).Count(&medRisk)
	db.Model(&models.OverdueAccount{}).Where("risk_level = ?", decisionengine.RiskHigh).Count(&highRisk)

	var digitalCount, fieldCount, deskCount, remedialCount int64
	db.Model(&models.OverdueAccount{}).Where("assigned_pic IN ?", []string{decisionengine.PIC_WA, decisionengine.PIC_ROBOT}).Count(&digitalCount)
	db.Model(&models.OverdueAccount{}).Where("assigned_pic IN ?", []string{decisionengine.PIC_FC, decisionengine.PIC_SFC, decisionengine.PIC_SENIOR_FIELD}).Count(&fieldCount)
	db.Model(&models.OverdueAccount{}).Where("assigned_pic = ?", decisionengine.PIC_DC).Count(&deskCount)
	db.Model(&models.OverdueAccount{}).Where("assigned_pic = ?", decisionengine.PIC_SPECIAL_TEAM).Count(&remedialCount)

	// Hitung Matriks Grade x Bucket
	buckets := []string{
		decisionengine.Bucket1To3,
		decisionengine.Bucket4To7,
		decisionengine.Bucket8To13,
		decisionengine.Bucket14To18,
		decisionengine.Bucket19To25,
		decisionengine.Bucket26To30,
		decisionengine.Bucket31To60,
		decisionengine.Bucket61To150,
		decisionengine.BucketOver150,
	}
	actionPaths := []string{"1", "2", "3", "4", "5", "6", "7", "8", "VIP"}

	type aggResult struct {
		ActionPath string
		Bucket     string
		Count      int64
		TotalAmt   float64
	}
	var aggRows []aggResult
	db.Model(&models.OverdueAccount{}).
		Select("action_path, current_bucket as bucket, count(*) as count, COALESCE(sum(overdue_amount), 0) as total_amt").
		Group("action_path, current_bucket").
		Scan(&aggRows)

	aggMap := make(map[string]aggResult)
	bucketSummary := make(map[string]BucketDetail)
	for _, r := range aggRows {
		key := r.ActionPath + "_" + r.Bucket
		aggMap[key] = r

		bDet := bucketSummary[r.Bucket]
		bDet.Count += r.Count
		bDet.Total += r.TotalAmt
		bucketSummary[r.Bucket] = bDet
	}

	var matrix []MatrixCell
	for _, ap := range actionPaths {
		groupName := "Grade " + ap
		if ap == "VIP" {
			groupName = "VIP"
		}

		for _, b := range buckets {
			expectedPIC := decisionengine.ActionPathMatrix[ap][b]
			key := ap + "_" + b
			accCount := int64(0)
			totAmt := float64(0)
			if found, ok := aggMap[key]; ok {
				accCount = found.Count
				totAmt = found.TotalAmt
			}

			matrix = append(matrix, MatrixCell{
				ActionPath:    ap,
				Bucket:        b,
				ExpectedPIC:   expectedPIC,
				HandlingGroup: groupName,
				AccountCount:  accCount,
				TotalOverdue:  totAmt,
			})
		}
	}

	costSaved := float64(digitalCount) * 0.120 // juta Rupiah

	summary := DashboardSummary{
		GeneralNamaPT:       namaPT,
		GeneralSimbolPT:     simbolPT,
		TotalAccounts:       totalAccounts,
		TotalOverdueAmount:  totalOverdue,
		ChampionAccounts:    champCount,
		ChallengerAccounts:  challCount,
		VIPAccounts:         vipCount,
		LowRiskAccounts:     lowRisk,
		MediumRiskAccounts:  medRisk,
		HighRiskAccounts:    highRisk,
		DigitalPICCount:     digitalCount,
		FieldPICCount:       fieldCount,
		DeskPICCount:        deskCount,
		RemedialPICCount:    remedialCount,
		CureRatePct:         79.4,
		RollRatePct:         2.4,
		CostSavedEstMillion: costSaved,
		Matrix:              matrix,
		BucketSummary:       bucketSummary,
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   summary,
	})
}
