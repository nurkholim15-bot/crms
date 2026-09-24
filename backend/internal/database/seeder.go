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
	SeedCollectorFeatures(db)

	var count int64
	db.Model(&models.Customer{}).Count(&count)

	// Cek apakah ada data legacy otomotif/Toyota atau perlu pembaruan ke versi multi-fasilitas
	var toyotaCount int64
	db.Model(&models.Agreement{}).Where("asset_brand = ? OR asset_model ILIKE ?", "Toyota", "%Toyota%").Count(&toyotaCount)

	var seedVer models.GlobalParameter
	needReseed := false
	if err := db.Where("param_key = ?", "BANKING_SEED_VERSION").First(&seedVer).Error; err != nil || seedVer.ParamValue != "2026.09.23_v6_geotracker_mcollect" {
		needReseed = true
	}

	if toyotaCount > 0 || needReseed {
		log.Println("Pembaruan portofolio perbankan: Menghapus dan feeding ulang data perbankan multi-fasilitas, GeoTracker, mCollect, 6-stage Settlement & arsitektur enterprise lengkap...")
		db.Exec("TRUNCATE TABLE collection_activities, overdue_accounts, decision_rules, agreements, customers, pre_delinquency_accounts, legal_cases, repossession_cases, settlement_proposals, skip_tracing_cases, settlement_tranches, collector_geo_locations, collector_route_points, payment_receipt_slips, collection_agencies, authority_delegations RESTART IDENTITY CASCADE")
		count = 0
		if err := db.Where("param_key = ?", "BANKING_SEED_VERSION").First(&seedVer).Error; err == nil {
			seedVer.ParamValue = "2026.09.23_v6_geotracker_mcollect"
			db.Save(&seedVer)
		} else {
			db.Create(&models.GlobalParameter{
				ParamKey:    "BANKING_SEED_VERSION",
				ParamValue:  "2026.09.23_v6_geotracker_mcollect",
				Description: "Versi Seeder Portofolio Perbankan Multi-Fasilitas Enterprise, GeoTracker & mCollect",
				CreatedUser: "SYSTEM",
			})
		}
	} else if count > 0 {
		log.Println("Database already seeded with banking portfolio data (v6 geotracker & mcollect). Skipping initial seed.")
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

		comboGrp := "SINGLE_FACILITY"
		if strings.Contains(name, "Budi Santoso") {
			comboGrp = "COMBO_KPR_KTA"
		} else if strings.Contains(name, "Kusuma Hartono") {
			comboGrp = "COMBO_KMK_CC"
		} else if i%3 == 0 || isVIP {
			comboGrp = "COMBO_RETAIL_MULTI"
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
			ComboGroup:        comboGrp,
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

		colUser := "andi"
		colName := "Andi Pratama"
		if dpd > 60 {
			colUser = "collector"
			colName = "Dimas Kurniawan"
		} else if dpd > 30 {
			colUser = "budi"
			colName = "Budi Santoso"
		} else if dpd > 13 {
			colUser = "rian"
			colName = "Rian Pratama"
		}

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
			CollectorUsername:  colUser,
			CollectorName:      colName,
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
				ComboGroup:        "COMBO_KPR_KTA",
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
				ComboGroup:        "COMBO_KMK_CC",
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
				CollectorUsername:  "ar_head",
				CollectorName:      "Bambang Wijaya (AR Head)",
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
				ComboGroup:        comboGrp,
				CreatedAt:         now.AddDate(0, -6, 0),
				UpdatedAt:         now,
			}
			db.Create(&agr2)

			// Sebagian fasilitas kedua juga tertunggak
			if i%6 == 0 {
				dpd2 := (dpd / 2) + 2
				colUser2 := "andi"
				colName2 := "Andi Pratama"
				if dpd2 > 60 {
					colUser2 = "collector"
					colName2 = "Dimas Kurniawan"
				} else if dpd2 > 30 {
					colUser2 = "budi"
					colName2 = "Budi Santoso"
				} else if dpd2 > 13 {
					colUser2 = "rian"
					colName2 = "Rian Pratama"
				}

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
					CollectorUsername:  colUser2,
					CollectorName:      colName2,
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

	// Seed Modul Enterprise Collections Architecture
	SeedPreDelinquency(db)
	SeedLegalCases(db)
	SeedRepossessionCases(db)
	SeedSettlementProposals(db)
	SeedSkipTracingCases(db)
	SeedGeoTrackerData(db)
	SeedMCollectData(db)
	SeedAgenciesAndDelegations(db)
}

func SeedUsers(db *gorm.DB) {
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
		{
			Username: "andi",
			Password: hashPwd("andi123"),
			FullName: "Andi Pratama (Field Collector)",
			Email:    "andi@crms.local",
			Role:     "COLLECTOR",
			IsActive: true,
		},
		{
			Username: "budi",
			Password: hashPwd("budi123"),
			FullName: "Budi Santoso (RSO Officer)",
			Email:    "budi@crms.local",
			Role:     "COLLECTOR",
			IsActive: true,
		},
		{
			Username: "rian",
			Password: hashPwd("rian123"),
			FullName: "Rian Pratama (FRO Officer)",
			Email:    "rian@crms.local",
			Role:     "COLLECTOR",
			IsActive: true,
		},
	}

	for _, u := range initialUsers {
		var existing models.User
		if err := db.Where("username = ?", u.Username).First(&existing).Error; err != nil {
			db.Create(&u)
		}
	}
	log.Println("CRMS users successfully verified/seeded: admin, ar_head, collector, andi, budi, rian.")
}

func SeedPreDelinquency(db *gorm.DB) {
	var count int64
	db.Model(&models.PreDelinquencyAccount{}).Count(&count)
	if count > 0 {
		return
	}

	var agrs []models.Agreement
	db.Preload("Customer").Limit(10).Find(&agrs)
	if len(agrs) == 0 {
		return
	}

	now := time.Now()
	pdmData := []struct {
		Reason  string
		CasaBal float64
		SalDate int
		Status  string
		Score   int
		Notes   string
	}{
		{"INSUFFICIENT_CASA", 350000, 25, "PENDING", 710, "Saldo CASA Rp 350.000 jauh di bawah cicilan. Rekomendasi Gentle Reminder H-1 via WhatsApp."},
		{"SALARY_DELAY_TUKIN", 1200000, 28, "PENDING", 740, "ASN Pemprov DKI, indikasi keterlambatan pencairan Tukin/payroll bulanan."},
		{"INSUFFICIENT_CASA", 750000, 25, "WA_SENT", 680, "Gentle reminder WA terkirim. Nasabah mengkonfirmasi akan transfer dari rekening bank lain."},
		{"HIGH_UTILIZATION", 150000, 27, "PENDING", 650, "Limit kartu kredit terpakai 98%, saldo tabungan menipis."},
		{"INSUFFICIENT_CASA", 500000, 25, "CURED", 790, "Nasabah telah melakukan top up saldo tabungan, siap didebet otomatis."},
		{"FIRST_PAYMENT_DEFAULT", 800000, 25, "PENDING", 620, "Angsuran pertama (FPD Risk Alert). Perlu pemantauan khusus kanal digital."},
		{"SALARY_DELAY_TUKIN", 2100000, 30, "WA_SENT", 760, "Notifikasi pengingat ramah WA terkirim, nasabah menjanjikan dana masuk tgl 28."},
		{"INSUFFICIENT_CASA", 450000, 25, "PENDING", 705, "Saldo tabungan Rp 450rb < cicilan. Sistem merekomendasikan pre-due WhatsApp."},
	}

	for i, p := range pdmData {
		agr := agrs[i%len(agrs)]
		dueDate := now.AddDate(0, 0, (i % 3))
		acc := models.PreDelinquencyAccount{
			AgreementNo:       agr.AgreementNo,
			CustomerID:        agr.CustomerID,
			DueDate:           dueDate,
			InstallmentAmount: agr.InstallmentAmount,
			CASABalance:       p.CasaBal,
			SalaryDate:        p.SalDate,
			PDMTriggerReason:  p.Reason,
			ReminderStatus:    p.Status,
			RiskScore:         p.Score,
			Notes:             p.Notes,
			CreatedAt:         now,
			UpdatedAt:         now,
		}
		if p.Status == "CURED" || p.Status == "WA_SENT" {
			curedTime := now.Add(-time.Hour * 4)
			acc.CuredAt = &curedTime
		}
		db.Create(&acc)
	}
	log.Println("Pre-Delinquency (PDM) DPD 0 accounts successfully seeded.")
}

func SeedLegalCases(db *gorm.DB) {
	var count int64
	db.Model(&models.LegalCase{}).Count(&count)
	if count > 0 {
		return
	}

	var agrs []models.Agreement
	db.Preload("Customer").Where("asset_brand IN ?", []string{"KPR", "KMK", "KPA"}).Limit(10).Find(&agrs)
	if len(agrs) < 5 {
		db.Preload("Customer").Limit(10).Find(&agrs)
	}
	if len(agrs) == 0 {
		return
	}

	now := time.Now()
	hearing1 := now.AddDate(0, 0, 14)
	hearing2 := now.AddDate(0, 0, 7)

	cases := []models.LegalCase{
		{
			CaseNo:        "LEG-2026-JKT-001",
			AgreementNo:   agrs[0].AgreementNo,
			CustomerID:    agrs[0].CustomerID,
			LegalStage:    "STAGE_INITIATE",
			LawyerName:    "Bambang Sujatmo, S.H.",
			LawFirm:       "Sujatmo & Partners Law Firm",
			CourtName:     "PN Jakarta Pusat",
			PoliceStation: "-",
			ClaimAmount:   850000000,
			LegalSection:  "Pasal 1243 KUHPerdata & UU Hak Tanggungan No. 4/1996",
			Status:        "ACTIVE",
			Notes:         "Somasi 1 dan 2 telah diabaikan. Persiapan draft gugatan wanprestasi.",
			CreatedAt:     now.AddDate(0, 0, -20),
			UpdatedAt:     now,
		},
		{
			CaseNo:        "LEG-2026-JKT-002",
			AgreementNo:   agrs[1%len(agrs)].AgreementNo,
			CustomerID:    agrs[1%len(agrs)].CustomerID,
			LegalStage:    "STAGE_LAWYER_ALLOC",
			LawyerName:    "Hendra Wijaya, S.H., M.H.",
			LawFirm:       "Assegaf, Wijaya & Associates",
			CourtName:     "PN Jakarta Selatan",
			PoliceStation: "Polres Metro Jakarta Selatan",
			ClaimAmount:   1250000000,
			LegalSection:  "UU Jaminan Fidusia No. 42/1999 & Dugaan Penggelapan 372 KUHP",
			Status:        "ACTIVE",
			Notes:         "Surat Kuasa Khusus telah ditandatangani. Alokasi pengacara eksternal panel Bank.",
			CreatedAt:     now.AddDate(0, 0, -35),
			UpdatedAt:     now,
		},
		{
			CaseNo:        "LEG-2026-JKT-003",
			AgreementNo:   agrs[2%len(agrs)].AgreementNo,
			CustomerID:    agrs[2%len(agrs)].CustomerID,
			LegalStage:    "STAGE_DOC_APPROVAL",
			LawyerName:    "Ratna Juwita, S.H.",
			LawFirm:       "In-House Legal Litigation Bank",
			CourtName:     "PN Jakarta Barat",
			PoliceStation: "-",
			ClaimAmount:   490000000,
			LegalSection:  "Gugatan Sederhana (Small Claim Court) PERMA No. 4/2019",
			Status:        "ACTIVE",
			Notes:         "Verifikasi kelengkapan dokumen PK notariil, sertifikat hak tanggungan, dan SKMHT telah disetujui Head of Legal.",
			CreatedAt:     now.AddDate(0, 0, -45),
			UpdatedAt:     now,
		},
		{
			CaseNo:        "LEG-2026-JKT-004",
			AgreementNo:   agrs[3%len(agrs)].AgreementNo,
			CustomerID:    agrs[3%len(agrs)].CustomerID,
			LegalStage:    "STAGE_PROCEEDINGS",
			LawyerName:    "Bambang Sujatmo, S.H.",
			LawFirm:       "Sujatmo & Partners Law Firm",
			CourtName:     "PN Jakarta Pusat",
			PoliceStation: "-",
			ClaimAmount:   920000000,
			HearingDate:   &hearing1,
			LegalSection:  "No Perkara: 142/Pdt.G/2026/PN.Jkt.Pst - Sidang Mediasi",
			Status:        "ACTIVE",
			Notes:         "Sidang mediasi pertama gagal, dilanjutkan pembacaan jawaban tergugat pekan depan.",
			CreatedAt:     now.AddDate(0, 0, -60),
			UpdatedAt:     now,
		},
		{
			CaseNo:        "LEG-2026-JKT-005",
			AgreementNo:   agrs[4%len(agrs)].AgreementNo,
			CustomerID:    agrs[4%len(agrs)].CustomerID,
			LegalStage:    "STAGE_JUDGEMENT_WITHDRAWAL",
			LawyerName:    "Hendra Wijaya, S.H., M.H.",
			LawFirm:       "Assegaf, Wijaya & Associates",
			CourtName:     "PN Jakarta Timur",
			PoliceStation: "-",
			ClaimAmount:   680000000,
			HearingDate:   &hearing2,
			LegalSection:  "Putusan Inkrah No. 89/Pdt.G/2025/PN.Jkt.Tim",
			Status:        "DECIDED_WON",
			Notes:         "Gugatan dimenangkan penuh oleh Bank. Penetapan Aanmaning dan fiat eksekusi lelang diterbitkan pengadilan.",
			CreatedAt:     now.AddDate(0, 0, -90),
			UpdatedAt:     now,
		},
		{
			CaseNo:        "LEG-2026-JKT-006",
			AgreementNo:   agrs[5%len(agrs)].AgreementNo,
			CustomerID:    agrs[5%len(agrs)].CustomerID,
			LegalStage:    "STAGE_JUDGEMENT_WITHDRAWAL",
			LawyerName:    "Ratna Juwita, S.H.",
			LawFirm:       "In-House Legal Litigation Bank",
			CourtName:     "PN Jakarta Utara",
			PoliceStation: "-",
			ClaimAmount:   310000000,
			LegalSection:  "Akta Perdamaian (Dading) di Luar Pengadilan",
			Status:        "SETTLED",
			Notes:         "Debitur menyetujui restrukturisasi dan membayar uang muka komitmen. Perkara dicabut resmi dari pengadilan.",
			CreatedAt:     now.AddDate(0, 0, -110),
			UpdatedAt:     now,
		},
	}

	for _, c := range cases {
		db.Create(&c)
	}
	log.Println("Legal Recourse cases (6-stage workflow) successfully seeded.")
}

func SeedRepossessionCases(db *gorm.DB) {
	var count int64
	db.Model(&models.RepossessionCase{}).Count(&count)
	if count > 0 {
		return
	}

	var agrs []models.Agreement
	db.Preload("Customer").Where("asset_brand IN ?", []string{"KPR", "KKB", "KPA"}).Limit(10).Find(&agrs)
	if len(agrs) < 5 {
		db.Preload("Customer").Limit(10).Find(&agrs)
	}
	if len(agrs) == 0 {
		return
	}

	now := time.Now()

	repos := []models.RepossessionCase{
		{
			RepoNo:            "REPO-2026-JKT-001",
			AgreementNo:       agrs[0].AgreementNo,
			CustomerID:        agrs[0].CustomerID,
			RepoStage:         "STAGE_MARKING",
			AssetType:         "PROPERTI_SHM",
			AssetDescription:  "Rumah Tinggal 2 Lantai Cluster Menteng Hijau Blok C No. 12 (LT: 160m2, LB: 140m2)",
			StockyardLocation: "N/A (Objek Properti Terpasang Plang Pengawasan)",
			ValuationAgency:   "-",
			MarketValue:       1200000000,
			LiquidationValue:  900000000,
			Status:            "IN_REPO",
			Notes:             "Akun ditandai default > 90 DPD. SP1 s.d SP3 eksekusi agunan telah terkirim.",
			CreatedAt:         now.AddDate(0, 0, -15),
			UpdatedAt:         now,
		},
		{
			RepoNo:            "REPO-2026-JKT-002",
			AgreementNo:       agrs[1%len(agrs)].AgreementNo,
			CustomerID:        agrs[1%len(agrs)].CustomerID,
			RepoStage:         "STAGE_ASSET_CAPTURING",
			AssetType:         "KENDARAAN_BPKB",
			AssetDescription:  "Truk Box Isuzu Giga FVR 34P 2022 (B 9811 KXT) - Armada Distribusi",
			StockyardLocation: "Pool Stockyard Pulogadung Kav. 18",
			ValuationAgency:   "Internal Asset Evaluator Bank",
			MarketValue:       480000000,
			LiquidationValue:  360000000,
			Status:            "IN_REPO",
			Notes:             "Kendaraan berhasil ditarik secara damai dengan Berita Acara Serah Terima Kendaraan (BASTK). Fisik tersimpan aman.",
			CreatedAt:         now.AddDate(0, 0, -25),
			UpdatedAt:         now,
		},
		{
			RepoNo:            "REPO-2026-JKT-003",
			AgreementNo:       agrs[2%len(agrs)].AgreementNo,
			CustomerID:        agrs[2%len(agrs)].CustomerID,
			RepoStage:         "STAGE_ASSET_VALUATION",
			AssetType:         "PROPERTI_SHM",
			AssetDescription:  "Ruko Niaga Fatmawati 3 Lantai No. 8B (SHM No. 4412/Cilandak)",
			StockyardLocation: "N/A (Properti Tersegel Bank)",
			ValuationAgency:   "KJPP Tri, Suwondo & Rekan (Panel Bank)",
			MarketValue:       2850000000,
			LiquidationValue:  2100000000,
			Status:            "IN_REPO",
			Notes:             "Laporan penilaian independen KJPP resmi selesai. Nilai pasar Rp 2.85 Milyar, nilai likuidasi Rp 2.1 Milyar.",
			CreatedAt:         now.AddDate(0, 0, -40),
			UpdatedAt:         now,
		},
		{
			RepoNo:            "REPO-2026-JKT-004",
			AgreementNo:       agrs[3%len(agrs)].AgreementNo,
			CustomerID:        agrs[3%len(agrs)].CustomerID,
			RepoStage:         "STAGE_AUCTION",
			AssetType:         "PROPERTI_SHGB",
			AssetDescription:  "Apartemen Bassura City Tower Cattleya Lt. 15 Unit 08 (34 m2)",
			StockyardLocation: "N/A (Apartemen)",
			ValuationAgency:   "KJPP Muttaqin Bambang Purwanto",
			MarketValue:       620000000,
			LiquidationValue:  465000000,
			HighestBidAmount:  495000000,
			BuyerName:         "Bpk. Ronald Susanto (Peserta Lelang No. 042)",
			Status:            "AUCTION_ACTIVE",
			Notes:             "Proses lelang melalui KPKNL Jakarta II secara open-bidding. Penawaran tertinggi tercatat Rp 495 Juta.",
			CreatedAt:         now.AddDate(0, 0, -55),
			UpdatedAt:         now,
		},
		{
			RepoNo:            "REPO-2026-JKT-005",
			AgreementNo:       agrs[4%len(agrs)].AgreementNo,
			CustomerID:        agrs[4%len(agrs)].CustomerID,
			RepoStage:         "STAGE_RELEASE",
			AssetType:         "PROPERTI_SHM",
			AssetDescription:  "Rumah Tinggal Pondok Kelapa Asri Kav. B-14 (SHM No. 1092)",
			StockyardLocation: "N/A",
			ValuationAgency:   "KJPP Tri & Rekan",
			MarketValue:       950000000,
			LiquidationValue:  720000000,
			HighestBidAmount:  760000000,
			BuyerName:         "Ibu Hartati Mulyono",
			Status:            "SOLD",
			Notes:             "Risalah Lelang KPKNL No. 412/2026 telah terbit. Hasil lelang dialokasikan melunasi seluruh baki debet pinjaman.",
			CreatedAt:         now.AddDate(0, 0, -80),
			UpdatedAt:         now,
		},
	}

	for _, r := range repos {
		db.Create(&r)
	}
	log.Println("Repossession & Auction cases (8-stage workflow) successfully seeded.")
}

func SeedSettlementProposals(db *gorm.DB) {
	var count int64
	db.Model(&models.SettlementProposal{}).Count(&count)
	if count > 0 {
		return
	}

	var agrs []models.Agreement
	db.Preload("Customer").Limit(10).Find(&agrs)
	if len(agrs) == 0 {
		return
	}

	now := time.Now()
	due1 := now.AddDate(0, 0, 7)
	due2 := now.AddDate(0, 0, 14)
	due3 := now.AddDate(0, 0, 3)

	proposals := []models.SettlementProposal{
		{
			ProposalNo:          "SETTLE-2026-001",
			AgreementNo:         agrs[0].AgreementNo,
			CustomerID:          agrs[0].CustomerID,
			SettlementStage:     "STAGE_PAYMENT_TRACKING",
			SettlementType:      "NET_SETTLEMENT",
			OriginalOverdue:     145000000,
			WaivedPenalty:       18000000,
			WaivedInterest:      22000000,
			NetSettlementAmount: 105000000,
			ApprovalStatus:      "APPROVED_BY_COMMITTEE",
			RecommendationTier:  "AR_HEAD",
			RecommendedTo:       "Head of Consumer Recovery",
			ApprovedBy:          "Head of Consumer Recovery",
			PaymentDueDate:      &due1,
			TotalTranches:       3,
			Notes:               "Pengajuan Program Keringanan Net Settlement 3 Termin: Diskon denda keterlambatan 100% dan diskon bunga tunggakan 65%. Termin 1 telah lunas, termin 2 & 3 dalam pemantauan.",
			CreatedAt:           now.AddDate(0, 0, -12),
			UpdatedAt:           now,
		},
		{
			ProposalNo:          "SETTLE-2026-002",
			AgreementNo:         agrs[1%len(agrs)].AgreementNo,
			CustomerID:          agrs[1%len(agrs)].CustomerID,
			SettlementStage:     "STAGE_CLOSURE",
			SettlementType:      "CHARGE_WISE_SETTLEMENT",
			OriginalOverdue:     62000000,
			WaivedPenalty:       12000000,
			WaivedInterest:      5000000,
			NetSettlementAmount: 45000000,
			ApprovalStatus:      "PAID_OFF",
			RecommendationTier:  "BRANCH_MANAGER",
			RecommendedTo:       "Branch Manager Sudirman",
			ApprovedBy:          "Bambang Wijaya (AR Head & Komite Remedial)",
			PaymentDueDate:      &due2,
			TotalTranches:       1,
			Notes:               "Charge-Wise: Penghapusan biaya denda 100% (Rp 12 Juta), bunga diskon Rp 5 Juta. Pokok pinjaman dibayar penuh Rp 45 Juta lunas dalam 1 kali bayar. Rekening ditutup.",
			CreatedAt:           now.AddDate(0, 0, -8),
			UpdatedAt:           now,
		},
		{
			ProposalNo:          "SETTLE-2026-003",
			AgreementNo:         agrs[2%len(agrs)].AgreementNo,
			CustomerID:          agrs[2%len(agrs)].CustomerID,
			SettlementStage:     "STAGE_RECOMMEND_APPROVAL",
			SettlementType:      "AUTO_CHARGE_ALLOCATION",
			OriginalOverdue:     85000000,
			WaivedPenalty:       0,
			WaivedInterest:      0,
			NetSettlementAmount: 85000000,
			ApprovalStatus:      "RECOMMENDED",
			RecommendationTier:  "BRANCH_MANAGER",
			RecommendedTo:       "Branch Manager Thamrin",
			ApprovedBy:          "-",
			PaymentDueDate:      &due3,
			TotalTranches:       2,
			Notes:               "Auto-Charge Allocation: Menunggu persetujuan komite untuk pemotongan bertahap otomatis rekening CASA debitur.",
			CreatedAt:           now.AddDate(0, 0, -4),
			UpdatedAt:           now,
		},
		{
			ProposalNo:          "SETTLE-2026-004",
			AgreementNo:         agrs[3%len(agrs)].AgreementNo,
			CustomerID:          agrs[3%len(agrs)].CustomerID,
			SettlementStage:     "STAGE_RECOMMEND_APPROVAL",
			SettlementType:      "NET_SETTLEMENT",
			OriginalOverdue:     210000000,
			WaivedPenalty:       35000000,
			WaivedInterest:      45000000,
			NetSettlementAmount: 130000000,
			ApprovalStatus:      "REJECTED",
			RecommendationTier:  "DIRECTOR",
			RecommendedTo:       "Direktur Konsumer",
			ApprovedBy:          "Komite Kredit Wilayah",
			PaymentDueDate:      nil,
			TotalTranches:       1,
			Notes:               "Proposal ditolak karena potongan melebihi batas kewenangan cabang (>40%) dan debitur memiliki aset agunan likuid bernilai tinggi.",
			CreatedAt:           now.AddDate(0, 0, -21),
			UpdatedAt:           now,
		},
		{
			ProposalNo:          "SETTLE-2026-005",
			AgreementNo:         agrs[4%len(agrs)].AgreementNo,
			CustomerID:          agrs[4%len(agrs)].CustomerID,
			SettlementStage:     "STAGE_SCHEDULE",
			SettlementType:      "CHARGE_WISE_SETTLEMENT",
			OriginalOverdue:     38000000,
			WaivedPenalty:       8000000,
			WaivedInterest:      0,
			NetSettlementAmount: 30000000,
			ApprovalStatus:      "PENDING_APPROVAL",
			RecommendationTier:  "COLLECTOR",
			RecommendedTo:       "Field Collector Team Lead",
			ApprovedBy:          "-",
			PaymentDueDate:      &due1,
			TotalTranches:       2,
			Notes:               "Keringanan biaya penagihan dan denda (Waive Penalty Rp 8 Jt), pokok dan bunga dibayarkan penuh dalam 2 termin bertahap.",
			CreatedAt:           now.AddDate(0, 0, -2),
			UpdatedAt:           now,
		},
	}

	for _, p := range proposals {
		db.Create(&p)

		// Seed termin tranches untuk masing-masing proposal
		if p.ProposalNo == "SETTLE-2026-001" {
			paidTime := now.AddDate(0, 0, -10)
			db.Create(&models.SettlementTranche{
				SettlementProposalID: p.ID,
				TrancheNo:           1,
				DueDate:             now.AddDate(0, 0, -10),
				Amount:              35000000,
				PaymentMethod:       "ONLINE_VA",
				PaidAmount:          35000000,
				PaidAt:              &paidTime,
				PaymentStatus:       "PAID",
				ReceiptNo:           "STL-RCP-20260910-01",
				CreatedAt:           now.AddDate(0, 0, -12),
				UpdatedAt:           now,
			})
			db.Create(&models.SettlementTranche{
				SettlementProposalID: p.ID,
				TrancheNo:           2,
				DueDate:             now.AddDate(0, 0, 4),
				Amount:              35000000,
				PaymentMethod:       "ONLINE_VA",
				PaidAmount:          0,
				PaymentStatus:       "PENDING",
				ReceiptNo:           "",
				CreatedAt:           now.AddDate(0, 0, -12),
				UpdatedAt:           now,
			})
			db.Create(&models.SettlementTranche{
				SettlementProposalID: p.ID,
				TrancheNo:           3,
				DueDate:             now.AddDate(0, 0, 18),
				Amount:              35000000,
				PaymentMethod:       "ONLINE_VA",
				PaidAmount:          0,
				PaymentStatus:       "PENDING",
				ReceiptNo:           "",
				CreatedAt:           now.AddDate(0, 0, -12),
				UpdatedAt:           now,
			})
		} else if p.ProposalNo == "SETTLE-2026-002" {
			paidTime := now.AddDate(0, 0, -5)
			db.Create(&models.SettlementTranche{
				SettlementProposalID: p.ID,
				TrancheNo:           1,
				DueDate:             now.AddDate(0, 0, -5),
				Amount:              45000000,
				PaymentMethod:       "CASH",
				PaidAmount:          45000000,
				PaidAt:              &paidTime,
				PaymentStatus:       "PAID",
				ReceiptNo:           "STL-RCP-20260914-02",
				CreatedAt:           now.AddDate(0, 0, -8),
				UpdatedAt:           now,
			})
		} else if p.ProposalNo == "SETTLE-2026-003" {
			db.Create(&models.SettlementTranche{
				SettlementProposalID: p.ID,
				TrancheNo:           1,
				DueDate:             now.AddDate(0, 0, 7),
				Amount:              42500000,
				PaymentMethod:       "ONLINE_VA",
				PaidAmount:          0,
				PaymentStatus:       "PENDING",
				ReceiptNo:           "",
				CreatedAt:           now.AddDate(0, 0, -4),
				UpdatedAt:           now,
			})
			db.Create(&models.SettlementTranche{
				SettlementProposalID: p.ID,
				TrancheNo:           2,
				DueDate:             now.AddDate(0, 0, 21),
				Amount:              42500000,
				PaymentMethod:       "ONLINE_VA",
				PaidAmount:          0,
				PaymentStatus:       "PENDING",
				ReceiptNo:           "",
				CreatedAt:           now.AddDate(0, 0, -4),
				UpdatedAt:           now,
			})
		} else if p.ProposalNo == "SETTLE-2026-005" {
			db.Create(&models.SettlementTranche{
				SettlementProposalID: p.ID,
				TrancheNo:           1,
				DueDate:             now.AddDate(0, 0, 10),
				Amount:              15000000,
				PaymentMethod:       "QRIS",
				PaidAmount:          0,
				PaymentStatus:       "PENDING",
				ReceiptNo:           "",
				CreatedAt:           now.AddDate(0, 0, -2),
				UpdatedAt:           now,
			})
			db.Create(&models.SettlementTranche{
				SettlementProposalID: p.ID,
				TrancheNo:           2,
				DueDate:             now.AddDate(0, 0, 24),
				Amount:              15000000,
				PaymentMethod:       "QRIS",
				PaidAmount:          0,
				PaymentStatus:       "PENDING",
				ReceiptNo:           "",
				CreatedAt:           now.AddDate(0, 0, -2),
				UpdatedAt:           now,
			})
		}
	}
	log.Println("Settlement proposals with 6-stage lifecycle & multi-tranches successfully seeded.")
}

func SeedSkipTracingCases(db *gorm.DB) {
	var count int64
	db.Model(&models.SkipTracingCase{}).Count(&count)
	if count > 0 {
		return
	}

	var agrs []models.Agreement
	db.Preload("Customer").Limit(10).Find(&agrs)
	if len(agrs) == 0 {
		return
	}

	now := time.Now()

	skipCases := []models.SkipTracingCase{
		{
			CaseNo:        "SKIP-2026-001",
			AgreementNo:   agrs[0].AgreementNo,
			CustomerID:    agrs[0].CustomerID,
			TracerPIC:     "Dimas Kurniawan (Field Investigator)",
			TracingStatus: "FOUND",
			NewPhone:      "0813-8899-7711",
			NewAddress:    "Graha Mandiri Lt. 8, Jl. Imam Bonjol No. 61, Menteng, Jakarta Pusat",
			NewEmployer:   "PT Logistik Nusantara Sejahtera",
			SourceInfo:    "DUKCAPIL & MUTASI_CASA",
			Notes:         "Berhasil melacak alamat kantor baru dan nomor telepon aktif melalui mutasi transaksi payroll dan data kependudukan.",
			CreatedAt:     now.AddDate(0, 0, -18),
			UpdatedAt:     now,
		},
		{
			CaseNo:        "SKIP-2026-002",
			AgreementNo:   agrs[1%len(agrs)].AgreementNo,
			CustomerID:    agrs[1%len(agrs)].CustomerID,
			TracerPIC:     "Rian Hidayat (Skip Tracer)",
			TracingStatus: "IN_PROGRESS",
			NewPhone:      "0821-4455-9012 (Nomor Kerabat)",
			NewAddress:    "Ruko Duta Mas Blok B-12, Fatmawati, Jakarta Selatan",
			NewEmployer:   "CV Mitra Abadi Sentosa",
			SourceInfo:    "EMERGENCY_CONTACT",
			Notes:         "Kontak darurat berhasil dihubungi. Saudara kandung mengkonfirmasi alamat usaha baru di Fatmawati, tim survei menjadwalkan kunjungan.",
			CreatedAt:     now.AddDate(0, 0, -9),
			UpdatedAt:     now,
		},
		{
			CaseNo:        "SKIP-2026-003",
			AgreementNo:   agrs[2%len(agrs)].AgreementNo,
			CustomerID:    agrs[2%len(agrs)].CustomerID,
			TracerPIC:     "Dimas Kurniawan (Field Investigator)",
			TracingStatus: "ASSIGNED",
			NewPhone:      "",
			NewAddress:    "",
			NewEmployer:   "",
			SourceInfo:    "FIELD_SURVEY",
			Notes:         "Penugasan pelacakan baru setelah surat peringatan fisik returned to sender (RTS). Debitur tidak berada di domisili KTP.",
			CreatedAt:     now.AddDate(0, 0, -3),
			UpdatedAt:     now,
		},
		{
			CaseNo:        "SKIP-2026-004",
			AgreementNo:   agrs[3%len(agrs)].AgreementNo,
			CustomerID:    agrs[3%len(agrs)].CustomerID,
			TracerPIC:     "Rian Hidayat (Skip Tracer)",
			TracingStatus: "UNTRACEABLE",
			NewPhone:      "",
			NewAddress:    "",
			NewEmployer:   "",
			SourceInfo:    "DUKCAPIL & SOCIAL_MEDIA",
			Notes:         "Investigasi di domisili lama, RT/RW, dan tempat kerja lama nihil. Direkomendasikan naik ke tahap Somasi Publikasi Surat Kabar.",
			CreatedAt:     now.AddDate(0, 0, -30),
			UpdatedAt:     now,
		},
	}

	for _, sc := range skipCases {
		db.Create(&sc)
	}
	log.Println("Skip Tracing cases successfully seeded.")
}

func SeedGeoTrackerData(db *gorm.DB) {
	var count int64
	db.Model(&models.CollectorGeoLocation{}).Count(&count)
	if count > 0 {
		return
	}

	now := time.Now()

	collectors := []models.CollectorGeoLocation{
		{
			CollectorUsername:   "field_rso_1",
			CollectorName:       "Budi Santoso (RSO - Jakarta Pusat)",
			AgencyName:          "Internal Field Force - Jakarta Area",
			CurrentLat:          -6.195042,
			CurrentLng:          106.823145,
			AccuracyMeters:      6.5,
			Status:              "VISITING",
			CurrentLocationName: "Menara Thamrin Lt. 12, Jl. MH Thamrin No. 9, Jakarta Pusat",
			LastHeartbeat:       now.Add(-3 * time.Minute),
			TodayVisitsCount:    6,
			TodayIdleMinutes:    18,
			TodaySpentMinutes:   45,
			TransitTimeMinutes:  52,
			AnomalyFlag:         false,
			AnomalyReason:       "",
			BatteryPct:          78,
			CreatedAt:           now.AddDate(0, 0, -1),
			UpdatedAt:           now,
		},
		{
			CollectorUsername:   "field_fro_1",
			CollectorName:       "Rian Pratama (FRO - Jakarta Selatan)",
			AgencyName:          "Internal Field Force - Jakarta Area",
			CurrentLat:          -6.225381,
			CurrentLng:          106.800185,
			AccuracyMeters:      8.2,
			Status:              "IN_TRANSIT",
			CurrentLocationName: "Jl. Senopati Menuju Sudirman Kav. 52, SCBD",
			LastHeartbeat:       now.Add(-1 * time.Minute),
			TodayVisitsCount:    5,
			TodayIdleMinutes:    25,
			TodaySpentMinutes:   30,
			TransitTimeMinutes:  40,
			AnomalyFlag:         false,
			AnomalyReason:       "",
			BatteryPct:          64,
			CreatedAt:           now.AddDate(0, 0, -1),
			UpdatedAt:           now,
		},
		{
			CollectorUsername:   "agency_col_1",
			CollectorName:       "Hendra Wijaya (Collector Mitra Prima)",
			AgencyName:          "PT Mitra Prima Solusindo",
			CurrentLat:          -6.168341,
			CurrentLng:          106.786520,
			AccuracyMeters:      12.0,
			Status:              "IDLE",
			CurrentLocationName: "Rest Area Jl. Kyai Tapa, Grogol, Jakarta Barat",
			LastHeartbeat:       now.Add(-8 * time.Minute),
			TodayVisitsCount:    3,
			TodayIdleMinutes:    135,
			TodaySpentMinutes:   20,
			TransitTimeMinutes:  35,
			AnomalyFlag:         true,
			AnomalyReason:       "Durasi IDLE melampaui batas wajar (>120 menit) tanpa aktivitas penagihan di lapangan",
			BatteryPct:          89,
			CreatedAt:           now.AddDate(0, 0, -1),
			UpdatedAt:           now,
		},
		{
			CollectorUsername:   "field_fro_2",
			CollectorName:       "Doni Setiawan (FRO - Jakarta Timur)",
			AgencyName:          "Internal Field Force - Jakarta Area",
			CurrentLat:          -6.215284,
			CurrentLng:          106.870321,
			AccuracyMeters:      5.0,
			Status:              "VISITING",
			CurrentLocationName: "Ruko Matraman Raya No. 42, Jatinegara, Jakarta Timur",
			LastHeartbeat:       now.Add(-2 * time.Minute),
			TodayVisitsCount:    8,
			TodayIdleMinutes:    12,
			TodaySpentMinutes:   55,
			TransitTimeMinutes:  60,
			AnomalyFlag:         false,
			AnomalyReason:       "",
			BatteryPct:          91,
			CreatedAt:           now.AddDate(0, 0, -1),
			UpdatedAt:           now,
		},
	}

	for _, c := range collectors {
		db.Create(&c)
	}

	// Seed titik rute perjalanan harian (Location History & Animated Route) untuk "field_rso_1"
	routePoints := []models.CollectorRoutePoint{
		{
			CollectorUsername: "field_rso_1",
			SequenceOrder:     1,
			Lat:               -6.181820,
			Lng:               106.828450,
			LocationName:      "Check-in Kantor Cabang Utama Thamrin (Start Duty)",
			ActivityType:      "CHECKIN",
			AgreementNo:       "",
			DebtorName:        "",
			RecordedAt:        now.Add(-4 * time.Hour),
			DurationMinutes:   15,
			SpeedKmh:          0,
			Notes:             "Briefing target penagihan debitur area Menteng & Kebon Sirih",
		},
		{
			CollectorUsername: "field_rso_1",
			SequenceOrder:     2,
			Lat:               -6.185200,
			Lng:               106.823900,
			LocationName:      "Jl. Sabang No. 18, Menteng (Kunjungan Lapangan 1)",
			ActivityType:      "PTP",
			AgreementNo:       "BANK-KPR-2025-108191",
			DebtorName:        "Dr. Ratna Juwita",
			RecordedAt:        now.Add(-3 * time.Hour),
			DurationMinutes:   25,
			SpeedKmh:          28.5,
			Notes:             "Bertemu debitur langsung. Janji bayar PTP via m-Banking sebelum pk 17:00",
		},
		{
			CollectorUsername: "field_rso_1",
			SequenceOrder:     3,
			Lat:               -6.191240,
			Lng:               106.822100,
			LocationName:      "Jl. Sunda No. 5, Kebon Sirih (Kunjungan Lapangan 2)",
			ActivityType:      "PAYMENT",
			AgreementNo:       "BANK-KMK-2025-103829",
			DebtorName:        "Ir. Hendra Gunawan",
			RecordedAt:        now.Add(-2 * time.Hour),
			DurationMinutes:   20,
			SpeedKmh:          32.0,
			Notes:             "Penerimaan pembayaran tunai angsuran Rp 6.800.000 (Kuitansi digital PIS diterbitkan)",
		},
		{
			CollectorUsername: "field_rso_1",
			SequenceOrder:     4,
			Lat:               -6.195042,
			Lng:               106.823145,
			LocationName:      "Menara Thamrin Lt. 12, Kebon Sirih (Kunjungan Lapangan 3 - Current)",
			ActivityType:      "CHECKIN",
			AgreementNo:       "BANK-KTA-2025-104920",
			DebtorName:        "Kurnia Pratama",
			RecordedAt:        now.Add(-30 * time.Minute),
			DurationMinutes:   18,
			SpeedKmh:          15.0,
			Notes:             "Negosiasi penyelesaian tunggakan 45 DPD, debitur minta keringanan denda",
		},
	}

	for _, rp := range routePoints {
		db.Create(&rp)
	}

	log.Println("GeoTracker collectors and daily route history successfully seeded.")
}

func SeedMCollectData(db *gorm.DB) {
	var count int64
	db.Model(&models.PaymentReceiptSlip{}).Count(&count)
	if count > 0 {
		return
	}

	var agrs []models.Agreement
	db.Preload("Customer").Limit(5).Find(&agrs)
	if len(agrs) == 0 {
		return
	}

	now := time.Now()

	slips := []models.PaymentReceiptSlip{
		{
			ReceiptNo:         "PIS-20260920-0081",
			AgreementNo:       agrs[0].AgreementNo,
			CustomerID:        agrs[0].CustomerID,
			AmountPaid:        6800000,
			PaymentMethod:     "CASH",
			TrancheNumber:     1,
			CollectorUsername: "field_rso_1",
			CollectorName:     "Budi Santoso (RSO)",
			ReceiptURL:        "/api/v1/mcollect/receipts/PIS-20260920-0081",
			WhatsAppSent:      true,
			GeotagLat:         -6.191240,
			GeotagLng:         106.822100,
			Notes:             "Penerimaan tunai di lokasi kantor debitur. Lembar kuitansi PIS digital dan SMS/WA tanda terima telah terkirim.",
			IssuedAt:          now.Add(-2 * time.Hour),
		},
		{
			ReceiptNo:         "PIS-20260921-0094",
			AgreementNo:       agrs[1%len(agrs)].AgreementNo,
			CustomerID:        agrs[1%len(agrs)].CustomerID,
			AmountPaid:        12500000,
			PaymentMethod:     "QRIS",
			TrancheNumber:     1,
			CollectorUsername: "field_fro_1",
			CollectorName:     "Rian Pratama (FRO)",
			ReceiptURL:        "/api/v1/mcollect/receipts/PIS-20260921-0094",
			WhatsAppSent:      true,
			GeotagLat:         -6.225381,
			GeotagLng:         106.800185,
			Notes:             "Pembayaran via scan QRIS dinamis di aplikasi mCollect saat penagihan lapangan.",
			IssuedAt:          now.AddDate(0, 0, -1),
		},
		{
			ReceiptNo:         "PIS-20260922-0105",
			AgreementNo:       agrs[2%len(agrs)].AgreementNo,
			CustomerID:        agrs[2%len(agrs)].CustomerID,
			AmountPaid:        4200000,
			PaymentMethod:     "ONLINE_VA",
			TrancheNumber:     1,
			CollectorUsername: "field_fro_2",
			CollectorName:     "Doni Setiawan (FRO)",
			ReceiptURL:        "/api/v1/mcollect/receipts/PIS-20260922-0105",
			WhatsAppSent:      false,
			GeotagLat:         -6.215284,
			GeotagLng:         106.870321,
			Notes:             "Debitur melunasi via Virtual Account bank setelah tautan bayar diterbitkan oleh kolektor.",
			IssuedAt:          now.AddDate(0, 0, -2),
		},
	}

	for _, s := range slips {
		db.Create(&s)
	}
	log.Println("mCollect digital payment receipts (PIS) successfully seeded.")
}

func SeedAgenciesAndDelegations(db *gorm.DB) {
	var count int64
	db.Model(&models.CollectionAgency{}).Count(&count)
	if count > 0 {
		return
	}

	now := time.Now()
	expiry1 := now.AddDate(1, 6, 0)
	expiry2 := now.AddDate(1, 0, 0)
	expiry3 := now.AddDate(0, 10, 0)

	agencies := []models.CollectionAgency{
		{
			AgencyCode:            "AGY-MPS-01",
			AgencyName:            "PT Mitra Prima Solusindo",
			ContractNo:            "KTR/COLL/2025/088",
			LicenseExpiry:         &expiry1,
			ActiveCollectorsCount: 18,
			AssignedAccountsCount: 45,
			RecoveryRate:          92.4,
			CommissionRate:        8.5,
			ContactPerson:         "Irfan Bachdim (Operations Head)",
			Phone:                 "021-57901122",
			Status:                "ACTIVE",
			CreatedAt:             now.AddDate(0, -6, 0),
			UpdatedAt:             now,
		},
		{
			AgencyCode:            "AGY-SST-02",
			AgencyName:            "PT Sentra Solusi Tagih Nusantara",
			ContractNo:            "KTR/COLL/2025/112",
			LicenseExpiry:         &expiry2,
			ActiveCollectorsCount: 24,
			AssignedAccountsCount: 60,
			RecoveryRate:          88.1,
			CommissionRate:        9.0,
			ContactPerson:         "Rahmat Hidayat (General Manager)",
			Phone:                 "021-83709944",
			Status:                "ACTIVE",
			CreatedAt:             now.AddDate(0, -4, 0),
			UpdatedAt:             now,
		},
		{
			AgencyCode:            "AGY-GSF-03",
			AgencyName:            "PT Garda Solutif Finansial",
			ContractNo:            "KTR/COLL/2026/015",
			LicenseExpiry:         &expiry3,
			ActiveCollectorsCount: 12,
			AssignedAccountsCount: 30,
			RecoveryRate:          85.0,
			CommissionRate:        10.0,
			ContactPerson:         "Denny Sumargo (Agency Director)",
			Phone:                 "021-29557788",
			Status:                "ACTIVE",
			CreatedAt:             now.AddDate(0, -2, 0),
			UpdatedAt:             now,
		},
	}

	for _, a := range agencies {
		db.Create(&a)
	}

	// Seed delegasi wewenang (Out of Office Enablement)
	delegations := []models.AuthorityDelegation{
		{
			DelegatorUsername:   "ar_head",
			DelegatorName:       "Ahmad Fauzi (AR Head Wilayah)",
			DelegateUsername:    "sro_bambang",
			DelegateName:        "Bambang Setyadi (Senior Remedial Officer)",
			StartDate:           now.AddDate(0, 0, -2),
			EndDate:             now.AddDate(0, 0, 12),
			ApprovalLimitAmount: 100000000,
			Reason:              "Cuti Tahunan / Out-of-Office: Pelimpahan hak persetujuan diskon kompromi settlement & jadwal restrukturisasi limit s.d Rp 100 Juta",
			IsActive:            true,
			CreatedAt:           now.AddDate(0, 0, -2),
			UpdatedAt:           now,
		},
	}

	for _, d := range delegations {
		db.Create(&d)
	}

	log.Println("External collection agencies and authority delegations successfully seeded.")
}

func SeedCollectorFeatures(db *gorm.DB) {
	// 1. Seed Incentive Rules
	var ruleCount int64
	db.Model(&models.CollectorIncentiveRule{}).Count(&ruleCount)
	if ruleCount == 0 {
		rules := []models.CollectorIncentiveRule{
			{
				MinFlowRate: 0,
				MaxFlowRate: 9.99,
				StatusLabel: "Sangat Bagus",
				Modifier:    1.2,
				Description: "Faktor Pengali: 1.2 (Insentif naik 20%)",
				OrderIndex:  1,
			},
			{
				MinFlowRate: 10.0,
				MaxFlowRate: 15.0,
				StatusLabel: "Memenuhi Target",
				Modifier:    1.0,
				Description: "Faktor Pengali: 1.0 (Insentif utuh 100%)",
				OrderIndex:  2,
			},
			{
				MinFlowRate: 15.1,
				MaxFlowRate: 20.0,
				StatusLabel: "Buruk",
				Modifier:    0.8,
				Description: "Faktor Pengurang: 0.8 (Insentif dipotong 20%)",
				OrderIndex:  3,
			},
			{
				MinFlowRate: 20.1,
				MaxFlowRate: 100.0,
				StatusLabel: "Sangat Buruk",
				Modifier:    0.5,
				Description: "Faktor Pengurang: 0.5 (Insentif dipotong 50%)",
				OrderIndex:  4,
			},
		}
		for _, r := range rules {
			db.Create(&r)
		}
		log.Println("Collector incentive rules seeded successfully.")
	}

	// 2. Seed Collector Daily Plan (Today's Plan)
	var planCount int64
	todayStr := time.Now().Format("2006-01-02")
	db.Model(&models.CollectorDailyPlan{}).Where("plan_date = ?", todayStr).Count(&planCount)
	if planCount == 0 {
		var accounts []models.OverdueAccount
		db.Limit(6).Find(&accounts)
		if len(accounts) >= 3 {
			now := time.Now()
			plans := []models.CollectorDailyPlan{
				{
					PlanDate:          todayStr,
					CollectorUsername: "andi",
					CollectorName:     "Andi Pratama",
					AgreementNo:       accounts[0].AgreementNo,
					OverdueAccountID:  accounts[0].ID,
					Priority:          "HIGH",
					Status:            "VISITED",
					RouteOrder:        1,
					EstimatedTime:     "09:00 WIB",
					Notes:             "Kunjungan ke alamat rumah debitur. Debitur berjanji melunasi sore ini.",
					CreatedAt:         now,
					UpdatedAt:         now,
				},
				{
					PlanDate:          todayStr,
					CollectorUsername: "andi",
					CollectorName:     "Andi Pratama",
					AgreementNo:       accounts[1].AgreementNo,
					OverdueAccountID:  accounts[1].ID,
					Priority:          "MEDIUM",
					Status:            "PLANNED",
					RouteOrder:        2,
					EstimatedTime:     "11:00 WIB",
					Notes:             "Follow-up angsuran tertunggak 18 DPD.",
					CreatedAt:         now,
					UpdatedAt:         now,
				},
				{
					PlanDate:          todayStr,
					CollectorUsername: "field_rso_1",
					CollectorName:     "Budi Santoso",
					AgreementNo:       accounts[2].AgreementNo,
					OverdueAccountID:  accounts[2].ID,
					Priority:          "HIGH",
					Status:            "PTP",
					RouteOrder:        1,
					EstimatedTime:     "09:30 WIB",
					Notes:             "Debitur sepakat PTP tanggal 28 dengan komitmen transfer bank.",
					CreatedAt:         now,
					UpdatedAt:         now,
				},
			}
			for _, p := range plans {
				db.Create(&p)
			}
			log.Println("Collector daily plan seeded successfully.")
		}
	}

	// 3. Seed Reassignment Logs
	var logCount int64
	db.Model(&models.CollectorReassignmentLog{}).Count(&logCount)
	if logCount == 0 {
		var accounts []models.OverdueAccount
		db.Limit(2).Find(&accounts)
		if len(accounts) >= 2 {
			now := time.Now()
			logs := []models.CollectorReassignmentLog{
				{
					AgreementNo:      accounts[0].AgreementNo,
					OverdueAccountID: accounts[0].ID,
					FromCollector:    "field_fro_2",
					ToCollector:      "andi",
					Reason:           "AREA_ROTATION",
					Notes:            "Penyesuaian zonasi domisili penagihan wilayah Jakarta Pusat ke Andi Pratama",
					ReassignedBy:     "Bambang Wijaya (AR Head)",
					ReassignedAt:     now.AddDate(0, 0, -1),
				},
				{
					AgreementNo:      accounts[1].AgreementNo,
					OverdueAccountID: accounts[1].ID,
					FromCollector:    "collector",
					ToCollector:      "field_rso_1",
					Reason:           "OVERLOAD",
					Notes:            "Pemerataan beban kerja penagihan Bucket 2 kepada petugas RSO",
					ReassignedBy:     "Bambang Wijaya (AR Head)",
					ReassignedAt:     now.Add(-6 * time.Hour),
				},
			}
			for _, l := range logs {
				db.Create(&l)
			}
			log.Println("Collector reassignment audit logs seeded successfully.")
		}
	}
}

