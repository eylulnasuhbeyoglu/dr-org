"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Status = "Onaylı" | "Beklemede" | "İptal";

type Appointment = {
  id: string;
  patientName: string;
  patientId?: string;
  phone: string;
  email?: string;
  doctor: string;
  datetime: string;
  status: Status;
  notes?: string;
};

const SAMPLE_DOCTORS = [
  "Dr. Ayşe Kaya",
  "Dr. Mehmet Can",
  "Dr. Selin Yıldız",
  "Notlar ",
];

const doctorColors: Record<string, { headerBg: string; cardBg: string; text?: string }> = {
  "Dr. Ayşe Kaya": { headerBg: "bg-purple-600 text-white", cardBg: "bg-purple-100 dark:bg-purple-900/40", text: "text-gray-900 dark:text-gray-100" },
  "Dr. Mehmet Can": { headerBg: "bg-green-600 text-white", cardBg: "bg-green-100 dark:bg-green-900/40", text: "text-gray-900 dark:text-gray-100" },
  "Dr. Selin Yıldız": { headerBg: "bg-blue-600 text-white", cardBg: "bg-blue-100 dark:bg-blue-900/40", text: "text-gray-900 dark:text-gray-100" },
  "Notlar ": { headerBg: "bg-yellow-400 text-black", cardBg: "bg-yellow-100 dark:bg-yellow-900/40", text: "text-gray-900 dark:text-gray-100" },
};

const initialAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Ahmet Yılmaz",
    patientId: "12345678901",
    phone: "0555 555 55 55",
    email: "ahmet@example.com",
    doctor: SAMPLE_DOCTORS[0],
    datetime: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    status: "Onaylı",
    notes: "Kontrol randevusu",
  },
  {
    id: "2",
    patientName: "Elif Demir",
    phone: "0553 333 33 33",
    doctor: SAMPLE_DOCTORS[1],
    datetime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    status: "Beklemede",
  },
  {
    id: "3",
    patientName: "Mehmet Arslan",
    phone: "0554 444 44 44",
    doctor: SAMPLE_DOCTORS[2],
    datetime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    status: "İptal",
  },
];

export default function AppointmentDashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQ, setSearchQ] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);

  const emptyForm: Partial<Appointment> = {
    patientName: "",
    patientId: "",
    phone: "",
    email: "",
    doctor: "",
    datetime: "",
    status: "Beklemede",
    notes: "",
  };
  const [form, setForm] = useState<Partial<Appointment>>(emptyForm);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  const [currentHour, setCurrentHour] = useState<number | null>(null);
  const [currentMinutes, setCurrentMinutes] = useState<number | null>(null);

  // Sağ tık menüsü durumu
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    appointment: Appointment | null;
  }>({ visible: false, x: 0, y: 0, appointment: null });

  useEffect(() => {
    setSelectedDate(new Date());
    setNow(new Date());

    const timer = setInterval(() => {
      const n = new Date();
      setNow(n);
      setCurrentHour(n.getHours());
      setCurrentMinutes(n.getMinutes());
    }, 60 * 1000);

    // ilk değer mount olduğunda da set edilsin
    const init = new Date();
    setCurrentHour(init.getHours());
    setCurrentMinutes(init.getMinutes());

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      setForm(emptyForm);
      setEditing(null);
    }
  }, [isModalOpen]);

  const doctors = useMemo(() => {
    const fromAppointments = Array.from(new Set(appointments.map((a) => a.doctor))).filter(Boolean);
    return Array.from(new Set([...SAMPLE_DOCTORS, ...fromAppointments]));
  }, [appointments]);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      if (selectedDoctor && a.doctor !== selectedDoctor) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      if (selectedDate) {
        const aDate = new Date(a.datetime);
        if (aDate.toDateString() !== selectedDate.toDateString()) return false;
      }
      if (searchQ) {
        const q = searchQ.toLowerCase();
        if (!a.patientName.toLowerCase().includes(q) &&
            !(a.doctor || "").toLowerCase().includes(q) &&
            !(a.patientId || "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [appointments, selectedDoctor, statusFilter, searchQ, selectedDate]);

  const addAppointment = (payload: Partial<Appointment>) => {
    const newItem: Appointment = {
      id: String(Date.now()),
      patientName: payload.patientName!.trim(),
      patientId: payload.patientId?.trim(),
      phone: payload.phone!.trim(),
      email: payload.email?.trim(),
      doctor: payload.doctor || SAMPLE_DOCTORS[0],
      datetime: payload.datetime || new Date().toISOString(),
      status: (payload.status as Status) || "Beklemede",
      notes: payload.notes?.trim(),
    };
    setAppointments((s) => [newItem, ...s]);
  };

  const updateAppointment = (id: string, payload: Partial<Appointment>) => {
    setAppointments((s) => s.map((a) => (a.id === id ? { ...a, ...payload } : a)));
  };

  const openEdit = (a: Appointment) => {
    setEditing(a);
    setForm({ ...a });
    setIsModalOpen(true);
  };

  const openContextMenu = (e: React.MouseEvent, a: Appointment) => {
    e.preventDefault();
    // Basit sınır kontrolü: menü ekran dışına taşmasın
    const MENU_WIDTH = 220;
    const MENU_HEIGHT = 140;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    let x = e.clientX;
    let y = e.clientY;
    if (x + MENU_WIDTH > viewportW) x = viewportW - MENU_WIDTH - 8;
    if (y + MENU_HEIGHT > viewportH) y = viewportH - MENU_HEIGHT - 8;
    setContextMenu({ visible: true, x, y, appointment: a });
  };

  const closeContextMenu = () => setContextMenu((s) => ({ ...s, visible: false }));

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeContextMenu();
    };
    const onClick = () => closeContextMenu();
    if (contextMenu.visible) {
      window.addEventListener("keydown", onEsc);
      window.addEventListener("click", onClick);
    }
    return () => {
      window.removeEventListener("keydown", onEsc);
      window.removeEventListener("click", onClick);
    };
  }, [contextMenu.visible]);

  const handleFormSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.patientName || !form.phone || !form.doctor || !form.datetime) {
      alert("Lütfen Hasta Adı, Telefon, Hekim ve Tarih/Saat alanlarını doldurun.");
      return;
    }
    editing ? updateAppointment(editing.id, form) : addAppointment(form);
    setIsModalOpen(false);
  };

  const statusColor = (s: Status) =>
    s === "Onaylı" ? "bg-green-100 text-green-800" :
    s === "Beklemede" ? "bg-yellow-100 text-yellow-800" :
    "bg-red-100 text-red-800";

  const hours = Array.from({ length: 10 }, (_, i) => 9 + i);

  const appointmentsByDoctorAndHour: Record<string, Record<number, Appointment | null>> = {};
  doctors.forEach((doc) => {
    appointmentsByDoctorAndHour[doc] = {};
    hours.forEach((h) => {
      const slot = filtered.find(a => a.doctor === doc && new Date(a.datetime).getHours() === h);
      appointmentsByDoctorAndHour[doc][h] = slot || null;
    });
  });

  return (
    <div className=" flex h-screen w-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 overflow-hidden">
      {/* Sol: Saatler */}
      <div className="ml-2 flex flex-col w-12 items-center text-gray-500 text-xs p-2 border-r border-gray-300">
        {hours.map((h) => (
          <div key={h} className="h-16 flex items-center justify-center border-b border-gray-200">
            {h}:00
          </div>
        ))}
      </div>

      {/* Orta: Doktor Slotları */}
      <div className="flex-1 flex gap-2 p-4 overflow-x-auto relative">
        {doctors.map((doctor) => {
          const colors = doctorColors[doctor] || { headerBg: "bg-gray-300 dark:bg-gray-700", cardBg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-900 dark:text-gray-100" } as any;
          return (
            <div key={doctor} className="flex flex-col w-64 min-w-[16rem] border border-gray-300 rounded relative">
              <h4 className={`font-semibold mb-2 pb-1 rounded-t px-3 ${colors.headerBg}`}>{doctor}</h4>
              <div className="flex-1 flex flex-col relative">
                {hours.map((h) => {
                  const a = appointmentsByDoctorAndHour[doctor][h];
                  return (
                    <div
                      key={h}
                      className="h-16 border-b border-gray-200 cursor-pointer relative"
                      onClick={() => {
                        if (!selectedDate) return;
                        const d = new Date(selectedDate);
                        d.setHours(h, 0, 0, 0);
                        setForm({ ...emptyForm, doctor: doctor, datetime: d.toISOString() });
                        setIsModalOpen(true);
                      }}
                      onContextMenu={(e) => {
                        if (a) return;
                        e.preventDefault();
                        if (!selectedDate) return;
                        const d = new Date(selectedDate);
                        d.setHours(h, 0, 0, 0);
                        setForm({ ...emptyForm, doctor: doctor, datetime: d.toISOString() });
                        setIsModalOpen(true);
                      }}
                    >
                      {a && (
                        <div
                          className={`${colors.cardBg} ${colors.text || "text-gray-900 dark:text-gray-100"} rounded shadow p-2 w-full`}
                          onClick={() => openEdit(a)}
                          onContextMenu={(e) => openContextMenu(e, a)}
                        >
                          <div className="font-medium">{a.patientName}</div>
                          {a.notes && <div className="text-xs text-gray-700 dark:text-gray-300">{a.notes}</div>}
                          <span className={`px-1 py-0.5 rounded text-xs ${statusColor(a.status)}`}>
                            {a.status}
                          </span>
                        </div>
                      )}
                     
                      {currentHour !== null && currentMinutes !== null && h === currentHour && (
                        <div
                          className="absolute left-0 w-full bg-red-500 h-0.5"
                          style={{ top: `${(currentMinutes / 60) * 64}px` }}
                        >
                          <div className="absolute -left-2 -top-1 w-4 h-4 bg-red-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sağ: Takvim */}
      <div className="hidden md:block shrink-0 w-80 bg-white dark:bg-gray-800 border-l shadow p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Takvim</h2>
        <Calendar
          value={selectedDate || new Date()}
          onChange={(value) => setSelectedDate(value as Date)}
        />
      </div>

      {/* Sağ tık menüsü */}
      {contextMenu.visible && contextMenu.appointment && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg rounded border dark:border-gray-700 w-56 py-1"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-300 border-b dark:border-gray-700">
            {contextMenu.appointment.patientName}
          </div>
          <button
            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              const pid = contextMenu.appointment?.patientId || "";
              closeContextMenu();
              router.push(`/patient-list?patientId=${encodeURIComponent(pid)}`);
            }}
          >
            Hasta Bilgileri
          </button>
          <button
            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              const id = contextMenu.appointment?.id;
              closeContextMenu();
              router.push(`/appointments/${id}`);
            }}
          >
            Tedavi Planı
          </button>
          <button
            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              const id = contextMenu.appointment?.id;
              closeContextMenu();
              router.push(`/invoice-detail?appointmentId=${id}`);
            }}
          >
            Borç / E-Fatura
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editing ? "Randevu Düzenle" : "Yeni Randevu Ekle"}</h3>
              <button
                className="text-gray-500 dark:text-gray-300 text-xl leading-none"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="col-span-1 md:col-span-2 flex gap-2">
                <input
                  className="flex-1 border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  placeholder="Hasta Adı Soyadı *"
                  value={form.patientName || ""}
                  onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
                  required
                />
                <input
                  className="w-48 border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  placeholder="TC / Hasta ID"
                  value={form.patientId || ""}
                  onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))}
                />
              </div>
              <input
                className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                placeholder="Telefon *"
                value={form.phone || ""}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
              />
              <input
                className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                placeholder="E-posta"
                value={form.email || ""}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              <select
                className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                value={form.doctor || ""}
                onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))}
                required
              >
                <option value="">Hekim Seç *</option>
                {doctors.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                type="datetime-local"
                className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                value={form.datetime ? new Date(form.datetime).toISOString().substring(0, 16) : ""}
                onChange={(e) => setForm((f) => ({ ...f, datetime: e.target.value }))}
                required
              />
              <select
                className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                value={form.status || "Beklemede"}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Status }))}
              >
                <option value="Beklemede">Beklemede</option>
                <option value="Onaylı">Onaylı</option>
                <option value="İptal">İptal</option>
              </select>
              <textarea
                className="col-span-1 md:col-span-2 border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                placeholder="Not / Açıklama"
                value={form.notes || ""}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
              />
              <div className="col-span-1 md:col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
