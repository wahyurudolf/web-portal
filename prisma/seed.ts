// prisma/seed.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Memulai proses seeding data...')

  // 1. Buat Data Divisi
  const divOperasional = await prisma.division.upsert({
    where: { name: 'Operasional' },
    update: {},
    create: { name: 'Operasional' },
  })

  const divSDM = await prisma.division.upsert({
    where: { name: 'SDM' },
    update: {},
    create: { name: 'SDM' },
  })

  const divIT = await prisma.division.upsert({
    where: { name: 'Sistem Informasi' },
    update: {},
    create: { name: 'Sistem Informasi' },
  })

  // 2. Buat Data Aplikasi Pertama (Background Terang, Teks Gelap)
  await prisma.application.create({
    data: {
      name: 'Sistem Manajemen Aset',
      description: 'Inventaris dan pemeliharaan alat pembangkit',
      url: 'https://aset.internal',
      icon: 'Wrench',
      bgType: 'COLOR',
      bgValue: '#ffffff', // Putih
      textColor: 'DARK',  // Teks harus gelap agar kontras
      divisions: {
        connect: [{ id: divOperasional.id }, { id: divIT.id }], // Digunakan 2 divisi
      },
    },
  })

  // 3. Buat Data Aplikasi Kedua (Background Gelap/Brand Color, Teks Terang)
  await prisma.application.create({
    data: {
      name: 'E-Kinerja Pegawai',
      description: 'Penilaian performa dan absensi',
      url: 'https://kinerja.internal',
      icon: 'Users',
      bgType: 'COLOR',
      bgValue: '#0f172a', // Biru gelap (slate-900)
      textColor: 'LIGHT', // Teks harus putih/terang
      divisions: {
        connect: [{ id: divSDM.id }],
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