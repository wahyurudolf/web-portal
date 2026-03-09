"use client";

import { useState, useCallback, useRef } from "react";
import Cropper, { Area } from "react-easy-crop";
import { ExternalLink, Save, ArrowLeft, UploadCloud, Image as ImageIcon, Code, Plus, Edit2, Trash2, LayoutGrid, Pin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateApplication } from "../app/actions/appActions"; // Menggunakan fungsi Update
import { deleteCategoryDb, deleteDivisionDb, updateCategoryDb, updateDivisionDb } from "../app/actions/appActions";

type Division = { id: string; name: string };
type Category = { id: string; name: string };

// --- FUNGSI BASE64 ---
const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
  const image = new window.Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/png");
};

export default function EditAppForm({ appData, initialDivisions, initialCategories }: { appData: any, initialDivisions: Division[], initialCategories: Category[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // MENGISI STATE DENGAN DATA DARI DATABASE (appData)
  const [name, setName] = useState(appData.name);
  const [desc, setDesc] = useState(appData.description || "");
  const [url, setUrl] = useState(appData.url);
  
  const [iconMode, setIconMode] = useState<"SVG" | "IMAGE">(appData.iconType);
  const [svgInput, setSvgInput] = useState(appData.iconType === "SVG" ? appData.iconValue || "" : "");
  const [finalImage, setFinalImage] = useState<string | null>(appData.iconType === "IMAGE" ? appData.iconValue : null);
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const onCropComplete = useCallback((_: Area, px: Area) => {
    setCroppedPixels(px);
  }, []);

  const handleSaveCrop = async () => {
    if (imageSrc && croppedPixels) {
      const base64Image = await getCroppedImg(imageSrc, croppedPixels);
      setFinalImage(base64Image);
      setImageSrc(null);
    }
  };

  const [divisions, setDivisions] = useState<Division[]>(initialDivisions);
  const [newDivInput, setNewDivInput] = useState("");
  const [isEditingDiv, setIsEditingDiv] = useState(false);

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCatInput, setNewCatInput] = useState("");
  const [isEditingCat, setIsEditingCat] = useState(false);

  // LOGIKA PEMBACAAN CHECKBOX LAMA
  const isAllDivs = appData.divisions.length === initialDivisions.length && initialDivisions.length > 0;
  const [selectedDivs, setSelectedDivs] = useState<string[]>(isAllDivs ? ["ALL"] : appData.divisions.map((d: any) => d.id));
  const [selectedCategories, setSelectedCategories] = useState<string[]>(appData.categories.map((c: any) => c.id));

  const onFileChange = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageSrc(URL.createObjectURL(e.target.files[0]));
      setFinalImage(null);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (iconMode !== "IMAGE") return;
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) { setImageSrc(URL.createObjectURL(file)); setFinalImage(null); }
      }
    }
  };

  const toggleDivision = (id: string) => {
    if (id === "ALL") {
      setSelectedDivs(selectedDivs.includes("ALL") ? [] : ["ALL"]);
      return;
    }
    setSelectedDivs(prev => {
      const withoutAll = prev.filter(d => d !== "ALL");
      if (withoutAll.includes(id)) return withoutAll.filter(d => d !== id);
      return [...withoutAll, id];
    });
  };

  const handleAddDivision = () => {
    if (!newDivInput.trim()) return;
    const newDiv = { id: `new-div-${Date.now()}`, name: newDivInput.trim() };
    setDivisions([...divisions, newDiv]);
    setSelectedDivs(prev => prev.includes("ALL") ? [newDiv.id] : [...prev, newDiv.id]);
    setNewDivInput("");
  };

  const updateDivName = async (id: string, newName: string) => {
    setDivisions(divisions.map(d => d.id === id ? { ...d, name: newName } : d));
    // Jika bukan divisi yang baru saja diketik (belum masuk DB), update ke DB
    if (!id.startsWith("new-div")) {
      await updateDivisionDb(id, newName);
    }
  };
  const deleteDiv = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus Divisi ini secara permanen dari database?")) {
      setDivisions(divisions.filter(d => d.id !== id));
      setSelectedDivs(selectedDivs.filter(d => d !== id));
      
      if (!id.startsWith("new-div")) {
        const result = await deleteDivisionDb(id);
        if (!result.success) alert(result.error);
      }
    }
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleAddCategory = () => {
    if (!newCatInput.trim()) return;
    const newCat = { id: `new-cat-${Date.now()}`, name: newCatInput.trim() };
    setCategories([...categories, newCat]);
    setSelectedCategories([...selectedCategories, newCat.id]);
    setNewCatInput("");
  };

  const updateCatName = async (id: string, newName: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, name: newName } : c));
    if (!id.startsWith("new-cat")) {
      await updateCategoryDb(id, newName);
    }
  };
  const deleteCat = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus Kategori ini secara permanen dari database?")) {
      setCategories(categories.filter(c => c.id !== id));
      setSelectedCategories(selectedCategories.filter(c => c !== id));
      
      if (!id.startsWith("new-cat")) {
        const result = await deleteCategoryDb(id);
        if (!result.success) alert(result.error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!name || !url || selectedCategories.length === 0 || selectedDivs.length === 0) {
      alert("Mohon lengkapi Nama, URL, Kategori, dan Divisi terlebih dahulu.");
      return;
    }
    
    let finalIconValue = "";
    if (iconMode === "SVG") {
      if (!svgInput) return alert("Kode SVG tidak boleh kosong");
      finalIconValue = svgInput;
    } else {
      if (!finalImage) return alert("Mohon potong dan simpan gambar terlebih dahulu");
      finalIconValue = finalImage; 
    }

    setIsSubmitting(true);

    const selectedCatNames = categories.filter(c => selectedCategories.includes(c.id)).map(c => c.name);
    let selectedDivNames = [];
    if (selectedDivs.includes("ALL")) {
      selectedDivNames = ["ALL"];
    } else {
      selectedDivNames = divisions.filter(d => selectedDivs.includes(d.id)).map(d => d.name);
    }

    // MEMANGGIL FUNGSI UPDATE BUKAN CREATE
    const result = await updateApplication(appData.id, {
      name,
      description: desc,
      url,
      iconType: iconMode,
      iconValue: finalIconValue,
      categoryNames: selectedCatNames,
      divisionNames: selectedDivNames
    });

    if (result.success) {
      alert("Perubahan aplikasi berhasil disimpan!");
      router.push("/admin"); 
    } else {
      alert("Gagal: " + result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500" onPaste={handlePaste}>
      
      <div className="lg:col-span-2 space-y-8 bg-white dark:bg-[#0f172a] p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-500">
        
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <Link href="/admin" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </Link>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">Edit Aplikasi</h2>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors">Nama Aplikasi</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Absensi" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors duration-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors">URL / Link Web</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors duration-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors">Deskripsi Singkat</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} placeholder="Fungsi utama aplikasi ini..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors duration-300" />
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 transition-colors duration-500">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">Ikon Aplikasi</label>
              <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg transition-colors">
                <button onClick={() => setIconMode("SVG")} className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all ${iconMode === "SVG" ? "bg-white dark:bg-slate-600 shadow-sm text-teal-600 dark:text-teal-400" : "text-slate-500 dark:text-slate-400"}`} type="button"><Code size={14} /> SVG Text</button>
                <button onClick={() => setIconMode("IMAGE")} className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all ${iconMode === "IMAGE" ? "bg-white dark:bg-slate-600 shadow-sm text-teal-600 dark:text-teal-400" : "text-slate-500 dark:text-slate-400"}`} type="button"><ImageIcon size={14} /> Gambar</button>
              </div>
            </div>

            {iconMode === "SVG" ? (
              <textarea value={svgInput} onChange={(e) => setSvgInput(e.target.value)} rows={4} placeholder='<svg viewBox="0 0 24 24">...</svg>' className="w-full font-mono text-sm px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#020817] text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors duration-300" />
            ) : (
              <div className="space-y-4">
                {imageSrc ? (
                  <div className="relative h-64 w-full bg-slate-900 rounded-xl overflow-hidden">
                    <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-10">
                      <button onClick={() => setImageSrc(null)} type="button" className="px-4 py-2 bg-slate-800/80 text-white text-sm font-bold rounded-lg backdrop-blur hover:bg-red-500 transition-colors">Batal</button>
                      <button onClick={handleSaveCrop} type="button" className="px-4 py-2 bg-teal-600/90 text-white text-sm font-bold rounded-lg backdrop-blur hover:bg-teal-500 transition-colors">Simpan Potongan (1:1)</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex flex-col items-center justify-center gap-3 bg-white dark:bg-[#020817]">
                    <UploadCloud size={32} className="text-slate-400" />
                    <div className="text-sm text-slate-600 dark:text-slate-400"><span className="font-bold text-teal-600 dark:text-teal-400">Klik untuk unggah</span>, drag file, atau <span className="font-bold">Ctrl+V (Paste)</span>.</div>
                    <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
                  </div>
                )}
                {finalImage && !imageSrc && (
                  <div className="flex items-center gap-4 bg-white dark:bg-[#020817] p-3 rounded-xl border border-slate-200 dark:border-slate-700 w-max transition-colors">
                    <img src={finalImage} alt="Cropped" className="w-12 h-12 object-cover rounded-lg" />
                    <button onClick={() => setFinalImage(null)} type="button" className="text-xs text-red-500 font-bold hover:underline">Hapus</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">Kategori Aplikasi</label>
              <button type="button" onClick={() => setIsEditingCat(!isEditingCat)} className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline">
                {isEditingCat ? "Selesai Edit" : <><Edit2 size={12}/> Edit Kategori</>}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((cat) => (
                isEditingCat ? (
                  <div key={cat.id} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
                    <input type="text" value={cat.name} onChange={(e) => updateCatName(cat.id, e.target.value)} className="w-24 px-2 py-1 text-xs bg-white dark:bg-[#020817] border border-slate-200 dark:border-slate-600 rounded text-slate-800 dark:text-white focus:outline-none focus:border-teal-500 transition-colors" />
                    <button type="button" onClick={() => deleteCat(cat.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"><Trash2 size={14}/></button>
                  </div>
                ) : (
                  <label key={cat.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${selectedCategories.includes(cat.id) ? 'bg-teal-50 border-teal-500 text-teal-700 dark:bg-teal-500/10 dark:border-teal-400 dark:text-teal-300 shadow-sm' : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    <input type="checkbox" checked={selectedCategories.includes(cat.id)} onChange={() => toggleCategory(cat.id)} className="hidden" />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </label>
                )
              ))}
            </div>
            {!isEditingCat && (
              <div className="flex items-center gap-2 mt-2">
                <input type="text" value={newCatInput} onChange={(e) => setNewCatInput(e.target.value)} placeholder="Tambah kategori baru..." className="flex-1 px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors" />
                <button type="button" onClick={handleAddCategory} className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-teal-500 hover:text-white transition-colors"><Plus size={18} /></button>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">Akses Divisi Pengguna</label>
              <button type="button" onClick={() => setIsEditingDiv(!isEditingDiv)} className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline">
                {isEditingDiv ? "Selesai Edit" : <><Edit2 size={12}/> Edit Divisi</>}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {!isEditingDiv && (
                 <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${selectedDivs.includes("ALL") ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-400 dark:text-indigo-300 shadow-sm font-bold' : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                   <input type="checkbox" checked={selectedDivs.includes("ALL")} onChange={() => toggleDivision("ALL")} className="hidden" />
                   <span className="text-sm">Semua Divisi</span>
                 </label>
              )}
              {divisions.map((div) => (
                isEditingDiv ? (
                  <div key={div.id} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
                    <input type="text" value={div.name} onChange={(e) => updateDivName(div.id, e.target.value)} className="w-24 px-2 py-1 text-xs bg-white dark:bg-[#020817] border border-slate-200 dark:border-slate-600 rounded text-slate-800 dark:text-white focus:outline-none focus:border-teal-500 transition-colors" />
                    <button type="button" onClick={() => deleteDiv(div.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"><Trash2 size={14}/></button>
                  </div>
                ) : (
                  <label key={div.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${selectedDivs.includes("ALL") ? 'opacity-50 pointer-events-none grayscale' : selectedDivs.includes(div.id) ? 'bg-teal-50 border-teal-500 text-teal-700 dark:bg-teal-500/10 dark:border-teal-400 dark:text-teal-300 shadow-sm' : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    <input type="checkbox" checked={selectedDivs.includes(div.id) && !selectedDivs.includes("ALL")} onChange={() => toggleDivision(div.id)} className="hidden" disabled={selectedDivs.includes("ALL")} />
                    <span className="text-sm font-medium">{div.name}</span>
                  </label>
                )
              ))}
            </div>
            {!isEditingDiv && (
              <div className="flex items-center gap-2 mt-2">
                <input type="text" value={newDivInput} onChange={(e) => setNewDivInput(e.target.value)} placeholder="Tambah divisi baru..." className="flex-1 px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors" />
                <button type="button" onClick={handleAddDivision} className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-teal-500 hover:text-white transition-colors"><Plus size={18} /></button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          <button onClick={handleSubmit} disabled={isSubmitting} className={`flex items-center justify-center w-full gap-2 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg'}`}>
            {isSubmitting ? <span className="animate-pulse">Menyimpan Perubahan...</span> : <><Save size={20} /> Simpan Perubahan Data</>}
          </button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-28 space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Live Preview Card</h3>
          
          <div className="group p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-64 relative overflow-hidden bg-white dark:bg-[#0f172a] hover:-translate-y-1 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="rounded-xl shadow-sm border flex items-center justify-center w-12 h-12 overflow-hidden transition-colors duration-300 group-hover:scale-110 bg-slate-50 dark:bg-[#020817] border-slate-100 dark:border-slate-800">
                {iconMode === "SVG" && svgInput ? (
                  <div dangerouslySetInnerHTML={{ __html: svgInput }} className="w-6 h-6 fill-current stroke-current text-slate-700 dark:text-slate-200" />
                ) : iconMode === "IMAGE" && finalImage ? (
                  <img src={finalImage} alt="Icon" className="w-full h-full object-cover" />
                ) : (
                  <LayoutGrid className="h-6 w-6 text-slate-400" />
                )}
              </div>
              <button type="button" className="p-2 rounded-lg transition-colors text-slate-300 dark:text-slate-600">
                <Pin size={18} />
              </button>
            </div>
            
            <div className="relative z-10 grow mt-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
                {name || "Nama Aplikasi"}
              </h3>
              <p className="text-sm mt-2 line-clamp-2 text-slate-500 dark:text-slate-400 transition-colors duration-300">
                {desc || "Deskripsi aplikasi akan tampil di sini..."}
              </p>
            </div>
            <div className="relative z-10 mt-6 flex items-center text-sm font-bold text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
              Buka Aplikasi <ExternalLink className="ml-1 h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}