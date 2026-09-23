import React from 'react';
import { 
  DollarSign, 
  Users, 
  TrendingDown, 
  CheckCircle, 
  Zap,
  Sparkles,
  Shield,
  Smartphone
} from 'lucide-react';

export default function KPICards({ summary }) {
  if (!summary) return null;

  const formatRupiah = (val) => {
    if (val >= 1e9) {
      return `Rp ${(val / 1e9).toFixed(2)} M`;
    }
    if (val >= 1e6) {
      return `Rp ${(val / 1e6).toFixed(1)} Jt`;
    }
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Portfolio Overdue */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Portofolio Overdue</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              {formatRupiah(summary.total_overdue_amount)}
            </h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center">
              <span className="font-semibold text-slate-700 mr-1">{summary.total_accounts} Akun</span> Retail Non-Fleet
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>VIP: <strong className="text-purple-600">{summary.vip_accounts} Akun</strong></span>
          <span className="text-slate-300">|</span>
          <span>Reguler: <strong className="text-slate-700">{summary.total_accounts - summary.vip_accounts} Akun</strong></span>
        </div>
      </div>

      {/* Champion vs Challenger Ratio */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Champion vs Challenger</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-xl font-extrabold text-indigo-600">
                {summary.challenger_accounts}
              </span>
              <span className="text-xs font-bold text-slate-400">/</span>
              <span className="text-lg font-bold text-slate-600">
                {summary.champion_accounts}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {((summary.challenger_accounts / (summary.total_accounts || 1)) * 100).toFixed(0)}% Dialokasikan ke Proses Baru (DE)
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden">
            <div 
              className="bg-indigo-500 h-2" 
              style={{ width: `${(summary.challenger_accounts / (summary.total_accounts || 1)) * 100}%` }}
              title="Challenger Group"
            ></div>
            <div 
              className="bg-slate-400 h-2" 
              style={{ width: `${(summary.champion_accounts / (summary.total_accounts || 1)) * 100}%` }}
              title="Champion Group"
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
            <span className="text-indigo-600 font-semibold">Challenger (AP 3-8)</span>
            <span>Champion (AP 1-2)</span>
          </div>
        </div>
      </div>

      {/* Risk Level Segmentation */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Level (Decision Engine)</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-700 rounded">
                Low: {summary.low_risk_accounts}
              </span>
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 rounded">
                Med: {summary.medium_risk_accounts}
              </span>
              <span className="px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-700 rounded">
                High: {summary.high_risk_accounts}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Strategi bertingkat: Digital $\rightarrow$ Hybrid $\rightarrow$ Direct Field
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Shield className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-[11px]">
          <span className="text-emerald-700 font-medium">Non-Field: {summary.digital_pic_count}</span>
          <span className="text-amber-700 font-medium">Desk: {summary.desk_pic_count}</span>
          <span className="text-rose-700 font-medium">Field/Rem: {summary.field_pic_count + summary.remedial_pic_count}</span>
        </div>
      </div>

      {/* Strategic KPIs & Cost Efficiency */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cure & Roll Rate Target</p>
            <div className="flex items-baseline space-x-3 mt-1">
              <div>
                <span className="text-lg font-black text-emerald-600">{summary.cure_rate_pct}%</span>
                <span className="text-[10px] text-slate-400 block font-medium">Cure Rate (DPD 1-7)</span>
              </div>
              <div className="border-l border-slate-200 pl-3">
                <span className="text-lg font-black text-blue-600">{summary.roll_rate_pct}%</span>
                <span className="text-[10px] text-slate-400 block font-medium">Roll Rate to 30+</span>
              </div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center text-emerald-700 font-semibold">
            <Zap className="w-3.5 h-3.5 mr-1" />
            Digital Saving Est.: Rp {summary.cost_saved_est_million} Jt
          </span>
          <span className="text-slate-400">Target &le; 2.9%</span>
        </div>
      </div>
    </div>
  );
}
