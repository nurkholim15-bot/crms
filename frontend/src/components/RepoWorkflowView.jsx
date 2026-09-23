import React, { useState, useEffect } from 'react';
import { 
  getRepoCases, 
  updateRepoStage 
} from '../services/api';
import { 
  Building, 
  Car, 
  Home, 
  Store, 
  Search, 
  RotateCw, 
  ExternalLink,
  ChevronRight,
  Gavel,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  MapPin,
  Warehouse,
  X
} from 'lucide-react';

const REPO_STAGES = [
  { key: 'STAGE_MARKING', label: '1. Marking', desc: 'Default Agunan DPD > 90' },
  { key: 'STAGE_INITIATE_REPO', label: '2. Initiate Repo', desc: 'Surat Tugas & SP3' },
  { key: 'STAGE_ASSET_CAPTURING', label: '3. Asset Capturing', desc: 'Masuk Stockyard / Plang' },
  { key: 'STAGE_VALUATION_ALLOC', label: '4. Valuation Alloc', desc: 'Penunjukan KJPP Panel' },
  { key: 'STAGE_ASSET_VALUATION', label: '5. Asset Valuation', desc: 'Nilai Pasar & Likuidasi' },
  { key: 'STAGE_AUCTION', label: '6. Auction Bidding', desc: 'Lelang KPKNL / Online' },
  { key: 'STAGE_SALE', label: '7. Asset Sale', desc: 'Pemenang & Pelunasan' },
  { key: 'STAGE_RELEASE', label: '8. Asset Release', desc: 'Risalah Lelang & Selesai' },
];

export default function RepoWorkflowView({ onOpenCustomer360 }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseForEdit, setSelectedCaseForEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    repo_stage: '',
    valuation_agency: '',
    stockyard_location: '',
    market_value: 0,
    liquidation_value: 0,
    highest_bid_amount: 0,
    buyer_name: '',
    status: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStage) params.stage = filterStage;
      const res = await getRepoCases(params);
      setCases(res.data.data || []);
    } catch (err) {
      console.error('Gagal memuat data eksekusi agunan:', err);
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
      repo_stage: c.repo_stage || 'STAGE_MARKING',
      valuation_agency: c.valuation_agency || '',
      stockyard_location: c.stockyard_location || '',
      market_value: c.market_value || 0,
      liquidation_value: c.liquidation_value || 0,
      highest_bid_amount: c.highest_bid_amount || 0,
      buyer_name: c.buyer_name || '',
      status: c.status || 'IN_REPO',
      notes: c.notes || '',
    });
  };

  const handleUpdateStage = async (e) => {
    e.preventDefault();
    if (!selectedCaseForEdit) return;
    setSubmitting(true);
    try {
      await updateRepoStage(selectedCaseForEdit.id, {
        ...editFormData,
        market_value: parseFloat(editFormData.market_value) || 0,
        liquidation_value: parseFloat(editFormData.liquidation_value) || 0,
        highest_bid_amount: parseFloat(editFormData.highest_bid_amount) || 0,
      });
      setSelectedCaseForEdit(null);
      await fetchCases();
    } catch (err) {
      alert('Gagal memperbarui tahapan agunan: ' + (err.response?.data?.error || err.message));
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
      c.repo_no?.toLowerCase().includes(q) ||
      c.agreement_no?.toLowerCase().includes(q) ||
      c.customer?.name?.toLowerCase().includes(q) ||
      c.asset_description?.toLowerCase().includes(q) ||
      c.stockyard_location?.toLowerCase().includes(q)
    );
  });

  const renderAssetIcon = (type) => {
    if (type?.includes('PROPERTI')) return <Home className="w-4 h-4 text-emerald-600" />;
    if (type?.includes('KENDARAAN')) return <Car className="w-4 h-4 text-blue-600" />;
    return <Store className="w-4 h-4 text-purple-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Warehouse className="w-64 h-64 text-emerald-300" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/30 text-amber-200 border border-amber-400/30 flex items-center gap-1.5">
              <Warehouse className="w-3.5 h-3.5 text-amber-300" />
              Repossession & Auction Management
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              8-Stage Recovery Workflow
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Siklus Eksekusi Agunan, Penilaian KJPP & Pelelangan Properti / Fidusia
          </h2>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            CRMS mengelola 8 tahapan terintegrasi pemulihan aset agunan: Penandaan default, penarikan/penyegelan agunan, inventarisasi stockyard, penunjukan KJPP resmi, penetapan nilai pasar & likuidasi, lelang open bidding KPKNL, penetapan pembeli hingga terbitnya risalah lelang untuk pelunasan baki debet pinjaman.
          </p>
        </div>
      </div>

      {/* 8-Stage Stepper Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <Gavel className="w-4 h-4 text-emerald-600" />
          8 Tahapan Eksekusi Agunan & Pelelangan (Repossession Workflow)
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {REPO_STAGES.map((s) => {
            const countInStage = cases.filter(c => c.repo_stage === s.key).length;
            const isFilterActive = filterStage === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setFilterStage(filterStage === s.key ? '' : s.key)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isFilterActive 
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-900">{s.label.split('.')[0]}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    countInStage > 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {countInStage}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-800 mt-1 truncate">{s.label.split('. ')[1]}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{s.desc}</div>
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
              placeholder="Cari no eksekusi, no rekening, nama nasabah, lokasi stockyard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="">Semua Tahapan Eksekusi (1 s.d 8)</option>
            {REPO_STAGES.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>

          <button 
            onClick={fetchCases}
            className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh Data"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Repo Cases Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-800">Daftar Agunan dalam Proses Eksekusi & Lelang</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {filteredCases.length} Kasus
            </span>
          </div>
          <span className="text-xs text-slate-400">Sinkronisasi KJPP & Risalah Lelang</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">No. Eksekusi</th>
                <th className="px-5 py-3">Debitur & Rekening</th>
                <th className="px-5 py-3">Objek Agunan</th>
                <th className="px-5 py-3">Lokasi / Stockyard</th>
                <th className="px-5 py-3 text-right">Nilai Pasar & Likuidasi</th>
                <th className="px-5 py-3 text-right">Tawaran Lelang</th>
                <th className="px-5 py-3 text-center">Tahapan Eksekusi</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center text-slate-400">
                    <RotateCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Memuat antrean eksekusi agunan...
                  </td>
                </tr>
              ) : filteredCases.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center text-slate-400">
                    Tidak ada kasus eksekusi agunan yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => {
                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-slate-900">
                        {c.repo_no}
                      </td>
                      <td className="px-5 py-4">
                        <button 
                          onClick={() => onOpenCustomer360 && onOpenCustomer360(c.customer_id)}
                          className="font-semibold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 text-left"
                        >
                          {c.customer?.name || 'Debitur Bank'}
                          <ExternalLink className="w-3 h-3 text-emerald-500" />
                        </button>
                        <div className="text-xs font-mono text-slate-500 mt-0.5">
                          {c.agreement_no}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-1.5">
                          {renderAssetIcon(c.asset_type)}
                          <div>
                            <span className="font-semibold text-slate-800 text-xs">
                              {c.asset_type?.replace('_', ' ')}
                            </span>
                            <div className="text-xs text-slate-500 max-w-xs mt-0.5 line-clamp-2">
                              {c.asset_description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs font-medium text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[180px]">{c.stockyard_location || '-'}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Penilai: {c.valuation_agency || '-'}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="text-xs font-bold text-slate-900">
                          {formatIDR(c.market_value)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Likuidasi: {formatIDR(c.liquidation_value)}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {c.highest_bid_amount > 0 ? (
                          <div>
                            <div className="text-xs font-bold text-emerald-700">
                              {formatIDR(c.highest_bid_amount)}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                              {c.buyer_name || 'Penawar Terdaftar'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Belum Ada Bid</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {REPO_STAGES.find(s => s.key === c.repo_stage)?.label || c.repo_stage}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          c.status === 'SOLD'
                            ? 'bg-purple-100 text-purple-800'
                            : c.status === 'AUCTION_ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => openEditModal(c)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-medium border border-emerald-200 transition-colors"
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

      {/* Modal Update Tahapan Repo */}
      {selectedCaseForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-lg">Perbarui Tahapan Eksekusi Agunan & Lelang</h3>
              </div>
              <button 
                onClick={() => setSelectedCaseForEdit(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStage} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                <div><strong>No Eksekusi:</strong> {selectedCaseForEdit.repo_no}</div>
                <div><strong>Aset:</strong> {selectedCaseForEdit.asset_description}</div>
                <div><strong>Debitur:</strong> {selectedCaseForEdit.customer?.name} ({selectedCaseForEdit.agreement_no})</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tahapan Eksekusi Agunan
                </label>
                <select
                  value={editFormData.repo_stage}
                  onChange={(e) => setEditFormData({ ...editFormData, repo_stage: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  {REPO_STAGES.map(s => (
                    <option key={s.key} value={s.key}>{s.label} ({s.desc})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Lokasi Stockyard / Objek
                  </label>
                  <input
                    type="text"
                    value={editFormData.stockyard_location}
                    onChange={(e) => setEditFormData({ ...editFormData, stockyard_location: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                    placeholder="Stockyard Pulogadung"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Lembaga Penilai (KJPP Panel)
                  </label>
                  <input
                    type="text"
                    value={editFormData.valuation_agency}
                    onChange={(e) => setEditFormData({ ...editFormData, valuation_agency: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                    placeholder="KJPP Tri & Rekan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nilai Pasar (Rp)
                  </label>
                  <input
                    type="number"
                    value={editFormData.market_value}
                    onChange={(e) => setEditFormData({ ...editFormData, market_value: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nilai Likuidasi (Rp)
                  </label>
                  <input
                    type="number"
                    value={editFormData.liquidation_value}
                    onChange={(e) => setEditFormData({ ...editFormData, liquidation_value: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Tawaran Lelang Tertinggi (Rp)
                  </label>
                  <input
                    type="number"
                    value={editFormData.highest_bid_amount}
                    onChange={(e) => setEditFormData({ ...editFormData, highest_bid_amount: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Penawar / Pemenang
                  </label>
                  <input
                    type="text"
                    value={editFormData.buyer_name}
                    onChange={(e) => setEditFormData({ ...editFormData, buyer_name: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                    placeholder="Bpk. Ronald Susanto"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Status Kasus Agunan
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="IN_REPO">IN_REPO (Dalam Pengamanan Bank)</option>
                    <option value="AUCTION_ACTIVE">AUCTION_ACTIVE (Proses Lelang Berjalan)</option>
                    <option value="SOLD">SOLD (Agunan Laku Terjual Lelang)</option>
                    <option value="RELEASED_TO_CUSTOMER">RELEASED_TO_CUSTOMER (Ditebus Nasabah)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan Eksekusi & Kondisi Fisik
                </label>
                <textarea
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  rows="3"
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  placeholder="Catatan kondisi agunan, risalah lelang nomor, berita acara serah terima..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedCaseForEdit(null)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
