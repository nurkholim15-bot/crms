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
  User,
  UserCheck,
  Calendar,
  ArrowRightLeft,
  Users,
  Percent,
  Award,
  TrendingUp,
  TrendingDown,
  CheckSquare,
  Square,
  RefreshCw,
  Eye,
  Navigation,
  Phone,
  MessageSquare,
  AlertTriangle,
  Printer,
  Sparkles,
  PlusCircle,
  Trash2
} from 'lucide-react';
import {
  getMCollectAccounts,
  recordMCollectPayment,
  requestPaymentLink,
  getMCollectReceipts,
  sendReceiptWhatsApp,
  simulateForeclosure,
  getCollectorTasks,
  getTodayPlan,
  addToTodayPlan,
  bulkAddToTodayPlan,
  updateTodayPlanStatus,
  removeFromTodayPlan,
  reassignCollector,
  getReassignmentLogs,
  getCollectorIncentives,
  simulateIncentive,
  logActivity
} from '../services/api';

const MCollectWorkbench = () => {
  // Navigation Subtabs: 'tasks' | 'today' | 'reassign' | 'incentive' | 'receipts'
  const [activeSubTab, setActiveSubTab] = useState('tasks');
  const [loading, setLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);

  // Active Collector Filter
  const [selectedCollectorFilter, setSelectedCollectorFilter] = useState('ALL');

  // 1. Task List State
  const [taskList, setTaskList] = useState([]);
  const [taskSearch, setTaskSearch] = useState('');
  const [taskBucketFilter, setTaskBucketFilter] = useState('ALL');
  const [taskStatusFilter, setTaskStatusFilter] = useState('ALL');
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  // 2. Today's Plan State
  const [todayPlans, setTodayPlans] = useState([]);
  const [planSummary, setPlanSummary] = useState(null);
  const [planDate, setPlanDate] = useState(() => new Date().toISOString().split('T')[0]);

  // 3. Customer Form Modal State (terbuka saat task di-klik)
  const [customerFormTask, setCustomerFormTask] = useState(null);
  const [visitStatus, setVisitStatus] = useState('VISITED');
  const [visitNotes, setVisitNotes] = useState('');
  const [visitPTPDate, setVisitPTPDate] = useState('');
  const [visitPTPAmount, setVisitPTPAmount] = useState('');
  const [savingVisit, setSavingVisit] = useState(false);

  // 4. Reassign Collector State
  const [reassignAgreements, setReassignAgreements] = useState([]);
  const [toCollector, setToCollector] = useState('andi');
  const [reassignReason, setReassignReason] = useState('AREA_ROTATION');
  const [reassignNotes, setReassignNotes] = useState('');
  const [reassignmentLogs, setReassignmentLogs] = useState([]);
  const [reassignSubmitting, setReassignSubmitting] = useState(false);

  // 5. Incentive Engine State
  const [incentivesData, setIncentivesData] = useState(null);
  const [simBaseIncentive, setSimBaseIncentive] = useState(3000000);
  const [simCollectionRate, setSimCollectionRate] = useState(90);
  const [simFlowRate, setSimFlowRate] = useState(8);
  const [simResult, setSimResult] = useState(null);
  const [selectedSlipCollector, setSelectedSlipCollector] = useState(null);

  // 6. Payment, PIS, Link, Foreclosure Modals State
  const [receipts, setReceipts] = useState([]);
  const [paymentModalAccount, setPaymentModalAccount] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [sendWANow, setSendWANow] = useState(true);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [activeSlip, setActiveSlip] = useState(null);

  const [linkModalAccount, setLinkModalAccount] = useState(null);
  const [linkAmount, setLinkAmount] = useState('');
  const [linkMethod, setLinkMethod] = useState('QRIS');
  const [generatedLinkResult, setGeneratedLinkResult] = useState(null);

  const [foreclosureAccount, setForeclosureAccount] = useState(null);
  const [penaltyPct, setPenaltyPct] = useState(3.5);
  const [interestDiscountPct, setInterestDiscountPct] = useState(20);
  const [foreclosureResult, setForeclosureResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Available Collectors List (sesuai akun terdaftar di sistem)
  const collectorsList = [
    { username: 'andi', name: 'Andi Pratama', role: 'Field Collector', bucket: 'Bucket 1-13 DPD' },
    { username: 'rian', name: 'Rian Pratama', role: 'Field Recovery Officer (FRO)', bucket: 'Bucket 14-30 DPD' },
    { username: 'budi', name: 'Budi Santoso', role: 'Remedial Settlement Officer (RSO)', bucket: 'Bucket 31-60 DPD' },
    { username: 'collector', name: 'Dimas Kurniawan', role: 'Senior Field Collector (SFC)', bucket: 'Bucket >60 DPD' },
  ];

  // Helper Format Rupiah
  const formatRupiah = (val) => {
    if (!val && val !== 0) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // -----------------------------------------------------------------
  // FETCH DATA FUNCTIONS
  // -----------------------------------------------------------------

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getCollectorTasks({
        collector: selectedCollectorFilter !== 'ALL' ? selectedCollectorFilter : undefined,
        bucket: taskBucketFilter !== 'ALL' ? taskBucketFilter : undefined,
        status: taskStatusFilter !== 'ALL' ? taskStatusFilter : undefined,
        search: taskSearch || undefined,
      });
      setTaskList(res.data.data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayPlans = async () => {
    try {
      const res = await getTodayPlan({
        collector: selectedCollectorFilter !== 'ALL' ? selectedCollectorFilter : undefined,
        date: planDate,
      });
      setTodayPlans(res.data.data || []);
      setPlanSummary(res.data.summary || null);
    } catch (err) {
      console.error('Error fetching today plan:', err);
    }
  };

  const fetchReassignments = async () => {
    try {
      const res = await getReassignmentLogs();
      setReassignmentLogs(res.data.data || []);
    } catch (err) {
      console.error('Error fetching reassignments:', err);
    }
  };

  const fetchIncentives = async () => {
    try {
      const res = await getCollectorIncentives();
      setIncentivesData(res.data || null);
    } catch (err) {
      console.error('Error fetching incentives:', err);
    }
  };

  const fetchReceipts = async () => {
    try {
      const res = await getMCollectReceipts();
      setReceipts(res.data.data || []);
    } catch (err) {
      console.error('Error fetching receipts:', err);
    }
  };

  // Run initial simulation on load
  const runLiveIncentiveSimulation = async (base, kpi, flow) => {
    try {
      const res = await simulateIncentive({
        base_incentive: Number(base),
        collection_rate_pct: Number(kpi),
        flow_rate_pct: Number(flow),
        collector_name: 'Simulasi Kolektor',
      });
      setSimResult(res.data);
    } catch (err) {
      console.error('Simulation error:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchTodayPlans();
    fetchReassignments();
    fetchIncentives();
    fetchReceipts();
    runLiveIncentiveSimulation(simBaseIncentive, simCollectionRate, simFlowRate);
  }, []);

  useEffect(() => {
    if (activeSubTab === 'tasks') fetchTasks();
    if (activeSubTab === 'today') fetchTodayPlans();
    if (activeSubTab === 'reassign') fetchReassignments();
    if (activeSubTab === 'incentive') fetchIncentives();
    if (activeSubTab === 'receipts') fetchReceipts();
  }, [activeSubTab, selectedCollectorFilter, taskBucketFilter, taskStatusFilter, planDate]);

  // -----------------------------------------------------------------
  // HANDLERS: TASK LIST & TODAY'S PLAN
  // -----------------------------------------------------------------

  const handleToggleSelectTask = (agrNo) => {
    setSelectedTaskIds((prev) =>
      prev.includes(agrNo) ? prev.filter((id) => id !== agrNo) : [...prev, agrNo]
    );
  };

  const handleSelectAllTasks = () => {
    if (selectedTaskIds.length === taskList.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(taskList.map((t) => t.agreement_no));
    }
  };

  const handleAddSingleToPlan = async (task) => {
    try {
      await addToTodayPlan({
        agreement_no: task.agreement_no,
        collector_username: task.collector_username || 'andi',
        collector_name: task.collector_name || 'Andi Pratama',
        priority: task.dpd > 30 ? 'HIGH' : 'MEDIUM',
        plan_date: planDate,
      });
      setSuccessNotice(`Akun ${task.agreement_no} berhasil dimasukkan ke Today's Plan untuk ${task.collector_name || 'Andi Pratama'}!`);
      fetchTasks();
      fetchTodayPlans();
    } catch (err) {
      alert('Gagal menambah ke Today\'s Plan: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleBulkAddToPlan = async () => {
    if (selectedTaskIds.length === 0) return;
    try {
      const activeCollector = collectorsList.find(c => c.username === selectedCollectorFilter);
      const res = await bulkAddToTodayPlan({
        agreement_nos: selectedTaskIds,
        collector_username: selectedCollectorFilter !== 'ALL' ? selectedCollectorFilter : 'andi',
        collector_name: activeCollector?.name || 'Andi Pratama',
        plan_date: planDate,
      });
      setSuccessNotice(`Berhasil menambahkan ${res.data.count} akun ke Today's Plan!`);
      setSelectedTaskIds([]);
      fetchTasks();
      fetchTodayPlans();
    } catch (err) {
      alert('Gagal menambahkan massal: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleUpdatePlanStatus = async (planId, status) => {
    try {
      await updateTodayPlanStatus(planId, { status });
      setSuccessNotice(`Status kunjungan berhasil diubah menjadi ${status}!`);
      fetchTodayPlans();
      fetchTasks();
    } catch (err) {
      alert('Gagal update status: ' + err.message);
    }
  };

  const handleRemoveFromPlan = async (planId) => {
    if (!window.confirm('Hapus task ini dari Today\'s Plan?')) return;
    try {
      await removeFromTodayPlan(planId);
      setSuccessNotice('Task berhasil dihapus dari Today\'s Plan!');
      fetchTodayPlans();
      fetchTasks();
    } catch (err) {
      alert('Gagal menghapus plan: ' + err.message);
    }
  };

  // -----------------------------------------------------------------
  // HANDLERS: CUSTOMER FORM MODAL
  // -----------------------------------------------------------------

  const handleOpenCustomerForm = (task) => {
    setCustomerFormTask(task);
    setVisitStatus(task.status === 'PROMISE_TO_PAY' ? 'PTP' : 'VISITED');
    setVisitNotes('');
    setVisitPTPDate(task.ptp_date ? task.ptp_date.split('T')[0] : '');
    setVisitPTPAmount(task.ptp_amount || task.agreement?.installment_amount || '');
  };

  const handleSaveCustomerFormAction = async (e) => {
    e.preventDefault();
    if (!customerFormTask) return;

    try {
      setSavingVisit(true);
      const isPTP = visitStatus === 'PTP';
      await logActivity({
        overdue_account_id: customerFormTask.id,
        agreement_no: customerFormTask.agreement_no,
        channel_type: 'FO',
        performed_by: customerFormTask.collector_name || customerFormTask.assigned_pic || 'Andi Pratama',
        contact_status: visitStatus,
        result_code: visitStatus,
        ptp_date: isPTP && visitPTPDate ? new Date(visitPTPDate).toISOString() : null,
        ptp_amount: isPTP && visitPTPAmount ? Number(visitPTPAmount) : 0,
        geo_lat: -6.195042,
        geo_lng: 106.823145,
        notes: `[Customer Form Kunjungan] Status: ${visitStatus}. Catatan: ${visitNotes}`,
      });

      // Update Today's Plan status jika task terkait ada di today's plan
      if (customerFormTask.plan_id) {
        await updateTodayPlanStatus(customerFormTask.plan_id, {
          status: visitStatus,
          notes: visitNotes,
          ptp_date: isPTP && visitPTPDate ? new Date(visitPTPDate).toISOString() : null,
          ptp_amount: isPTP && visitPTPAmount ? Number(visitPTPAmount) : 0,
        });
      }

      setSuccessNotice(`Laporan penagihan untuk ${customerFormTask.agreement?.customer?.name} berhasil disimpan!`);
      setCustomerFormTask(null);
      fetchTasks();
      fetchTodayPlans();
    } catch (err) {
      alert('Gagal menyimpan hasil kunjungan: ' + (err.response?.data?.error || err.message));
    } finally {
      setSavingVisit(false);
    }
  };

  // -----------------------------------------------------------------
  // HANDLERS: REASSIGN COLLECTOR
  // -----------------------------------------------------------------

  const handleExecuteReassign = async (e) => {
    e.preventDefault();
    if (reassignAgreements.length === 0) {
      alert('Pilih minimal satu akun kontrak untuk direassign!');
      return;
    }
    if (!toCollector) {
      alert('Pilih kolektor tujuan!');
      return;
    }

    try {
      setReassignSubmitting(true);
      const res = await reassignCollector({
        agreement_nos: reassignAgreements,
        to_collector: toCollector,
        reason: reassignReason,
        notes: reassignNotes || 'Pengalihan penugasan portofolio penagihan',
        reassigned_by: 'Bambang Wijaya (AR Head)',
      });

      setSuccessNotice(res.data.message || 'Akun berhasil dialihkan!');
      setReassignAgreements([]);
      setReassignNotes('');
      fetchTasks();
      fetchTodayPlans();
      fetchReassignments();
    } catch (err) {
      alert('Gagal reassign: ' + (err.response?.data?.error || err.message));
    } finally {
      setReassignSubmitting(false);
    }
  };

  // -----------------------------------------------------------------
  // HANDLERS: INCENTIVE ENGINE PRESETS
  // -----------------------------------------------------------------

  const applyIncentivePreset = (type) => {
    if (type === 'SCENARIO_A') {
      // Skenario A (Andi - Flow Rate Bagus 8% -> Bonus Pengali 1.2 -> Rp 3.240.000)
      setSimBaseIncentive(3000000);
      setSimCollectionRate(90);
      setSimFlowRate(8.0);
      runLiveIncentiveSimulation(3000000, 90, 8.0);
    } else if (type === 'SCENARIO_B') {
      // Skenario B (Andi - Flow Rate Buruk 18% -> Penalti Pengurang 0.8 -> Rp 2.160.000)
      setSimBaseIncentive(3000000);
      setSimCollectionRate(90);
      setSimFlowRate(18.0);
      runLiveIncentiveSimulation(3000000, 90, 18.0);
    } else if (type === 'EXCELLENT') {
      setSimBaseIncentive(3000000);
      setSimCollectionRate(100);
      setSimFlowRate(5.0);
      runLiveIncentiveSimulation(3000000, 100, 5.0);
    }
  };

  // -----------------------------------------------------------------
  // HANDLERS: RECORD PAYMENT & PIS
  // -----------------------------------------------------------------

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!paymentModalAccount || !paymentAmount) return;

    try {
      const res = await recordMCollectPayment({
        agreement_no: paymentModalAccount.agreement_no,
        amount_paid: Number(paymentAmount),
        payment_method: paymentMethod,
        collector_username: paymentModalAccount.collector_username || paymentModalAccount.assigned_pic || 'andi',
        collector_name: paymentModalAccount.collector_name || paymentModalAccount.assigned_pic || 'Andi Pratama',
        geotag_lat: -6.195042,
        geotag_lng: 106.823145,
        send_whatsapp_now: sendWANow,
        notes: paymentNotes,
      });

      const slip = res.data.receipt;
      setPaymentModalAccount(null);
      setPaymentAmount('');
      setPaymentNotes('');
      fetchTasks();
      fetchTodayPlans();
      fetchReceipts();

      if (res.data.whatsapp_url && sendWANow) {
        window.open(res.data.whatsapp_url, '_blank');
      }

      setActiveSlip(slip);
      setSuccessNotice(`Pembayaran ${formatRupiah(slip.amount_paid)} berhasil dicatat & PIS ${slip.receipt_no} telah terbit.`);
    } catch (err) {
      alert('Gagal mencatat pembayaran: ' + (err.response?.data?.error || err.message));
    }
  };

  // -----------------------------------------------------------------
  // HANDLERS: PAYMENT LINK QRIS / VA
  // -----------------------------------------------------------------

  const handleGeneratePaymentLink = async (e) => {
    e.preventDefault();
    if (!linkModalAccount || !linkAmount) return;

    try {
      const res = await requestPaymentLink({
        agreement_no: linkModalAccount.agreement_no,
        amount: Number(linkAmount),
        method: linkMethod,
        collector: linkModalAccount.collector_name || linkModalAccount.assigned_pic || 'Andi Pratama',
      });
      setGeneratedLinkResult(res.data);
      fetchReceipts();
    } catch (err) {
      alert('Gagal membuat tautan bayar: ' + (err.response?.data?.error || err.message));
    }
  };

  // -----------------------------------------------------------------
  // HANDLERS: EARLY PAYOFF SIMULATOR
  // -----------------------------------------------------------------

  const handleRunForeclosure = async (e) => {
    e.preventDefault();
    if (!foreclosureAccount) return;

    try {
      setSimulating(true);
      const res = await simulateForeclosure({
        agreement_no: foreclosureAccount.agreement_no,
        penalty_pct: Number(penaltyPct),
        interest_discount_pct: Number(interestDiscountPct),
      });
      setForeclosureResult(res.data);
    } catch (err) {
      alert('Gagal simulasi pelunasan: ' + (err.response?.data?.error || err.message));
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            <span>CRMS Field Force • Collector Workbench & CMS Incentive</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Collector Hub & Insentif Flow Rate
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-2xl">
            Manajemen lengkap tugas penagihan lapangan, jadwal rute harian, form debitur, pengalihan akun supervisi, serta kalkulasi insentif berbasis matriks Bucket Flow Rate.
          </p>
        </div>

        {/* Collector Selector Badge */}
        <div className="flex flex-wrap items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/15 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-200 font-semibold">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Kolektor:</span>
          </div>
          <select
            value={selectedCollectorFilter}
            onChange={(e) => setSelectedCollectorFilter(e.target.value)}
            className="bg-emerald-950/80 text-white font-medium px-2.5 py-1 rounded-lg border border-emerald-500/40 text-xs focus:outline-none"
          >
            <option value="ALL">Semua Kolektor</option>
            {collectorsList.map((c) => (
              <option key={c.username} value={c.username}>
                {c.name} ({c.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successNotice && (
        <div className="p-3.5 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice(null)} className="text-emerald-700 hover:text-emerald-900 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Subtab Pill Switcher (Mobile Scrollable) */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none whitespace-nowrap border-b border-gray-200 bg-white p-2 rounded-xl shadow-sm">
        <button
          onClick={() => setActiveSubTab('tasks')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeSubTab === 'tasks'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Task List ({taskList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('today')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeSubTab === 'today'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Today's Plan ({todayPlans.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reassign')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeSubTab === 'reassign'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Reassign Collector</span>
        </button>

        <button
          onClick={() => setActiveSubTab('incentive')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeSubTab === 'incentive'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Insentif Flow Rate CMS</span>
        </button>

        <button
          onClick={() => setActiveSubTab('receipts')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeSubTab === 'receipts'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>PIS Kuitansi & Simulator</span>
        </button>
      </div>

      {/* ================================================================= */}
      {/* 1. SUBTAB: TASK LIST (List task yang di-assign ke collector)       */}
      {/* ================================================================= */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Filters, Bulk Add */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                placeholder="Cari No Kontrak / Nama Debitur..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Filter Bucket */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-500 font-medium">Bucket:</span>
              {['ALL', '1-3', '4-7', '8-13', '14-18', '19-25', '26-30', '31-60'].map((b) => (
                <button
                  key={b}
                  onClick={() => setTaskBucketFilter(b)}
                  className={`px-2 py-1 rounded font-medium ${
                    taskBucketFilter === b
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {selectedTaskIds.length > 0 && (
                <button
                  onClick={handleBulkAddToPlan}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>+ {selectedTaskIds.length} Masukkan ke Today's Plan</span>
                </button>
              )}
            </div>
          </div>

          {/* Task List Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-3 text-center w-10">
                      <button onClick={handleSelectAllTasks} className="text-gray-500 hover:text-gray-700">
                        {selectedTaskIds.length === taskList.length && taskList.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">No Kontrak & Debitur</th>
                    <th className="px-4 py-3 text-left">Fasilitas Pinjaman</th>
                    <th className="px-4 py-3 text-right">Tunggakan (Overdue)</th>
                    <th className="px-4 py-3 text-center">DPD & Bucket</th>
                    <th className="px-4 py-3 text-center">Kolektor Ditugaskan</th>
                    <th className="px-4 py-3 text-center">Status Plan</th>
                    <th className="px-4 py-3 text-center">Aksi Petugas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-gray-500">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                        Memuat daftar task kolektor...
                      </td>
                    </tr>
                  ) : taskList.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-gray-500">
                        Tidak ada task yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    taskList.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50 transition">
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => handleToggleSelectTask(t.agreement_no)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {selectedTaskIds.includes(t.agreement_no) ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Kontrak & Debitur (Klik untuk buka Customer Form) */}
                        <td
                          className="px-4 py-3 cursor-pointer group"
                          onClick={() => handleOpenCustomerForm(t)}
                        >
                          <div className="font-bold text-gray-900 group-hover:text-emerald-700 flex items-center gap-1.5">
                            <span>{t.agreement_no}</span>
                            <Eye className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600" />
                          </div>
                          <div className="text-gray-700 font-semibold">{t.agreement?.customer?.name}</div>
                          <div className="text-[11px] text-gray-400">CIF: {t.agreement?.customer?.customer_no}</div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{t.agreement?.asset_model}</div>
                          <div className="text-[11px] text-gray-500">
                            Plafon: {formatRupiah(t.agreement?.total_financing)}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="font-bold text-rose-600">{formatRupiah(t.overdue_amount)}</div>
                          <div className="text-[11px] text-gray-500">
                            Angsuran: {formatRupiah(t.agreement?.installment_amount)}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800">
                            DPD {t.dpd}
                          </span>
                          <div className="text-[11px] text-gray-500 mt-0.5">Bucket {t.current_bucket}</div>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <div className="font-bold text-gray-900 flex items-center justify-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{t.collector_name || 'Andi Pratama'}</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                              {t.assigned_pic || 'Field Collector'}
                            </span>
                          </div>
                        </td>

                        {/* Status Today's Plan */}
                        <td className="px-4 py-3 text-center">
                          {t.in_today_plan ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Rute #{t.plan_route_no}
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAddSingleToPlan(t)}
                              className="px-2 py-1 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 rounded text-[11px] font-semibold transition"
                            >
                              + Ke Plan
                            </button>
                          )}
                        </td>

                        {/* Aksi Buka Customer Form */}
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleOpenCustomerForm(t)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition flex items-center gap-1 mx-auto text-xs"
                          >
                            <span>Customer Form</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 2. SUBTAB: TODAY'S PLAN (Daftar task yang sudah dipilih hari ini)   */}
      {/* ================================================================= */}
      {activeSubTab === 'today' && (
        <div className="space-y-4">
          {/* Header Controls & Summary Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-xs text-gray-500 font-medium">Total Rencana Hari Ini</div>
              <div className="text-2xl font-black text-gray-900 mt-1">
                {planSummary?.total_planned || todayPlans.length} Akun
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">Jadwal rute kunjungan aktif</div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
              <div className="text-xs text-emerald-700 font-medium">Selesai / Dikunjungi</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {planSummary?.completed_count || 0} Akun
              </div>
              <div className="text-[11px] text-emerald-600 mt-0.5">
                Progress: {planSummary?.progress_pct || 0}% target hari ini
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-sm">
              <div className="text-xs text-blue-700 font-medium">Target Tagihan Rute</div>
              <div className="text-lg sm:text-xl font-black text-blue-700 mt-1">
                {formatRupiah(planSummary?.total_target_amount || 0)}
              </div>
              <div className="text-[11px] text-blue-600 mt-0.5">Total tunggakan portofolio</div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-sm">
              <div className="text-xs text-amber-700 font-medium">Realisasi Lapangan Hari Ini</div>
              <div className="text-lg sm:text-xl font-black text-amber-700 mt-1">
                {formatRupiah(planSummary?.total_collected_amount || 0)}
              </div>
              <div className="text-[11px] text-amber-600 mt-0.5">Tercatat via kuitansi digital PIS</div>
            </div>
          </div>

          {/* Date Selector & Action Bar */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Tanggal Rencana:</span>
              <input
                type="date"
                value={planDate}
                onChange={(e) => setPlanDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="text-xs text-gray-500">
              Mengurutkan berdasarkan urutan rute perjalanan lapangan (Route Sequence).
            </div>
          </div>

          {/* Today's Plan Cards / Ordered Timeline */}
          {todayPlans.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="font-semibold text-sm text-gray-700">Belum ada task di Today's Plan hari ini ({planDate})</p>
              <p className="text-xs text-gray-500 mt-1">
                Pilih task dari tab <strong className="text-emerald-700">"Task List"</strong> dan klik <em>"+ Ke Plan"</em> untuk menyusun rencana harian Anda.
              </p>
              <button
                onClick={() => setActiveSubTab('tasks')}
                className="mt-3 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
              >
                Buka Task List Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayPlans.map((plan, idx) => {
                const acc = plan.overdue_account || {};
                const cust = acc.agreement?.customer || {};
                return (
                  <div
                    key={plan.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left: Sequence, Estimasi, Info Debitur */}
                    <div className="flex items-start gap-3.5 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-lg flex items-center justify-center shrink-0">
                        #{plan.route_order || idx + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-black text-gray-900 text-sm">{acc.agreement_no}</span>
                          <span className="font-bold text-gray-800 text-xs">• {cust.name}</span>
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            DPD {acc.dpd} ({acc.current_bucket})
                          </span>
                          <span
                            className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                              plan.priority === 'HIGH'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            Prioritas: {plan.priority}
                          </span>
                        </div>

                        <div className="text-xs text-gray-600 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <User className="w-3 h-3 text-emerald-600" />
                            Kolektor: {plan.collector_name || 'Andi Pratama'}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-rose-600">
                            Tunggakan: {formatRupiah(acc.overdue_amount)}
                          </span>
                          <span>•</span>
                          <span className="text-gray-500">Angsuran: {formatRupiah(acc.agreement?.installment_amount)}</span>
                        </div>

                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate max-w-md">{cust.address}</span>
                        </div>

                        {plan.notes && (
                          <div className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200 mt-1">
                            Catatan: {plan.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Status Pill & Action Buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-2 border-t md:border-t-0 pt-2 md:pt-0 shrink-0">
                      {/* Status Dropdown */}
                      <select
                        value={plan.status}
                        onChange={(e) => handleUpdatePlanStatus(plan.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none ${
                          plan.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : plan.status === 'PTP'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : plan.status === 'VISITED'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : plan.status === 'IN_PROGRESS'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        }`}
                      >
                        <option value="PLANNED">PLANNED (Belum)</option>
                        <option value="IN_PROGRESS">IN_PROGRESS (Menuju)</option>
                        <option value="VISITED">VISITED (Selesai Kunjungan)</option>
                        <option value="PTP">PTP (Janji Bayar)</option>
                        <option value="PAID">PAID (Lunas Lapangan)</option>
                      </select>

                      {/* Customer Form Button */}
                      <button
                        onClick={() => handleOpenCustomerForm({ ...acc, plan_id: plan.id })}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Customer Form</span>
                      </button>

                      {/* Pay Quick Button */}
                      <button
                        onClick={() => {
                          setPaymentModalAccount(acc);
                          setPaymentAmount(acc.overdue_amount);
                        }}
                        className="px-2.5 py-1.5 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 rounded-lg text-xs font-semibold transition"
                        title="Terima bayar langsung & terbitkan PIS"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Plan Button */}
                      <button
                        onClick={() => handleRemoveFromPlan(plan.id)}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition"
                        title="Hapus dari Today's Plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. SUBTAB: REASSIGN COLLECTOR (Pemindahan tugas antar kolektor)     */}
      {/* ================================================================= */}
      {activeSubTab === 'reassign' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900">
                  Form Pengalihan Tugas Penagihan (Reassign Collector)
                </h3>
                <p className="text-xs text-gray-500">
                  Alihkan akun secara tunggal atau massal ke kolektor lain dengan alasan operasional yang tercatat di audit trail.
                </p>
              </div>
            </div>

            <form onSubmit={handleExecuteReassign} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pilih Kolektor Tujuan */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Kolektor Baru (Tujuan Reassignment) *
                  </label>
                  <select
                    value={toCollector}
                    onChange={(e) => setToCollector(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    required
                  >
                    {collectorsList.map((c) => (
                      <option key={c.username} value={c.username}>
                        {c.name} — {c.role} ({c.bucket})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Alasan Reassign */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Alasan Pengalihan (Reason) *
                  </label>
                  <select
                    value={reassignReason}
                    onChange={(e) => setReassignReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    required
                  >
                    <option value="OVERLOAD">Beban Kerja / Kapasitas Kolektor Penuh (Overload)</option>
                    <option value="SICK_LEAVE">Petugas Sakit / Cuti / Izin (Out-of-Office)</option>
                    <option value="AREA_ROTATION">Rotasi Wilayah / Zonasi Domisili (Area Rotation)</option>
                    <option value="PERFORMANCE_ESCALATION">Eskalasi Kinerja Khusus (Performance Escalation)</option>
                    <option value="OTHER">Lain-lain / Instruksi AR Head</option>
                  </select>
                </div>
              </div>

              {/* Pilih Akun yang akan dialihkan */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Pilih Akun yang akan Direassign ({reassignAgreements.length} akun terpilih) *
                </label>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50/50 space-y-1">
                  {taskList.slice(0, 20).map((task) => (
                    <label
                      key={task.agreement_no}
                      className="flex items-center gap-2 p-1.5 hover:bg-white rounded cursor-pointer transition text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={reassignAgreements.includes(task.agreement_no)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setReassignAgreements((prev) => [...prev, task.agreement_no]);
                          } else {
                            setReassignAgreements((prev) => prev.filter((a) => a !== task.agreement_no));
                          }
                        }}
                        className="rounded text-indigo-600"
                      />
                      <span className="font-bold text-gray-900">{task.agreement_no}</span>
                      <span className="text-gray-700">{task.agreement?.customer?.name}</span>
                      <span className="text-gray-500 font-medium">({task.collector_name || task.assigned_pic} • DPD {task.dpd})</span>
                      <span className="ml-auto font-semibold text-rose-600">
                        {formatRupiah(task.overdue_amount)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Catatan Reassignment */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Catatan Tambahan Supervisi</label>
                <input
                  type="text"
                  value={reassignNotes}
                  onChange={(e) => setReassignNotes(e.target.value)}
                  placeholder="e.g. Alihkan area Menteng ke Andi Pratama sesuai rotasi kuartal..."
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={reassignSubmitting}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>{reassignSubmitting ? 'Memproses...' : 'Eksekusi Reassignment Akun'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Audit Trail Log Reassignments */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <h4 className="font-extrabold text-sm text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>Riwayat Audit Trail Reassign Collector</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase">
                  <tr>
                    <th className="px-3 py-2.5 text-left">Waktu</th>
                    <th className="px-3 py-2.5 text-left">No Kontrak & Debitur</th>
                    <th className="px-3 py-2.5 text-center">Kolektor Asal</th>
                    <th className="px-3 py-2.5 text-center">Kolektor Tujuan</th>
                    <th className="px-3 py-2.5 text-left">Alasan & Catatan</th>
                    <th className="px-3 py-2.5 text-center">Diproses Oleh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reassignmentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">
                        {new Date(log.reassigned_at).toLocaleString('id-ID')}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-bold text-gray-900">{log.agreement_no}</div>
                        <div className="text-gray-500">{log.overdue_account?.agreement?.customer?.name}</div>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold">
                          {log.from_collector}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                          {log.to_collector}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="font-semibold text-gray-800">{log.reason}</span>
                        {log.notes && <div className="text-gray-500 text-[11px]">{log.notes}</div>}
                      </td>
                      <td className="px-3 py-2.5 text-center text-gray-600 font-medium">
                        {log.reassigned_by}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. SUBTAB: INSENTIF COLLECTOR DENGAN BUCKET FLOW RATE MODIFIER     */}
      {/* ================================================================= */}
      {activeSubTab === 'incentive' && (
        <div className="space-y-6">
          {/* Explanation Header Card */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-orange-500/10 border border-amber-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-amber-950">
                  Simulasi & Perhitungan Insentif CMS (Bucket Flow Rate Modifier)
                </h3>
                <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                  Sistem penagihan (Collection Management System) mengintegrasikan variabel <strong>Bucket Flow Rate</strong> (tingkat kegagalan menagih sehingga akun bergeser ke tingkat tunggakan yang lebih parah).
                  Semakin rendah flow rate, kinerja kolektor semakin bagus (mendapat <strong>Bonus Pengali</strong>). Sebaliknya, semakin tinggi flow rate, insentif dipotong (<strong>Penalti Pengurang</strong>).
                </p>
              </div>
            </div>
          </div>

          {/* Matriks Aturan Bucket Flow Rate (Modifier) */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
            <h4 className="font-extrabold text-xs sm:text-sm text-gray-900 mb-3 flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-600" />
              <span>Matriks Aturan Flow Rate Modifier (Target Maksimal Manajemen: 15%)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">&lt; 10%</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-200 text-emerald-900">
                    Sangat Bagus
                  </span>
                </div>
                <div className="text-xl font-black text-emerald-700 mt-2">Pengali: 1.2</div>
                <div className="text-[11px] text-emerald-800 font-semibold mt-1">Insentif naik 20% (Bonus)</div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900">10% - 15%</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-200 text-blue-900">
                    Memenuhi Target
                  </span>
                </div>
                <div className="text-xl font-black text-blue-700 mt-2">Pengali: 1.0</div>
                <div className="text-[11px] text-blue-800 font-semibold mt-1">Insentif Utuh (100%)</div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900">15.1% - 20%</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200 text-amber-900">
                    Buruk
                  </span>
                </div>
                <div className="text-xl font-black text-amber-700 mt-2">Pengurang: 0.8</div>
                <div className="text-[11px] text-amber-800 font-semibold mt-1">Insentif dipotong 20%</div>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900">&gt; 20%</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-200 text-rose-900">
                    Sangat Buruk
                  </span>
                </div>
                <div className="text-xl font-black text-rose-700 mt-2">Pengurang: 0.5</div>
                <div className="text-[11px] text-rose-800 font-semibold mt-1">Insentif dipotong 50%</div>
              </div>
            </div>
          </div>

          {/* Live Simulator & Skenario Andi A vs B */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-indigo-600" />
                  <span>Simulator Interaktif Kalkulasi Insentif Kolektor</span>
                </h4>
                <p className="text-xs text-gray-500">
                  Uji skenario real-time perhitungan matematis dengan formula CMS otomatis.
                </p>
              </div>

              {/* Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => applyIncentivePreset('SCENARIO_A')}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Skenario A (Andi 8% Flow - Bonus)</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyIncentivePreset('SCENARIO_B')}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Skenario B (Andi 18% Flow - Penalti)</span>
                </button>
              </div>
            </div>

            {/* Inputs & Live Calculation Result */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Inputs Column */}
              <div className="lg:col-span-6 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Insentif Dasar (Base Incentive): {formatRupiah(simBaseIncentive)}
                  </label>
                  <input
                    type="range"
                    min="1000000"
                    max="10000000"
                    step="500000"
                    value={simBaseIncentive}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setSimBaseIncentive(v);
                      runLiveIncentiveSimulation(v, simCollectionRate, simFlowRate);
                    }}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Pencapaian KPI Utama Penagihan (Collection Rate): {simCollectionRate}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    step="5"
                    value={simCollectionRate}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setSimCollectionRate(v);
                      runLiveIncentiveSimulation(simBaseIncentive, v, simFlowRate);
                    }}
                    className="w-full accent-blue-600"
                  />
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Insentif Berjalan = {simCollectionRate}% x {formatRupiah(simBaseIncentive)} ={' '}
                    <strong>{formatRupiah((simCollectionRate / 100) * simBaseIncentive)}</strong>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Realisasi Bucket Flow Rate (Kemacetan Bergeser): {simFlowRate}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="35"
                    step="0.5"
                    value={simFlowRate}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setSimFlowRate(v);
                      runLiveIncentiveSimulation(simBaseIncentive, simCollectionRate, v);
                    }}
                    className="w-full accent-amber-600"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-0.5">
                    <span>&lt;10% (Bonus 1.2x)</span>
                    <span>10-15% (Utuh 1.0x)</span>
                    <span>15.1-20% (Potong 0.8x)</span>
                    <span>&gt;20% (Potong 0.5x)</span>
                  </div>
                </div>
              </div>

              {/* Output Result Card */}
              {simResult && (
                <div className="lg:col-span-6 bg-slate-900 text-white rounded-xl p-4 sm:p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Hasil Simulasi Payout CMS</span>
                      <span
                        className={`px-2 py-0.5 rounded font-extrabold text-[11px] ${
                          simResult.modifier > 1.0
                            ? 'bg-emerald-500 text-white'
                            : simResult.modifier === 1.0
                            ? 'bg-blue-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {simResult.modifier_label}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="text-xs text-slate-400">Insentif Akhir yang Diterima:</div>
                      <div className="text-3xl font-black text-emerald-400 mt-1">
                        {formatRupiah(simResult.final_incentive)}
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Insentif Berjalan (KPI {simResult.collection_rate_pct}%):</span>
                        <span className="font-semibold">{formatRupiah(simResult.running_incentive)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Modifier Flow Rate ({simResult.flow_rate_pct}%):</span>
                        <span className="font-bold text-amber-400">x {simResult.modifier}</span>
                      </div>
                      <div className="flex justify-between font-bold text-white border-t border-slate-700 pt-1">
                        <span>Rumus:</span>
                        <span>{simResult.formula}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-2.5 bg-slate-800/80 rounded-lg text-xs text-slate-200 border border-slate-700">
                    <p className="leading-snug">{simResult.impact_explanation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabel Rekapitulasi Portofolio Kolektor Bulan Berjalan */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Rekapitulasi Insentif Portofolio Kolektor ({incentivesData?.period_month || 'Bulan Berjalan'})</span>
              </h4>
              <span className="text-xs text-gray-500 font-medium">Auto-Calculated by CMS Logic</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase">
                  <tr>
                    <th className="px-3 py-3 text-left">Nama Kolektor & Jabatan</th>
                    <th className="px-3 py-3 text-center">Bucket</th>
                    <th className="px-3 py-3 text-right">Target vs Realisasi</th>
                    <th className="px-3 py-3 text-center">KPI Utama (%)</th>
                    <th className="px-3 py-3 text-center">Flow Rate (%)</th>
                    <th className="px-3 py-3 text-center">Modifier</th>
                    <th className="px-3 py-3 text-right">Insentif Akhir</th>
                    <th className="px-3 py-3 text-center">Slip Digital</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {(incentivesData?.collectors || []).map((col, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-3 py-3">
                        <div className="font-extrabold text-gray-900">{col.collector_name}</div>
                        <div className="text-gray-500 text-[11px]">{col.role_title}</div>
                      </td>
                      <td className="px-3 py-3 text-center font-semibold text-gray-700">
                        {col.bucket_handled}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="font-bold text-gray-900">{formatRupiah(col.actual_collection)}</div>
                        <div className="text-[11px] text-gray-400">Target: {formatRupiah(col.target_collection)}</div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-bold text-indigo-700">{col.collection_rate_pct}%</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`font-black ${
                            col.flow_rate_pct < 10
                              ? 'text-emerald-600'
                              : col.flow_rate_pct <= 15
                              ? 'text-blue-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {col.flow_rate_pct}%
                        </span>
                        <div className="text-[10px] text-gray-400">
                          {col.flowed_accounts} dari {col.total_portfolio_accounts} akun
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            col.modifier > 1.0
                              ? 'bg-emerald-100 text-emerald-800'
                              : col.modifier === 1.0
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          x {col.modifier}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="font-black text-sm text-emerald-700">
                          {formatRupiah(col.final_incentive)}
                        </div>
                        <div className="text-[10px] text-gray-400">{col.formula_detail}</div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => setSelectedSlipCollector(col)}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg transition flex items-center gap-1 mx-auto text-xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Slip Insentif</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 5. SUBTAB: RECEIPTS PIS & TOOLS LAPANGAN                           */}
      {/* ================================================================= */}
      {activeSubTab === 'receipts' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-gray-900">
                Riwayat Kuitansi Digital PIS (Payment Information Slip)
              </h4>
              <p className="text-xs text-gray-500">
                Kuitansi resmi yang diterbitkan langsung oleh kolektor di lapangan secara real-time.
              </p>
            </div>
            <button
              onClick={fetchReceipts}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">No Kuitansi (PIS)</th>
                    <th className="px-4 py-3 text-left">No Kontrak & Debitur</th>
                    <th className="px-4 py-3 text-right">Nominal Diterima</th>
                    <th className="px-4 py-3 text-center">Metode Bayar</th>
                    <th className="px-4 py-3 text-left">Petugas Kolektor</th>
                    <th className="px-4 py-3 text-left">Waktu Diterbitkan</th>
                    <th className="px-4 py-3 text-center">Aksi PIS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {receipts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-gray-400">
                        Belum ada kuitansi PIS diterbitkan.
                      </td>
                    </tr>
                  ) : (
                    receipts.map((slip) => (
                      <tr key={slip.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-bold text-gray-900">{slip.receipt_no}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-800">{slip.agreement_no}</div>
                          <div className="text-gray-500">{slip.customer?.name}</div>
                        </td>
                        <td className="px-4 py-3 text-right font-black text-emerald-700">
                          {formatRupiah(slip.amount_paid)}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-gray-700">
                          {slip.payment_method}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800">{slip.collector_name}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(slip.issued_at).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setActiveSlip(slip)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition"
                          >
                            Buka PIS
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 1: CUSTOMER FORM (Muncul ketika salah satu task di-klik)     */}
      {/* ================================================================= */}
      {customerFormTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden">
            {/* Header Profil Debitur */}
            <div className="flex items-start justify-between border-b pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center shrink-0">
                  {customerFormTask.agreement?.customer?.name?.charAt(0) || 'D'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-gray-900">
                      {customerFormTask.agreement?.customer?.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      DPD {customerFormTask.dpd} ({customerFormTask.current_bucket})
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2 mt-1">
                    <span>No Kontrak: <strong>{customerFormTask.agreement_no}</strong></span>
                    <span>•</span>
                    <span>CIF: {customerFormTask.agreement?.customer?.customer_no}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <User className="w-3 h-3 text-emerald-600" />
                      Kolektor: {customerFormTask.collector_name || 'Andi Pratama'} ({customerFormTask.assigned_pic || 'Field Collector'})
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCustomerFormTask(null)}
                className="text-gray-400 hover:text-gray-600 p-1 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-4 text-xs py-3">
              {/* Kontak & Aksi Cepat Hubungi */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-gray-500 font-medium">Kontak Debitur:</div>
                  <div className="font-bold text-gray-900 text-sm mt-0.5">
                    {customerFormTask.agreement?.customer?.phone || 'No Telp belum terdaftar'}
                  </div>
                  <div className="text-gray-500 text-[11px]">{customerFormTask.agreement?.customer?.email}</div>
                </div>

                <div className="flex items-center gap-2">
                  {customerFormTask.agreement?.customer?.phone && (
                    <>
                      <a
                        href={`https://wa.me/${customerFormTask.agreement?.customer?.phone?.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat WA</span>
                      </a>
                      <a
                        href={`tel:${customerFormTask.agreement?.customer?.phone}`}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Telepon</span>
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Alamat & Fasilitas Pinjaman */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <div className="text-gray-500 font-medium">Alamat Domisili:</div>
                  <div className="font-semibold text-gray-800 leading-snug">
                    {customerFormTask.agreement?.customer?.address}
                  </div>
                  <div className="text-gray-500 text-[11px]">Kota: {customerFormTask.agreement?.customer?.city}</div>
                  <div className="text-gray-500 text-[11px]">Pekerjaan: {customerFormTask.agreement?.customer?.occupation}</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <div className="text-gray-500 font-medium">Fasilitas Kredit Perbankan:</div>
                  <div className="font-bold text-gray-900">{customerFormTask.agreement?.asset_model}</div>
                  <div className="text-gray-600">Plafon: {formatRupiah(customerFormTask.agreement?.total_financing)}</div>
                  <div className="text-gray-600">Angsuran / Bln: {formatRupiah(customerFormTask.agreement?.installment_amount)}</div>
                  <div className="text-rose-600 font-black">
                    Total Tunggakan: {formatRupiah(customerFormTask.overdue_amount)}
                  </div>
                </div>
              </div>

              {/* Tools Penagihan Lapangan Cepat */}
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Aksi Lapangan Cepat Petugas</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentModalAccount(customerFormTask);
                      setPaymentAmount(customerFormTask.overdue_amount);
                    }}
                    className="p-2.5 bg-white border border-emerald-300 rounded-lg text-left hover:bg-emerald-100/50 transition"
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600 mb-1" />
                    <div className="font-bold text-gray-900">Terima Bayar (PIS)</div>
                    <div className="text-[10px] text-gray-500">Terbitkan kuitansi digital</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLinkModalAccount(customerFormTask);
                      setLinkAmount(customerFormTask.overdue_amount);
                    }}
                    className="p-2.5 bg-white border border-blue-300 rounded-lg text-left hover:bg-blue-100/50 transition"
                  >
                    <QrCode className="w-4 h-4 text-blue-600 mb-1" />
                    <div className="font-bold text-gray-900">Link QRIS / VA</div>
                    <div className="text-[10px] text-gray-500">Kirim tautan bayar ke WA</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForeclosureAccount(customerFormTask);
                    }}
                    className="p-2.5 bg-white border border-amber-300 rounded-lg text-left hover:bg-amber-100/50 transition"
                  >
                    <Calculator className="w-4 h-4 text-amber-600 mb-1" />
                    <div className="font-bold text-gray-900">Simulasi Pelunasan</div>
                    <div className="text-[10px] text-gray-500">Rule 78 diskon bunga</div>
                  </button>
                </div>
              </div>

              {/* Form Input Pencatatan Kunjungan */}
              <form onSubmit={handleSaveCustomerFormAction} className="space-y-3 pt-2 border-t border-gray-100">
                <div className="font-bold text-gray-900">Form Laporan Eksekusi Kunjungan Petugas</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Hasil Kontak / Status Kunjungan *</label>
                    <select
                      value={visitStatus}
                      onChange={(e) => setVisitStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="VISITED">Bertemu Debitur Langsung</option>
                      <option value="FAMILY_CONTACTED">Bertemu Pasangan / Keluarga</option>
                      <option value="PTP">Janji Bayar (PTP Commitment)</option>
                      <option value="UNREACHABLE">Debitur Tidak di Tempat</option>
                      <option value="MOVED_ADDRESS">Pindah Alamat Domisili</option>
                      <option value="REFUSED">Menolak Melakukan Pembayaran</option>
                    </select>
                  </div>

                  {visitStatus === 'PTP' && (
                    <>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Tanggal Janji Bayar (PTP Date) *</label>
                        <input
                          type="date"
                          value={visitPTPDate}
                          onChange={(e) => setVisitPTPDate(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Nominal Komitmen PTP (Rp) *</label>
                        <input
                          type="number"
                          value={visitPTPAmount}
                          onChange={(e) => setVisitPTPAmount(e.target.value)}
                          placeholder="Nominal janji bayar..."
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          required
                        />
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Catatan Kunjungan Lapangan *</label>
                  <textarea
                    rows="3"
                    value={visitNotes}
                    onChange={(e) => setVisitNotes(e.target.value)}
                    placeholder="Masukkan uraian hasil pertemuan dengan debitur, kendala keuangan, atau komitmen penyelesaian..."
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="pt-2 flex flex-wrap sm:flex-nowrap justify-end gap-2 border-t shrink-0">
                  <button
                    type="button"
                    onClick={() => setCustomerFormTask(null)}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition"
                  >
                    Tutup
                  </button>
                  <button
                    type="submit"
                    disabled={savingVisit}
                    className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{savingVisit ? 'Menyimpan...' : 'Simpan Laporan Kunjungan'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 2: SLIP INSENTIF DIGITAL KOLEKTOR (CETAK / LIHAT DETAIL)    */}
      {/* ================================================================= */}
      {selectedSlipCollector && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden border border-amber-200">
            {/* Slip Header */}
            <div className="text-center border-b pb-4 shrink-0">
              <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base text-gray-900 uppercase tracking-wide">
                Slip Insentif Kinerja Kolektor CMS
              </h3>
              <p className="text-xs text-gray-500">
                Periode: {incentivesData?.period_month || 'September 2026'} • CRMS Banking Core
              </p>
            </div>

            {/* Slip Body */}
            <div className="overflow-y-auto flex-1 pr-1 py-4 space-y-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nama Petugas:</span>
                  <span className="font-bold text-gray-900">{selectedSlipCollector.collector_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jabatan / Role:</span>
                  <span className="font-medium text-gray-800">{selectedSlipCollector.role_title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bucket Dikelola:</span>
                  <span className="font-medium text-gray-800">{selectedSlipCollector.bucket_handled}</span>
                </div>
              </div>

              {/* Rincian Komponen Perhitungan */}
              <div className="border border-gray-200 rounded-xl p-3 space-y-2">
                <div className="font-bold text-gray-900 border-b pb-1.5">Rincian Variabel Penilaian:</div>
                <div className="flex justify-between">
                  <span className="text-gray-600">1. Insentif Dasar (Base):</span>
                  <span className="font-bold">{formatRupiah(selectedSlipCollector.base_incentive)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">2. Target KPI Penagihan:</span>
                  <span>{formatRupiah(selectedSlipCollector.target_collection)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">3. Realisasi Penagihan:</span>
                  <span className="font-bold text-indigo-700">
                    {formatRupiah(selectedSlipCollector.actual_collection)} ({selectedSlipCollector.collection_rate_pct}%)
                  </span>
                </div>
                <div className="flex justify-between bg-gray-50 p-1.5 rounded">
                  <span className="text-gray-700 font-semibold">Insentif Berjalan (90% x Base):</span>
                  <span className="font-bold text-gray-900">
                    {formatRupiah(selectedSlipCollector.running_incentive)}
                  </span>
                </div>

                <div className="pt-2 border-t space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">4. Realisasi Bucket Flow Rate:</span>
                    <span className="font-bold">{selectedSlipCollector.flow_rate_pct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">5. Status Flow Rate:</span>
                    <span className="font-bold text-emerald-700">{selectedSlipCollector.flow_rate_status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">6. Faktor Pengali/Pengurang (Modifier):</span>
                    <span className="font-extrabold text-amber-700">{selectedSlipCollector.modifier_label}</span>
                  </div>
                </div>
              </div>

              {/* Total Final Payout */}
              <div className="bg-emerald-950 text-white rounded-xl p-3.5 text-center">
                <div className="text-[11px] text-emerald-300 uppercase tracking-wider font-semibold">
                  Total Insentif Bersih Diterima
                </div>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {formatRupiah(selectedSlipCollector.final_incentive)}
                </div>
                <div className="text-[11px] text-emerald-200 mt-1 font-mono">
                  Rumus: {selectedSlipCollector.formula_detail}
                </div>
              </div>
            </div>

            {/* Slip Footer Actions */}
            <div className="border-t pt-3 flex items-center justify-between shrink-0">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Slip</span>
              </button>

              <button
                onClick={() => setSelectedSlipCollector(null)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 3: CATAT PEMBAYARAN LANGSUNG & PIS KUITANSI                 */}
      {/* ================================================================= */}
      {paymentModalAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden">
            <div className="flex items-center justify-between border-b pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900">
                  Penerimaan Pembayaran Lapangan (PIS)
                </h3>
              </div>
              <button onClick={() => setPaymentModalAccount(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="overflow-y-auto flex-1 pr-1 space-y-4 text-xs py-3">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-medium">Debitur / Kontrak:</div>
                <div className="font-bold text-gray-900 text-sm">{paymentModalAccount.agreement?.customer?.name}</div>
                <div className="text-gray-600">No Kontrak: {paymentModalAccount.agreement_no}</div>
                <div className="text-rose-600 font-bold mt-1">
                  Sisa Tunggakan: {formatRupiah(paymentModalAccount.overdue_amount)}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nominal yang Dibayarkan (Rp) *</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-bold text-gray-900 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Metode Pembayaran *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="CASH">Tunai (Cash di Lapangan)</option>
                    <option value="QRIS">Scan QRIS Dinamis</option>
                    <option value="ONLINE_VA">Virtual Account Online</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Kirim Bukti WhatsApp</label>
                  <label className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg cursor-pointer bg-white">
                    <input
                      type="checkbox"
                      checked={sendWANow}
                      onChange={(e) => setSendWANow(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span className="font-medium text-gray-700">Kirim PIS ke WhatsApp</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Catatan Kuitansi</label>
                <textarea
                  rows="2"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Catatan pelunasan angsuran..."
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 border-t flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setPaymentModalAccount(null)}
                  className="px-4 py-2 border rounded-xl text-gray-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition"
                >
                  Terbitkan PIS & Catat Bayar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 4: LIHAT PIS KUITANSI DIGITAL (Slip Viewer)                 */}
      {/* ================================================================= */}
      {activeSlip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden border border-emerald-300">
            <div className="text-center border-b pb-3 shrink-0">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-sm sm:text-base text-gray-900">
                BUKTI PEMBAYARAN RESMI (PIS)
              </h3>
              <p className="text-xs text-gray-500">Payment Information Slip • CRMS Core</p>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 py-4 space-y-2.5 text-xs">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-gray-500">Nomor PIS:</span>
                <span className="font-mono font-bold text-gray-900">{activeSlip.receipt_no}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-gray-500">Waktu Pembayaran:</span>
                <span className="font-medium text-gray-800">
                  {new Date(activeSlip.issued_at).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-gray-500">No Perjanjian:</span>
                <span className="font-bold text-gray-900">{activeSlip.agreement_no}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-gray-500">Metode Pembayaran:</span>
                <span className="font-semibold text-gray-800">{activeSlip.payment_method}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-gray-500">Petugas Penagih:</span>
                <span className="font-semibold text-gray-800">{activeSlip.collector_name}</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
                <div className="text-[11px] text-emerald-800 font-semibold">Total Jumlah Disetor:</div>
                <div className="text-2xl font-black text-emerald-700 mt-0.5">
                  {formatRupiah(activeSlip.amount_paid)}
                </div>
              </div>
            </div>

            <div className="border-t pt-3 flex justify-between shrink-0">
              <button
                onClick={() => sendReceiptWhatsApp(activeSlip.id)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 text-xs shadow-sm transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Bagikan ke WA</span>
              </button>
              <button
                onClick={() => setActiveSlip(null)}
                className="px-4 py-2 border rounded-xl font-bold text-gray-700 text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 5: GENERATE PAYMENT LINK QRIS / VA                          */}
      {/* ================================================================= */}
      {linkModalAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden">
            <div className="flex items-center justify-between border-b pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900">
                  Tautan Pembayaran Digital Instan
                </h3>
              </div>
              <button
                onClick={() => {
                  setLinkModalAccount(null);
                  setGeneratedLinkResult(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 py-3 space-y-3 text-xs">
              {!generatedLinkResult ? (
                <form onSubmit={handleGeneratePaymentLink} className="space-y-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Nominal Pembayaran (Rp) *</label>
                    <input
                      type="number"
                      value={linkAmount}
                      onChange={(e) => setLinkAmount(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold text-gray-900 focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Pilihan Kanal Digital *</label>
                    <select
                      value={linkMethod}
                      onChange={(e) => setLinkMethod(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="QRIS">QRIS Dinamis Bank</option>
                      <option value="VIRTUAL_ACCOUNT">Virtual Account (VA Bank)</option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t">
                    <button
                      type="button"
                      onClick={() => setLinkModalAccount(null)}
                      className="px-4 py-2 border rounded-xl text-gray-700 font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition"
                    >
                      Buat Tautan Bayar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
                    <div className="text-xs text-blue-800 font-semibold">Nomor Virtual Account / Link:</div>
                    <div className="text-xl font-mono font-black text-blue-900 mt-1">
                      {generatedLinkResult.va_number}
                    </div>
                    <div className="text-[11px] text-blue-700 mt-1">
                      Nominal: <strong>{formatRupiah(generatedLinkResult.amount)}</strong>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border">
                    <div className="font-semibold text-gray-800 mb-1">URL Pembayaran:</div>
                    <a
                      href={generatedLinkResult.payment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline break-all text-[11px]"
                    >
                      {generatedLinkResult.payment_url}
                    </a>
                  </div>

                  <div className="pt-2 flex justify-between border-t">
                    <a
                      href={generatedLinkResult.whatsapp_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 text-xs shadow-md transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim ke WhatsApp Debitur</span>
                    </a>
                    <button
                      onClick={() => {
                        setLinkModalAccount(null);
                        setGeneratedLinkResult(null);
                      }}
                      className="px-4 py-2 border rounded-xl font-semibold text-gray-700 text-xs"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 6: SIMULATOR PELUNASAN DIPERCEPAT (Early Payoff / Rule 78)   */}
      {/* ================================================================= */}
      {foreclosureAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden">
            <div className="flex items-center justify-between border-b pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900">
                  Simulator Pelunasan Dipercepat (Rule 78)
                </h3>
              </div>
              <button
                onClick={() => {
                  setForeclosureAccount(null);
                  setForeclosureResult(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 py-3 space-y-3 text-xs">
              <form onSubmit={handleRunForeclosure} className="space-y-3">
                <div className="bg-gray-50 p-2.5 rounded-lg border">
                  <div className="font-bold text-gray-900">{foreclosureAccount.agreement_no}</div>
                  <div className="text-gray-600">{foreclosureAccount.agreement?.customer?.name}</div>
                  <div className="text-[11px] text-gray-500">
                    Plafon Awal: {formatRupiah(foreclosureAccount.agreement?.total_financing)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Biaya Penalti Pelunasan (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={penaltyPct}
                      onChange={(e) => setPenaltyPct(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Diskon Bunga Berjalan (%)</label>
                    <input
                      type="number"
                      step="1"
                      value={interestDiscountPct}
                      onChange={(e) => setInterestDiscountPct(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={simulating}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md transition"
                  >
                    {simulating ? 'Menghitung...' : 'Hitung Estimasi Pelunasan'}
                  </button>
                </div>
              </form>

              {foreclosureResult && (
                <div className="mt-3 bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 space-y-2">
                  <div className="font-bold text-amber-950 border-b border-amber-200 pb-1">
                    Hasil Kalkulasi Pelunasan Bersih:
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sisa Pokok Pinjaman:</span>
                    <span className="font-bold">{formatRupiah(foreclosureResult.outstanding_principal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bunga Berjalan Bersih:</span>
                    <span>{formatRupiah(foreclosureResult.net_interest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Early Termination ({penaltyPct}%):</span>
                    <span>{formatRupiah(foreclosureResult.early_termination_fee)}</span>
                  </div>
                  <div className="flex justify-between bg-amber-100/80 p-2 rounded-lg font-black text-amber-950 text-sm">
                    <span>Total Bersih Pelunasan:</span>
                    <span className="text-rose-700">{formatRupiah(foreclosureResult.total_net_payoff)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MCollectWorkbench;
