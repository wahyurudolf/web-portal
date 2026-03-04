import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { ThemeProvider } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portal Internal PLN IP",
  description: "Portal Utama Sistem Informasi PLN IP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} flex h-screen overflow-hidden bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-slate-100 transition-colors duration-500`}>
        <ThemeProvider>
          
          <Sidebar />

          <main className="flex-1 flex flex-col h-screen overflow-y-auto">
            {/* Header: Tinggi diatur h-20 agar presisi dengan Sidebar */}
            <header className="h-20 shrink-0 bg-white/80 dark:bg-[#020817]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-500">
              <h1 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">Suralaya Information Center</h1>

              <div className="flex items-center gap-6">
                {/* Profil Pengguna */}
                <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors">Administrator</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors">Divisi Sistem Informasi</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold shadow-sm border border-teal-700">
                    A
                  </div>
                </div>

                {/* Garis Pembatas Estetik */}
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>

                {/* Tombol Dark Mode Pindah ke Sini */}
                <ThemeToggle />
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