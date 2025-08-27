"use client";

import React, { useState } from "react";
import { Menu, X, Home, Users, Settings, FolderHeart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dentalcliniclogo from "@/public/dentalcliniclogo.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
    { label: "Users", href: "/users", icon: <Users size={20} /> },
    { label: "Settings", href: "/settings", icon: <Settings size={20} /> },
    { label: "Yeni Hasta Ekle", href: "/new-add", icon: <Users size={20} /> },
    { label: "Doktor Ekle", href: "/doktorekle", icon: <Settings size={20} /> },
    { label: "Hasta Kayıtları", href: "/patient-list", icon: <FolderHeart size={20} /> },
    {label: " Analytics" , href:"/users" , icon:<Users size={20}/> },
    {label: " Discover" , href:"/users" , icon:<Users size={20}/> },
    {label: " Sales" , href:"/users" , icon:<Users size={20}/> },
    {label: " Smart House" , href:"/users" , icon:<Users size={20}/> },
  ];

  return (
    <>
      {/* Hamburger Butonu */}
      <div className="fixed  top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md text-blue-800 hover:bg-gray-200 transition"
        >
          <Menu size={28} />
        </button>
      </div>

     

      {/* Sidebar */}
      <aside
        className={`fixed top-2 left-2  h-full w-58 bg-white shadow-lg z-50 transform transition-transform duration-300 rounded-xl
        }`}
      >
        {/* Üst Kısım: Logo ve Kapatma Butonu */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Image src={dentalcliniclogo} alt="Logo" width={40} height={40} />
            <span className="font-bold text-gray-800">Clinic</span>
          </div>
        
        </div>

        {/* Menü */}
        <nav className="flex flex-col gap-2 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
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
