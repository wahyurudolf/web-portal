import { PrismaClient } from "@prisma/client";
import AddAppForm from "../../../components/AddAppForm";

const prisma = new PrismaClient();

export default async function TambahAplikasiPage() {
  // Tarik data divisi dari database untuk ditampilkan sebagai checkbox di form
  const divisions = await prisma.division.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div>
      <AddAppForm divisions={divisions} />
    </div>
  );
}