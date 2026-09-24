import React, { useState, useEffect } from 'react';
import { 
  getPDMAccounts, 
  sendPDMReminder 
} from '../services/api';
import { 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  Wallet, 
  Search, 
  RotateCw, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Layers
} from 'lucide-react';

export default function PreDelinquencyView({ onOpenCustomer360 }) {
  const [pdmData, setPdmData] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterReason, setFilterReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchPDM = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterReason) params.trigger = filterReason;
      if (filterStatus) params.status = filterStatus;
      const res = await getPDMAccounts(params);
      setPdmData(res.data.data || []);
      setMetrics(res.data.metrics || null);
    } catch (err) {
      console.error('Gagal memuat data Pre-Delinquency:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPDM();
  }, [filterReason, filterStatus]);

  const handleSendReminder = async (account) => {
    setActionLoadingId(account.id);
    try {
      const res = await sendPDMReminder(account.id);
      if (res.data && res.data.wa_url) {
        window.open(res.data.wa_url, '_blank');
      }
      await fetchPDM();
    } catch (err) {
      alert('Gagal mengirim reminder PDM: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredAccounts = pdmData.filter(acc => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      acc.agreement_no?.toLowerCase().includes(q) ||
      acc.customer?.name?.toLowerCase().includes(q) ||
      acc.customer?.phone?.toLowerCase().includes(q) ||
      acc.pdm_trigger_reason?.toLowerCase().includes(q)
    );
  });

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  const renderTriggerBadge = (reason) => {
    switch (reason) {
      case 'INSUFFICIENT_CASA':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <Wallet className="w-3 h-3 mr-1" />
            Saldo CASA Rendah
          </span>
        );
      case 'SALARY_DELAY_TUKIN':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            ASN Salary/Tukin Delay
          </span>
        );
      case 'HIGH_UTILIZATION':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <TrendingDown className="w-3 h-3 mr-1" />
            High CC Utilization (98%)
          </span>
        );
      case 'FIRST_PAYMENT_DEFAULT':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            <ShieldAlert className="w-3 h-3 mr-1" />
            FPD Risk Alert (Cicilan 1)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {reason}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Concept Explanation */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <ShieldAlert className="w-64 h-64 text-blue-300" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Pre-Delinquency Management (PDM) - DPD 0
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Recovery Prevention Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Early Warning System & Pencegahan Keterlambatan Sebelum Jatuh Tempo
          </h2>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
            CRMS memonitor rekening pinjaman nasabah pada H-3 s.d H-0 secara prediktif. Sistem menganalisis kecukupan saldo tabungan (CASA), tanggal pencairan payroll/tunjangan kinerja (Tukin) ASN Pemprov, dan riwayat pemakaian kartu kredit untuk mengirimkan gentle reminder via WhatsApp sebelum rekening bergulir ke Bucket 1-3.
          </p>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Total Kasus</p>
              <p className="text-lg sm:text-2xl font-bold text-slate-900 mt-1">{metrics.total_cases} <span className="text-xs font-normal text-slate-500">Akun</span></p>
              <p className="text-[11px] text-blue-600 mt-0.5">H-0 s.d H-3 Jatuh Tempo</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Terselesaikan</p>
              <p className="text-lg sm:text-2xl font-bold text-emerald-600 mt-1">{metrics.cured_cases} <span className="text-xs font-normal text-slate-500">({metrics.resolution_rate.toFixed(1)}%)</span></p>
              <p className="text-[11px] text-slate-500 mt-0.5">Top-up & Respon WA</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Tunggakan Dicegah</p>
              <p className="text-base sm:text-2xl font-bold text-indigo-700 mt-1">{formatIDR(metrics.total_potential_overdue)}</p>
              <p className="text-[11px] text-indigo-500 mt-0.5">Pencegahan Roll-Rate</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Efisiensi Biaya</p>
              <p className="text-base sm:text-2xl font-bold text-amber-600 mt-1">{formatIDR(metrics.estimated_cost_saving)}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Hemat Biaya Lapangan</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[200px] w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari nomor rekening, nasabah, no HP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <select 
            value={filterReason}
            onChange={(e) => setFilterReason(e.target.value)}
            className="flex-1 sm:flex-none text-xs sm:text-sm border border-slate-300 rounded-lg px-2.5 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Semua Trigger Reason</option>
            <option value="INSUFFICIENT_CASA">Saldo Tabungan Rendah</option>
            <option value="SALARY_DELAY_TUKIN">Keterlambatan Gaji / Tukin</option>
            <option value="HIGH_UTILIZATION">Utilisasi CC Tinggi</option>
            <option value="FIRST_PAYMENT_DEFAULT">First Payment Default (FPD)</option>
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 sm:flex-none text-xs sm:text-sm border border-slate-300 rounded-lg px-2.5 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Semua Status Reminder</option>
            <option value="PENDING">Menunggu Pengingat</option>
            <option value="WA_SENT">WA Gentle Terkirim</option>
            <option value="CURED">Sudah Cured / Terisi</option>
          </select>

          <button 
            onClick={fetchPDM}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
            title="Refresh Data"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDM Accounts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 shrink-0" />
            <h3 className="font-semibold text-slate-800 text-xs sm:text-sm">Daftar Akun Pengawasan Pre-Delinquency (DPD 0)</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {filteredAccounts.length} Akun
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Data terhubung live dengan Core Banking CASA Engine</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs sm:text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">No. Rekening</th>
                <th className="px-5 py-3">Nasabah & Fasilitas</th>
                <th className="px-5 py-3">Jatuh Tempo</th>
                <th className="px-5 py-3 text-right">Tagihan Cicilan</th>
                <th className="px-5 py-3 text-right">Saldo Tabungan (CASA)</th>
                <th className="px-5 py-3 text-center">Trigger Early Warning</th>
                <th className="px-5 py-3 text-center">Status Reminder</th>
                <th className="px-5 py-3 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-slate-400">
                    <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Memuat antrean akun Pre-Delinquency...
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-slate-400">
                    Tidak ada akun dalam pengawasan Pre-Delinquency dengan filter saat ini.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => {
                  const isUnderFunded = acc.casa_balance < acc.installment_amount;
                  return (
                    <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-medium text-slate-900">
                        {acc.agreement_no}
                        {acc.agreement?.combo_group && acc.agreement.combo_group !== 'SINGLE_FACILITY' && (
                          <div className="mt-1">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              Multi-Facility
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <button 
                          onClick={() => onOpenCustomer360 && onOpenCustomer360(acc.customer_id)}
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 text-left"
                        >
                          {acc.customer?.name || 'Nasabah'}
                          <ExternalLink className="w-3 h-3 text-blue-400" />
                        </button>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {acc.agreement?.asset_model || acc.agreement?.lob || 'Pinjaman Bank'} • {acc.customer?.phone}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs font-semibold text-slate-800">
                          {new Date(acc.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 mt-0.5">
                          DPD 0 (H-1)
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-slate-900">
                        {formatIDR(acc.installment_amount)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`font-semibold ${isUnderFunded ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {formatIDR(acc.casa_balance)}
                        </span>
                        {isUnderFunded && (
                          <div className="text-[11px] text-rose-500 font-medium">
                            Defisit {formatIDR(acc.installment_amount - acc.casa_balance)}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {renderTriggerBadge(acc.pdm_trigger_reason)}
                        <div className="text-[11px] text-slate-400 mt-1 max-w-[220px] truncate mx-auto" title={acc.notes}>
                          {acc.notes}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {acc.reminder_status === 'CURED' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Cured (Dana Terisi)
                          </span>
                        ) : acc.reminder_status === 'WA_SENT' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                            <MessageSquare className="w-3.5 h-3.5 mr-1" />
                            Gentle WA Terkirim
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            Menunggu Reminder
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleSendReminder(acc)}
                            disabled={actionLoadingId === acc.id || acc.reminder_status === 'CURED'}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm ${
                              acc.reminder_status === 'CURED'
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                            title="Kirimkan pesan pengingat ramah autodebet via WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {actionLoadingId === acc.id ? 'Mengirim...' : 'Gentle Reminder WA'}
                          </button>
                          <button
                            onClick={() => onOpenCustomer360 && onOpenCustomer360(acc.customer_id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Buka Profil Customer 360°"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
