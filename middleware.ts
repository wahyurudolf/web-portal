import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./lib/session";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  
  // Jika mencoba akses halaman admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Dan tidak punya sesi --> Tendang ke Login
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Jika sudah login tapi mencoba buka halaman login --> Lempar ke Admin
  if (request.nextUrl.pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Perbarui waktu kedaluwarsa sesi agar tetap login selama aktif
  return await updateSession(request);
}

// Tentukan rute mana saja yang dijaga oleh middleware ini
export const config = {
  matcher: ["/admin/:path*", "/login"],
};