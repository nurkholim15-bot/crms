package main

import (
	"log"
	"time"

	"crms-backend/config"
	"crms-backend/internal/database"
	"crms-backend/internal/handlers"
	"crms-backend/internal/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("Starting CRMS Backend Server...")

	cfg := config.LoadConfig()

	// Inisialisasi Database PostgreSQL & Migrations & Seeding
	_, err := database.InitDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	namaPT := handlers.GetGlobalParam("GENERAL_NAMA_PT", "PT AAA")
	simbolPT := handlers.GetGlobalParam("GENERAL_SIMBOL_PT", "AAA")
	log.Printf("Loaded Global Parameters: %s (%s)\n", namaPT, simbolPT)

	r := gin.Default()

	// Setup CORS
	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		currentNama := handlers.GetGlobalParam("GENERAL_NAMA_PT", "PT AAA")
		currentSimbol := handlers.GetGlobalParam("GENERAL_SIMBOL_PT", "AAA")
		c.JSON(200, gin.H{
			"status":    "UP",
			"system":    currentSimbol + " CRMS Retail",
			"company":   currentNama,
			"timestamp": time.Now().Format(time.RFC3339),
		})
	})

	// Setup Routes
	routes.SetupRoutes(r)

	log.Printf("CRMS Backend server running on port %s\n", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
