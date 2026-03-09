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

// Tambahkan di bagian paling bawah appActions.ts

export async function deleteApplication(id: string) {
  try {
    await prisma.application.delete({
      where: { id }
    });

    // Refresh halaman agar tabel langsung ter-update
    revalidatePath("/");
    revalidatePath("/admin");
    
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus aplikasi:", error);
    return { success: false, error: "Terjadi kesalahan saat menghapus data." };
  }
}

// Tambahkan di baris paling bawah app/actions/appActions.ts

export async function updateApplication(id: string, payload: {
  name: string;
  description: string;
  url: string;
  iconType: "SVG" | "IMAGE";
  iconValue: string;
  categoryNames: string[];
  divisionNames: string[];
}) {
  try {
    // 1. TANGANI KATEGORI
    const categoryConnectors = [];
    for (const catName of payload.categoryNames) {
      let category = await prisma.category.findFirst({ where: { name: catName } });
      if (!category) {
        category = await prisma.category.create({ data: { name: catName } });
      }
      categoryConnectors.push({ id: category.id });
    }

    // 2. TANGANI DIVISI
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

    // 3. PERBARUI DATA (UPDATE)
    await prisma.application.update({
      where: { id },
      data: {
        name: payload.name,
        description: payload.description,
        url: payload.url,
        iconType: payload.iconType,
        iconValue: payload.iconValue,
        // Gunakan set: [] untuk menghapus relasi lama, lalu connect untuk memasang yang baru
        categories: { set: [], connect: categoryConnectors },
        divisions: { set: [], connect: divisionConnectors }
      }
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Gagal memperbarui aplikasi:", error);
    return { success: false, error: error instanceof Error ? error.message : "Gagal menyimpan perubahan." };
  }
}

// Tambahkan baris-baris ini di paling bawah file appActions.ts

// --- FUNGSI KELOLA KATEGORI LANGSUNG KE DB ---
export async function deleteCategoryDb(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/"); revalidatePath("/admin"); revalidatePath("/admin/tambah");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Kategori gagal dihapus. Pastikan tidak ada aplikasi yang sedang menggunakan kategori ini." };
  }
}

export async function updateCategoryDb(id: string, name: string) {
  try {
    await prisma.category.update({ where: { id }, data: { name } });
    revalidatePath("/"); revalidatePath("/admin"); revalidatePath("/admin/tambah");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// --- FUNGSI KELOLA DIVISI LANGSUNG KE DB ---
export async function deleteDivisionDb(id: string) {
  try {
    await prisma.division.delete({ where: { id } });
    revalidatePath("/"); revalidatePath("/admin"); revalidatePath("/admin/tambah");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Divisi gagal dihapus. Pastikan tidak ada aplikasi yang sedang menggunakan divisi ini." };
  }
}

export async function updateDivisionDb(id: string, name: string) {
  try {
    await prisma.division.update({ where: { id }, data: { name } });
    revalidatePath("/"); revalidatePath("/admin"); revalidatePath("/admin/tambah");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}