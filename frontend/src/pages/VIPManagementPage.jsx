import React, { useState, useEffect } from 'react';
import { getVIPAccounts, assignVIPAction } from '../services/api';
import Customer360Modal from '../components/Customer360Modal';
import { 
  ShieldAlert, 
  Crown, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Clock
} from 'lucide-react';

export default function VIPManagementPage({ companyInfo }) {
  const [vipAccounts, setVipAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [selectedCustomerIdFor360, setSelectedCustomerIdFor360] = useState(null);
  const [actionPlan, setActionPlan] = useState('Personal Executive Visit');
  const [specialist, setSpecialist] = useState('Senior Relationship Manager (Branch Head)');
  const [ptpDate, setPtpDate] = useState('');
  const [ptpAmount, setPtpAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVIPs = async () => {
    setLoading(true);
    try {
      const res = await getVIPAccounts();
      setVipAccounts(res.data.data);
    } catch (err) {
      console.error('Error fetching VIP accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVIPs();
  }, []);

  const handleOpenActionModal = (acc) => {
    setSelectedAcc(acc);
    setPtpAmount(acc.agreement?.installment_amount || '');
    setNotes('');
  };

  const handleSubmitAction = async (e) => {
    e.preventDefault();
    if (!selectedAcc) return;

    setIsSubmitting(true);
    try {
      const payload = {
        action_plan: actionPlan,
        assigned_specialist: specialist,
        notes: notes,
      };
      if (ptpDate) {
        payload.ptp_date = new Date(ptpDate).toISOString();
        payload.ptp_amount = parseFloat(ptpAmount) || 0;
      }

      await assignVIPAction(selectedAcc.agreement_no, payload);
      alert('Tindakan khusus AR Head untuk nasabah VIP berhasil disimpan!');
      setSelectedAcc(null);
      fetchVIPs();
    } catch (err) {
      alert('Gagal menyimpan tindakan VIP: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner Khusus VIP AR Head */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-purple-500/20 text-purple-300 rounded-xl">
              <Crown className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl font-black">Portal Manajemen Nasabah VIP (AR Head Exclusive)</h2>
              <p className="text-purple-200 text-xs mt-0.5">
                Protokol Eksklusif Penanganan Portofolio Bernilai Tinggi & Korporasi Personal Guarantee {companyInfo?.simbolPT || 'CRMS'}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-4 text-xs">
            <span className="flex items-center text-amber-300 font-semibold">
              <ShieldAlert className="w-4 h-4 mr-1 text-amber-300" />
              Auto-Blast Diblokir (Perlindungan Reputasi)
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">
              Wewenang Penanganan Mutlak di Bawah <strong>AR Head</strong>
            </span>
          </div>
        </div>

        <div className="mt-4 md:mt-0 bg-white/10 px-5 py-3 rounded-xl border border-white/10 text-center">
          <span className="text-[11px] text-purple-200 block uppercase font-bold tracking-wider">Total Akun VIP</span>
          <span className="text-2xl font-black text-amber-300">{vipAccounts.length} Akun</span>
        </div>
      </div>

      {/* VIP Accounts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <span className="font-extrabold text-sm text-slate-900">
            Daftar Akun Portofolio VIP Terdaftar
          </span>
          <span className="text-xs text-slate-500">
            Semua penugasan PIC wajib diverifikasi oleh AR Head
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-bold text-[11px]">
              <tr>
                <th className="px-3 py-3 text-center w-10">No.</th>
                <th className="px-4 py-3">No. Rekening & Nama Debitur VIP</th>
                <th className="px-3 py-3">Fasilitas Kredit & Agunan</th>
                <th className="px-3 py-3 text-center">DPD & Bucket</th>
                <th className="px-3 py-3">Total Plafon Pinjaman</th>
                <th className="px-3 py-3">Nilai Overdue</th>
                <th className="px-3 py-3 text-center">PIC Saat Ini</th>
                <th className="px-3 py-3 text-center">Status / Catatan AR Head</th>
                <th className="px-4 py-3 text-right">Aksi AR Head</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {vipAccounts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-12 text-center text-slate-400">
                    Tidak ada akun nasabah VIP yang tertunggak saat ini.
                  </td>
                </tr>
              ) : (
                vipAccounts.map((acc, idx) => (
                  <tr key={acc.id} className="hover:bg-purple-50/40 transition">
                    <td className="px-3 py-3 text-center font-bold text-slate-400 text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1.5">
                        <Crown className="w-3.5 h-3.5 text-amber-500 inline" />
                        <button
                          onClick={() => setSelectedCustomerIdFor360(acc.agreement?.customer?.id || acc.agreement?.customer_id)}
                          className="font-bold text-slate-900 hover:text-purple-700 flex items-center group text-xs text-left"
                          title="Buka Customer 360° Exposure VIP"
                        >
                          <span>{acc.agreement?.customer?.name}</span>
                          <Sparkles className="w-3 h-3 ml-1 text-amber-500 opacity-80 group-hover:opacity-100" />
                        </button>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono block">
                        {acc.agreement_no} | {acc.agreement?.customer?.phone}
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
                      <span className="font-black text-purple-950 text-sm block">{acc.dpd} Hari</span>
                      <span className="px-2 py-0.2 text-[10px] font-bold rounded bg-purple-100 text-purple-800">
                        {acc.current_bucket}
                      </span>
                    </td>

                    <td className="px-3 py-3 font-medium text-slate-700">
                      {formatRupiah(acc.agreement?.total_financing)}
                    </td>

                    <td className="px-3 py-3 font-bold text-red-600">
                      {formatRupiah(acc.overdue_amount)}
                    </td>

                    <td className="px-3 py-3 text-center">
                      <span className="px-2.5 py-1 text-xs font-black rounded-md bg-purple-900 text-white shadow-xs">
                        AR Head
                      </span>
                    </td>

                    <td className="px-3 py-3 text-center">
                      {acc.status === 'PROMISE_TO_PAY' ? (
                        <div className="text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200 text-left">
                          <span className="font-bold block text-[10px]">PTP VIP: {acc.ptp_date ? new Date(acc.ptp_date).toLocaleDateString('id-ID') : '-'}</span>
                          <span className="text-[9px] text-amber-700">{formatRupiah(acc.ptp_amount)}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 truncate max-w-xs block" title={acc.notes}>
                          {acc.notes || 'Menunggu Instruksi AR Head'}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedCustomerIdFor360(acc.agreement?.customer?.id || acc.agreement?.customer_id)}
                          className="px-2.5 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg shadow-2xs transition flex items-center"
                          title="Lihat Customer 360° Exposure & Portofolio"
                        >
                          <Sparkles className="w-3 h-3 mr-1 text-indigo-600" />
                          360°
                        </button>
                        <button
                          onClick={() => handleOpenActionModal(acc)}
                          className="px-3 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm transition"
                        >
                          Instruksi AR Head
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Instruksi AR Head */}
      {selectedAcc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col my-auto">
            <div className="bg-purple-950 text-white p-4 sm:p-5 flex justify-between items-center gap-2">
              <div>
                <h3 className="font-bold text-sm sm:text-base flex items-center">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-400 shrink-0" />
                  Instruksi Khusus AR Head (VIP)
                </h3>
                <p className="text-xs text-purple-300 mt-0.5 truncate max-w-[240px] sm:max-w-none">
                  Nasabah: <strong className="text-white">{selectedAcc.agreement?.customer?.name}</strong> ({selectedAcc.agreement_no})
                </p>
              </div>
              <button onClick={() => setSelectedAcc(null)} className="text-purple-300 hover:text-white p-1 rounded-lg shrink-0 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAction} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Rencana Tindakan Eksklusif</label>
                <select 
                  value={actionPlan} 
                  onChange={(e) => setActionPlan(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 font-medium"
                >
                  <option value="Personal Executive Visit (Branch Head / AR Head)">Personal Executive Visit (Branch Head / AR Head)</option>
                  <option value="Executive Call Bilateral Negotiation">Executive Call Bilateral Negotiation</option>
                  <option value="Special Interest & Penalty Waiver Settlement">Diskon Denda / Pelunasan Khusus (Settlement)</option>
                  <option value="Tenor Extension & Restructuring Offer">Restrukturisasi Perpanjangan Tenor</option>
                  <option value="Assign to Senior Corporate Collection Specialist">Tugaskan Senior Corporate Specialist</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pejabat / Specialist yang Ditugaskan</label>
                <input 
                  type="text" 
                  value={specialist} 
                  onChange={(e) => setSpecialist(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                  required
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-2">
                <span className="font-bold text-purple-950 block">Komitmen Janji Bayar Khusus (Opsional)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-purple-900 block mb-0.5">Tanggal Janji Bayar</label>
                    <input 
                      type="date" 
                      value={ptpDate} 
                      onChange={(e) => setPtpDate(e.target.value)}
                      className="w-full border border-purple-300 rounded-md p-1.5 bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-purple-900 block mb-0.5">Nominal (Rp)</label>
                    <input 
                      type="number" 
                      value={ptpAmount} 
                      onChange={(e) => setPtpAmount(e.target.value)}
                      placeholder="Contoh: 15000000"
                      className="w-full border border-purple-300 rounded-md p-1.5 bg-white font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Catatan Tambahan & Instruksi Khusus</label>
                <textarea 
                  rows="3" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan pendekatan personal atau kesepakatan bilateral..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-medium"
                ></textarea>
              </div>

              <div className="pt-2 flex flex-wrap sm:flex-nowrap justify-end gap-2 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setSelectedAcc(null)}
                  className="w-full sm:w-auto px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Terapkan Instruksi VIP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Customer 360 Exposure & Collections Lifecycle */}
      <Customer360Modal 
        isOpen={!!selectedCustomerIdFor360}
        customerId={selectedCustomerIdFor360}
        onClose={() => setSelectedCustomerIdFor360(null)}
        onActivityLogged={fetchVIPs}
      />
    </div>
  );
}
