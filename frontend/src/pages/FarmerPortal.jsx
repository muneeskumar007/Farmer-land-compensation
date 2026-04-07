import React from "react";
import GlassCard from "../components/GlassCard.jsx";
import Timeline from "../components/Timeline.jsx";

export default function FarmerPortal() {
  return (
    <div className="space-y-8 animated-fade">
      <GlassCard className="space-y-4">
        <h3 className="text-lg font-semibold">Your Case Journey</h3>
        <Timeline status="approved" />
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <GlassCard className="space-y-4">
          <h3 className="text-lg font-semibold">Compensation Breakdown</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Market Value per Acre</span>
              <span className="font-semibold">₹ 18,00,000</span>
            </div>
            <div className="flex justify-between">
              <span>Multiplier</span>
              <span className="font-semibold">1.0 (Urban)</span>
            </div>
            <div className="flex justify-between">
              <span>Solatium per Acre</span>
              <span className="font-semibold">₹ 18,00,000</span>
            </div>
            <div className="flex justify-between">
              <span>Calculated Total</span>
              <span className="font-semibold">₹ 4,50,00,000</span>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Final Approved
          </p>
          <p className="text-3xl font-semibold text-mint-500">₹ 4,72,00,000</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Amount approved by the authority.
          </p>
          <button className="rounded-xl bg-slateblue-500 px-4 py-2 text-sm font-semibold text-white">
            Download Report
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
