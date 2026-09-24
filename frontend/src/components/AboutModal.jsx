import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Server, 
  Cpu, 
  Smartphone, 
  Scale, 
  CheckCircle2, 
  Layers,
  Database
} from 'lucide-react';

export default function AboutModal({ isOpen, onClose, companyInfo }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-emerald-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Emerald Gradient */}
        <div className="bg-gradient-to-r from-[#064E3B] to-[#0A7B58] p-6 text-white rounded-t-3xl relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <span className="text-2xl font-black lowercase tracking-tighter">
                {companyInfo?.simbolPT ? companyInfo.simbolPT.toLowerCase() : 'crm'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  CRMS Banking System
                </h3>
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-emerald-950 rounded-full">
                  v2.4 Enterprise
                </span>
              </div>
              <p className="text-emerald-100 text-xs mt-1">
                Collection & Recovery Management System • {companyInfo?.namaPT || 'PT Bank Rakyat Nusantara Tbk'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-slate-700 text-sm">
          {/* Executive Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" /> Ringkasan Platform
            </h4>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              CRMS adalah sistem manajemen penagihan kredit konsumer dan komersial end-to-end terintegrasi. 
              Sistem mencakup modul pemantauan pra-tunggakan (PDM), orkestrasi kanal otomatis melalui AI Decision Engine, 
              aplikasi lapangan kolektor (Collector Workbench & GeoTracker), hingga restrukturisasi hutang, litigasi hukum, 
              dan lelang sita agunan.
            </p>
          </div>

          {/* Core System Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-emerald-600" /> Arsitektur & Mesin Utama
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <Database className="w-4 h-4 text-blue-600" /> Core Banking (CBS) Bridge
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Sinkronisasi EOD batch otomatis, kalkulasi bunga harian, bucket roll rate, dan staging PSAK 71.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <Cpu className="w-4 h-4 text-purple-600" /> Decision Engine (DE)
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Penilaian skor risiko 0-1000, penentuan kanal penanganan otomatis (Desk, Field, Special Asset, Agency).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <Smartphone className="w-4 h-4 text-emerald-600" /> Field Force & Workbench
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Task list cerdas, Today's plan terintegrasi rute GPS, PIS kuitansi digital, dan insentif Bucket Flow Rate.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <Scale className="w-4 h-4 text-amber-600" /> Legal & Remedial Engine
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Alur somasi hukum 6 tahap, eksekusi sita agunan 8 tahap, dan persetujuan settlement bertingkat.
                </p>
              </div>
            </div>
          </div>

          {/* Compliance & Governance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Kepatuhan & Regulasi Perbankan
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> POJK No. 35/POJK.05/2018
              </span>
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Bank Indonesia PADG Perlindungan Konsumen
              </span>
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> UU No. 27/2022 (Perlindungan Data Pribadi)
              </span>
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Standar PSAK 71 / IFRS 9 ECL
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center rounded-b-3xl">
          <span className="text-[11px] text-slate-400">
            Hak Cipta © 2026 {companyInfo?.namaPT || 'PT Bank Rakyat Nusantara Tbk'}. Seluruh hak dilindungi.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
