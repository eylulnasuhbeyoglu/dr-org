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

  // Persist sidebar state across reloads
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sidebarOpen");
      if (saved !== null) setSidebarOpen(saved === "true");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sidebarOpen", String(sidebarOpen));
    } catch {}
  }, [sidebarOpen]);

  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
          </main>
        </div>
      </body>
    </html>
  );
}
