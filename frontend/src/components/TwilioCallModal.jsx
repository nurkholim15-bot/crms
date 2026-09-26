import React, { useState, useEffect } from 'react';
import { 
  X, 
  PhoneCall, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Bot, 
  UserCheck, 
  Sparkles, 
  ExternalLink, 
  RotateCw,
  Clock,
  ShieldAlert,
  Settings
} from 'lucide-react';
import { getTelephonyConfig, saveTelephonyConfig, makeTwilioCall } from '../services/api';

export default function TwilioCallModal({ isOpen, onClose, account, companyInfo, onCallSuccess }) {
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [channelType, setChannelType] = useState('ROBOCALL');
  
  // Call parameters
  const [toPhone, setToPhone] = useState('');
  const [fromPhone, setFromPhone] = useState('');
  const [scriptText, setScriptText] = useState('');
  const [voiceType, setVoiceType] = useState('Polly.Gita');
  const [isSimulation, setIsSimulation] = useState(false);

  // Call status
  const [callState, setCallState] = useState('idle'); // idle, calling, ringing, success, error
  const [callResult, setCallResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorGuidance, setErrorGuidance] = useState('');

  // Audio speech test in laptop
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Settings tab toggle
  const [showConfigEdit, setShowConfigEdit] = useState(false);
  const [editFromPhone, setEditFromPhone] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);

  // Load Twilio Config on mount or open
  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  const loadConfig = async () => {
    setLoadingConfig(true);
    try {
      const res = await getTelephonyConfig();
      if (res.data?.data) {
        const c = res.data.data;
        setConfig(c);
        if (c.from_phone_number) {
          setFromPhone(c.from_phone_number);
          setEditFromPhone(c.from_phone_number);
        } else if (c.incoming_numbers && c.incoming_numbers.length > 0) {
          setFromPhone(c.incoming_numbers[0]);
          setEditFromPhone(c.incoming_numbers[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load Twilio config:', e);
    } finally {
      setLoadingConfig(false);
    }
  };

  // Populate default script & target phone when account changes
  useEffect(() => {
    if (account) {
      const customer = account.agreement?.customer;
      const phone = customer?.phone || account.phone || '';
      setToPhone(phone);

      const custName = customer?.name || account.customer_name || 'Bapak/Ibu';
      const overdueAmt = formatCurrency(account.overdue_amount || 0);
      const dpd = account.dpd || 0;
      const bankName = companyInfo?.namaPT || 'PT Bank Rakyat Nusantara Tbk';

      if (channelType === 'ROBOCALL') {
        setScriptText(
          `Halo, salam hormat Bapak atau Ibu ${custName}. Kami dari Layanan Informasi Debitur ${bankName} menginformasikan bahwa kewajiban angsuran pembiayaan Anda sebesar ${overdueAmt} telah melewati tanggal jatuh tempo selama ${dpd} hari. Silakan lakukan pembayaran ke Virtual Account resmi Anda. Terima kasih.`
        );
      } else {
        setScriptText(
          `Selamat pagi Bapak atau Ibu ${custName}. Saya dari Tim Desk Collection ${bankName}. Kami ingin mengonfirmasi rencana pembayaran kewajiban angsuran ${overdueAmt} yang saat ini tercatat menunggak ${dpd} hari. Apakah pembayaran dapat diselesaikan hari ini sebelum pukul 17.00 WIB?`
        );
      }
    }
  }, [account, channelType, companyInfo]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Template switchers
  const applyTemplate = (type) => {
    const custName = account?.agreement?.customer?.name || account?.customer_name || 'Bapak/Ibu';
    const overdueAmt = formatCurrency(account?.overdue_amount || 0);
    const dpd = account?.dpd || 0;
    const bankName = companyInfo?.namaPT || 'PT Bank Rakyat Nusantara Tbk';

    if (type === 'ROBO_EARLY') {
      setChannelType('ROBOCALL');
      setScriptText(
        `Halo Bapak atau Ibu ${custName}. Ini adalah pengingat otomatis dari ${bankName}. Angsuran pembiayaan Anda sebesar ${overdueAmt} telah memasuki jatuh tempo DPD ${dpd}. Segera lakukan penyelesaian melalui mobile banking atau ATM terdekat.`
      );
    } else if (type === 'DESK_PTP') {
      setChannelType('DESK_COLLECTION');
      setScriptText(
        `Selamat siang Bapak atau Ibu ${custName}, kami dari Desk Collection Kantor Pusat ${bankName} menindaklanjuti komitmen pembayaran angsuran sebesar ${overdueAmt}. Mohon konfirmasi kepastian jam penyelesaian hari ini.`
      );
    } else if (type === 'SOMASI_ESCALATION') {
      setChannelType('ROBOCALL');
      setScriptText(
        `Panggilan resmi perbankan kepada Bapak atau Ibu ${custName}. Kewajiban Anda sebesar ${overdueAmt} telah menunggak ${dpd} hari dan memasuki batas penerbitan Surat Peringatan. Segera hubungi kantor cabang atau lakukan pembayaran untuk menghindari eskalasi hukum.`
      );
    }
  };

  // Web Speech API Test in Laptop Speaker
  const handlePlayVoiceInLaptop = () => {
    if (!('speechSynthesis' in window)) {
      alert('Browser Anda tidak mendukung Web Speech API');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(scriptText);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95; // Sedikit lebih santai dan jelas
    utterance.pitch = 1.0;

    // Cari suara bahasa Indonesia jika ada di sistem
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Trigger Outbound Twilio Call
  const handleExecuteTwilioCall = async () => {
    if (!toPhone) {
      alert('Harap masukkan nomor telepon tujuan!');
      return;
    }
    if (!scriptText) {
      alert('Harap masukkan teks skrip panggilan!');
      return;
    }

    setCallState('calling');
    setErrorMessage('');
    setErrorGuidance('');
    setCallResult(null);

    try {
      const payload = {
        overdue_account_id: account?.id,
        agreement_no: account?.agreement_no,
        customer_name: account?.agreement?.customer?.name || account?.customer_name,
        to_phone: toPhone,
        from_phone: fromPhone,
        script_text: scriptText,
        channel_type: channelType,
        voice_type: voiceType,
        simulation_mode: isSimulation,
      };

      const res = await makeTwilioCall(payload);
      if (res.data?.data) {
        setCallResult(res.data.data);
        setCallState('success');
        if (onCallSuccess) {
          onCallSuccess(res.data.data);
        }
      }
    } catch (err) {
      console.error('Twilio Call Error:', err);
      setCallState('error');
      const errData = err.response?.data;
      setErrorMessage(errData?.error || err.message || 'Gagal memulai panggilan Twilio');
      setErrorGuidance(errData?.guidance || '');
    }
  };

  const handleSavePhoneConfig = async () => {
    setSavingConfig(true);
    try {
      await saveTelephonyConfig({
        account_sid: config?.account_sid,
        phone_number: editFromPhone
      });
      setFromPhone(editFromPhone);
      setShowConfigEdit(false);
      loadConfig();
      alert('Nomor pengirim Twilio berhasil disimpan!');
    } catch (e) {
      alert('Gagal menyimpan konfigurasi: ' + e.message);
    } finally {
      setSavingConfig(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-emerald-950/10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#064E3B] to-[#0A7B58] p-5 text-white rounded-t-3xl relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <PhoneCall className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">
                  Twilio Programmable Voice & Robocall
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-emerald-950 rounded-full">
                  Trial Active
                </span>
              </div>
              <p className="text-emerald-100 text-xs mt-0.5">
                Simulasi & Panggilan Nyata Terintegrasi Twilio Voice API • {companyInfo?.namaPT || 'CRMS Banking'}
              </p>
            </div>
          </div>
        </div>

        {/* Twilio Account Status Bar */}
        <div className="bg-emerald-950/90 text-emerald-100 px-5 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SID: <strong className="text-white font-mono">{config?.account_sid || 'Tersambung (Twilio API)'}</strong></span>
            <span className="text-emerald-400/60">|</span>
            <span>Tipe: <strong className="text-emerald-300">{config?.account_type || 'Trial'}</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowConfigEdit(!showConfigEdit)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 transition"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{showConfigEdit ? 'Tutup Pengaturan' : 'Set Nomor Twilio'}</span>
            </button>
            <a 
              href="https://console.twilio.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] text-emerald-300 hover:text-white flex items-center gap-1 underline"
            >
              <span>Twilio Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Collapsible Config Edit Panel */}
        {showConfigEdit && (
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-emerald-600" /> Konfigurasi Nomor Twilio (Caller ID / From)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Twilio Phone Number (Pengirim):
                </label>
                <input 
                  type="text" 
                  value={editFromPhone}
                  onChange={(e) => setEditFromPhone(e.target.value)}
                  placeholder="Contoh: +14435900753"
                  className="w-full p-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Nomor yang didapat gratis saat klik "Get a phone number" di dashboard Twilio.
                </span>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSavePhoneConfig}
                  disabled={savingConfig}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  {savingConfig ? 'Menyimpan...' : 'Simpan Nomor Pengirim'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-slate-800 text-xs sm:text-sm">
          {/* Target Customer Info Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Debitur Dituju:
              </span>
              <h4 className="text-base font-extrabold text-slate-900 leading-tight">
                {account?.agreement?.customer?.name || account?.customer_name || 'Nasabah Retail'}
              </h4>
              <span className="text-xs text-slate-500 font-mono mt-0.5 block">
                {account?.agreement_no || 'BANK-KTA-2026-1001'} • Overdue: <strong className="text-rose-600">{formatCurrency(account?.overdue_amount || 0)}</strong> (DPD {account?.dpd || 0})
              </span>
            </div>

            {/* Mode Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl">
              <button
                type="button"
                onClick={() => setChannelType('ROBOCALL')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  channelType === 'ROBOCALL' 
                    ? 'bg-white text-emerald-700 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Robocall (Bot)</span>
              </button>
              <button
                type="button"
                onClick={() => setChannelType('DESK_COLLECTION')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  channelType === 'DESK_COLLECTION' 
                    ? 'bg-white text-teal-700 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Desk Collection</span>
              </button>
            </div>
          </div>

          {/* Phone Number Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                Nomor HP Tujuan (Target Debitur):
              </label>
              <input 
                type="text" 
                value={toPhone}
                onChange={(e) => setToPhone(e.target.value)}
                placeholder="Contoh: +628123456789 atau 08123456789"
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Anda dapat mengubah ke nomor HP pribadi Anda untuk menguji panggilan masuk nyata.
              </span>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                Twilio Caller ID (Nomor Pengirim):
              </label>
              <input 
                type="text" 
                value={fromPhone}
                onChange={(e) => setFromPhone(e.target.value)}
                placeholder="Nomor Twilio pengirim (+1...)"
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                {fromPhone ? '✓ Terpasang dari konfigurasi Twilio' : '⚠️ Kosongkan untuk mode Simulasi Audio'}
              </span>
            </div>
          </div>

          {/* Script Text Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-extrabold text-slate-700">
                Teks Suara Penagihan (Speech TwiML Engine):
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 font-semibold">Pilih Skrip Cepat:</span>
                <button
                  type="button"
                  onClick={() => applyTemplate('ROBO_EARLY')}
                  className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 transition"
                >
                  Robocall DPD 1-7
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('DESK_PTP')}
                  className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-200 transition"
                >
                  Desk PTP
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('SOMASI_ESCALATION')}
                  className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200 transition"
                >
                  Somasi DPD 30+
                </button>
              </div>
            </div>

            <textarea 
              rows={4}
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-2xl text-xs sm:text-sm leading-relaxed focus:ring-2 focus:ring-emerald-500 bg-white"
              placeholder="Ketikkan isi percakapan yang akan dibacakan oleh mesin suara Twilio..."
            />
          </div>

          {/* Audio Preview in Laptop Speaker */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className={`w-8 h-8 rounded-xl ${isSpeaking ? 'bg-emerald-600 text-white animate-pulse' : 'bg-emerald-100 text-emerald-800'} flex items-center justify-center`}>
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-emerald-950 text-xs block">
                  Uji Suara di Speaker Laptop (Web Speech Audio)
                </span>
                <span className="text-[11px] text-emerald-800/80">
                  Dengarkan simulasi pembacaan skrip di laptop Anda sebelum melakukan panggilan nyata.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlayVoiceInLaptop}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                isSpeaking 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Hentikan Suara</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>▶ Putar di Laptop</span>
                </>
              )}
            </button>
          </div>

          {/* Status / Result Display */}
          {callState === 'calling' && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center space-x-3">
              <RotateCw className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <h5 className="font-bold text-xs sm:text-sm">Menghubungkan ke Twilio Voice API...</h5>
                <p className="text-[11px] text-blue-700">Membuat request panggilan TwiML ke nomor {toPhone}...</p>
              </div>
            </div>
          )}

          {callState === 'success' && callResult && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2 animate-fadeIn">
              <div className="flex items-center space-x-2 text-emerald-700 font-extrabold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Panggilan Berhasil Dimulai!</span>
              </div>
              <div className="text-xs space-y-1 text-slate-700 bg-white p-3 rounded-xl border border-emerald-100">
                <div>Call SID: <strong className="font-mono text-emerald-900">{callResult.call_sid}</strong></div>
                <div>Status: <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">{callResult.status}</span></div>
                <div>Tujuan: <strong className="font-mono">{callResult.to}</strong></div>
                {callResult.instruction && (
                  <p className="text-[11px] text-emerald-800 mt-1 italic">{callResult.instruction}</p>
                )}
              </div>
            </div>
          )}

          {callState === 'error' && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2 animate-fadeIn">
              <div className="flex items-center space-x-2 text-rose-700 font-extrabold">
                <AlertTriangle className="w-5 h-5" />
                <span>Panggilan Twilio Membutuhkan Verifikasi</span>
              </div>
              <p className="text-xs text-rose-800 font-medium">{errorMessage}</p>
              {errorGuidance && (
                <div className="p-3 bg-white/80 rounded-xl border border-rose-200 text-xs text-slate-800 space-y-1.5">
                  <span className="font-bold text-rose-900 block">💡 Panduan Twilio Trial:</span>
                  <p className="text-[11px] leading-relaxed text-slate-700">{errorGuidance}</p>
                  <p className="text-[10px] text-slate-500">
                    Buka <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold">console.twilio.com</a> ➔ klik "Get a phone number" dan daftarkan nomor HP Anda di "Verified Caller IDs".
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Twilio Trial Notice */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Informasi Pengujian Akun Twilio Trial di Laptop:
            </span>
            <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] text-slate-600">
              <li>Akun Trial Twilio mewajibkan nomor HP tujuan telah diverifikasi di dashboard Twilio (*Verified Caller IDs*).</li>
              <li>Pastikan Anda sudah mengklaim nomor Twilio (*Get a phone number*) di <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-bold">console.twilio.com</a>.</li>
              <li>Jika nomor belum terverifikasi, Anda tetap dapat melakukan <strong>simulasi panggilan</strong> atau menguji <strong>suara di laptop (Web Speech)</strong>.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 rounded-b-3xl">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="sim-mode"
              checked={isSimulation}
              onChange={(e) => setIsSimulation(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded"
            />
            <label htmlFor="sim-mode" className="text-xs text-slate-700 font-semibold cursor-pointer">
              Paksa Mode Simulasi (Tanpa Potong Kredit Twilio)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleExecuteTwilioCall}
              disabled={callState === 'calling'}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-md flex items-center gap-2"
            >
              {callState === 'calling' ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Memanggil...</span>
                </>
              ) : (
                <>
                  <PhoneCall className="w-4 h-4" />
                  <span>Panggil Sekarang ke HP</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
