"use client";
import React, { useState } from "react";
import man from "@/public/man.png"
const departments = [
  "Diş Hekimliği",
  "Ortodonti",
  "İmplant Tedavisi",
  "Estetik Diş",
  "Pedodonti",
  "Protez",
  "Diş Beyazlatma",
];

const adminList = [
    "Admin",
  "Dr. Ayşe Yılmaz",
  "Dr. Mehmet Can",
  "Dr. Elif Kaya",
  "Dr. Ahmet Demir",
];

const Navbar = () => {
  const [isDepOpen, setIsDepOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedDep, setSelectedDep] = useState("");

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState("");

  const handleDepartmentSelect = (dep: string) => {
    setSelectedDep(dep);
    setQuery(dep);
    setIsDepOpen(false);
  };

  const handleAdminSelect = (admin: string) => {
    setSelectedAdmin(admin);
    setIsAdminOpen(false);
  };

  const filteredDepartments = departments.filter((dep) =>
    dep.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-[#d0dfe3] w-full max-w-[1600px] mx-auto px-3 py-7 flex  justify-center sm:flex-row sm:items-end sm:justify-end gap-12">
      
      {/* Select Department */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsDepOpen(true);
          }}
          onClick={() => setIsDepOpen(true)}
          placeholder="Select Department"
          className="px-1 py-1 w-70 border border-gray-300 rounded-md focus:outline-blue-400"
        />
        {isDepOpen && (
          <ul className="absolute left-0 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-auto">
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dep, i) => (
                <li
                  key={i}
                  onClick={() => handleDepartmentSelect(dep)}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {dep}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-400">Sonuç bulunamadı</li>
            )}
          </ul>
        )}
      </div>

      {/* Select Admin */}
      <div className="relative w-30">
        <img src="/man.png" alt="man" className="absolute mt-1 ml-[-40px] " />
        <div
          onClick={() => setIsAdminOpen((prev) => !prev)}
          className="px-1 py-1  border border-gray-300 rounded-md cursor-pointer"
        >
          {selectedAdmin || " Admin"}
        </div>
        {isAdminOpen && (
          <ul className="absolute left-0 mt-1 w-full border border-gray-300 rounded-md shadow-lg  overflow-auto">
            {adminList.map((admin, i) => (
              <li
                key={i}
                onClick={() => handleAdminSelect(admin)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {admin}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;
