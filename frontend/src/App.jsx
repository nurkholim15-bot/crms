import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import AboutModal from './components/AboutModal';
import Dashboard from './pages/Dashboard';
import DecisionEnginePage from './pages/DecisionEnginePage';
import OperationsWorkbench from './pages/OperationsWorkbench';
import VIPManagementPage from './pages/VIPManagementPage';
import ConfinsEODSimulator from './pages/ConfinsEODSimulator';
import LoginPage from './pages/LoginPage';
import { resetDemoData, getDashboardSummary, logoutUser } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeModule, setActiveModule] = useState('reguler');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [globalRefreshTrigger, setGlobalRefreshTrigger] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
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

  // Update Dynamic Document Title & Favicon Tab Browser
  useEffect(() => {
    const symbol = companyInfo.simbolPT || 'AAA';
    document.title = `${symbol} CRMS - Collection & Recovery Management System`;

    // Perbarui favicon secara dinamis ke logo rounded-square emerald dengan inisial perusahaan
    const link = document.getElementById('app-favicon');
    if (link) {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%23064E3B'/><text x='16' y='21' fill='white' font-family='system-ui, -apple-system, sans-serif' font-weight='900' font-size='13' text-anchor='middle'>${symbol.toLowerCase()}</text></svg>`;
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
    <div className="min-h-screen bg-[#064E3B] flex font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 antialiased overflow-x-hidden">
      {/* Sidebar Navigation (Collapsible desktop + sliding drawer mobile) */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        companyInfo={companyInfo}
        currentUser={currentUser}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        onOpenAbout={() => setIsAboutModalOpen(true)}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <TopHeader 
          currentUser={currentUser}
          companyInfo={companyInfo}
          isRefreshing={isRefreshing}
          onResetDemo={handleResetDemo}
          onLogout={handleLogout}
          onOpenAbout={() => setIsAboutModalOpen(true)}
          setMobileOpen={setMobileSidebarOpen}
          activeTab={activeTab}
          activeModule={activeModule}
        />

        {/* Content Card Area - LIMS styled rounded-3xl white card */}
        <main className="flex-1 px-3 sm:px-6 lg:px-8 pb-8 pt-1">
          <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-140px)] border border-emerald-950/10 transition-all">
            {activeTab === 'dashboard' && (
              <Dashboard 
                key={`${globalRefreshTrigger}-${activeModule}`} 
                companyInfo={companyInfo} 
                activeModule={activeModule}
                setActiveModule={setActiveModule}
              />
            )}
            {activeTab === 'decision_engine' && (
              <DecisionEnginePage 
                key={globalRefreshTrigger} 
                companyInfo={companyInfo} 
              />
            )}
            {activeTab === 'operations' && (
              <OperationsWorkbench 
                key={globalRefreshTrigger} 
                companyInfo={companyInfo} 
              />
            )}
            {activeTab === 'vip' && (
              <VIPManagementPage 
                key={globalRefreshTrigger} 
                companyInfo={companyInfo} 
              />
            )}
            {activeTab === 'confins' && (
              <ConfinsEODSimulator 
                key={globalRefreshTrigger} 
                onEODComplete={handleEODComplete} 
                companyInfo={companyInfo} 
              />
            )}
          </div>
        </main>
      </div>

      {/* About CRMS Modal */}
      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
        companyInfo={companyInfo} 
      />
    </div>
  );
}
