"use client";
import React, { useState } from "react";
import { Menu, X, Home, Users, Settings } from "lucide-react";
import Link from "next/link";
import dentalcliniclogo from "@/public/dentalcliniclogo.png"
import { FolderHeart } from 'lucide-react';
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { label: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
    { label: "Users", href: "/users", icon: <Users size={20} /> },
    { label: "Settings", href: "/settings", icon: <Settings size={20} /> },
    { label: "Yeni Hasta Ekle", href: "/new-add", icon: <Users size={20} /> },
    { label: "Doktor Ekle", href: "/doktorekle", icon: <Settings size={20} /> },
    { label: "Hasta Kayıtları ", href: "/hastakayıtları", icon: <FolderHeart size={20} /> },
  ];

  return (
    <>
    
      {/* Sol üst köşe hamburger butonu */}
      <div className="fixed top-1 left-9 ">
      <div className="mb-3 w-50 h-20">
          <img
            src="/dentalcliniclogo.png"
            alt="Dental Clinic Logo"
            className=" h-full object-contain"
          />
        </div>
        <button onClick={() => setIsOpen(true)} className="p-2  text-blue-800">
          <Menu size={28} />
        </button>
      </div>
    
      {/* Sidebar Arkaplanı */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-pink-100 bg-opacity-40 z-40"
        />
      )}

      {/* Soldan Gelen Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#d0dfe3] text-pink-500 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Kapatma butonu */}
        <div className="  flex justify-end p-4">
          <button onClick={() => setIsOpen(false)} className="text-pink-500">
            <X size={24} />
          </button>
        </div>

        {/* Menü */}
        <nav className="flex flex-col gap-4 px-6">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-pink-700 transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
      </aside>
    </>
  );
};

export default Sidebar;
