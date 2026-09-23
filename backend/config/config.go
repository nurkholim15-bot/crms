package config

import (
	"os"
)

type Config struct {
	Port        string
	DatabaseURL string
}

func LoadConfig() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8030"
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "host=localhost user=admin_lims password=Nkl@130200 dbname=crms_db port=5432 sslmode=disable TimeZone=Asia/Jakarta"
	}

	return &Config{
		Port:        port,
		DatabaseURL: dbURL,
	}
}
