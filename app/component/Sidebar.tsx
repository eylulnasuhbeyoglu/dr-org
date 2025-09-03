"use client";

import React from "react";
import { Menu, X, Home, Users, Settings, FolderHeart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dentalcliniclogo from "@/public/dentalcliniclogo.png";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  toggleSidebar:()=>  void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
    { label: "Users", href: "/users", icon: <Users size={20} /> },
    { label: "Settings", href: "/settings", icon: <Settings size={20} /> },
    { label: "Yeni Hasta Ekle", href: "/new-add", icon: <Users size={20} /> },
    { label: "Doktor Ekle", href: "/doktorekle", icon: <Settings size={20} /> },
    { label: "Hasta Kayıtları", href: "/patient-list", icon: <FolderHeart size={20} /> },
    { label: "Analytics", href: "/analytics", icon: <Users size={20} /> },
    { label: "Discover", href: "/discover", icon: <Users size={20} /> },
    { label: "Sales", href: "/sales", icon: <Users size={20} /> },
    { label: "Smart House", href: "/smarthouse", icon: <Users size={20} /> },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 rounded-r-xl flex flex-col`}
        style={{ width: isOpen ? 256 : 72 }}
      >
        {/* Logo ve Kapatma */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Image src={dentalcliniclogo} alt="Logo" width={40} height={40} />
            <span className={`font-bold text-gray-800 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>Clinic</span>
          </div>
          {/* Mobilde görünür */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-200 transition"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
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
              <span className={`transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md text-blue-800 hover:bg-gray-200 transition"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Overlay (sadece mobil) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
