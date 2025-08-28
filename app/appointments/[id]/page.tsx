"use client";
import React, { useMemo, useState } from "react";
//import "./globals.css";

/** ---------- Veri ---------- */
type Procedure = { tooth: number; treatment: string; note?: string };

const TREATMENTS = [
  "Dolgu (Kompozit)",
  "Kanal Tedavisi",
  "Diş Çekimi",
  "Yaprak Porselen",
  "Kuron-Köprü",
  "İmplant",
  "Diş Taşı Temizliği",
  "Fissür Örtücü",
  "Flor Uygulaması",
];

type ToothType = "incisor" | "canine" | "premolar" | "molar";

type Tooth = {
  id: number; // FDI 11-18, 21-28, 31-38, 41-48
  arch: "upper" | "lower";
  type: ToothType;
};

/** FDI numaralandırma sistemine göre dişleri oluşturur (11-18, 21-28, 31-38, 41-48) */
const buildTeeth = (): Tooth[] => {
  const mapType = (id: number): ToothType => {
    const toothNum = id % 10;
    if (toothNum <= 2) return "incisor";
    if (toothNum === 3) return "canine";
    if (toothNum === 4 || toothNum === 5) return "premolar";
    return "molar";
  };
  const quadrants = [1, 2, 3, 4];
  const teeth: Tooth[] = [];
  quadrants.forEach(quad => {
    for (let i = 1; i <= 8; i++) {
      const id = quad * 10 + i;
      const arch = quad <= 2 ? "upper" : "lower";
      teeth.push({ id, arch, type: mapType(id) });
    }
  });
  return teeth;
};

const TEETH: Tooth[] = buildTeeth();

/** ---------- SVG Diş Şekilleri ---------- */
const ToothShape: React.FC<{
  type: ToothType;
  fill: string;
  stroke?: string;
}> = ({ type, fill, stroke = "#111827" }) => {
  const common = { fill, stroke, strokeWidth: 1.2 };
  const getPath = (t: ToothType) => {
    if (t === "incisor") return "M30 4 20 4, 10 14, 10 26 10 36, 15 42, 18 50 20 56, 22 66, 26 72 28 75, 32 75, 34 72 38 66, 40 56, 42 50 45 42, 50 36, 50 26 50 14, 40 4, 30 4 Z";
    if (t === "canine") return "M30 6 C 20 8, 12 18, 12 30 C 12 40, 18 46, 22 56 C 24 60, 26 68, 28 74 C 29 77, 31 77, 32 74 C 34 68, 36 60, 38 56 C 42 46, 48 40, 48 30 C 48 18, 40 8, 30 6 Z";
    if (t === "premolar") return "M35 6 C 22 8, 12 18, 12 30 C 12 40, 18 46, 22 52 C 26 58, 30 64, 32 72 C 33 75, 37 75, 38 72 C 40 64, 44 58, 48 52 C 52 46, 58 40, 58 30 C 58 18, 48 8, 35 6 Z";
    return "M45 6 C 28 6, 15 18, 15 32 C 15 44, 23 52, 28 58 C 32 62, 34 68, 36 72 C 37 75, 41 76, 44 72 C 47 68, 50 62, 54 58 C 59 52, 75 44, 75 32 C 75 18, 62 6, 45 6 Z";
  };
  return <path d={getPath(type)} {...common} />;
};

/** ---------- Sayfa Bileşeni ---------- */
export default function ToothPlanningPage() {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<string>("");
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [hoverTooth, setHoverTooth] = useState<number | null>(null);

  const toothFill = (id: number) => {
    const isDone = procedures.some((p) => p.tooth === id);
    if (selectedTooth === id) return "#60a5fa"; // mavi (seçili)
    if (isDone) return "#34d399"; // yeşil (işlem var)
    return "#ffffff";
  };

  const handleToothClick = (id: number) => {
    setSelectedTooth(id);
    if (selectedTreatment) {
      const dup = procedures.find((p) => p.tooth === id && p.treatment === selectedTreatment);
      if (!dup) {
        setProcedures((s) => [...s, { tooth: id, treatment: selectedTreatment }]);
      }
    }
  };

  const removeProcedure = (idx: number) => {
    setProcedures((s) => s.filter((_, i) => i !== idx));
  };

  const clearAll = () => setProcedures([]);

  const upper = useMemo(() => TEETH.filter((t) => t.arch === "upper"), []);
  const lower = useMemo(() => TEETH.filter((t) => t.arch === "lower"), []);

  // FDI numarasına göre diş pozisyonlarını ve rotasyonlarını hesaplayan fonksiyon
  const getToothPosition = (id: number) => {
    const quadrant = Math.floor(id / 10);
    const toothNumber = id % 10;

    const positions = {
      1: [
        { x: 650, y: 55, r: 60 }, { x: 610, y: 35, r: 50 }, { x: 570, y: 15, r: 40 },
        { x: 530, y: 5, r: 30 }, { x: 490, y: 0, r: 15 }, { x: 450, y: 0, r: 5 },
        { x: 410, y: 0, r: 0 }, { x: 370, y: 0, r: 0 }
      ],
      2: [
        { x: 330, y: 0, r: 0 }, { x: 290, y: 0, r: 0 }, { x: 250, y: 0, r: -5 },
        { x: 210, y: 0, r: -15 }, { x: 170, y: 5, r: -30 }, { x: 130, y: 15, r: -40 },
        { x: 90, y: 35, r: -50 }, { x: 50, y: 55, r: -60 }
      ],
      3: [
        { x: 50, y: 220, r: 60 }, { x: 90, y: 200, r: 50 }, { x: 130, y: 180, r: 40 },
        { x: 170, y: 170, r: 30 }, { x: 210, y: 165, r: 15 }, { x: 250, y: 160, r: 5 },
        { x: 290, y: 160, r: 0 }, { x: 330, y: 160, r: 0 }
      ],
      4: [
        { x: 370, y: 160, r: 0 }, { x: 410, y: 160, r: 0 }, { x: 450, y: 165, r: -5 },
        { x: 490, y: 170, r: -15 }, { x: 530, y: 180, r: -30 }, { x: 570, y: 200, r: -40 },
        { x: 610, y: 220, r: -50 }, { x: 650, y: 240, r: -60 }
      ]
    };
    return positions[quadrant as keyof typeof positions][toothNumber - 1];
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sol Panel: Hasta Bilgileri ve Tedavi Menüsü */}
      <aside className="w-80 bg-gray-800 text-gray-100 p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Hasta Planlama</h2>
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">HASTA BİLGİLERİ</h3>
          <ul className="text-sm space-y-1">
            <li><span className="font-semibold">Adı:</span> Ali Rıza</li>
            <li><span className="font-semibold">Soyadı:</span> Yılmaz</li>
            <li><span className="font-semibold">Doğum Tarihi:</span> 01.01.1985</li>
          </ul>
        </div>
        <hr className="border-gray-700 mb-6" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">TEDAVİLER</h3>
          <ul className="space-y-2">
            {TREATMENTS.map((t) => (
              <li key={t}>
                <button
                  onClick={() => setSelectedTreatment(t)}
                  className={`w-full text-left py-2 px-3 rounded transition-colors ${
                    selectedTreatment === t ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                  }`}
                >
                  {t}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Orta Alan: Diş Şeması ve Ana Kontroller */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl font-bold">Tedavi Planlama</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Görüntüleme</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Kaydet</button>
          </div>
        </header>

        {/* Diş Şeması ve Planlama */}
        <div className="bg-white rounded-xl shadow p-4 relative mb-6">
          <h2 className="font-semibold mb-2">Diş Şeması (FDI)</h2>
          <div className="flex justify-center">
            <svg width="700" height="300" viewBox="0 0 700 300">
              {TEETH.map((t) => {
                const pos = getToothPosition(t.id);
                const isHovered = hoverTooth === t.id;
                const strokeColor = isHovered ? "#60a5fa" : "#111827";
                return (
                  <g
                    key={t.id}
                    transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.r}, 30, 40)`}
                    onMouseEnter={() => setHoverTooth(t.id)}
                    onMouseLeave={() => setHoverTooth(null)}
                    onClick={() => handleToothClick(t.id)}
                    className="cursor-pointer transition-transform duration-100 ease-in-out"
                  >
                    <ToothShape type={t.type} fill={toothFill(t.id)} stroke={strokeColor} />
                    <text
                      x="30"
                      y="88"
                      textAnchor="middle"
                      fontSize="12"
                      fill="#6b7280"
                      className="pointer-events-none"
                    >
                      {t.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="absolute top-20 left-4 text-sm font-semibold text-gray-700">Sağ</div>
          <div className="absolute top-20 right-4 text-sm font-semibold text-gray-700">Sol</div>
        </div>

        {/* Planlanan İşlemler ve Kontroller */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2">Planlanan İşlemler</h3>
          <div className="flex justify-end mb-4 space-x-2">
            <button className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600">Yeni İşlem</button>
            <button className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600" onClick={clearAll}>Tümünü Sil</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diş</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tedavi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notlar</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Eylemler</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {procedures.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      Henüz işlem eklenmedi.
                    </td>
                  </tr>
                ) : (
                  procedures.map((p, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.tooth}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.treatment}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {p.note || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => removeProcedure(i)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Sağ Panel: İşlem Detayları */}
      <aside className="w-96 bg-gray-100 border-l border-gray-200 p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Seçili İşlem Detayları</h2>
        {selectedTooth && selectedTreatment ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">Diş {selectedTooth}</h3>
            <p className="text-gray-700">Tedavi: <span className="font-medium">{selectedTreatment}</span></p>
            <textarea
              className="mt-4 w-full border rounded p-2 text-sm"
              rows={3}
              placeholder="Not ekle..."
            />
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Diş ve tedavi seçerek detayları görüntüleyin.
          </div>
        )}
      </aside>

    </div>
  );
}