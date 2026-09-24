import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Crown, 
  Layers, 
  ShieldAlert, 
  CreditCard, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  FileText, 
  Share2, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  Send, 
  Copy, 
  ChevronRight, 
  X,
  Sparkles,
  Search,
  Scale,
  Gavel,
  RefreshCw,
  Building,
  Edit3,
  Save,
  Zap,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { 
  getCustomerExposure360, 
  updateRecoveryStage, 
  updateCustomerPhone, 
  sendCustomerWhatsApp 
} from '../services/api';

const STAGES_CONFIG = {
  STAGE_COLLECTION: {
    stageNumber: 1,
    title: 'Koleksi Reguler (Desk & Field Collection)',
    shortTitle: 'Reguler Desk/Field',
    color: 'slate',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    criteria: 'DPD 1–30 (Early Delinquency / Kol-1 s/d Kol-2 awal). Debitur dalam antrean penagihan harian standar.',
    sop: 'Reminder digital otomatis via WhatsApp AI & Robo Call pada DPD 1–7. Dilanjutkan panggilan telepon intensif (DERO) dan verifikasi nomor rekening Virtual Account.',
    docs: 'Digital Reminder Notification, Catatan Interaksi CRM, dan Rekaman Konfirmasi PTP.',
    actionBadge: 'Kanal Biaya Ringan (Efisiensi 95%)'
  },
  STAGE_SKIP_TRACING: {
    stageNumber: 2,
    title: 'Skip Tracing (Pelacakan Kontak & Lokasi)',
    shortTitle: 'Skip Tracing',
    color: 'amber',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    criteria: 'Debitur tidak dapat dihubungi (Unreachable / No Contact) ≥ 7 hari berturut-turut, nomor HP tidak aktif/dialihkan, atau pindah domisili tanpa lapor bank.',
    sop: 'Investigasi kontak darurat (Emergency Contact), pengecekan HRD/SK PNS tempat kerja, penelusuran data kependudukan Dukcapil/SLIK OJK, dan verifikasi geo-koordinat lokasi baru.',
    docs: 'Berita Acara Hasil Pelacakan (BAHP), Form Pemutakhiran Kontak CIF, Surat Konfirmasi Domisili.',
    actionBadge: 'Spesialis Skip Tracer'
  },
  STAGE_RESTRUCTURING: {
    stageNumber: 3,
    title: 'Restrukturisasi Kredit (Relaksasi 3R)',
    shortTitle: 'Restrukturisasi',
    color: 'blue',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    criteria: 'DPD 15–90, debitur memiliki kemauan membayar (willingness to pay) tinggi tapi mengalami penurunan arus kas/omzet usaha (penurunan kapasitas finansial).',
    sop: 'Analisis kelayakan kredit oleh Credit Analyst, simulasi 3R (Rescheduling perpanjangan tenor, Reconditioning penurunan suku bunga & grace period, Restructuring perataan pokok).',
    docs: 'Surat Permohonan Relaksasi Debitur, Nota Analisis Kredit Penyehatan, Addendum Perjanjian Kredit (PK) Baru.',
    actionBadge: 'Analisis Tim Kredit'
  },
  STAGE_LEGAL_NOTICE: {
    stageNumber: 4,
    title: 'Surat Peringatan (SP 1-3) & Somasi Hukum',
    shortTitle: 'SP & Somasi',
    color: 'rose',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    criteria: 'DPD 30–60 (Kol-2 s/d Kol-3), ingkar janji bayar (Broken PTP) berulang, debitur tidak kooperatif.',
    sop: 'Penerbitan berjenjang: SP-1 (DPD 30), Jeda wajib 14 hari kalender sesuai regulasi hukum perbankan, SP-2 (DPD 45), dan SP-3/Somasi Terakhir (DPD 60) via Pos Tercatat / Ekspedisi Resmi.',
    docs: 'Surat Peringatan I/II/III Bertanda Tangan Pejabat Berwenang, Resi Pos Tercatat Berita Acara Penerimaan, Surat Somasi Legal.',
    actionBadge: 'Legal Recovery Officer'
  },
  STAGE_LITIGATION_AUCTION: {
    stageNumber: 5,
    title: 'Litigasi & Lelang Eksekusi Agunan',
    shortTitle: 'Eksekusi Agunan',
    color: 'purple',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    criteria: 'DPD > 90 hari (Kolektibilitas 4 & 5 / NPL Macet Total), penagihan persuasif tidak berhasil, debitur wanprestasi.',
    sop: 'Pendaftaran lelang eksekusi Hak Tanggungan (UUHT No. 4/1996) / Fidusia ke KPKNL atau Balai Lelang Resmi, appraisal ulang nilai agunan, pengumuman lelang koran nasional, eksekusi.',
    docs: 'Surat Permohonan Lelang KPKNL, Bukti Pengumuman Koran Nasional, Risalah Lelang Resmi, Akta Risalah Penjualan Agunan.',
    actionBadge: 'Balai Lelang & KPKNL'
  },
  STAGE_SETTLEMENT: {
    stageNumber: 6,
    title: 'Settlement Khusus & Haircut Pelunasan',
    shortTitle: 'Settlement Haircut',
    color: 'emerald',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    criteria: 'Debitur Kol 4 & 5 (Macet) atau portofolio Hapus Buku (Write-Off) yang memiliki dana tunai untuk pelunasan sekaligus (lump-sum payment).',
    sop: 'Pengajuan persetujuan diskon denda hingga 100%, diskon bunga tunggakan, atau haircut sebagian pokok pinjaman sesuai matriks kewenangan komite kredit.',
    docs: 'Surat Persetujuan Pelunasan Khusus (SPPK), Bukti Setor Pelunasan, Surat Keterangan Lunas (SKL), Dokumen Roya Hak Tanggungan BPN.',
    actionBadge: 'AR Head Settlement Approval'
  }
};

export default function Customer360Modal({ customerId, isOpen, onClose, onActivityLogged, onOpenActivityModal }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('facilities'); // 'facilities', 'script', 'workflow', 'timeline'
  const [copied, setCopied] = useState(false);

  // Workflow update form state
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [targetStage, setTargetStage] = useState('STAGE_SKIP_TRACING');
  const [stageReason, setStageReason] = useState('');
  const [stageNotes, setStageNotes] = useState('');
  const [updatingStage, setUpdatingStage] = useState(false);
  const [stageSuccessMsg, setStageSuccessMsg] = useState('');
  const [inspectedStage, setInspectedStage] = useState(null);

  // Phone editing state for testing
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);
  const [phoneSuccessMsg, setPhoneSuccessMsg] = useState('');

  // WhatsApp Gateway Dispatch state (Kopkara-EWA module)
  const [sendingWA, setSendingWA] = useState(false);
  const [waResultMsg, setWaResultMsg] = useState(null);

  useEffect(() => {
    if (isOpen && customerId) {
      fetchCustomer360();
    }
  }, [isOpen, customerId]);

  const fetchCustomer360 = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCustomerExposure360(customerId);
      setData(res.data.data);
      if (res.data.data?.phone) {
        setPhoneInput(res.data.data.phone);
      }
      if (res.data.data?.primary_stage) {
        setInspectedStage(res.data.data.primary_stage);
      }
      if (res.data.data?.facilities?.length > 0) {
        const overdueFacility = res.data.data.facilities.find(f => f.is_overdue);
        if (overdueFacility) {
          setSelectedAccountId(overdueFacility.overdue_account_id);
        } else {
          setSelectedAccountId(res.data.data.facilities[0].overdue_account_id);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memuat data Customer 360°');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePhone = async () => {
    if (!phoneInput.trim()) return;
    try {
      setSavingPhone(true);
      await updateCustomerPhone(customerId, phoneInput.trim());
      setData(prev => ({ ...prev, phone: phoneInput.trim() }));
      setIsEditingPhone(false);
      setPhoneSuccessMsg('Nomor WhatsApp berhasil diperbarui');
      setTimeout(() => setPhoneSuccessMsg(''), 3500);
      if (onActivityLogged) onActivityLogged();
    } catch (err) {
      alert('Gagal memperbarui nomor HP: ' + (err.response?.data?.error || err.message));
    } finally {
      setSavingPhone(false);
    }
  };

  const handleUpdateStage = async (e) => {
    e.preventDefault();
    if (!selectedAccountId) return;
    try {
      setUpdatingStage(true);
      setStageSuccessMsg('');
      await updateRecoveryStage(selectedAccountId, {
        recovery_stage: targetStage,
        reason: stageReason,
        notes: stageNotes,
        performed_by: 'CRMS_SPECIALIST'
      });
      setStageSuccessMsg(`Tahapan berhasil dialihkan ke ${getStageLabel(targetStage)}`);
      setStageReason('');
      setStageNotes('');
      // Refresh 360 view
      fetchCustomer360();
      if (onActivityLogged) onActivityLogged();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal memperbarui tahapan penanganan');
    } finally {
      setUpdatingStage(false);
    }
  };

  const script = data?.script_guidance || data?.scriptGuidance || {};
  const timelineActivities = data?.timeline_activities || data?.timelineActivities || [];

  const getFullScriptText = () => {
    const greeting = script.opening_greeting || script.openingGreeting || '';
    const obligation = script.obligation_detail || script.obligationDetail || '';
    const negotiation = script.negotiation_tactic || script.negotiationTactic || '';
    const closing = script.closing_commitment || script.closingCommitment || '';
    return `${greeting}\n\n${obligation}\n\n${negotiation}\n\n${closing}\n\nMohon konfirmasi pembayaran atau hubungi kami untuk informasi nomor Virtual Account.\n\nTerima kasih.`;
  };

  const handleCopyScript = () => {
    const scriptText = getFullScriptText();
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsAppAPI = async () => {
    if (!data?.phone) {
      alert('Nomor HP / WhatsApp debitur belum terisi!');
      return;
    }
    try {
      setSendingWA(true);
      setWaResultMsg(null);
      const overdueFacility = data?.facilities?.find(f => f.is_overdue) || data?.facilities?.[0];
      const messageText = getFullScriptText();

      const res = await sendCustomerWhatsApp(customerId, {
        message: messageText,
        overdue_account_id: overdueFacility?.overdue_account_id || 0,
        agreement_no: overdueFacility?.agreement_no || '',
      });

      setWaResultMsg({
        success: true,
        gateway: res.data.gateway_used,
        status: res.data.gateway_status,
        url: res.data.wa_web_url,
        phone: res.data.phone
      });
      fetchCustomer360(); // Refresh timeline activities!
      if (onActivityLogged) onActivityLogged();
    } catch (err) {
      alert('Gagal mengirim WhatsApp: ' + (err.response?.data?.error || err.message));
    } finally {
      setSendingWA(false);
    }
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const getStageLabel = (stage) => {
    switch (stage) {
      case 'STAGE_SKIP_TRACING': return 'Skip Tracing (Pelacakan Kontak & Lokasi)';
      case 'STAGE_RESTRUCTURING': return 'Restrukturisasi Kredit (Relaksasi)';
      case 'STAGE_LEGAL_NOTICE': return 'Surat Peringatan & Somasi Hukum';
      case 'STAGE_LITIGATION_AUCTION': return 'Litigasi / Lelang Eksekusi Agunan';
      case 'STAGE_SETTLEMENT': return 'Settlement (Pelunasan Khusus / Diskon)';
      case 'STAGE_CLOSED': return 'Selesai / Lunas';
      default: return 'Penagihan Reguler (Omnichannel)';
    }
  };

  const getStageBadgeColor = (stage) => {
    switch (stage) {
      case 'STAGE_SKIP_TRACING': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'STAGE_RESTRUCTURING': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'STAGE_LEGAL_NOTICE': return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'STAGE_LITIGATION_AUCTION': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'STAGE_SETTLEMENT': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden flex flex-col max-h-[96vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white p-3.5 sm:p-5 flex justify-between items-start gap-2">
          <div className="flex items-start space-x-2.5 sm:space-x-4 min-w-0">
            <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h2 className="text-base sm:text-xl font-bold tracking-tight text-white truncate max-w-[200px] sm:max-w-none">
                  {loading ? 'Memuat Profil...' : data?.customer_name}
                </h2>
                {data?.is_vip && (
                  <span className="px-2 py-0.5 text-[10px] sm:text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 rounded-full flex items-center shadow-sm">
                    <Crown className="w-3 h-3 mr-1" /> VIP
                  </span>
                )}
                {data?.combo_case_stamping && data.combo_case_stamping !== 'Single Facility' && (
                  <span className="px-2 py-0.5 text-[10px] sm:text-xs font-bold bg-indigo-500/40 text-indigo-200 border border-indigo-400/50 rounded-full flex items-center shadow-sm">
                    <Sparkles className="w-3 h-3 mr-1 text-yellow-300" />
                    {data.combo_case_stamping}
                  </span>
                )}
                <span className="px-1.5 py-0.5 text-[10px] sm:text-[11px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">
                  {data?.customer_no || 'CIF-000000'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center"><Briefcase className="w-3.5 h-3.5 mr-1 text-slate-400" /> {data?.occupation || 'Debitur Perbankan'}</span>
                
                {/* Inline Phone Editor for WA Testing */}
                {isEditingPhone ? (
                  <span className="flex items-center space-x-1.5 bg-slate-800 px-2 py-0.5 rounded-lg border border-amber-500/60 shadow-inner">
                    <Phone className="w-3 h-3 text-amber-400" />
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="08123456789"
                      className="px-1.5 py-0.5 text-xs bg-slate-900 text-white rounded border border-slate-600 font-mono w-32 focus:outline-none focus:ring-1 focus:ring-amber-400"
                      autoFocus
                    />
                    <button
                      type="button"
                      disabled={savingPhone}
                      onClick={handleSavePhone}
                      className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition flex items-center space-x-1"
                    >
                      <Save className="w-2.5 h-2.5" />
                      <span>{savingPhone ? '...' : 'Simpan'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingPhone(false)}
                      className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-[10px] transition"
                    >
                      Batal
                    </button>
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <strong className="text-white font-mono">{data?.phone || 'Belum ada nomor'}</strong>
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneInput(data?.phone || '');
                        setIsEditingPhone(true);
                      }}
                      className="ml-2 px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 rounded text-[10px] font-bold border border-slate-700 transition flex items-center space-x-1"
                      title="Ubah nomor HP / WhatsApp debitur (untuk keperluan testing pengiriman WhatsApp)"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>Ubah No. HP (Test WA)</span>
                    </button>
                    {phoneSuccessMsg && (
                      <span className="ml-2 px-1.5 py-0.2 bg-emerald-900/90 text-emerald-300 rounded text-[10px] font-bold animate-pulse">
                        ✓ {phoneSuccessMsg}
                      </span>
                    )}
                  </span>
                )}

                <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {data?.city}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="hidden sm:flex text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/80 items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> CRMS 360°
            </span>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Exposure Metric Strip (Holistic View) */}
        {!loading && data && (
          <div className="grid grid-cols-2 sm:grid-cols-5 bg-slate-50 border-b border-slate-200 text-xs divide-x divide-slate-200">
            <div className="p-3 text-center sm:text-left sm:px-4">
              <span className="text-slate-500 block text-[11px] font-medium">Total Fasilitas</span>
              <span className="text-base font-extrabold text-slate-900 flex items-center justify-center sm:justify-start">
                <CreditCard className="w-4 h-4 mr-1 text-red-600" />
                {data.total_facilities} Fasilitas
              </span>
            </div>
            <div className="p-3 text-center sm:text-left sm:px-4">
              <span className="text-slate-500 block text-[11px] font-medium">Total Plafon Pinjaman</span>
              <span className="text-base font-extrabold text-slate-900 block truncate" title={formatRupiah(data.total_principal)}>
                {formatRupiah(data.total_principal)}
              </span>
            </div>
            <div className="p-3 text-center sm:text-left sm:px-4 bg-red-50/50">
              <span className="text-red-700 block text-[11px] font-medium">Total Kewajiban Overdue</span>
              <span className="text-base font-extrabold text-red-600 block truncate" title={formatRupiah(data.total_overdue)}>
                {formatRupiah(data.total_overdue)}
              </span>
            </div>
            <div className="p-3 text-center sm:text-left sm:px-4">
              <span className="text-slate-500 block text-[11px] font-medium">Max DPD & Risiko</span>
              <div className="flex items-center justify-center sm:justify-start space-x-1.5 mt-0.5">
                <span className="font-extrabold text-slate-900 text-base">{data.max_dpd} Hari</span>
                <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded ${
                  data.worst_risk_level === 'HIGH_RISK' ? 'bg-red-100 text-red-800' :
                  data.worst_risk_level === 'MEDIUM_RISK' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {data.worst_risk_level?.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="p-3 text-center sm:text-left sm:px-4 col-span-2 sm:col-span-1">
              <span className="text-slate-500 block text-[11px] font-medium">Tahapan Lifecycle</span>
              <span className={`inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full border ${getStageBadgeColor(data.primary_stage)}`}>
                {getStageLabel(data.primary_stage)}
              </span>
            </div>
          </div>
        )}

        {/* Portofolio Payroll ASN / PNS Pemprov DKI Banner */}
        {!loading && data && (data?.occupation?.includes('PNS') || data?.occupation?.includes('ASN')) && (
          <div className="bg-sky-50 border-b border-sky-200 px-5 py-2.5 text-xs text-sky-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center space-x-2">
              <span className="p-1 bg-sky-200 text-sky-800 rounded font-bold text-[10px] tracking-wide">ASN PEMPROV DKI</span>
              <span className="font-semibold">Kalender Payroll Terpantau: Gaji Pokok (Tgl 1–3) & Rapel Tunjangan Kinerja/Tukin (Tgl 15–20).</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-sky-800 font-medium">
              <span className="px-2 py-0.5 bg-white rounded border border-sky-300 font-bold text-emerald-700">✓ Grace Autodebet: Aktif</span>
              <span className="px-2 py-0.5 bg-white rounded border border-sky-300 font-semibold">Mode: Gentle Reminder</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto scrollbar-none border-b border-slate-200 px-3 sm:px-5 bg-white space-x-2 sm:space-x-6 text-xs sm:text-sm font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('facilities')}
            className={`py-2.5 sm:py-3 shrink-0 whitespace-nowrap flex items-center space-x-1.5 sm:space-x-2 border-b-2 transition cursor-pointer ${
              activeTab === 'facilities'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Fasilitas Kredit ({data?.facilities?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`py-2.5 sm:py-3 shrink-0 whitespace-nowrap flex items-center space-x-1.5 sm:space-x-2 border-b-2 transition cursor-pointer ${
              activeTab === 'script'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Skrip Percakapan</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`py-2.5 sm:py-3 shrink-0 whitespace-nowrap flex items-center space-x-1.5 sm:space-x-2 border-b-2 transition cursor-pointer ${
              activeTab === 'workflow'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>Alur Lifecycle</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-2.5 sm:py-3 shrink-0 whitespace-nowrap flex items-center space-x-1.5 sm:space-x-2 border-b-2 transition cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Timeline ({timelineActivities.length})</span>
          </button>

          {(data?.legal_cases?.length || 0) > 0 && (
            <button
              onClick={() => setActiveTab('legal')}
              className={`py-3 flex items-center space-x-2 border-b-2 transition ${
                activeTab === 'legal'
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Gavel className="w-4 h-4 text-indigo-600" />
              <span>Kasus Hukum ({data.legal_cases.length})</span>
            </button>
          )}

          {(data?.repo_cases?.length || 0) > 0 && (
            <button
              onClick={() => setActiveTab('repo')}
              className={`py-3 flex items-center space-x-2 border-b-2 transition ${
                activeTab === 'repo'
                  ? 'border-emerald-600 text-emerald-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building className="w-4 h-4 text-emerald-600" />
              <span>Eksekusi Agunan ({data.repo_cases.length})</span>
            </button>
          )}

          {(data?.settlement_proposals?.length || 0) > 0 && (
            <button
              onClick={() => setActiveTab('settlement')}
              className={`py-3 flex items-center space-x-2 border-b-2 transition ${
                activeTab === 'settlement'
                  ? 'border-teal-600 text-teal-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-4 h-4 text-teal-600" />
              <span>Settlement ({data.settlement_proposals.length})</span>
            </button>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-red-500 mb-2" />
              <p className="text-sm font-medium">Memuat data 360° eksposur debitur...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          ) : (
            <>
              {/* TAB 1: FASILITAS KREDIT (CROSS-FACILITY EXPOSURE) */}
              {activeTab === 'facilities' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Seluruh portofolio fasilitas pembiayaan aktif atas nama debitur:</span>
                    <span className="font-semibold text-slate-700">Multi-Product Aggregation</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data?.facilities?.map((f, idx) => (
                      <div 
                        key={idx} 
                        className={`rounded-xl p-4 border transition ${
                          f.is_overdue 
                            ? 'bg-red-50/30 border-red-200 shadow-sm' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-slate-100 text-slate-800 mr-2">
                              {f.product_category}
                            </span>
                            <span className="font-bold text-slate-900 text-sm">{f.product_name}</span>
                          </div>
                          <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                            f.is_overdue ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {f.is_overdue ? `Overdue ${f.dpd} Hari` : 'Lancar (Kol-1)'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 font-mono mb-3">
                          No. Rekening: <strong className="text-slate-800">{f.agreement_no}</strong> | Cabang: {f.branch_name}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs bg-white/80 p-2.5 rounded-lg border border-slate-100 mb-3">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Plafon Fasilitas</span>
                            <span className="font-semibold text-slate-800">{formatRupiah(f.total_financing)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Angsuran Bulanan</span>
                            <span className="font-semibold text-slate-800">{formatRupiah(f.installment_amount)}/bln</span>
                          </div>
                          <div className="col-span-2 pt-1 border-t border-slate-100">
                            <span className="text-slate-400 block text-[10px]">Informasi Agunan / Jaminan</span>
                            <span className="font-medium text-slate-700">{f.collateral_info}</span>
                          </div>
                        </div>

                        {f.is_overdue ? (
                          <div className="bg-red-100/60 p-2.5 rounded-lg flex justify-between items-center text-xs">
                            <div>
                              <span className="text-red-700 text-[10px] block">Tunggakan Tertunda</span>
                              <span className="font-extrabold text-red-800 text-sm">{formatRupiah(f.overdue_amount)}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-500 text-[10px] block">PIC & Tahapan</span>
                              <span className="font-bold text-slate-800">{f.assigned_pic} • {getStageLabel(f.recovery_stage).split(' ')[0]}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-emerald-50 p-2 rounded-lg text-emerald-700 text-xs flex items-center justify-between">
                            <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 mr-1" /> Rekening Berstatus Lancar</span>
                            <span className="text-[10px] text-slate-500">Tenor: {f.paid_tenor_months}/{f.tenor_months} bln</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: SKRIP PERCAKAPAN TERPANDU (SCRIPT-DRIVEN GUIDANCE) */}
              {activeTab === 'script' && (
                <div className="space-y-4">
                  {/* Banner Rekomendasi Kanal Hemat Biaya */}
                  <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-700 text-white rounded-xl shadow-md flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wider text-emerald-100 font-semibold block">
                          Smart Cost-Effective Channel Recommendation
                        </span>
                        <h4 className="text-base font-bold">
                          {script.recommended_channel || script.recommendedChannel || 'WhatsApp Interactive & Smart Robo Call'}
                        </h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 bg-white text-emerald-800 text-xs font-black rounded-lg shadow-sm">
                        Hemat Biaya ~{script.cost_saving_percent ?? script.costSavingPercent ?? 95}%
                      </span>
                      <span className="block text-[11px] text-emerald-100 mt-1 font-medium">
                        {script.channel_cost_badge || script.channelCostBadge || 'Biaya Sangat Rendah (Digital)'}
                      </span>
                    </div>
                  </div>

                  {/* Skrip Interaktif Kotak */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-xs text-slate-400 font-medium block">Persona Profil Debitur</span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {script.debtor_persona || script.debtorPersona || 'Debitur Perbankan Terpantau'}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={handleCopyScript}
                          className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition"
                          title="Salin naskah skrip ke clipboard"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copied ? 'Tersalin!' : 'Salin Skrip'}</span>
                        </button>
                        
                        <button
                          type="button"
                          disabled={sendingWA}
                          onClick={handleSendWhatsAppAPI}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-sm"
                          title="Kirim pesan WhatsApp otomatis via modul Gateway API (Fonnte/Meta Cloud ala Kopkara-EWA)"
                        >
                          {sendingWA ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-300" />}
                          <span>{sendingWA ? 'Mengirim...' : 'Kirim WA Gateway (API)'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (data?.phone) {
                              const phoneFormatted = data.phone.startsWith('0') ? '62' + data.phone.slice(1) : data.phone;
                              const text = encodeURIComponent(getFullScriptText());
                              window.open(`https://wa.me/${phoneFormatted}?text=${text}`, '_blank');
                            }
                          }}
                          className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition"
                          title="Buka WhatsApp Web dengan pesan skrip langsung terisi di kolom chat"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Buka WA Web (Auto-Text)</span>
                        </button>
                      </div>
                    </div>

                    {/* Banner Hasil Pengiriman WhatsApp Gateway (Kopkara-EWA style) */}
                    {waResultMsg && (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs flex justify-between items-center animate-in fade-in">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <div>
                            <span className="font-bold">WhatsApp Engine: Pesan Berhasil Diproses!</span>
                            <span className="block text-[11px] text-emerald-700 mt-0.5">
                              Tujuan: <strong>{waResultMsg.phone}</strong> • Gateway: <span className="font-mono bg-white px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">{waResultMsg.gateway}</span> (Audit Trail Tercatat)
                            </span>
                          </div>
                        </div>
                        <a
                          href={waResultMsg.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] flex items-center space-x-1 shadow-sm"
                        >
                          <span>Buka WA Web</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Step by step dialogue */}
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-emerald-500">
                        <span className="font-bold text-slate-800 block mb-1">1. Salam & Pembuka (Opening)</span>
                        <p className="text-slate-700 leading-relaxed italic">
                          "{script.opening_greeting || script.openingGreeting || 'Selamat Pagi/Siang Bapak/Ibu, kami dari Layanan Informasi Debitur Bank...'}"
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                        <span className="font-bold text-slate-800 block mb-1">2. Penyampaian Kewajiban (Obligation Notice)</span>
                        <p className="text-slate-700 leading-relaxed italic">
                          "{script.obligation_detail || script.obligationDetail || 'Kami menginformasikan kewajiban angsuran pembiayaan yang telah memasuki tanggal jatuh tempo...'}"
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-amber-500">
                        <span className="font-bold text-slate-800 block mb-1">3. Taktik Negosiasi & Opsi Solusi (Negotiation Tactic)</span>
                        <p className="text-slate-700 leading-relaxed">
                          "{script.negotiation_tactic || script.negotiationTactic || 'Konfirmasi kendala autodebet dan tawarkan saluran pembayaran instan via Virtual Account atau QRIS...'}"
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-purple-500">
                        <span className="font-bold text-slate-800 block mb-1">4. Penguncian Komitmen Janji Bayar (Closing)</span>
                        <p className="text-slate-700 leading-relaxed font-semibold">
                          "{script.closing_commitment || script.closingCommitment || 'Bisa kami konfirmasikan rencana pembayaran Bapak/Ibu hari ini sebelum pukul 17.00 WIB?'}"
                        </p>
                      </div>

                      <div className="p-3 bg-rose-50 rounded-lg border-l-4 border-rose-500">
                        <span className="font-bold text-rose-900 block mb-1 flex items-center">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" />
                          5. Batasan & Peringatan Eskalasi Hukum (Escalation Protocol)
                        </span>
                        <p className="text-rose-700 leading-relaxed">
                          {script.escalation_warning || script.escalationWarning || 'Edukasi pentingnya menjaga riwayat kredit lancar di SLIK OJK agar fasilitas kredit tetap aktif.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ADVANCED COLLECTIONS LIFECYCLE (WORKFLOW PIPELINE) */}
              {activeTab === 'workflow' && (
                <div className="space-y-5">
                  <div className="text-xs text-slate-600 flex justify-between items-center">
                    <span>
                      Sesuai framework <strong>Advanced Collections Lifecycle CRMS</strong>, klik salah satu tahapan untuk melihat kriteria, SOP, dan dokumen operasional:
                    </span>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      Klik Tiap Tahapan Untuk Detail
                    </span>
                  </div>

                  {/* Visual Lifecycle Stepper - Interactive & Clickable */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                    {Object.entries(STAGES_CONFIG).map(([stageKey, cfg]) => {
                      const isCurrent = data?.primary_stage === stageKey;
                      const isInspected = (inspectedStage || data?.primary_stage || 'STAGE_COLLECTION') === stageKey;
                      return (
                        <button
                          key={stageKey}
                          type="button"
                          onClick={() => setInspectedStage(stageKey)}
                          className={`p-2.5 rounded-xl border text-center transition cursor-pointer text-left sm:text-center ${
                            isInspected
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-200 shadow-sm font-bold'
                              : isCurrent
                              ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-slate-400 font-mono">Tahap {cfg.stageNumber}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded font-bold text-[8px]">AKTIF</span>
                            )}
                          </div>
                          <div className="text-xs font-bold leading-tight">{cfg.shortTitle}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Detail Panel of Selected/Inspected Stage */}
                  {(() => {
                    const currentKey = inspectedStage || data?.primary_stage || 'STAGE_COLLECTION';
                    const activeCfg = STAGES_CONFIG[currentKey] || STAGES_CONFIG.STAGE_COLLECTION;
                    const isCurrentStage = data?.primary_stage === currentKey;
                    return (
                      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-4 shadow-sm space-y-3 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-semibold block">
                              Detail Tahapan Koleksi #{activeCfg.stageNumber}
                            </span>
                            <h4 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                              {activeCfg.title}
                              {isCurrentStage ? (
                                <span className="text-[10px] bg-emerald-500 text-emerald-950 font-black px-2 py-0.5 rounded-full">
                                  ✓ Status Debitur Saat Ini
                                </span>
                              ) : (
                                <span className="text-[10px] bg-slate-700 text-slate-300 font-medium px-2 py-0.5 rounded-full">
                                  Mode Inspeksi SOP
                                </span>
                              )}
                            </h4>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-indigo-800 text-indigo-200 border border-indigo-600">
                            {activeCfg.actionBadge}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
                          <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                            <span className="text-indigo-200 font-bold block mb-1">🎯 Kriteria Pemicu (Trigger Criteria):</span>
                            <p className="text-slate-200 leading-relaxed">{activeCfg.criteria}</p>
                          </div>
                          <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                            <span className="text-indigo-200 font-bold block mb-1">📋 Standar Prosedur (SOP) & Eksekusi:</span>
                            <p className="text-slate-200 leading-relaxed">{activeCfg.sop}</p>
                          </div>
                          <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                            <span className="text-indigo-200 font-bold block mb-1">📑 Dokumen Legalitas & Output:</span>
                            <p className="text-slate-200 leading-relaxed">{activeCfg.docs}</p>
                          </div>
                        </div>

                        {!isCurrentStage && currentKey !== 'STAGE_COLLECTION' && (
                          <div className="pt-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setTargetStage(currentKey);
                                const formEl = document.getElementById('stage-update-form');
                                if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-lg text-xs transition shadow flex items-center space-x-1"
                            >
                              <span>👉 Jadikan Target Tahapan Pada Form Di Bawah</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Tata Kelola Surat Peringatan Bank DKI (Jeda 14 Hari Kalender) */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-slate-800 text-xs flex items-center">
                        <FileText className="w-4 h-4 mr-1.5 text-indigo-600" />
                        Tata Kelola Surat Peringatan & Somasi (SLA Bank DKI & Jeda 14 Hari Kalender)
                      </h5>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                        Aturan Legal Perbankan
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-[11px]">
                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                        <span className="text-emerald-700 font-bold block flex items-center">
                          <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" /> 1. Pemberitahuan
                        </span>
                        <span className="text-slate-500 text-[10px] block mt-0.5">DPD 15 (Reminder Digital)</span>
                        <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded mt-1 inline-block">Terkirim</span>
                      </div>

                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                        <span className="text-blue-700 font-bold block flex items-center">
                          <CheckCircle className="w-3.5 h-3.5 mr-1 text-blue-600" /> 2. Surat Peringatan I
                        </span>
                        <span className="text-slate-500 text-[10px] block mt-0.5">DPD 30 (Surat Tercatat)</span>
                        <span className="text-[10px] font-medium text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded mt-1 inline-block">Diterbitkan</span>
                      </div>

                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                        <span className="text-amber-800 font-bold block flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-amber-700" /> 3. Jeda Terkunci 14 Hari
                        </span>
                        <span className="text-amber-700 text-[10px] block mt-0.5">Kepatuhan Hukum Formal</span>
                        <span className="text-[10px] font-bold text-amber-900 bg-white border border-amber-300 px-1.5 py-0.2 rounded mt-1 inline-block">
                          🔒 Berjalan (Hari 8/14)
                        </span>
                      </div>

                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg opacity-75">
                        <span className="text-slate-700 font-bold block flex items-center">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1 text-slate-400" /> 4. SP 2 & Somasi SP 3
                        </span>
                        <span className="text-slate-500 text-[10px] block mt-0.5">DPD 45-60 (Litigasi/Lelang)</span>
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded mt-1 inline-block">Terkunci hingga jeda usai</span>
                      </div>
                    </div>
                  </div>

                  {/* Form Update Tahapan */}
                  <form id="stage-update-form" onSubmit={handleUpdateStage} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center">
                      <Scale className="w-4 h-4 mr-1.5 text-indigo-600" />
                      Eskalasi / Transisi Tahapan Penanganan
                    </h4>

                    {stageSuccessMsg && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-semibold">
                        {stageSuccessMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Pilih Rekening Pinjaman</label>
                        <select
                          value={selectedAccountId || ''}
                          onChange={(e) => setSelectedAccountId(Number(e.target.value))}
                          className="w-full border border-slate-300 rounded-lg p-2 bg-white font-medium"
                          required
                        >
                          {data?.facilities?.map((f, i) => (
                            <option key={i} value={f.overdue_account_id}>
                              {f.agreement_no} - {f.product_name} ({f.is_overdue ? `Overdue ${f.dpd} DPD` : 'Lancar'})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Tahapan Tujuan (Next Stage)</label>
                        <select
                          value={targetStage}
                          onChange={(e) => setTargetStage(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2 bg-white font-semibold text-indigo-900"
                          required
                        >
                          <option value="STAGE_SKIP_TRACING">Skip Tracing (Pelacakan Domisili & Kontak)</option>
                          <option value="STAGE_RESTRUCTURING">Restrukturisasi Kredit (Rescheduling / Reconditioning)</option>
                          <option value="STAGE_LEGAL_NOTICE">Penerbitan Surat Peringatan (SP-1/SP-2) & Somasi</option>
                          <option value="STAGE_LITIGATION_AUCTION">Litigasi / Eksekusi Lelang Agunan (Balai Lelang)</option>
                          <option value="STAGE_SETTLEMENT">Settlement (Diskon Denda / Pelunasan Khusus)</option>
                          <option value="STAGE_COLLECTION">Kembalikan ke Penagihan Reguler</option>
                          <option value="STAGE_CLOSED">Tutup Kasus (Lunas Selesai)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-semibold text-slate-700 block mb-1">Alasan Perpindahan Tahapan</label>
                        <input
                          type="text"
                          value={stageReason}
                          onChange={(e) => setStageReason(e.target.value)}
                          placeholder="Misal: Nomor telepon tidak aktif, debitur ajukan penurunan bunga, dsb."
                          className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-semibold text-slate-700 block mb-1">Catatan Tambahan untuk Petugas Khusus</label>
                        <textarea
                          rows="2"
                          value={stageNotes}
                          onChange={(e) => setStageNotes(e.target.value)}
                          placeholder="Masukkan catatan pendukung, nomor kontak darurat baru, koordinat lokasi, dsb."
                          className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                        ></textarea>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={updatingStage}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition shadow flex items-center space-x-1.5"
                      >
                        {updatingStage ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                        <span>Terapkan Perpindahan Tahapan</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: TIMELINE INTERAKSI OMNICHANNEL */}
              {activeTab === 'timeline' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-500 flex justify-between items-center">
                    <span>Rekam jejak seluruh kontak, panggilan, pesan bot, kunjungan, dan pembayaran:</span>
                    <span className="font-semibold text-slate-700">Audit Trail Terintegrasi</span>
                  </div>

                  {timelineActivities.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      Belum ada riwayat aktivitas penagihan untuk debitur ini.
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {timelineActivities.map((act, idx) => (
                        <div key={idx} className="relative group">
                          {/* Dot */}
                          <div className="absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white bg-slate-700 group-hover:bg-red-600 transition shadow-sm"></div>
                          
                          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-slate-900 flex items-center">
                                <span className="px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded text-[10px] mr-1.5 font-mono">
                                  {act.channel_type}
                                </span>
                                {act.performed_by}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(act.created_at).toLocaleString('id-ID')}
                              </span>
                            </div>

                            <p className="text-slate-700 mt-1 leading-relaxed">{act.notes}</p>

                            <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-semibold text-slate-600">
                                Status: {act.contact_status}
                              </span>
                              {act.result_code && (
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-bold">
                                  Hasil: {act.result_code}
                                </span>
                              )}
                              {act.ptp_date && (
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-bold">
                                  PTP: {new Date(act.ptp_date).toLocaleDateString('id-ID')} ({formatRupiah(act.ptp_amount)})
                                </span>
                              )}
                              {act.geo_lat && act.geo_lat !== 0 && (
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold flex items-center">
                                  <MapPin className="w-3 h-3 mr-1 text-emerald-600" />
                                  Geotag GPS: {act.geo_lat.toFixed(4)}, {act.geo_lng.toFixed(4)} (Anti-Fraud Terverifikasi)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: LEGAL & LITIGASI RECOURSE */}
              {activeTab === 'legal' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Rekam Jejak Kasus Hukum & Somasi yang Terdaftar:</span>
                    <span className="font-semibold text-indigo-700">6-Stage Legal Recourse Workflow</span>
                  </div>

                  <div className="space-y-3">
                    {data?.legal_cases?.map((lc) => (
                      <div key={lc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-xs font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                              {lc.case_no}
                            </span>
                            <span className="ml-2 font-mono text-xs text-slate-500">{lc.agreement_no}</span>
                            <h4 className="font-semibold text-slate-900 mt-1 text-sm">{lc.legal_section}</h4>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                            {lc.legal_stage}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                          <div><strong>Advokat:</strong> {lc.lawyer_name || '-'} ({lc.law_firm || 'In-House'})</div>
                          <div><strong>Instansi:</strong> {lc.court_name || lc.police_station || '-'}</div>
                          <div><strong>Nilai Tuntutan:</strong> <span className="font-bold text-slate-900">{formatRupiah(lc.claim_amount)}</span></div>
                        </div>
                        {lc.notes && (
                          <p className="text-xs text-slate-500 italic bg-amber-50/50 p-2 rounded border border-amber-200/50">
                            <strong>Catatan:</strong> {lc.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: EKSEKUSI AGUNAN & LELANG (REPO) */}
              {activeTab === 'repo' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Agunan yang Sedang Dalam Penanganan Eksekusi & Lelang:</span>
                    <span className="font-semibold text-emerald-700">8-Stage Repossession & Auction Workflow</span>
                  </div>

                  <div className="space-y-3">
                    {data?.repo_cases?.map((rc) => (
                      <div key={rc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {rc.repo_no}
                            </span>
                            <span className="ml-2 font-mono text-xs text-slate-500">{rc.agreement_no}</span>
                            <h4 className="font-semibold text-slate-900 mt-1 text-sm">{rc.asset_description}</h4>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            {rc.repo_stage}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                          <div><strong>Tipe Aset:</strong> {rc.asset_type?.replace('_', ' ')}</div>
                          <div><strong>Stockyard:</strong> {rc.stockyard_location || '-'}</div>
                          <div><strong>Nilai Pasar:</strong> {formatRupiah(rc.market_value)}</div>
                          <div><strong>Nilai Likuidasi:</strong> {formatRupiah(rc.liquidation_value)}</div>
                          <div><strong>Penilai:</strong> {rc.valuation_agency || '-'}</div>
                          <div><strong>Tawaran Tertinggi:</strong> <span className="font-bold text-emerald-700">{formatRupiah(rc.highest_bid_amount)}</span></div>
                        </div>
                        {rc.notes && (
                          <p className="text-xs text-slate-500 italic bg-slate-100 p-2 rounded">
                            <strong>Keterangan:</strong> {rc.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: SETTLEMENT & DISKON */}
              {activeTab === 'settlement' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Pengajuan Program Kompromi & Keringanan Pelunasan:</span>
                    <span className="font-semibold text-teal-700">Settlement Engine</span>
                  </div>

                  <div className="space-y-3">
                    {data?.settlement_proposals?.map((sp) => (
                      <div key={sp.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-xs font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                              {sp.proposal_no}
                            </span>
                            <span className="ml-2 font-mono text-xs text-slate-500">{sp.agreement_no}</span>
                            <h4 className="font-semibold text-slate-900 mt-1 text-sm">{sp.settlement_type?.replace(/_/g, ' ')}</h4>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                            {sp.approval_status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                          <div><strong>Tunggakan Awal:</strong> {formatRupiah(sp.original_overdue)}</div>
                          <div className="text-rose-600"><strong>Waive Denda/Bunga:</strong> - {formatRupiah((sp.waived_penalty || 0) + (sp.waived_interest || 0))}</div>
                          <div className="text-emerald-700 font-bold"><strong>Net Settlement:</strong> {formatRupiah(sp.net_settlement_amount)}</div>
                        </div>
                        {sp.approved_by && (
                          <div className="text-[11px] text-slate-500">
                            <strong>Pemutus / Komite:</strong> {sp.approved_by}
                          </div>
                        )}
                        {sp.notes && (
                          <p className="text-xs text-slate-500 italic bg-teal-50/50 p-2 rounded border border-teal-200/50">
                            <strong>Pertimbangan:</strong> {sp.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs">
          <div className="text-slate-500 text-[11px]">
            Terhubung ke Core Banking System (CBS) • Hak Akses Terenkripsi
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                if (!data?.phone) {
                  alert('Nomor HP / WhatsApp debitur belum terisi! Silakan klik tombol "Ubah No. HP" di bagian atas untuk mengisi nomor.');
                  return;
                }
                const cleanPhone = data.phone.replace(/[^0-9]/g, '');
                const phoneFormatted = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
                const scriptText = typeof getFullScriptText === 'function' ? getFullScriptText() : '';
                const encodedText = scriptText ? `?text=${encodeURIComponent(scriptText)}` : '';
                window.open(`https://wa.me/${phoneFormatted}${encodedText}`, '_blank');
              }}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition flex items-center space-x-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Buka WhatsApp Debitur</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
