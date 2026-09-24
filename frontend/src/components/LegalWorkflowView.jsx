import React, { useState, useEffect } from 'react';
import { 
  getLegalCases, 
  updateLegalStage 
} from '../services/api';
import { 
  Scale, 
  FileText, 
  CheckCircle2, 
  Calendar, 
  UserCheck, 
  Building2, 
  Search, 
  RotateCw, 
  ExternalLink,
  ChevronRight,
  Gavel,
  ShieldAlert,
  ArrowRight,
  X
} from 'lucide-react';

const LEGAL_STAGES = [
  { key: 'STAGE_INITIATE', label: '1. Inisiasi Hukum', desc: 'Somasi & SP Default' },
  { key: 'STAGE_LAWYER_ALLOC', label: '2. Alokasi Lawyer', desc: 'Panel Advokat & SK' },
  { key: 'STAGE_DOC_APPROVAL', label: '3. Approval Dokumen', desc: 'Review PK & APHT' },
  { key: 'STAGE_PROCEEDINGS', label: '4. Sidang Pengadilan', desc: 'Mediasi & Gugatan' },
  { key: 'STAGE_AUDIT_TRAIL', label: '5. Multi-Case & Audit', desc: 'Audit Jejak Perkara' },
  { key: 'STAGE_JUDGEMENT_WITHDRAWAL', label: '6. Putusan / Cabut', desc: 'Inkrah / Aanmaning' },
];

export default function LegalWorkflowView({ onOpenCustomer360 }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseForEdit, setSelectedCaseForEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    legal_stage: '',
    lawyer_name: '',
    law_firm: '',
    court_name: '',
    police_station: '',
    legal_section: '',
    status: '',
    hearing_date: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStage) params.stage = filterStage;
      const res = await getLegalCases(params);
      setCases(res.data.data || []);
    } catch (err) {
      console.error('Gagal mengambil data legal cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [filterStage]);

  const openEditModal = (c) => {
    setSelectedCaseForEdit(c);
    setEditFormData({
      legal_stage: c.legal_stage || 'STAGE_INITIATE',
      lawyer_name: c.lawyer_name || '',
      law_firm: c.law_firm || '',
      court_name: c.court_name || '',
      police_station: c.police_station || '',
      legal_section: c.legal_section || '',
      status: c.status || 'ACTIVE',
      hearing_date: c.hearing_date ? c.hearing_date.split('T')[0] : '',
      notes: c.notes || '',
    });
  };

  const handleUpdateStage = async (e) => {
    e.preventDefault();
    if (!selectedCaseForEdit) return;
    setSubmitting(true);
    try {
      await updateLegalStage(selectedCaseForEdit.id, editFormData);
      setSelectedCaseForEdit(null);
      await fetchCases();
    } catch (err) {
      alert('Gagal memperbarui tahapan perkara: ' + (err.response?.data?.error || err.message));
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

  const filteredCases = cases.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.case_no?.toLowerCase().includes(q) ||
      c.agreement_no?.toLowerCase().includes(q) ||
      c.customer?.name?.toLowerCase().includes(q) ||
      c.lawyer_name?.toLowerCase().includes(q) ||
      c.court_name?.toLowerCase().includes(q)
    );
  });

  const getStageBadge = (stageKey) => {
    const s = LEGAL_STAGES.find(item => item.key === stageKey);
    return s ? s.label : stageKey;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Gavel className="w-64 h-64 text-indigo-300" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-indigo-300" />
              Legal Recourse Management & Alur Hukum Perbankan
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              6-Stage Legal Recourse Workflow
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Manajemen Litigasi, Somasi, Gugatan Sederhana & Aanmaning Eksekusi
          </h2>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Menata siklus penanganan hukum secara terstruktur dari somasi awal, penunjukan kantor hukum/advokat rekanan bank, verifikasi keabsahan dokumen jaminan (APHT/Fidusia), persidangan mediasi hingga putusan berkekuatan hukum tetap (Inkrah) atau kesepakatan damai (Dading).
          </p>
        </div>
      </div>

      {/* 6-Stage Stepper Overview */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <Scale className="w-4 h-4 text-indigo-600" />
          Tahapan Standar Penanganan Hukum Perbankan (Legal Workflow)
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {LEGAL_STAGES.map((s, idx) => {
            const countInStage = cases.filter(c => c.legal_stage === s.key).length;
            const isFilterActive = filterStage === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setFilterStage(filterStage === s.key ? '' : s.key)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isFilterActive 
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900">{s.label.split('.')[0]}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    countInStage > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {countInStage}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-800 mt-1">{s.label.split('. ')[1]}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{s.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari nomor perkara, rekening, nama advokat, pengadilan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">Semua Tahapan Legal (1 s.d 6)</option>
            {LEGAL_STAGES.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>

          <button 
            onClick={fetchCases}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh Data"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legal Cases Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-800">Daftar Perkara Hukum Aktif (Litigasi & Somasi)</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {filteredCases.length} Kasus Terdata
            </span>
          </div>
          <span className="text-xs text-slate-400">Sinkronisasi Dokumen Perkara & Surat Kuasa</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs sm:text-sm text-slate-600 min-w-[750px]">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">No. Perkara / Kasus</th>
                <th className="px-5 py-3">No. Rekening & Debitur</th>
                <th className="px-5 py-3">Kuasa Hukum / Law Firm</th>
                <th className="px-5 py-3">Pengadilan / Instansi</th>
                <th className="px-5 py-3 text-right">Nilai Tuntutan</th>
                <th className="px-5 py-3 text-center">Tahapan Saat Ini</th>
                <th className="px-5 py-3 text-center">Jadwal Sidang</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center text-slate-400">
                    <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                    Memuat antrean perkara hukum...
                  </td>
                </tr>
              ) : filteredCases.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center text-slate-400">
                    Tidak ada perkara hukum yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => {
                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-slate-900">
                        {c.case_no}
                        <div className="text-[11px] font-normal text-slate-500 mt-0.5">
                          {c.legal_section}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button 
                          onClick={() => onOpenCustomer360 && onOpenCustomer360(c.customer_id)}
                          className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 text-left"
                        >
                          {c.customer?.name || 'Debitur Bank'}
                          <ExternalLink className="w-3 h-3 text-indigo-400" />
                        </button>
                        <div className="text-xs font-mono text-slate-500 mt-0.5">
                          {c.agreement_no} • {c.agreement?.asset_model || c.agreement?.lob}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-800 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                          {c.lawyer_name || '-'}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {c.law_firm || 'In-House Legal'}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-800 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {c.court_name || c.police_station || '-'}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-slate-900">
                        {formatIDR(c.claim_amount)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                          {getStageBadge(c.legal_stage)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {c.hearing_date ? (
                          <div className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 inline-block">
                            {new Date(c.hearing_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          c.status === 'DECIDED_WON'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'SETTLED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => openEditModal(c)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-medium border border-indigo-200 transition-colors"
                        >
                          Perbarui Tahap
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Update Tahapan Legal */}
      {selectedCaseForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[92vh] flex flex-col my-auto animate-in fade-in zoom-in-95">
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white gap-2">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-indigo-400 shrink-0" />
                <h3 className="font-semibold text-base sm:text-lg">Perbarui Tahapan Legal</h3>
              </div>
              <button 
                onClick={() => setSelectedCaseForEdit(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStage} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                <div><strong>No Perkara:</strong> {selectedCaseForEdit.case_no}</div>
                <div><strong>Debitur:</strong> {selectedCaseForEdit.customer?.name} ({selectedCaseForEdit.agreement_no})</div>
                <div><strong>Nilai Tuntutan:</strong> {formatIDR(selectedCaseForEdit.claim_amount)}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tahapan Penanganan Hukum
                </label>
                <select
                  value={editFormData.legal_stage}
                  onChange={(e) => setEditFormData({ ...editFormData, legal_stage: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {LEGAL_STAGES.map(s => (
                    <option key={s.key} value={s.key}>{s.label} ({s.desc})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Kuasa Hukum / Advokat
                  </label>
                  <input
                    type="text"
                    value={editFormData.lawyer_name}
                    onChange={(e) => setEditFormData({ ...editFormData, lawyer_name: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Bambang Sujatmo, S.H."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Kantor Hukum / Law Firm
                  </label>
                  <input
                    type="text"
                    value={editFormData.law_firm}
                    onChange={(e) => setEditFormData({ ...editFormData, law_firm: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Sujatmo & Partners"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Pengadilan / Lembaga
                  </label>
                  <input
                    type="text"
                    value={editFormData.court_name}
                    onChange={(e) => setEditFormData({ ...editFormData, court_name: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                    placeholder="PN Jakarta Pusat"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Jadwal Sidang Berikutnya
                  </label>
                  <input
                    type="date"
                    value={editFormData.hearing_date}
                    onChange={(e) => setEditFormData({ ...editFormData, hearing_date: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Dasar Gugatan / Pasal Hukum
                  </label>
                  <input
                    type="text"
                    value={editFormData.legal_section}
                    onChange={(e) => setEditFormData({ ...editFormData, legal_section: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Pasal 1243 KUHPerdata / UU HT"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Status Kasus
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ACTIVE">ACTIVE (Sedang Berjalan)</option>
                    <option value="DECIDED_WON">DECIDED_WON (Menang Putusan Inkrah)</option>
                    <option value="SETTLED">SETTLED (Berdamai / Dading)</option>
                    <option value="WITHDRAWN">WITHDRAWN (Dicabut Resmi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan Progres Sidang / Kronologis
                </label>
                <textarea
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  rows="3"
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masukkan rincian hasil sidang, tanggapan tergugat, atau klausul perdamaian..."
                />
              </div>

              <div className="pt-2 flex flex-wrap sm:flex-nowrap items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedCaseForEdit(null)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Pembaruan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
