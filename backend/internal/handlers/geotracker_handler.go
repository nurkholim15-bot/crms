package handlers

import (
	"net/http"
	"time"

	"crms-backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type GeoTrackerHandler struct {
	db *gorm.DB
}

func NewGeoTrackerHandler(db *gorm.DB) *GeoTrackerHandler {
	return &GeoTrackerHandler{db: db}
}

// GetLiveCollectors mengembalikan daftar semua kolektor aktif beserta status GPS dan waktu
func (h *GeoTrackerHandler) GetLiveCollectors(c *gin.Context) {
	var collectors []models.CollectorGeoLocation
	query := h.db.Order("status asc, last_heartbeat desc")

	status := c.Query("status")
	if status != "" {
		query = query.Where("status = ?", status)
	}

	agency := c.Query("agency")
	if agency != "" {
		query = query.Where("agency_name = ?", agency)
	}

	if err := query.Find(&collectors).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data live collectors: " + err.Error()})
		return
	}

	// Hitung ringkasan analitik supervisor
	var totalActive = len(collectors)
	var inTransitCount = 0
	var visitingCount = 0
	var idleCount = 0
	var anomalyCount = 0
	var totalIdleMinutes = 0
	var totalTransitMinutes = 0

	for _, col := range collectors {
		if col.Status == "IN_TRANSIT" {
			inTransitCount++
		} else if col.Status == "VISITING" {
			visitingCount++
		} else {
			idleCount++
		}
		if col.AnomalyFlag {
			anomalyCount++
		}
		totalIdleMinutes += col.TodayIdleMinutes
		totalTransitMinutes += col.TransitTimeMinutes
	}

	avgIdle := 0
	avgTransit := 0
	if totalActive > 0 {
		avgIdle = totalIdleMinutes / totalActive
		avgTransit = totalTransitMinutes / totalActive
	}

	c.JSON(http.StatusOK, gin.H{
		"data": collectors,
		"analytics": gin.H{
			"total_active":          totalActive,
			"in_transit_count":      inTransitCount,
			"visiting_count":        visitingCount,
			"idle_count":            idleCount,
			"anomaly_count":         anomalyCount,
			"avg_idle_minutes":      avgIdle,
			"avg_transit_minutes":   avgTransit,
			"last_sync":             time.Now().Format("15:04:05 WIB"),
		},
	})
}

// GetCollectorRouteHistory mengambil rekam jejak titik perjalanan kolektor hari ini
func (h *GeoTrackerHandler) GetCollectorRouteHistory(c *gin.Context) {
	username := c.Param("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username kolektor diperlukan"})
		return
	}

	var points []models.CollectorRoutePoint
	if err := h.db.Where("collector_username = ?", username).
		Order("sequence_order asc").
		Find(&points).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil riwayat rute: " + err.Error()})
		return
	}

	var collector models.CollectorGeoLocation
	h.db.Where("collector_username = ?", username).First(&collector)

	c.JSON(http.StatusOK, gin.H{
		"collector": collector,
		"route":     points,
		"points_count": len(points),
	})
}

type PingLocationRequest struct {
	CollectorUsername   string  `json:"collector_username" binding:"required"`
	CollectorName       string  `json:"collector_name"`
	AgencyName          string  `json:"agency_name"`
	Lat                 float64 `json:"lat" binding:"required"`
	Lng                 float64 `json:"lng" binding:"required"`
	Accuracy            float64 `json:"accuracy"`
	Status              string  `json:"status"` // VISITING, IN_TRANSIT, IDLE
	LocationName        string  `json:"location_name"`
	BatteryPct          int     `json:"battery_pct"`
	ActivityType        string  `json:"activity_type"` // CHECKIN, PAYMENT, RTS, PTP, TRANSIT, IDLE
	AgreementNo         string  `json:"agreement_no"`
	DebtorName          string  `json:"debtor_name"`
	DurationMinutes     int     `json:"duration_minutes"`
	SpeedKmh            float64 `json:"speed_kmh"`
	Notes               string  `json:"notes"`
}

// PingLocation mensimulasikan atau menerima pembaruan koordinat GPS dari perangkat bergerak kolektor
func (h *GeoTrackerHandler) PingLocation(c *gin.Context) {
	var req PingLocationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data ping lokasi tidak valid: " + err.Error()})
		return
	}

	now := time.Now()
	var geo models.CollectorGeoLocation
	err := h.db.Where("collector_username = ?", req.CollectorUsername).First(&geo).Error

	isNew := false
	if err != nil {
		isNew = true
		geo.CollectorUsername = req.CollectorUsername
		geo.CollectorName = req.CollectorName
		if geo.CollectorName == "" {
			geo.CollectorName = req.CollectorUsername
		}
		geo.AgencyName = req.AgencyName
		if geo.AgencyName == "" {
			geo.AgencyName = "Internal Collection Force"
		}
	}

	// Update koordinat & status
	geo.CurrentLat = req.Lat
	geo.CurrentLng = req.Lng
	if req.Accuracy > 0 {
		geo.AccuracyMeters = req.Accuracy
	} else {
		geo.AccuracyMeters = 8.5
	}
	if req.Status != "" {
		geo.Status = req.Status
	}
	if req.LocationName != "" {
		geo.CurrentLocationName = req.LocationName
	}
	if req.BatteryPct > 0 {
		geo.BatteryPct = req.BatteryPct
	}
	geo.LastHeartbeat = now

	// Deteksi otomatis anomaly: jika speed > 120 km/h atau lonjakan durasi idle > 180 menit
	if req.SpeedKmh > 120.0 {
		geo.AnomalyFlag = true
		geo.AnomalyReason = "Speed outlier: terdeteksi kecepatan abnormal di atas 120 km/jam"
	}

	if isNew {
		h.db.Create(&geo)
	} else {
		h.db.Save(&geo)
	}

	// Catat ke CollectorRoutePoint jika ada activity atau moving
	if req.ActivityType != "" || req.Status == "VISITING" || req.Status == "IN_TRANSIT" {
		var maxSeq int
		h.db.Model(&models.CollectorRoutePoint{}).
			Where("collector_username = ?", req.CollectorUsername).
			Select("COALESCE(MAX(sequence_order), 0)").
			Scan(&maxSeq)

		activity := req.ActivityType
		if activity == "" {
			if req.Status == "VISITING" {
				activity = "CHECKIN"
			} else {
				activity = "TRANSIT"
			}
		}

		routePoint := models.CollectorRoutePoint{
			CollectorUsername: req.CollectorUsername,
			SequenceOrder:     maxSeq + 1,
			Lat:               req.Lat,
			Lng:               req.Lng,
			LocationName:      req.LocationName,
			ActivityType:      activity,
			AgreementNo:       req.AgreementNo,
			DebtorName:        req.DebtorName,
			RecordedAt:        now,
			DurationMinutes:   req.DurationMinutes,
			SpeedKmh:          req.SpeedKmh,
			Notes:             req.Notes,
		}
		h.db.Create(&routePoint)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Ping lokasi GPS berhasil diterima",
		"data":    geo,
	})
}
