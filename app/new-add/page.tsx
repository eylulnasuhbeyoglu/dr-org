"use client";
import React, { useState } from "react";

const YeniHastaForm = () => {
  // Temel Hasta Bilgileri
  const [photo, setPhoto] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [tcNo, setTcNo] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([""]);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Sağlık ve Klinik Bilgileri
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [insurance, setInsurance] = useState("");
  const [allergies, setAllergies] = useState("");
  const [chronicDiseases, setChronicDiseases] = useState("");
  const [medications, setMedications] = useState("");
  const [pregnancyStatus, setPregnancyStatus] = useState("");

  // Randevu ve Tedavi Bilgileri
  const [firstExamDate, setFirstExamDate] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [referenceSource, setReferenceSource] = useState("");

  // Fotoğraf seçimi
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  // Çoklu telefon numarası
  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...phoneNumbers];
    newPhones[index] = value;
    setPhoneNumbers(newPhones);
  };
  const addPhoneNumber = () => setPhoneNumbers([...phoneNumbers, ""]);
  const removePhoneNumber = (index: number) => {
    const newPhones = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(newPhones);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      photo,
      name,
      tcNo,
      birthDate,
      gender,
      phoneNumbers,
      email,
      address,
      emergencyContact,
      emergencyPhone,
      insurance,
      allergies,
      chronicDiseases,
      medications,
      pregnancyStatus,
      firstExamDate,
      treatmentPlan,
      referenceSource,
    });
    alert("Form gönderildi! (Backend'e gönderme kısmı eklenmeli.)");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-300 to-purple-300 p-6">
      <div className="w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Başlık */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-purple-500 rounded-full p-4 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v6m3-3H3m9 6a9 9 0 110-18 9 9 0 010 18z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Yeni Hasta Ekle</h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Sol Sütun */}
          <div className="space-y-4">
            {/* Fotoğraf */}
            <label
              htmlFor="photo"
              className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors mx-auto"
            >
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Hasta Fotoğrafı"
                  className="w-36 h-36 object-cover rounded-full"
                />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-gray-500 mt-1 text-sm">
                    Fotoğraf Yükle
                  </span>
                </>
              )}
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>

            <input
              type="text"
              placeholder="Ad Soyad"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500"
            />
            <input
              type="text"
              placeholder="TC Kimlik No / Kimlik Numarası"
              value={tcNo}
              onChange={(e) => setTcNo(e.target.value)}
              maxLength={11}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500"
            />
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500"
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Kadın"
                  checked={gender === "Kadın"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                Kadın
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Erkek"
                  checked={gender === "Erkek"}
                  onChange={(e) => setGender(e.target.value)}
                />
                Erkek
              </label>
            </div>

            {/* Çoklu Telefon */}
            <div>
              <label className="block font-medium mb-1">
                Telefon Numarası
              </label>
              {phoneNumbers.map((phone, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(idx, e.target.value)}
                    required={idx === 0}
                    placeholder="Telefon Numarası"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500"
                  />
                  {phoneNumbers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhoneNumber(idx)}
                      className="text-red-500 font-bold px-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPhoneNumber}
                className="text-purple-600 underline text-sm"
              >
                + Yeni Telefon
              </button>
            </div>

            <input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500"
            />
            <textarea
              placeholder="Adres"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500 resize-none"
            />
          </div>

          {/* Sağ Sütun */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Acil Durum Kişi"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500"
            />
            <input
              type="tel"
              placeholder="Acil Durum Telefon"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500"
            />
            <input
              type="text"
              placeholder="Sigorta Bilgileri"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500"
            />
            <textarea
              placeholder="Alerjiler"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500 resize-none"
            />
            <textarea
              placeholder="Kronik Rahatsızlıklar"
              value={chronicDiseases}
              onChange={(e) => setChronicDiseases(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500 resize-none"
            />
            <textarea
              placeholder="Kullandığı İlaçlar"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500 resize-none"
            />
            <select
              value={pregnancyStatus}
              onChange={(e) => setPregnancyStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500"
            >
              <option value="">Hamilelik Durumu</option>
              <option value="Hamile">Hamile</option>
              <option value="Hamile Değil">Hamile Değil</option>
              <option value="Bilmiyorum">Bilmiyorum</option>
            </select>
            <input
              type="date"
              placeholder="İlk Muayene Tarihi"
              value={firstExamDate}
              onChange={(e) => setFirstExamDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500"
            />
            <textarea
              placeholder="Tedavi Planı"
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500 resize-none"
            />
            <input
              type="text"
              placeholder="Referans Kaynağı"
              value={referenceSource}
              onChange={(e) => setReferenceSource(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-purple-500"
            />
          </div>

          {/* Kaydet Butonu */}
          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default YeniHastaForm;
