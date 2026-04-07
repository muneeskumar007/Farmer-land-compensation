import React from "react";
import GlassCard from "../components/GlassCard.jsx";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-ink-900 dark:to-ink-800 flex items-center justify-center px-6">
      <GlassCard className="max-w-md text-center space-y-3">
        <h2 className="text-2xl font-semibold">Access Restricted</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your role does not have permissions for this section.
        </p>
      </GlassCard>
    </div>
  );
}
