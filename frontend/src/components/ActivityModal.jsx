import React, { useState } from 'react';
import { X, Calendar, DollarSign, MapPin, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { logActivity } from '../services/api';

const QUICK_NOTE_TEMPLATES = [
  { label: '⚡ Janji Bayar VA', text: 'Debitur berjanji melakukan pembayaran angsuran via Virtual Account resmi sebelum pukul 17:00 WIB.' },
  { label: '🏛️ ASN Rapel Tukin', text: 'Debitur ASN Pemprov DKI konfirmasi pembayaran tertunda menunggu rapel Tunjangan Kinerja (Tukin) tgl 15.' },
  { label: '📞 Telepon Terhubung', text: 'Panggilan terhubung dengan debitur. Konfirmasi kendala autodebet teratasi dan rincian VA telah dikirimkan.' },
  { label: '📍 Kunjungan FO', text: 'Kunjungan fisik FO ke domisili/usaha: Usaha operasional aktif, debitur kooperatif menyetujui jadwal pembayaran.' },
  { label: '🔄 Ajukan Relaksasi', text: 'Debitur memohon restrukturisasi kredit (keringanan angsuran / perpanjangan tenor) akibat penurunan kapasitas arus kas.' },
  { label: '❌ Tidak Diangkat', text: 'Telepon berdering namun tidak diangkat. Rincian kewajiban dan nomor VA telah diteruskan via WhatsApp debitur.' }
];

export default function ActivityModal({ account, onClose, onSuccess }) {
  const getDefaultPtpDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const defaultNote = account.notes 
    ? `Follow-up lanjutan: ${account.notes}` 
    : `Follow-up penagihan kanal ${account.assigned_pic || 'Desk Collection'} untuk keterlambatan DPD ${account.dpd || 0} hari. Nasabah terkonfirmasi dan diarahkan ke Virtual Account resmi.`;

  const [channelType, setChannelType] = useState(account.assigned_pic || 'DERO');
  const [contactStatus, setContactStatus] = useState('CONTACTED');
  const [resultCode, setResultCode] = useState('PTP_MADE');
  const [ptpDate, setPtpDate] = useState(getDefaultPtpDate());
  const [ptpAmount, setPtpAmount] = useState(account.overdue_amount || account.agreement?.installment_amount || '');
  const [notes, setNotes] = useState(defaultNote);
  const [performedBy, setPerformedBy] = useState(`Officer_${account.assigned_pic || 'Collection'}_01`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!account) return null;

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        overdue_account_id: account.id,
        agreement_no: account.agreement_no,
        channel_type: channelType,
        performed_by: performedBy,
        contactStatus: contactStatus,
        result_code: resultCode,
        notes: notes,
        geo_lat: -6.2088,
        geo_lng: 106.8456,
      };

      if (resultCode === 'PTP_MADE' && ptpDate) {
        payload.ptp_date = new Date(ptpDate).toISOString();
        payload.ptp_amount = parseFloat(ptpAmount) || 0;
      }

      await logActivity(payload);
      onSuccess();
      onClose();
    } catch (err) {
      alert('Gagal mencatat aktivitas: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col my-auto">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex justify-between items-center gap-2">
          <div>
            <h3 className="font-bold text-sm sm:text-base flex items-center space-x-2">
              <span>Log Aktivitas Penagihan CRMS</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate max-w-[240px] sm:max-w-none">
              Kontrak: <strong className="text-white">{account.agreement_no}</strong> | {account.agreement?.customer?.name}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Debitur Overview Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <span className="text-slate-400 block text-[10px]">Tunggakan Overdue</span>
            <span className="font-extrabold text-red-600 text-xs">{formatRupiah(account.overdue_amount)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Keterlambatan</span>
            <span className="font-bold text-slate-800 text-xs">{account.dpd} Hari (Bucket {account.current_bucket})</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">PIC Ditugaskan</span>
            <span className="font-bold text-slate-800 text-xs truncate block">{account.assigned_pic} • {account.recovery_stage || 'COLLECTION'}</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kanal Penanganan (PIC)</label>
              <select 
                value={channelType} 
                onChange={(e) => setChannelType(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 font-medium"
              >
                <option value="WA">WA (WhatsApp Engine)</option>
                <option value="ROBO">ROBO (Robo Call)</option>
                <option value="DERO">DERO (Desk Relationship)</option>
                <option value="FO">FO (Field Officer)</option>
                <option value="FRO">FRO (Field Repossession)</option>
                <option value="RSO">RSO (Recovery & Solution)</option>
                <option value="RRO">RRO (Remedial & Recovery)</option>
                <option value="AR Head">AR Head (VIP Exclusive)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Petugas / Sistem</label>
              <input 
                type="text" 
                value={performedBy} 
                onChange={(e) => setPerformedBy(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Status Kontak</label>
              <select 
                value={contactStatus} 
                onChange={(e) => setContactStatus(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 font-medium"
              >
                <option value="CONTACTED">Berhasil Terhubung (Contacted)</option>
                <option value="UNREACHABLE">Tidak Dapat Dihubungi</option>
                <option value="VISITED">Terkunjungi di Lokasi</option>
                <option value="REFUSED">Menolak Berkomunikasi</option>
                <option value="UNIT_CHECKED">Aset Agunan / Usaha Terverifikasi</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Hasil Akhir (Result)</label>
              <select 
                value={resultCode} 
                onChange={(e) => setResultCode(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 font-medium"
              >
                <option value="PTP_MADE">Janji Bayar (Promise to Pay)</option>
                <option value="FOLLOW_UP_REQUIRED">Perlu Follow-up Lanjutan</option>
                <option value="PAID">Sudah Dilunasi / Transfer</option>
                <option value="ESCALATE_TO_FIELD">Eskalasi ke Kunjungan FO</option>
                <option value="ESCALATE_TO_FRO">Eskalasi ke Litigasi / Eksekusi Agunan</option>
                <option value="RESTRUCTURE_PROPOSED">Pengajuan Restrukturisasi Kredit</option>
              </select>
            </div>
          </div>

          {/* Conditional PTP Section */}
          {resultCode === 'PTP_MADE' && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
              <span className="font-bold text-amber-900 block flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-amber-700" />
                Komitmen Janji Bayar (PTP)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-amber-800 block mb-0.5">Tanggal Janji Bayar</label>
                  <input 
                    type="date" 
                    value={ptpDate} 
                    onChange={(e) => setPtpDate(e.target.value)}
                    className="w-full border border-amber-300 rounded-md p-1.5 bg-white font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-amber-800 block mb-0.5">Nominal Janji (Rp)</label>
                  <input 
                    type="number" 
                    value={ptpAmount} 
                    onChange={(e) => setPtpAmount(e.target.value)}
                    className="w-full border border-amber-300 rounded-md p-1.5 bg-white font-semibold"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Catatan Negosiasi / Berita Acara</label>
              <span className="text-[10px] text-slate-400">Pilih template cepat di bawah:</span>
            </div>

            {/* Quick Template Chips */}
            <div className="flex flex-wrap gap-1 mb-2">
              {QUICK_NOTE_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNotes(tmpl.text)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-medium border border-slate-200 transition"
                  title="Klik untuk mengisi catatan otomatis"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>

            <textarea 
              rows="3" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Masukkan detail komunikasi, alasan menunggak, komitmen debitur, atau kondisi usaha/agunan..."
              className="w-full border border-slate-300 rounded-lg p-2.5 font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
              required
            ></textarea>
          </div>

          {/* Anti-Fraud Geotagging & Server Timestamp Strip */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-600">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>GPS Geotag: <strong className="text-slate-800">-6.2088, 106.8456</strong></span>
              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold text-[9px]">Anti-Fraud</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
              <Clock className="w-3 h-3" />
              <span>NTP Timestamp</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap sm:flex-nowrap justify-end gap-2 border-t border-slate-200">
            <button 
              type="button" 
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Log Aktivitas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
