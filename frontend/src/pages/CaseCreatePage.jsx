import React, { useState } from "react";
import GlassCard from "../components/GlassCard.jsx";
import MapDraw from "../components/MapDraw.jsx";
import { useToast } from "../providers/ToastProvider.jsx";

export default function CaseCreatePage() {
  const { push } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      push("Case created and drafted.", "success");
    }, 900);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr] animated-fade">
      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">Create Land Case</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">State</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm dark:border-slate-700 dark:bg-ink-800"
                placeholder="Maharashtra"
              />
            </div>
            <div>
              <label className="text-sm font-medium">District</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm dark:border-slate-700 dark:bg-ink-800"
                placeholder="Pune"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Land Area (acres)</label>
              <input
                type="number"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm dark:border-slate-700 dark:bg-ink-800"
                placeholder="12.5"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Irrigation Type</label>
              <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm dark:border-slate-700 dark:bg-ink-800">
                <option>canal</option>
                <option>drip</option>
                <option>rainfed</option>
                <option>borewell</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Crop Type</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm dark:border-slate-700 dark:bg-ink-800"
              placeholder="Paddy"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-mint-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : "Create Case"}
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Predict Compensation
            </button>
          </div>
        </form>
      </GlassCard>
      <MapDraw readOnly={false} />
    </div>
  );
}
