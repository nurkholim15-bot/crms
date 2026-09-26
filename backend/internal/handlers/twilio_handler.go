package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"crms-backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TwilioHandler struct {
	DB *gorm.DB
}

func NewTwilioHandler(db *gorm.DB) *TwilioHandler {
	return &TwilioHandler{DB: db}
}

// Helper to get active Twilio credentials from env or database
func (h *TwilioHandler) getCredentials() (string, string, string) {
	sid := os.Getenv("TWILIO_ACCOUNT_SID")
	if sid == "" {
		sid = GetGlobalParam("TWILIO_ACCOUNT_SID", "")
	}
	token := os.Getenv("TWILIO_AUTH_TOKEN")
	if token == "" {
		token = GetGlobalParam("TWILIO_AUTH_TOKEN", "")
	}
	fromNumber := os.Getenv("TWILIO_PHONE_NUMBER")
	if fromNumber == "" {
		fromNumber = GetGlobalParam("TWILIO_PHONE_NUMBER", "")
	}
	return sid, token, fromNumber
}

// GetConfig returns the current Twilio setup and tests connectivity
func (h *TwilioHandler) GetConfig(c *gin.Context) {
	sid, token, fromNumber := h.getCredentials()

	// Check Twilio Account Status via REST API
	accountStatus := "UNKNOWN"
	accountType := "Unknown"
	friendlyName := ""
	var incomingNumbers []string

	req, err := http.NewRequest("GET", fmt.Sprintf("https://api.twilio.com/2010-04-01/Accounts/%s.json", sid), nil)
	if err == nil {
		req.SetBasicAuth(sid, token)
		client := &http.Client{Timeout: 5 * time.Second}
		resp, err := client.Do(req)
		if err == nil && resp.StatusCode == 200 {
			defer resp.Body.Close()
			var accResp struct {
				Status       string `json:"status"`
				Type         string `json:"type"`
				FriendlyName string `json:"friendly_name"`
			}
			if err := json.NewDecoder(resp.Body).Decode(&accResp); err == nil {
				accountStatus = accResp.Status
				accountType = accResp.Type
				friendlyName = accResp.FriendlyName
			}
		}
	}

	// Check available incoming phone numbers on Twilio account
	numReq, err := http.NewRequest("GET", fmt.Sprintf("https://api.twilio.com/2010-04-01/Accounts/%s/IncomingPhoneNumbers.json?PageSize=10", sid), nil)
	if err == nil {
		numReq.SetBasicAuth(sid, token)
		client := &http.Client{Timeout: 5 * time.Second}
		numResp, err := client.Do(numReq)
		if err == nil && numResp.StatusCode == 200 {
			defer numResp.Body.Close()
			var numList struct {
				IncomingPhoneNumbers []struct {
					PhoneNumber  string `json:"phone_number"`
					FriendlyName string `json:"friendly_name"`
				} `json:"incoming_phone_numbers"`
			}
			if err := json.NewDecoder(numResp.Body).Decode(&numList); err == nil {
				for _, n := range numList.IncomingPhoneNumbers {
					incomingNumbers = append(incomingNumbers, n.PhoneNumber)
				}
			}
		}
	}

	// Also check verified outgoing caller IDs
	callerReq, err := http.NewRequest("GET", fmt.Sprintf("https://api.twilio.com/2010-04-01/Accounts/%s/OutgoingCallerIds.json?PageSize=10", sid), nil)
	var verifiedNumbers []string
	if err == nil {
		callerReq.SetBasicAuth(sid, token)
		client := &http.Client{Timeout: 5 * time.Second}
		callerResp, err := client.Do(callerReq)
		if err == nil && callerResp.StatusCode == 200 {
			defer callerResp.Body.Close()
			var cList struct {
				OutgoingCallerIds []struct {
					PhoneNumber string `json:"phone_number"`
				} `json:"outgoing_caller_ids"`
			}
			if err := json.NewDecoder(callerResp.Body).Decode(&cList); err == nil {
				for _, cNum := range cList.OutgoingCallerIds {
					verifiedNumbers = append(verifiedNumbers, cNum.PhoneNumber)
				}
			}
		}
	}

	maskedToken := ""
	if len(token) > 8 {
		maskedToken = token[:4] + "••••••••" + token[len(token)-4:]
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"account_sid":        sid,
			"auth_token_masked":  maskedToken,
			"from_phone_number":  fromNumber,
			"account_status":     accountStatus,
			"account_type":       accountType,
			"friendly_name":      friendlyName,
			"incoming_numbers":   incomingNumbers,
			"verified_numbers":   verifiedNumbers,
			"is_active":          accountStatus == "active",
			"is_trial":           strings.EqualFold(accountType, "Trial"),
			"default_voice":      "Polly.Gita",
			"default_language":   "id-ID",
		},
	})
}

// SaveConfig updates Twilio configuration in GlobalParameters
func (h *TwilioHandler) SaveConfig(c *gin.Context) {
	var body struct {
		AccountSID  string `json:"account_sid"`
		AuthToken   string `json:"auth_token"`
		PhoneNumber string `json:"phone_number"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format parameter tidak valid"})
		return
	}

	if body.AccountSID != "" {
		saveGlobalParam(h.DB, "TWILIO_ACCOUNT_SID", body.AccountSID)
	}
	if body.AuthToken != "" {
		saveGlobalParam(h.DB, "TWILIO_AUTH_TOKEN", body.AuthToken)
	}
	if body.PhoneNumber != "" {
		saveGlobalParam(h.DB, "TWILIO_PHONE_NUMBER", body.PhoneNumber)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Konfigurasi Twilio berhasil disimpan",
		"data": gin.H{
			"account_sid":  body.AccountSID,
			"phone_number": body.PhoneNumber,
		},
	})
}

func saveGlobalParam(db *gorm.DB, key, val string) {
	var p models.GlobalParameter
	if err := db.Where("param_key = ?", key).First(&p).Error; err == nil {
		p.ParamValue = val
		db.Save(&p)
	} else {
		db.Create(&models.GlobalParameter{
			ParamKey:    key,
			ParamValue:  val,
			Description: "Twilio Telephony Config",
		})
	}
}

type MakeCallRequest struct {
	OverdueAccountID uint   `json:"overdue_account_id"`
	AgreementNo      string `json:"agreement_no"`
	CustomerName     string `json:"customer_name"`
	ToPhone          string `json:"to_phone" binding:"required"`
	FromPhone        string `json:"from_phone"`
	ScriptText       string `json:"script_text" binding:"required"`
	ChannelType      string `json:"channel_type"` // ROBOCALL or DESK_COLLECTION
	VoiceType        string `json:"voice_type"`   // Polly.Gita, id-ID
	SimulationMode   bool   `json:"simulation_mode"`
}

// MakeCall handles placing an outbound automated call through Twilio Voice API
func (h *TwilioHandler) MakeCall(c *gin.Context) {
	var req MakeCallRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Harap lengkapi nomor telepon tujuan dan skrip percakapan"})
		return
	}

	sid, token, defaultFrom := h.getCredentials()

	fromPhone := req.FromPhone
	if fromPhone == "" {
		fromPhone = defaultFrom
	}

	// Normalisasi nomor telepon tujuan (jika 08... ubah ke format internasional +628...)
	toPhone := strings.TrimSpace(req.ToPhone)
	toPhone = strings.ReplaceAll(toPhone, "-", "")
	toPhone = strings.ReplaceAll(toPhone, " ", "")
	if strings.HasPrefix(toPhone, "08") {
		toPhone = "+62" + toPhone[1:]
	} else if strings.HasPrefix(toPhone, "8") {
		toPhone = "+62" + toPhone
	} else if !strings.HasPrefix(toPhone, "+") {
		toPhone = "+" + toPhone
	}

	// Build TwiML Text-to-Speech XML Response with Indonesian Polly voice
	voice := req.VoiceType
	if voice == "" {
		voice = "Polly.Gita"
	}

	// Escape XML special characters
	escapedScript := escapeXML(req.ScriptText)
	twiml := fmt.Sprintf(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="id-ID" voice="%s">%s</Say>
    <Pause length="1"/>
    <Gather numDigits="1" timeout="10" action="/api/v1/telephony/gather" method="POST">
        <Say language="id-ID" voice="%s">Tekan 1 untuk konfirmasi janji bayar, atau tekan 2 untuk mengirimkan tautan Virtual Account ke WhatsApp Anda.</Say>
    </Gather>
    <Say language="id-ID" voice="%s">Terima kasih telah mendengarkan informasi resmi dari Bank. Selamat beraktivitas.</Say>
</Response>`, voice, escapedScript, voice, voice)

	// In Simulation Mode or if fromPhone is empty, we record activity as simulated
	if req.SimulationMode || fromPhone == "" {
		simCallSID := fmt.Sprintf("SIM-CA%x", time.Now().UnixNano())
		h.logCallActivity(req, simCallSID, toPhone, fromPhone, "SIMULATED_COMPLETED")

		c.JSON(http.StatusOK, gin.H{
			"message": "Panggilan simulasi Robocall berhasil diproses",
			"data": gin.H{
				"call_sid":        simCallSID,
				"status":          "simulated_ringing",
				"to":              toPhone,
				"from":            fromPhone,
				"simulation_mode": true,
				"twiml":           twiml,
				"instruction":     "Untuk panggilan nyata ke HP, pastikan Twilio Phone Number terisi dan nomor tujuan terverifikasi pada akun Trial Twilio.",
			},
		})
		return
	}

	// Call Twilio REST API
	endpoint := fmt.Sprintf("https://api.twilio.com/2010-04-01/Accounts/%s/Calls.json", sid)
	formData := url.Values{}
	formData.Set("To", toPhone)
	formData.Set("From", fromPhone)
	formData.Set("Twiml", twiml)

	httpReq, err := http.NewRequest("POST", endpoint, strings.NewReader(formData.Encode()))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat request ke Twilio: " + err.Error()})
		return
	}

	httpReq.SetBasicAuth(sid, token)
	httpReq.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "Gagal menghubungi server Twilio: " + err.Error()})
		return
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		var twilioErr struct {
			Code     int    `json:"code"`
			Message  string `json:"message"`
			Status   int    `json:"status"`
			MoreInfo string `json:"more_info"`
		}
		json.Unmarshal(respBody, &twilioErr)

		// Memberikan pesan edukatif spesifik untuk akun Trial Twilio
		guidance := ""
		if twilioErr.Code == 21212 {
			guidance = "Nomor pengirim (From) tidak valid. Harap gunakan Twilio Phone Number yang ada di dashboard Twilio Anda."
		} else if twilioErr.Code == 21608 {
			guidance = "Akun Twilio Trial hanya dapat melakukan panggilan ke nomor yang sudah didaftarkan di 'Verified Caller IDs' pada Twilio Console (https://console.twilio.com)."
		} else if twilioErr.Code == 21404 {
			guidance = "Nomor pengirim belum terverifikasi atau belum dibeli di akun Twilio Anda."
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error":        fmt.Sprintf("Twilio Error [%d]: %s", twilioErr.Code, twilioErr.Message),
			"twilio_code":  twilioErr.Code,
			"guidance":     guidance,
			"more_info":    twilioErr.MoreInfo,
			"raw_response": string(respBody),
		})
		return
	}

	var callResp struct {
		Sid            string `json:"sid"`
		Status         string `json:"status"`
		To             string `json:"to"`
		From           string `json:"from"`
		DateCreated    string `json:"date_created"`
		Duration       string `json:"duration"`
		Price          string `json:"price"`
		PriceUnit      string `json:"price_unit"`
	}
	json.Unmarshal(respBody, &callResp)

	// Catat audit trail interaksi penagihan di database CRMS
	h.logCallActivity(req, callResp.Sid, toPhone, fromPhone, callResp.Status)

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Panggilan Twilio berhasil dimulai ke %s (Status: %s)", toPhone, callResp.Status),
		"data": gin.H{
			"call_sid":     callResp.Sid,
			"status":       callResp.Status,
			"to":           callResp.To,
			"from":         callResp.From,
			"date_created": callResp.DateCreated,
		},
	})
}

func (h *TwilioHandler) logCallActivity(req MakeCallRequest, callSid, toPhone, fromPhone, status string) {
	channel := "ROBO"
	performer := "Twilio_RoboEngine"
	if req.ChannelType == "DESK_COLLECTION" {
		channel = "DERO"
		performer = "Desk_Collector_Telephony"
	}

	notes := fmt.Sprintf("Panggilan %s via Twilio Voice API ke %s (From: %s). Status: %s. Call SID: %s.\nPesan: \"%s\"",
		req.ChannelType, toPhone, fromPhone, status, callSid, req.ScriptText)

	activity := models.CollectionActivity{
		OverdueAccountID: req.OverdueAccountID,
		AgreementNo:      req.AgreementNo,
		ChannelType:      channel,
		PerformedBy:      performer,
		ContactStatus:    "CALL_INITIATED",
		ResultCode:       "TWILIO_VOICE_OUTBOUND",
		Notes:            notes,
		CreatedAt:        time.Now(),
	}

	if err := h.DB.Create(&activity).Error; err != nil {
		log.Printf("Failed to log Twilio call activity: %v", err)
	}
}

// ServeTwiML provides raw XML response for Twilio webhooks
func (h *TwilioHandler) ServeTwiML(c *gin.Context) {
	script := c.DefaultPostForm("script", "Panggilan resmi dari tim Collection Management System.")
	escapedScript := escapeXML(script)

	xmlResponse := fmt.Sprintf(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="id-ID" voice="Polly.Gita">%s</Say>
    <Pause length="1"/>
    <Gather numDigits="1" action="/api/v1/telephony/gather" method="POST">
        <Say language="id-ID" voice="Polly.Gita">Tekan 1 untuk janji bayar hari ini, atau tekan 2 untuk meminta tautan Virtual Account ke WhatsApp Anda.</Say>
    </Gather>
</Response>`, escapedScript)

	c.Header("Content-Type", "application/xml")
	c.String(http.StatusOK, xmlResponse)
}

// HandleGather processes DTMF keypad responses from the recipient during the call
func (h *TwilioHandler) HandleGather(c *gin.Context) {
	digits := c.PostForm("Digits")
	callSid := c.PostForm("CallSid")

	var replyMessage string
	switch digits {
	case "1":
		replyMessage = "Terima kasih, konfirmasi janji bayar Anda telah kami catat di sistem perbankan. Silakan selesaikan pembayaran sebelum pukul 17.00 WIB."
	case "2":
		replyMessage = "Tautan pembayaran Virtual Account resmi sedang dikirimkan ke nomor WhatsApp Anda. Terima kasih atas kerja samanya."
	default:
		replyMessage = "Pilihan Anda telah diterima. Tim penagihan kami akan mendampingi penyelesaian kewajiban Anda. Terima kasih."
	}

	log.Printf("[Twilio IVR] Call SID %s pressed digit '%s'", callSid, digits)

	xmlResponse := fmt.Sprintf(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="id-ID" voice="Polly.Gita">%s</Say>
    <Hangup/>
</Response>`, replyMessage)

	c.Header("Content-Type", "application/xml")
	c.String(http.StatusOK, xmlResponse)
}

// GetCallHistory retrieves recent telephony activity logs
func (h *TwilioHandler) GetCallHistory(c *gin.Context) {
	var activities []models.CollectionActivity
	h.DB.Where("channel_type IN (?, ?)", "ROBO", "DERO").
		Order("created_at desc").
		Limit(20).
		Find(&activities)

	c.JSON(http.StatusOK, gin.H{"data": activities})
}

func escapeXML(s string) string {
	s = strings.ReplaceAll(s, "&", "&amp;")
	s = strings.ReplaceAll(s, "<", "&lt;")
	s = strings.ReplaceAll(s, ">", "&gt;")
	s = strings.ReplaceAll(s, "\"", "&quot;")
	s = strings.ReplaceAll(s, "'", "&apos;")
	return s
}
