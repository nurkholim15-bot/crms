import React from 'react';
import { 
  Menu, 
  RotateCw, 
  Bell, 
  User, 
  LogOut, 
  Shield, 
  Activity,
  CheckCircle2,
  Info
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
    <header className="bg-[#064E3B] text-white px-4 sm:px-6 lg:px-8 py-4 shrink-0 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button + Main Title + Subtitle */}
        <div className="flex items-center space-x-3.5 min-w-0">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white border border-emerald-600/40 shadow cursor-pointer shrink-0"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-2xl font-black tracking-tight text-white leading-tight truncate drop-shadow-sm">
              Collection & Recovery Management System
            </h1>
            <p className="text-emerald-200/90 text-xs sm:text-sm font-medium mt-0.5 truncate">
              Welcome back, <span className="text-white font-semibold">{userName}</span>.
            </p>
          </div>
        </div>

        {/* Right Side Controls: Status Badge, Reset Demo, Notification Bell, User Capsule Pill, Logout */}
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 sm:gap-3 self-end md:self-center shrink-0">
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
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white border border-emerald-600/50 text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Memuat...' : 'Reset Demo'}</span>
          </button>

          {/* Notification Bell Badge Button (matches LIMS bell badge '45') */}
          <button
            onClick={onOpenAbout}
            title={`${notificationCount} Agenda & Notifikasi Kepatuhan`}
            className="relative p-2 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white border border-emerald-600/40 shadow-sm transition cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-black bg-emerald-500 text-emerald-950 rounded-full border border-emerald-300/40 shadow-sm">
              {notificationCount}
            </span>
          </button>

          {/* User Oval White Capsule Pill (matching LIMS Admin Pill) */}
          <div className="flex items-center bg-white text-slate-800 pl-1.5 pr-3.5 py-1 rounded-full shadow-md border border-emerald-100/30">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs mr-2 shadow-inner">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-black tracking-wider uppercase text-slate-800">
              {userRole}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Keluar dari sesi CRMS"
            className="p-2 rounded-full bg-emerald-800/80 hover:bg-red-700 text-emerald-200 hover:text-white border border-emerald-600/40 hover:border-red-500 shadow-sm transition cursor-pointer"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
