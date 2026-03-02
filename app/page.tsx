import { PrismaClient } from "@prisma/client";
import AppDirectory from "../components/AppDirectory";

// Inisialisasi Prisma
const prisma = new PrismaClient();

// Ini adalah Server Component (tidak ada "use client")
export default async function DashboardPage() {
  
  // Mengambil data dari database, termasuk relasi tabel divisinya
  const apps = await prisma.application.findMany({
    include: {
      divisions: true, 
    },
    orderBy: {
      createdAt: 'desc' // Mengurutkan dari yang terbaru
    }
  });

  return (
    // Mengirim data asli dari database ke komponen antarmuka
    <AppDirectory apps={apps} />
  );
}