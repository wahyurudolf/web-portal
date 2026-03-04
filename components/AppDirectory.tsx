"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Search, ExternalLink, LayoutGrid, Pin, ChevronDown } from "lucide-react";

type Division = { id: string; name: string };
type Category = { id: string; name: string };
type Application = {
  id: string;
  name: string;
  description: string | null;
  url: string;
  iconType: string;
  iconValue: string | null;
  divisions: Division[];
  categories: Category[];
};

// ... (Komponen CustomDropdown di sini tetap sama persis seperti sebelumnya) ...
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
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-teal-500 dark:hover:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm">
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
// ... (Akhir dari CustomDropdown) ...


export default function AppDirectory({ apps }: { apps: Application[] }) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [catFilter, setCatFilter] = useState("ALL");
  const [divFilter, setDivFilter] = useState("ALL");
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  
  // --- STATE KURSOR & TIMER ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredDesc, setHoveredDesc] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const uniqueCats = Array.from(new Map(apps.flatMap(a => a.categories).map(c => [c.id, c])).values());
  const uniqueDivs = Array.from(new Map(apps.flatMap(a => a.divisions).map(d => [d.id, d])).values());

  useEffect(() => {
    const savedPins = localStorage.getItem("plnip_pinned_apps");
    const savedCat = localStorage.getItem("plnip_cat_filter");
    const savedDiv = localStorage.getItem("plnip_div_filter");
    if (savedPins) setPinnedIds(JSON.parse(savedPins));
    if (savedCat) setCatFilter(savedCat);
    if (savedDiv) setDivFilter(savedDiv);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("plnip_pinned_apps", JSON.stringify(pinnedIds));
    localStorage.setItem("plnip_cat_filter", catFilter);
    localStorage.setItem("plnip_div_filter", divFilter);
  }, [pinnedIds, catFilter, divFilter, mounted]);

  const togglePin = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setPinnedIds(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]);
  };

  // --- LOGIKA HOVER DELAY (1.2 Detik) ---
  const handleMouseEnter = (desc: string | null) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (desc) {
      timeoutRef.current = setTimeout(() => {
        setHoveredDesc(desc);
      }, 1200); // Kotak akan muncul setelah kursor diam 1.2 detik
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // Batalkan timer jika kursor pergi sebelum 1.2 detik
    setHoveredDesc(null); // Sembunyikan kotak
  };

  const displayApps = useMemo(() => {
    const filtered = apps.filter(app => {
      const matchSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = catFilter === "ALL" || app.categories.some(c => c.id === catFilter);
      const matchDiv = divFilter === "ALL" || app.divisions.some(d => d.id === divFilter);
      return matchSearch && matchCat && matchDiv;
    });

    return filtered.sort((a, b) => {
      const aPinned = pinnedIds.includes(a.id);
      const bPinned = pinnedIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [apps, searchQuery, catFilter, divFilter, pinnedIds]);

  if (!mounted) return null; 

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-0">
      
      {/* ... (Header dan Filter Section Tetap Sama) ... */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0f172a] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-500">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">Direktori Aplikasi</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Akses cepat ke seluruh sistem internal perusahaan.</p>
        </div>
        
        <div className="relative w-full md:w-96 z-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 transition-colors" />
          </div>
          <input type="text" className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-slate-50 dark:bg-[#020817] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-colors duration-300 text-slate-900 dark:text-white" placeholder="Cari aplikasi..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 relative z-20">
        <div className="flex-1">
          <CustomDropdown value={catFilter} onChange={setCatFilter} options={uniqueCats} placeholder="Semua Kategori" />
        </div>
        <div className="flex-1">
          <CustomDropdown value={divFilter} onChange={setDivFilter} options={uniqueDivs} placeholder="Semua Divisi Pengguna" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayApps.length > 0 ? (
          displayApps.map((app) => {
            const isPinned = pinnedIds.includes(app.id);
            return (
              <a 
                key={app.id} 
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                // Penambahan Event Listener untuk Kursor
                onMouseMove={handleMouseMove}
                onMouseEnter={() => handleMouseEnter(app.description)}
                onMouseLeave={handleMouseLeave}
                className="group p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative overflow-hidden bg-white dark:bg-[#0f172a] hover:-translate-y-1 border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="p-3 rounded-xl shadow-sm border flex items-center justify-center w-12 h-12 overflow-hidden transition-colors duration-300 group-hover:scale-110 bg-slate-50 dark:bg-[#020817] border-slate-100 dark:border-slate-800">
                    {app.iconType === "SVG" && app.iconValue ? (
                      <div dangerouslySetInnerHTML={{ __html: app.iconValue }} className="w-6 h-6 fill-current stroke-current text-slate-700 dark:text-slate-200" />
                    ) : app.iconType === "IMAGE" && app.iconValue ? (
                      <img src={app.iconValue} alt={`${app.name} icon`} className="w-full h-full object-cover" />
                    ) : (
                      <LayoutGrid className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  <button onClick={(e) => togglePin(e, app.id)} className={`p-2 rounded-lg transition-colors ${isPinned ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400' : 'text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} title={isPinned ? "Lepaskan Pin" : "Pin Aplikasi ke Atas"}>
                    {isPinned ? <Pin size={18} className="fill-current" /> : <Pin size={18} />}
                  </button>
                </div>
                
                <div className="relative z-10 grow mt-2">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
                    {app.name}
                  </h3>
                  <p className="text-sm mt-2 line-clamp-2 text-slate-500 dark:text-slate-400 transition-colors duration-300">
                    {app.description}
                  </p>
                </div>

                <div className="relative z-10 mt-6 flex items-center text-sm font-bold text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                  Buka Aplikasi <ExternalLink className="ml-1 h-4 w-4" />
                </div>
              </a>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-white dark:bg-[#0f172a] rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 transition-colors duration-500">
            <p className="text-slate-500 dark:text-slate-400">Tidak ada aplikasi yang sesuai dengan filter Anda.</p>
          </div>
        )}
      </div>

      {/* Komponen Kotak Melayang (Tooltip Dinamis) */}
      {hoveredDesc && (
        <div 
          className="fixed z-50 pointer-events-none bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-200 px-4 py-3 rounded-xl shadow-2xl text-sm max-w-xs animate-in fade-in duration-200 border-2 border-teal-500 dark:border-teal-400 font-medium leading-relaxed"
          style={{ left: mousePos.x + 15, top: mousePos.y + 15 }}
        >
          {hoveredDesc}
        </div>
      )}

    </div>
  );
}