import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ClipboardList, TrendingUp, CheckCircle, Clock, XCircle, BarChart3, ArrowUpRight } from 'lucide-react';
import { StatCard, PageHeader, Skeleton } from '../../components/UI';
import { StatusPieChart, MonthlyBarChart } from '../../components/ChartComponent';
import { landService } from '../../services/api';
import { formatCurrency, formatDate, getStatusClass } from '../../utils/helpers';

const MONTHLY_DATA = [
  { month: 'Oct', submissions: 28, approved: 20 },
  { month: 'Nov', submissions: 35, approved: 25 },
  { month: 'Dec', submissions: 42, approved: 31 },
  { month: 'Jan', submissions: 38, approved: 28 },
  { month: 'Feb', submissions: 55, approved: 40 },
  { month: 'Mar', submissions: 62, approved: 48 },
];

export default function AdminDashboard() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await landService.getLands();
      setLands(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  const pending = lands.filter(l => l.status === 'pending').length;
  const approved = lands.filter(l => l.status === 'approved').length;
  const rejected = lands.filter(l => l.status === 'rejected').length;
  const totalML = lands.reduce((a, l) => a + (l.mlValue || 0), 0);

  const STATS = [
    { title: 'Total Requests', value: lands.length, icon: ClipboardList, color: 'blue', trend: 12 },
    { title: 'Approved', value: approved, icon: CheckCircle, color: 'primary', trend: 8 },
    { title: 'Pending Review', value: pending, icon: Clock, color: 'amber' },
    { title: 'Total ML Value', value: formatCurrency(totalML), icon: TrendingUp, color: 'purple' },
  ];

  const pieData = [
    { name: 'Pending', value: pending },
    { name: 'Approved', value: approved },
    { name: 'Rejected', value: rejected },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Monitor and manage all farmer land compensation requests"
        action={
          <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-700 dark:text-primary-400 text-sm font-semibold">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            Live System
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28" />)
          : STATS.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <StatCard {...s} />
            </motion.div>
          ))
        }
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-white">Monthly Submissions</h3>
            <span className="badge badge-green">↑ 12.5% this month</span>
          </div>
          <MonthlyBarChart data={MONTHLY_DATA} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-5"
        >
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Request Status</h3>
          {!loading && <StatusPieChart data={pieData} />}
          <div className="space-y-2 mt-3">
            {[
              { label: 'Pending', val: pending, color: 'bg-yellow-400' },
              { label: 'Approved', val: approved, color: 'bg-primary-500' },
              { label: 'Rejected', val: rejected, color: 'bg-red-400' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                  <span className="text-slate-500 dark:text-slate-400">{s.label}</span>
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{s.val}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent requests */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-slate-800 dark:text-white">Recent Requests</h3>
          <a href="/admin/requests" className="text-sm text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1 hover:underline">
            View All <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                {['Farmer', 'Location', 'Size', 'ML Value', 'Govt. Value', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/40">
              {loading
                ? [1, 2, 3].map(i => (
                  <tr key={i}><td colSpan={7} className="py-3 px-3"><Skeleton className="h-6" /></td></tr>
                ))
                : lands.slice(0, 5).map(land => (
                  <tr key={land.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {land.farmerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{land.farmerName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 max-w-32 truncate">{land.location}</td>
                    <td className="py-3 px-3 text-slate-500">{land.size} ac</td>
                    <td className="py-3 px-3 font-semibold text-primary-600 dark:text-primary-400 whitespace-nowrap">{formatCurrency(land.mlValue)}</td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{formatCurrency(land.govtValue)}</td>
                    <td className="py-3 px-3">
                      <span className={`badge ${getStatusClass(land.status)}`}>{land.status}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{formatDate(land.submittedAt)}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
