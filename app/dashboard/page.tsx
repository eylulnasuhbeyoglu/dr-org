"use client";

import React, { useState } from "react";
import Sidebar from "../component/Sidebar";
import AppointmentDashboard from "./Dashboard";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // toggleSidebar fonksiyonu eklendi
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
    

      {/* Dashboard içeriği */}
      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? 256 : 0 }}
      >
        <AppointmentDashboard />
      </div>
    </div>
  );
}
