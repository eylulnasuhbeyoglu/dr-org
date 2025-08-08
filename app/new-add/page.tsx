// app/yenihasta/page.tsx
"use client";

import React, { useState } from "react";

const YeniHastaPage = () => {
  const [name, setName] = useState("");
  const [surname, setsurName] = useState("");
  const [tc, setTc] = useState("");
  const [email, setEmail] = useState("");
  const [adress, setAdress] = useState("");
  const [phone, setPhone] = useState("");
 
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Yeni hasta eklendi:\nİsim: ${name}\nEmail: ${email}\nTelefon: ${phone}`);
    // Burada API çağrısı veya state güncelleme yapılabilir
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Yeni Hasta Ekle</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          İsim:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
        </label>

        <label className="flex flex-col">
          Soyisim:
          <input
            type="surname"
            value={surname}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
        </label>

        <label className="flex flex-col">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
        </label>

        <label className="flex flex-col">
          Telefon:
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col">
        Tc No:
          <input
            type="tc"
            value={tc}
            onChange={(e) => setTc(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col">
          Adress
          <input
            type="adres"
            value={adress}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col">
          Telefon:
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
        </label>


        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Hasta Ekle
        </button>
      </form>
    </div>
  );
};

export default YeniHastaPage;
