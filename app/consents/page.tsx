"use client";

import React, { useRef, useState } from "react";

type ConsentTemplate = {
  id: string;
  title: string;
  content: string;
  info: string;
};

// Hazır formlar
const forms: ConsentTemplate[] = [
  {
    id: "cerrahi",
    title: "Cerrahi Onam Formu",
    content: `Bu form, diş çekimi, implant ve gömülü diş operasyonları gibi cerrahi işlemleri kapsamaktadır.
Hasta bilgilendirilmiş ve onay vermiştir.`,
    info: `Komplikasyonlar ve bilgilendirme:
- Kanama, şişlik ve morarma olabilir
- Nadiren sinir hasarı oluşabilir
- Enfeksiyon riski vardır
- İşlem sonrası ağrı olabilir
- Doktorun önerilerine uyulmalıdır`,
  },
  {
    id: "kanal",
    title: "Endodonti (Kanal Tedavisi) Onam Formu",
    content: `Bu form, kanal tedavisinin amacı, süreci ve olası başarısızlık risklerini kapsamaktadır.
Hasta bilgilendirilmiş ve onay vermiştir.`,
    info: `Komplikasyonlar ve bilgilendirme:
- İşlem sonrası hassasiyet olabilir
- Nadiren kanal dolumu yetersiz olabilir, tekrar tedavi gerekebilir
- Diş çekimi gerekebilir
- Enfeksiyon riski vardır
- Tedavi süresi dişe ve komplikasyona göre değişebilir`,
  },
  {
    id: "ortodonti",
    title: "Ortodonti Onam Formu",
    content: `Bu form, ortodontik tedavi (tel, şeffaf plak vb.) süreçlerini kapsamaktadır.
Hasta bilgilendirilmiş ve onay vermiştir.`,
    info: `Komplikasyonlar ve bilgilendirme:
- Dişlerde hafif ağrı veya hassasiyet görülebilir
- Diş etlerinde hassasiyet oluşabilir
- Tedavi süresi uzayabilir (kontrol aksaması, uyumsuzluk)
- Nadiren tel veya aparey kırılabilir
- Konuşma veya yeme alışkanlıklarında geçici değişiklikler olabilir`,
  },
];

export default function ConsentsPage() {
  const [active, setActive] = useState<ConsentTemplate | null>(null);
  const [patientId, setPatientId] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  const handleSignStart = () => setIsSigning(true);
  const handleSignEnd = () => setIsSigning(false);
  const handleSignMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSigning) return;
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearSignature = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
  };

  const exportPDF = () => {
    alert(
      `PDF oluşturulacak:\nHasta ID: ${patientId}\nForm: ${active?.title}\nİmza + içerik export edilecek`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Üst Seçenek Bar */}
      <header className="bg-blue-900 text-white px-6 py-3 flex space-x-4">
        {forms.map((form) => (
          <button
            key={form.id}
            onClick={() => setActive(form)}
            className={`px-4 py-2 rounded font-semibold ${
              active?.id === form.id ? "bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {form.title}
          </button>
        ))}
      </header>

      {/* Form Detayı */}
      <main className="p-6">
        {active ? (
          <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
            <h2 className="font-semibold mb-2">{active.title}</h2>

            {/* Form İçeriği */}
            <textarea
              value={active.content}
              onChange={(e) =>
                setActive({ ...active, content: e.target.value })
              }
              rows={6}
              className="w-full border rounded px-3 py-2 mb-3 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            />

            {/* Bilgilendirme */}
            <div className="bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded p-3 mb-4 text-sm text-gray-700 dark:text-gray-300">
              <strong>Bilgilendirme / Komplikasyonlar:</strong>
              <pre className="whitespace-pre-wrap">{active.info}</pre>
            </div>

            {/* Hasta ID, PDF, İmza */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <input
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Hasta ID"
                className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={exportPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                PDF İndir (stub)
              </button>
              <button
                onClick={clearSignature}
                className="px-4 py-2 border rounded"
              >
                İmzayı Temizle
              </button>
            </div>

            {/* İmza Alanı */}
            <div>
              <div className="text-sm text-gray-500 mb-2">Hasta İmzası</div>
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="border dark:border-gray-700 rounded w-full max-w-full bg-white dark:bg-gray-900"
                onMouseDown={handleSignStart}
                onMouseUp={handleSignEnd}
                onMouseLeave={handleSignEnd}
                onMouseMove={handleSignMove}
              />
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center mt-10">
            Lütfen üstteki seçeneklerden bir form seçiniz.
          </div>
        )}
      </main>
    </div>
  );
}
