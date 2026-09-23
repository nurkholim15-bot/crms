package database

import (
	"log"

	"crms-backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB(databaseURL string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, err
	}

	// Auto-Migrate tabel-tabel utama secara berurutan
	if err := db.AutoMigrate(&models.Customer{}); err != nil {
		return nil, err
	}
	if err := db.AutoMigrate(&models.Agreement{}); err != nil {
		return nil, err
	}
	if err := db.AutoMigrate(&models.OverdueAccount{}); err != nil {
		return nil, err
	}
	if err := db.AutoMigrate(&models.CollectionActivity{}); err != nil {
		return nil, err
	}
	if err := db.AutoMigrate(&models.DecisionRule{}); err != nil {
		return nil, err
	}
	if err := db.AutoMigrate(&models.User{}); err != nil {
		return nil, err
	}
	if err := db.AutoMigrate(&models.PreDelinquencyAccount{}); err != nil {
		return nil, err
	}
	if err := db.AutoMigrate(&models.LegalCase{}); err != nil {
		return nil, err
	}
	if err := db.AutoMigrate(&models.RepossessionCase{}); err != nil {
		return nil, err
	}
	if err := db.AutoMigrate(&models.SettlementProposal{}); err != nil {
		return nil, err
	}
	if err := db.AutoMigrate(&models.SkipTracingCase{}); err != nil {
		return nil, err
	}

	DB = db
	log.Println("PostgreSQL connection and migration successful!")

	// Seed database jika belum ada data
	SeedInitialData(db)

	return db, nil
}
