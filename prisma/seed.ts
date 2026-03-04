// prisma/seed.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Memulai proses seeding data v2.1 (Multi-Kategori)...')

  // 1. Buat Data Kategori
  const catIT = await prisma.category.upsert({
    where: { name: 'IT & Jaringan' },
    update: {},
    create: { name: 'IT & Jaringan' },
  })

  const catOps = await prisma.category.upsert({
    where: { name: 'Operasional Pembangkit' },
    update: {},
    create: { name: 'Operasional Pembangkit' },
  })

  // 2. Buat Data Divisi
  const divSI = await prisma.division.upsert({
    where: { name: 'Sistem Informasi' },
    update: {},
    create: { name: 'Sistem Informasi' },
  })

  const divPemeliharaan = await prisma.division.upsert({
    where: { name: 'Pemeliharaan' },
    update: {},
    create: { name: 'Pemeliharaan' },
  })

  const divK3L = await prisma.division.upsert({
    where: { name: 'K3L' },
    update: {},
    create: { name: 'K3L' },
  })

  // 3. Buat Data Aplikasi Pertama
  await prisma.application.create({
    data: {
      name: 'Dashboard Monitoring Topologi',
      description: 'Pemantauan status server, latensi intranet, dan topologi jaringan lokal.',
      url: 'https://jaringan.internal',
      iconType: 'SVG',
      iconValue: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>',
      
      // 👇 PERUBAHAN DI SINI: Menggunakan format relasi array untuk Multi-Kategori 👇
      categories: {
        connect: [{ id: catIT.id }]
      },
      divisions: {
        connect: [{ id: divSI.id }], 
      },
    },
  })

  // 4. Buat Data Aplikasi Kedua
  await prisma.application.create({
    data: {
      name: 'Sistem Manajemen Aset & Logistik',
      description: 'Pencatatan inventaris suku cadang dan jadwal pemeliharaan unit.',
      url: 'https://aset.internal',
      iconType: 'IMAGE',
      iconValue: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      
      // 👇 PERUBAHAN DI SINI 👇
      categories: {
        connect: [{ id: catOps.id }]
      },
      divisions: {
        connect: [{ id: divSI.id }, { id: divPemeliharaan.id }, { id: divK3L.id }],
      },
    },
  })

  console.log('Seeding selesai! Data berhasil dimasukkan ke database.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })