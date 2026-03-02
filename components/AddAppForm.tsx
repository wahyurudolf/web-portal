"use client";

import { useState } from "react";
import { ExternalLink, LayoutGrid, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Tipe data dari Prisma
type Division = { id: string; name: string };

export default function AddAppForm({ divisions }: { divisions: Division[] }) {
  const [name, setName] = useState("Nama Aplikasi Baru");
  const [desc, setDesc] = useState("Deskripsi singkat aplikasi operasional...");
  const [url, setUrl] = useState("");
  const [bgValue, setBgValue] = useState("#0f172a"); // Default warna biru gelap
  const [selectedDivs, setSelectedDivs] = useState<string[]>([]);

  // --- LOGIKA AUTO-CONTRAST (YIQ Formula) ---
  const getContrastColor = (hexColor: string) => {
    // Hilangkan '#' jika ada
    const hex = hexColor.replace("#", "");
    if (hex.length !== 6) return "DARK"; // Fallback aman

    // Konversi ke RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Rumus kecerahan YIQ
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Jika nilai YIQ >= 128 (Warna Terang), kembalikan DARK (teks hitam)
    return yiq >= 128 ? "DARK" : "LIGHT";
  };

  const currentTextColor = getContrastColor(bgValue);
  const textClass = currentTextColor === "DARK" ? "text-slate-900" : "text-white";
  const descClass = currentTextColor === "DARK" ? "text-slate-700" : "text-slate-200";

  // Fungsi toggle checkbox divisi
  const toggleDivision = (id: string) => {
    setSelectedDivs(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      
      {/* BAGIAN KIRI: Form Input */}
      <div className="lg:col-span-2 space-y-6 bg-white dark:bg-[#0f172a] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </Link>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Tambah Aplikasi Baru</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Aplikasi</label>
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL / Link Web</label>
            <input 
              type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deskripsi Singkat</label>
            <textarea 
              value={desc} onChange={(e) => setDesc(e.target.value)} rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Pemilihan Warna Latar (Color Picker) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Warna Latar (Background)</label>
            <div className="flex items-center gap-4">
              <input 
                type="color" value={bgValue} onChange={(e) => setBgValue(e.target.value)}
                className="h-12 w-20 p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020817] cursor-pointer"
              />
              <span className="text-sm text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                {bgValue.toUpperCase()}
              </span>
              <span className={`text-xs px-3 py-1.5 rounded-lg font-bold tracking-wide ${currentTextColor === 'DARK' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'}`}>
                Auto Text: {currentTextColor}
              </span>
            </div>
          </div>

          {/* Pemilihan Divisi (Checkboxes) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Akses Divisi Pengguna</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {divisions.map((div) => (
                <label key={div.id} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${selectedDivs.includes(div.id) ? 'bg-teal-50 border-teal-500 dark:bg-teal-500/10 dark:border-teal-400' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                  <input 
                    type="checkbox" checked={selectedDivs.includes(div.id)} onChange={() => toggleDivision(div.id)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{div.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          <button className="flex items-center justify-center w-full gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg">
            <Save size={20} /> Simpan Aplikasi
          </button>
        </div>

      </div>

      {/* BAGIAN KANAN: Live Preview Card */}
      <div className="lg:col-span-1">
        <div className="sticky top-28 space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Live Preview Card</h3>
          
          {/* Komponen Card persis seperti di halaman depan */}
          <div 
            className="group p-6 rounded-2xl shadow-md border border-slate-200/50 flex flex-col h-64 relative overflow-hidden transition-all duration-300"
            style={{ backgroundColor: bgValue }}
          >
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`p-3 rounded-xl backdrop-blur-sm bg-white/20 shadow-sm ${textClass}`}>
                <LayoutGrid className="h-7 w-7" />
              </div>
              <div className="flex flex-col gap-1 items-end">
                {selectedDivs.length === 0 ? (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md bg-white/30 shadow-sm ${textClass}`}>
                    Pilih Divisi
                  </span>
                ) : (
                  divisions.filter(d => selectedDivs.includes(d.id)).map(div => (
                    <span key={div.id} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md bg-white/30 shadow-sm ${textClass}`}>
                      {div.name}
                    </span>
                  ))
                )}
              </div>
            </div>
            
            <div className="relative z-10 grow mt-2">
              <h3 className={`text-lg font-bold ${textClass}`}>{name || "Nama Aplikasi"}</h3>
              <p className={`text-sm mt-2 line-clamp-2 ${descClass}`}>{desc || "Deskripsi..."}</p>
            </div>

            <div className={`relative z-10 mt-6 flex items-center text-sm font-bold opacity-100 ${textClass}`}>
              Buka Aplikasi <ExternalLink className="ml-1 h-4 w-4" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}