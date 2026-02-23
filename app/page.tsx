"use compiled";
"use client";

import { useState } from "react";
import { 
  Search, 
  ExternalLink, 
  Wrench, 
  Users, 
  FileText, 
  Database,
  Briefcase
} from "lucide-react";

// Mock Data: Nantinya data ini akan diambil dari Database
const mockApps = [
  { id: 1, name: "Sistem Manajemen Aset", url: "#", desc: "Inventaris dan pemeliharaan alat", icon: Wrench, category: "Operasional" },
  { id: 2, name: "E-Kinerja & HRIS", url: "#", desc: "Absensi, cuti, dan performa karyawan", icon: Users, category: "SDM" },
  { id: 3, name: "Portal Dokumen Digital", url: "#", desc: "Arsip surat menyurat dan SOP", icon: FileText, category: "Administrasi" },
  { id: 4, name: "Database Intranet", url: "#", desc: "Pusat data operasional harian", icon: Database, category: "IT" },
  { id: 5, name: "E-Procurement", url: "#", desc: "Pengadaan barang dan jasa", icon: Briefcase, category: "Keuangan" },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fungsi untuk memfilter aplikasi berdasarkan pencarian
  const filteredApps = mockApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Direktori Aplikasi</h2>
          <p className="text-slate-500 mt-1">Akses cepat ke seluruh sistem internal perusahaan.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all sm:text-sm"
            placeholder="Cari aplikasi atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Aplikasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <a 
              key={app.id} 
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-500/30 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              {/* Efek hover cahaya (Unik & Modern) */}
              <div className="absolute inset-0 bg-linear-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="p-3 bg-slate-50 group-hover:bg-teal-50 rounded-xl transition-colors duration-300">
                  <app.icon className="h-7 w-7 text-slate-600 group-hover:text-teal-600" />
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {app.category}
                </span>
              </div>
              
              <div className="relative z-10 grow">
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                  {app.name}
                </h3>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                  {app.desc}
                </p>
              </div>

              <div className="relative z-10 mt-6 flex items-center text-sm font-medium text-teal-600 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                Buka Aplikasi <ExternalLink className="ml-1 h-4 w-4" />
              </div>
            </a>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">Tidak ada aplikasi yang cocok dengan pencarian "{searchQuery}"</p>
          </div>
        )}
      </div>

    </div>
  );
}