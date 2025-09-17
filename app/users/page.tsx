"use client";

import React, { useEffect, useMemo, useState } from "react";

type Doctor = {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  university: string;
  graduationYear?: number;
  licenseNo?: string;
  bio?: string;
  photoDataUrl?: string; // base64 preview
  documentName?: string;
  documentDataUrl?: string; // base64 preview
  createdAt: string;
};

const STORAGE_KEY = "doctors";

export default function UsersPage() {
  const [form, setForm] = useState<Partial<Doctor>>({});
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const yearOptions = useMemo(() => {
    const y: number[] = [];
    const current = new Date().getFullYear();
    for (let i = current; i >= 1950; i--) y.push(i);
    return y;
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDoctors(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
    } catch {}
  }, [doctors]);

  const update = (patch: Partial<Doctor>) => setForm((f) => ({ ...f, ...patch }));

  const onPickFile = (file: File, field: "photoDataUrl" | "documentDataUrl", nameField?: "documentName") => {
    const reader = new FileReader();
    reader.onload = () => {
      update({ [field]: reader.result as string, ...(nameField ? { [nameField]: file.name } : {}) } as any);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => setForm({});

  const saveDoctor = () => {
    if (!form.firstName || !form.lastName || !form.specialty || !form.university) {
      alert("Lütfen zorunlu alanları doldurun (Ad, Soyad, Uzmanlık, Üniversite).");
      return;
    }
    const newDoctor: Doctor = {
      id: crypto.randomUUID(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      specialty: form.specialty.trim(),
      university: form.university.trim(),
      graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
      licenseNo: form.licenseNo?.trim(),
      bio: form.bio?.trim(),
      photoDataUrl: form.photoDataUrl,
      documentName: form.documentName,
      documentDataUrl: form.documentDataUrl,
      createdAt: new Date().toISOString(),
    };
    setDoctors((prev) => [newDoctor, ...prev]);
    resetForm();
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Doktor Ekle</h1>

      <div className="bg-white rounded shadow p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Ad</label>
          <input value={form.firstName || ""} onChange={(e) => update({ firstName: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Soyad</label>
          <input value={form.lastName || ""} onChange={(e) => update({ lastName: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Uzmanlık Alanı</label>
          <input value={form.specialty || ""} onChange={(e) => update({ specialty: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="Ortodonti, Endodonti..." />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Üniversite</label>
          <input value={form.university || ""} onChange={(e) => update({ university: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Mezuniyet Yılı</label>
          <select value={form.graduationYear ?? ""} onChange={(e) => update({ graduationYear: e.target.value ? Number(e.target.value) : undefined })} className="w-full border rounded px-3 py-2">
            <option value="">Seçiniz</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Lisans / Çalışma Belge No</label>
          <input value={form.licenseNo || ""} onChange={(e) => update({ licenseNo: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Biyografi</label>
          <textarea value={form.bio || ""} onChange={(e) => update({ bio: e.target.value })} className="w-full border rounded px-3 py-2" rows={3} />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Profil Fotoğrafı</label>
          <input type="file" accept="image/*" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPickFile(f, "photoDataUrl");
          }} />
          {form.photoDataUrl && (
            <div className="mt-2">
              <img src={form.photoDataUrl} alt="preview" className="w-28 h-28 object-cover rounded" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Çalışma Belgesi (PDF/Resim)</label>
          <input type="file" accept="image/*,.pdf" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPickFile(f, "documentDataUrl", "documentName");
          }} />
          {form.documentName && (
            <div className="mt-2 text-sm text-gray-700">Yüklendi: {form.documentName}</div>
          )}
        </div>

        <div className="md:col-span-2 flex justify-end gap-2">
          <button onClick={resetForm} className="px-4 py-2 border rounded">Temizle</button>
          <button onClick={saveDoctor} className="px-4 py-2 bg-blue-600 text-white rounded">Kaydet</button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">Kayıtlı Doktorlar</h2>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-3 py-2">Foto</th>
              <th className="text-left px-3 py-2">Ad Soyad</th>
              <th className="text-left px-3 py-2">Uzmanlık</th>
              <th className="text-left px-3 py-2">Üniversite</th>
              <th className="text-left px-3 py-2">Mezuniyet</th>
              <th className="text-left px-3 py-2">Belge</th>
              <th className="text-left px-3 py-2">Kayıt</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr><td className="px-3 py-4 text-center text-gray-500" colSpan={7}>Henüz kayıt bulunmuyor.</td></tr>
            ) : doctors.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="px-3 py-2">
                  {d.photoDataUrl ? <img src={d.photoDataUrl} alt="foto" className="w-10 h-10 rounded object-cover" /> : "—"}
                </td>
                <td className="px-3 py-2">{d.firstName} {d.lastName}</td>
                <td className="px-3 py-2">{d.specialty}</td>
                <td className="px-3 py-2">{d.university}</td>
                <td className="px-3 py-2">{d.graduationYear ?? "—"}</td>
                <td className="px-3 py-2">{d.documentName ?? "—"}</td>
                <td className="px-3 py-2">{new Date(d.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


