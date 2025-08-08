"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { userAgent } from "next/server";


const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleLogin = () => {
    if (!email || !password) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    // Buraya giriş işlemleri eklenecek (örneğin API isteği)
    console.log("Giriş yapılıyor:", { email, password });
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col w-auto items-center justify-center h-screen relative">
      {/* Arka Plan Görseli */}
      <Image
        src="/alci.jpg"
        fill
        alt="Arka Plan"
        className="z-0 object-cover"
        priority
      />

      {/* Giriş Kutusu */}
      <div className="z-10 w-[90%] max-w-[450px] h-auto py-10 rounded-lg flex flex-col items-center justify-center bg-white/40 backdrop-blur-md p-5">
        {/* Logo */}
        <div className="mb-8 w-20 h-20">
          <img
            src="/dentalcliniclogo.png"
            alt="Dental Clinic Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* E-mail */}
        <div className="mb-4 w-full">
          <label className="text-black/60 text-sm mb-1 block">Username</label>
          <input
            type="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" Username girin"
            className="w-full h-10 p-3 border-2 border-gray-300 rounded-md focus:outline-blue-300"
            required
          />
        </div>

        {/* Şifre */}
        <div className="w-full mb-2">
          <label className="text-black/60 text-sm mb-1 block">Şifre</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              className="w-full h-10 p-3 border-2 border-gray-300 rounded-md"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-blue-600"
            >
              {showPassword ? "Gizle 🙈" : "Göster 👁️"}
            </button>
          </div>
        </div>

        {/* Şifremi Unuttum */}
        <div className="mt-2 text-sm w-full text-right">
          <a href="#" className="text-blue-600 hover:underline">
            Şifremi unuttum
          </a>
        </div>

        {/* Giriş Butonu */}
        
        <button
          onClick={handleLogin}
          className="bg-blue-400/60 hover:bg-blue-600 text-white w-[200px] h-[40px] mt-6 rounded-md transition-colors duration-300"
        >
       
          Giriş Yap
        </button>
      </div>
    </div>
  );
};

export default Page;
