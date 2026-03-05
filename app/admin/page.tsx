import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminAppTable from "../../components/AdminAppTable"; // Pastikan path benar

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const apps = await prisma.application.findMany({
    include: { divisions: true, categories: true },
    orderBy: { order: "asc" }, // <-- UBAH KE "order" "asc"
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0f172a] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Manajemen Aplikasi</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola direktori portal, ikon, kategori, dan hak akses divisi.</p>
        </div>
        <Link href="/admin/tambah" className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
          <Plus size={18} /> Tambah Aplikasi
        </Link>
      </div>

      {/* Panggil Client Component Tabel Drag & Drop di sini */}
      <AdminAppTable initialApps={apps} />
    </div>
  );
}