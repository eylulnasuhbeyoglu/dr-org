"use client";
import React, { useState } from "react";

type Treatment = {
  name: string;
  doctor: string;
  price: number;
  paid: number; // manuel girilen ödeme
};

type Invoice = {
  id: string;
  patientName: string;
  date: string;
  status: "Ödendi" | "Beklemede" | "Gecikmiş";
  treatments: Treatment[];
};

const mockInvoices: Invoice[] = [
  {
    id: "F001",
    patientName: "Ahmet Yılmaz",
    date: "2025-09-01",
    status: "Beklemede",
    treatments: [
      { name: "Diş Dolgusu", doctor: "Dr. A", price: 500, paid: 0 },
      { name: "Kanal Tedavisi", doctor: "Dr. B", price: 700, paid: 0 },
    ],
  },
  {
    id: "F002",
    patientName: "Elif Demir",
    date: "2025-09-03",
    status: "Ödendi",
    treatments: [{ name: "Diş Temizliği", doctor: "Dr. A", price: 800, paid: 800 }],
  },
];

const InvoicePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [filter, setFilter] = useState<"Tümü" | "Ödendi" | "Beklemede" | "Gecikmiş">("Tümü");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(inv => filter === "Tümü" || inv.status === filter);
  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.treatments.reduce((s, t) => s + t.price, 0), 0);

  const handlePaidChange = (tIndex: number, value: number) => {
    if (!selectedInvoice) return;
    const updatedTreatments = selectedInvoice.treatments.map((t, idx) =>
      idx === tIndex ? { ...t, paid: value } : t
    );
    setSelectedInvoice({ ...selectedInvoice, treatments: updatedTreatments });

    // frontend simülasyonu olarak invoices state'ini de güncelle
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === selectedInvoice.id ? { ...inv, treatments: updatedTreatments } : inv
      )
    );
  };

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "Ödendi": return "bg-green-100 text-green-800";
      case "Beklemede": return "bg-yellow-100 text-yellow-800";
      case "Gecikmiş": return "bg-red-100 text-red-800";
    }
  };

  const totalPaid = (inv: Invoice) => inv.treatments.reduce((sum, t) => sum + t.paid, 0);
  const totalDue = (inv: Invoice) => inv.treatments.reduce((sum, t) => sum + (t.price - t.paid), 0);

  return (
    <div className="flex min-h-screen bg-gray-50">


      <div className="flex-1 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white shadow">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl font-bold">
            &#9776;
          </button>
          <h1 className="text-2xl font-bold">Fatura ve Ödemeler</h1>
        </div>

        <div className="p-4 md:p-6">
          {/* Toplam Tutar */}
          <div className="mb-6 p-4 bg-white rounded shadow flex justify-between items-center border-l-4 border-blue-400">
            <span className="font-semibold text-blue-700">Toplam Tutar:</span>
            <span className="text-xl font-bold text-blue-900">{totalAmount} ₺</span>
          </div>

          {/* Filter */}
          <div className="mb-4 flex items-center gap-4">
            <label className="font-medium">Durum:</label>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as any)}
              className="border p-2 rounded shadow-sm"
            >
              <option value="Tümü">Tümü</option>
              <option value="Ödendi">Ödendi</option>
              <option value="Beklemede">Beklemede</option>
              <option value="Gecikmiş">Gecikmiş</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Fatura ID</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Hasta</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tarih</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Toplam Borç (₺)</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map(inv => (
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedInvoice(inv)}
                  >
                    <td className="px-4 py-2">{inv.id}</td>
                    <td className="px-4 py-2">{inv.patientName}</td>
                    <td className="px-4 py-2">{inv.date}</td>
                    <td className="px-4 py-2 font-semibold">{totalDue(inv)}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {selectedInvoice && (
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div className="bg-gray-50 rounded-lg shadow-lg w-11/12 md:w-2/3 p-6 pointer-events-auto">
                <button
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold"
                  onClick={() => setSelectedInvoice(null)}
                >
                  ✕
                </button>
                <h2 className="text-xl font-bold mb-4">{selectedInvoice.patientName} - Fatura Detayı</h2>
                <p className="mb-2"><strong>Fatura ID:</strong> {selectedInvoice.id}</p>
                <p className="mb-2"><strong>Tarih:</strong> {selectedInvoice.date}</p>

                <table className="min-w-full divide-y divide-gray-200 mb-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 py-1 text-left text-sm font-semibold">İşlem</th>
                      <th className="px-2 py-1 text-left text-sm font-semibold">Hekim</th>
                      <th className="px-2 py-1 text-left text-sm font-semibold">Borç (₺)</th>
                      <th className="px-2 py-1 text-left text-sm font-semibold">Ödenen (₺)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.treatments.map((t, idx) => (
                      <tr key={idx} className="hover:bg-gray-100">
                        <td className="px-2 py-1">{t.name}</td>
                        <td className="px-2 py-1">{t.doctor}</td>
                        <td className="px-2 py-1">{t.price}</td>
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            className="border rounded px-2 py-1 w-20"
                            value={t.paid}
                            min={0}
                            max={t.price}
                            onChange={e => handlePaidChange(idx, Number(e.target.value))}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-between mt-4 font-semibold">
                  <span>Toplam Ödenen:</span>
                  <span>{totalPaid(selectedInvoice)} ₺</span>
                </div>
                <div className="flex justify-between mt-2 font-semibold">
                  <span>Toplam Borç:</span>
                  <span>{totalDue(selectedInvoice)} ₺</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
