import { PrismaClient } from "@prisma/client";
import AddAppForm from "../../../components/AddAppForm"; // Sesuaikan path jika berbeda
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const prisma = new PrismaClient();

export default async function TambahAppPage() {
  // Ambil data Divisi DAN Kategori dari database
  const divisions = await prisma.division.findMany();
  const categories = await prisma.category.findMany(); // <-- Baris baru untuk mengambil kategori

  return (
    <div className="max-w-5xl mx-auto">
      <AddAppForm 
        initialDivisions={divisions} 
        initialCategories={categories} // <-- Kirim data kategori ke form
      />
    </div>
  );
}