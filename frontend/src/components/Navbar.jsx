import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  PhoneCall, 
  ShieldAlert, 
  RefreshCw,
  Landmark,
  Layers,
  LogOut,
  UserCheck,
  Menu,
  X,
  Sparkles,
  User
} from 'lucide-react';

export const navItems = [
  { id: 'dashboard', label: 'Dashboard & Matriks', shortLabel: 'Dashboard', icon: LayoutDashboard },
  { id: 'decision_engine', label: 'Decision Engine (DE)', shortLabel: 'DE Engine', icon: Cpu },
  { id: 'operations', label: 'Kanal Penanganan (PIC)', shortLabel: 'Kanal PIC', icon: PhoneCall },
  { id: 'vip', label: 'VIP Bucket (AR Head)', shortLabel: 'VIP Bucket', icon: ShieldAlert, badge: 'VIP' },
  { id: 'confins', label: 'Core Banking EOD', shortLabel: 'Core EOD', icon: RefreshCw },
];

export default function Navbar({ activeTab, setActiveTab, onResetDemo, isRefreshing, companyInfo, currentUser, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Top Banner Desktop */}
      <div className="hidden md:flex bg-slate-900 text-slate-300 text-xs py-1 px-4 justify-between items-center">
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
            className="hover:text-white text-slate-400 text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
            title="Reset ulang sample data perbankan"
          >
            {isRefreshing ? 'Memuat...' : '↻ Reset Demo Data'}
          </button>
          <span className="text-slate-400 font-semibold">{companyInfo?.simbolPT || 'CRMS'} Retail Banking</span>
        </div>
      </div>

      {/* Top Banner Mobile (Single Row Compact) */}
      <div className="flex md:hidden bg-slate-900 text-slate-300 text-[10px] py-1 px-3 justify-between items-center">
        <span className="flex items-center text-emerald-400 font-semibold truncate mr-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1 animate-pulse"></span>
          CRMS Live • CBS Core
        </span>
        <div className="flex items-center space-x-1.5 shrink-0">
          <button 
            onClick={onResetDemo}
            disabled={isRefreshing}
            className="text-slate-300 hover:text-white text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-medium"
          >
            {isRefreshing ? '...' : '↻ Reset Data'}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center">
              {/* Emblem */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center text-white font-extrabold text-base sm:text-xl shadow-md tracking-tight lowercase">
                {companyInfo?.simbolPT ? companyInfo.simbolPT.toLowerCase() : 'crms'}
              </div>
              <div className="ml-2 sm:ml-3">
                <div className="flex items-center space-x-1.5">
                  <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
                    CRMS
                  </h1>
                  <span className="px-1.5 sm:px-2 py-0.2 text-[9px] sm:text-[11px] font-semibold bg-red-100 text-red-700 rounded-full">
                    BANKING
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 truncate max-w-[140px] sm:max-w-none">
                  {companyInfo?.namaPT || 'PT AAA'}
                </p>
              </div>
            </div>
            <div className="hidden xl:flex items-center ml-4 pl-4 border-l border-slate-200">
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Portofolio Kredit Konsumer & Komersial
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-3">
            <nav className="flex space-x-1 sm:space-x-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
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

            {/* Desktop User Profile & Logout */}
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

          {/* Mobile Right Controls: User Badge, Logout & Hamburger Menu Toggle */}
          <div className="flex lg:hidden items-center space-x-1.5">
            <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
              {currentUser?.role || 'ADMIN'}
            </span>
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-xl space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                {(currentUser?.username || 'A')[0].toUpperCase()}
              </div>
              <div>
                <span className="font-bold text-slate-800 block leading-tight">
                  {currentUser?.full_name || currentUser?.username || 'Admin'}
                </span>
                <span className="text-[10px] text-slate-400">Pengguna CRMS Aktif</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-50 text-red-700 border border-red-200">
              {currentUser?.role || 'ADMIN'}
            </span>
          </div>

          <div className="space-y-1 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                    isActive
                      ? 'bg-red-50 text-red-600 border border-red-200 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold bg-purple-600 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                onResetDemo();
                setMobileMenuOpen(false);
              }}
              disabled={isRefreshing}
              className="text-[11px] text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
            <button
              onClick={onLogout}
              className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
