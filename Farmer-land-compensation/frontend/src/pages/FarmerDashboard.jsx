import React from "react";
import GlassCard from "../components/GlassCard.jsx";
import Timeline from "../components/Timeline.jsx";
import MapDraw from "../components/MapDraw.jsx";

export default function FarmerDashboard() {
  return (
    <div className="space-y-8 animated-fade">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <GlassCard className="space-y-4">
          <h3 className="text-lg font-semibold">Case Status Timeline</h3>
          <Timeline status="under_review" />
        </GlassCard>
        <GlassCard className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Final Approved Amount
          </p>
          <p className="text-3xl font-semibold text-mint-500">₹ 4,72,00,000</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Updated after authority review.
          </p>
          <div className="flex gap-3">
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
              Raise Objection
            </button>
            <button className="rounded-xl bg-slateblue-500 px-4 py-2 text-sm font-semibold text-white">
              Download Report
            </button>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="space-y-4">
          <h3 className="text-lg font-semibold">Land Details</h3>
          <div className="grid gap-4 text-sm">
            <div className="flex justify-between">
              <span>District</span>
              <span className="font-semibold">Pune</span>
            </div>
            <div className="flex justify-between">
              <span>Village</span>
              <span className="font-semibold">Kondhwa</span>
            </div>
            <div className="flex justify-between">
              <span>Land Area</span>
              <span className="font-semibold">12.5 acres</span>
            </div>
            <div className="flex justify-between">
              <span>Crop Type</span>
              <span className="font-semibold">Paddy</span>
            </div>
          </div>
        </GlassCard>
        <MapDraw readOnly />
      </div>
    </div>
  );
}
