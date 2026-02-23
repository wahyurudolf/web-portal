"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  LayoutDashboard, 
  Network, 
  Files, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun
} from "lucide-react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Menghindari hydration mismatch pada Next.js untuk Dark Mode
  useEffect(() => setMounted(true), []);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Direktori Web", icon: Network, path: "/directory" },
    { name: "Dokumen", icon: Files, path: "/docs" },
    { name: "Pengaturan", icon: Settings, path: "/settings" },
  ];

  return (
    <aside 
      className={`relative flex flex-col h-screen transition-all duration-300 ease-in-out border-r z-50
        ${isCollapsed ? "w-20" : "w-64"} 
        bg-slate-50 border-slate-200 
        dark:bg-[#0f172a] dark:border-slate-800
      `}
    >
      {/* Tombol Toggle Buka/Tutup (Posisi Memotong Border) */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-9 flex h-7 w-7 items-center justify-center rounded-full border shadow-sm transition-all hover:scale-110 
          bg-white border-slate-200 text-slate-600 hover:text-teal-600
          dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:text-teal-400"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Area Logo (Mendukung Gambar 1:1) */}
      <div className="h-24 flex items-center justify-center border-b border-slate-200 dark:border-slate-800 px-4">
        <div className={`flex items-center gap-3 w-full ${isCollapsed ? "justify-center" : "justify-start"} overflow-hidden`}>
          {/* Ganti src="/logo.png" dengan nama file gambar Anda di folder public */}
          <div className="relative h-10 w-10 min-w-10 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs font-bold">
              1:1 {/* Hapus teks ini jika gambar sudah ada */}
            </div>
            {/* Hapus komentar pada kode Image di bawah jika gambar sudah dimasukkan ke folder public */}
            {/* <Image src="/logo.png" alt="Logo Instansi" fill className="object-cover" /> */}
          </div>
          
          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap animate-in fade-in duration-300">
              <span className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Portal <span className="text-teal-600 dark:text-teal-400">Utama</span></span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Sistem Informasi</span>
            </div>
          )}
        </div>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path}>
              <div className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? "bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              }`}>
                {/* Indikator aktif di sebelah kiri */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-md" />
                )}
                
                <item.icon size={20} className={isActive ? "" : "group-hover:scale-110 transition-transform"} />
                {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar: Dark Mode & Latency */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4">
        
        {/* Toggle Dark Mode */}
        {mounted && (
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors w-full
              ${isCollapsed ? "justify-center" : "justify-start"}
              text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50`
            }
          >
            {theme === "dark" ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            {!isCollapsed && <span className="font-medium text-sm">Mode {theme === "dark" ? "Terang" : "Gelap"}</span>}
          </button>
        )}

        {/* Indikator Latency */}
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50
          ${isCollapsed ? "justify-center" : "justify-start"}`}>
          <div className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap overflow-hidden">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Server Status</span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">Latensi: ~12ms</span>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
}