import React, { useState } from 'react';
import { 
  Home, 
  Smartphone, 
  Cpu, 
  Radio, 
  BadgePercent, 
  Scale, 
  Warehouse, 
  ShieldAlert, 
  UserCheck, 
  CheckSquare, 
  Calendar, 
  UserPlus, 
  TrendingUp, 
  MapPin, 
  FileText, 
  Sparkles, 
  PhoneCall, 
  Layers, 
  Database, 
  Search, 
  QrCode,
  ChevronRight,
  Shield,
  Activity
} from 'lucide-react';

export default function MobileShortcutMenu({
  activeTab,
  setActiveTab,
  activeModule,
  setActiveModule,
  currentUser,
  companyInfo,
  summaryData
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const userName = currentUser?.full_name || currentUser?.username || 'nur';
  const userRole = currentUser?.role || 'PETUGAS';

  // Navigation Handler
  const handleNavigate = (tab, module = null) => {
    setActiveTab(tab);
    if (module && setActiveModule) {
      setActiveModule(module);
    }
  };

  // Determine active category for shortcuts
  const isShortcutActive = (id) => {
    switch (id) {
      case 'beranda':
        return activeTab === 'dashboard' && (activeModule === 'reguler' || !activeModule);
      case 'kolektor':
        return activeTab === 'dashboard' && (activeModule === 'mcollect' || activeModule === 'geotracker');
      case 'de':
        return activeTab === 'decision_engine' || activeTab === 'operations';
      case 'pdm':
        return activeTab === 'dashboard' && activeModule === 'pdm';
      case 'settlement':
        return activeTab === 'dashboard' && activeModule === 'settlement';
      case 'legal':
        return activeTab === 'dashboard' && activeModule === 'legal';
      case 'repo':
        return activeTab === 'dashboard' && activeModule === 'repo';
      case 'supervisi':
        return activeTab === 'vip' || (activeTab === 'dashboard' && activeModule === 'supervisory');
      default:
        return false;
    }
  };

  // 8 Main Shortcut Menu Items (Grid 4 x 2)
  const shortcuts = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: Home,
      action: () => handleNavigate('dashboard', 'reguler')
    },
    {
      id: 'kolektor',
      label: 'Kolektor',
      icon: Smartphone,
      action: () => handleNavigate('dashboard', 'mcollect')
    },
    {
      id: 'de',
      label: 'Decision DE',
      icon: Cpu,
      action: () => handleNavigate('decision_engine')
    },
    {
      id: 'pdm',
      label: 'Pre-Delinq',
      icon: Radio,
      action: () => handleNavigate('dashboard', 'pdm')
    },
    {
      id: 'settlement',
      label: 'Settlement',
      icon: BadgePercent,
      action: () => handleNavigate('dashboard', 'settlement')
    },
    {
      id: 'legal',
      label: 'Litigasi',
      icon: Scale,
      action: () => handleNavigate('dashboard', 'legal')
    },
    {
      id: 'repo',
      label: 'Eksekusi',
      icon: Warehouse,
      action: () => handleNavigate('dashboard', 'repo')
    },
    {
      id: 'supervisi',
      label: 'Supervisi',
      icon: ShieldAlert,
      action: () => handleNavigate('vip')
    }
  ];

  // Dynamic Sub Menu Items based on active context
  const getSubMenuItems = () => {
    if (activeTab === 'decision_engine' || activeTab === 'operations') {
      return {
        title: 'SUB MENU DECISION ENGINE',
        items: [
          {
            id: 'de_scoring',
            label: 'Scoring 0–1000 Matrix',
            icon: Sparkles,
            color: 'bg-purple-600',
            active: activeTab === 'decision_engine',
            action: () => handleNavigate('decision_engine')
          },
          {
            id: 'de_pic',
            label: 'Kanal Penanganan (PIC)',
            icon: PhoneCall,
            color: 'bg-indigo-600',
            active: activeTab === 'operations',
            action: () => handleNavigate('operations')
          }
        ]
      };
    }

    if (activeTab === 'vip' || activeModule === 'supervisory') {
      return {
        title: 'SUB MENU SUPERVISI & PORTOFOLIO',
        items: [
          {
            id: 'sub_vip',
            label: 'VIP Portfolio (AR Head)',
            icon: ShieldAlert,
            color: 'bg-purple-600',
            active: activeTab === 'vip',
            action: () => handleNavigate('vip')
          },
          {
            id: 'sub_supervisory',
            label: 'Supervisory & OOO',
            icon: UserCheck,
            color: 'bg-emerald-600',
            active: activeTab === 'dashboard' && activeModule === 'supervisory',
            action: () => handleNavigate('dashboard', 'supervisory')
          }
        ]
      };
    }

    if (['settlement', 'legal', 'repo'].includes(activeModule)) {
      return {
        title: 'SUB MENU RESTRUKTURISASI & REMEDIAL',
        items: [
          {
            id: 'sub_settle',
            label: 'Settlement & Diskon',
            icon: BadgePercent,
            color: 'bg-teal-600',
            active: activeModule === 'settlement',
            action: () => handleNavigate('dashboard', 'settlement')
          },
          {
            id: 'sub_legal',
            label: 'Alur Litigasi (Legal 6-Tahap)',
            icon: Scale,
            color: 'bg-indigo-600',
            active: activeModule === 'legal',
            action: () => handleNavigate('dashboard', 'legal')
          },
          {
            id: 'sub_repo',
            label: 'Eksekusi Agunan (Repo 8-Tahap)',
            icon: Warehouse,
            color: 'bg-emerald-600',
            active: activeModule === 'repo',
            action: () => handleNavigate('dashboard', 'repo')
          }
        ]
      };
    }

    // Default to Kolektor if in mcollect/geotracker or general collector view
    if (activeModule === 'mcollect' || activeModule === 'geotracker') {
      return {
        title: 'ALUR WORKFLOW UTAMA KOLEKTOR',
        items: [
          {
            id: 'sub_tasklist',
            label: 'Task List (65 Akun)',
            icon: CheckSquare,
            color: 'bg-emerald-600',
            active: activeModule === 'mcollect',
            action: () => handleNavigate('dashboard', 'mcollect')
          },
          {
            id: 'sub_todayplan',
            label: "Today's Plan (5 Rute)",
            icon: Calendar,
            color: 'bg-blue-600',
            active: activeModule === 'mcollect',
            action: () => handleNavigate('dashboard', 'mcollect')
          },
          {
            id: 'sub_reassign',
            label: 'Reassign Kolektor',
            icon: UserPlus,
            color: 'bg-amber-600',
            active: activeModule === 'mcollect',
            action: () => handleNavigate('dashboard', 'mcollect')
          },
          {
            id: 'sub_incentive',
            label: 'Insentif Flow Rate CMS',
            icon: TrendingUp,
            color: 'bg-purple-600',
            active: activeModule === 'mcollect',
            action: () => handleNavigate('dashboard', 'mcollect')
          },
          {
            id: 'sub_geotracker',
            label: 'GeoTracker GPS Live',
            icon: MapPin,
            color: 'bg-rose-600',
            active: activeModule === 'geotracker',
            action: () => handleNavigate('dashboard', 'geotracker')
          },
          {
            id: 'sub_pis',
            label: 'PIS Kuitansi Digital',
            icon: FileText,
            color: 'bg-teal-600',
            active: activeModule === 'mcollect',
            action: () => handleNavigate('dashboard', 'mcollect')
          }
        ]
      };
    }

    // Otherwise Default Dashboard Workflow
    return {
      title: 'ALUR WORKFLOW UTAMA CRMS',
      items: [
        {
          id: 'sub_matrix',
          label: 'Matriks Overdue DPD 1-150+',
          icon: Layers,
          color: 'bg-emerald-600',
          active: activeModule === 'reguler' || !activeModule,
          action: () => handleNavigate('dashboard', 'reguler')
        },
        {
          id: 'sub_pdm',
          label: 'Pre-Delinquency DPD 0 (PDM)',
          icon: Radio,
          color: 'bg-blue-600',
          active: activeModule === 'pdm',
          action: () => handleNavigate('dashboard', 'pdm')
        },
        {
          id: 'sub_cbs',
          label: 'Core Banking CBS EOD',
          icon: Database,
          color: 'bg-indigo-600',
          active: activeTab === 'confins',
          action: () => handleNavigate('confins')
        }
      ]
    };
  };

  const subMenuData = getSubMenuItems();

  return (
    <div className="space-y-4 mb-4">
      {/* 1. Floating User Welcome & Quick KPI Card (Matches LIMS Image 1) */}
      <div className="bg-white rounded-3xl p-4 shadow-xl border border-emerald-950/10">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-700 shadow-sm shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-500 block leading-tight">
                Selamat Datang,
              </span>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight truncate">
                {userName}
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-wider rounded-full uppercase shrink-0">
            {userRole}
          </span>
        </div>

        {/* 3 Metric Columns (Matches LIMS: Draft Pengajuan | Aktif Sedang Diuji | Antrean Tugas Saya) */}
        <div className="grid grid-cols-3 gap-2 pt-3 text-center">
          <div className="border-r border-slate-100 pr-1">
            <span className="block text-sm sm:text-base font-extrabold text-blue-600 leading-none">
              Rp 1.15 M
            </span>
            <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
              Overdue (Draft)
            </span>
          </div>

          <div className="border-r border-slate-100 px-1">
            <span className="block text-sm sm:text-base font-extrabold text-emerald-600 leading-none">
              65 Akun
            </span>
            <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
              Aktif Diuji
            </span>
          </div>

          <div className="pl-1">
            <span className="block text-sm sm:text-base font-extrabold text-amber-500 leading-none">
              5 Rute
            </span>
            <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
              Antrean Tugas
            </span>
          </div>
        </div>
      </div>

      {/* 2. MENU SHORTCUT Grid (Matches LIMS Image 1 4x2 Grid) */}
      <div className="px-1">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2.5">
          MENU SHORTCUT
        </h4>

        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            const active = isShortcutActive(item.id);

            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all cursor-pointer ${
                  active
                    ? 'border-2 border-emerald-500 bg-emerald-50/80 shadow-md scale-[1.02]'
                    : 'border border-slate-200/80 bg-white shadow-sm hover:border-emerald-300'
                }`}
              >
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    active 
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-800/30' 
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span 
                  className={`text-[10px] sm:text-[11px] mt-1.5 leading-tight truncate max-w-full font-bold ${
                    active ? 'text-emerald-800 font-extrabold' : 'text-slate-700'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ALUR WORKFLOW UTAMA / SUB MENU (Matches LIMS Image 1) */}
      <div className="px-1">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900">
            {subMenuData.title}
          </h4>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 custom-scrollbar">
          {subMenuData.items.map((sub) => {
            const SubIcon = sub.icon;
            const active = sub.active;

            return (
              <button
                key={sub.id}
                onClick={sub.action}
                className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/20'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center ${active ? 'bg-white/20 text-white' : sub.color + ' text-white'}`}>
                  <SubIcon className="w-3 h-3" />
                </div>
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
