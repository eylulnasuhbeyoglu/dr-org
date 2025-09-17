"use client";
import React, { useState } from "react";

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
    <div className=" w-full max-w-[1600px] mx-auto px-3 py-7 flex justify-end items-center gap-6">
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
          className="px-2 py-1 w-60 border border-gray-300 rounded-md focus:outline-blue-400 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
        />
        {isDepOpen && (
          <ul className="absolute left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-auto">
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dep, i) => (
                <li
                  key={i}
                  onClick={() => handleDepartmentSelect(dep)}
                  className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
                >
                  {dep}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-400 dark:text-gray-300">Sonuç bulunamadı</li>
            )}
          </ul>
        )}
      </div>

      {/* Select Admin */}
      <div className="relative w-40">
        <div
          onClick={() => setIsAdminOpen((prev) => !prev)}
          className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {selectedAdmin || "Admin"}
        </div>
        {isAdminOpen && (
          <ul className="absolute left-0 mt-1 w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-lg bg-white dark:bg-gray-800">
            {adminList.map((admin, i) => (
              <li
                key={i}
                onClick={() => handleAdminSelect(admin)}
                className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
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
