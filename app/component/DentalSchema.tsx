"use client";

import { useState } from "react";

type ToothData = {
  id: number;
  treatment?: string;
  note?: string;
};

const TREATMENTS = [
  "Dolgu",
  "Kanal Tedavisi",
  "Diş Çekimi",
  "İmplant",
  "Kuron-Köprü",
];

export default function DentalSchema() {
  const [selectedTooth, setSelectedTooth] = useState<ToothData | null>(null);
  const [teeth, setTeeth] = useState<ToothData[]>(
    Array.from({ length: 32 }, (_, i) => ({ id: i + 1 }))
  );

  const handleSave = () => {
    if (!selectedTooth) return;
    setTeeth((prev) =>
      prev.map((tooth) =>
        tooth.id === selectedTooth.id ? selectedTooth : tooth
      )
    );
    setSelectedTooth(null);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">Diş Şeması</h1>

      <div className="relative w-[600px]">
        <img src="/images/teeth.png" alt="Diş Şeması" />

        {/* Diş numaralarını görselin üstüne yerleştireceğiz */}
        <div className="absolute inset-0 flex flex-wrap">
          {teeth.map((tooth) => (
            <button
              key={tooth.id}
              className="w-10 h-10 m-1 text-xs bg-white/70 rounded-full hover:bg-blue-400"
              onClick={() => setSelectedTooth(tooth)}
            >
              {tooth.id}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedTooth && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-2">
              {selectedTooth.id}. Diş
            </h2>

            <label className="block mb-2">
              Tedavi:
              <select
                className="w-full border p-2 mt-1"
                value={selectedTooth.treatment || ""}
                onChange={(e) =>
                  setSelectedTooth({
                    ...selectedTooth,
                    treatment: e.target.value,
                  })
                }
              >
                <option value="">Seçiniz</option>
                {TREATMENTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-2">
              Not:
              <textarea
                className="w-full border p-2 mt-1"
                value={selectedTooth.note || ""}
                onChange={(e) =>
                  setSelectedTooth({
                    ...selectedTooth,
                    note: e.target.value,
                  })
                }
              />
            </label>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setSelectedTooth(null)}
              >
                İptal
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleSave}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
