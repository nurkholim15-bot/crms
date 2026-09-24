import React, { useState, useEffect } from 'react';
import Navbar, { navItems } from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DecisionEnginePage from './pages/DecisionEnginePage';
import OperationsWorkbench from './pages/OperationsWorkbench';
import VIPManagementPage from './pages/VIPManagementPage';
import ConfinsEODSimulator from './pages/ConfinsEODSimulator';
import LoginPage from './pages/LoginPage';
import { resetDemoData, getDashboardSummary, logoutUser } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [globalRefreshTrigger, setGlobalRefreshTrigger] = useState(0);
  const [companyInfo, setCompanyInfo] = useState({
    namaPT: 'PT AAA',
    simbolPT: 'AAA'
  });

  // State Otentikasi Pengguna
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('crms_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await getDashboardSummary();
        if (res.data?.data) {
          setCompanyInfo({
            namaPT: res.data.data.general_nama_pt || 'PT AAA',
            simbolPT: res.data.data.general_simbol_pt || 'AAA'
          });
        }
      } catch (e) {
        console.error('Failed to fetch company meta:', e);
      }
    };
    fetchMeta();
  }, [globalRefreshTrigger]);

  // Update Dynamic Document Title & Favicon Tab Browser (Sesuai Permintaan #1 & Gambar 3)
  useEffect(() => {
    const symbol = companyInfo.simbolPT || 'AAA';
    document.title = `${symbol} CRMS - Collection & Recovery Management System`;

    // Perbarui favicon secara dinamis ke logo rounded-square merah dengan inisial perusahaan
    const link = document.getElementById('app-favicon');
    if (link) {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%23D91A2A'/><text x='16' y='21' fill='white' font-family='system-ui, -apple-system, sans-serif' font-weight='900' font-size='13' text-anchor='middle'>${symbol.toLowerCase()}</text></svg>`;
      link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }
  }, [companyInfo]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari sistem CRMS?')) {
      try {
        await logoutUser();
      } catch (e) {
        // Abaikan error jaringan saat logout
      }
      localStorage.removeItem('crms_token');
      localStorage.removeItem('crms_user');
      setCurrentUser(null);
    }
  };

  const handleResetDemo = async () => {
    if (window.confirm(`Reset database CRMS ke sample awal 55 akun Retail ${companyInfo.simbolPT}?`)) {
      setIsRefreshing(true);
      try {
        await resetDemoData();
        setGlobalRefreshTrigger(prev => prev + 1);
        alert('Data berhasil di-reset!');
      } catch (err) {
        alert('Gagal reset: ' + err.message);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleEODComplete = () => {
    setGlobalRefreshTrigger(prev => prev + 1);
  };

  // Jika belum login, tampilkan halaman Login
  if (!currentUser) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        companyInfo={companyInfo}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-900">
      {/* Navbar Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onResetDemo={handleResetDemo}
        isRefreshing={isRefreshing}
        companyInfo={companyInfo}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-24 lg:pb-12">
        {activeTab === 'dashboard' && <Dashboard key={globalRefreshTrigger} companyInfo={companyInfo} />}
        {activeTab === 'decision_engine' && <DecisionEnginePage key={globalRefreshTrigger} companyInfo={companyInfo} />}
        {activeTab === 'operations' && <OperationsWorkbench key={globalRefreshTrigger} companyInfo={companyInfo} />}
        {activeTab === 'vip' && <VIPManagementPage key={globalRefreshTrigger} companyInfo={companyInfo} />}
        {activeTab === 'confins' && <ConfinsEODSimulator key={globalRefreshTrigger} onEODComplete={handleEODComplete} companyInfo={companyInfo} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 mb-14 lg:mb-0">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <p>© 2026 {companyInfo.namaPT} ({companyInfo.simbolPT}) – Collection & Recovery Management System (CRMS)</p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex justify-around items-center shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition cursor-pointer relative ${
                isActive ? 'text-red-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-600 scale-110' : 'text-slate-500'} transition-transform`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 text-[8px] font-black bg-purple-600 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 leading-none tracking-tight">
                {item.shortLabel || item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-red-600 mt-0.5"></span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
