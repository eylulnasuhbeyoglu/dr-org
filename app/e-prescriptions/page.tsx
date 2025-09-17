"use client";

import React, { useEffect, useMemo, useState } from "react";

type Drug = { name: string; dose: string; usage: string };

export default function EPrescriptionsPage() {
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [drug, setDrug] = useState<Drug>({ name: "", dose: "", usage: "" });
  const [config, setConfig] = useState<{ endpoint: string; apiKey: string }>({ endpoint: "", apiKey: "" });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "sent" | "error">("draft");

  useEffect(() => {
    const saved = localStorage.getItem("ereceteConfig");
    if (saved) setConfig(JSON.parse(saved));
  }, []);

  const addDrug = () => {
    if (!drug.name.trim()) return;
    setDrugs((s) => [...s, drug]);
    setDrug({ name: "", dose: "", usage: "" });
  };

  const sendPrescription = async () => {
    // Stub: entegrasyon noktası
    setStatus("sent");
    alert(`Reçete gönderildi (stub)\nHasta: ${patientId}\nHekim: ${doctorId}\nİlaçlar: ${drugs.length}`);
  };

  useEffect(() => {
    // Basit autocomplete örnek verisi
    const all = ["Paracetamol 500mg", "Ibuprofen 200mg", "Amoxicillin 500mg", "Metronidazole 250mg", "Chlorhexidine Gargara"];
    if (!drug.name) { setSuggestions([]); return; }
    setSuggestions(all.filter(x => x.toLowerCase().includes(drug.name.toLowerCase())).slice(0, 5));
  }, [drug.name]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">E-Reçete (Reçetem) Entegrasyonu</h1>

      <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input value={patientId} onChange={e => setPatientId(e.target.value)} placeholder="Hasta ID" className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
        <input value={doctorId} onChange={e => setDoctorId(e.target.value)} placeholder="Hekim ID" className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
        <button onClick={sendPrescription} className="px-4 py-2 bg-blue-600 text-white rounded">Reçeteyi Gönder</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        <input value={drug.name} onChange={e => setDrug({ ...drug, name: e.target.value })} placeholder="İlaç Adı" className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
        {suggestions.length > 0 && (
          <div className="absolute z-10 mt-12 w-full md:w-1/4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow">
            {suggestions.map(s => (
              <button key={s} className="block w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setDrug({ ...drug, name: s })}>{s}</button>
            ))}
          </div>
        )}
        <input value={drug.dose} onChange={e => setDrug({ ...drug, dose: e.target.value })} placeholder="Doz" className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
        <input value={drug.usage} onChange={e => setDrug({ ...drug, usage: e.target.value })} placeholder="Kullanım" className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
        <button onClick={addDrug} className="px-4 py-2 border rounded">Ekle</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded shadow overflow-x-auto mb-6">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-100">İlaç</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-100">Doz</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-100">Kullanım</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {drugs.map((d, i) => (
              <tr key={i}>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{d.name}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{d.dose}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{d.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
        <h2 className="font-semibold mb-2">Entegrasyon Ayarları</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={config.endpoint} onChange={e => setConfig({ ...config, endpoint: e.target.value })} placeholder="API Endpoint" className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
          <input value={config.apiKey} onChange={e => setConfig({ ...config, apiKey: e.target.value })} placeholder="API Key" className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
          <button onClick={() => localStorage.setItem("ereceteConfig", JSON.stringify(config))} className="px-4 py-2 border dark:border-gray-600 rounded">Kaydet</button>
        </div>
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">Durum: {status === "draft" ? "Taslak" : status === "sent" ? "Gönderildi" : "Hata"}</div>
      </div>
    </div>
  );
}


