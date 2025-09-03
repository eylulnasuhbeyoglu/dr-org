"use client";

import React, { useState } from "react";
import Sidebar from "../component/Sidebar";

export default function NewAddPage() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Hasta bilgileri state
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [tc, setTc] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [chronicDisease, setChronicDisease] = useState("");
  const [allergies, setAllergies] = useState("");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [doctor, setDoctor] = useState("");
  const [treatment, setTreatment] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient = {
      name,
      surname,
      tc,
      birthDate,
      gender,
      phone,
      email,
      address,
      emergencyName,
      emergencyPhone,
      chronicDisease,
      allergies,
      appointmentDate,
      appointmentTime,
      doctor,
      treatment,
      notes,
    };
    console.log("Yeni Hasta Kaydedildi:", newPatient);
    alert("Hasta kaydı alındı! Konsolu kontrol et.");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 240 : 80 }}
      >
        <header className="bg-white shadow-md p-4 flex items-center">
          <h1 className="text-xl font-bold ml-3">Yeni Hasta Ekle</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Temel Hasta Bilgileri */}
            <div className="bg-white shadow-md rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4">Temel Hasta Bilgileri</h2>
              <div className="space-y-3">
                <input type="text" placeholder="Ad" value={name} onChange={(e) => setName(e.target.value)} className="border w-full rounded-md px-3 py-2" />
                <input type="text" placeholder="Soyad" value={surname} onChange={(e) => setSurname(e.target.value)} className="border w-full rounded-md px-3 py-2" />
                <input type="text" placeholder="TC Kimlik No" value={tc} onChange={(e) => setTc(e.target.value)} className="border w-full rounded-md px-3 py-2" />
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="border w-full rounded-md px-3 py-2" />
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="border w-full rounded-md px-3 py-2">
                  <option value="">Cinsiyet</option>
                  <option value="Kadın">Kadın</option>
                  <option value="Erkek">Erkek</option>
                </select>
                <input type="text" placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} className="border w-full rounded-md px-3 py-2" />
                <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} className="border w-full rounded-md px-3 py-2" />
                <textarea placeholder="Adres" value={address} onChange={(e) => setAddress(e.target.value)} className="border w-full rounded-md px-3 py-2" />
              </div>
            </div>

            {/* Acil ve Sağlık Bilgileri */}
            <div className="bg-white shadow-md rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4">Acil Durum & Sağlık Bilgileri</h2>
              <div className="space-y-3">
                <input type="text" placeholder="Acil Durum Kişisi" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} className="border w-full rounded-md px-3 py-2" />
                <input type="text" placeholder="Acil Durum Telefon" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} className="border w-full rounded-md px-3 py-2" />
                <input type="text" placeholder="Kronik Hastalıklar" value={chronicDisease} onChange={(e) => setChronicDisease(e.target.value)} className="border w-full rounded-md px-3 py-2" />
                <input type="text" placeholder="Alerjiler" value={allergies} onChange={(e) => setAllergies(e.target.value)} className="border w-full rounded-md px-3 py-2" />
              </div>
            </div>

            {/* Randevu & Tedavi Bilgileri */}
            <div className="bg-white shadow-md rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4">Randevu & Tedavi Bilgileri</h2>
              <div className="space-y-3">
                <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="border w-full rounded-md px-3 py-2" />
                <input type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} className="border w-full rounded-md px-3 py-2" />
                <input type="text" placeholder="Doktor" value={doctor} onChange={(e) => setDoctor(e.target.value)} className="border w-full rounded-md px-3 py-2" />
                <input type="text" placeholder="Tedavi" value={treatment} onChange={(e) => setTreatment(e.target.value)} className="border w-full rounded-md px-3 py-2" />
                <textarea placeholder="Notlar" value={notes} onChange={(e) => setNotes(e.target.value)} className="border w-full rounded-md px-3 py-2" />
              </div>
              <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-2 rounded">Kaydet</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
