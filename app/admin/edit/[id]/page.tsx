import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import EditAppForm from "../../../../components/EditAppForm";

const prisma = new PrismaClient();

// Perhatikan perubahan pada tipe data params menjadi Promise
export default async function EditAppPage({ params }: { params: Promise<{ id: string }> }) {
  // Wajib ditunggu (await) terlebih dahulu sebelum mengambil nilai ID-nya
  const resolvedParams = await params;
  const appId = resolvedParams.id;

  // Ambil data aplikasi yang ingin diedit beserta relasinya menggunakan ID yang sudah valid
  const appData = await prisma.application.findUnique({
    where: { id: appId },
    include: { categories: true, divisions: true }
  });

  // Jika ID aplikasi tidak ditemukan di database, tampilkan halaman 404
  if (!appData) return notFound();

  // Ambil daftar divisi dan kategori yang tersedia
  const divisions = await prisma.division.findMany();
  const categories = await prisma.category.findMany();

  return (
    <div className="max-w-5xl mx-auto">
      <EditAppForm 
        appData={appData} 
        initialDivisions={divisions} 
        initialCategories={categories} 
      />
    </div>
  );
}