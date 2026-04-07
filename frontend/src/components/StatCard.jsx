import React from "react";
import GlassCard from "./GlassCard.jsx";

export default function StatCard({ label, value, helper }) {
  return (
    <GlassCard className="space-y-2">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="text-2xl font-semibold">{value}</p>
      {helper && <p className="text-sm text-slate-500">{helper}</p>}
    </GlassCard>
  );
}
