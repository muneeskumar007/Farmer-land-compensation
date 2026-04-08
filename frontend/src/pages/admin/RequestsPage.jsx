import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, CheckCircle, XCircle, Eye, ChevronLeft, ChevronRight,
  SortAsc, Download, RefreshCw
} from 'lucide-react';
import { PageHeader, Skeleton } from '../../components/UI';
import { landService } from '../../services/api';
import { formatCurrency, formatDate, getStatusClass } from '../../utils/helpers';
import toast from 'react-hot-toast';

const PAGE_SIZE = 5;

export default function RequestsPage() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await landService.getLands();
      setLands(data);
    } catch {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let result = [...lands];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.farmerName.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.cropType.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') result = result.filter(l => l.status === statusFilter);
    if (sortBy === 'date') result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    if (sortBy === 'value') result.sort((a, b) => b.mlValue - a.mlValue);
    if (sortBy === 'name') result.sort((a, b) => a.farmerName.localeCompare(b.farmerName));
    return result;
  }, [lands, search, statusFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAction = async (id, status) => {
    setActionLoading(`${id}-${status}`);
    try {
      await landService.updateStatus(id, status);
      setLands(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      toast.success(`Request ${status} successfully`);
      if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
    } catch {
      toast.error('Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <PageHeader
        title="Land Requests"
        subtitle={`${filtered.length} total · ${lands.filter(l => l.status === 'pending').length} pending review`}
        action={
          <button onClick={loadData} className="btn-secondary">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        }
      />

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search farmer, location, crop..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10 py-2.5"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
            {['all', 'pending', 'approved', 'rejected'].map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${statusFilter === s ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SortAsc size={14} className="text-slate-400" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="input-field py-2 text-sm w-auto">
            <option value="date">Newest First</option>
            <option value="value">Highest Value</option>
            <option value="name">Farmer Name</option>
          </select>
        </div>

        <button onClick={() => toast.success('Export started (demo)')} className="btn-secondary py-2">
          <Download size={14} /> Export
        </button>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Table */}
        <div className="xl:col-span-3">
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                  <tr>
                    {['Farmer', 'Location', 'ML Value', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/40">
                  {loading
                    ? [1, 2, 3, 4, 5].map(i => (
                      <tr key={i}>
                        <td colSpan={5} className="px-4 py-3"><Skeleton className="h-8" /></td>
                      </tr>
                    ))
                    : paginated.map(land => (
                      <motion.tr
                        key={land.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`group cursor-pointer transition-colors ${selected?.id === land.id ? 'bg-primary-50/50 dark:bg-primary-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
                        onClick={() => setSelected(land)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {land.farmerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{land.farmerName}</p>
                              <p className="text-xs text-slate-400">{formatDate(land.submittedAt)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 max-w-32">
                          <p className="truncate">{land.location}</p>
                          <p className="text-xs text-slate-400">{land.size} acres · {land.soilType}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-primary-600 dark:text-primary-400 whitespace-nowrap">{formatCurrency(land.mlValue)}</p>
                          <p className="text-xs text-slate-400">{formatCurrency(land.govtValue)} govt</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`badge ${getStatusClass(land.status)}`}>{land.status}</span>
                        </td>
                        <td className="py-3 px-4">
                          {land.status === 'pending' ? (
                            <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => handleAction(land.id, 'approved')}
                                disabled={!!actionLoading}
                                className="p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors disabled:opacity-50"
                                title="Approve"
                              >
                                {actionLoading === `${land.id}-approved`
                                  ? <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                  : <CheckCircle size={16} />}
                              </button>
                              <button
                                onClick={() => handleAction(land.id, 'rejected')}
                                disabled={!!actionLoading}
                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                title="Reject"
                              >
                                {actionLoading === `${land.id}-rejected`
                                  ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                  : <XCircle size={16} />}
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  }
                  {!loading && paginated.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-16 text-slate-400">
                        <Search size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No requests found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors">
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div className="xl:col-span-2">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="card p-5 space-y-4 sticky top-24"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 dark:text-white">Request Details</h3>
                  <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <XCircle size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white font-bold text-lg">
                    {selected.farmerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{selected.farmerName}</p>
                    <span className={`badge ${getStatusClass(selected.status)}`}>{selected.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-400 mb-0.5">Govt. Value</p>
                    <p className="font-bold text-blue-600 dark:text-blue-400 text-sm">{formatCurrency(selected.govtValue)}</p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-400 mb-0.5">ML Value</p>
                    <p className="font-bold text-primary-600 dark:text-primary-400 text-sm">{formatCurrency(selected.mlValue)}</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-sm">
                  {[
                    ['Location', selected.location],
                    ['Size', `${selected.size} acres`],
                    ['Soil Type', selected.soilType],
                    ['Crop Type', selected.cropType],
                    ['Infrastructure', selected.infrastructure],
                    ['Submitted', formatDate(selected.submittedAt)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3">
                      <span className="text-slate-400 shrink-0">{k}</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 text-right">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">AI Reasoning</p>
                  {selected.explanation}
                </div>

                {selected.status === 'pending' && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleAction(selected.id, 'rejected')}
                      disabled={!!actionLoading}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={15} /> Reject
                    </button>
                    <button
                      onClick={() => handleAction(selected.id, 'approved')}
                      disabled={!!actionLoading}
                      className="flex-1 btn-primary justify-center"
                    >
                      <CheckCircle size={15} /> Approve
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card p-12 text-center text-slate-400"
              >
                <Eye size={36} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">Click a request to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
