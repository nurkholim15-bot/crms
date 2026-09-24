import React, { useState } from 'react';
import { runConfinsEOD, resetDemoData } from '../services/api';
import { 
  RefreshCw, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Database, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Zap
} from 'lucide-react';

export default function ConfinsEODSimulator({ onEODComplete, companyInfo }) {
  const [incrementDays, setIncrementDays] = useState('1');
  const [autoCureRatio, setAutoCureRatio] = useState('0.08'); // 8% pembayaran masuk
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [eodLogs, setEodLogs] = useState([]);

  const handleRunEOD = async () => {
    setIsRunning(true);
    setEodLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Memulai batch EOD Core Banking: DPD +${incrementDays} hari, Cure Rate: ${(parseFloat(autoCureRatio) * 100).toFixed(0)}%...`
    ]);

    try {
      const res = await runConfinsEOD({
        increment_days: parseInt(incrementDays),
        auto_cure_ratio: parseFloat(autoCureRatio),
      });

      const resData = res.data.data;
      setLastResult(resData);
      
      setEodLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] EOD Sukses: ${resData.total_processed} akun diproses, ${resData.accounts_cured} akun lunas/cured, ${resData.accounts_advanced} akun bertambah DPD.`,
        `[${new Date().toLocaleTimeString()}] Sinkronisasi Decision Engine selesai. Matrix diperbarui!`
      ]);

      if (onEODComplete) {
        onEODComplete();
      }
    } catch (err) {
      alert('Gagal menjalankan simulasi EOD: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetData = async () => {
    if (window.confirm(`Reset ulang data database ke state awal 55 akun representatif ${companyInfo?.simbolPT || 'CRMS'}?`)) {
      try {
        await resetDemoData();
        alert('Data berhasil di-reset!');
        setLastResult(null);
        setEodLogs([]);
        if (onEODComplete) {
          onEODComplete();
        }
      } catch (err) {
        alert('Gagal reset: ' + err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-red-600/30 text-red-400 rounded-xl shrink-0">
              <RefreshCw className={`w-6 h-6 sm:w-7 sm:h-7 ${isRunning ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black">Core Banking End of Day (EOD) Batch Simulator</h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Simulasi Siklus Pergantian Hari Sistem Inti Perbankan & Re-evaluasi Otomatis Decision Engine
              </p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-auto flex">
          <button
            onClick={handleResetData}
            className="w-full md:w-auto justify-center px-3.5 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            ↻ Reset Sample Data
          </button>
        </div>
      </div>

      {/* 2 Column: Controls & Real-time Batch Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Card */}
        <div className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="font-extrabold text-slate-900 text-base pb-2 border-b border-slate-200 flex items-center">
            <Play className="w-4 h-4 mr-2 text-red-600 fill-red-600" />
            Parameter Eksekusi Batch EOD
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Pertambahan Hari Keterlambatan (DPD Increment)
              </label>
              <select
                value={incrementDays}
                onChange={(e) => setIncrementDays(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 font-semibold"
              >
                <option value="1">+1 Hari (Siklus Harian Standar Core Banking)</option>
                <option value="3">+3 Hari (Simulasi Melewati Akhir Pekan)</option>
                <option value="7">+7 Hari (Simulasi 1 Minggu Penuh)</option>
                <option value="15">+15 Hari (Simulasi Transisi Lonjakan Bucket)</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Semua akun aktif akan bertambah DPD-nya dan di-evaluasi ulang oleh Decision Engine CRMS.
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Estimasi Pembayaran Masuk Harian (Cure Rate Simulation)
              </label>
              <select
                value={autoCureRatio}
                onChange={(e) => setAutoCureRatio(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 font-semibold"
              >
                <option value="0.00">0% (Tidak ada yang membayar - Uji Penuaan Tunggakan)</option>
                <option value="0.08">8% Pembayaran (Kondisi Rata-rata Operasional {companyInfo?.simbolPT || 'CRMS'})</option>
                <option value="0.20">20% Pembayaran (Kondisi Arus Kas Tinggi Awal Bulan)</option>
              </select>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-2">
              <span className="font-bold block text-slate-900 flex items-center">
                <Zap className="w-4 h-4 mr-1.5 text-amber-500" />
                Mekanisme yang Berjalan Selama Batch EOD:
              </span>
              <ul className="text-[11px] text-slate-600 space-y-1.5 pl-4 list-disc font-medium">
                <li>Seluruh akun aktif dievaluasi ulang oleh <strong>Decision Engine CRMS</strong> sesuai Risk Score dan Matriks Action Path.</li>
                <li>Akun yang melintasi <strong>DPD &gt; 30</strong> secara otomatis dialokasikan ke <strong>Field Collector / Senior Field</strong> sesuai matriks Grade.</li>
                <li>Akun nasabah VIP tetap terlindungi di bucket <strong>Special Team (AR Head)</strong> tanpa terpicu auto-blast.</li>
              </ul>
            </div>

            <button
              onClick={handleRunEOD}
              disabled={isRunning}
              className={`w-full py-3 rounded-xl font-extrabold text-sm text-white shadow-lg transition flex items-center justify-center space-x-2 ${
                isRunning ? 'bg-slate-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Memproses Batch EOD Core Banking...' : `Jalankan EOD (+${incrementDays} Hari)`}</span>
            </button>
          </div>
        </div>

        {/* Results & Batch Logs */}
        <div className="lg:col-span-6 space-y-5">
          {/* Last Result Card */}
          {lastResult && (
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-emerald-900 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Hasil Batch Core Banking EOD Terakhir</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
                  <span className="text-slate-400 block text-[10px] font-bold">DIPROSES</span>
                  <strong className="text-slate-900 text-lg">{lastResult.total_processed}</strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
                  <span className="text-emerald-600 block text-[10px] font-bold">LUNAS (CURED)</span>
                  <strong className="text-emerald-700 text-lg">{lastResult.cured_accounts}</strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
                  <span className="text-amber-600 block text-[10px] font-bold">PINDAH BUCKET</span>
                  <strong className="text-amber-700 text-lg">{lastResult.bucket_shifted_count}</strong>
                </div>
              </div>

              <p className="text-[11px] text-emerald-800 font-medium">
                {lastResult.message}
              </p>
            </div>
          )}

          {/* History Log Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
              Riwayat Eksekusi EOD Batch Hari Ini
            </h4>

            {eodLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Belum ada simulasi EOD yang dijalankan pada sesi ini. Tekan tombol merah di samping untuk menjalankan.
              </p>
            ) : (
              <div className="space-y-2">
                {eodLogs.map((log, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">Siklus +{log.days} Hari</span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.timestamp} WIB</span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-600 font-semibold block">{log.cured} Lunas</span>
                      <span className="text-[10px] text-slate-500">{log.shifted} Pindah Bucket</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
