"use client";

import React, { useEffect, useMemo, useState } from "react";

type Notification = {
  id: string;
  type: "appointment" | "consent" | "stock" | "prescription";
  message: string;
  createdAt: string;
  read: boolean;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | Notification["type"]>("all");
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("notifications");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const markAllRead = () => {
    const next = items.map((n) => ({ ...n, read: true }));
    setItems(next);
    localStorage.setItem("notifications", JSON.stringify(next));
  };

  const markRead = (id: string, read = true) => {
    const next = items.map(n => n.id === id ? { ...n, read } : n);
    setItems(next);
    localStorage.setItem("notifications", JSON.stringify(next));
  };

  const remove = (id: string) => {
    const next = items.filter(n => n.id !== id);
    setItems(next);
    localStorage.setItem("notifications", JSON.stringify(next));
  };

  const seedExample = () => {
    const seed: Notification[] = [
      { id: "n1", type: "appointment", message: "Hasta geldi: Ahmet Yılmaz (09:00)", createdAt: new Date().toISOString(), read: false },
      { id: "n2", type: "consent", message: "Onam formu imzası bekleniyor", createdAt: new Date().toISOString(), read: false },
      { id: "n3", type: "stock", message: "Eldiven stok seviyesi düşük", createdAt: new Date().toISOString(), read: false },
    ];
    setItems(seed);
    localStorage.setItem("notifications", JSON.stringify(seed));
  };

  const filtered = useMemo(() => {
    return items.filter(n =>
      (typeFilter === "all" || n.type === typeFilter) &&
      (!onlyUnread || !n.read) &&
      (!query || n.message.toLowerCase().includes(query.toLowerCase()))
    );
  }, [items, query, typeFilter, onlyUnread]);

  return (
    <div className="p-4 md:p-6 text-gray-800 dark:text-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Bildirimler</h1>
        <div className="flex gap-2">
          <button onClick={seedExample} className="px-3 py-1 border dark:border-gray-600 rounded">Örnek Yükle</button>
          <button onClick={markAllRead} className="px-3 py-1 bg-blue-600 text-white rounded">Tümünü Okundu İşaretle</button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
        <div className="p-3 border-b flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div className="flex gap-2 items-center">
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ara..." className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)} className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <option value="all">Tümü</option>
              <option value="appointment">Randevu</option>
              <option value="consent">Onam</option>
              <option value="stock">Stok</option>
              <option value="prescription">Reçete</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={onlyUnread} onChange={e => setOnlyUnread(e.target.checked)} />
              Sadece okunmamış
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={sound} onChange={e => setSound(e.target.checked)} />
            Sesli uyarı
          </label>
        </div>
        {filtered.length === 0 ? (
          <div className="p-4 text-gray-500 dark:text-gray-300">Henüz bildirim yok.</div>
        ) : (
          <ul>
            {filtered.map((n) => (
              <li key={n.id} className={`p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${n.read ? "bg-white dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-900/30"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{new Date(n.createdAt).toLocaleString("tr-TR")}</div>
                    <div className="font-medium">{n.message}</div>
                  </div>
                  <div className="flex gap-2">
                    {!n.read ? (
                      <button onClick={() => markRead(n.id, true)} className="px-2 py-1 text-sm border dark:border-gray-600 rounded">Okundu</button>
                    ) : (
                      <button onClick={() => markRead(n.id, false)} className="px-2 py-1 text-sm border dark:border-gray-600 rounded">Geri al</button>
                    )}
                    <button onClick={() => remove(n.id)} className="px-2 py-1 text-sm border dark:border-gray-600 rounded text-red-600">Sil</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


