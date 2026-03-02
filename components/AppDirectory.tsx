"use client";

import { useState } from "react";
import { Search, ExternalLink, Wrench, Users, FileText, Database, Briefcase, LayoutGrid } from "lucide-react";

// Pemetaan ikon string dari Database ke Komponen Lucide
const iconMap: Record<string, any> = {
  Wrench, Users, FileText, Database, Briefcase, LayoutGrid
};

// Mendefinisikan tipe data dari Prisma agar TypeScript tidak komplain
type Division = { id: string; name: string };
type Application = {
  id: string;
  name: string;
  description: string | null;
  url: string;
  icon: string | null;
  bgType: string;
  bgValue: string;
  textColor: string;
  divisions: Division[];
};

export default function AppDirectory({ apps }: { apps: Application[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter berdasarkan nama aplikasi ATAU nama divisi
  const filteredApps = apps.filter(app => {
    const matchName = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDiv = app.divisions.some(div => div.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchName || matchDiv;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Search Bar (Disesuaikan untuk Dark Mode) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0f172a] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-500">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Direktori Aplikasi</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Akses cepat ke seluruh sistem internal perusahaan.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-slate-50 dark:bg-[#020817] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all sm:text-sm text-slate-900 dark:text-white"
            placeholder="Cari aplikasi atau divisi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Aplikasi Dinamis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => {
            // Tentukan Ikon (Gunakan LayoutGrid jika ikon tidak ditemukan)
            const IconComponent = app.icon && iconMap[app.icon] ? iconMap[app.icon] : LayoutGrid;
            
            // Logika Auto-Contrast Text
            const isDarkText = app.textColor === "DARK";
            const textClass = isDarkText ? "text-slate-900" : "text-white";
            const descClass = isDarkText ? "text-slate-700" : "text-slate-200";
            
            // Logika Background (Gambar atau Warna Hex)
            const cardStyle = app.bgType === "IMAGE" 
              ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${app.bgValue})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { backgroundColor: app.bgValue };

            return (
              <a 
                key={app.id} 
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full relative overflow-hidden border border-slate-200/50 dark:border-slate-700/50 hover:-translate-y-1"
                style={cardStyle} // Menerapkan background dinamis dari DB
              >
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className={`p-3 rounded-xl backdrop-blur-sm bg-white/20 shadow-sm transition-transform duration-300 group-hover:scale-110 ${textClass}`}>
                    <IconComponent className="h-7 w-7" />
                  </div>
                  
                  {/* Label Divisi (Bisa lebih dari 1) */}
                  <div className="flex flex-col gap-1 items-end">
                    {app.divisions.map((div) => (
                      <span key={div.id} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md bg-white/30 shadow-sm ${textClass}`}>
                        {div.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="relative z-10 grow mt-2">
                  <h3 className={`text-lg font-bold ${textClass}`}>
                    {app.name}
                  </h3>
                  <p className={`text-sm mt-2 line-clamp-2 ${descClass}`}>
                    {app.description}
                  </p>
                </div>

                <div className={`relative z-10 mt-6 flex items-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 ${textClass}`}>
                  Buka Aplikasi <ExternalLink className="ml-1 h-4 w-4" />
                </div>
              </a>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-white dark:bg-[#0f172a] rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">Tidak ada aplikasi yang cocok dengan pencarian "{searchQuery}"</p>
          </div>
        )}
      </div>

    </div>
  );
}