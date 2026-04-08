import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Filter, Calendar, Search } from 'lucide-react';
import { PageHeader } from '../../components/UI';
import { landService } from '../../services/api';
import { formatCurrency, formatDate, getStatusClass } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminReportsPage() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    landService.getLands().then(data => { setLands(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = lands.filter(l => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (dateFrom && l.submittedAt < dateFrom) return false;
    if (dateTo && l.submittedAt > dateTo) return false;
    return true;
  });

  const totalML = filtered.reduce((a, l) => a + l.mlValue, 0);
  const totalGovt = filtered.reduce((a, l) => a + l.govtValue, 0);

  return (
    <div className="space-y-6 max-w-7xl">
      <PageHeader
        title="System Reports"
        subtitle="Generate and download compensation reports"
        action={
          <button onClick={() => toast.success('Report generated! Downloading... (demo)')} className="btn-primary">
            <Download size={15} /> Export All as PDF
          </button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: filtered.length },
          { label: 'Total ML Value', value: formatCurrency(totalML) },
          { label: 'Total Govt. Value', value: formatCurrency(totalGovt) },
          { label: 'Avg Difference', value: `+${totalGovt ? (((totalML - totalGovt) / totalGovt) * 100).toFixed(1) : 0}%` },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className="font-display font-bold text-lg text-slate-800 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-slate-400" />
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            className="input-field py-2 text-sm" placeholder="From date" />
          <span className="text-slate-400 text-sm">to</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            className="input-field py-2 text-sm" />
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
          {['all', 'pending', 'approved', 'rejected'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${statusFilter === s ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400'}`}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => { setDateFrom(''); setDateTo(''); setStatusFilter('all'); }}
          className="btn-ghost text-sm py-1.5">Clear Filters</button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-white">{filtered.length} Records</h3>
          <button onClick={() => toast.success('CSV export started (demo)')} className="btn-secondary text-xs py-1.5 px-3">
            <Download size={13} /> CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-800/30">
              <tr>
                {['Farmer', 'Location', 'Size', 'Soil', 'Crop', 'Infra', 'Govt. Value', 'ML Value', 'Difference', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left py-2.5 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/40">
              {loading
                ? [1, 2, 3].map(i => <tr key={i}><td colSpan={11} className="px-4 py-3"><div className="skeleton h-6 w-full" /></td></tr>)
                : filtered.map(land => {
                  const diff = (((land.mlValue - land.govtValue) / land.govtValue) * 100).toFixed(1);
                  return (
                    <tr key={land.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{land.farmerName}</td>
                      <td className="py-3 px-4 text-slate-500 max-w-28 truncate">{land.location}</td>
                      <td className="py-3 px-4 text-slate-500">{land.size}</td>
                      <td className="py-3 px-4 text-slate-500">{land.soilType}</td>
                      <td className="py-3 px-4 text-slate-500">{land.cropType}</td>
                      <td className="py-3 px-4 text-slate-500">{land.infrastructure}</td>
                      <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap">{formatCurrency(land.govtValue)}</td>
                      <td className="py-3 px-4 text-primary-600 dark:text-primary-400 font-semibold whitespace-nowrap">{formatCurrency(land.mlValue)}</td>
                      <td className={`py-3 px-4 font-semibold ${+diff > 0 ? 'text-primary-600' : 'text-red-500'}`}>
                        {+diff > 0 ? '+' : ''}{diff}%
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${getStatusClass(land.status)}`}>{land.status}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{formatDate(land.submittedAt)}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
