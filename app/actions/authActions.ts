"use server";

import { cookies } from "next/headers";
import { encrypt } from "../../lib/session";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const ADMIN_USER = process.env.ADMIN_USERNAME;
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    // Jika benar, buat sesi
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 Hari
    const session = await encrypt({ user: "admin", expires });

    // Simpan ke Cookie yang aman
    (await
          // Simpan ke Cookie yang aman
          cookies()).set("session", session, { expires, httpOnly: true });
  } else {
    return { error: "Username atau Password salah!" };
  }

  redirect("/admin");
}

export async function logout() {
  // Hapus sesi
  (await
        // Hapus sesi
        cookies()).set("session", "", { expires: new Date(0) });
  redirect("/");
}