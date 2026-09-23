import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  UserCheck,
  Shield,
  Briefcase,
  AlertTriangle,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  Percent,
  TrendingUp,
  BarChart3,
  Sliders,
  Settings,
  X,
  Share2,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  getAgencies,
  createAgency,
  getDelegations,
  createDelegation,
  cancelDelegation,
  getCapacityPlanning
} from '../services/api';

const SupervisoryControlView = () => {
  const [activeTab, setActiveTab] = useState('agencies'); // agencies, delegations, capacity, rules
  const [agencies, setAgencies] = useState([]);
  const [delegations, setDelegations] = useState([]);
  const [capacityData, setCapacityData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [showDelegationModal, setShowDelegationModal] = useState(false);

  // Agency Form Data
  const [agencyForm, setAgencyForm] = useState({
    agency_code: 'AGY-NEW-04',
    agency_name: '',
    contract_no: 'KTR/COLL/2026/089',
    contact_person: '',
    phone: '',
    active_collectors_count: 10,
    commission_rate: 9.0,
    recovery_rate: 85.0,
  });

  // Delegation Form Data
  const [delegationForm, setDelegationForm] = useState({
    delegator_username: 'ar_head',
    delegator_name: 'Ahmad Fauzi (AR Head Wilayah)',
    delegate_username: 'sro_bambang',
    delegate_name: 'Bambang Setyadi (Senior Remedial Officer)',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    approval_limit_amount: 100000000,
    reason: 'Cuti Tahunan / Out-of-Office: Pelimpahan hak persetujuan kompromi settlement s.d Rp 100 Juta',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [agRes, delRes, capRes] = await Promise.all([
        getAgencies(),
        getDelegations(),
        getCapacityPlanning(),
      ]);
      setAgencies(agRes.data.data || []);
      setDelegations(delRes.data.data || []);
      setCapacityData(capRes.data || null);
    } catch (err) {
      console.error('Gagal mengambil data supervisory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  const handleCreateAgency = async (e) => {
    e.preventDefault();
    try {
      await createAgency({
        ...agencyForm,
        active_collectors_count: Number(agencyForm.active_collectors_count),
        commission_rate: Number(agencyForm.commission_rate),
        recovery_rate: Number(agencyForm.recovery_rate),
      });
      setShowAgencyModal(false);
      fetchData();
      alert('Agensi penagihan eksternal berhasil didaftarkan!');
    } catch (err) {
      alert('Gagal mendaftarkan agensi: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCreateDelegation = async (e) => {
    e.preventDefault();
    try {
      await createDelegation({
        ...delegationForm,
        approval_limit_amount: Number(delegationForm.approval_limit_amount),
      });
      setShowDelegationModal(false);
      fetchData();
      alert('Pendelegasian wewenang (Out of Office) berhasil diaktifkan!');
    } catch (err) {
      alert('Gagal membuat delegasi: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCancelDelegation = async (id) => {
    if (window.confirm('Cabut dan nonaktifkan pendelegasian wewenang ini sekarang?')) {
      try {
        await cancelDelegation(id);
        fetchData();
      } catch (err) {
        alert('Gagal mencabut delegasi: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Shield className="w-64 h-64 text-indigo-300" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-300" />
              Supervisory Control & Governance
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Enterprise Value Differentiators
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Manajemen Agensi, Delegasi Wewenang (OOO) & Perencanaan Kapasitas
          </h2>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Menyediakan fitur pembeda tingkat enterprise: <strong>External Agency & Agent Onboarding</strong>, <strong>Authority Delegation (Out of Office Enablement)</strong>, <strong>Round-Robin Allocation & Capacity Planning</strong>, serta <strong>Frontend Easy Rule Creation</strong>.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-xl p-2 border border-gray-200 shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('agencies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'agencies'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Agency & Agent Onboarding ({agencies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('delegations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'delegations'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Authority Delegation / Out-of-Office ({delegations.filter(d => d.is_active).length} Aktif)</span>
        </button>

        <button
          onClick={() => setActiveTab('capacity')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'capacity'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Capacity Planning & Round-Robin</span>
        </button>
      </div>

      {/* ======================================================= */}
      {/* TAB 1: EXTERNAL AGENCY ONBOARDING                       */}
      {/* ======================================================= */}
      {activeTab === 'agencies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Daftar Agensi Penagihan Pihak Ketiga (External Agencies)</h3>
              <p className="text-xs text-gray-500">Kemitraan alih daya penagihan resmi dengan pemantauan recovery rate & batas masa berlaku izin</p>
            </div>
            <button
              onClick={() => setShowAgencyModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Onboard Agensi Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agencies.map((agy) => (
              <div key={agy.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                    {agy.agency_code}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {agy.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-gray-900">{agy.agency_name}</h4>
                  <div className="text-xs text-gray-500 mt-0.5">Kontrak: {agy.contract_no}</div>
                  <div className="text-xs text-gray-500">PIC: {agy.contact_person} ({agy.phone})</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Jumlah Kolektor Aktif:</span>
                    <span className="font-bold text-gray-900">{agy.active_collectors_count} Petugas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tingkat Pemulihan (Recovery):</span>
                    <span className="font-bold text-emerald-700">{agy.recovery_rate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tarif Komisi Sukses:</span>
                    <span className="font-semibold text-gray-800">{agy.commission_rate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* TAB 2: AUTHORITY DELEGATION (OUT OF OFFICE ENABLEMENT)  */}
      {/* ======================================================= */}
      {activeTab === 'delegations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Pendelegasian Wewenang (Out of Office Approval Delegation)</h3>
              <p className="text-xs text-gray-500">Pengalihan sementara hak persetujuan diskon kompromi settlement saat pejabat berhalangan hadir</p>
            </div>
            <button
              onClick={() => setShowDelegationModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Aktifkan Delegasi Baru
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">Pejabat Asal (Delegator)</th>
                  <th className="px-4 py-3 text-left">Pejabat Pengganti (Delegate)</th>
                  <th className="px-4 py-3 text-right">Batas Limit Wewenang</th>
                  <th className="px-4 py-3 text-center">Periode Berlaku</th>
                  <th className="px-4 py-3 text-left">Alasan / Keterangan</th>
                  <th className="px-4 py-3 text-center">Status & Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {delegations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">{d.delegator_name}</div>
                      <div className="text-[11px] text-gray-400 font-mono">@{d.delegator_username}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-indigo-700">{d.delegate_name}</div>
                      <div className="text-[11px] text-gray-400 font-mono">@{d.delegate_username}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-700">
                      {formatIDR(d.approval_limit_amount)}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      <div>{new Date(d.start_date).toLocaleDateString('id-ID')} s/d</div>
                      <div>{new Date(d.end_date).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[250px] truncate" title={d.reason}>
                      {d.reason}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {d.is_active ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            AKTIF
                          </span>
                          <button
                            onClick={() => handleCancelDelegation(d.id)}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                          >
                            Cabut
                          </button>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500">
                          NONAKTIF
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* TAB 3: CAPACITY PLANNING & ROUND-ROBIN                  */}
      {/* ======================================================= */}
      {activeTab === 'capacity' && capacityData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Alokasi Beban Kerja & Kapasitas Penagihan (Round-Robin)</h3>
              <p className="text-xs text-gray-500">
                Mode Alokasi: <strong className="text-indigo-700">{capacityData.round_robin_mode}</strong> • Menjamin beban merata per petugas
              </p>
            </div>
            <div className="text-xs text-gray-500">
              Total Petugas Aktif: <strong>{capacityData.total_collectors}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(capacityData.workloads || []).map((w, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-gray-900">{w.pic_name}</div>
                    <div className="text-xs text-gray-500">Kanal: {w.channel}</div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    w.status === 'OVERLOADED'
                      ? 'bg-rose-100 text-rose-800'
                      : w.status === 'NEAR_CAPACITY'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {w.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Utilitas Kapasitas ({w.active_accounts}/25 akun):</span>
                    <span className="font-bold text-gray-900">{Math.round(w.capacity_pct)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        w.status === 'OVERLOADED' ? 'bg-rose-500' : w.status === 'NEAR_CAPACITY' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${w.capacity_pct}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-xs pt-1 border-t border-gray-100 text-gray-500">
                  <span>Total Eksposur Terkelola:</span>
                  <span className="font-bold text-gray-900">{formatIDR(w.total_exposure)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL: ONBOARD AGENCY                                   */}
      {/* ======================================================= */}
      {showAgencyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                Onboard Agensi Penagihan Eksternal Baru
              </h3>
              <button onClick={() => setShowAgencyModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAgency} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Kode Agensi</label>
                <input
                  type="text"
                  value={agencyForm.agency_code}
                  onChange={(e) => setAgencyForm({ ...agencyForm, agency_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Nama Perusahaan / Agensi</label>
                <input
                  type="text"
                  placeholder="PT Solusi Tagih Mandiri"
                  value={agencyForm.agency_name}
                  onChange={(e) => setAgencyForm({ ...agencyForm, agency_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">No Kontrak Kerjasama</label>
                  <input
                    type="text"
                    value={agencyForm.contract_no}
                    onChange={(e) => setAgencyForm({ ...agencyForm, contract_no: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Jumlah Kolektor</label>
                  <input
                    type="number"
                    value={agencyForm.active_collectors_count}
                    onChange={(e) => setAgencyForm({ ...agencyForm, active_collectors_count: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">PIC Agensi</label>
                  <input
                    type="text"
                    placeholder="Nama PIC"
                    value={agencyForm.contact_person}
                    onChange={(e) => setAgencyForm({ ...agencyForm, contact_person: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Telepon</label>
                  <input
                    type="text"
                    placeholder="021-..."
                    value={agencyForm.phone}
                    onChange={(e) => setAgencyForm({ ...agencyForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAgencyModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md"
                >
                  Simpan Agensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL: CREATE DELEGATION (OOO)                          */}
      {/* ======================================================= */}
      {showDelegationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                Aktifkan Pendelegasian Wewenang (Out of Office)
              </h3>
              <button onClick={() => setShowDelegationModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDelegation} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Pejabat Asal (Pemberi Kuasa)</label>
                <input
                  type="text"
                  value={delegationForm.delegator_name}
                  onChange={(e) => setDelegationForm({ ...delegationForm, delegator_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Pejabat Pengganti (Penerima Kuasa)</label>
                <input
                  type="text"
                  value={delegationForm.delegate_name}
                  onChange={(e) => setDelegationForm({ ...delegationForm, delegate_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Batas Limit Persetujuan (Rp)</label>
                <input
                  type="number"
                  value={delegationForm.approval_limit_amount}
                  onChange={(e) => setDelegationForm({ ...delegationForm, approval_limit_amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={delegationForm.start_date}
                    onChange={(e) => setDelegationForm({ ...delegationForm, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tanggal Berakhir</label>
                  <input
                    type="date"
                    value={delegationForm.end_date}
                    onChange={(e) => setDelegationForm({ ...delegationForm, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Alasan Pendelegasian</label>
                <textarea
                  rows="2"
                  value={delegationForm.reason}
                  onChange={(e) => setDelegationForm({ ...delegationForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowDelegationModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md"
                >
                  Aktifkan Delegasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisoryControlView;
