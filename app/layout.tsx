import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { ThemeProvider } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import { getSession } from "../lib/session"; // Import pengecek sesi
import { logout } from "./actions/authActions"; // Import fungsi logout
import { LogOut } from "lucide-react"; // Ikon untuk logout

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portal Internal PLN IP",
  description: "Portal Utama Sistem Informasi PLN IP",
};

// Ubah fungsi menjadi async agar bisa membaca cookies/session
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Cek apakah admin sedang login
  const session = await getSession();
  const isAdmin = !!session; // Bernilai true jika login, false jika belum

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} flex h-screen overflow-hidden bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-slate-100 transition-colors duration-500`}>
        <ThemeProvider>
          
          {/* Kirim status isAdmin ke Sidebar agar menu Panel Admin bisa disembunyikan */}
          <Sidebar isAdmin={isAdmin} />

          <main className="flex-1 flex flex-col h-screen overflow-y-auto">
            <header className="h-20 shrink-0 bg-white/80 dark:bg-[#020817]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-500">
              <h1 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">Suralaya Information Center</h1>

              <div className="flex items-center gap-4 md:gap-6">
                
                

                {/* Tombol Dark Mode Selalu Muncul */}
                <ThemeToggle />

                
                {/* BLOK PROFIL & LOGOUT - HANYA MUNCUL JIKA LOGIN */}
                {isAdmin && (

                  
                  <div className="flex items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors">Administrator</p>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors">Divisi Sistem Informasi</p>
                      </div>
                    </div>

                    {/* Tombol Logout */}
                    <form action={logout}>
                      <button 
                        type="submit" 
                        title="Keluar dari Dashboard"
                        className="p-2.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                      >
                        <LogOut size={18} strokeWidth={2.5} />
                      </button>
                    </form>

                    
                  </div>
                )}
              </div>
            </header>

            <div className="p-8">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}