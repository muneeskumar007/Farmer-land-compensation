import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.jsx";

const menuByRole = {
  admin: [
    { label: "Dashboard", to: "/admin" },
    { label: "Analytics", to: "/analytics" },
    { label: "Cases", to: "/cases" }
  ],
  officer: [
    { label: "Dashboard", to: "/officer" },
    { label: "Create Case", to: "/cases/new" },
    { label: "Cases", to: "/cases" }
  ],
  farmer: [
    { label: "My Case", to: "/farmer" },
    { label: "Reports", to: "/farmer/reports" }
  ]
};

export default function Sidebar() {
  const { user } = useAuth();
  const links = menuByRole[user?.role] || [];

  return (
    <aside className="glass-card w-64 min-h-screen px-6 py-8 shadow-glass">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Government of India
        </p>
        <h1 className="mt-2 text-xl font-semibold">Compensation Desk</h1>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-slateblue-500 text-white shadow"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-ink-700"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
