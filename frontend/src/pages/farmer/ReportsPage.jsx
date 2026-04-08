import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, TrendingUp, Calendar, MapPin, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, Skeleton } from '../../components/UI';
import { ComparisonBarChart, TrendLineChart } from '../../components/ChartComponent';
import { landService } from '../../services/api';
import { formatCurrency, formatDate, getStatusClass } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const { user } = useAuth();
  const [lands, setLands] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLands();
  }, []);

  const loadLands = async () => {
    setLoading(true);
    try {
      const data = await landService.getLands();
      setLands(data);
      if (data.length > 0) setSelected(data[0]);
    } catch {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    toast.success('Report downloaded as PDF (demo)');
  };

  const trendData = selected ? [
    { year: '2020', value: Math.round(selected.mlValue * 0.72) },
    { year: '2021', value: Math.round(selected.mlValue * 0.79) },
    { year: '2022', value: Math.round(selected.mlValue * 0.86) },
    { year: '2023', value: Math.round(selected.mlValue * 0.92) },
    { year: '2024', value: Math.round(selected.mlValue * 0.97) },
    { year: '2025', value: selected.mlValue },
  ] : [];

  return (
    <div className="space-y-6 max-w-7xl">
      <PageHeader
        title="Compensation Reports"
        subtitle="View detailed ML analysis reports for all your submitted lands"
        action={
          selected && (
            <button onClick={handleDownload} className="btn-primary">
              <Download size={15} /> Download PDF
            </button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Land list */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Your Submissions</p>
          {loading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)
          ) : lands.map(land => (
            <motion.button
              key={land.id}
              onClick={() => setSelected(land)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full text-left card p-4 border-2 transition-all ${selected?.id === land.id ? 'border-primary-500 shadow-glow' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-600'}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">{land.location}</p>
                <span className={`badge ${getStatusClass(land.status)} shrink-0`}>{land.status}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Leaf size={11} /> {land.cropType}</span>
                <span>{land.size} acres</span>
              </div>
              <p className="text-sm font-bold text-primary-600 dark:text-primary-400 mt-2">{formatCurrency(land.mlValue)}</p>
            </motion.button>
          ))}
          {!loading && lands.length === 0 && (
            <div className="card p-8 text-center text-slate-400">
              <FileText size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No submissions yet</p>
            </div>
          )}
        </div>

        {/* Report detail */}
        {selected ? (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Report header */}
            <div className="card p-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/10 dark:to-blue-900/10 border border-primary-100/50 dark:border-primary-800/20">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-display font-bold text-xl text-slate-800 dark:text-white">{selected.location}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><MapPin size={13} /> {selected.size} acres</span>
                    <span className="flex items-center gap-1"><Leaf size={13} /> {selected.cropType}</span>
                    <span className="flex items-center gap-1"><Calendar size={13} /> {formatDate(selected.submittedAt)}</span>
                  </div>
                </div>
                <span className={`badge text-sm px-3 py-1 ${getStatusClass(selected.status)}`}>
                  {selected.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Value comparison */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Government Rate', value: formatCurrency(selected.govtValue), color: 'text-blue-600 dark:text-blue-400' },
                { label: 'ML Predicted', value: formatCurrency(selected.mlValue), color: 'text-primary-600 dark:text-primary-400' },
                { label: 'Difference', value: `+${(((selected.mlValue - selected.govtValue) / selected.govtValue) * 100).toFixed(1)}%`, color: 'text-amber-600 dark:text-amber-400' },
              ].map(v => (
                <div key={v.label} className="card p-4 text-center">
                  <p className="text-xs text-slate-400 mb-1">{v.label}</p>
                  <p className={`font-display font-bold text-lg ${v.color}`}>{v.value}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card p-4">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-white mb-3">Value Comparison</h4>
                <ComparisonBarChart govtValue={selected.govtValue} mlValue={selected.mlValue} />
              </div>
              <div className="card p-4">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-white mb-3 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-primary-500" /> 5-Year Trend
                </h4>
                <TrendLineChart data={trendData} />
              </div>
            </div>

            {/* Land details */}
            <div className="card p-5">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-white mb-4">Land Details</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Soil Type', value: selected.soilType },
                  { label: 'Crop Type', value: selected.cropType },
                  { label: 'Land Size', value: `${selected.size} acres` },
                  { label: 'Infrastructure', value: selected.infrastructure },
                  { label: 'Submitted', value: formatDate(selected.submittedAt) },
                  { label: 'Farmer', value: selected.farmerName },
                ].map(d => (
                  <div key={d.label}>
                    <p className="text-xs text-slate-400 mb-0.5">{d.label}</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Explanation */}
            <div className="card p-5 border-l-4 border-primary-500">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-white mb-2 flex items-center gap-2">
                🤖 AI Analysis Explanation
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{selected.explanation}</p>
            </div>

            {/* Download */}
            <button onClick={handleDownload} className="btn-primary w-full justify-center py-3">
              <Download size={16} /> Download Full Report as PDF
            </button>
          </motion.div>
        ) : (
          <div className="lg:col-span-2 card p-16 text-center text-slate-400">
            <Eye size={40} className="mx-auto mb-3 opacity-20" />
            <p>Select a report from the left to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
