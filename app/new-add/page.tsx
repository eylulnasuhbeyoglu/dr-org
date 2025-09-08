"use client";

import React, { useState } from "react";

export default function NewAddPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    tc: "",
    uyruk: "",
    birthDate: "",
    gender: "",
    passport: "",
    phone: "",
    email: "",
    address: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    chronicDisease: "",
    allergies: "",
    medications: "",
    surgeries: "",
    smoking: "",
    alcohol: "",
    pregnant: "",
    insuranceCompany: "",
    insuranceNumber: "",
    consent: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Yeni Hasta Kaydı:", formData);
    alert("Hasta kaydı alındı!");
  };

  // Borderlar ve focus için ortak class
  const inputClass =
    "border border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none";

  return (
    <div className="flex min-h-screen w-full bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}


      {/* İçerik */}
      <div className="flex-1 transition-all duration-300 p-4 md:p-6 max-w-[1200px] mx-auto w-full text-gray-800 dark:text-gray-100">
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-md mb-4">
          <h1 className="text-xl font-bold">🦷 Yeni Hasta Kayıt Kartı</h1>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Sol Sütun */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col justify-between">
            <div className="space-y-4 overflow-hidden">
              <h2 className="text-lg font-semibold border-b border-gray-200 pb-1">
                Kişisel Bilgiler
              </h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <input
                  type="text"
                  placeholder="Ad"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`${inputClass} dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100`}
                />
                <input
                  type="text"
                  placeholder="Soyad"
                  value={formData.surname}
                  onChange={(e) => handleChange("surname", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="TC Kimlik No"
                  value={formData.tc}
                  onChange={(e) => handleChange("tc", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Uyruk"
                  value={formData.uyruk}
                  onChange={(e) => handleChange("uyruk", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleChange("birthDate", e.target.value)}
                  className={inputClass}
                />
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Cinsiyet</option>
                  <option value="Kadın">Kadın</option>
                  <option value="Erkek">Erkek</option>
                </select>
                <input
                  type="text"
                  placeholder="Pasaport No"
                  value={formData.passport}
                  onChange={(e) => handleChange("passport", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Telefon"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder="E-posta"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`${inputClass} col-span-2`}
                />
                <textarea
                  placeholder="Adres"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className={`${inputClass} col-span-2`}
                  rows={2}
                />
              </div>

              <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mt-4">
                Acil Durum Bilgileri
              </h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <input
                  type="text"
                  placeholder="Kişi Adı"
                  value={formData.emergencyName}
                  onChange={(e) =>
                    handleChange("emergencyName", e.target.value)
                  }
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Yakınlık"
                  value={formData.emergencyRelation}
                  onChange={(e) =>
                    handleChange("emergencyRelation", e.target.value)
                  }
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Telefon"
                  value={formData.emergencyPhone}
                  onChange={(e) =>
                    handleChange("emergencyPhone", e.target.value)
                  }
                  className={`${inputClass} col-span-2`}
                />
              </div>
            </div>
          </div>

          {/* Sağ Sütun */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col justify-between">
            <div className="space-y-4 overflow-hidden">
              <h2 className="text-lg font-semibold border-b border-gray-200 pb-1">
                Anamnez
              </h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <input
                  type="text"
                  placeholder="Kronik Hastalıklar"
                  value={formData.chronicDisease}
                  onChange={(e) =>
                    handleChange("chronicDisease", e.target.value)
                  }
                  className={`${inputClass} col-span-2`}
                />
                <input
                  type="text"
                  placeholder="Alerjiler"
                  value={formData.allergies}
                  onChange={(e) => handleChange("allergies", e.target.value)}
                  className={`${inputClass} col-span-2`}
                />
                <input
                  type="text"
                  placeholder="Düzenli İlaçlar"
                  value={formData.medications}
                  onChange={(e) => handleChange("medications", e.target.value)}
                  className={`${inputClass} col-span-2`}
                />
                <input
                  type="text"
                  placeholder="Ameliyatlar / Operasyonlar"
                  value={formData.surgeries}
                  onChange={(e) => handleChange("surgeries", e.target.value)}
                  className={`${inputClass} col-span-2`}
                />
                <select
                  value={formData.smoking}
                  onChange={(e) => handleChange("smoking", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Sigara Kullanımı</option>
                  <option value="Evet">Evet</option>
                  <option value="Hayır">Hayır</option>
                </select>
                <select
                  value={formData.alcohol}
                  onChange={(e) => handleChange("alcohol", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Alkol Kullanımı</option>
                  <option value="Evet">Evet</option>
                  <option value="Hayır">Hayır</option>
                </select>
                <select
                  value={formData.pregnant}
                  onChange={(e) => handleChange("pregnant", e.target.value)}
                  className={`${inputClass} col-span-2`}
                >
                  <option value="">Hamilelik Durumu</option>
                  <option value="Evet">Evet</option>
                  <option value="Hayır">Hayır</option>
                </select>
              </div>

              <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mt-4">
                Sigorta Bilgileri
              </h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <input
                  type="text"
                  placeholder="Sigorta Şirketi"
                  value={formData.insuranceCompany}
                  onChange={(e) =>
                    handleChange("insuranceCompany", e.target.value)
                  }
                  className={`${inputClass} col-span-2`}
                />
                <input
                  type="text"
                  placeholder="Poliçe Numarası"
                  value={formData.insuranceNumber}
                  onChange={(e) =>
                    handleChange("insuranceNumber", e.target.value)
                  }
                  className={`${inputClass} col-span-2`}
                />
              </div>

              <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mt-4">
                Onam Formu
              </h2>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => handleChange("consent", e.target.checked)}
                />
                KVKK ve tedavi onam formunu okudum, onaylıyorum.
              </label>
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
