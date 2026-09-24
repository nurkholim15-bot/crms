import React from 'react';
import { 
  Menu, 
  RotateCw, 
  Bell, 
  User, 
  LogOut, 
  Search,
  QrCode
} from 'lucide-react';

export default function TopHeader({
  currentUser,
  companyInfo,
  isRefreshing,
  onResetDemo,
  onLogout,
  onOpenAbout,
  setMobileOpen,
  notificationCount = 45
}) {
  const userName = currentUser?.full_name || currentUser?.username || 'nur';
  const userRole = currentUser?.role || 'ADMIN';

  return (
    <div className="bg-[#064E3B] text-white px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 shrink-0 select-none shadow-sm">
      {/* Mobile Topmost Search Bar (Matches LIMS Mobile Image 1) */}
      <div className="w-full lg:hidden mb-2.5">
        <div className="bg-white rounded-2xl px-3 py-1.5 flex items-center shadow-md text-slate-800">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input 
            type="text"
            placeholder="Cari debitur, no kontrak, atau petugas..." 
            className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none font-medium"
          />
          <QrCode className="w-4 h-4 text-emerald-700 ml-2 shrink-0" />
        </div>
      </div>

      <div className="flex flex-row items-center justify-between gap-3">
        {/* Left Side: Mobile Menu Button + Main Title + Subtitle */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white border border-emerald-600/40 shadow cursor-pointer shrink-0"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-xl lg:text-2xl font-black tracking-tight text-white leading-tight truncate drop-shadow-sm">
              Collection & Recovery Management System
            </h1>
            <p className="text-emerald-200/90 text-[10px] sm:text-xs font-medium mt-0.5 truncate">
              Welcome back, <span className="text-white font-semibold">{userName}</span>.
            </p>
          </div>
        </div>

        {/* Right Side Controls: Status Badge, Reset Demo, Notification Bell, User Capsule Pill, Logout */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
          {/* CBS Live Status Indicator */}
          <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-[11px] font-semibold text-emerald-100 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>CBS Core: <strong className="text-white">Online</strong></span>
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetDemo}
            disabled={isRefreshing}
            title="Reset ulang database CRMS ke sample awal"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white border border-emerald-600/50 text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Memuat...' : 'Reset Demo'}</span>
          </button>

          {/* Notification Bell Badge Button (matches LIMS bell badge '45') */}
          <button
            onClick={onOpenAbout}
            title={`${notificationCount} Agenda & Notifikasi Kepatuhan`}
            className="relative p-1.5 sm:p-2 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white border border-emerald-600/40 shadow-sm transition cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="absolute -top-1 -right-1 px-1 sm:px-1.5 py-0.2 text-[8px] sm:text-[9px] font-black bg-emerald-500 text-emerald-950 rounded-full border border-emerald-300/40 shadow-sm">
              {notificationCount}
            </span>
          </button>

          {/* User Oval White Capsule Pill (matching LIMS Admin Pill) */}
          <div className="flex items-center bg-white text-slate-800 pl-1 sm:pl-1.5 pr-2.5 sm:pr-3.5 py-1 rounded-full shadow-md border border-emerald-100/30">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-[10px] sm:text-xs mr-1 sm:mr-2 shadow-inner">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase text-slate-800">
              {userRole}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Keluar dari sesi CRMS"
            className="p-1.5 sm:p-2 rounded-full bg-emerald-800/80 hover:bg-red-700 text-emerald-200 hover:text-white border border-emerald-600/40 hover:border-red-500 shadow-sm transition cursor-pointer"
            aria-label="Logout"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
