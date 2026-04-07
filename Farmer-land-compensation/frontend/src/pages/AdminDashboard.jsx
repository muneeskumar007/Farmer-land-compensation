import React from "react";
import GlassCard from "../components/GlassCard.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { cases, analytics } from "../data/mock.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

const pieColors = ["#51d1b5", "#f4b546", "#5b7cfa", "#f05252"];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animated-fade">
      <div className="grid gap-6 lg:grid-cols-3">
        <StatCard label="Total Cases" value="248" helper="Across all districts" />
        <StatCard label="Approved Value" value="₹128.4 Cr" helper="FY 2026" />
        <StatCard label="Avg Decision Time" value="14 days" helper="Target under 21 days" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h3 className="text-lg font-semibold mb-4">Compensation by District</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.compensationByDistrict}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#5b7cfa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold mb-4">Price Trends (₹ Cr)</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.priceTrends}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#51d1b5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <GlassCard>
          <h3 className="text-lg font-semibold mb-4">Latest Cases</h3>
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
                  <p className="text-sm font-semibold">₹ {item.compensation.toLocaleString()}</p>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold mb-4">Case Distribution</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.distribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                >
                  {analytics.distribution.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
