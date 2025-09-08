"use client";

import React, { useEffect, useMemo, useState } from "react";

type Item = { id: string; name: string; sku: string; qty: number; min: number; unit: string; category?: string };
type Movement = { id: string; itemId: string; type: "in" | "out"; qty: number; at: string; note?: string };

export default function StockPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [form, setForm] = useState<Partial<Item>>({ name: "", sku: "", qty: 0, min: 10, unit: "adet" });
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("stockItems");
    if (saved) setItems(JSON.parse(saved));
    const savedMov = localStorage.getItem("stockMovements");
    if (savedMov) setMovements(JSON.parse(savedMov));
  }, []);

  const save = (list: Item[]) => {
    setItems(list);
    localStorage.setItem("stockItems", JSON.stringify(list));
  };

  const saveMovements = (list: Movement[]) => {
    setMovements(list);
    localStorage.setItem("stockMovements", JSON.stringify(list));
  };

  const addItem = () => {
    if (!form.name || !form.sku) return;
    const next: Item = { id: String(Date.now()), name: form.name!, sku: form.sku!, qty: Number(form.qty || 0), min: Number(form.min || 0), unit: form.unit || "adet", category: form.category || "Genel" };
    save([next, ...items]);
    setForm({ name: "", sku: "", qty: 0, min: 10, unit: "adet" });
  };

  const updateQty = (id: string, delta: number) => {
    const next = items.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i);
    save(next);
    const mov: Movement = { id: String(Date.now()), itemId: id, type: delta >= 0 ? "in" : "out", qty: Math.abs(delta), at: new Date().toISOString() };
    saveMovements([mov, ...movements]);
  };

  const lowStock = useMemo(() => items.filter(i => i.qty <= i.min), [items]);
  const categories = useMemo(() => Array.from(new Set(items.map(i => i.category || "Genel"))), [items]);
  const filtered = useMemo(() => items.filter(i => !categoryFilter || i.category === categoryFilter), [items, categoryFilter]);

  return (
    <div className="p-4 md:p-6 text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Stok Yönetimi</h1>

      {lowStock.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          Düşük stok uyarısı: {lowStock.map(i => i.name).join(", ")}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-6 gap-3">
        <input placeholder="Ürün Adı" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
        <input placeholder="SKU" value={form.sku || ""} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
        <input type="number" placeholder="Miktar" value={form.qty ?? 0} onChange={e => setForm(f => ({ ...f, qty: Number(e.target.value) }))} className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
        <input type="number" placeholder="Asgari" value={form.min ?? 0} onChange={e => setForm(f => ({ ...f, min: Number(e.target.value) }))} className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
        <select value={form.category || "Genel"} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
          <option>Genel</option>
          <option>Hijyen</option>
          <option>Protez</option>
          <option>İmplant</option>
        </select>
        <div className="flex gap-2">
          <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} className="border rounded px-3 py-2 flex-1 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            <option value="adet">adet</option>
            <option value="kutu">kutu</option>
            <option value="paket">paket</option>
          </select>
          <button onClick={addItem} className="px-3 py-2 bg-blue-600 text-white rounded">Ekle</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded shadow p-3 mb-3 flex gap-2 items-center">
        <label className="text-sm">Kategori:</label>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="border rounded px-3 py-2">
          <option value="">Tümü</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => {
          const header = "Ürün,SKU,Miktar,Asgari,Birim,Kategori";
          const rows = items.map(i => [i.name, i.sku, i.qty, i.min, i.unit, i.category || ""].join(","));
          const csv = [header, ...rows].join("\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = "stok.csv"; a.click(); URL.revokeObjectURL(url);
        }} className="ml-auto px-3 py-2 border rounded">CSV İndir</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Ürün</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">SKU</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Miktar</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Asgari</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Birim</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Kategori</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map(i => (
              <tr key={i.id} className={i.qty <= i.min ? "bg-yellow-50" : ""}>
                <td className="px-4 py-2">{i.name}</td>
                <td className="px-4 py-2">{i.sku}</td>
                <td className="px-4 py-2">{i.qty}</td>
                <td className="px-4 py-2">{i.min}</td>
                <td className="px-4 py-2">{i.unit}</td>
                <td className="px-4 py-2">{i.category}</td>
                <td className="px-4 py-2 text-right">
                  <div className="inline-flex gap-2">
                    <button onClick={() => updateQty(i.id, -1)} className="px-2 py-1 border rounded">-</button>
                    <button onClick={() => updateQty(i.id, 1)} className="px-2 py-1 border rounded">+</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-800 rounded shadow overflow-x-auto">
        <div className="p-3 font-semibold">Hareket Geçmişi</div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Tarih</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Ürün</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Tip</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Miktar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {movements.map(m => {
              const item = items.find(i => i.id === m.itemId);
              return (
                <tr key={m.id}>
                  <td className="px-4 py-2">{new Date(m.at).toLocaleString("tr-TR")}</td>
                  <td className="px-4 py-2">{item?.name || m.itemId}</td>
                  <td className="px-4 py-2">{m.type === "in" ? "Giriş" : "Çıkış"}</td>
                  <td className="px-4 py-2">{m.qty}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


