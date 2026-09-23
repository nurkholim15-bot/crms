import React, { useState, useEffect } from 'react';
import { 
  getSettlementProposals, 
  createSettlementProposal,
  updateSettlementStage,
  saveSettlementTranches,
  paySettlementTranche,
  recommendSettlementProposal,
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
  X,
  Layers,
  Calendar,
  CreditCard,
  UserCheck,
  PlusCircle,
  ArrowRight,
  FileSpreadsheet
} from 'lucide-react';

const SETTLEMENT_STAGES = [
  { key: 'STAGE_INITIATE', label: '1. Initiate Settlement', desc: 'Inisiasi program kompromi keringanan & verifikasi kapasitas debitur' },
  { key: 'STAGE_SCHEDULE', label: '2. Generate Schedule', desc: 'Penjadwalan termin pelunasan (Single / Multi-Tranches)' },
  { key: 'STAGE_PLAN', label: '3. Draw Payment Plan', desc: 'Penyusunan rencana pembayaran kompromi pokok vs denda' },
  { key: 'STAGE_RECOMMEND_APPROVAL', label: '4. Recommend & Approval', desc: 'Eskalasi berjenjang & persetujuan limit matriks komite' },
  { key: 'STAGE_PAYMENT_TRACKING', label: '5. Payment Tracking', desc: 'Pemantauan realisasi setoran per termin & bukti bayar' },
  { key: 'STAGE_CLOSURE', label: '6. Settlement Closure', desc: 'Rekonsiliasi akhir, match-off pembukuan, & penutupan rekening' },
];

const SETTLEMENT_TYPES = [
  { key: 'NET_SETTLEMENT', label: 'Net Settlement', desc: 'Kesepakatan angka bersih tunai sekaligus (Lump-Sum Diskon Pokok & Bunga)' },
  { key: 'CHARGE_WISE_SETTLEMENT', label: 'Charge-Wise Settlement', desc: 'Keringanan spesifik per komponen biaya (Waive Denda 100% & Bunga)' },
  { key: 'AUTO_CHARGE_ALLOCATION', label: 'Auto Charge Allocation', desc: 'Penyetoran dialokasikan otomatis: Pokok -> Bunga -> Biaya/Denda' },
];

export default function SettlementWorkflowView({ onOpenCustomer360 }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Proposal for Tranche / Stage Detail
  const [selectedProposal, setSelectedProposal] = useState(null);

  // New Proposal Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newFormData, setNewFormData] = useState({
    agreement_no: 'BANK-KPR-2025-108191',
    settlement_type: 'NET_SETTLEMENT',
    original_overdue: 145000000,
    waived_penalty: 18000000,
    waived_interest: 22000000,
    net_settlement_amount: 105000000,
    total_tranches: 3,
    payment_due_date: '2026-10-15',
    recommendation_tier: 'BRANCH_MANAGER',
    recommended_to: 'Branch Manager Sudirman',
    notes: 'Inisiasi kompromi pelunasan restrukturisasi angsuran bertahap 3 termin.',
  });

  // Action / Approval Modal
  const [actionModalProposal, setActionModalProposal] = useState(null);
  const [actionFormData, setActionFormData] = useState({
    action: 'APPROVE',
    approved_by: 'Bambang Wijaya (AR Head & Komite Remedial)',
    notes: '',
  });

  // Pay Tranche Modal
  const [payTrancheData, setPayTrancheData] = useState(null);
  const [tranchePayMethod, setTranchePayMethod] = useState('ONLINE_VA');

  // Recommend Modal
  const [recommendProposal, setRecommendProposal] = useState(null);
  const [recTier, setRecTier] = useState('AR_HEAD');
  const [recTo, setRecTo] = useState('Head of Consumer Recovery');
  const [recNotes, setRecNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType) params.type = filterType;
      if (filterStatus) params.status = filterStatus;
      if (filterStage) params.stage = filterStage;
      const res = await getSettlementProposals(params);
      setProposals(res.data.data || []);
      if (selectedProposal) {
        const updated = (res.data.data || []).find((p) => p.id === selectedProposal.id);
        if (updated) setSelectedProposal(updated);
      }
    } catch (err) {
      console.error('Gagal memuat proposal settlement:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [filterType, filterStatus, filterStage]);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  // Handle Create New Proposal
  const handleCreateProposal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createSettlementProposal({
        ...newFormData,
        original_overdue: Number(newFormData.original_overdue),
        waived_penalty: Number(newFormData.waived_penalty),
        waived_interest: Number(newFormData.waived_interest),
        net_settlement_amount: Number(newFormData.net_settlement_amount),
        total_tranches: Number(newFormData.total_tranches),
      });
      setShowNewModal(false);
      await fetchProposals();
      alert('Proposal settlement 6-Stage Lifecycle berhasil diinisiasi!');
    } catch (err) {
      alert('Gagal inisiasi proposal: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Advance Stage
  const handleAdvanceStage = async (proposalId, nextStage) => {
    try {
      await updateSettlementStage(proposalId, {
        stage: nextStage,
        notes: `Tahapan diperbarui ke ${nextStage}`,
      });
      await fetchProposals();
    } catch (err) {
      alert('Gagal memperbarui tahapan: ' + (err.response?.data?.error || err.message));
    }
  };

  // Handle Pay Tranche
  const handlePayTrancheSubmit = async (e) => {
    e.preventDefault();
    if (!payTrancheData) return;
    setSubmitting(true);
    try {
      await paySettlementTranche(payTrancheData.id, {
        paid_amount: payTrancheData.amount,
        payment_method: tranchePayMethod,
        notes: `Pelunasan termin #${payTrancheData.tranche_no} via ${tranchePayMethod}`,
      });
      setPayTrancheData(null);
      await fetchProposals();
      alert(`Termin #${payTrancheData.tranche_no} berhasil dibayarkan!`);
    } catch (err) {
      alert('Gagal mencatat pembayaran termin: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Recommend
  const handleRecommendSubmit = async (e) => {
    e.preventDefault();
    if (!recommendProposal) return;
    setSubmitting(true);
    try {
      await recommendSettlementProposal(recommendProposal.id, {
        recommendation_tier: recTier,
        recommended_to: recTo,
        notes: recNotes,
      });
      setRecommendProposal(null);
      await fetchProposals();
      alert(`Proposal berhasil direkomendasikan ke ${recTier} (${recTo})`);
    } catch (err) {
      alert('Gagal merekomendasikan: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Approval Action
  const handleProcessAction = async (e) => {
    e.preventDefault();
    if (!actionModalProposal) return;
    setSubmitting(true);
    try {
      await processSettlementProposal(actionModalProposal.id, actionFormData);
      setActionModalProposal(null);
      await fetchProposals();
    } catch (err) {
      alert('Gagal memproses proposal: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProposals = proposals.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.proposal_no?.toLowerCase().includes(q) ||
      p.agreement_no?.toLowerCase().includes(q) ||
      p.customer?.name?.toLowerCase().includes(q) ||
      p.settlement_type?.toLowerCase().includes(q)
    );
  });

  const getStageBadge = (stage) => {
    const s = SETTLEMENT_STAGES.find((st) => st.key === stage) || { label: stage };
    let colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
    if (stage === 'STAGE_CLOSURE') colorClass = 'bg-purple-100 text-purple-800 border-purple-200';
    else if (stage === 'STAGE_PAYMENT_TRACKING') colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    else if (stage === 'STAGE_RECOMMEND_APPROVAL') colorClass = 'bg-amber-100 text-amber-800 border-amber-200';

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${colorClass}`}>
        {s.label}
      </span>
    );
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
              Settlement Workflow Architecture
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/30">
              6-Stage Lifecycle & Multi-Tranches
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Siklus Komprehensif Penyelesaian Kredit & Kompromi Pelunasan
          </h2>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Mencakup 6 tahapan terstruktur: <strong>Initiate Settlement</strong> &rarr; <strong>Generate Settlement Schedule (Single/Multi tranches)</strong> &rarr; <strong>Draw Payment Plan</strong> &rarr; <strong>Recommend & Approval Matrix</strong> &rarr; <strong>Settlement Payment Tracking</strong> &rarr; <strong>Settlement Closure / Match-Off</strong>.
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-teal-800/60 flex items-center justify-between">
          <div className="text-xs text-teal-300">
            Dukungan pelunasan bertahap (multi-tranches) dengan verifikasi kuitansi dan match-off otomatis.
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            Inisiasi Proposal Baru
          </button>
        </div>
      </div>

      {/* 6-Stage Lifecycle Stepper Navigator */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm overflow-x-auto">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Pipeline 6 Tahapan Settlement Lifecycle
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 min-w-[700px]">
          {SETTLEMENT_STAGES.map((st, idx) => {
            const count = proposals.filter((p) => p.settlement_stage === st.key).length;
            const isActive = filterStage === st.key;
            return (
              <div
                key={st.key}
                onClick={() => setFilterStage(filterStage === st.key ? '' : st.key)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isActive
                    ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                }`}
              >
                <div className="text-[11px] font-bold text-gray-900 truncate">{st.label}</div>
                <div className="text-xl font-extrabold text-emerald-700 mt-1">{count}</div>
                <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{st.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Table: Proposals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari no proposal, rekening, debitur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none"
            >
              <option value="">Semua Tipe Settlement</option>
              {SETTLEMENT_TYPES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none"
            >
              <option value="">Semua Status Approval</option>
              <option value="PENDING_APPROVAL">Menunggu Persetujuan</option>
              <option value="RECOMMENDED">Direkomendasikan</option>
              <option value="APPROVED_BY_COMMITTEE">Disetujui Komite</option>
              <option value="PAID_OFF">Lunas Selesai</option>
              <option value="REJECTED">Ditolak</option>
            </select>

            <button
              onClick={fetchProposals}
              className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-gray-100 rounded-lg"
              title="Refresh Data"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Proposals Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">No Proposal & Debitur</th>
                <th className="px-4 py-3 text-left">Tipe & Tahapan (Stage)</th>
                <th className="px-4 py-3 text-right">Tunggakan & Diskon</th>
                <th className="px-4 py-3 text-right">Net Settlement</th>
                <th className="px-4 py-3 text-center">Jadwal Termin (Tranches)</th>
                <th className="px-4 py-3 text-center">Approval Matrix</th>
                <th className="px-4 py-3 text-center">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredProposals.map((p) => {
                const totalDiscount = (p.waived_penalty || 0) + (p.waived_interest || 0);
                const tranches = p.tranches || [];
                const paidTranches = tranches.filter((t) => t.payment_status === 'PAID').length;

                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900 font-mono">{p.proposal_no}</div>
                      <div className="font-semibold text-emerald-800">{p.customer?.name}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{p.agreement_no}</div>
                    </td>

                    <td className="px-4 py-3 space-y-1">
                      <div className="font-semibold text-gray-900">
                        {p.settlement_type?.replace(/_/g, ' ')}
                      </div>
                      <div>{getStageBadge(p.settlement_stage)}</div>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="text-gray-900 font-medium">{formatIDR(p.original_overdue)}</div>
                      {totalDiscount > 0 ? (
                        <div className="text-[11px] text-rose-600 font-semibold">
                          Waive: -{formatIDR(totalDiscount)}
                        </div>
                      ) : (
                        <div className="text-[11px] text-gray-400">Tanpa Diskon</div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="font-bold text-emerald-700 text-sm">
                        {formatIDR(p.net_settlement_amount)}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {p.total_tranches || 1} Termin Pembayaran
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedProposal(p)}
                        className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200 inline-flex items-center gap-1 shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {paidTranches}/{tranches.length || p.total_tranches} Lunas
                      </button>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        p.approval_status === 'APPROVED_BY_COMMITTEE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.approval_status === 'PAID_OFF'
                          ? 'bg-purple-100 text-purple-800'
                          : p.approval_status === 'RECOMMENDED'
                          ? 'bg-blue-100 text-blue-800'
                          : p.approval_status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.approval_status?.replace(/_/g, ' ')}
                      </span>
                      {p.recommended_to && (
                        <div className="text-[10px] text-gray-500 mt-0.5 truncate max-w-[120px] mx-auto">
                          Ke: {p.recommended_to}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Recommend up hierarchy */}
                        {p.approval_status === 'PENDING_APPROVAL' && (
                          <button
                            onClick={() => {
                              setRecommendProposal(p);
                              setRecTier('AR_HEAD');
                              setRecTo('Head of Consumer Recovery');
                              setRecNotes('Pengajuan memenuhi kriteria kompromi pelunasan dan didukung dokumen analisis.');
                            }}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded font-medium text-[11px]"
                            title="Rekomendasikan ke Komite Jenjang Lebih Tinggi"
                          >
                            Rekomendasi
                          </button>
                        )}

                        {/* Approve or reject button */}
                        {(p.approval_status === 'PENDING_APPROVAL' || p.approval_status === 'RECOMMENDED') && (
                          <button
                            onClick={() => {
                              setActionModalProposal(p);
                              setActionFormData({
                                action: 'APPROVE',
                                approved_by: 'Bambang Wijaya (AR Head & Komite Remedial)',
                                notes: 'Disetujui komite pemulihan kredit untuk pelunasan bertahap.',
                              });
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] shadow-sm"
                          >
                            Setujui
                          </button>
                        )}

                        {/* Detail Drawer */}
                        <button
                          onClick={() => setSelectedProposal(p)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-medium text-[11px]"
                        >
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================= */}
      {/* 1. MODAL: TRANCHES DETAIL & PAYMENT TRACKING           */}
      {/* ======================================================= */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  Jadwal Termin & Tracking Pembayaran (Settlement Tranches)
                </h3>
                <p className="text-xs text-gray-500">
                  Proposal: {selectedProposal.proposal_no} • {selectedProposal.customer?.name} ({selectedProposal.agreement_no})
                </p>
              </div>
              <button onClick={() => setSelectedProposal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Status on Active Proposal */}
            <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Tahapan Saat Ini:</span>
                {getStageBadge(selectedProposal.settlement_stage)}
              </div>
              <div className="flex items-center gap-1 overflow-x-auto py-1">
                {SETTLEMENT_STAGES.map((st, i) => {
                  const isCurrent = selectedProposal.settlement_stage === st.key;
                  return (
                    <button
                      key={st.key}
                      onClick={() => handleAdvanceStage(selectedProposal.id, st.key)}
                      className={`px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap border ${
                        isCurrent
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}. {st.label.split('. ')[1] || st.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tranches List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Daftar Termin Pembayaran ({selectedProposal.tranches?.length || 0})
                </h4>
                <div className="text-xs text-gray-500">
                  Total Nilai: <strong className="text-emerald-700">{formatIDR(selectedProposal.net_settlement_amount)}</strong>
                </div>
              </div>

              <div className="space-y-2">
                {(selectedProposal.tranches || []).map((tr) => (
                  <div
                    key={tr.id}
                    className="p-3.5 rounded-xl border border-gray-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        tr.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        #{tr.tranche_no}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-gray-900">
                          Termin #{tr.tranche_no}: {formatIDR(tr.amount)}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Jatuh Tempo: {new Date(tr.due_date).toLocaleDateString('id-ID')} • Metode: {tr.payment_method}
                        </div>
                        {tr.receipt_no && (
                          <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
                            Bukti Setor: {tr.receipt_no}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        tr.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tr.payment_status}
                      </span>

                      {tr.payment_status !== 'PAID' && (
                        <button
                          onClick={() => setPayTrancheData(tr)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm"
                        >
                          Catat Bayar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button
                onClick={() => setSelectedProposal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 2. MODAL: PAY TRANCHE                                  */}
      {/* ======================================================= */}
      {payTrancheData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Konfirmasi Pembayaran Termin #{payTrancheData.tranche_no}
              </h3>
              <button onClick={() => setPayTrancheData(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePayTrancheSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Jumlah Tagihan Termin:</span>
                  <span className="font-bold text-emerald-700 text-sm">{formatIDR(payTrancheData.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Batas Waktu:</span>
                  <span className="font-semibold text-gray-800">{new Date(payTrancheData.due_date).toLocaleDateString('id-ID')}</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Metode Pembayaran</label>
                <select
                  value={tranchePayMethod}
                  onChange={(e) => setTranchePayMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                >
                  <option value="ONLINE_VA">Virtual Account (Bank VA)</option>
                  <option value="QRIS">QRIS Dinamis</option>
                  <option value="CASH">Setoran Tunai di Kantor / Kolektor</option>
                  <option value="CHEQUE">Bilyet Giro / Cek Perbankan</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setPayTrancheData(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md"
                >
                  {submitting ? 'Memproses...' : 'Konfirmasi Pelunasan Termin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 3. MODAL: RECOMMEND TO HIGHER TIER                     */}
      {/* ======================================================= */}
      {recommendProposal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                Rekomendasi Berjenjang (Approval Matrix)
              </h3>
              <button onClick={() => setRecommendProposal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecommendSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Jenjang Tingkat Kewenangan</label>
                <select
                  value={recTier}
                  onChange={(e) => {
                    setRecTier(e.target.value);
                    if (e.target.value === 'BRANCH_MANAGER') setRecTo('Branch Manager Cabang');
                    else if (e.target.value === 'AR_HEAD') setRecTo('Head of Consumer Recovery');
                    else if (e.target.value === 'DIRECTOR') setRecTo('Direktur Bisnis Konsumer');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                >
                  <option value="BRANCH_MANAGER">Branch Manager (Limit s.d Rp 50 Jt)</option>
                  <option value="AR_HEAD">AR Head / Head of Recovery (Limit s.d Rp 150 Jt)</option>
                  <option value="DIRECTOR">Komite Direktur Konsumer (Limit &gt; Rp 150 Jt)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Nama Pejabat / Komite</label>
                <input
                  type="text"
                  value={recTo}
                  onChange={(e) => setRecTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Catatan Pertimbangan Kompromi</label>
                <textarea
                  rows="3"
                  value={recNotes}
                  onChange={(e) => setRecNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setRecommendProposal(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md"
                >
                  {submitting ? 'Mengirim...' : 'Kirim Rekomendasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 4. MODAL: APPROVE / REJECT ACTION                      */}
      {/* ======================================================= */}
      {actionModalProposal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Persetujuan Komite Remedial & Recovery
              </h3>
              <button onClick={() => setActionModalProposal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessAction} className="space-y-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Proposal:</span>
                  <span className="font-bold text-gray-900">{actionModalProposal.proposal_no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Debitur:</span>
                  <span className="font-semibold text-gray-900">{actionModalProposal.customer?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nilai Net:</span>
                  <span className="font-bold text-emerald-700">{formatIDR(actionModalProposal.net_settlement_amount)}</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Keputusan Komite</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActionFormData({ ...actionFormData, action: 'APPROVE' })}
                    className={`py-2 px-3 rounded-lg font-bold border text-center ${
                      actionFormData.action === 'APPROVE'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    Setujui (Approve)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionFormData({ ...actionFormData, action: 'REJECT' })}
                    className={`py-2 px-3 rounded-lg font-bold border text-center ${
                      actionFormData.action === 'REJECT'
                        ? 'border-rose-600 bg-rose-50 text-rose-800'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    Tolak (Reject)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Nama Pejabat Penyetuju</label>
                <input
                  type="text"
                  value={actionFormData.approved_by}
                  onChange={(e) => setActionFormData({ ...actionFormData, approved_by: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Catatan Keputusan</label>
                <textarea
                  rows="3"
                  value={actionFormData.notes}
                  onChange={(e) => setActionFormData({ ...actionFormData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setActionModalProposal(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2 text-white rounded-lg font-bold shadow-md ${
                    actionFormData.action === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {submitting ? 'Memproses...' : 'Simpan Keputusan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 5. MODAL: INITIATE NEW PROPOSAL (STAGE 1)              */}
      {/* ======================================================= */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                Inisiasi Proposal Settlement Baru (Stage 1: Initiate)
              </h3>
              <button onClick={() => setShowNewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Nomor Rekening / Perjanjian</label>
                <input
                  type="text"
                  value={newFormData.agreement_no}
                  onChange={(e) => setNewFormData({ ...newFormData, agreement_no: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Skema Settlement</label>
                  <select
                    value={newFormData.settlement_type}
                    onChange={(e) => setNewFormData({ ...newFormData, settlement_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  >
                    {SETTLEMENT_TYPES.map((t) => (
                      <option key={t.key} value={t.key}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Jumlah Termin (Tranches)</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newFormData.total_tranches}
                    onChange={(e) => setNewFormData({ ...newFormData, total_tranches: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tunggakan Awal (Rp)</label>
                  <input
                    type="number"
                    value={newFormData.original_overdue}
                    onChange={(e) => setNewFormData({ ...newFormData, original_overdue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Net Pelunasan (Rp)</label>
                  <input
                    type="number"
                    value={newFormData.net_settlement_amount}
                    onChange={(e) => setNewFormData({ ...newFormData, net_settlement_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold text-emerald-700 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Diskon Denda (Waive Penalty)</label>
                  <input
                    type="number"
                    value={newFormData.waived_penalty}
                    onChange={(e) => setNewFormData({ ...newFormData, waived_penalty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Diskon Bunga (Waive Interest)</label>
                  <input
                    type="number"
                    value={newFormData.waived_interest}
                    onChange={(e) => setNewFormData({ ...newFormData, waived_interest: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Batas Waktu Pelunasan Termin 1</label>
                <input
                  type="date"
                  value={newFormData.payment_due_date}
                  onChange={(e) => setNewFormData({ ...newFormData, payment_due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Justifikasi & Catatan Pengajuan</label>
                <textarea
                  rows="2"
                  value={newFormData.notes}
                  onChange={(e) => setNewFormData({ ...newFormData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md"
                >
                  {submitting ? 'Menyimpan...' : 'Inisiasi Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
