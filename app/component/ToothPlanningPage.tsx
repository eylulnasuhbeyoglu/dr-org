"use client";
import React, { useState } from "react";
import ImageTooth, { ToothType } from "./ImageTooth";

export type Procedure = { tooth: number; treatment: string; note?: string; doctor: string };
export type Tooth = { id: number; arch: "upper" | "lower"; type: ToothType };

interface ToothPlanningPageProps {
  patient: { id: string; name: string; surname: string };
}

const DEPARTMENTS: Record<string, string[]> = {
  "Endodonti": ["Kanal Tedavisi"],
  "Ortodonti": ["Ortodontik Tedavi"], 
  "Periodontoloji": ["Diş Taşı Temizliği", "Fissür Örtücü", "Flor Uygulaması"],
  "Protez / Restoratif": ["Dolgu (Kompozit)", "Yaprak Porselen", "Kuron-Köprü", "İmplant"],
  "Cerrahi Tedavi": ["Diş Çekimi"],
  "Pedodonti": ["Çocuk Dolgusu", "Çocuk Kanal Tedavisi"]
};
const DOCTORS = ["Dr. Ahmet", "Dr. Ayşe", "Dr. Mehmet"];

const buildTeeth = (): Tooth[] => {
  const mapType = (id: number): ToothType => {
    if ([1,2,3,4].includes(id % 10)) return "incisor";
    if ([5,6].includes(id % 10)) return "canine";
    if ([7,8].includes(id % 10)) return "premolar";
    return "molar";
  };
  const quadrants = [1, 2, 3, 4];
  const teeth: Tooth[] = [];
  quadrants.forEach((quad) => {
    for (let i = 1; i <= 8; i++) {
      const id = quad * 10 + i;
      const arch = quad <= 2 ? "upper" : "lower";
      teeth.push({ id, arch, type: mapType(id) });
    }
  });
  return teeth;
};
const TEETH = buildTeeth();

export default function ToothPlanningPage({ patient }: ToothPlanningPageProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [openDepartments, setOpenDepartments] = useState<Record<string, boolean>>({});

  const handleToothClick = (id: number) => {
    setSelectedTooth(id);
    if (!selectedTreatment || !selectedDoctor) return;
    const exists = procedures.find(p => p.tooth === id && p.treatment === selectedTreatment);
    if (!exists) setProcedures(s => [...s, { tooth: id, treatment: selectedTreatment, note, doctor: selectedDoctor }]);
  };

  const removeProcedure = (idx: number) => setProcedures(s => s.filter((_, i) => i !== idx));

  const getToothPosition = (id: number) => {
    const quadrant = Math.floor(id / 10);
    let toothNumber = id % 10;
    if (toothNumber === 0) toothNumber = 8;
    const spacing = 50, yUpper = 50, yLower = 200;
    if (quadrant === 1) return { x: 50 + (8 - toothNumber) * spacing, y: yUpper };
    if (quadrant === 2) return { x: 450 + (toothNumber - 1) * spacing, y: yUpper };
    if (quadrant === 3) return { x: 50 + (8 - toothNumber) * spacing, y: yLower };
    if (quadrant === 4) return { x: 450 + (toothNumber - 1) * spacing, y: yLower };
    return { x: 0, y: 0 };
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-80 bg-gray-800 text-gray-100 p-6 flex flex-col overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Hasta Planlama</h2>
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">HASTA BİLGİLERİ</h3>
          <ul className="text-sm space-y-1">
            <li><span className="font-semibold">Adı:</span> {patient.name}</li>
            <li><span className="font-semibold">Soyadı:</span> {patient.surname}</li>
          </ul>
        </div>
        <hr className="border-gray-700 mb-6" />
        {Object.entries(DEPARTMENTS).map(([dept, treatments]) => {
          const isOpen = openDepartments[dept];
          return (
            <div key={dept} className="mb-3">
              <button
                onClick={() => setOpenDepartments(prev => ({ ...prev, [dept]: !prev[dept] }))}
                className="w-full text-left py-2 px-3 bg-gray-700 rounded flex justify-between items-center"
              >
                <span>{dept}</span>
                <span>{isOpen ? "▲" : "▼"}</span>
              </button>
              {isOpen && (
                <ul className="mt-1 ml-2 space-y-1">
                  {treatments.map(t => (
                    <li key={t}>
                      <button
                        onClick={() => setSelectedTreatment(t)}
                        className={`w-full text-left py-1 px-2 rounded text-sm ${selectedTreatment === t ? "bg-blue-600 text-white" : "hover:bg-gray-600"}`}
                      >{t}</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Hekim Seç</h3>
          <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} className="w-full border rounded p-2 text-sm bg-gray-50 text-gray-900">
            <option value="">-- Hekim Seç --</option>
            {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Not Ekle</h3>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full border rounded p-2 text-sm" rows={3} placeholder="Not ekle..." />
        </div>
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Tedavi Planlama</h1>
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h2 className="font-semibold mb-2">Diş Şeması (FDI)</h2>
          <div className="flex justify-center">
            <svg width="1000" height="300" viewBox="0 0 700 300">
              {TEETH.map(t => {
                const pos = getToothPosition(t.id);
                return (
                  <g key={t.id} transform={`translate(${pos.x}, ${pos.y})`} onClick={() => handleToothClick(t.id)} className="cursor-pointer">
                    <ImageTooth type={t.type} />
                    <text x="30" y="88" textAnchor="middle" fontSize="17" fill="#6b7280">{t.id}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2">Planlanan İşlemler</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th>Diş</th>
                  <th>Tedavi</th>
                  <th>Hekim</th>
                  <th>Not</th>
                  <th>Eylemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {procedures.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-sm text-gray-500">Henüz işlem eklenmedi.</td></tr>
                ) : procedures.map((p,i) => (
                  <tr key={i}>
                    <td>{p.tooth}</td>
                    <td>{p.treatment}</td>
                    <td>{p.doctor}</td>
                    <td>{p.note || "—"}</td>
                    <td><button className="text-red-600" onClick={() => removeProcedure(i)}>Sil</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
