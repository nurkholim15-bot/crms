package main

import (
	"log"

	"crms-backend/config"
	"crms-backend/internal/database"
)

func main() {
	log.Println("Starting CRMS Database Reseed...")
	cfg := config.LoadConfig()

	db, err := database.InitDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	log.Println("Database reseed successfully finished!")
	_ = db
}
