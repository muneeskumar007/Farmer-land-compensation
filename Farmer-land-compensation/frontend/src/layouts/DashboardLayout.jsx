import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-ink-900 dark:via-ink-800 dark:to-ink-700">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 px-10 py-8">
          <div className="space-y-8">
            <Topbar />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
