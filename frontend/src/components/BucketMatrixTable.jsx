import React from 'react';
import { Users, Info, Sparkles, Filter } from 'lucide-react';

export default function BucketMatrixTable({ matrixData, onSelectCell, selectedCell, generalSimbolPT, generalNamaPT }) {
  const buckets = ['1-3', '4-7', '8-13', '14-18', '19-25', '26-30', '31-60', '61-150', '> 150'];
  const earlyBuckets = ['1-3', '4-7', '8-13', '14-18', '19-25', '26-30'];
  const grades = ['1', '2', '3', '4', '5', '6', '7', '8'];

  // Helper untuk mengambil data sel dari API matrix
  const getCell = (grade, bucket) => {
    if (!matrixData) return { expected_pic: '-', account_count: 0, total_overdue: 0 };
    const found = matrixData.find(m => m.action_path === grade && m.bucket === bucket);
    return found || { expected_pic: '-', account_count: 0, total_overdue: 0 };
  };

  // Helper total akun di blok Senior Field Collector (31-60, 61-150, > 150 untuk Grade 1-8)
  const getSeniorFieldCollectorTotalAccounts = () => {
    if (!matrixData) return 0;
    const lateBuckets = ['31-60', '61-150', '> 150'];
    return matrixData
      .filter(m => grades.includes(m.action_path) && lateBuckets.includes(m.bucket))
      .reduce((sum, curr) => sum + (curr.account_count || 0), 0);
  };

  // Helper total akun di blok VIP (Special Team)
  const getVIPTotalAccounts = () => {
    if (!matrixData) return 0;
    return matrixData
      .filter(m => m.action_path === 'VIP')
      .reduce((sum, curr) => sum + (curr.account_count || 0), 0);
  };

  // Definisi hardcoded warna dan label sesuai gambar 2 (configurable di masa depan)
  const getCellConfig = (grade, bucket) => {
    // Grade 1
    if (grade === '1') {
      if (bucket === '1-3') return { label: 'Robot', color: 'bg-[#98D8AA] text-slate-900 border-emerald-300' };
      return { label: 'DC', color: 'bg-[#98D8AA] text-slate-900 border-emerald-300' };
    }
    // Grade 2
    if (grade === '2') {
      if (bucket === '1-3') return { label: 'Robot', color: 'bg-[#98D8AA] text-slate-900 border-emerald-300' };
      return { label: 'DC', color: 'bg-[#98D8AA] text-slate-900 border-emerald-300' };
    }
    // Grade 3
    if (grade === '3') {
      if (bucket === '1-3') return { label: 'WA', color: 'bg-[#98D8AA] text-slate-900 border-emerald-300' };
      if (bucket === '4-7' || bucket === '8-13') return { label: 'Robot', color: 'bg-[#98D8AA] text-slate-900 border-emerald-300' };
      return { label: 'DC', color: 'bg-[#98D8AA] text-slate-900 border-emerald-300' };
    }
    // Grade 4
    if (grade === '4') {
      if (bucket === '1-3') return { label: 'WA', color: 'bg-[#98D8AA] text-slate-900 border-emerald-300' };
      if (bucket === '4-7') return { label: 'Robot', color: 'bg-[#98D8AA] text-slate-900 border-emerald-300' };
      return { label: 'DC', color: 'bg-[#98D8AA] text-slate-900 border-emerald-300' };
    }
    // Grade 5
    if (grade === '5') {
      if (bucket === '1-3' || bucket === '4-7') return { label: 'DC', color: 'bg-[#98D8AA] text-slate-900 border-emerald-300' };
      return { label: 'FC', color: 'bg-[#FEF08A] text-slate-900 border-yellow-300' };
    }
    // Grade 6
    if (grade === '6') {
      if (bucket === '1-3') return { label: 'DC', color: 'bg-[#98D8AA] text-slate-900 border-emerald-300' };
      return { label: 'FC', color: 'bg-[#FEF08A] text-slate-900 border-yellow-300' };
    }
    // Grade 7
    if (grade === '7') {
      if (['1-3', '4-7', '8-13', '14-18'].includes(bucket)) return { label: 'FC', color: 'bg-[#FEF08A] text-slate-900 border-yellow-300' };
      return { label: 'SFC', color: 'bg-[#F6AD7B] text-slate-900 border-orange-300' };
    }
    // Grade 8
    if (grade === '8') {
      if (['1-3', '4-7'].includes(bucket)) return { label: 'FC', color: 'bg-[#FEF08A] text-slate-900 border-yellow-300' };
      return { label: 'SFC', color: 'bg-[#F6AD7B] text-slate-900 border-orange-300' };
    }

    return { label: '-', color: 'bg-slate-100 text-slate-800' };
  };

  const isSeniorFieldSelected = selectedCell?.isSeniorField;
  const isVIPSelected = selectedCell?.actionPath === 'VIP';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3.5 sm:p-6 mb-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-8 bg-[#0F5132] rounded-xs shrink-0"></div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Collection Bucket Matrix <span className="text-[#0F5132] font-extrabold">– {generalNamaPT || 'PT AAA'} ({generalSimbolPT || 'AAA'})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Matriks Penugasan Koleksi Berdasarkan Grade Risiko dan Hari Keterlambatan (DPD)
            </p>
          </div>
        </div>

        {/* Status Indikator */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-300">
            DPD 1–30: Decision Engine
          </span>
          <span className="text-slate-400">&rarr;</span>
          <span className="px-2.5 py-1 rounded bg-orange-50 text-orange-800 font-bold border border-orange-300">
            DPD &gt; 30: Senior Field
          </span>
        </div>
      </div>

      {/* Mobile Scroll Hint */}
      <div className="flex sm:hidden items-center justify-between text-[11px] text-slate-500 mb-2 px-1">
        <span>👈 Geser tabel ke kanan/kiri 👉</span>
        <span className="font-semibold text-emerald-700">10 Kolom Bucket</span>
      </div>

      {/* Tabel Matriks Persis Gambar 2 */}
      <div className="overflow-x-auto shadow-sm rounded-lg border-2 border-[#0F5132] w-full">
        <table className="w-full border-collapse text-center min-w-[720px]">
          <thead>
            {/* Header Hijau Gelap sesuai Image 2 */}
            <tr className="bg-[#0F5132] text-white font-extrabold text-sm border-b-2 border-[#0F5132]">
              <th className="border-r-2 border-emerald-700/60 px-4 py-3 w-28 text-base tracking-wide">
                Grade
              </th>
              {buckets.map((b) => (
                <th key={b} className="border-r border-emerald-700/60 px-2 py-3 min-w-[76px] font-black text-sm">
                  {b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grades.map((grade, index) => {
              return (
                <tr key={grade} className="border-b border-slate-300 font-bold text-xs h-10">
                  {/* Kolom Grade */}
                  <td className="border-r-2 border-[#0F5132] font-black text-base text-[#0F5132] bg-white">
                    {grade}
                  </td>

                  {/* 6 Kolom Awal: 1-3, 4-7, 8-13, 14-18, 19-25, 26-30 */}
                  {earlyBuckets.map((bucket) => {
                    const cfg = getCellConfig(grade, bucket);
                    const cell = getCell(grade, bucket);
                    const isSelected = selectedCell?.actionPath === grade && selectedCell?.bucket === bucket;
                    const count = cell.account_count || 0;

                    return (
                      <td
                        key={bucket}
                        onClick={() => onSelectCell({ actionPath: grade, bucket, cellData: cell, pic: cfg.label })}
                        className={`border-r border-slate-300 px-1 py-1 cursor-pointer transition select-none relative ${cfg.color} ${
                          isSelected ? 'ring-4 ring-indigo-600 scale-[1.03] z-20 shadow-md font-black' : 'hover:opacity-90'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <span className="font-extrabold text-xs">{cfg.label}</span>
                          {count > 0 && (
                            <span className="mt-0.5 px-1.5 py-0.1 text-[9px] font-bold rounded-full bg-slate-900 text-white shadow-2xs">
                              {count}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}

                  {/* 3 Kolom Akhir (31-60, 61-150, > 150): Merged 1 Cell untuk Baris 1-8 */}
                  {index === 0 && (
                    <td
                      rowSpan={8}
                      colSpan={3}
                      onClick={() => onSelectCell({ actionPath: 'ALL_SENIOR', bucket: '31+', isSeniorField: true })}
                      className={`border-l border-slate-300 px-4 py-6 cursor-pointer select-none transition bg-[#F6AD7B] hover:bg-[#F29F68] text-slate-950 font-black text-center text-sm md:text-base ${
                        isSeniorFieldSelected ? 'ring-4 ring-orange-600 z-20 shadow-xl' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <span className="tracking-wide uppercase font-black text-base text-slate-900">
                          Senior Field Collector
                        </span>
                        <span className="text-[11px] font-bold text-orange-950/80 bg-orange-200/80 px-2 py-0.5 rounded-full">
                          Keterlambatan DPD &gt; 30 (31-60, 61-150, &gt; 150)
                        </span>
                        {getSeniorFieldCollectorTotalAccounts() > 0 && (
                          <span className="px-2.5 py-1 text-xs font-black rounded-full bg-slate-950 text-white shadow-sm">
                            {getSeniorFieldCollectorTotalAccounts()} Akun Ditugaskan
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}

            {/* Baris VIP: Merged across 9 columns (Special Team) */}
            <tr className="border-t-2 border-[#0F5132] font-bold text-xs h-11">
              <td className="border-r-2 border-[#0F5132] font-black text-base text-slate-800 bg-[#E2E8F0]">
                VIP
              </td>
              <td
                colSpan={9}
                onClick={() => onSelectCell({ actionPath: 'VIP', bucket: 'ALL', isVIP: true })}
                className={`px-4 py-2 cursor-pointer select-none transition bg-[#D2DDD6] hover:bg-[#C2CDC6] text-slate-900 font-black text-sm md:text-base ${
                  isVIPSelected ? 'ring-4 ring-purple-600 z-20 shadow-xl' : ''
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="tracking-wider uppercase text-slate-900 font-black">
                    Special Team
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800/10 text-slate-700 rounded-md">
                    Dedicated VIP Treatment (Semua Bucket DPD)
                  </span>
                  {getVIPTotalAccounts() > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-purple-900 text-white">
                      {getVIPTotalAccounts()} Akun VIP
                    </span>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Legend & Penjelasan Kanal Matriks */}
      <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Legend Robot & WA */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center space-x-3">
          <div className="w-9 h-9 rounded-md bg-[#98D8AA] border border-emerald-400 flex items-center justify-center font-black text-xs text-slate-900">
            WA / RB
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Robot & WhatsApp</span>
            <span className="text-[11px] text-slate-600">Automated Bot & Voice Call</span>
          </div>
        </div>

        {/* Legend DC */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center space-x-3">
          <div className="w-9 h-9 rounded-md bg-[#98D8AA] border border-emerald-400 flex items-center justify-center font-black text-xs text-slate-900">
            DC
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Desk Collector (DC)</span>
            <span className="text-[11px] text-slate-600">Tele-collection & Reminder</span>
          </div>
        </div>

        {/* Legend FC */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-3">
          <div className="w-9 h-9 rounded-md bg-[#FEF08A] border border-yellow-400 flex items-center justify-center font-black text-xs text-slate-900">
            FC
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Field Collector (FC)</span>
            <span className="text-[11px] text-slate-600">Kunjungan Langsung Lapangan</span>
          </div>
        </div>

        {/* Legend SFC & Senior Field Collector */}
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center space-x-3">
          <div className="w-9 h-9 rounded-md bg-[#F6AD7B] border border-orange-400 flex items-center justify-center font-black text-xs text-slate-900">
            SFC
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Senior Field Collector</span>
            <span className="text-[11px] text-slate-600">Eskalasi Lanjut & Penanganan Aset</span>
          </div>
        </div>
      </div>
    </div>
  );
}
