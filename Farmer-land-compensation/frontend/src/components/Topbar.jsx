import React from "react";
import { useAuth } from "../providers/AuthProvider.jsx";
import { useTheme } from "../providers/ThemeProvider.jsx";

export default function Topbar() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <header className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold">Welcome, {user?.name || "User"}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Intelligent Decision Support System
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="glass-card rounded-full px-4 py-2 text-sm font-medium shadow-glass transition hover:-translate-y-0.5"
        >
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
          {user?.role?.toUpperCase() || "ROLE"}
        </div>
      </div>
    </header>
  );
}
