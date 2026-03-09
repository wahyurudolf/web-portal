"use client";

import { useState, useRef, useEffect } from "react";
import { Edit, Trash2, ExternalLink, Code, Image as ImageIcon, GripVertical, Search, ChevronDown, AlertCircle } from "lucide-react";
import { reorderApplications, deleteApplication } from "../app/actions/appActions"; 
import { useRouter } from "next/navigation"; 

// --- KOMPONEN DROPDOWN KUSTOM ---
interface DropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: { id: string; name: string }[];
  placeholder: string;
}

function CustomDropdown({ value, onChange, options, placeholder }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-teal-500 focus:outline-none transition-colors shadow-sm">
        <span className="truncate">{selectedOption ? selectedOption.name : placeholder}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          <button onClick={() => { onChange("ALL"); setIsOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === "ALL" ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>{placeholder}</button>
          {options.map((opt) => (
            <button key={opt.id} onClick={() => { onChange(opt.id); setIsOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === opt.id ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>{opt.name}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- KOMPONEN UTAMA TABEL ADMIN ---
export default function AdminAppTable({ initialApps }: { initialApps: any[] }) {
  const router = useRouter(); 
  const [apps, setApps] = useState(initialApps);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setApps(initialApps);
  }, [initialApps]);

  const [searchQuery, setSearchQuery] = useState("");
  const [catFilter, setCatFilter] = useState("ALL");
  const [divFilter, setDivFilter] = useState("ALL");

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const uniqueCats = Array.from(new Map(initialApps.flatMap(a => a.categories).map((c: any) => [c.id, c])).values()) as {id: string, name: string}[];
  const uniqueDivs = Array.from(new Map(initialApps.flatMap(a => a.divisions).map((d: any) => [d.id, d])).values()) as {id: string, name: string}[];

  const isFiltering = searchQuery !== "" || catFilter !== "ALL" || divFilter !== "ALL";
  
  const displayApps = apps.filter(app => {
    const matchSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = catFilter === "ALL" || app.categories.some((c: any) => c.id === catFilter);
    const matchDiv = divFilter === "ALL" || app.divisions.some((d: any) => d.id === divFilter);
    return matchSearch && matchCat && matchDiv;
  });

  const handleDelete = async (id: string, appName: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus aplikasi "${appName}" secara permanen?`)) {
      setIsSaving(true);
      const result = await deleteApplication(id);
      if (!result.success) {
        alert(result.error);
      }
      setIsSaving(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (isFiltering) return;
    dragItem.current = index;
    e.currentTarget.classList.add("opacity-50", "bg-teal-50", "dark:bg-teal-900/30");
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    if (isFiltering) return;
    dragOverItem.current = index;
  };

  const handleDragEnd = async (e: React.DragEvent) => {
    if (isFiltering) return;
    e.currentTarget.classList.remove("opacity-50", "bg-teal-50", "dark:bg-teal-900/30");

    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    let _apps = [...apps];
    const draggedItemContent = _apps.splice(dragItem.current, 1)[0];
    _apps.splice(dragOverItem.current, 0, draggedItemContent);
    
    setApps(_apps);
    dragItem.current = null;
    dragOverItem.current = null;
    setIsSaving(true);

    const orderedIds = _apps.map(a => a.id);
    await reorderApplications(orderedIds);
    setIsSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-[#0f172a] p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama aplikasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-[#020817] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors text-slate-900 dark:text-white"
          />
        </div>
        <div className="flex-1 md:max-w-62.5">
          <CustomDropdown value={catFilter} onChange={setCatFilter} options={uniqueCats} placeholder="Semua Kategori" />
        </div>
        <div className="flex-1 md:max-w-62.5">
          <CustomDropdown value={divFilter} onChange={setDivFilter} options={uniqueDivs} placeholder="Semua Divisi" />
        </div>
      </div>

      {isFiltering && (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-amber-700 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-500/20">
          <AlertCircle size={16} />
          <span><strong>Mode Filter Aktif:</strong> Fitur geser urutan (Drag & Drop) dinonaktifkan sementara.</span>
        </div>
      )}

      <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors relative">
        {isSaving && <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 animate-pulse z-50"></div>}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-200">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#020817] border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">
                <th className="p-4 w-12 text-center"></th>
                <th className="p-4 font-semibold w-2/5">Aplikasi & Tautan</th>
                <th className="p-4 font-semibold w-1/5">Kategori</th>
                <th className="p-4 font-semibold w-1/5">Divisi Pengguna</th>
                <th className="p-4 font-semibold w-24 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayApps.length > 0 ? (
                displayApps.map((app, index) => (
                  <tr 
                    key={app.id} 
                    draggable={!isFiltering} 
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()} 
                    className={`transition-colors group bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-slate-800/50 ${!isFiltering ? "cursor-grab active:cursor-grabbing" : ""}`}
                  >
                    <td className={`p-4 transition-colors ${!isFiltering ? "text-slate-300 dark:text-slate-600 group-hover:text-teal-500" : "text-slate-200 dark:text-slate-800/50 cursor-not-allowed"}`}>
                      <GripVertical size={20} />
                    </td>
                    <td className="p-4 overflow-hidden">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span title={`Ikon: ${app.iconType}`} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
                          {app.iconType === "SVG" ? <Code size={14} /> : <ImageIcon size={14} />}
                        </span>
                        {/* Nama Aplikasi dengan Truncate */}
                        <div className="font-bold text-slate-800 dark:text-white truncate" title={app.name}>{app.name}</div>
                      </div>
                      
                      {/* URL DENGAN TRUNCATE & TOOLTIP */}
                      <a 
                        href={app.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title={app.url} // Tooltip bawaan browser untuk melihat teks lengkap
                        className="text-xs text-teal-600 dark:text-teal-400 flex items-center gap-1 ml-8 hover:underline w-fit max-w-full"
                      >
                        <span className="truncate max-w-50 md:max-w-62.5 lg:max-w-87.5">{app.url}</span>
                        <ExternalLink size={12} className="shrink-0" />
                      </a>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {app.categories.map((cat: any) => (
                          <span key={cat.id} className="px-2 py-1 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 rounded text-xs font-bold border border-teal-100 dark:border-teal-500/30">
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {app.divisions.map((div: any) => (
                          <span key={div.id} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-medium border border-slate-200 dark:border-slate-700">
                            {div.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => router.push(`/admin/edit/${app.id}`)}
                          title="Edit Aplikasi"
                          className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(app.id, app.name)}
                          title="Hapus Aplikasi"
                          className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    Tidak ada aplikasi yang cocok dengan filter pencarian Anda.
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