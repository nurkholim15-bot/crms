import React, { useState, useEffect } from 'react';
import { 
  getOverdueAccounts, 
  logActivity 
} from '../services/api';
import ActivityModal from '../components/ActivityModal';
import Customer360Modal from '../components/Customer360Modal';
import { 
  MessageSquare, 
  PhoneCall, 
  UserCheck, 
  MapPin, 
  FileCheck, 
  AlertOctagon, 
  Send, 
  CheckCircle2, 
  Calendar,
  Building,
  Car,
  Sparkles
} from 'lucide-react';

export default function OperationsWorkbench({ companyInfo }) {
  const [selectedChannel, setSelectedChannel] = useState('WA');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccountForModal, setSelectedAccountForModal] = useState(null);
  const [selectedCustomerIdFor360, setSelectedCustomerIdFor360] = useState(null);
  const [waSendingState, setWaSendingState] = useState({});

  const channels = [
    { id: 'WA', name: 'WhatsApp (WA)', group: 'AUTOMATION', pic: 'WA', icon: MessageSquare, color: 'text-emerald-700 bg-emerald-50' },
    { id: 'Robot', name: 'Robot System', group: 'AUTOMATION', pic: 'Robot', icon: PhoneCall, color: 'text-sky-700 bg-sky-50' },
    { id: 'DC', name: 'Desk Collector (DC)', group: 'HEAD OFFICE', pic: 'DC', icon: UserCheck, color: 'text-teal-700 bg-teal-50' },
    { id: 'FC', name: 'Field Collector (FC)', group: 'BRANCH', pic: 'FC', icon: MapPin, color: 'text-amber-700 bg-amber-50' },
    { id: 'SFC', name: 'Senior Field (SFC)', group: 'BRANCH', pic: 'SFC', icon: AlertOctagon, color: 'text-orange-700 bg-orange-50' },
    { id: 'Senior Field Collector', name: 'Senior Field (>30 DPD)', group: 'ESCALATION', pic: 'Senior Field Collector', icon: Building, color: 'text-rose-800 bg-rose-50' },
    { id: 'Special Team', name: 'Special Team (VIP)', group: 'VIP HEAD', pic: 'Special Team', icon: FileCheck, color: 'text-purple-700 bg-purple-50' },
  ];

  const fetchChannelAccounts = async () => {
    setLoading(true);
    try {
      const res = await getOverdueAccounts({ assigned_pic: selectedChannel });
      setAccounts(res.data.data);
    } catch (err) {
      console.error('Error fetching channel accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelAccounts();
  }, [selectedChannel]);

  const handleSimulateWABlast = async (account) => {
    setWaSendingState(prev => ({ ...prev, [account.id]: 'sending' }));
    try {
      await logActivity({
        overdue_account_id: account.id,
        agreement_no: account.agreement_no,
        channel_type: 'WA',
        performed_by: 'WhatsApp_Engine_AutoBot',
        contact_status: 'WA_DELIVERED',
        result_code: 'MESSAGE_SENT',
        notes: `Pesan pengingat otomatis terkirim ke WhatsApp ${account.agreement?.customer?.phone} beserta link pembayaran Virtual Account ${companyInfo?.simbolPT || 'CRMS'}.`,
      });
      setWaSendingState(prev => ({ ...prev, [account.id]: 'sent' }));
      setTimeout(() => {
        setWaSendingState(prev => ({ ...prev, [account.id]: null }));
        fetchChannelAccounts();
      }, 2000);
    } catch (err) {
      alert('Gagal mengirim WA: ' + err.message);
      setWaSendingState(prev => ({ ...prev, [account.id]: null }));
    }
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Workbench Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Kanal Operasional Penanganan (PIC Workbench)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Eksekusi penagihan terintegrasi: WhatsApp Bot, Telephony Desk, Kunjungan Lapangan, & Penyelesaian Aset
          </p>
        </div>
      </div>

      {/* Channel Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {channels.map((ch) => {
          const Icon = ch.icon;
          const isSelected = selectedChannel === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => setSelectedChannel(ch.id)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'border-red-600 bg-red-50/70 shadow-sm ring-2 ring-red-500/30'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${ch.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                  {ch.group}
                </span>
              </div>
              <div className="mt-3">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {ch.name}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  PIC Code: <strong className="text-slate-800">{ch.pic}</strong>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Accounts List for the Active Channel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-sm text-slate-900">
              Antrean Tugas Kanal {selectedChannel}
            </span>
            <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded-full">
              {accounts.length} Akun
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Kategori: <strong>{channels.find(c => c.id === selectedChannel)?.group}</strong>
          </span>
        </div>

        {/* Channel Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-bold text-[11px]">
              <tr>
                <th className="px-3 py-3 text-center w-10">No.</th>
                <th className="px-4 py-3">No. Rekening & Debitur</th>
                <th className="px-3 py-3">Fasilitas Kredit & Agunan</th>
                <th className="px-3 py-3 text-center">DPD & Bucket</th>
                <th className="px-3 py-3">Nilai Tunggakan</th>
                <th className="px-3 py-3 text-center">Strategi AP</th>
                <th className="px-3 py-3 text-center">Status PTP / Kontak</th>
                <th className="px-4 py-3 text-right">Tindakan Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center text-slate-400">
                    Tidak ada akun tertunggak yang saat ini ditugaskan ke kanal {selectedChannel}.
                  </td>
                </tr>
              ) : (
                accounts.map((acc, idx) => {
                  const isSendingWA = waSendingState[acc.id] === 'sending';
                  const isSentWA = waSendingState[acc.id] === 'sent';

                  return (
                    <tr key={acc.id} className="hover:bg-slate-50 transition">
                      <td className="px-3 py-3 text-center font-bold text-slate-400 text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 block">{acc.agreement_no}</span>
                        <button
                          onClick={() => setSelectedCustomerIdFor360(acc.agreement?.customer?.id || acc.agreement?.customer_id)}
                          className="text-left font-semibold text-slate-800 hover:text-indigo-600 flex items-center group text-xs transition"
                          title="Buka Profil Customer 360° & Skrip Penagihan"
                        >
                          <span>{acc.agreement?.customer?.name}</span>
                          <Sparkles className="w-3 h-3 ml-1 text-amber-500 opacity-80 group-hover:opacity-100" />
                        </button>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {acc.agreement?.customer?.phone}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <span className="font-semibold text-slate-800 block">
                          {acc.agreement?.asset_model}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {acc.agreement?.plate_no}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-center">
                        <span className="font-black text-slate-900 text-sm block">{acc.dpd} Hari</span>
                        <span className="px-2 py-0.2 text-[10px] font-bold rounded bg-slate-100 text-slate-700">
                          {acc.current_bucket}
                        </span>
                      </td>

                      <td className="px-3 py-3 font-semibold text-slate-900">
                        {formatRupiah(acc.overdue_amount)}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          Angs: {formatRupiah(acc.agreement?.installment_amount)}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-center">
                        <span className="font-extrabold text-slate-800 block">
                          AP {acc.action_path}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {acc.strategy_group}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-center">
                        {acc.status === 'PROMISE_TO_PAY' ? (
                          <div className="text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                            <span className="font-bold block text-[10px]">PTP: {acc.ptp_date ? new Date(acc.ptp_date).toLocaleDateString('id-ID') : '-'}</span>
                            <span className="text-[9px] text-amber-700">{formatRupiah(acc.ptp_amount)}</span>
                          </div>
                        ) : acc.status === 'PAID' ? (
                          <span className="px-2 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">
                            LUNAS
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px] font-medium">
                            Menunggu Tindakan
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedCustomerIdFor360(acc.agreement?.customer?.id || acc.agreement?.customer_id)}
                            className="px-2 py-1 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition flex items-center shadow-2xs"
                            title="Buka Customer 360° Exposure & Skrip Panduan"
                          >
                            <Sparkles className="w-3 h-3 mr-1 text-indigo-600" />
                            360°
                          </button>

                          {selectedChannel === 'WA' && (
                            <button
                              onClick={() => handleSimulateWABlast(acc)}
                              disabled={isSendingWA || isSentWA}
                              className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center transition ${
                                isSentWA 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-2xs'
                              }`}
                            >
                              {isSendingWA ? 'Mengirim...' : isSentWA ? 'Terkirim ✓' : (
                                <>
                                  <Send className="w-3 h-3 mr-1" /> Blast WA
                                </>
                              )}
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedAccountForModal(acc)}
                            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          >
                            Catat Hasil PIC
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

      {/* Modal Aktivitas */}
      {selectedAccountForModal && (
        <ActivityModal 
          account={selectedAccountForModal}
          onClose={() => setSelectedAccountForModal(null)}
          onSuccess={fetchChannelAccounts}
        />
      )}

      {/* Modal Customer 360 Exposure & Collections Lifecycle */}
      <Customer360Modal 
        isOpen={!!selectedCustomerIdFor360}
        customerId={selectedCustomerIdFor360}
        onClose={() => setSelectedCustomerIdFor360(null)}
        onActivityLogged={fetchChannelAccounts}
      />
    </div>
  );
}
