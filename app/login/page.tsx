"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, User, Lock, EyeOff, Eye, ShieldCheck, Zap } from "lucide-react";
import { login } from "../actions/authActions";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    // fixed inset-0 z-[100] digunakan untuk MENUTUPI sidebar dan header dari layout utama
    <div className="fixed inset-0 z-100 flex min-h-screen bg-white dark:bg-[#020817] font-sans">
      
      {/* SISI KIRI: Branding & Visual (Hanya tampil di layar besar) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        {/* Latar Belakang Abstrak Energi/Korporat */}
        <div className="absolute inset-0 bg-linear-to-br from-teal-900 via-slate-900 to-indigo-950 opacity-90 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-0"></div>
        
        {/* Dekorasi Cahaya (Glow) */}
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-teal-500/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col justify-between p-16 h-full w-full">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-teal-300 text-sm font-semibold tracking-wider uppercase mb-8">
              <Zap size={16} className="text-amber-400" /> Internal System
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Portal Sistem <br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-emerald-300">
                Informasi Terpadu
              </span>
            </h1>
            <p className="text-slate-300 text-lg max-w-md leading-relaxed">
              Pusat kendali direktori web, manajemen akses, dan ekosistem aplikasi internal PT PLN Indonesia Power - UBP Suralaya.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
               <Image src="/logopln.jpg" alt="Logo PLN" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <p className="text-white font-bold tracking-wide">PLN Indonesia Power</p>
              <p className="text-teal-400 text-sm font-medium">UBP Suralaya</p>
            </div>
          </div>
        </div>
      </div>

      {/* SISI KANAN: Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Header Form */}
          <div className="mb-10 lg:mb-12 text-center lg:text-left">
            <div className="lg:hidden inline-flex items-center justify-center h-16 w-16 bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6 p-2">
              <Image src="/logo-plnip.png" alt="Logo PLN" width={48} height={48} className="object-contain" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Selamat Datang</h2>
            <p className="text-slate-500 dark:text-slate-400">Silakan masuk menggunakan kredensial Administrator Anda.</p>
          </div>

          {/* Form Utama */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input 
                  name="username" 
                  type="text" 
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-300"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-300"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl animate-in shake duration-300">
                <ShieldCheck size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="relative w-full overflow-hidden bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" /> 
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <div className="absolute right-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    →
                  </div>
                </>
              )}
            </button>
          </form>

          {/* Footer Form */}
          <div className="mt-12 text-center lg:text-left">
            <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
              Made by Wahyu Rizki
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}