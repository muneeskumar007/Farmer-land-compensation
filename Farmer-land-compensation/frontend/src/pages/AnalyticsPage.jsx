import React from "react";
import GlassCard from "../components/GlassCard.jsx";
import { analytics } from "../data/mock.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animated-fade">
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h3 className="text-lg font-semibold mb-4">Compensation vs District</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.compensationByDistrict}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#51d1b5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold mb-4">Price Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.priceTrends}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#5b7cfa" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
