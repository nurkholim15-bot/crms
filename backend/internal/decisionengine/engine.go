package decisionengine

import (
	"fmt"
)

// EvaluationResult menampung output evaluasi Decision Engine
type EvaluationResult struct {
	Bucket        string `json:"bucket"`
	RiskScore     int    `json:"risk_score"`
	RiskLevel     string `json:"risk_level"`
	StrategyGroup string `json:"strategy_group"`
	ActionPath    string `json:"action_path"`
	AssignedPIC   string `json:"assigned_pic"`
	PICChannel    string `json:"pic_channel"`
	DecisionRule  string `json:"decision_rule"`
}

// Engine memegang logika evaluasi Decision Engine CRMS
type Engine struct{}

func NewEngine() *Engine {
	return &Engine{}
}

// Evaluate memproses satu akun kredit tertunggak
func (e *Engine) Evaluate(dpd int, riskScore int, isVIP bool, isChampionTraffic bool, variant int) EvaluationResult {
	bucket := GetBucketName(dpd)

	// 1. Prioritas Utama: Customer VIP -> Masuk ke Special Team
	if isVIP {
		return EvaluationResult{
			Bucket:        bucket,
			RiskScore:     riskScore,
			RiskLevel:     "VIP_PORTFOLIO",
			StrategyGroup: GroupVIP,
			ActionPath:    "VIP",
			AssignedPIC:   PIC_SPECIAL_TEAM,
			PICChannel:    GetPICChannelName(PIC_SPECIAL_TEAM),
			DecisionRule:  "Customer VIP dialokasikan ke Special Team",
		}
	}

	// 2. Tentukan Grade (1 s/d 8) berdasarkan Risk Level & Traffic
	riskLevel := e.categorizeRisk(riskScore)
	var actionPath string
	var group string

	if isChampionTraffic {
		group = GroupChampion
		if variant%2 == 0 {
			actionPath = "2"
		} else {
			actionPath = "1"
		}
	} else {
		group = GroupChallenger
		switch riskLevel {
		case RiskLow:
			if variant%2 == 0 {
				actionPath = "4"
			} else {
				actionPath = "3"
			}
		case RiskMedium:
			if variant%2 == 0 {
				actionPath = "6"
			} else {
				actionPath = "5"
			}
		case RiskHigh:
			if variant%2 == 0 {
				actionPath = "8"
			} else {
				actionPath = "7"
			}
		default:
			actionPath = "5"
		}
	}

	// Jika dpd > 30, PIC adalah Senior Field Collector untuk semua Grade 1-8
	if dpd > 30 {
		pic := PIC_SENIOR_FIELD
		return EvaluationResult{
			Bucket:        bucket,
			RiskScore:     riskScore,
			RiskLevel:     riskLevel,
			StrategyGroup: group,
			ActionPath:    actionPath,
			AssignedPIC:   pic,
			PICChannel:    GetPICChannelName(pic),
			DecisionRule:  fmt.Sprintf("Bucket %s ditugaskan kepada %s", bucket, pic),
		}
	}

	// Ambil PIC dari matriks Grade untuk DPD 1-30
	pic := ActionPathMatrix[actionPath][bucket]
	if pic == "" {
		pic = PIC_DC
	}

	return EvaluationResult{
		Bucket:        bucket,
		RiskScore:     riskScore,
		RiskLevel:     riskLevel,
		StrategyGroup: group,
		ActionPath:    actionPath,
		AssignedPIC:   pic,
		PICChannel:    GetPICChannelName(pic),
		DecisionRule:  fmt.Sprintf("Decision Engine Grade %s: %s -> %s (%s)", actionPath, riskLevel, bucket, pic),
	}
}

// categorizeRisk mengklasifikasikan skor risiko kredit
func (e *Engine) categorizeRisk(score int) string {
	switch {
	case score >= 700:
		return RiskLow
	case score >= 450:
		return RiskMedium
	default:
		return RiskHigh
	}
}
