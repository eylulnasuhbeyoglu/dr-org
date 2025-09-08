"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";

interface Patient {
  id: string;
  name: string;
  tcNo: string;
  phone: string;
  doctor: string;
  photo?: string;
  createdAt: string;
}

const HastaListesi = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("patients");
    if (saved) {
      setPatients(JSON.parse(saved));
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Bu hastayı silmek istediğinize emin misiniz?")) {
      const updated = patients.filter((p) => p.id !== id);
      setPatients(updated);
      localStorage.setItem("patients", JSON.stringify(updated));
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tcNo.includes(search)) &&
      (doctorFilter ? p.doctor === doctorFilter : true)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  

      {/* İçerik */}
      <main className="p-4 md:p-6 text-gray-800 dark:text-gray-100">
        <h2 className="text-2xl font-bold mb-5">Hasta Kayıt Listesi</h2>

        {/* Arama ve Filtre */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Hasta adı veya TC ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500"
          />
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500"
          >
            <option value="">Tüm Doktorlar</option>
            <option value="Dr. Ayşe Kaya">Dr. Ayşe Kaya</option>
            <option value="Dr. Mehmet Can">Dr. Mehmet Can</option>
            <option value="Dr. Selin Yıldız">Dr. Selin Yıldız</option>
          </select>
        </div>

        {/* Tablo */}
        <div className="overflow-x-auto shadow-md rounded-lg bg-white dark:bg-gray-800">
          <table className="w-full text-left border-collapse table-base">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                <th className="p-3">Fotoğraf</th>
                <th className="p-3">Ad Soyad</th>
                <th className="p-3">TC Kimlik</th>
                <th className="p-3 hidden sm:table-cell">Telefon</th>
                <th className="p-3 hidden md:table-cell">Doktor</th>
                <th className="p-3 hidden lg:table-cell">Kayıt Tarihi</th>
                <th className="p-3 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {p.photo ? (
                      <img
                        src={p.photo}
                        alt="Hasta"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center text-white">
                        {p.name.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.tcNo}</td>
                  <td className="p-3 hidden sm:table-cell">{p.phone}</td>
                  <td className="p-3 hidden md:table-cell">{p.doctor}</td>
                  <td className="p-3 hidden lg:table-cell">{new Date(p.createdAt).toLocaleDateString("tr-TR")}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => alert(JSON.stringify(p, null, 2))}
                      className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      Detay
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">
                    Kayıt bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default HastaListesi;
