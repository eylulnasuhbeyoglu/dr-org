"use client";

import React, { useState } from "react";

/** ---------- Tipler ---------- */
type Procedure = { 
  tooth: number; 
  treatment: string; 
  note?: string; 
  doctor: string;
  date: string;   // ✅ Tarih eklendi
};
type ToothType = "incisor" | "canine" | "premolar" | "molar";
type Tooth = { id: number; arch: "upper" | "lower"; type: ToothType };

/** ---------- Tedavi ve Departmanlar ---------- */
const DEPARTMENTS: Record<string, string[]> = {
  "Endodonti": ["Kanal Tedavisi"],
  "Ortodonti": ["Ortodontik Tedavi"], 
  "Periodontoloji": ["Diş Taşı Temizliği", "Fissür Örtücü", "Flor Uygulaması"],
  "Protez / Restoratif": ["Dolgu (Kompozit)", "Yaprak Porselen", "Kuron-Köprü", "İmplant"],
  "Cerrahi Tedavi": ["Diş Çekimi"],
  "Pedodonti": ["Çocuk Dolgusu", "Çocuk Kanal Tedavisi"]
};

const DOCTORS = ["Dr. Ahmet", "Dr. Ayşe", "Dr. Mehmet"];

/** ---------- Dişleri Oluştur ---------- */
const buildTeeth = (): Tooth[] => {
  const mapType = (id: number): ToothType => {
    const toothNum = id % 10;
    if (toothNum <= 2) return "incisor";
    if (toothNum === 3) return "canine";
    if (toothNum === 3 || toothNum === 3) return "premolar";
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
const TEETH: Tooth[] = buildTeeth();

/** ---------- Diş Görselleri ---------- */
const TOOTH_IMAGES: Record<ToothType, string> = {
  incisor: "/teeth/incisor.png",
  canine: "/teeth/canine.png",
  premolar: "/teeth/premolar.png",
  molar: "/teeth/molar.png",
};

const ImageTooth: React.FC<{ type: ToothType; width?: number; height?: number }> = ({
  type,
  width = 60,
  height = 60,
}) => {
  const src = TOOTH_IMAGES[type];
  return <image href={src} width={width} height={height} />;
};

/** ---------- Sayfa Bileşeni ---------- */
export default function ToothPlanningPage() {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [openDepartments, setOpenDepartments] = useState<Record<string, boolean>>({});

  /** Diş konumları */
  const getToothPosition = (id: number) => {
    const quadrant = Math.floor(id / 10);
    let toothNumber = id % 10;
    if (toothNumber === 0) toothNumber = 8;
  
    const spacing = 50;
    const yUpper = 50;
    const yLower = 200;
  
    if (quadrant === 1) return { x: 50 + (8 - toothNumber) * spacing, y: yUpper, r: 0 };
    if (quadrant === 2) return { x: 450 + (toothNumber - 1) * spacing, y: yUpper, r: 0 };
    if (quadrant === 3) return { x: 50 + (8 - toothNumber) * spacing, y: yLower, r: 0 };
    if (quadrant === 4) return { x: 450 + (toothNumber - 1) * spacing, y: yLower, r: 0 };
  
    return { x: 0, y: 0, r: 0 };
  };

  /** Diş tıklama → işlem ekleme */
  const handleToothClick = (id: number) => {
    setSelectedTooth(id);
    if (!selectedTreatment || !selectedDoctor) return;

    const exists = procedures.find(
      (p) => p.tooth === id && p.treatment === selectedTreatment
    );
    if (!exists) {
      setProcedures((s) => [
        ...s,
        { 
          tooth: id, 
          treatment: selectedTreatment, 
          note, 
          doctor: selectedDoctor,
          date: new Date().toISOString()   // ✅ tarih ekleme
        },
      ]);
      setNote("");
      setSelectedTooth(null);
    }
  };

  const removeProcedure = (idx: number) => setProcedures((s) => s.filter((_, i) => i !== idx));
  const clearAll = () => setProcedures([]);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 flex-col md:flex-row">

      {/* Sol Panel */}
      <aside className="w-full md:w-80 bg-gray-800 text-gray-100 p-4 md:p-6 flex flex-col overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Hasta Planlama</h2>

        {/* Hasta Bilgileri */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">HASTA BİLGİLERİ</h3>
          <ul className="text-sm space-y-1">
            <li><span className="font-semibold">Adı:</span> Ali Rıza</li>
            <li><span className="font-semibold">Soyadı:</span> Yılmaz</li>
            <li><span className="font-semibold">Doğum Tarihi:</span> 01.01.1985</li>
          </ul>
        </div>

        <hr className="border-gray-700 mb-6" />

        {/* Tedavi Seçimi */}
        {Object.entries(DEPARTMENTS).map(([dept, treatments]) => {
          const isOpen = openDepartments[dept];
          return (
            <div key={dept} className="mb-3">
              <button
                onClick={() =>
                  setOpenDepartments((prev) => ({ ...prev, [dept]: !prev[dept] }))
                }
                className="w-full text-left py-2 px-3 bg-gray-700 rounded flex justify-between items-center"
              >
                <span>{dept}</span>
                <span>{isOpen ? "▲" : "▼"}</span>
              </button>
              {isOpen && (
                <ul className="mt-1 ml-2 space-y-1">
                  {treatments.map((t) => (
                    <li key={t}>
                      <button
                        onClick={() => setSelectedTreatment(t)}
                        className={`w-full text-left py-1 px-2 rounded text-sm ${
                          selectedTreatment === t ? "bg-blue-600 text-white" : "hover:bg-gray-600"
                        }`}
                      >
                        {t}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}

        {/* Hekim Seç */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Hekim Seç</h3>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full border rounded p-2 text-sm bg-gray-50 text-gray-900"
          >
            <option value="">-- Hekim Seç --</option>
            {DOCTORS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Not */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Not Ekle</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border rounded p-2 text-sm"
            rows={3}
            placeholder="Not ekle..."
          />
        </div>
      </aside>

      {/* Orta Alan: Diş Şeması */}
      <main className="flex-1 p-4 md:p-6 text-gray-800 dark:text-gray-100">
        <h1 className="text-2xl font-bold mb-6">Tedavi Planlama</h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6 overflow-x-auto">
          <h2 className="font-semibold mb-2">Diş Şeması (FDI)</h2>
          <div className="flex justify-center">
            <svg width="1000" height="300" viewBox="0 0 700 300">
              {TEETH.map((t) => {
                const pos = getToothPosition(t.id);
                return (
                  <g
                    key={t.id}
                    transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.r}, 30, 40)`}
                    onClick={() => handleToothClick(t.id)}
                    className="cursor-pointer transition-transform duration-100 ease-in-out"
                  >
                    <ImageTooth type={t.type} />
                    <text x="30" y="88" textAnchor="middle" fontSize="17" fill="#6b7280">{t.id}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Planlanan İşlemler */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2">Planlanan İşlemler</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diş</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tedavi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hekim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Not</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                  <th className="px-6 py-3 relative"><span className="sr-only">Eylemler</span></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {procedures.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      Henüz işlem eklenmedi.
                    </td>
                  </tr>
                ) : procedures.map((p, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{p.tooth}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{p.treatment}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{p.doctor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{p.note || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {new Date(p.date).toLocaleDateString("tr-TR", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => removeProcedure(i)} className="text-red-600 hover:text-red-900">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Tümünü Sil
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
