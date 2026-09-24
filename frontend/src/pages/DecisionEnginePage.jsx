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

  const getBucketName = (dpd) => {
    if (dpd <= 0) return '-3-0';
    if (dpd <= 3) return '1-3';
    if (dpd <= 7) return '4-7';
    if (dpd <= 13) return '8-13';
    if (dpd <= 18) return '14-18';
    if (dpd <= 25) return '19-25';
    if (dpd <= 30) return '26-30';
    if (dpd <= 60) return '31-60';
    if (dpd <= 150) return '61-150';
    return '> 150';
  };

  const getHandlingTypeDesc = (risk, bucket, pic) => {
    if (bucket === '> 150') return 'Hard Remedial & NPL Recovery (Litigasi Hukum & Eksekusi Lelang KPKNL)';
    if (bucket === '61-150') return 'Senior Field Collector (Audit Fisik Agunan & Mitigasi Risiko Kredit Macet)';
    if (bucket === '-3-0') return 'Pre-Delinquency Management (Pengawasan H-3 s.d H-0 & Gentle Auto-Reminder)';
    if (risk === 'LOW_RISK') return 'Low Risk (Digital & Non-Field: WhatsApp AutoBot & Smart Robo-Call)';
    if (risk === 'MEDIUM_RISK') return 'Medium Risk (Hybrid Desk & Field: Phone Telephony & Kunjungan Lapangan)';
    return 'High Risk (Intensive Field: Field Collector Sejak DPD Awal & Eskalasi Senior Field)';
  };

  // Fungsi simulasi perhitungan lokal berdasarkan engine rules
  const calculateEvaluation = () => {
    const bucket = getBucketName(simDPD);

    // 1. VIP Rule -> Special Team di semua bucket
    if (simIsVIP) {
      return {
        bucket,
        riskLevel: 'VIP_PORTFOLIO',
        group: 'VIP',
        actionPath: 'VIP',
        assignedPIC: 'Special Team',
        handlingType: 'Dedicated Special Team Handling (AR Head & Priority Banking Assistance)',
        governedBy: 'Decision Engine CRMS (VIP Priority)'
      };
    }

    // 2. Tentukan Risk Level dari Skor (0–1000 Poin)
    let riskLevel = 'HIGH_RISK';
    if (simScore >= 700) riskLevel = 'LOW_RISK';
    else if (simScore >= 450) riskLevel = 'MEDIUM_RISK';

    // 3. Tentukan Action Path (Grade 1 s.d 8)
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

    // Matriks Action Path resmi perbankan (10 Bucket x Grade 1-8 & VIP)
    const matrixLookup = {
      '1': { '-3-0': 'WA', '1-3': 'Robot', '4-7': 'DC', '8-13': 'DC', '14-18': 'DC', '19-25': 'DC', '26-30': 'DC', '31-60': 'FC', '61-150': 'Senior Field Collector', '> 150': 'Remedial' },
      '2': { '-3-0': 'WA', '1-3': 'Robot', '4-7': 'DC', '8-13': 'DC', '14-18': 'DC', '19-25': 'DC', '26-30': 'DC', '31-60': 'FC', '61-150': 'Senior Field Collector', '> 150': 'Remedial' },
      '3': { '-3-0': 'WA', '1-3': 'WA', '4-7': 'Robot', '8-13': 'Robot', '14-18': 'DC', '19-25': 'DC', '26-30': 'DC', '31-60': 'FC', '61-150': 'Senior Field Collector', '> 150': 'Remedial' },
      '4': { '-3-0': 'WA', '1-3': 'WA', '4-7': 'Robot', '8-13': 'DC', '14-18': 'DC', '19-25': 'DC', '26-30': 'DC', '31-60': 'FC', '61-150': 'Senior Field Collector', '> 150': 'Remedial' },
      '5': { '-3-0': 'Robot', '1-3': 'DC', '4-7': 'DC', '8-13': 'FC', '14-18': 'FC', '19-25': 'FC', '26-30': 'FC', '31-60': 'Senior Field Collector', '61-150': 'Senior Field Collector', '> 150': 'Remedial' },
      '6': { '-3-0': 'Robot', '1-3': 'DC', '4-7': 'FC', '8-13': 'FC', '14-18': 'FC', '19-25': 'FC', '26-30': 'FC', '31-60': 'Senior Field Collector', '61-150': 'Senior Field Collector', '> 150': 'Remedial' },
      '7': { '-3-0': 'DC', '1-3': 'FC', '4-7': 'FC', '8-13': 'FC', '14-18': 'FC', '19-25': 'SFC', '26-30': 'SFC', '31-60': 'Senior Field Collector', '61-150': 'Senior Field Collector', '> 150': 'Remedial' },
      '8': { '-3-0': 'DC', '1-3': 'FC', '4-7': 'FC', '8-13': 'SFC', '14-18': 'SFC', '19-25': 'SFC', '26-30': 'SFC', '31-60': 'Senior Field Collector', '61-150': 'Senior Field Collector', '> 150': 'Remedial' },
    };

    const pic = matrixLookup[actionPath]?.[bucket] || (simDPD > 150 ? 'Remedial' : simDPD > 30 ? 'Senior Field Collector' : 'DC');

    return {
      bucket,
      riskLevel,
      group,
      actionPath,
      assignedPIC: pic,
      handlingType: getHandlingTypeDesc(riskLevel, bucket, pic),
      governedBy: 'Decision Engine CRMS'
    };
  };

  const simResult = calculateEvaluation();

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg shrink-0">
              <Cpu className="w-6 h-6" />
            </span>
            <h2 className="text-base sm:text-xl font-black">Decision Engine (DE) & Risk Scoring Hub</h2>
          </div>
          <p className="text-slate-300 text-xs mt-2 max-w-2xl">
            Decision Engine {companyInfo?.simbolPT || 'CRMS'} secara otomatis mengevaluasi seluruh portofolio kredit (Pre-Delinquency DPD -3 s/d 0 hingga DPD &gt; 150) ke dalam kelompok Champion vs Challenger, menentukan Risk Level (0–1000 Poin), serta menugaskan PIC yang paling efektif secara biaya dan hasil di setiap bucket.
          </p>
        </div>
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end space-x-3 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-xs">
          <div className="text-left md:text-right">
            <span className="text-[11px] text-slate-300 block">Status Engine</span>
            <span className="font-extrabold text-emerald-400 text-xs flex items-center md:justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              Aktif & Optimal
            </span>
          </div>
        </div>
      </div>

      {/* 2 Column: Architecture & Interactive Testing Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive DE Simulator */}
        <div className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
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
                <span className="text-sm font-black text-indigo-600">
                  {simDPD <= 0 ? 'DPD 0 (H-3 s.d H-0)' : `${simDPD} Hari`} ({getBucketName(simDPD)})
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="180" 
                value={simDPD} 
                onChange={(e) => setSimDPD(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>DPD -3 s.d 0 (PDM)</span>
                <span className="text-indigo-600 font-bold">DPD 1–30 (Early)</span>
                <span className="text-purple-600 font-bold">DPD 31–150+ (Late & Remedial)</span>
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
              <Layers className="w-4 h-4 mr-2 text-indigo-600" />
              Struktur & Aturan Pemetaan Decision Engine
            </h3>

            {/* Cakupan Penuh Siklus Keterlambatan */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
                Cakupan Penuh Siklus Keterlambatan (End-to-End Bucket)
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Decision Engine CRMS mengevaluasi dan menentukan penugasan PIC secara otomatis di <strong>seluruh 10 bucket keterlambatan</strong>: mulai dari Pre-Delinquency (DPD -3–0), Early Overdue (DPD 1–30), hingga Late Overdue & Remedial (DPD 31–60, 61–150, dan &gt;150).
              </p>
            </div>

            {/* Handling Type by Risk */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                Klasifikasi Handling Type Berdasarkan Skor Risiko (0–1000 Poin)
              </span>
              <ul className="text-[11px] text-slate-600 space-y-1.5 pl-4 list-disc">
                <li><strong>Low Risk (Skor &ge; 700)</strong>: Digital & Non-Field First (WA AutoBot & Smart Robo-Call, hemat 100% biaya kunjungan fisik pada DPD 1–30).</li>
                <li><strong>Medium Risk (Skor 450–699)</strong>: Hybrid (Desk Telephony personal & eskalasi kunjungan Field Officer mCollect pada DPD 4/8+).</li>
                <li><strong>High Risk (Skor &lt; 450)</strong>: Intensive Field (Kunjungan Field Officer sejak DPD 1–18 dan Senior Field pada DPD 8/19+).</li>
              </ul>
            </div>

            {/* VIP Customer */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs space-y-1">
              <span className="font-bold text-purple-900 flex items-center">
                <span className="w-2 h-2 rounded-full bg-purple-600 mr-1.5"></span>
                Protokol Khusus Portofolio VIP
              </span>
              <p className="text-purple-800 text-[11px] leading-relaxed">
                Nasabah berstatus VIP (Priority Banking) langsung dialokasikan ke <strong>Special Team (AR Head)</strong> secara eksklusif di seluruh bucket keterlambatan untuk menjaga reputasi dan hubungan nasabah prima.
              </p>
            </div>

            {/* Sub-Varian A/B Testing */}
            <div className="p-3 bg-indigo-50/70 rounded-lg border border-indigo-200 text-xs space-y-1">
              <span className="font-bold text-indigo-900 flex items-center">
                <span className="w-2 h-2 rounded-full bg-indigo-600 mr-1.5"></span>
                Sub-Varian A/B Testing Eskalasi Waktu
              </span>
              <p className="text-indigo-800 text-[11px] leading-relaxed">
                Pasangan Grade ganjil vs genap (Grade 3 vs 4, Grade 5 vs 6, Grade 7 vs 8) menguji sensitivitas waktu eskalasi kontak (misal: penundaan vs percepatan panggilan telepon / kunjungan lapangan) guna menemukan titik Cure Rate tertinggi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
