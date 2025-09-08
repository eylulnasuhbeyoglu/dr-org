"use client";

import React from "react";
import { Home, Users, Settings, FolderHeart, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dentalcliniclogo from "@/public/dentalcliniclogo.png";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, setIsOpen, toggleSidebar }: SidebarProps) => {
  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
    { label: "Users", href: "/users", icon: <Users size={20} /> },
    { label: "Bildirimler", href: "/notifications", icon: <Settings size={20} /> },
    { label: "Onam Formları", href: "/consents", icon: <Settings size={20} /> },
    { label: "Stok Yönetimi", href: "/stock", icon: <Settings size={20} /> },
    { label: "E-Reçete", href: "/e-prescriptions", icon: <Settings size={20} /> },
    { label: "Tedavi Listeleri", href: "/treatment-lists", icon: <Settings size={20} /> },
    { label: "Faturalar", href: "/invoice-detail", icon: <Settings size={20} /> },
    { label: "Yeni Hasta Ekle", href: "/new-add", icon: <Users size={20} /> },
    { label: "Doktor Ekle", href: "/doktorekle", icon: <Settings size={20} /> },
    { label: "Hasta Kayıtları", href: "/patient-list", icon: <FolderHeart size={20} /> },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-30 transition-all duration-300 rounded-r-xl flex flex-col`}
        style={{ width: isOpen ? 256 : 72 }}
      >
        {/* Logo (tıklanabilir) */}
        <div className="flex items-center gap-2 p-4 border-b">
          <button onClick={toggleSidebar} className="flex items-center gap-2">
            {isOpen ? (
              <>
                <Image src={dentalcliniclogo} alt="Logo" width={32} height={32} />
                <span className="font-bold text-gray-800">Clinic</span>
              </>
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Menü */}
        <nav className="flex flex-col gap-2 p-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
            >
              {item.icon}
              <span
                className={`transition-all duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay (sadece mobil) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-25 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
