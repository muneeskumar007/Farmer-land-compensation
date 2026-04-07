import React from "react";
import GlassCard from "../components/GlassCard.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { cases } from "../data/mock.js";

export default function OfficerDashboard() {
  return (
    <div className="space-y-8 animated-fade">
      <div className="grid gap-6 lg:grid-cols-3">
        <StatCard label="Assigned Cases" value="12" helper="In your queue" />
        <StatCard label="Pending Review" value="5" helper="Awaiting action" />
        <StatCard label="Field Visits" value="3" helper="This week" />
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Assigned Cases</h3>
          <button className="rounded-xl bg-slateblue-500 px-4 py-2 text-sm font-semibold text-white">
            Create Case
          </button>
        </div>
        <div className="space-y-4">
          {cases.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-slate-200/60 px-4 py-3 dark:border-slate-700/60"
            >
              <div>
                <p className="text-sm font-semibold">{item.id}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.farmer} · {item.district}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={item.status} />
                <button className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
