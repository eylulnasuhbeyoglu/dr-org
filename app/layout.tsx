"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "./component/Sidebar";
import "./globals.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Persist sidebar state across reloads
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sidebarOpen");
      if (saved !== null) setSidebarOpen(saved === "true");
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sidebarOpen", String(sidebarOpen));
    } catch {}
  }, [sidebarOpen]);

  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
    } catch {}
    if (typeof document !== "undefined") {
      const html = document.documentElement;
      html.classList.remove("light", "dark");
      html.classList.add(theme);
    }
  }, [theme]);

  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100`}>
        <div className="flex h-screen">
          {/* Sidebar */}
          {!isLogin && (
            <Sidebar
              isOpen={sidebarOpen}
              setIsOpen={setSidebarOpen}
              toggleSidebar={() => setSidebarOpen((prev) => !prev)}
            />
          )}

          {/* Sayfa içeriği */}
          <main
            className={`flex-1 transition-all duration-300 overflow-auto ${
              !isLogin ? (sidebarOpen ? "md:ml-[256px]" : "md:ml-[72px]") : ""
            }`}
          >
            {children}
            {/* Theme toggle */}
            <button
              aria-label="Tema Değiştir"
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              className="fixed bottom-4 right-4 z-50 px-3 py-2 rounded-full shadow bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 border"
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </main>
        </div>
      </body>
    </html>
  );
}
