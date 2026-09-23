package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"crms-backend/internal/database"
	"crms-backend/internal/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type UserResponse struct {
	ID        uint       `json:"id"`
	Username  string     `json:"username"`
	FullName  string     `json:"full_name"`
	Email     string     `json:"email"`
	Role      string     `json:"role"`
	IsActive  bool       `json:"is_active"`
	LastLogin *time.Time `json:"last_login"`
}

// In-memory token storage untuk sesi aktif
var (
	tokenStore = make(map[string]uint) // token -> userID
	tokenMutex sync.RWMutex
)

func generateToken(username string) string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return fmt.Sprintf("crms_%s_%s", username, hex.EncodeToString(b))
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Username dan password wajib diisi",
		})
		return
	}

	var user models.User
	if err := database.DB.Where("LOWER(username) = ?", strings.ToLower(req.Username)).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "Username atau password tidak valid",
		})
		return
	}

	if !user.IsActive {
		c.JSON(http.StatusForbidden, gin.H{
			"status":  "error",
			"message": "Akun pengguna dinonaktifkan. Silakan hubungi Administrator.",
		})
		return
	}

	// Verifikasi Password via bcrypt
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		// Fallback check jika password belum di-hash (misal plain text demo)
		if user.Password != req.Password {
			c.JSON(http.StatusUnauthorized, gin.H{
				"status":  "error",
				"message": "Username atau password tidak valid",
			})
			return
		}
	}

	// Update last login timestamp
	now := time.Now()
	user.LastLogin = &now
	database.DB.Model(&user).Update("last_login", now)

	// Buat token
	token := generateToken(user.Username)
	tokenMutex.Lock()
	tokenStore[token] = user.ID
	tokenMutex.Unlock()

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Login berhasil",
		"data": gin.H{
			"token": token,
			"user": UserResponse{
				ID:        user.ID,
				Username:  user.Username,
				FullName:  user.FullName,
				Email:     user.Email,
				Role:      user.Role,
				IsActive:  user.IsActive,
				LastLogin: user.LastLogin,
			},
		},
	})
}

func GetMe(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	token := strings.TrimPrefix(authHeader, "Bearer ")

	tokenMutex.RLock()
	userID, exists := tokenStore[token]
	tokenMutex.RUnlock()

	if !exists {
		// Jika token format crms_<username>_<hex>, fallback cari by username
		parts := strings.Split(token, "_")
		if len(parts) >= 2 {
			username := parts[1]
			var u models.User
			if err := database.DB.Where("username = ?", username).First(&u).Error; err == nil {
				c.JSON(http.StatusOK, gin.H{
					"status": "success",
					"data": UserResponse{
						ID:        u.ID,
						Username:  u.Username,
						FullName:  u.FullName,
						Email:     u.Email,
						Role:      u.Role,
						IsActive:  u.IsActive,
						LastLogin: u.LastLogin,
					},
				})
				return
			}
		}

		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "Sesi login kedaluwarsa atau tidak valid",
		})
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "User tidak ditemukan",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data": UserResponse{
			ID:        user.ID,
			Username:  user.Username,
			FullName:  user.FullName,
			Email:     user.Email,
			Role:      user.Role,
			IsActive:  user.IsActive,
			LastLogin: user.LastLogin,
		},
	})
}

func Logout(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	token := strings.TrimPrefix(authHeader, "Bearer ")

	tokenMutex.Lock()
	delete(tokenStore, token)
	tokenMutex.Unlock()

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Logout berhasil",
	})
}

func GetUsers(c *gin.Context) {
	var users []models.User
	if err := database.DB.Order("id asc").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var responses []UserResponse
	for _, u := range users {
		responses = append(responses, UserResponse{
			ID:        u.ID,
			Username:  u.Username,
			FullName:  u.FullName,
			Email:     u.Email,
			Role:      u.Role,
			IsActive:  u.IsActive,
			LastLogin: u.LastLogin,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"total":  len(responses),
		"data":   responses,
	})
}
