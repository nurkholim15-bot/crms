import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  Layers, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  KeyRound,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { loginUser } from '../services/api';

export default function LoginPage({ onLoginSuccess, companyInfo }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Username dan password harus diisi');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const res = await loginUser({ username, password });
      if (res.data?.status === 'success') {
        const { token, user } = res.data.data;
        localStorage.setItem('crms_token', token);
        localStorage.setItem('crms_user', JSON.stringify(user));
        onLoginSuccess(user, token);
      } else {
        setErrorMessage(res.data?.message || 'Login gagal');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Gagal terhubung ke server backend'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setErrorMessage('');
  };

  const ptSymbol = companyInfo?.simbolPT || 'AAA';
  const ptName = companyInfo?.namaPT || 'PT AAA';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center">
            {/* Dynamic Emblem matching Image 3 */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-red-900/30 tracking-tight lowercase">
              {ptSymbol.toLowerCase()}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-2">
              <h1 className="text-2xl font-black text-white tracking-tight">CRMS</h1>
              <span className="px-2 py-0.5 text-xs font-black bg-red-500/20 text-red-400 border border-red-500/30 rounded-full">
                RETAIL
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Collection & Recovery Management System
            </p>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
              {ptName}
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-700/60 pb-3 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-200 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-400" />
              Autentikasi Pengguna
            </h2>
            <span className="text-[10px] text-slate-400 bg-slate-700/60 px-2 py-0.5 rounded font-mono">
              Port 8030 Secure
            </span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Username Input */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username Anda..."
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda..."
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-700/30 flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <span>Masuk ke Sistem CRMS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Picker */}
          <div className="pt-4 border-t border-slate-700/60">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-400 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
                Akses Cepat Pengujian (Quick Login Demo):
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                className={`p-2 rounded-lg border text-left transition ${
                  username === 'admin' 
                    ? 'bg-red-500/20 border-red-500 text-red-300' 
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="block font-black text-[11px] text-white">Admin</span>
                <span className="block text-[9px] text-slate-400 font-mono">admin123</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ar_head', 'arhead123')}
                className={`p-2 rounded-lg border text-left transition ${
                  username === 'ar_head' 
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300' 
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="block font-black text-[11px] text-white">AR Head</span>
                <span className="block text-[9px] text-slate-400 font-mono">arhead123</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('collector', 'collector123')}
                className={`p-2 rounded-lg border text-left transition ${
                  username === 'collector' 
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="block font-black text-[11px] text-white">Collector</span>
                <span className="block text-[9px] text-slate-400 font-mono">collector123</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 {ptName} ({ptSymbol}) • CRMS v2.1 VPS Production
        </p>
      </div>
    </div>
  );
}
