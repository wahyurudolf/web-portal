"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-10 h-10"></div>; // Placeholder agar tata letak tidak melompat

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors shadow-sm border border-slate-200 dark:border-slate-700"
      title={`Ganti ke mode ${theme === "dark" ? "Terang" : "Gelap"}`}
    >
      {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
    </button>
  );
}