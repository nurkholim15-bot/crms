import React, { useState, useEffect } from 'react';
import { 
  getSettlementProposals, 
  processSettlementProposal 
} from '../services/api';
import { 
  BadgePercent, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Wallet, 
  Search, 
  RotateCw, 
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Sparkles,
  FileCheck,
  ShieldCheck,
  X
} from 'lucide-react';

const SETTLEMENT_TYPES = [
  { key: 'NET_SETTLEMENT', label: 'Net Settlement', desc: 'Negosiasi jumlah bersih pelunasan sekaligus (Lump-Sum Diskon Pokok & Bunga)' },
  { key: 'CHARGE_WISE_SETTLEMENT', label: 'Charge-Wise Settlement', desc: 'Keringanan spesifik per komponen biaya (Waive Denda 100% & Bunga)' },
  { key: 'AUTO_CHARGE_ALLOCATION', label: 'Auto Charge Allocation', desc: 'Penyetoran dialokasikan otomatis: Pokok -> Bunga -> Biaya/Denda' },
];

export default function SettlementWorkflowView({ onOpenCustomer360 }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProposalForAction, setSelectedProposalForAction] = useState(null);
  const [actionFormData, setActionFormData] = useState({
    action: 'APPROVE',
    approved_by: 'Bambang Wijaya (AR Head & Komite Remedial)',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType) params.type = filterType;
      if (filterStatus) params.status = filterStatus;
      const res = await getSettlementProposals(params);
      setProposals(res.data.data || []);
    } catch (err) {
      console.error('Gagal memuat proposal settlement:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [filterType, filterStatus]);

  const openActionModal = (p, defaultAction) => {
    setSelectedProposalForAction(p);
    setActionFormData({
      action: defaultAction || 'APPROVE',
      approved_by: 'Bambang Wijaya (AR Head & Komite Remedial)',
      notes: defaultAction === 'APPROVE' 
        ? 'Disetujui berdasarkan analisis kapasitas finansial debitur dan persetujuan Komite Remedial Wilayah.'
        : 'Ditolak karena penawaran debitur di bawah batas kewenangan diskon (floor recovery limit).',
    });
  };

  const handleProcessAction = async (e) => {
    e.preventDefault();
    if (!selectedProposalForAction) return;
    setSubmitting(true);
    try {
      await processSettlementProposal(selectedProposalForAction.id, actionFormData);
      setSelectedProposalForAction(null);
      await fetchProposals();
    } catch (err) {
      alert('Gagal memproses proposal settlement: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  const filteredProposals = proposals.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.proposal_no?.toLowerCase().includes(q) ||
      p.agreement_no?.toLowerCase().includes(q) ||
      p.customer?.name?.toLowerCase().includes(q) ||
      p.settlement_type?.toLowerCase().includes(q)
    );
  });

  const renderTypeBadge = (type) => {
    switch (type) {
      case 'NET_SETTLEMENT':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <BadgePercent className="w-3.5 h-3.5 mr-1" />
            Net Settlement
          </span>
        );
      case 'CHARGE_WISE_SETTLEMENT':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <TrendingDown className="w-3.5 h-3.5 mr-1" />
            Charge-Wise (Waive)
          </span>
        );
      case 'AUTO_CHARGE_ALLOCATION':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Auto Allocation
          </span>
        );
      default:
        return <span>{type}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <BadgePercent className="w-64 h-64 text-emerald-300" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5">
              <BadgePercent className="w-3.5 h-3.5 text-emerald-300" />
              Settlement & Diskon Pelunasan Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/30">
              3 Structured Settlement Types
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Program Keringanan, Penghapusan Denda (Waive) & Kompromi Pelunasan
          </h2>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Menyediakan 3 skema resolusi penagihan: <strong>Net Settlement</strong> (kesepakatan angka bersih tunai), <strong>Charge-Wise Settlement</strong> (pemotongan biaya & denda spesifik), dan <strong>Auto Charge Allocation</strong> (distribusi pembayaran bertingkat: Pokok, Bunga, Biaya Denda). Dilengkapi kontrol batas wewenang komite pemutus.
          </p>
        </div>
      </div>

      {/* 3 Settlement Types Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SETTLEMENT_TYPES.map((st) => {
          const count = proposals.filter(p => p.settlement_type === st.key).length;
          const isFilterActive = filterType === st.key;
          return (
            <div 
              key={st.key}
              onClick={() => setFilterType(filterType === st.key ? '' : st.key)}
              className={`p-4 rounded-xl border cursor-pointer transition-all bg-white ${
                isFilterActive 
                  ? 'border-teal-600 ring-2 ring-teal-500/20 shadow-md' 
                  : 'border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">{st.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-teal-100 text-teal-800">
                  {count} Proposal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {st.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari no proposal, rekening, debitur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">Semua Tipe Settlement</option>
            {SETTLEMENT_TYPES.map(t => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">Semua Status Persetujuan</option>
            <option value="PENDING_APPROVAL">Menunggu Persetujuan</option>
            <option value="APPROVED_BY_COMMITTEE">Disetujui Komite</option>
            <option value="PAID_OFF">Sudah Lunas</option>
            <option value="REJECTED">Ditolak Komite</option>
          </select>

          <button 
            onClick={fetchProposals}
            className="p-2 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh Data"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Proposals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-slate-800">Proposal Program Kompromi & Keringanan Pelunasan</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {filteredProposals.length} Pengajuan
            </span>
          </div>
          <span className="text-xs text-slate-400">Governance & Approval Authority Limit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">No. Proposal</th>
                <th className="px-5 py-3">Debitur & Rekening</th>
                <th className="px-5 py-3">Tipe Settlement</th>
                <th className="px-5 py-3 text-right">Tunggakan Awal</th>
                <th className="px-5 py-3 text-right">Diskon Denda / Bunga</th>
                <th className="px-5 py-3 text-right">Pelunasan Bersih (Net)</th>
                <th className="px-5 py-3 text-center">Batas Waktu</th>
                <th className="px-5 py-3 text-center">Status Komite</th>
                <th className="px-5 py-3 text-center">Aksi Keputusan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center text-slate-400">
                    <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-600" />
                    Memuat antrean proposal kompromi...
                  </td>
                </tr>
              ) : filteredProposals.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center text-slate-400">
                    Tidak ada proposal settlement yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredProposals.map((p) => {
                  const totalDiscount = (p.waived_penalty || 0) + (p.waived_interest || 0);
                  const discountPct = p.original_overdue > 0 ? (totalDiscount / p.original_overdue) * 100 : 0;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-slate-900">
                        {p.proposal_no}
                      </td>
                      <td className="px-5 py-4">
                        <button 
                          onClick={() => onOpenCustomer360 && onOpenCustomer360(p.customer_id)}
                          className="font-semibold text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1 text-left"
                        >
                          {p.customer?.name || 'Debitur Bank'}
                          <ExternalLink className="w-3 h-3 text-teal-500" />
                        </button>
                        <div className="text-xs font-mono text-slate-500 mt-0.5">
                          {p.agreement_no}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {renderTypeBadge(p.settlement_type)}
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-slate-800">
                        {formatIDR(p.original_overdue)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {totalDiscount > 0 ? (
                          <div>
                            <span className="text-xs font-bold text-rose-600">
                              - {formatIDR(totalDiscount)}
                            </span>
                            <div className="text-[10px] text-slate-500">
                              Hemat {discountPct.toFixed(1)}% (Denda/Bunga)
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Rp 0 (Full)</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-emerald-700 text-sm">
                        {formatIDR(p.net_settlement_amount)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {p.payment_due_date ? (
                          <div className="text-xs font-semibold text-slate-800">
                            {new Date(p.payment_due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          p.approval_status === 'APPROVED_BY_COMMITTEE'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : p.approval_status === 'PAID_OFF'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : p.approval_status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {p.approval_status === 'PENDING_APPROVAL' ? (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Menunggu Komite
                            </>
                          ) : p.approval_status === 'APPROVED_BY_COMMITTEE' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Disetujui
                            </>
                          ) : p.approval_status === 'PAID_OFF' ? (
                            <>
                              <ShieldCheck className="w-3 h-3 mr-1" />
                              Lunas Disetor
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Ditolak
                            </>
                          )}
                        </span>
                        {p.approved_by && p.approved_by !== '-' && (
                          <div className="text-[10px] text-slate-400 mt-1 truncate max-w-[140px] mx-auto">
                            Oleh: {p.approved_by}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {p.approval_status === 'PENDING_APPROVAL' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openActionModal(p, 'APPROVE')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium transition-colors shadow-sm"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => openActionModal(p, 'REJECT')}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-xs font-medium transition-colors"
                            >
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => openActionModal(p, 'APPROVE')}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors"
                          >
                            Detail
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Action Komite Pemutus Settlement */}
      {selectedProposalForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-400" />
                <h3 className="font-semibold text-lg">Keputusan Komite Settlement</h3>
              </div>
              <button 
                onClick={() => setSelectedProposalForAction(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessAction} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <strong>No. Proposal:</strong>
                  <span className="font-mono">{selectedProposalForAction.proposal_no}</span>
                </div>
                <div className="flex justify-between">
                  <strong>Debitur:</strong>
                  <span>{selectedProposalForAction.customer?.name}</span>
                </div>
                <div className="flex justify-between">
                  <strong>Total Tunggakan Awal:</strong>
                  <span>{formatIDR(selectedProposalForAction.original_overdue)}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <strong>Total Diskon Denda & Bunga:</strong>
                  <span>- {formatIDR((selectedProposalForAction.waived_penalty || 0) + (selectedProposalForAction.waived_interest || 0))}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-200 pt-1 text-sm">
                  <strong>Nilai Bayar Bersih (Net):</strong>
                  <span>{formatIDR(selectedProposalForAction.net_settlement_amount)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Keputusan Komite
                </label>
                <select
                  value={actionFormData.action}
                  onChange={(e) => setActionFormData({ ...actionFormData, action: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                  required
                >
                  <option value="APPROVE">SETUJUI PROPOSAL (Approve Settlement)</option>
                  <option value="REJECT">TOLAK PROPOSAL (Reject Settlement)</option>
                  <option value="PAID_OFF">TANDAI SUDAH LUNAS (Disetor Nasabah)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Pejabat Pemutus / Komite
                </label>
                <input
                  type="text"
                  value={actionFormData.approved_by}
                  onChange={(e) => setActionFormData({ ...actionFormData, approved_by: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan Pertimbangan Komite
                </label>
                <textarea
                  value={actionFormData.notes}
                  onChange={(e) => setActionFormData({ ...actionFormData, notes: e.target.value })}
                  rows="3"
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500"
                  placeholder="Masukkan alasan persetujuan / penolakan diskon..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedProposalForAction(null)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 shadow-sm"
                >
                  {submitting ? 'Memproses...' : 'Simpan Keputusan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
