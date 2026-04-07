import React from "react";
import { useAuth } from "../providers/AuthProvider.jsx";
import GlassCard from "../components/GlassCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import MapDraw from "../components/MapDraw.jsx";

export default function CaseDetailsPage() {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <div className="space-y-6 animated-fade">
      <GlassCard className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Case ID
          </p>
          <h3 className="text-lg font-semibold">CASE-2026-001</h3>
        </div>
        <StatusBadge status="under_review" />
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <GlassCard className="space-y-4">
          <h3 className="text-lg font-semibold">Land Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Farmer</span>
              <span className="font-semibold">Ravi Kumar</span>
            </div>
            <div className="flex justify-between">
              <span>District</span>
              <span className="font-semibold">Pune</span>
            </div>
            <div className="flex justify-between">
              <span>Land Area</span>
              <span className="font-semibold">12.5 acres</span>
            </div>
            <div className="flex justify-between">
              <span>Crop</span>
              <span className="font-semibold">Paddy</span>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="space-y-4">
          <h3 className="text-lg font-semibold">Compensation Snapshot</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Calculated</span>
              <span className="font-semibold">₹ 4,50,00,000</span>
            </div>
            <div className="flex justify-between">
              <span>Predicted</span>
              <span className="font-semibold">₹ 4,67,50,000</span>
            </div>
            <div className="flex justify-between">
              <span>Final</span>
              <span className="font-semibold">₹ 4,72,00,000</span>
            </div>
          </div>
          {role === "admin" && (
            <div className="flex gap-3">
              <button className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">
                Approve
              </button>
              <button className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white">
                Reject
              </button>
              <button className="rounded-xl bg-slateblue-500 px-4 py-2 text-sm font-semibold text-white">
                Submit to Authority
              </button>
            </div>
          )}
          {role === "officer" && (
            <button className="rounded-xl bg-slateblue-500 px-4 py-2 text-sm font-semibold text-white">
              Submit to Admin
            </button>
          )}
        </GlassCard>
      </div>

      <MapDraw readOnly />
    </div>
  );
}
