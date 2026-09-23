package routes

import (
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
	}
}
