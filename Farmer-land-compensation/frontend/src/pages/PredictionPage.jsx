import React from "react";
import GlassCard from "../components/GlassCard.jsx";
import FeatureImportanceChart from "../components/FeatureImportanceChart.jsx";
import { featureImportance } from "../data/mock.js";

export default function PredictionPage() {
  return (
    <div className="space-y-6 animated-fade">
      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Predicted Compensation
          </p>
          <p className="mt-2 text-3xl font-semibold text-mint-500">₹ 4,67,50,000</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            95% confidence interval computed by model ensemble.
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Market Value
          </p>
          <p className="mt-2 text-2xl font-semibold">₹ 18,00,000</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Per acre valuation used for compensation.
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Solatium
          </p>
          <p className="mt-2 text-2xl font-semibold">₹ 18,00,000</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            100% additional compensation per RFCTLARR.
          </p>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <GlassCard className="space-y-4">
          <h3 className="text-lg font-semibold">Compensation Breakdown</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Land Area</span>
              <span className="font-semibold">12.5 acres</span>
            </div>
            <div className="flex justify-between">
              <span>Multiplier</span>
              <span className="font-semibold">1.0 (Urban)</span>
            </div>
            <div className="flex justify-between">
              <span>Calculated Value</span>
              <span className="font-semibold">₹ 4,50,00,000</span>
            </div>
            <div className="flex justify-between">
              <span>Predicted Value</span>
              <span className="font-semibold">₹ 4,67,50,000</span>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold mb-3">Feature Importance</h3>
          <FeatureImportanceChart data={featureImportance} />
        </GlassCard>
      </div>
    </div>
  );
}
