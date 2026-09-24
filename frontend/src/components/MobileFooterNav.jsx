import React from 'react';
import { 
  Home, 
  Smartphone, 
  Cpu, 
  Info, 
  LogOut 
} from 'lucide-react';

export default function MobileFooterNav({
  activeTab,
  setActiveTab,
  activeModule,
  setActiveModule,
  onOpenAbout,
  onLogout
}) {
  const handleNavigate = (tab, module = null) => {
    setActiveTab(tab);
    if (module && setActiveModule) {
      setActiveModule(module);
    }
  };

  const isBerandaActive = activeTab === 'dashboard' && (activeModule === 'reguler' || !activeModule);
  const isKolektorActive = activeTab === 'dashboard' && (activeModule === 'mcollect' || activeModule === 'geotracker');
  const isDEActive = activeTab === 'decision_engine' || activeTab === 'operations';

  const footerItems = [
    {
      id: 'beranda',
      label: 'Dashboard',
      icon: Home,
      isActive: isBerandaActive,
      action: () => handleNavigate('dashboard', 'reguler')
    },
    {
      id: 'kolektor',
      label: 'Collector',
      icon: Smartphone,
      isActive: isKolektorActive,
      action: () => handleNavigate('dashboard', 'mcollect')
    },
    {
      id: 'de',
      label: 'Engine DE',
      icon: Cpu,
      isActive: isDEActive,
      action: () => handleNavigate('decision_engine')
    },
    {
      id: 'about',
      label: 'About',
      icon: Info,
      isActive: false,
      action: onOpenAbout
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      isActive: false,
      action: onLogout
    }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 px-2 flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      {footerItems.map((item) => {
        const Icon = item.icon;
        const active = item.isActive;

        return (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
              active 
                ? 'text-emerald-700 font-extrabold scale-105' 
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div className="relative">
              <Icon 
                className={`w-5 h-5 transition-transform ${
                  active ? 'text-emerald-600 stroke-[2.5]' : 'text-slate-500 stroke-[1.8]'
                }`} 
              />
            </div>
            <span className="text-[10px] mt-0.5 leading-none tracking-tight">
              {item.label}
            </span>
            {active && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
