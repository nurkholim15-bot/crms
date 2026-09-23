import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  CreditCard,
  QrCode,
  FileText,
  Calculator,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Filter,
  Download,
  Share2,
  DollarSign,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import {
  getMCollectAccounts,
  recordMCollectPayment,
  requestPaymentLink,
  getMCollectReceipts,
  sendReceiptWhatsApp,
  simulateForeclosure
} from '../services/api';

const MCollectWorkbench = () => {
  const [accounts, setAccounts] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBucket, setSelectedBucket] = useState('ALL');

  // Modals state
  const [paymentModalAccount, setPaymentModalAccount] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [sendWANow, setSendWANow] = useState(true);
  const [paymentNotes, setPaymentNotes] = useState('');

  // PIS Slip Modal State
  const [activeSlip, setActiveSlip] = useState(null);

  // Payment Link Modal State
  const [linkModalAccount, setLinkModalAccount] = useState(null);
  const [linkAmount, setLinkAmount] = useState('');
  const [linkMethod, setLinkMethod] = useState('QRIS');
  const [generatedLinkResult, setGeneratedLinkResult] = useState(null);

  // Foreclosure Simulator Modal State
  const [foreclosureAccount, setForeclosureAccount] = useState(null);
  const [penaltyPct, setPenaltyPct] = useState(3.5);
  const [interestDiscountPct, setInterestDiscountPct] = useState(20);
  const [foreclosureResult, setForeclosureResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Notification / Alert
  const [successNotice, setSuccessNotice] = useState(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await getMCollectAccounts(selectedBucket !== 'ALL' ? { bucket: selectedBucket } : {});
      setAccounts(res.data.data || []);
      const rRes = await getMCollectReceipts();
      setReceipts(rRes.data.data || []);
    } catch (err) {
      console.error('Gagal mengambil data mCollect:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [selectedBucket]);

  const formatRupiah = (val) => {
    if (!val && val !== 0) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // 1. Submit Record Payment
  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!paymentModalAccount || !paymentAmount) return;

    try {
      const res = await recordMCollectPayment({
        agreement_no: paymentModalAccount.agreement_no,
        amount_paid: Number(paymentAmount),
        payment_method: paymentMethod,
        collector_username: paymentModalAccount.assigned_pic || 'Field Collector',
        collector_name: 'Budi Santoso (Field Force)',
        geotag_lat: -6.195042,
        geotag_lng: 106.823145,
        send_whatsapp_now: sendWANow,
        notes: paymentNotes,
      });

      const slip = res.data.receipt;
      setPaymentModalAccount(null);
      setPaymentAmount('');
      setPaymentNotes('');
      fetchAccounts();

      if (res.data.whatsapp_url && sendWANow) {
        window.open(res.data.whatsapp_url, '_blank');
      }

      // Tampilkan kuitansi PIS digital langsung
      setActiveSlip(slip);
      setSuccessNotice(`Pembayaran ${formatRupiah(slip.amount_paid)} berhasil dicatat. No Kuitansi: ${slip.receipt_no}`);
    } catch (err) {
      alert('Gagal mencatat pembayaran: ' + (err.response?.data?.error || err.message));
    }
  };

  // 2. Submit Request Payment Link
  const handleGenerateLink = async (e) => {
    e.preventDefault();
    if (!linkModalAccount || !linkAmount) return;

    try {
      const res = await requestPaymentLink({
        agreement_no: linkModalAccount.agreement_no,
        amount: Number(linkAmount),
        method: linkMethod,
        collector: linkModalAccount.assigned_pic || 'Field Collector',
      });
      setGeneratedLinkResult(res.data);
    } catch (err) {
      alert('Gagal membuat tautan bayar: ' + (err.response?.data?.error || err.message));
    }
  };

  // 3. Run Foreclosure Simulation
  const handleRunSimulation = async (account) => {
    const acc = account || foreclosureAccount;
    if (!acc) return;
    try {
      setSimulating(true);
      const res = await simulateForeclosure({
        agreement_no: acc.agreement_no,
        penalty_pct: penaltyPct,
        interest_discount_pct: interestDiscountPct,
      });
      setForeclosureResult(res.data);
    } catch (err) {
      alert('Gagal simulasi pelunasan: ' + (err.response?.data?.error || err.message));
    } finally {
      setSimulating(false);
    }
  };

  const handleOpenForeclosure = (account) => {
    setForeclosureAccount(account);
    setForeclosureResult(null);
    handleRunSimulation(account);
  };

  const filteredAccounts = accounts.filter((a) => {
    const nameMatch = a.agreement?.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.agreement_no.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Workbench Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">mCollect - Mobile Field Collections Workbench</h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                PIS Digital Ready
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Workbench koleksi lapangan: pencatatan bayar instan, bukti bayar digital (PIS), tautan bayar QRIS/VA, & simulasi early payoff
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-medium flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            Petugas: Budi Santoso (RSO)
          </span>
          <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg font-medium flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-600" />
            GPS: Aktif
          </span>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {successNotice}
          </div>
          <button onClick={() => setSuccessNotice(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Action Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Daftar Kunjungan Hari Ini</span>
            <Smartphone className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{accounts.length}</div>
          <div className="text-xs text-gray-500 mt-1">Akun dialokasikan ke kolektor</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-700">
            <span>PIS Diterbitkan Hari Ini</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">{receipts.length} Lembar</div>
          <div className="text-xs text-emerald-600 mt-1">Kuitansi digital tersinkronisasi</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-sm">
          <div className="flex items-center justify-between text-xs text-blue-700">
            <span>Pembayaran via QRIS & VA</span>
            <QrCode className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-2">Instant VA</div>
          <div className="text-xs text-blue-600 mt-1">Dynamic payment link generator</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-sm">
          <div className="flex items-center justify-between text-xs text-amber-700">
            <span>Simulator Early Payoff</span>
            <Calculator className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-2">Rule 78</div>
          <div className="text-xs text-amber-600 mt-1">Diskon bunga & pelunasan instan</div>
        </div>
      </div>

      {/* Main Table / Card List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Filter & Search Header */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari No Kontrak / Nama Debitur..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 font-medium">Bucket:</span>
            {['ALL', '1-3', '4-7', '8-13', '14-18', '19-25', '26-30', '31-60'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBucket(b)}
                className={`px-2 py-1 rounded font-medium ${
                  selectedBucket === b
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Account Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">No Kontrak & Debitur</th>
                <th className="px-4 py-3 text-left">Fasilitas Kredit</th>
                <th className="px-4 py-3 text-right">Tunggakan (Overdue)</th>
                <th className="px-4 py-3 text-center">DPD & Bucket</th>
                <th className="px-4 py-3 text-left">Kontak & Alamat</th>
                <th className="px-4 py-3 text-center">Action mCollect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredAccounts.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-gray-900">{a.agreement_no}</div>
                    <div className="text-gray-600 font-medium">{a.agreement?.customer?.name}</div>
                    <div className="text-[11px] text-gray-400">CIF: {a.agreement?.customer?.customer_no}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800">{a.agreement?.asset_model}</span>
                    <div className="text-[11px] text-gray-500">
                      Plafon: {formatRupiah(a.agreement?.total_financing)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-rose-600">{formatRupiah(a.overdue_amount)}</div>
                    <div className="text-[11px] text-gray-500">
                      Angsuran: {formatRupiah(a.agreement?.installment_amount)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800">
                      DPD {a.dpd}
                    </span>
                    <div className="text-[11px] text-gray-500 mt-0.5">Bucket {a.current_bucket}</div>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <div className="text-gray-900 font-medium truncate">{a.agreement?.customer?.phone}</div>
                    <div className="text-[11px] text-gray-500 truncate" title={a.agreement?.customer?.address}>
                      {a.agreement?.customer?.address}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Action 1: Record Payment */}
                      <button
                        onClick={() => {
                          setPaymentModalAccount(a);
                          setPaymentAmount(a.overdue_amount);
                        }}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold flex items-center gap-1 shadow-sm"
                        title="Catat Pembayaran & Terbitkan PIS"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Bayar
                      </button>

                      {/* Action 2: Request Payment Link */}
                      <button
                        onClick={() => {
                          setLinkModalAccount(a);
                          setLinkAmount(a.overdue_amount);
                          setGeneratedLinkResult(null);
                        }}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold flex items-center gap-1 shadow-sm"
                        title="Buat Link QRIS / Virtual Account"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Link QRIS
                      </button>

                      {/* Action 3: Foreclosure Simulator */}
                      <button
                        onClick={() => handleOpenForeclosure(a)}
                        className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium flex items-center gap-1"
                        title="Simulasi Pelunasan Dipercepat"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        Pelunasan
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================= */}
      {/* 1. MODAL: RECORD PAYMENT & ISSUE PIS                   */}
      {/* ======================================================= */}
      {paymentModalAccount && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  Pencatatan Pembayaran Lapangan (mCollect)
                </h3>
                <p className="text-xs text-gray-500">
                  Terbitkan bukti setor resmi digital PIS (Payment Information Slip)
                </p>
              </div>
              <button onClick={() => setPaymentModalAccount(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Debitur:</span>
                  <span className="font-bold text-gray-900">{paymentModalAccount.agreement?.customer?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">No Perjanjian:</span>
                  <span className="font-semibold text-gray-900">{paymentModalAccount.agreement_no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Tunggakan:</span>
                  <span className="font-bold text-rose-600">{formatRupiah(paymentModalAccount.overdue_amount)}</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Jumlah Bayar Diterima (Rp)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg font-bold text-gray-900 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                />
                <div className="flex gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(paymentModalAccount.overdue_amount)}
                    className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-[11px] text-gray-700"
                  >
                    Lunas Tunggakan Penuh
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(paymentModalAccount.agreement?.installment_amount)}
                    className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-[11px] text-gray-700"
                  >
                    1x Angsuran Pokok
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Metode Pembayaran</label>
                <div className="grid grid-cols-3 gap-2">
                  {['CASH', 'QRIS', 'ONLINE_VA'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 px-3 rounded-lg font-bold border text-center ${
                        paymentMethod === m
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Catatan Kuitansi</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Keterangan penagihan lapangan..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 p-2 bg-emerald-50/60 rounded-lg">
                <input
                  type="checkbox"
                  id="waCheck"
                  checked={sendWANow}
                  onChange={(e) => setSendWANow(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="waCheck" className="text-gray-700 font-medium cursor-pointer">
                  Kirim langsung lembar PIS resmi ke WhatsApp Nasabah ({paymentModalAccount.agreement?.customer?.phone})
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setPaymentModalAccount(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Konfirmasi & Terbitkan PIS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 2. MODAL: DIGITAL RECEIPT SLIP (PIS PREVIEW)           */}
      {/* ======================================================= */}
      {activeSlip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up border-t-8 border-emerald-600">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    BUKTI SETOR RESMI DIGITAL (PIS)
                  </h3>
                  <div className="text-[11px] text-gray-500">Payment Information Slip - Electronic Receipt</div>
                </div>
              </div>
              <button onClick={() => setActiveSlip(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 text-xs font-mono">
              <div className="text-center border-b pb-2">
                <div className="font-bold text-gray-900 text-sm">BANK CRMS DIGITAL INDONESIA</div>
                <div className="text-[10px] text-gray-500">Sistem Pemulihan & Penagihan Kredit Terpadu</div>
                <div className="text-xs font-bold text-emerald-700 mt-1">{activeSlip.receipt_no}</div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Waktu:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(activeSlip.issued_at || Date.now()).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">No Kontrak:</span>
                  <span className="font-bold text-gray-900">{activeSlip.agreement_no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Metode Bayar:</span>
                  <span className="font-semibold text-gray-900">{activeSlip.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Petugas (Kolektor):</span>
                  <span className="font-semibold text-gray-900">{activeSlip.collector_name}</span>
                </div>
              </div>

              <div className="border-t border-b py-2 text-center">
                <div className="text-gray-500 text-[11px]">Jumlah Diterima</div>
                <div className="text-lg font-bold text-emerald-700">{formatRupiah(activeSlip.amount_paid)}</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">LUNAS / BERHASIL DIVERIFIKASI</div>
              </div>

              <div className="text-[10px] text-gray-400 text-center">
                Tanda terima elektronik ini sah dan diakui sebagai bukti pembayaran resmi tanpa memerlukan tanda tangan basah.
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  try {
                    const res = await sendReceiptWhatsApp(activeSlip.id);
                    if (res.data.whatsapp_url) {
                      window.open(res.data.whatsapp_url, '_blank');
                    }
                  } catch (err) {
                    alert('Gagal mengirim WhatsApp: ' + err.message);
                  }
                }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                Kirim via WhatsApp
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Cetak PIS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 3. MODAL: REQUEST PAYMENT LINK (QRIS / VA)             */}
      {/* ======================================================= */}
      {linkModalAccount && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-blue-600" />
                  Generate Payment Link Instan (QRIS / VA)
                </h3>
                <p className="text-xs text-gray-500">
                  Kirim kode QRIS dinamis atau Virtual Account ke nomor WhatsApp nasabah
                </p>
              </div>
              <button onClick={() => setLinkModalAccount(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!generatedLinkResult ? (
              <form onSubmit={handleGenerateLink} className="space-y-4 text-xs">
                <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Debitur:</span>
                    <span className="font-bold text-gray-900">{linkModalAccount.agreement?.customer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nomor WhatsApp:</span>
                    <span className="font-semibold text-gray-900">{linkModalAccount.agreement?.customer?.phone}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Nominal Link Pembayaran (Rp)</label>
                  <input
                    type="number"
                    value={linkAmount}
                    onChange={(e) => setLinkAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg font-bold text-gray-900 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Kanal Pembayaran</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['QRIS', 'VIRTUAL_ACCOUNT'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setLinkMethod(m)}
                        className={`py-2 px-3 rounded-lg font-bold border text-center ${
                          linkMethod === m
                            ? 'border-blue-600 bg-blue-50 text-blue-800'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {m === 'QRIS' ? 'QRIS Dinamis' : 'Virtual Account (VA)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setLinkModalAccount(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    Buat & Kirim Link Sekarang
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-sm text-gray-900">Tautan Bayar Siap Dibagikan</div>
                  <div className="text-gray-600">
                    Nomor Virtual Account: <strong className="text-blue-700">{generatedLinkResult.va_number}</strong>
                  </div>
                  <div className="text-gray-600">
                    Nominal: <strong>{formatRupiah(generatedLinkResult.amount)}</strong>
                  </div>
                  <div className="text-[11px] text-gray-500 truncate bg-white p-2 rounded border">
                    {generatedLinkResult.payment_url}
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={generatedLinkResult.whatsapp_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center font-bold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Buka Chat WhatsApp
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLinkResult.payment_url);
                      alert('Tautan pembayaran berhasil disalin ke clipboard!');
                    }}
                    className="px-4 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold"
                  >
                    Salin Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 4. MODAL: FORECLOSURE / EARLY PAYOFF SIMULATOR           */}
      {/* ======================================================= */}
      {foreclosureAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-indigo-600" />
                  Simulator Pelunasan Dipercepat (Early Payoff / Foreclosure)
                </h3>
                <p className="text-xs text-gray-500">
                  Hitung kalkulasi pokok tersisa, diskon bunga berjalan (Rule 78), & penalti pelunasan
                </p>
              </div>
              <button onClick={() => setForeclosureAccount(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Info Bar */}
            <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-gray-900">{foreclosureAccount.agreement?.customer?.name}</div>
                <div className="text-gray-500">{foreclosureAccount.agreement_no} • {foreclosureAccount.agreement?.asset_model}</div>
              </div>
              <div className="text-right">
                <div className="text-gray-500">Plafon Awal:</div>
                <div className="font-bold text-gray-900">{formatRupiah(foreclosureAccount.agreement?.total_financing)}</div>
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Diskon Keringanan Bunga:</span>
                  <span className="text-indigo-700">{interestDiscountPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={interestDiscountPct}
                  onChange={(e) => {
                    setInterestDiscountPct(Number(e.target.value));
                  }}
                  onMouseUp={() => handleRunSimulation()}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="text-[10px] text-gray-500">Diskon potongan bunga belum tertagih (0% - 50%)</div>
              </div>

              <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Biaya Penalti Foreclosure:</span>
                  <span className="text-amber-800">{penaltyPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={penaltyPct}
                  onChange={(e) => {
                    setPenaltyPct(Number(e.target.value));
                  }}
                  onMouseUp={() => handleRunSimulation()}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="text-[10px] text-gray-500">Standar ketentuan perbankan: 3.5% dari pokok</div>
              </div>
            </div>

            {/* Simulation Results Breakdown */}
            {foreclosureResult && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between text-gray-600">
                  <span>Sisa Pokok Pinjaman (Outstanding Principal):</span>
                  <span className="font-bold text-gray-900">{formatRupiah(foreclosureResult.outstanding_principal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Bunga Berjalan Belum Jatuh Tempo:</span>
                  <span>{formatRupiah(foreclosureResult.unbilled_interest)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Potongan Keringanan Bunga ({foreclosureResult.interest_discount_pct}%):</span>
                  <span>- {formatRupiah(foreclosureResult.interest_rebate_amount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Biaya Penalti Pelunasan ({foreclosureResult.penalty_pct}%):</span>
                  <span>+ {formatRupiah(foreclosureResult.early_termination_fee)}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Denda Keterlambatan Terhutang:</span>
                  <span>+ {formatRupiah(foreclosureResult.late_fee_arrears)}</span>
                </div>

                <div className="border-t-2 border-gray-300 pt-2 flex justify-between items-center text-sm font-sans">
                  <div>
                    <div className="font-bold text-gray-900">TOTAL BERSIH PELUNASAN (NET PAYOFF):</div>
                    <div className="text-[11px] text-gray-500 font-normal">
                      Berlaku s.d: {foreclosureResult.valid_until}
                    </div>
                  </div>
                  <div className="text-xl font-black text-indigo-700">
                    {formatRupiah(foreclosureResult.total_net_payoff)}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setForeclosureAccount(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-medium"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!foreclosureResult) return;
                  const phone = foreclosureAccount.agreement?.customer?.phone?.replace(/[^0-9]/g, '');
                  const cleanPhone = phone?.startsWith('0') ? '62' + phone.slice(1) : phone;
                  const msg = `Yth. Bpk/Ibu ${foreclosureResult.customer_name},\nBerikut penawaran estimasi Pelunasan Dipercepat (Early Payoff) No Kontrak: ${foreclosureResult.agreement_no}.\n\n• Sisa Pokok: ${formatRupiah(foreclosureResult.outstanding_principal)}\n• Diskon Bunga (${foreclosureResult.interest_discount_pct}%): - ${formatRupiah(foreclosureResult.interest_rebate_amount)}\n• Penalti Early Payoff: ${formatRupiah(foreclosureResult.early_termination_fee)}\n\nTOTAL BERSIH PELUNASAN: ${formatRupiah(foreclosureResult.total_net_payoff)}\nBerlaku hingga: ${foreclosureResult.valid_until}.\n\nTerima kasih - CRMS Collection`;
                  window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                Kirim Penawaran Pelunasan ke WA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MCollectWorkbench;
