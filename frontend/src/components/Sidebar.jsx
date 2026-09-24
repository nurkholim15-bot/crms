import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  PhoneCall, 
  ShieldAlert, 
  RefreshCw, 
  Scale, 
  Warehouse, 
  BadgePercent, 
  Radio, 
  Smartphone, 
  UserCheck, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  X, 
  Layers, 
  Database,
  MapPin,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  activeModule,
  setActiveModule,
  companyInfo,
  currentUser,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  onOpenAbout
}) {
  // State accordion untuk grup menu
  const [openGroups, setOpenGroups] = useState({
    kolektor: true,
    de: true,
    remedial: false,
    supervisi: false,
  });

  const toggleGroup = (groupKey) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenGroups(prev => ({ ...prev, [groupKey]: true }));
      return;
    }
    setOpenGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const handleNavigate = (tab, module = null) => {
    setActiveTab(tab);
    if (module && setActiveModule) {
      setActiveModule(module);
    }
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const isItemActive = (tab, module = null) => {
    if (module) {
      return activeTab === tab && activeModule === module;
    }
    return activeTab === tab;
  };

  const isGroupActive = (items) => {
    return items.some(item => isItemActive(item.tab, item.module));
  };

  const kolektorItems = [
    {
      id: 'mcollect',
      label: 'Collector Workbench',
      shortLabel: 'Workbench',
      tab: 'dashboard',
      module: 'mcollect',
      icon: Smartphone,
      badge: 'Task & Plan'
    },
    {
      id: 'geotracker',
      label: 'GeoTracker GPS',
      shortLabel: 'GeoTracker',
      tab: 'dashboard',
      module: 'geotracker',
      icon: MapPin,
      badge: 'Live'
    },
  ];

  const deItems = [
    {
      id: 'scoring',
      label: 'Scoring & Grade Matrix',
      shortLabel: 'Scoring Matrix',
      tab: 'decision_engine',
      module: null,
      icon: Sparkles,
      badge: '0-1000'
    },
    {
      id: 'operations',
      label: 'Kanal Penanganan (PIC)',
      shortLabel: 'Kanal PIC',
      tab: 'operations',
      module: null,
      icon: PhoneCall,
      badge: 'Desk/Field'
    },
  ];

  const remedialItems = [
    {
      id: 'settlement',
      label: 'Settlement & Diskon',
      shortLabel: 'Settlement',
      tab: 'dashboard',
      module: 'settlement',
      icon: BadgePercent,
      badge: '6-Stage'
    },
    {
      id: 'legal',
      label: 'Alur Litigasi (Legal)',
      shortLabel: 'Legal',
      tab: 'dashboard',
      module: 'legal',
      icon: Scale,
      badge: '6-Tahap'
    },
    {
      id: 'repo',
      label: 'Eksekusi Agunan (Repo)',
      shortLabel: 'Repo & Lelang',
      tab: 'dashboard',
      module: 'repo',
      icon: Warehouse,
      badge: '8-Tahap'
    },
  ];

  const supervisiItems = [
    {
      id: 'vip',
      label: 'VIP Portfolio (AR Head)',
      shortLabel: 'VIP Portfolio',
      tab: 'vip',
      module: null,
      icon: ShieldAlert,
      badge: 'VIP'
    },
    {
      id: 'supervisory',
      label: 'Supervisory & OOO',
      shortLabel: 'Supervisory',
      tab: 'dashboard',
      module: 'supervisory',
      icon: UserCheck,
      badge: 'Delegasi'
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#064E3B] text-slate-100 flex flex-col transition-all duration-300 ease-in-out border-r border-emerald-800/40 shadow-2xl lg:static lg:h-screen lg:z-auto ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-[260px]'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-emerald-800/50 bg-[#054333]/60 relative shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            {/* Bank Emblem Circular Logo */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center text-white font-extrabold text-sm shadow-md ring-2 ring-emerald-300/40 shrink-0 tracking-tight lowercase">
              {companyInfo?.simbolPT ? companyInfo.simbolPT.slice(0, 3).toLowerCase() : 'crm'}
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white leading-tight truncate">
                    CRM System
                  </span>
                  <span className="px-1.5 py-0.2 text-[9px] font-black bg-emerald-500/30 text-emerald-300 rounded border border-emerald-400/40">
                    BANK
                  </span>
                </div>
                <span className="text-[11px] text-emerald-200/70 truncate">
                  {companyInfo?.simbolPT || 'CRMS'} Retail Banking
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-6 h-6 rounded-full bg-emerald-700/80 hover:bg-emerald-600 text-white items-center justify-center border border-emerald-500/40 shadow cursor-pointer transition"
            title={isCollapsed ? "Buka Sidebar" : "Ciutkan Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Menu List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
          {/* Menu 1: Dashboard & Matriks Overdue */}
          {(() => {
            const active = isItemActive('dashboard', 'reguler');
            return (
              <button
                onClick={() => handleNavigate('dashboard', 'reguler')}
                title="Dashboard & Matriks Overdue"
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/30 font-bold'
                    : 'text-emerald-100/80 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <LayoutDashboard className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-emerald-300'}`} />
                  {!isCollapsed && <span className="truncate">Dashboard & Analitik</span>}
                </div>
              </button>
            );
          })()}

          {/* Menu 2: Pre-Delinquency (PDM Early Warning) */}
          {(() => {
            const active = isItemActive('dashboard', 'pdm');
            return (
              <button
                onClick={() => handleNavigate('dashboard', 'pdm')}
                title="Pre-Delinquency Monitoring (DPD 0 Early Warning)"
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/30 font-bold'
                    : 'text-emerald-100/80 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Radio className={`w-4 h-4 shrink-0 animate-pulse ${active ? 'text-white' : 'text-emerald-300'}`} />
                  {!isCollapsed && <span className="truncate">Pre-Delinquency (PDM)</span>}
                </div>
                {!isCollapsed && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${active ? 'bg-white/20 text-white' : 'bg-emerald-800/70 text-emerald-300'}`}>
                    DPD 0
                  </span>
                )}
              </button>
            );
          })()}

          {/* Group 1: Kolektor & Lapangan (Accordion) */}
          <div>
            {(() => {
              const groupActive = isGroupActive(kolektorItems);
              const isOpen = openGroups.kolektor;
              return (
                <div>
                  <button
                    onClick={() => toggleGroup('kolektor')}
                    title="Kolektor & Lapangan"
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      groupActive && !isOpen
                        ? 'bg-emerald-700/50 text-white font-bold'
                        : 'text-emerald-100/80 hover:text-white hover:bg-emerald-800/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Smartphone className={`w-4 h-4 shrink-0 ${groupActive ? 'text-emerald-300' : 'text-emerald-400/80'}`} />
                      {!isCollapsed && <span className="truncate">Kolektor & Lapangan</span>}
                    </div>
                    {!isCollapsed && (
                      <div className="flex items-center space-x-1.5">
                        <ChevronDown className={`w-3.5 h-3.5 text-emerald-300/80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    )}
                  </button>

                  {/* Submenu Accordion Items */}
                  {(!isCollapsed && isOpen) && (
                    <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-emerald-700/50 ml-5 mt-1">
                      {kolektorItems.map((sub) => {
                        const active = isItemActive(sub.tab, sub.module);
                        const SubIcon = sub.icon;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleNavigate(sub.tab, sub.module)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                              active
                                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/20'
                                : 'text-emerald-100/70 hover:text-white hover:bg-emerald-800/40 font-medium'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <SubIcon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-emerald-300'}`} />
                              <span className="truncate">{sub.label}</span>
                            </div>
                            {sub.badge && (
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${active ? 'bg-white/25 text-white' : 'bg-emerald-800/60 text-emerald-300'}`}>
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Group 2: Decision Engine (DE) (Accordion) */}
          <div>
            {(() => {
              const groupActive = isGroupActive(deItems);
              const isOpen = openGroups.de;
              return (
                <div>
                  <button
                    onClick={() => toggleGroup('de')}
                    title="Decision Engine (DE)"
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      groupActive && !isOpen
                        ? 'bg-emerald-700/50 text-white font-bold'
                        : 'text-emerald-100/80 hover:text-white hover:bg-emerald-800/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Cpu className={`w-4 h-4 shrink-0 ${groupActive ? 'text-emerald-300' : 'text-emerald-400/80'}`} />
                      {!isCollapsed && <span className="truncate">Decision Engine (DE)</span>}
                    </div>
                    {!isCollapsed && (
                      <div className="flex items-center space-x-1.5">
                        <ChevronDown className={`w-3.5 h-3.5 text-emerald-300/80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    )}
                  </button>

                  {(!isCollapsed && isOpen) && (
                    <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-emerald-700/50 ml-5 mt-1">
                      {deItems.map((sub) => {
                        const active = isItemActive(sub.tab, sub.module);
                        const SubIcon = sub.icon;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleNavigate(sub.tab, sub.module)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                              active
                                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/20'
                                : 'text-emerald-100/70 hover:text-white hover:bg-emerald-800/40 font-medium'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <SubIcon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-emerald-300'}`} />
                              <span className="truncate">{sub.label}</span>
                            </div>
                            {sub.badge && (
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${active ? 'bg-white/25 text-white' : 'bg-emerald-800/60 text-emerald-300'}`}>
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Group 3: Restrukturisasi & Remedial (Accordion) */}
          <div>
            {(() => {
              const groupActive = isGroupActive(remedialItems);
              const isOpen = openGroups.remedial;
              return (
                <div>
                  <button
                    onClick={() => toggleGroup('remedial')}
                    title="Restrukturisasi & Remedial"
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      groupActive && !isOpen
                        ? 'bg-emerald-700/50 text-white font-bold'
                        : 'text-emerald-100/80 hover:text-white hover:bg-emerald-800/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Scale className={`w-4 h-4 shrink-0 ${groupActive ? 'text-emerald-300' : 'text-emerald-400/80'}`} />
                      {!isCollapsed && <span className="truncate">Restrukturisasi & Remedial</span>}
                    </div>
                    {!isCollapsed && (
                      <div className="flex items-center space-x-1.5">
                        <ChevronDown className={`w-3.5 h-3.5 text-emerald-300/80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    )}
                  </button>

                  {(!isCollapsed && isOpen) && (
                    <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-emerald-700/50 ml-5 mt-1">
                      {remedialItems.map((sub) => {
                        const active = isItemActive(sub.tab, sub.module);
                        const SubIcon = sub.icon;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleNavigate(sub.tab, sub.module)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                              active
                                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/20'
                                : 'text-emerald-100/70 hover:text-white hover:bg-emerald-800/40 font-medium'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <SubIcon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-emerald-300'}`} />
                              <span className="truncate">{sub.label}</span>
                            </div>
                            {sub.badge && (
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${active ? 'bg-white/25 text-white' : 'bg-emerald-800/60 text-emerald-300'}`}>
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Group 4: Supervisi & Portofolio (Accordion) */}
          <div>
            {(() => {
              const groupActive = isGroupActive(supervisiItems);
              const isOpen = openGroups.supervisi;
              return (
                <div>
                  <button
                    onClick={() => toggleGroup('supervisi')}
                    title="Supervisi & Portofolio"
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      groupActive && !isOpen
                        ? 'bg-emerald-700/50 text-white font-bold'
                        : 'text-emerald-100/80 hover:text-white hover:bg-emerald-800/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <ShieldAlert className={`w-4 h-4 shrink-0 ${groupActive ? 'text-emerald-300' : 'text-emerald-400/80'}`} />
                      {!isCollapsed && <span className="truncate">Supervisi & Portofolio</span>}
                    </div>
                    {!isCollapsed && (
                      <div className="flex items-center space-x-1.5">
                        <ChevronDown className={`w-3.5 h-3.5 text-emerald-300/80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    )}
                  </button>

                  {(!isCollapsed && isOpen) && (
                    <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-emerald-700/50 ml-5 mt-1">
                      {supervisiItems.map((sub) => {
                        const active = isItemActive(sub.tab, sub.module);
                        const SubIcon = sub.icon;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleNavigate(sub.tab, sub.module)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                              active
                                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/20'
                                : 'text-emerald-100/70 hover:text-white hover:bg-emerald-800/40 font-medium'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <SubIcon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-emerald-300'}`} />
                              <span className="truncate">{sub.label}</span>
                            </div>
                            {sub.badge && (
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${active ? 'bg-white/25 text-white' : 'bg-emerald-800/60 text-emerald-300'}`}>
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Menu 3: Core Banking EOD Batch */}
          {(() => {
            const active = isItemActive('confins');
            return (
              <button
                onClick={() => handleNavigate('confins')}
                title="Core Banking System (CBS) EOD Simulator"
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/30 font-bold'
                    : 'text-emerald-100/80 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Database className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-emerald-300'}`} />
                  {!isCollapsed && <span className="truncate">Core Banking (CBS) EOD</span>}
                </div>
                {!isCollapsed && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${active ? 'bg-white/20 text-white' : 'bg-emerald-800/70 text-emerald-300'}`}>
                    EOD Batch
                  </span>
                )}
              </button>
            );
          })()}
        </div>

        {/* Bottom Section: About CRMS */}
        <div className="p-3 border-t border-emerald-800/50 bg-[#054333]/40 shrink-0">
          <button
            onClick={onOpenAbout}
            title="About CRMS"
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-start space-x-3 px-3.5'} py-2.5 rounded-2xl text-xs font-medium text-emerald-200/80 hover:text-white hover:bg-emerald-800/50 transition cursor-pointer`}
          >
            <Info className="w-4 h-4 shrink-0 text-emerald-300" />
            {!isCollapsed && <span>About CRMS</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
