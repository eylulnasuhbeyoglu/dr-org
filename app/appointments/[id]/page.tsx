"use client";

import React, { useEffect, useState } from "react";

/** ---------- Tipler ---------- */
type Procedure = {
  tooth: number;
  treatment: string;
  note?: string;
  doctor: string;
  date: string;
  price?: number;
  patientName?: string;
};
type ToothType = "incisor" | "canine" | "premolar" | "molar";
type Tooth = { id: number; arch: "upper" | "lower"; type: ToothType };

type Plan = {
  id: number;
  createdAt: string;
  doctor: string;
  procedures: Procedure[];
};

/** ---------- Tedavi ve Departmanlar ---------- */
const DEPARTMENTS: Record<string, string[]> = {
  Endodonti: ["Kanal Tedavisi"],
  Ortodonti: ["Ortodontik Tedavi"],
  Periodontoloji: ["Diş Taşı Temizliği", "Fissür Örtücü", "Flor Uygulaması"],
  "Protez / Restoratif": ["Dolgu (Kompozit)", "Yaprak Porselen", "Kuron-Köprü", "İmplant"],
  "Cerrahi Tedavi": ["Diş Çekimi"],
  Pedodonti: ["Çocuk Dolgusu", "Çocuk Kanal Tedavisi"],
};
const DOCTORS = ["Dr. Ahmet", "Dr. Ayşe", "Dr. Mehmet"];

/** ---------- Dişleri Oluştur ---------- */
const buildTeeth = (): Tooth[] => {
  const mapType = (id: number): ToothType => {
    const toothNum = id % 10;
    if (toothNum <= 2) return "incisor";
    if (toothNum === 3) return "canine";
    if (toothNum <= 5) return "premolar";
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
}) => <image href={TOOTH_IMAGES[type]} width={width} height={height} />;

/** ---------- Yardımcı Fonksiyonlar ---------- */
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/** ---------- Tek Planlama Sayfası (Component) ---------- */
interface ToothPlanningPageProps {
  plan: Plan;
  setPlanDoctor: (planId: number, doctor: string) => void;
  addProcedureToPlan: (planId: number, procedure: Procedure) => void;
  removeProcedureFromPlan: (planId: number, idx: number) => void;
  markPlanProceduresAsCompleted: (planId: number) => void;
}

function ToothPlanningPage({
  plan,
  setPlanDoctor,
  addProcedureToPlan,
  removeProcedureFromPlan,
  markPlanProceduresAsCompleted,
  updateProcedureInPlan,
  allPlans,
  moveProcedures,
  darkMode,
}: ToothPlanningPageProps & {
  updateProcedureInPlan: (planId: number, idx: number, updated: Partial<Procedure>) => void;
  allPlans: Plan[];
  moveProcedures: (fromPlanId: number, toPlanId: number, indexes: number[]) => void;
  darkMode: boolean;
}) {
  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(plan.doctor || "");
  const [note, setNote] = useState("");
  const [openDepartments, setOpenDepartments] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editPatientName, setEditPatientName] = useState<string>("");
  const [editPrice, setEditPrice] = useState<string>("");
  const [editTreatment, setEditTreatment] = useState<string>("");
  const [editNote, setEditNote] = useState<string>("");
  const [editDate, setEditDate] = useState<string>("");
  const currentPatientName = "Eylül Yılmaz";

  const toDateInputValue = (iso: string) => {
    try {
      const d = new Date(iso);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return "";
    }
  };

  // Selection for transfer
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const allSelected = selectedRows.size > 0 && selectedRows.size === plan.procedures.length;
  const toggleRow = (idx: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };
  const toggleAll = () => {
    if (allSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(plan.procedures.map((_, i) => i)));
    }
  };
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferTarget, setTransferTarget] = useState<number | null>(null);

  useEffect(() => {
    setSelectedDoctor(plan.doctor || "");
  }, [plan.id, plan.doctor]);

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

  const handleToothClick = (id: number) => {
    if (!selectedTreatment || !selectedDoctor) {
      alert("Lütfen önce tedavi ve hekim seçin.");
      return;
    }
    const newProcedure: Procedure = {
      tooth: id,
      treatment: selectedTreatment,
      note: note || undefined,
      doctor: selectedDoctor,
      date: new Date().toISOString(),
    };
    addProcedureToPlan(plan.id, newProcedure);
    setNote("");
  };

  return (
    <div className={`flex min-h-[60vh] flex-col md:flex-row mb-10 rounded ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      {/* Sol Panel */}
      <aside className={`w-full md:w-80 p-4 md:p-6 flex flex-col overflow-y-auto ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"}`}>
        <h2 className="text-xl font-bold mb-4 text-center">{`Hasta: ${currentPatientName}`}</h2>

        {/* İşlemler */}
        <div className="flex-1 mb-4 overflow-y-auto">
          <h3 className={`text-sm font-semibold mb-2 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>Tedavi Seçimi</h3>
          {Object.entries(DEPARTMENTS).map(([dept, treatments]) => {
            const isOpen = openDepartments[dept];
            return (
              <div key={dept} className="mb-2">
                <button
                  onClick={() => setOpenDepartments((prev) => ({ ...prev, [dept]: !prev[dept] }))}
                  className={`w-full text-left py-2 px-3 rounded flex justify-between items-center ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
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
                            selectedTreatment === t
                              ? "bg-blue-600 text-white"
                              : darkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-200"
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
        </div>

        {/* Hekim Seçimi */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-1">Hekim</h3>
          <select
            value={selectedDoctor}
            onChange={(e) => {
              setSelectedDoctor(e.target.value);
              setPlanDoctor(plan.id, e.target.value);
            }}
            className={`w-full border rounded p-2 text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
          >
            <option value="">-- Hekim Seç --</option>
            {DOCTORS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Not */}
        <div className="mt-auto">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Not Ekle</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={`w-full border rounded p-2 text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
            rows={3}
            placeholder="Dişe özel not..."
          />
        </div>
      </aside>

      {/* Orta Alan */}
      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4">Tedavi Planlama - Plan #{plan.id}</h1>

        {/* Diş Şeması */}
        <div className={`bg-white rounded-xl shadow p-4 mb-6 overflow-x-auto ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"}`}>
          <h2 className="font-semibold mb-2">Diş Şeması (FDI)</h2>
          <div className="flex justify-center">
            <svg width="1000" height="300" viewBox="0 0 700 300">
              {TEETH.map((t) => {
                const pos = getToothPosition(t.id);
                return (
                  <g
                    key={t.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => handleToothClick(t.id)}
                    className="cursor-pointer"
                  >
                    <ImageTooth type={t.type} />
                    <text x="30" y="88" textAnchor="middle" fontSize="17" fill={darkMode ? "#D1D5DB" : "#6b7280"}>
                      {t.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Planlanan İşlemler */}
        <div className={`rounded-xl shadow p-4 ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Planlanan İşlemler</h3>
            <button
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              disabled={selectedRows.size === 0}
              onClick={() => setTransferOpen(true)}
            >
              Aktar
            </button>
          </div>
          {plan.procedures.length === 0 ? (
            <p className="text-gray-500 text-sm">Henüz işlem eklenmedi.</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="min-w-[980px]">
                <div className={`grid grid-cols-8 gap-2 px-3 py-2 text-sm font-semibold rounded ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <div><input type="checkbox" checked={allSelected} onChange={toggleAll} /></div>
                  <div>Tarih</div>
                  <div>Diş No</div>
                  <div>Tedavi</div>
                  <div>Hekim</div>
                  <div>Not</div>
                  <div>Fiyat (₺)</div>
                  <div className="text-right">İşlem</div>
                </div>
                <ul className="divide-y divide-gray-200">
                  {plan.procedures.map((p, i) => (
                    <li
                      key={i}
                      className={`grid grid-cols-8 gap-2 items-center px-3 py-2 hover:bg-gray-50 cursor-pointer ${darkMode ? "hover:bg-gray-700" : ""}`}
                      onClick={() => {
                        setEditIndex(i);
                        setEditPrice(p.price != null ? String(p.price) : "");
                        setEditTreatment(p.treatment || "");
                        setEditNote(p.note || "");
                        setEditDate(toDateInputValue(p.date));
                        setModalOpen(true);
                      }}
                    >
                      <div className="text-sm" onClick={(e) => { e.stopPropagation(); toggleRow(i); }}>
                        <input type="checkbox" checked={selectedRows.has(i)} onChange={() => toggleRow(i)} />
                      </div>
                      <div className="text-sm">{formatDate(p.date)}</div>
                      <div className="text-sm">{p.tooth}</div>
                      <div className="text-sm">{p.treatment}</div>
                      <div className="text-sm">{p.doctor}</div>
                      <div className="text-sm truncate" title={p.note}>{p.note || "—"}</div>
                      <div className="text-sm">{p.price != null ? `${p.price}` : "—"}</div>
                      <div className="text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); removeProcedureFromPlan(plan.id, i); }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >Sil</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/** ---------- Ana Component ---------- */
export default function PatientPlans() {
  const [plans, setPlans] = useState<Plan[]>(() => [
    { id: 1, createdAt: new Date().toISOString(), doctor: "", procedures: [] },
  ]);
  const [activePlanId, setActivePlanId] = useState<number>(1);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const addPlan = () => {
    const newId = plans.length > 0 ? Math.max(...plans.map((p) => p.id)) + 1 : 1;
    const newPlan: Plan = { id: newId, createdAt: new Date().toISOString(), doctor: "", procedures: [] };
    setPlans((prev) => [...prev, newPlan]);
    setActivePlanId(newId);
  };

  const updateProcedureInPlan = (planId: number, idx: number, updated: Partial<Procedure>) => {
    setPlans((prev) => prev.map((p) => {
      if (p.id !== planId) return p;
      const newProcedures = p.procedures.map((proc, i) => i === idx ? { ...proc, ...updated } : proc);
      return { ...p, procedures: newProcedures };
    }));
  };

  const setPlanDoctor = (planId: number, doctor: string) => {
    setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, doctor } : p)));
  };

  const addProcedureToPlan = (planId: number, procedure: Procedure) => {
    setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, procedures: [...p.procedures, procedure] } : p)));
  };

  const removeProcedureFromPlan = (planId: number, idx: number) => {
    setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, procedures: p.procedures.filter((_, i) => i !== idx) } : p)));
  };

  const markPlanProceduresAsCompleted = (planId: number) => {
    console.log("Mark as completed", planId);
  };

  const moveProcedures = (fromPlanId: number, toPlanId: number, indexes: number[]) => {
    const fromPlan = plans.find((p) => p.id === fromPlanId);
    const toPlan = plans.find((p) => p.id === toPlanId);
    if (!fromPlan || !toPlan) return;
    const moving = indexes.map((i) => fromPlan.procedures[i]);
    setPlans((prev) => prev.map((p) => {
      if (p.id === fromPlanId) {
        return { ...p, procedures: p.procedures.filter((_, i) => !indexes.includes(i)) };
      } else if (p.id === toPlanId) {
        return { ...p, procedures: [...p.procedures, ...moving] };
      }
      return p;
    }));
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100 min-h-screen" : "bg-gray-50 text-gray-900 min-h-screen"} p-4`}>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hasta Planları</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-3 py-1 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button onClick={addPlan} className="px-3 py-1 rounded border bg-green-500 text-white hover:bg-green-600">Yeni Plan Ekle</button>
        </div>
      </header>

      <div className="flex gap-4 flex-wrap">
        {plans.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePlanId(p.id)}
            className={`px-4 py-2 rounded ${activePlanId === p.id ? "bg-blue-600 text-white" : darkMode ? "bg-gray-700 text-gray-100" : "bg-white text-gray-800"}`}
          >
            Plan #{p.id}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {plans.map((p) =>
          p.id === activePlanId ? (
            <ToothPlanningPage
              key={p.id}
              plan={p}
              setPlanDoctor={setPlanDoctor}
              addProcedureToPlan={addProcedureToPlan}
              removeProcedureFromPlan={removeProcedureFromPlan}
              markPlanProceduresAsCompleted={markPlanProceduresAsCompleted}
              updateProcedureInPlan={updateProcedureInPlan}
              allPlans={plans}
              moveProcedures={moveProcedures}
              darkMode={darkMode}
            />
          ) : null
        )}
      </div>
    </div>
  );
}
