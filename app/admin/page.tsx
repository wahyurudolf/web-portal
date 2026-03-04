import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Plus, Edit, Trash2, ExternalLink, Code, Image as ImageIcon } from "lucide-react";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  // Ambil semua data aplikasi beserta relasi divisi DAN kategorinya
  const apps = await prisma.application.findMany({
    include: { 
      divisions: true,
      categories: true // Wajib ditambahkan untuk memuat Kategori
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Admin */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0f172a] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Manajemen Aplikasi</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola direktori portal, ikon, kategori, dan hak akses divisi.</p>
        </div>
        <Link 
          href="/admin/tambah" 
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Tambah Aplikasi
        </Link>
      </div>

      {/* Tabel Data */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#020817] border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Aplikasi & Tautan</th>
                <th className="p-4 font-semibold">Kategori</th>
                <th className="p-4 font-semibold">Divisi Pengguna</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {apps.length > 0 ? (
                apps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    
                    {/* Kolom 1: Info Aplikasi & Indikator Ikon */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span title={`Ikon: ${app.iconType}`} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          {app.iconType === "SVG" ? <Code size={14} /> : <ImageIcon size={14} />}
                        </span>
                        <div className="font-bold text-slate-800 dark:text-white">{app.name}</div>
                      </div>
                      <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 dark:text-teal-400 flex items-center gap-1 mt-1.5 ml-8 hover:underline">
                        {app.url} <ExternalLink size={12} />
                      </a>
                    </td>

                    {/* Kolom 2: Multi-Kategori */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {app.categories.map(cat => (
                          <span key={cat.id} className="px-2 py-1 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 rounded text-xs font-bold border border-teal-100 dark:border-teal-500/30">
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Kolom 3: Multi-Divisi */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {app.divisions.map(div => (
                          <span key={div.id} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-medium border border-slate-200 dark:border-slate-700">
                            {div.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Kolom 4: Aksi */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    Belum ada data aplikasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}