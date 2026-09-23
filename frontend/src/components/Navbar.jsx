import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  PhoneCall, 
  ShieldAlert, 
  RefreshCw,
  Landmark,
  Layers,
  LogOut,
  UserCheck
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onResetDemo, isRefreshing, companyInfo, currentUser, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Matriks', icon: LayoutDashboard },
    { id: 'decision_engine', label: 'Decision Engine (DE)', icon: Cpu },
    { id: 'operations', label: 'Kanal Penanganan (PIC)', icon: PhoneCall },
    { id: 'vip', label: 'VIP Bucket (AR Head)', icon: ShieldAlert, badge: 'VIP' },
    { id: 'confins', label: 'Core Banking EOD', icon: RefreshCw },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-red-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse"></span>
            CRMS Live Environment
          </span>
          <span className="text-slate-600">|</span>
          <span>Core System: <strong className="text-white">Core Banking System (CBS)</strong></span>
          <span className="text-slate-600">|</span>
          <span>Engine: <strong className="text-emerald-400">DE ML-Rule v2.1</strong></span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onResetDemo}
            disabled={isRefreshing}
            className="hover:text-white text-slate-400 text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition"
            title="Reset ulang sample data perbankan"
          >
            {isRefreshing ? 'Memuat...' : '↻ Reset Demo Data'}
          </button>
          <span className="text-slate-400 font-semibold">{companyInfo?.simbolPT || 'CRMS'} Retail Banking</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              {/* Stylized Red/Dark Red emblem matching Image 3 */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md tracking-tight lowercase">
                {companyInfo?.simbolPT ? companyInfo.simbolPT.toLowerCase() : 'crms'}
              </div>
              <div className="ml-3">
                <div className="flex items-center space-x-2">
                  <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                    CRMS
                  </h1>
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-red-100 text-red-700 rounded-full">
                    BANKING
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {companyInfo?.namaPT || 'Collection & Recovery Management System'}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center ml-4 pl-4 border-l border-slate-200">
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Portofolio Kredit Konsumer & Komersial
              </span>
            </div>
          </div>

          {/* Navigation Links & User Profile */}
          <div className="flex items-center space-x-3">
            <nav className="flex space-x-1 sm:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-red-50 text-red-600 shadow-sm border border-red-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-purple-600 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* User Profile & Logout */}
            <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-200">
              <div className="hidden xl:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser?.full_name || currentUser?.username || 'Admin'}
                </span>
                <span className="text-[10px] font-black text-red-700 bg-red-50 border border-red-200/60 px-1.5 py-0.2 rounded mt-0.5 inline-block self-end">
                  {currentUser?.role || 'ADMIN'}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition cursor-pointer"
                title="Keluar dari sesi CRMS"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
