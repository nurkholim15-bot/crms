package routes

import (
	"crms-backend/internal/database"
	"crms-backend/internal/handlers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	v1 := r.Group("/api/v1")
	{
		// Authentication & User Management
		v1.POST("/auth/login", handlers.Login)
		v1.GET("/auth/me", handlers.GetMe)
		v1.POST("/auth/logout", handlers.Logout)
		v1.GET("/users", handlers.GetUsers)

		// Dashboard & Matrix
		v1.GET("/dashboard/summary", handlers.GetDashboardSummary)

		// Overdue Accounts Management
		v1.GET("/overdue-accounts", handlers.GetOverdueAccounts)
		v1.GET("/overdue-accounts/:id", handlers.GetOverdueAccountDetail)
		v1.POST("/overdue-accounts/:id/reevaluate", handlers.ReevaluateAccount)
		v1.PUT("/overdue-accounts/:id/status", handlers.UpdateAccountStatus)

		// Collection Activities (Audit Trail)
		v1.POST("/activities", handlers.CreateActivity)
		v1.GET("/activities/agreement/:agreement_no", handlers.GetActivitiesByAgreement)

		// CONFINS Integration & EOD Simulator
		v1.POST("/confins/eod-sync", handlers.SimulateEOD)
		v1.POST("/confins/simulate-payment", handlers.SimulatePayment)
		v1.POST("/confins/reset-demo", handlers.ResetDemoData)

		// VIP Dedicated Handling (AR Head)
		v1.GET("/vip/accounts", handlers.GetVIPAccounts)
		v1.POST("/vip/accounts/:agreement_no/action", handlers.AssignVIPAction)

		// Unified Customer 360° & Advanced Collections Lifecycle
		v1.GET("/customers/:id/exposure-360", handlers.GetCustomerExposure360)
		v1.PUT("/customers/:id/phone", handlers.UpdateCustomerPhone)
		v1.POST("/customers/:id/send-whatsapp", handlers.SendCustomerWhatsApp)
		v1.PUT("/overdue-accounts/:id/recovery-stage", handlers.UpdateAccountRecoveryStage)

		// Enterprise Advanced Collections Architecture
		advH := handlers.NewAdvancedCollectionsHandler(database.DB)

		// 1. Pre-Delinquency Management (PDM / DPD 0 Early Warning)
		v1.GET("/pdm/accounts", advH.GetPreDelinquencyAccounts)
		v1.POST("/pdm/:id/send-reminder", advH.SendPreDelinquencyReminder)

		// 2. Legal Recourse Workflow (6 Stages)
		v1.GET("/legal/cases", advH.GetLegalCases)
		v1.PUT("/legal/cases/:id/stage", advH.UpdateLegalStage)

		// 3. Repossession & Auction Workflow (8 Stages)
		v1.GET("/repo/cases", advH.GetRepossessionCases)
		v1.PUT("/repo/cases/:id/stage", advH.UpdateRepoStage)

		// 4. Settlement Management (3 Types: Net, Charge-Wise, Auto-Charge)
		v1.GET("/settlement/proposals", advH.GetSettlementProposals)
		v1.PUT("/settlement/proposals/:id/action", advH.ApproveSettlementProposal)

		// 5. Skip Tracing Management
		v1.GET("/skip-tracing/cases", advH.GetSkipTracingCases)
		v1.PUT("/skip-tracing/cases/:id/feedback", advH.UpdateSkipTracingFeedback)
	}
}
