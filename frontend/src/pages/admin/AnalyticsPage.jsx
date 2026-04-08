import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, Map } from 'lucide-react';
import { PageHeader, StatCard } from '../../components/UI';
import { StatusPieChart, MonthlyBarChart, TrendLineChart } from '../../components/ChartComponent';
import { landService } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';

const MONTHLY = [
  { month: 'Sep', submissions: 22, approved: 16 },
  { month: 'Oct', submissions: 28, approved: 20 },
  { month: 'Nov', submissions: 35, approved: 25 },
  { month: 'Dec', submissions: 42, approved: 31 },
  { month: 'Jan', submissions: 38, approved: 28 },
  { month: 'Feb', submissions: 55, approved: 40 },
  { month: 'Mar', submissions: 62, approved: 48 },
];

const TREND = [
  { year: '2020', value: 580000 },
  { year: '2021', value: 640000 },
  { year: '2022', value: 720000 },
  { year: '2023', value: 820000 },
  { year: '2024', value: 940000 },
  { year: '2025', value: 1080000 },
];

const SOIL_DATA = [
  { name: 'Alluvial', value: 38 },
  { name: 'Black Cotton', value: 24 },
  { name: 'Red Laterite', value: 19 },
  { name: 'Sandy Loam', value: 12 },
  { name: 'Clay', value: 7 },
];

const DISTRICT_DATA = [
  { district: 'Thanjavur', count: 18, avgValue: 1100000 },
  { district: 'Madurai', count: 14, avgValue: 780000 },
  { district: 'Coimbatore', count: 12, avgValue: 1340000 },
  { district: 'Salem', count: 9, avgValue: 520000 },
  { district: 'Tirunelveli', count: 8, avgValue: 890000 },
];

export default function AnalyticsPage() {
  const [lands, setLands] = useState([]);

  useEffect(() => {
    landService.getLands().then(setLands).catch(() => {});
  }, []);

  const avgML = lands.length ? lands.reduce((a, l) => a + l.mlValue, 0) / lands.length : 0;
  const avgGovt = lands.length ? lands.reduce((a, l) => a + l.govtValue, 0) / lands.length : 0;
  const diffPct = avgGovt ? (((avgML - avgGovt) / avgGovt) * 100).toFixed(1) : 0;

  const pieStatus = [
    { name: 'Pending', value: lands.filter(l => l.status === 'pending').length },
    { name: 'Approved', value: lands.filter(l => l.status === 'approved').length },
    { name: 'Rejected', value: lands.filter(l => l.status === 'rejected').length },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <PageHeader title="Analytics" subtitle="System-wide insights on land compensation data" />

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Avg ML Value', value: formatCurrency(avgML), icon: TrendingUp, color: 'primary', trend: 8.4 },
          { title: 'Avg Govt. Rate', value: formatCurrency(avgGovt), icon: BarChart3, color: 'blue' },
          { title: 'ML vs Govt. Diff', value: `+${diffPct}%`, icon: TrendingUp, color: 'amber' },
          { title: 'Total Districts', value: '28', icon: Map, color: 'purple' },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="lg:col-span-2 card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Monthly Submissions & Approvals</h3>
          <MonthlyBarChart data={MONTHLY} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Request Status</h3>
          <StatusPieChart data={pieStatus} />
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Average Land Value Trend</h3>
          <TrendLineChart data={TREND} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Soil Type Distribution</h3>
          <StatusPieChart data={SOIL_DATA} />
        </motion.div>
      </div>

      {/* District table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="card p-6">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Top Districts by Submissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                {['District', 'Submissions', 'Avg. ML Value', 'Activity'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/40">
              {DISTRICT_DATA.map((d, i) => (
                <motion.tr
                  key={d.district}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-5">#{i + 1}</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{d.district}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-medium">{d.count}</td>
                  <td className="py-3 px-3 font-semibold text-primary-600 dark:text-primary-400">{formatCurrency(d.avgValue)}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden max-w-24">
                        <div
                          className="h-full bg-primary-500 rounded-full"
                          style={{ width: `${(d.count / 18) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{Math.round((d.count / 18) * 100)}%</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
