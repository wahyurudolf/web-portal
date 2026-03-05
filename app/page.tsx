import { PrismaClient } from "@prisma/client";
import AppDirectory from "../components/AppDirectory";

// Inisialisasi Prisma
const prisma = new PrismaClient();

// Ini adalah Server Component (tidak ada "use client")
export default async function DashboardPage() {
  
  // Mengambil data dari database, termasuk relasi tabel divisinya
  const apps = await prisma.application.findMany({
    include: { divisions: true, categories: true },
    orderBy: { order: 'asc' } // <-- UBAH JUGA DI SINI (Sebelumnya createdAt: 'desc')
  });

  return (
    // Mengirim data asli dari database ke komponen antarmuka
    <AppDirectory apps={apps} />
  );
}