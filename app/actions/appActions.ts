"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createApplication(payload: {
  name: string;
  description: string;
  url: string;
  iconType: "SVG" | "IMAGE";
  iconValue: string;
  categoryNames: string[]; // <-- Sekarang menerima Nama, bukan ID
  divisionNames: string[]; // <-- Sekarang menerima Nama, bukan ID
}) {
  try {
    // 1. TANGANI KATEGORI (Cari di DB, jika tidak ada, buat baru otomatis)
    const categoryConnectors = [];
    for (const catName of payload.categoryNames) {
      let category = await prisma.category.findFirst({ where: { name: catName } });
      if (!category) {
        category = await prisma.category.create({ data: { name: catName } });
      }
      categoryConnectors.push({ id: category.id });
    }

    // 2. TANGANI DIVISI (Cari di DB, jika tidak ada, buat baru otomatis)
    let divisionConnectors = [];
    if (payload.divisionNames.includes("ALL")) {
      const allDivisions = await prisma.division.findMany({ select: { id: true } });
      divisionConnectors = allDivisions.map(div => ({ id: div.id }));
    } else {
      for (const divName of payload.divisionNames) {
        let division = await prisma.division.findFirst({ where: { name: divName } });
        if (!division) {
          division = await prisma.division.create({ data: { name: divName } });
        }
        divisionConnectors.push({ id: division.id });
      }
    }

    // 1. CARI URUTAN TERAKHIR (Tertinggi)
    const lastApp = await prisma.application.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    });
    const newOrder = lastApp ? lastApp.order + 1 : 0; // Aplikasi baru dapat angka paling besar (paling bawah)

    // 2. SIMPAN DATA APLIKASI
    await prisma.application.create({
      data: {
        name: payload.name,
        description: payload.description,
        url: payload.url,
        iconType: payload.iconType,
        iconValue: payload.iconValue,
        order: newOrder, // <-- Masukkan urutan barunya di sini
        categories: { connect: categoryConnectors },
        divisions: { connect: divisionConnectors }
      }
    });

    // Refresh halaman agar data langsung muncul
    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
    
  } catch (error) {
    console.error("Database Error:", error);
    // Menampilkan pesan error asli di console/alert jika terjadi kegagalan
    return { success: false, error: error instanceof Error ? error.message : "Gagal menyimpan ke database." };
  }
}

export async function reorderApplications(orderedIds: string[]) {
  try {
    // Kita jalankan update massal dalam satu transaksi
    const updates = orderedIds.map((id, index) =>
      prisma.application.update({
        where: { id },
        data: { order: index }, // Menyimpan indeks/posisi barunya
      })
    );

    await prisma.$transaction(updates);

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Gagal mengubah urutan:", error);
    return { success: false };
  }
}