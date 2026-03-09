"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Network, 
  Files, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

// Terima properti isAdmin dari layout
export default function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Filter menu: Panel Admin hanya masuk ke dalam array jika isAdmin == true
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Dokumen", icon: Files, path: "/docs" },
    ...(isAdmin ? [{ name: "Panel Admin", icon: ShieldAlert, path: "/admin" }] : []),
  ];

  if (!mounted) return null;

  return (
    <aside 
      className={`relative flex flex-col h-screen transition-all duration-300 ease-in-out border-r z-50
        ${isCollapsed ? "w-20" : "w-64"} 
        bg-slate-50 border-slate-200 
        dark:bg-[#0f172a] dark:border-slate-800
      `}
    >
      {/* Tombol Toggle Buka/Tutup */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-md transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-teal-500/20 group z-50
          border-slate-200 text-slate-400 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600
          dark:bg-[#0f172a] dark:border-slate-700 dark:text-slate-500 dark:hover:border-teal-400 dark:hover:bg-teal-500/10 dark:hover:text-teal-400"
        title={isCollapsed ? "Perluas Sidebar" : "Sembunyikan Sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight size={18} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        ) : (
          <ChevronLeft size={18} strokeWidth={2.5} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
        )}
      </button>

      {/* Area Logo & Nama Instansi */}
      <div className="h-20 shrink-0 flex items-center justify-center border-b border-slate-200 dark:border-slate-800 px-4">
        <div className={`flex items-center gap-3 w-full ${isCollapsed ? "justify-center" : "justify-start"} overflow-hidden`}>
          <div className="relative h-10 w-10 min-w-10 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-100 dark:border-slate-700 shrink-0 flex items-center justify-center">
            <Image 
              src="/logopln.jpg" 
              alt="Logo Portal"
              fill
              quality={100} 
              className="object-contain" 
            />
          </div>
          
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in duration-300 overflow-hidden w-full">
              <span className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Portal <span className="text-teal-600 dark:text-teal-400">Utama</span></span>
              <div className="w-full overflow-hidden relative">
                <span className="inline-block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold whitespace-nowrap animate-slide-text">
                  PT PLN Indonesia Power - UBP Suralaya
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (pathname.startsWith("/admin") && item.path === "/admin");
          return (
            <Link key={item.name} href={item.path}>
              <div className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? "bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              }`}>
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

      {/* <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4">
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 ${isCollapsed ? "justify-center" : "justify-start"}`}>
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
      </div> */}
    </aside>
  );
}