import React, { useState, useEffect } from 'react';
import KPICards from '../components/KPICards';
import BucketMatrixTable from '../components/BucketMatrixTable';
import ActivityModal from '../components/ActivityModal';
import Customer360Modal from '../components/Customer360Modal';
import PreDelinquencyView from '../components/PreDelinquencyView';
import LegalWorkflowView from '../components/LegalWorkflowView';
import RepoWorkflowView from '../components/RepoWorkflowView';
import SettlementWorkflowView from '../components/SettlementWorkflowView';
import { 
  getDashboardSummary, 
  getOverdueAccounts, 
  reevaluateAccount, 
  simulatePayment 
} from '../services/api';
import { 
  Search, 
  Filter, 
  RotateCw, 
  FileText, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  ChevronRight,
  Shield,
  Car,
  Tag,
  Sparkles,
  Workflow,
  TrendingDown,
  Scale,
  Gavel,
  Warehouse,
  Layers,
  BadgePercent,
  ShieldAlert
} from 'lucide-react';

export default function Dashboard({ companyInfo }) {
  const [activeModule, setActiveModule] = useState('reguler');
  const [summary, setSummary] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState(null);
  const [filterQuery, setFilterQuery] = useState({
    bucket: '',
    actionPath: '',
    assignedPIC: '',
    search: '',
    status: '',
    recoveryStage: '',
  });
  const [selectedAccountForModal, setSelectedAccountForModal] = useState(null);
  const [selectedCustomerIdFor360, setSelectedCustomerIdFor360] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const sumRes = await getDashboardSummary();
      setSummary(sumRes.data.data);

      const params = {};
      if (filterQuery.bucket) params.bucket = filterQuery.bucket;
      if (filterQuery.actionPath) params.action_path = filterQuery.actionPath;
      if (filterQuery.assignedPIC) params.assigned_pic = filterQuery.assignedPIC;
      if (filterQuery.status) params.status = filterQuery.status;
      if (filterQuery.search) params.search = filterQuery.search;
      if (filterQuery.recoveryStage) params.recovery_stage = filterQuery.recoveryStage;

      const accRes = await getOverdueAccounts(params);
      setAccounts(accRes.data.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filterQuery]);

  const handleCellSelect = (cellInfo) => {
    setSelectedCell(cellInfo);
    if (cellInfo.isSeniorField) {
      setFilterQuery(prev => ({
        ...prev,
        actionPath: '',
        bucket: '',
        assignedPIC: 'Senior Field Collector'
      }));
    } else if (cellInfo.isVIP) {
      setFilterQuery(prev => ({
        ...prev,
        actionPath: 'VIP',
        bucket: '',
        assignedPIC: ''
      }));
    } else {
      setFilterQuery(prev => ({
        ...prev,
        actionPath: cellInfo.actionPath,
        bucket: cellInfo.bucket,
        assignedPIC: ''
      }));
    }
  };

  const handleResetFilter = () => {
    setSelectedCell(null);
    setFilterQuery({
      bucket: '',
      actionPath: '',
      assignedPIC: '',
      search: '',
      status: '',
      recoveryStage: '',
    });
  };

  const handleReevaluate = async (id) => {
    try {
      await reevaluateAccount(id, { is_champion: false });
      fetchDashboardData();
    } catch (err) {
      alert('Gagal evaluasi ulang: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleQuickPay = async (agreementNo, amount) => {
    if (window.confirm(`Simulasikan pelunasan angsuran untuk kontrak ${agreementNo}?`)) {
      try {
        await simulatePayment({ agreement_no: agreementNo, amount });
        fetchDashboardData();
      } catch (err) {
        alert('Gagal memproses pembayaran: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Enterprise Architecture Module Switcher */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveModule('reguler')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeModule === 'reguler'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Koleksi Reguler (Overdue Matrix)</span>
        </button>

        <button
          onClick={() => setActiveModule('pdm')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeModule === 'pdm'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Pre-Delinquency DPD 0 (PDM)</span>
          <span className={`px-1.5 py-0.2 rounded text-[10px] ${activeModule === 'pdm' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}>
            Early Warning
          </span>
        </button>

        <button
          onClick={() => setActiveModule('legal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeModule === 'legal'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Alur Hukum & Litigasi (Legal)</span>
          <span className={`px-1.5 py-0.2 rounded text-[10px] ${activeModule === 'legal' ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
            6 Tahapan
          </span>
        </button>

        <button
          onClick={() => setActiveModule('repo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeModule === 'repo'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
          }`}
        >
          <Warehouse className="w-4 h-4" />
          <span>Eksekusi Agunan & Lelang (Repo)</span>
          <span className={`px-1.5 py-0.2 rounded text-[10px] ${activeModule === 'repo' ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
            8 Tahapan
          </span>
        </button>

        <button
          onClick={() => setActiveModule('settlement')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeModule === 'settlement'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-600 hover:text-teal-600 hover:bg-teal-50'
          }`}
        >
          <BadgePercent className="w-4 h-4" />
          <span>Settlement & Diskon Pelunasan</span>
          <span className={`px-1.5 py-0.2 rounded text-[10px] ${activeModule === 'settlement' ? 'bg-teal-500 text-white' : 'bg-teal-100 text-teal-700'}`}>
            3 Skema
          </span>
        </button>
      </div>

      {/* Module 1: Koleksi Reguler (Overdue Matrix & Drilldown) */}
      {activeModule === 'reguler' && (
        <>
          {/* KPI Top Cards */}
          <KPICards summary={summary} />

          {/* Signature Interactive Matrix Table */}
          <BucketMatrixTable 
            matrixData={summary?.matrix} 
            onSelectCell={handleCellSelect} 
            selectedCell={selectedCell}
            generalNamaPT={summary?.general_nama_pt || companyInfo?.namaPT}
            generalSimbolPT={summary?.general_simbol_pt || companyInfo?.simbolPT}
          />

          {/* Drilldown Accounts Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Controls Header */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-slate-900">
                Daftar Akun Penagihan
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-200 text-slate-800 rounded-full">
                {accounts.length} Akun Ditemukan
              </span>
            </div>
            {selectedCell ? (
              <p className="text-xs text-indigo-600 font-semibold mt-1 flex items-center">
                {selectedCell.isSeniorField ? (
                  <span>Filter Aktif: <strong>Senior Field Collector (DPD &gt; 30)</strong></span>
                ) : selectedCell.isVIP ? (
                  <span>Filter Aktif: <strong>Special Team (Dedicated VIP)</strong></span>
                ) : (
                  <span>Filter Aktif: Grade <strong>{selectedCell.actionPath}</strong> | Bucket: <strong>{selectedCell.bucket}</strong> (Kanal: <strong>{selectedCell.pic}</strong>)</span>
                )}
                <button 
                  onClick={handleResetFilter}
                  className="ml-2 text-xs text-red-600 hover:underline font-bold"
                >
                  [Hapus Filter]
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-0.5">
                Menampilkan seluruh portofolio Retail terdaftar dalam CRMS
              </p>
            )}
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text"
                value={filterQuery.search}
                onChange={(e) => setFilterQuery(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Cari kontrak, nama, unit..."
                className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white w-48 sm:w-60 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <select
              value={filterQuery.status}
              onChange={(e) => setFilterQuery(prev => ({ ...prev, status: e.target.value }))}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-medium text-slate-700"
            >
              <option value="">Semua Status</option>
              <option value="OPEN">OPEN</option>
              <option value="PROMISE_TO_PAY">PROMISE TO PAY (PTP)</option>
              <option value="PAID">PAID</option>
            </select>

            <select
              value={filterQuery.recoveryStage}
              onChange={(e) => setFilterQuery(prev => ({ ...prev, recoveryStage: e.target.value }))}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-medium text-slate-700"
            >
              <option value="">Semua Tahapan Recovery</option>
              <option value="STAGE_COLLECTION">Koleksi Reguler (Omnichannel)</option>
              <option value="STAGE_SKIP_TRACING">Skip Tracing (Pelacakan)</option>
              <option value="STAGE_RESTRUCTURING">Restrukturisasi Kredit</option>
              <option value="STAGE_LEGAL_NOTICE">Somasi / Peringatan Hukum</option>
              <option value="STAGE_LITIGATION_AUCTION">Litigasi & Lelang Agunan</option>
              <option value="STAGE_SETTLEMENT">Settlement (Diskon/Pelunasan)</option>
              <option value="STAGE_CLOSED">Selesai / Lunas</option>
            </select>

            <button 
              onClick={fetchDashboardData}
              className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs hover:bg-slate-50"
              title="Refresh Data"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-3 py-3 text-center w-10">No.</th>
                <th className="px-4 py-3">No. Rekening & Debitur</th>
                <th className="px-3 py-3">Fasilitas Kredit & Agunan</th>
                <th className="px-3 py-3 text-center">DPD & Bucket</th>
                <th className="px-3 py-3">Nilai Tunggakan</th>
                <th className="px-3 py-3 text-center">Tahapan & Kanal Rekomendasi</th>
                <th className="px-3 py-3 text-center">Grup & AP</th>
                <th className="px-3 py-3 text-center">Risk Score</th>
                <th className="px-3 py-3 text-center">PIC Aktif</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-4 py-12 text-center text-slate-400">
                    Tidak ada akun tertunggak yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                accounts.map((acc, idx) => {
                  const isPaid = acc.status === 'PAID';
                  const isPTP = acc.status === 'PROMISE_TO_PAY';

                  return (
                    <tr key={acc.id} className="hover:bg-slate-50 transition">
                      {/* Nomor Urut Baris */}
                      <td className="px-3 py-3 text-center font-bold text-slate-400 text-[11px]">
                        {idx + 1}
                      </td>

                      {/* Kontrak & Debitur */}
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-900">{acc.agreement_no}</span>
                          {acc.agreement?.customer?.is_vip && (
                            <span className="px-1.5 py-0.2 text-[10px] font-black bg-purple-100 text-purple-700 rounded border border-purple-200">
                              VIP
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <button
                            onClick={() => setSelectedCustomerIdFor360(acc.agreement?.customer?.id || acc.agreement?.customer_id)}
                            className="text-left font-semibold text-slate-800 hover:text-indigo-600 flex items-center group text-[11px] transition"
                            title="Buka Profil Customer 360° & Skrip Penagihan"
                          >
                            <span>{acc.agreement?.customer?.name}</span>
                            <Sparkles className="w-3 h-3 ml-1 text-amber-500 opacity-80 group-hover:opacity-100" />
                          </button>
                        </div>
                        <p className="text-slate-400 text-[10px]">
                          {acc.agreement?.customer?.city} • {acc.agreement?.customer?.occupation || 'Nasabah Retail'}
                        </p>
                      </td>

                      {/* Kendaraan / Fasilitas */}
                      <td className="px-3 py-3">
                        <span className="font-semibold text-slate-800 block">
                          {acc.agreement?.asset_model}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {acc.agreement?.plate_no} | {acc.agreement?.lob}
                        </span>
                      </td>

                      {/* DPD & Bucket */}
                      <td className="px-3 py-3 text-center">
                        <span className="font-black text-slate-900 text-sm">{acc.dpd}</span>
                        <span className="text-slate-400 text-[11px] block">Hari</span>
                        <span className="inline-block mt-0.5 px-2 py-0.2 text-[10px] font-bold rounded bg-slate-100 text-slate-700">
                          {acc.current_bucket}
                        </span>
                      </td>

                      {/* Overdue Amount */}
                      <td className="px-3 py-3 font-semibold text-slate-900">
                        {formatRupiah(acc.overdue_amount)}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          Angs: {formatRupiah(acc.agreement?.installment_amount)}/bln
                        </span>
                      </td>

                      {/* Tahapan Recovery & Kanal Rekomendasi */}
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                          acc.recovery_stage === 'STAGE_SKIP_TRACING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          acc.recovery_stage === 'STAGE_RESTRUCTURING' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          acc.recovery_stage === 'STAGE_LEGAL_NOTICE' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          acc.recovery_stage === 'STAGE_LITIGATION_AUCTION' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          acc.recovery_stage === 'STAGE_SETTLEMENT' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          acc.recovery_stage === 'STAGE_CLOSED' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {acc.recovery_stage === 'STAGE_SKIP_TRACING' ? 'Skip Tracing' :
                           acc.recovery_stage === 'STAGE_RESTRUCTURING' ? 'Restrukturisasi' :
                           acc.recovery_stage === 'STAGE_LEGAL_NOTICE' ? 'Somasi Hukum' :
                           acc.recovery_stage === 'STAGE_LITIGATION_AUCTION' ? 'Litigasi/Lelang' :
                           acc.recovery_stage === 'STAGE_SETTLEMENT' ? 'Settlement' :
                           acc.recovery_stage === 'STAGE_CLOSED' ? 'Lunas' : 'Koleksi Reguler'}
                        </span>
                        {acc.recommended_channel && (
                          <div className="mt-1 flex items-center justify-center space-x-1">
                            <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              ⚡ {acc.recommended_channel.replace('_', ' ')}
                            </span>
                            {acc.cost_efficiency_rate > 0 && (
                              <span className="text-[9px] text-slate-500 font-bold" title="Tingkat Efisiensi Biaya Penagihan">
                                {Math.round(acc.cost_efficiency_rate)}% hemat
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Strategy Group & AP */}
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                          acc.strategy_group === 'CHAMPION' 
                            ? 'bg-slate-200 text-slate-800' 
                            : acc.strategy_group === 'CHALLENGER'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {acc.strategy_group}
                        </span>
                        <span className="block text-[11px] font-bold text-slate-700 mt-0.5">
                          AP {acc.action_path}
                        </span>
                      </td>

                      {/* Risk Score */}
                      <td className="px-3 py-3 text-center">
                        <div className="font-extrabold text-slate-900 text-sm">
                          {acc.risk_score}
                        </div>
                        <span className={`inline-block px-1.5 py-0.2 text-[9px] font-bold rounded ${
                          acc.risk_level === 'LOW_RISK'
                            ? 'bg-emerald-100 text-emerald-700'
                            : acc.risk_level === 'MEDIUM_RISK'
                            ? 'bg-amber-100 text-amber-700'
                            : acc.risk_level === 'HIGH_RISK'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {acc.risk_level?.replace('_RISK', '')}
                        </span>
                      </td>

                      {/* PIC Aktif */}
                      <td className="px-3 py-3 text-center">
                        <span className="font-black px-2.5 py-1 rounded text-xs inline-block bg-slate-900 text-white shadow-2xs">
                          {acc.assigned_pic}
                        </span>
                        <span className="block text-[10px] text-slate-500 font-medium mt-0.5">
                          {acc.pic_channel?.replace('_', ' ')}
                        </span>
                        {acc.last_contact_at ? (
                          <span className="block text-[9px] text-indigo-600 font-semibold mt-0.5" title={acc.notes || 'Riwayat aktivitas terdata'}>
                            Kontak: {new Date(acc.last_contact_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                        ) : (
                          <span className="block text-[9px] text-slate-400 mt-0.5">
                            Antrean Baru
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3 text-center">
                        {isPaid ? (
                          <span className="px-2 py-1 text-[11px] font-bold rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> LUNAS
                          </span>
                        ) : isPTP ? (
                          <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-amber-100 text-amber-800 block">
                            PTP {acc.ptp_date ? new Date(acc.ptp_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : ''}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-[11px] font-bold rounded-md bg-slate-100 text-slate-700">
                            OPEN
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedCustomerIdFor360(acc.agreement?.customer?.id || acc.agreement?.customer_id)}
                            className="px-2 py-1 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition flex items-center shadow-2xs"
                            title="Buka Customer 360° Exposure & Skrip Penagihan"
                          >
                            <Sparkles className="w-3 h-3 mr-1 text-indigo-600" />
                            360°
                          </button>
                          <button
                            onClick={() => setSelectedAccountForModal(acc)}
                            className="px-2.5 py-1 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition"
                            title="Catat log aktivitas penagihan"
                          >
                            Log PIC
                          </button>
                          {!isPaid && (
                            <button
                              onClick={() => handleQuickPay(acc.agreement_no, acc.overdue_amount)}
                              className="px-2 py-1 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md transition"
                              title="Simulasi pelunasan angsuran"
                            >
                              Bayar
                            </button>
                          )}
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
      </>
      )}

      {/* Module 2: Pre-Delinquency Management (PDM) DPD 0 Early Warning */}
      {activeModule === 'pdm' && (
        <PreDelinquencyView 
          onOpenCustomer360={(custId) => setSelectedCustomerIdFor360(custId)} 
        />
      )}

      {/* Module 3: Legal Recourse Management (6 Stages) */}
      {activeModule === 'legal' && (
        <LegalWorkflowView 
          onOpenCustomer360={(custId) => setSelectedCustomerIdFor360(custId)} 
        />
      )}

      {/* Module 4: Repossession & Auction Management (8 Stages) */}
      {activeModule === 'repo' && (
        <RepoWorkflowView 
          onOpenCustomer360={(custId) => setSelectedCustomerIdFor360(custId)} 
        />
      )}

      {/* Module 5: Settlement & Diskon Pelunasan (3 Types) */}
      {activeModule === 'settlement' && (
        <SettlementWorkflowView 
          onOpenCustomer360={(custId) => setSelectedCustomerIdFor360(custId)} 
        />
      )}

      {/* Modal Aktivitas */}
      {selectedAccountForModal && (
        <ActivityModal 
          account={selectedAccountForModal}
          onClose={() => setSelectedAccountForModal(null)}
          onSuccess={fetchDashboardData}
        />
      )}

      {/* Modal Customer 360 Exposure & Collections Lifecycle */}
      <Customer360Modal 
        isOpen={!!selectedCustomerIdFor360}
        customerId={selectedCustomerIdFor360}
        onClose={() => setSelectedCustomerIdFor360(null)}
        onActivityLogged={fetchDashboardData}
      />
    </div>
  );
}
