package database

import (
	"fmt"
	"log"
	"math/rand"
	"strings"
	"time"

	"crms-backend/internal/decisionengine"
	"crms-backend/internal/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedInitialData(db *gorm.DB) {
	// Pastikan users selalu ter-seed
	SeedUsers(db)

	var count int64
	db.Model(&models.Customer{}).Count(&count)

	// Cek apakah ada data legacy otomotif/Toyota atau perlu pembaruan ke versi multi-fasilitas
	var toyotaCount int64
	db.Model(&models.Agreement{}).Where("asset_brand = ? OR asset_model ILIKE ?", "Toyota", "%Toyota%").Count(&toyotaCount)

	var seedVer models.GlobalParameter
	needReseed := false
	if err := db.Where("param_key = ?", "BANKING_SEED_VERSION").First(&seedVer).Error; err != nil || seedVer.ParamValue != "2026.09.23_v4_multi_facility" {
		needReseed = true
	}

	if toyotaCount > 0 || needReseed {
		log.Println("Pembaruan portofolio perbankan: Menghapus dan feeding ulang data perbankan multi-fasilitas (Unified Customer 360°)...")
		db.Exec("TRUNCATE TABLE collection_activities, overdue_accounts, decision_rules, agreements, customers RESTART IDENTITY CASCADE")
		count = 0
		if err := db.Where("param_key = ?", "BANKING_SEED_VERSION").First(&seedVer).Error; err == nil {
			seedVer.ParamValue = "2026.09.23_v4_multi_facility"
			db.Save(&seedVer)
		} else {
			db.Create(&models.GlobalParameter{
				ParamKey:    "BANKING_SEED_VERSION",
				ParamValue:  "2026.09.23_v4_multi_facility",
				Description: "Versi Seeder Portofolio Perbankan Multi-Fasilitas",
				CreatedUser: "SYSTEM",
			})
		}
	} else if count > 0 {
		log.Println("Database already seeded with banking portfolio data (v4 multi-facility). Skipping initial seed.")
		return
	}

	// Baca atau perbarui GENERAL_SIMBOL_PT dan GENERAL_NAMA_PT dari public.global_parameters
	ptSymbol := "BANK"
	var symParam models.GlobalParameter
	if err := db.Where("param_key = ?", "GENERAL_SIMBOL_PT").First(&symParam).Error; err == nil {
		if strings.Contains(strings.ToUpper(symParam.ParamValue), "TAF") || symParam.ParamValue == "AAA" {
			symParam.ParamValue = "BANK"
			db.Save(&symParam)
		}
		ptSymbol = symParam.ParamValue
	} else {
		db.Create(&models.GlobalParameter{
			ParamKey:    "GENERAL_SIMBOL_PT",
			ParamValue:  "BANK",
			Description: "Simbol / Inisial Institusi Perbankan",
			CreatedUser: "SYSTEM",
		})
	}

	ptName := "PT BANK RAKYAT NUSANTARA TBK"
	var nameParam models.GlobalParameter
	if err := db.Where("param_key = ?", "GENERAL_NAMA_PT").First(&nameParam).Error; err == nil {
		if strings.Contains(strings.ToUpper(nameParam.ParamValue), "TOYOTA") || nameParam.ParamValue == "PT AAA" {
			nameParam.ParamValue = "PT BANK RAKYAT NUSANTARA TBK"
			db.Save(&nameParam)
		}
		ptName = nameParam.ParamValue
	} else {
		db.Create(&models.GlobalParameter{
			ParamKey:    "GENERAL_NAMA_PT",
			ParamValue:  "PT BANK RAKYAT NUSANTARA TBK",
			Description: "Nama Resmi Institusi Perbankan",
			CreatedUser: "SYSTEM",
		})
	}

	log.Printf("Feeding initial banking CRMS data for %s (%s)...\n", ptName, ptSymbol)

	engine := decisionengine.NewEngine()

	// 1. Seed Decision Rules sesuai Grade Matrix
	for ap, bucketMap := range decisionengine.ActionPathMatrix {
		for bucket, pic := range bucketMap {
			group := "Grade " + ap
			if ap == "VIP" {
				group = "VIP"
			}
			rule := models.DecisionRule{
				StrategyGroup: group,
				RiskCategory:  group,
				ActionPath:    ap,
				Bucket:        bucket,
				AssignedPIC:   pic,
				HandlingType:  fmt.Sprintf("Handling via %s (%s)", pic, decisionengine.GetPICChannelName(pic)),
				IsActive:      true,
			}
			db.Create(&rule)
		}
	}

	// 2. Daftar Nama Debitur Retail & SME Perbankan (55 Debitur)
	names := []string{
		"Bambang Soediro, S.E. (Karyawan BUMN)", "dr. Dewi Sartika, Sp.A (Dokter Spesialis)", "Hendra Gunawan (Wiraswasta Retail)",
		"Siti Rahmawati, S.Pd (PNS Pemprov)", "Agus Setiawan (Manager Logistik)", "Rini Wulandari, S.Farm (Apoteker)",
		"Budi Santoso (PNS Bappeda Pemprov DKI)", "Eko Prasetyo (Staff IT Senior)", "Ratna Sari, M.M. (Dosen Ekonomi)",
		"Dian Permata, S.H., M.Kn (Notaris)", "Ferry Pratama, S.T. (Arsitek)", "drg. Sri Wahyuni (Dokter Gigi)",
		"Doni Kusuma (Kontraktor)", "Maya Indah (Desainer Grafis)", "Rizky Ramadhan (Pilot Komersial)",
		"Taufik Hidayat (Pelatih Olahraga)", "Lina Marlina (Pedagang Grosir Pasar)", "Aris Munandar, Ak. (Akuntan Publik)",
		"Yuni Astuti, M.Si (Peneliti BRIN)", "Wahyu Nugroho (Pengusaha Bengkel Mobil)", "Indra Wijaya (Supervisor Pabrik)",
		"Anita Silvia (Finance Manager)", "Ade Kurniawan (Supervisor Konstruksi)", "Mega Utami, BKP (Konsultan Pajak)",
		"Surya Saputra (Pengusaha Ekspedisi)", "Novi Anggraini (HRD Specialist)", "Gerry Iskandar (Distributor F&B)",
		"Putri Mayasari (Creative Agency)", "Hadi Suwarno (Peternak Modern)", "Fitri Handayani (Bankir BUMN)",
		"Andi Firmansyah (Pengusaha Percetakan)", "Vina Pandu (Pemilik Restoran)", "Dedi Sukmana (Suplier Pertanian)",
		"Irma Suryani (Pemilik Butik Busana)", "Farhan Maulana (Software Engineer)", "Ayu Lestari (Marketing Manager)",
		"Rudi Hartono (Pensiunan BUMN)", "Nia Kurniasih (Pengusaha Laundry)", "Bagus Pambudi (PNS Bappeda)",
		"Kartika Dewi (Pengusaha Katering)", "Irwan Syahputra (Suplier Material Bangunan)", "Siska Amelia, S.H. (Advokat)",
		"Reza Fahlevi (Pengrajin Mebel Ekspor)", "Melati Kusuma (Konsultan SDM)", "Dimas Anggara (Bengkel Bubut & Las)",
		"Tuti Alawiyah (Pemilik Minimarket)", "Bayu Segara (Staff Operasional Migas)", "Gita Gutawa (Produser Kreatif)",
		"Wawan Darmawan (Eksportir Kerajinan)", "Dini Febriani (Manager Rantai Pasok)", "Darmawan Salihin (Manufaktur Plastik)",
		"CV Sinar Mandiri Logistik (Debitur Komersial)", "Haji Syamsudin (Nasabah Prioritas VIP)", 
		"Ir. Kusuma Hartono (Private Banking VIP)", "Veronica Tan (Nasabah Solitaire VIP)",
	}

	// 3. Portofolio Fasilitas Kredit Perbankan (KPR, KMK, KI, KTA, KUR, KPA, Multiguna, CC)
	modelsList := []struct {
		model       string  // Nama Fasilitas Kredit
		lob         string  // Line of Business Portofolio
		brand       string  // Kategori Produk
		collateral  string  // Keterangan Agunan / Jaminan
		installment float64 // Angsuran per bulan (Pokok + Bunga)
		principal   float64 // Plafon Pinjaman
		tenor       int     // Tenor dalam bulan
	}{
		{
			model:       "KPR Griya Utama Primary",
			lob:         "Kredit Konsumer",
			brand:       "KPR",
			collateral:  "SHM No. 4182/Kebayoran (Rumah Tinggal)",
			installment: 7800000,
			principal:   850000000,
			tenor:       180,
		},
		{
			model:       "KPR Refinancing & Renovasi",
			lob:         "Kredit Konsumer",
			brand:       "KPR",
			collateral:  "SHM No. 1290/Tebet (Rumah Tinggal)",
			installment: 5200000,
			principal:   550000000,
			tenor:       120,
		},
		{
			model:       "Kredit Pemilikan Apartemen (KPA)",
			lob:         "Kredit Konsumer",
			brand:       "KPA",
			collateral:  "Strata Title Unit 18B Superblok",
			installment: 6100000,
			principal:   680000000,
			tenor:       144,
		},
		{
			model:       "Kredit Modal Kerja (KMK) Konstruksi & Dagang",
			lob:         "Kredit Komersial / SME",
			brand:       "KMK",
			collateral:  "SHGB No. 581/Ruko Roxy Niaga",
			installment: 14500000,
			principal:   1200000000,
			tenor:       36,
		},
		{
			model:       "Kredit Investasi (KI) Manufaktur & Mesin",
			lob:         "Kredit Komersial / SME",
			brand:       "KI",
			collateral:  "SHM Pabrik Industri & Mesin Cetak",
			installment: 21000000,
			principal:   1800000000,
			tenor:       60,
		},
		{
			model:       "Kredit Multiguna Properti",
			lob:         "Kredit Konsumer",
			brand:       "MULTIGUNA",
			collateral:  "SHM No. 771/Kelapa Gading Barat",
			installment: 4300000,
			principal:   420000000,
			tenor:       84,
		},
		{
			model:       "Kredit Usaha Rakyat (KUR) Ritel Mikro",
			lob:         "Kredit UMKM",
			brand:       "KUR",
			collateral:  "Kios Usaha Pasar & BPKB Pick-up",
			installment: 2600000,
			principal:   95000000,
			tenor:       36,
		},
		{
			model:       "Kredit Tanpa Agunan (KTA) Payroll ASN/BUMN",
			lob:         "Kredit Konsumer",
			brand:       "KTA",
			collateral:  "Potong Gaji / Auto-Debet Payroll (Non-Collateral)",
			installment: 2450000,
			principal:   75000000,
			tenor:       36,
		},
		{
			model:       "Kartu Kredit World Platinum",
			lob:         "Kartu Kredit",
			brand:       "KARTU_KREDIT",
			collateral:  "Limit Revolving Credit (Non-Collateral)",
			installment: 2200000,
			principal:   45000000,
			tenor:       24,
		},
	}

	// 4. Kantor Cabang Perbankan (KCU / KC)
	branches := []struct {
		code string
		name string
	}{
		{"0001", fmt.Sprintf("KCU %s Jakarta Sudirman", ptSymbol)},
		{"0002", fmt.Sprintf("KC %s Jakarta Kelapa Gading", ptSymbol)},
		{"0010", fmt.Sprintf("KCU %s Surabaya Darmo", ptSymbol)},
		{"0020", fmt.Sprintf("KCU %s Bandung Dago", ptSymbol)},
		{"0030", fmt.Sprintf("KCU %s Medan Putri Hijau", ptSymbol)},
		{"0040", fmt.Sprintf("KC %s Semarang Pemuda", ptSymbol)},
	}

	presetDPDs := []int{
		2, 3, 1, 2, // 1-3
		5, 6, 4, 7, // 4-7
		9, 11, 12, 8, // 8-13
		15, 17, 14, 18, // 14-18
		21, 23, 19, 25, // 19-25
		27, 29, 26, 30, // 26-30
		35, 42, 50, 58, // 31-60
		75, 95, 110, 140, // 61-150
		160, 180, 210, 240, // >150
	}

	now := time.Now()

	for i, name := range names {
		isVIP := false
		if i >= len(names)-3 {
			isVIP = true
		}

		// Tentukan profesi nasabah secara terstruktur
		occupation := "Karyawan Swasta Profesional"
		if strings.Contains(name, "Budi Santoso") || strings.Contains(name, "Bappeda") || strings.Contains(name, "PNS") || strings.Contains(name, "Pemprov") {
			occupation = "Pegawai Negeri Sipil (PNS) Bappeda Pemprov DKI"
		} else if strings.Contains(name, "BUMN") {
			occupation = "Karyawan BUMN"
		} else if strings.Contains(name, "dr.") || strings.Contains(name, "drg.") {
			occupation = "Dokter Praktik Spesialis"
		} else if strings.Contains(name, "Notaris") {
			occupation = "Notaris & PPAT"
		} else if strings.Contains(name, "Pengusaha") || strings.Contains(name, "Distributor") || strings.Contains(name, "Suplier") {
			occupation = "Wiraswasta / Pemilik Usaha SME"
		} else if isVIP {
			occupation = "Direktur Utama / Private Banking VIP"
		}

		custNo := fmt.Sprintf("CIF-%06d", i+10001)
		phone := fmt.Sprintf("0812%08d", 10000000+i*2345)
		email := fmt.Sprintf("debitur%d@%s-bank.co.id", i+1, strings.ToLower(ptSymbol))
		city := "Jakarta"
		if i%3 == 1 {
			city = "Surabaya"
		} else if i%3 == 2 {
			city = "Bandung"
		}

		cust := models.Customer{
			CustomerNo: custNo,
			Name:       name,
			Phone:      phone,
			Email:      email,
			Address:    fmt.Sprintf("Jl. Melati Raya No. %d, %s", i+14, city),
			City:       city,
			Occupation: occupation,
			IsVIP:      isVIP,
			CreatedAt:  now.AddDate(0, -12, -i),
			UpdatedAt:  now,
		}
		db.Create(&cust)

		// 5. Rekening Pinjaman Utama / Perjanjian Kredit (PK) Perbankan
		mInfo := modelsList[i%len(modelsList)]
		bInfo := branches[i%len(branches)]
		agrNo := fmt.Sprintf("%s-%s-%d-%06d", ptSymbol, mInfo.brand, 2024+(i%2), 100000+i*137)

		tenor := mInfo.tenor
		paidTenor := (i * 3) % (tenor / 2)
		if paidTenor == 0 {
			paidTenor = 6
		}

		// Kustomisasi khusus profil Budi Santoso (KPR Griya Utama Primary)
		if strings.Contains(name, "Budi Santoso") {
			mInfo = struct {
				model       string
				lob         string
				brand       string
				collateral  string
				installment float64
				principal   float64
				tenor       int
			}{
				model:       "KPR Griya Utama Primary",
				lob:         "Kredit Konsumer",
				brand:       "KPR",
				collateral:  "SHM No. 4182/Kebayoran (Rumah Tinggal)",
				installment: 7800000,
				principal:   850000000,
				tenor:       180,
			}
			agrNo = fmt.Sprintf("%s-KPR-2024-100822", ptSymbol)
			tenor = 180
			paidTenor = 18
		} else if strings.Contains(name, "Kusuma Hartono") {
			mInfo = struct {
				model       string
				lob         string
				brand       string
				collateral  string
				installment float64
				principal   float64
				tenor       int
			}{
				model:       "Kredit Modal Kerja (KMK) Konstruksi & Dagang",
				lob:         "Kredit Komersial / SME",
				brand:       "KMK",
				collateral:  "SHGB No. 581/Ruko Roxy Niaga",
				installment: 14500000,
				principal:   1500000000,
				tenor:       36,
			}
			agrNo = fmt.Sprintf("%s-KMK-2024-107261", ptSymbol)
			tenor = 36
			paidTenor = 12
		}

		agr := models.Agreement{
			AgreementNo:       agrNo,
			CustomerID:        cust.ID,
			LOB:               mInfo.lob,
			AssetBrand:        mInfo.brand,
			AssetModel:        mInfo.model,
			PlateNo:           mInfo.collateral,
			TotalFinancing:    mInfo.principal,
			InstallmentAmount: mInfo.installment,
			TenorMonths:       tenor,
			PaidTenorMonths:   paidTenor,
			BranchCode:        bInfo.code,
			BranchName:        bInfo.name,
			CreatedAt:         now.AddDate(0, -paidTenor, 0),
			UpdatedAt:         now,
		}
		db.Create(&agr)

		// 6. Overdue Account
		var dpd int
		if strings.Contains(name, "Budi Santoso") {
			dpd = 2
		} else if strings.Contains(name, "Kusuma Hartono") {
			dpd = 15
		} else if i < len(presetDPDs) {
			dpd = presetDPDs[i]
		} else {
			dpd = (i*7)%170 + 1
		}

		var riskScore int
		if isVIP {
			riskScore = 850
		} else if strings.Contains(name, "Budi Santoso") {
			riskScore = 780
		} else {
			riskScore = 300 + ((i * 47) % 600)
		}

		isChampion := (i%3 == 0)

		eval := engine.Evaluate(dpd, riskScore, isVIP, isChampion, i+1)

		overdueAmt := mInfo.installment * float64(1+(dpd/30))

		status := "OPEN"
		var ptpDate *time.Time
		var ptpAmt float64
		if i%4 == 0 {
			status = "PROMISE_TO_PAY"
			d := now.AddDate(0, 0, 3)
			ptpDate = &d
			ptpAmt = mInfo.installment
		}

		// Alokasi Tahapan Pemulihan Lanjutan (Advanced Collections Lifecycle)
		recoveryStage := "STAGE_COLLECTION"
		recommendedChannel := "WA"
		costRate := 95.0

		if dpd > 90 && i%3 == 0 {
			recoveryStage = "STAGE_LITIGATION_AUCTION"
			recommendedChannel = "AUCTION_PARTNER"
			costRate = 30.0
		} else if dpd > 60 && i%2 == 0 {
			recoveryStage = "STAGE_LEGAL_NOTICE"
			recommendedChannel = "LEGAL_OFFICER"
			costRate = 40.0
		} else if dpd > 30 && i%3 == 1 {
			recoveryStage = "STAGE_RESTRUCTURING"
			recommendedChannel = "CREDIT_ANALYST"
			costRate = 75.0
		} else if dpd > 15 && i%5 == 0 {
			recoveryStage = "STAGE_SKIP_TRACING"
			recommendedChannel = "SKIP_TRACER"
			costRate = 50.0
		} else if status == "PROMISE_TO_PAY" && dpd > 30 {
			recoveryStage = "STAGE_SETTLEMENT"
			recommendedChannel = "AR_HEAD_SETTLEMENT"
			costRate = 85.0
		} else {
			if eval.RiskLevel == "LOW_RISK" {
				recommendedChannel = "WA"
				costRate = 95.0
			} else if eval.RiskLevel == "MEDIUM_RISK" {
				recommendedChannel = "DC"
				costRate = 75.0
			} else {
				recommendedChannel = "FC"
				costRate = 45.0
			}
		}

		lastContact := now.Add(-time.Duration(rand.Intn(48)) * time.Hour)

		overdue := models.OverdueAccount{
			AgreementNo:        agrNo,
			DPD:                dpd,
			OverdueAmount:      overdueAmt,
			CurrentBucket:      eval.Bucket,
			RiskScore:          riskScore,
			RiskLevel:          eval.RiskLevel,
			StrategyGroup:      eval.StrategyGroup,
			ActionPath:         eval.ActionPath,
			AssignedPIC:        eval.AssignedPIC,
			PICChannel:         eval.PICChannel,
			RecoveryStage:      recoveryStage,
			RecommendedChannel: recommendedChannel,
			CostEfficiencyRate: costRate,
			Status:             status,
			LastContactAt:      &lastContact,
			PTPDate:            ptpDate,
			PTPAmount:          ptpAmt,
			Notes:              eval.DecisionRule,
			CreatedAt:          now,
			UpdatedAt:          now,
		}
		db.Create(&overdue)

		actStatus := "CONTACTED"
		if overdue.AssignedPIC == decisionengine.PIC_WA {
			actStatus = "WA_DELIVERED"
		} else if overdue.AssignedPIC == decisionengine.PIC_ROBOT {
			actStatus = "ROBO_PLAYED"
		} else if overdue.AssignedPIC == decisionengine.PIC_FC || overdue.AssignedPIC == decisionengine.PIC_SFC || overdue.AssignedPIC == decisionengine.PIC_SENIOR_FIELD {
			actStatus = "VISITED"
		}

		act := models.CollectionActivity{
			OverdueAccountID: overdue.ID,
			AgreementNo:      agrNo,
			ChannelType:      overdue.AssignedPIC,
			PerformedBy:      fmt.Sprintf("Officer_%s_01", overdue.AssignedPIC),
			ContactStatus:    actStatus,
			ResultCode:       status,
			PTPDate:          ptpDate,
			PTPAmount:        ptpAmt,
			GeoLat:           -6.200000 + (float64(i%100) * 0.001),
			GeoLng:           106.816666 + (float64(i%100) * 0.001),
			Notes:            fmt.Sprintf("Aktivitas penagihan kanal %s pada bucket %s untuk fasilitas %s (%s)", overdue.AssignedPIC, eval.Bucket, mInfo.model, mInfo.collateral),
			CreatedAt:        lastContact,
		}
		db.Create(&act)

		// 7. Tambahkan Fasilitas Kedua untuk Sebagian Debitur (Demonstrasi Unified Customer 360° Multi-Facility Exposure)
		if strings.Contains(name, "Budi Santoso") {
			// Fasilitas 2 Budi Santoso: KTA Payroll ASN Pemprov DKI (DPD 0 - Kol 1 Lancar)
			agrNo2 := fmt.Sprintf("%s-KTA-2024-800822", ptSymbol)
			agr2 := models.Agreement{
				AgreementNo:       agrNo2,
				CustomerID:        cust.ID,
				LOB:               "Kredit Konsumer",
				AssetBrand:        "KTA",
				AssetModel:        "KTA Payroll ASN Pemprov DKI",
				PlateNo:           "Potong Gaji / Auto-Debet Payroll ASN (Non-Collateral)",
				TotalFinancing:    75000000,
				InstallmentAmount: 2850000,
				TenorMonths:       36,
				PaidTenorMonths:   8,
				BranchCode:        bInfo.code,
				BranchName:        bInfo.name,
				CreatedAt:         now.AddDate(0, -8, 0),
				UpdatedAt:         now,
			}
			db.Create(&agr2)
			// KTA Budi Santoso sengaja tidak dimasukkan ke overdue_accounts agar berstatus LANCAR (Kol-1) di Customer 360°
		} else if strings.Contains(name, "Kusuma Hartono") {
			// Fasilitas 2 Ir. Kusuma Hartono: Kartu Kredit World Platinum (Overdue DPD 9)
			agrNo2 := fmt.Sprintf("%s-CC-2025-107262", ptSymbol)
			agr2 := models.Agreement{
				AgreementNo:       agrNo2,
				CustomerID:        cust.ID,
				LOB:               "Kartu Kredit",
				AssetBrand:        "KARTU_KREDIT",
				AssetModel:        "Kartu Kredit World Platinum",
				PlateNo:           "Limit Revolving Credit (Non-Collateral)",
				TotalFinancing:    100000000,
				InstallmentAmount: 4500000,
				TenorMonths:       24,
				PaidTenorMonths:   6,
				BranchCode:        bInfo.code,
				BranchName:        bInfo.name,
				CreatedAt:         now.AddDate(0, -6, 0),
				UpdatedAt:         now,
			}
			db.Create(&agr2)

			overdue2 := models.OverdueAccount{
				AgreementNo:        agrNo2,
				DPD:                9,
				OverdueAmount:      4500000,
				CurrentBucket:      "8-13",
				RiskScore:          850,
				RiskLevel:          "LOW_RISK",
				StrategyGroup:      "VIP",
				ActionPath:         "VIP",
				AssignedPIC:        "AR Head",
				PICChannel:         "AR_HEAD",
				RecoveryStage:      "STAGE_COLLECTION",
				RecommendedChannel: "WA",
				CostEfficiencyRate: 95.0,
				Status:             "OPEN",
				Notes:              "Fasilitas Kartu Kredit World Platinum nasabah VIP",
				CreatedAt:          now,
				UpdatedAt:          now,
			}
			db.Create(&overdue2)
		} else if i%3 == 0 || isVIP {
			mInfo2 := modelsList[(i+3)%len(modelsList)]
			agrNo2 := fmt.Sprintf("%s-%s-%d-%06d", ptSymbol, mInfo2.brand, 2024, 800000+i*137)
			agr2 := models.Agreement{
				AgreementNo:       agrNo2,
				CustomerID:        cust.ID,
				LOB:               mInfo2.lob,
				AssetBrand:        mInfo2.brand,
				AssetModel:        mInfo2.model,
				PlateNo:           mInfo2.collateral,
				TotalFinancing:    mInfo2.principal,
				InstallmentAmount: mInfo2.installment,
				TenorMonths:       mInfo2.tenor,
				PaidTenorMonths:   4,
				BranchCode:        bInfo.code,
				BranchName:        bInfo.name,
				CreatedAt:         now.AddDate(0, -6, 0),
				UpdatedAt:         now,
			}
			db.Create(&agr2)

			// Sebagian fasilitas kedua juga tertunggak
			if i%6 == 0 {
				dpd2 := (dpd / 2) + 2
				overdue2 := models.OverdueAccount{
					AgreementNo:        agrNo2,
					DPD:                dpd2,
					OverdueAmount:      mInfo2.installment * float64(1+(dpd2/30)),
					CurrentBucket:      engine.Evaluate(dpd2, riskScore, isVIP, isChampion, i+100).Bucket,
					RiskScore:          riskScore,
					RiskLevel:          eval.RiskLevel,
					StrategyGroup:      eval.StrategyGroup,
					ActionPath:         eval.ActionPath,
					AssignedPIC:        eval.AssignedPIC,
					PICChannel:         eval.PICChannel,
					RecoveryStage:      "STAGE_COLLECTION",
					RecommendedChannel: "WA",
					CostEfficiencyRate: 95.0,
					Status:             "OPEN",
					Notes:              "Fasilitas pinjaman kedua debitur (Cross-Facility Exposure)",
					CreatedAt:          now,
					UpdatedAt:          now,
				}
				db.Create(&overdue2)
			}
		}
	}

	log.Printf("Successfully seeded %d banking customers, credit agreements, and overdue accounts with symbol %s!\n", len(names), ptSymbol)
}

func SeedUsers(db *gorm.DB) {
	var userCount int64
	db.Model(&models.User{}).Count(&userCount)
	if userCount > 0 {
		return
	}

	hashPwd := func(pwd string) string {
		h, err := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.DefaultCost)
		if err != nil {
			return pwd
		}
		return string(h)
	}

	initialUsers := []models.User{
		{
			Username: "admin",
			Password: hashPwd("admin123"),
			FullName: "Administrator CRMS",
			Email:    "admin@crms.local",
			Role:     "ADMIN",
			IsActive: true,
		},
		{
			Username: "ar_head",
			Password: hashPwd("arhead123"),
			FullName: "Bambang Wijaya (AR Head)",
			Email:    "ar.head@crms.local",
			Role:     "AR_HEAD",
			IsActive: true,
		},
		{
			Username: "collector",
			Password: hashPwd("collector123"),
			FullName: "Dimas Kurniawan (Senior Field)",
			Email:    "collector@crms.local",
			Role:     "COLLECTOR",
			IsActive: true,
		},
	}

	for _, u := range initialUsers {
		db.Create(&u)
	}
	log.Println("Default CRMS users successfully seeded: admin, ar_head, collector.")
}
