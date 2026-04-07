import React from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { cases } from "../data/mock.js";

export default function CasesListPage() {
  const loading = false;
  return (
    <div className="space-y-6 animated-fade">
      <GlassCard className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">All Cases</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Filter and review cases across districts.
          </p>
        </div>
        <div className="flex gap-3">
          <select className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm dark:border-slate-700 dark:bg-ink-800">
            <option>Status: All</option>
            <option>Submitted</option>
            <option>Under Review</option>
            <option>Approved</option>
          </select>
          <input
            className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm dark:border-slate-700 dark:bg-ink-800"
            placeholder="Search by district"
          />
        </div>
      </GlassCard>

      <div className="space-y-4">
        {loading ? (
          <GlassCard>
            <div className="space-y-3">
              <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </GlassCard>
        ) : (
          cases.map((item) => (
            <GlassCard key={item.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{item.id}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.farmer} · {item.district}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={item.status} />
                <Link
                  to={`/cases/${item.id}`}
                  className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
                >
                  View Details
                </Link>
                <Link
                  to={`/prediction/${item.id}`}
                  className="rounded-lg bg-slateblue-500 px-3 py-1 text-xs font-semibold text-white"
                >
                  Predict
                </Link>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
