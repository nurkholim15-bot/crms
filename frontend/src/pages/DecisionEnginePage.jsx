import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  Sliders, 
  ArrowRight, 
  CheckCircle,
  Zap,
  Split,
  Layers,
  Sparkles
} from 'lucide-react';

export default function DecisionEnginePage({ companyInfo }) {
  // State untuk Interactive DE Simulator
  const [simDPD, setSimDPD] = useState(6);
  const [simScore, setSimScore] = useState(720);
  const [simIsVIP, setSimIsVIP] = useState(false);
  const [simIsChampion, setSimIsChampion] = useState(false);
  const [simVariant, setSimVariant] = useState(1);

  // Fungsi simulasi perhitungan lokal berdasarkan engine rules
  const calculateEvaluation = () => {
    // 1. VIP Rule
    if (simIsVIP) {
      return {
        bucket: getBucketName(simDPD),
        riskLevel: 'VIP_PORTFOLIO',
        group: 'VIP',
        actionPath: 'VIP',
        assignedPIC: 'Special Team',
        handlingType: 'Dedicated Special Team Handling (AR Head & Executive Protocol)',
        governedBy: 'AR Head Protocol'
      };
    }

    const bucket = getBucketName(simDPD);

    // 2. Late Overdue Rule (>30 DPD) -> Senior Field Collector
    if (simDPD > 30) {
      return {
        bucket,
        riskLevel: simScore >= 700 ? 'LOW_RISK' : simScore >= 450 ? 'MEDIUM_RISK' : 'HIGH_RISK',
        group: simIsChampion ? 'CHAMPION' : 'CHALLENGER',
        actionPath: simIsChampion ? '1' : '5',
        assignedPIC: 'Senior Field Collector',
        handlingType: 'Penanganan Lanjutan Senior Field Collector (DPD > 30)',
        governedBy: 'Senior Field Protocol (>30 DPD)'
      };
    }

    // 3. Decision Engine Rule (1-30 DPD)
    let riskLevel = 'HIGH_RISK';
    if (simScore >= 700) riskLevel = 'LOW_RISK';
    else if (simScore >= 450) riskLevel = 'MEDIUM_RISK';

    let actionPath = '5';
    let group = 'CHALLENGER';

    if (simIsChampion) {
      group = 'CHAMPION';
      actionPath = simVariant % 2 === 0 ? '2' : '1';
    } else {
      group = 'CHALLENGER';
      if (riskLevel === 'LOW_RISK') {
        actionPath = simVariant % 2 === 0 ? '4' : '3';
      } else if (riskLevel === 'MEDIUM_RISK') {
        actionPath = simVariant % 2 === 0 ? '6' : '5';
      } else {
        actionPath = simVariant % 2 === 0 ? '8' : '7';
      }
    }

    // Look up PIC from matrix matching Image 2
    const matrixLookup = {
      '1': { '1-3': 'Robot', '4-7': 'DC', '8-13': 'DC', '14-18': 'DC', '19-25': 'DC', '26-30': 'DC' },
      '2': { '1-3': 'Robot', '4-7': 'DC', '8-13': 'DC', '14-18': 'DC', '19-25': 'DC', '26-30': 'DC' },
      '3': { '1-3': 'WA', '4-7': 'Robot', '8-13': 'Robot', '14-18': 'DC', '19-25': 'DC', '26-30': 'DC' },
      '4': { '1-3': 'WA', '4-7': 'Robot', '8-13': 'DC', '14-18': 'DC', '19-25': 'DC', '26-30': 'DC' },
      '5': { '1-3': 'DC', '4-7': 'DC', '8-13': 'FC', '14-18': 'FC', '19-25': 'FC', '26-30': 'FC' },
      '6': { '1-3': 'DC', '4-7': 'FC', '8-13': 'FC', '14-18': 'FC', '19-25': 'FC', '26-30': 'FC' },
      '7': { '1-3': 'FC', '4-7': 'FC', '8-13': 'FC', '14-18': 'FC', '19-25': 'SFC', '26-30': 'SFC' },
      '8': { '1-3': 'FC', '4-7': 'FC', '8-13': 'SFC', '14-18': 'SFC', '19-25': 'SFC', '26-30': 'SFC' },
    };

    const pic = matrixLookup[actionPath]?.[bucket] || 'DC';

    return {
      bucket,
      riskLevel,
      group,
      actionPath,
      assignedPIC: pic,
      handlingType: getHandlingTypeDesc(riskLevel),
      governedBy: 'Decision Engine (DE)'
    };
  };

  const getBucketName = (dpd) => {
    if (dpd <= 3) return '1-3';
    if (dpd <= 7) return '4-7';
    if (dpd <= 13) return '8-13';
    if (dpd <= 18) return '14-18';
    if (dpd <= 25) return '19-25';
    if (dpd <= 30) return '26-30';
    if (dpd <= 60) return '31-60';
    if (dpd <= 150) return '61-150';
    return '>150';
  };

  const getHandlingTypeDesc = (risk) => {
    if (risk === 'LOW_RISK') return 'Low Risk (Digital & Non-Field: WA & Robot Call)';
    if (risk === 'MEDIUM_RISK') return 'Medium Risk (Hybrid Non-Field & Field: DC & FC)';
    return 'High Risk (Field Handling: FC & SFC Kunjungan Lapangan)';
  };

  const simResult = calculateEvaluation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Cpu className="w-6 h-6" />
            </span>
            <h2 className="text-xl font-black">Decision Engine (DE) & Risk Scoring Hub</h2>
          </div>
          <p className="text-slate-300 text-xs mt-2 max-w-2xl">
            Decision Engine {companyInfo?.simbolPT || 'CRMS'} secara otomatis memetakan akun tertunggak fase DPD 1–30 ke dalam kelompok Champion vs Challenger, menentukan Risk Level, serta menugaskan PIC yang paling efektif secara biaya dan hasil.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-xs">
          <div className="text-right">
            <span className="text-[11px] text-slate-300 block">Status Engine</span>
            <span className="font-extrabold text-emerald-400 text-xs flex items-center justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              Aktif & Optimal
            </span>
          </div>
        </div>
      </div>

      {/* 2 Column: Architecture & Interactive Testing Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive DE Simulator */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center">
              <Sliders className="w-5 h-5 mr-2 text-indigo-600" />
              Simulasi Evaluasi Akun (DE Live Tester)
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
              Interactive
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* DPD Slider */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Hari Keterlambatan (DPD):</span>
                <span className="text-sm font-black text-indigo-600">{simDPD} Hari ({getBucketName(simDPD)})</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="180" 
                value={simDPD} 
                onChange={(e) => setSimDPD(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>1 DPD</span>
                <span className="text-indigo-600 font-bold">30 DPD (Batas DE)</span>
                <span>180 DPD (CONFINS)</span>
              </div>
            </div>

            {/* Risk Score Slider */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Skor Risiko Kredit (Behavioral Score):</span>
                <span className="text-sm font-black text-slate-900">{simScore} / 1000</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="950" 
                value={simScore} 
                onChange={(e) => setSimScore(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span className="text-rose-600 font-bold">&lt; 450 (High)</span>
                <span className="text-amber-600 font-bold">450 - 699 (Medium)</span>
                <span className="text-emerald-600 font-bold">&ge; 700 (Low)</span>
              </div>
            </div>

            {/* Options Checkbox */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="flex items-center space-x-2 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
                <input 
                  type="checkbox" 
                  checked={simIsVIP} 
                  onChange={(e) => setSimIsVIP(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="font-bold text-slate-800">Nasabah VIP</span>
              </label>

              <label className="flex items-center space-x-2 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
                <input 
                  type="checkbox" 
                  checked={simIsChampion} 
                  onChange={(e) => setSimIsChampion(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-bold text-slate-800">Grup Champion</span>
              </label>
            </div>
          </div>

          {/* Evaluation Result Output Card */}
          <div className="p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50/50 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-indigo-600" />
              Hasil Evaluasi Decision Engine
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Otoritas Penentu</span>
                <strong className="text-indigo-900 text-xs">{simResult.governedBy}</strong>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Risk Level</span>
                <strong className="text-slate-900 text-xs">{simResult.riskLevel}</strong>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Action Path</span>
                <strong className="text-indigo-700 text-sm">Path {simResult.actionPath} ({simResult.group})</strong>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Assigned PIC</span>
                <span className="inline-block px-2.5 py-0.5 mt-0.5 rounded text-xs font-black bg-slate-900 text-white shadow-2xs">
                  {simResult.assignedPIC}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-indigo-800 bg-white p-2.5 rounded-lg border border-indigo-100 font-medium">
              💡 {simResult.handlingType}
            </p>
          </div>
        </div>

        {/* Right: Rules Specification Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm pb-2 border-b border-slate-200 flex items-center">
              <Layers className="w-4 h-4 mr-2 text-red-600" />
              Struktur & Aturan Pemetaan Decision Engine
            </h3>

            {/* Rule 1: DPD 1-30 vs >30 */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
                1. Batas Wewenang Sistem: DE vs CONFINS
              </span>
              <p className="text-slate-600 text-[11px]">
                Bucket overdue <strong>1–30</strong> ditentukan oleh Decision Engine (DE), sedangkan bucket overdue di atas <strong>30</strong> ditentukan oleh sistem inti CONFINS.
              </p>
            </div>

            {/* Rule 2: Champion vs Challenger */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 flex items-center">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5"></span>
                2. Strategi Champion vs Challenger
              </span>
              <p className="text-slate-600 text-[11px]">
                DE membagi akun menjadi 2 grup: <strong>Champion (Proses Lama EOD CONFINS: AP 1 & 2)</strong> dan <strong>Challenger (Proses Baru Analisis DE: AP 3–8)</strong>.
              </p>
            </div>

            {/* Rule 3: Handling Type by Risk */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                3. Klasifikasi Handling Type Berdasarkan Risk Level
              </span>
              <ul className="text-[11px] text-slate-600 space-y-1 pl-4 list-disc">
                <li><strong>Low Risk (Non-Field Handling)</strong>: WA, Robo Call, Desk Call (AP 3 & 4).</li>
                <li><strong>Medium Risk (Hybrid)</strong>: Mixing Non-Field and Field Officer (AP 1, 2, 5, 6).</li>
                <li><strong>High Risk (Field Handling)</strong>: Field Officer, Field Repossession Officer (AP 7 & 8).</li>
              </ul>
            </div>

            {/* Rule 4: VIP Customer */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs space-y-1">
              <span className="font-bold text-purple-900 flex items-center">
                <span className="w-2 h-2 rounded-full bg-purple-600 mr-1.5"></span>
                4. Protokol Khusus Customer VIP
              </span>
              <p className="text-purple-800 text-[11px]">
                Customer VIP akan langsung masuk ke <strong>bucket AR Head</strong>. PIC Handling customer VIP ditentukan secara eksklusif oleh AR Head.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
