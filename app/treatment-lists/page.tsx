"use client";

import React, { useEffect, useMemo, useState } from "react";

type Treatment = { id: string; name: string; price: number };
type PriceList = { id: string; title: string; items: Treatment[] };

export default function TreatmentListsPage() {
  const [lists, setLists] = useState<PriceList[]>([]);
  const [title, setTitle] = useState("");
  const [active, setActive] = useState<PriceList | null>(null);
  const [newItem, setNewItem] = useState<Treatment>({ id: "", name: "", price: 0 });
  const [category, setCategory] = useState<string>("Genel");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("treatmentLists");
    if (saved) setLists(JSON.parse(saved));
  }, []);

  const save = (data: PriceList[]) => {
    setLists(data);
    localStorage.setItem("treatmentLists", JSON.stringify(data));
  };

  const createList = () => {
    if (!title.trim()) return;
    const list: PriceList = { id: String(Date.now()), title: title.trim(), items: [] };
    save([list, ...lists]);
    setTitle("");
  };

  const addItem = () => {
    if (!active || !newItem.name.trim()) return;
    const item = { ...newItem, id: String(Date.now()), price: Number(newItem.price || 0) };
    const next = lists.map(l => l.id === active.id ? { ...l, items: [item, ...l.items] } : l);
    save(next);
    setActive(next.find(l => l.id === active.id) || null);
    setNewItem({ id: "", name: "", price: 0 });
  };

  const removeItem = (listId: string, itemId: string) => {
    const next = lists.map(l => l.id === listId ? { ...l, items: l.items.filter(i => i.id !== itemId) } : l);
    save(next);
    if (active?.id === listId) setActive(next.find(l => l.id === listId) || null);
  };

  const cloneList = (listId: string) => {
    const src = lists.find(l => l.id === listId);
    if (!src) return;
    const cloned: PriceList = { id: String(Date.now()), title: src.title + " (Kopya)", items: src.items.map(i => ({ ...i, id: String(Math.random()) })) };
    save([cloned, ...lists]);
  };

  const exportCSV = (list: PriceList) => {
    const header = "Islem,Fiyat";
    const rows = list.items.map(i => [i.name, i.price].join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${list.title}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const filteredItems = useMemo(() => active ? active.items.filter(i => !query || i.name.toLowerCase().includes(query.toLowerCase())) : [], [active, query]);

  return (
    <div className="p-4 md:p-6 text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Çoklu Tedavi Listeleri</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
          <h2 className="font-semibold mb-2">Yeni Liste</h2>
          <div className="flex gap-2">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Liste Başlığı" className="flex-1 border rounded px-3 py-2" />
            <button onClick={createList} className="px-4 py-2 bg-blue-600 text-white rounded">Oluştur</button>
          </div>
          <ul className="mt-4 divide-y">
            {lists.map(l => (
              <li key={l.id} className="py-2 flex items-center justify-between">
                <button onClick={() => setActive(l)} className="text-left">
                  <div className="font-medium">{l.title}</div>
                  <div className="text-sm text-gray-500">{l.items.length} işlem</div>
                </button>
                <div className="flex gap-3">
                  <button onClick={() => cloneList(l.id)} className="text-blue-600">Kopyala</button>
                  <button onClick={() => exportCSV(l)} className="text-gray-600">CSV</button>
                  <button onClick={() => save(lists.filter(x => x.id !== l.id))} className="text-red-600">Sil</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
          {!active ? (
            <div className="text-gray-500">Düzenlemek için bir liste seçin.</div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">{active.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="İşlem" className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                <input type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: Number(e.target.value) })} placeholder="Fiyat" className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
                <div className="md:col-span-2 flex">
                  <button onClick={addItem} className="px-4 py-2 border rounded">Ekle</button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="İşlem ara..." className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold">İşlem</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Fiyat (₺)</th>
                      <th className="px-4 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredItems.map(i => (
                      <tr key={i.id}>
                        <td className="px-4 py-2">{i.name}</td>
                        <td className="px-4 py-2">{i.price}</td>
                        <td className="px-4 py-2 text-right">
                          <button onClick={() => removeItem(active.id, i.id)} className="text-red-600">Sil</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


