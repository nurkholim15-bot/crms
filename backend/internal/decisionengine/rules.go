package decisionengine

// Definisi konstanta Bucket DPD
const (
	Bucket1To3    = "1-3"
	Bucket4To7    = "4-7"
	Bucket8To13   = "8-13"
	Bucket14To18  = "14-18"
	Bucket19To25  = "19-25"
	Bucket26To30  = "26-30"
	Bucket31To60  = "31-60"
	Bucket61To150 = "61-150"
	BucketOver150 = "> 150"
)

// Definisi konstanta PIC sesuai matriks Grade baru
const (
	PIC_ROBOT        = "Robot"
	PIC_WA           = "WA"
	PIC_DC           = "DC"
	PIC_FC           = "FC"
	PIC_SFC          = "SFC"
	PIC_SENIOR_FIELD = "Senior Field Collector"
	PIC_SPECIAL_TEAM = "Special Team"
)

// Definisi konstanta Risk Level
const (
	RiskLow    = "LOW_RISK"
	RiskMedium = "MEDIUM_RISK"
	RiskHigh   = "HIGH_RISK"
)

// Definisi konstanta Strategy Group
const (
	GroupChampion   = "CHAMPION"
	GroupChallenger = "CHALLENGER"
	GroupVIP        = "VIP"
)

// ActionPathMatrix memetakan Grade (Action Path) x Bucket -> PIC
// Sesuai matriks Grade & Bucket baru
var ActionPathMatrix = map[string]map[string]string{
	// Grade 1
	"1": {
		Bucket1To3:    PIC_ROBOT,
		Bucket4To7:    PIC_DC,
		Bucket8To13:   PIC_DC,
		Bucket14To18:  PIC_DC,
		Bucket19To25:  PIC_DC,
		Bucket26To30:  PIC_DC,
		Bucket31To60:  PIC_SENIOR_FIELD,
		Bucket61To150: PIC_SENIOR_FIELD,
		BucketOver150: PIC_SENIOR_FIELD,
	},
	// Grade 2
	"2": {
		Bucket1To3:    PIC_ROBOT,
		Bucket4To7:    PIC_DC,
		Bucket8To13:   PIC_DC,
		Bucket14To18:  PIC_DC,
		Bucket19To25:  PIC_DC,
		Bucket26To30:  PIC_DC,
		Bucket31To60:  PIC_SENIOR_FIELD,
		Bucket61To150: PIC_SENIOR_FIELD,
		BucketOver150: PIC_SENIOR_FIELD,
	},
	// Grade 3
	"3": {
		Bucket1To3:    PIC_WA,
		Bucket4To7:    PIC_ROBOT,
		Bucket8To13:   PIC_ROBOT,
		Bucket14To18:  PIC_DC,
		Bucket19To25:  PIC_DC,
		Bucket26To30:  PIC_DC,
		Bucket31To60:  PIC_SENIOR_FIELD,
		Bucket61To150: PIC_SENIOR_FIELD,
		BucketOver150: PIC_SENIOR_FIELD,
	},
	// Grade 4
	"4": {
		Bucket1To3:    PIC_WA,
		Bucket4To7:    PIC_ROBOT,
		Bucket8To13:   PIC_DC,
		Bucket14To18:  PIC_DC,
		Bucket19To25:  PIC_DC,
		Bucket26To30:  PIC_DC,
		Bucket31To60:  PIC_SENIOR_FIELD,
		Bucket61To150: PIC_SENIOR_FIELD,
		BucketOver150: PIC_SENIOR_FIELD,
	},
	// Grade 5
	"5": {
		Bucket1To3:    PIC_DC,
		Bucket4To7:    PIC_DC,
		Bucket8To13:   PIC_FC,
		Bucket14To18:  PIC_FC,
		Bucket19To25:  PIC_FC,
		Bucket26To30:  PIC_FC,
		Bucket31To60:  PIC_SENIOR_FIELD,
		Bucket61To150: PIC_SENIOR_FIELD,
		BucketOver150: PIC_SENIOR_FIELD,
	},
	// Grade 6
	"6": {
		Bucket1To3:    PIC_DC,
		Bucket4To7:    PIC_FC,
		Bucket8To13:   PIC_FC,
		Bucket14To18:  PIC_FC,
		Bucket19To25:  PIC_FC,
		Bucket26To30:  PIC_FC,
		Bucket31To60:  PIC_SENIOR_FIELD,
		Bucket61To150: PIC_SENIOR_FIELD,
		BucketOver150: PIC_SENIOR_FIELD,
	},
	// Grade 7
	"7": {
		Bucket1To3:    PIC_FC,
		Bucket4To7:    PIC_FC,
		Bucket8To13:   PIC_FC,
		Bucket14To18:  PIC_FC,
		Bucket19To25:  PIC_SFC,
		Bucket26To30:  PIC_SFC,
		Bucket31To60:  PIC_SENIOR_FIELD,
		Bucket61To150: PIC_SENIOR_FIELD,
		BucketOver150: PIC_SENIOR_FIELD,
	},
	// Grade 8
	"8": {
		Bucket1To3:    PIC_FC,
		Bucket4To7:    PIC_FC,
		Bucket8To13:   PIC_SFC,
		Bucket14To18:  PIC_SFC,
		Bucket19To25:  PIC_SFC,
		Bucket26To30:  PIC_SFC,
		Bucket31To60:  PIC_SENIOR_FIELD,
		Bucket61To150: PIC_SENIOR_FIELD,
		BucketOver150: PIC_SENIOR_FIELD,
	},
	// Grade VIP
	"VIP": {
		Bucket1To3:    PIC_SPECIAL_TEAM,
		Bucket4To7:    PIC_SPECIAL_TEAM,
		Bucket8To13:   PIC_SPECIAL_TEAM,
		Bucket14To18:  PIC_SPECIAL_TEAM,
		Bucket19To25:  PIC_SPECIAL_TEAM,
		Bucket26To30:  PIC_SPECIAL_TEAM,
		Bucket31To60:  PIC_SPECIAL_TEAM,
		Bucket61To150: PIC_SPECIAL_TEAM,
		BucketOver150: PIC_SPECIAL_TEAM,
	},
}

// GetBucketName menghitung nama bucket berdasarkan jumlah DPD
func GetBucketName(dpd int) string {
	switch {
	case dpd >= 1 && dpd <= 3:
		return Bucket1To3
	case dpd >= 4 && dpd <= 7:
		return Bucket4To7
	case dpd >= 8 && dpd <= 13:
		return Bucket8To13
	case dpd >= 14 && dpd <= 18:
		return Bucket14To18
	case dpd >= 19 && dpd <= 25:
		return Bucket19To25
	case dpd >= 26 && dpd <= 30:
		return Bucket26To30
	case dpd >= 31 && dpd <= 60:
		return Bucket31To60
	case dpd >= 61 && dpd <= 150:
		return Bucket61To150
	case dpd > 150:
		return BucketOver150
	default:
		return Bucket1To3
	}
}

// GetPICChannelName memetakan PIC ke kategori unit operasional
func GetPICChannelName(pic string) string {
	switch pic {
	case PIC_ROBOT, PIC_WA, PIC_DC:
		return "DESK_DIGITAL"
	case PIC_FC, PIC_SFC, PIC_SENIOR_FIELD:
		return "FIELD_COLLECTION"
	case PIC_SPECIAL_TEAM:
		return "SPECIAL_TEAM"
	default:
		return "FIELD_COLLECTION"
	}
}
