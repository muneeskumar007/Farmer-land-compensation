import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, TrendingUp, Clock, CheckCircle, FileText,
  MapPin, Send, Info, Sparkles, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { InputField, SelectField, StatCard, PageHeader } from '../../components/UI';
import { ComparisonBarChart, TrendLineChart } from '../../components/ChartComponent';
import { landService } from '../../services/api';
import { formatCurrency, saveFormDraft, loadFormDraft, clearFormDraft } from '../../utils/helpers';
import toast from 'react-hot-toast';

const SOIL_TYPES = ['Alluvial', 'Black Cotton', 'Red Laterite', 'Sandy Loam', 'Clay', 'Loamy'];
const CROP_TYPES = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Groundnut', 'Banana', 'Mango', 'Vegetables', 'Pulses'];
const INFRA_OPTIONS = [
  { value: 'None', label: 'None' },
  { value: 'Highway', label: 'National/State Highway' },
  { value: 'Railway', label: 'Railway Line' },
  { value: 'Both', label: 'Both Highway & Railway' },
];

const INITIAL_FORM = { location: '', lat: '', lng: '', size: '', soilType: '', cropType: '', infrastructure: 'None', description: '' };

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [form, setForm] = useState(() => loadFormDraft('farmer_land') || INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [myLands, setMyLands] = useState([]);

  useEffect(() => {
    loadMyLands();
  }, []);

  useEffect(() => {
    saveFormDraft('farmer_land', form);
  }, [form]);

  const loadMyLands = async () => {
    try {
      const lands = await landService.getLands();
      setMyLands(lands.filter(l => l.farmerId === user?.id || true).slice(0, 3));
    } catch {}
  };

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.size || isNaN(form.size) || +form.size <= 0) e.size = 'Enter valid land size';
    if (!form.soilType) e.soilType = 'Select soil type';
    if (!form.cropType) e.cropType = 'Select crop type';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await landService.predict({ ...form, farmerName: user?.name });
      setResult(res);
      clearFormDraft('farmer_land');
      toast.success('Compensation predicted successfully!');
    } catch (err) {
      toast.error('Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const STATS = [
    { title: 'Total Submissions', value: myLands.length, icon: FileText, color: 'blue' },
    { title: 'Approved', value: myLands.filter(l => l.status === 'approved').length, icon: CheckCircle, color: 'primary' },
    { title: 'Pending', value: myLands.filter(l => l.status === 'pending').length, icon: Clock, color: 'amber' },
    { title: 'Avg ML Value', value: myLands.length ? formatCurrency(myLands.reduce((a, l) => a + l.mlValue, 0) / myLands.length) : '₹0', icon: TrendingUp, color: 'purple' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 p-6 text-white"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-primary-200 text-sm font-medium mb-1">Good morning 🌅</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl">{user?.name}</h2>
            <p className="text-primary-200 mt-1 text-sm">Submit your land details to get a fair ML-powered compensation estimate.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/15 rounded-xl px-4 py-3 backdrop-blur">
            <Leaf size={20} className="text-primary-200" />
            <div>
              <p className="text-xs text-primary-200">Your Location</p>
              <p className="font-semibold text-sm">{user?.location || 'Not set'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Land Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-3"
        >
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                <MapPin size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">Land Details</h3>
                <p className="text-sm text-slate-400">Enter your land information for ML prediction</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Land Location / Village Name"
                id="location"
                placeholder="e.g. Papanasam, Thanjavur, Tamil Nadu"
                icon={MapPin}
                value={form.location}
                onChange={set('location')}
                error={errors.location}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Latitude (optional)" id="lat" type="number" step="any"
                  placeholder="e.g. 10.787" value={form.lat} onChange={set('lat')} />
                <InputField label="Longitude (optional)" id="lng" type="number" step="any"
                  placeholder="e.g. 79.139" value={form.lng} onChange={set('lng')} />
              </div>

              <InputField
                label="Land Size"
                id="size"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="e.g. 5.2"
                suffix="acres"
                value={form.size}
                onChange={set('size')}
                error={errors.size}
              />

              <div className="grid grid-cols-2 gap-4">
                <SelectField label="Soil Type" id="soilType" options={SOIL_TYPES}
                  value={form.soilType} onChange={set('soilType')} error={errors.soilType} />
                <SelectField label="Primary Crop" id="cropType" options={CROP_TYPES}
                  value={form.cropType} onChange={set('cropType')} error={errors.cropType} />
              </div>

              <SelectField
                label="Nearby Infrastructure"
                id="infrastructure"
                options={INFRA_OPTIONS}
                value={form.infrastructure}
                onChange={set('infrastructure')}
              />

              <div>
                <label className="label">Additional Description (optional)</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={set('description')}
                  placeholder="Any additional details about the land, water sources, existing structures, etc."
                  className="input-field resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setForm(INITIAL_FORM); clearFormDraft('farmer_land'); }}
                  className="btn-secondary flex-1 justify-center">
                  Clear
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-[2] justify-center py-3">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing with AI...
                    </span>
                  ) : (
                    <><Sparkles size={16} /> Get ML Prediction</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Results panel */}
        <div className="xl:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="card p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 border-4 border-primary-100 dark:border-primary-900/30 rounded-full" />
                  <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="font-semibold text-slate-700 dark:text-white">Analyzing land data...</p>
                <p className="text-sm text-slate-400 mt-1">Our ML model is processing 40+ parameters</p>
                <div className="mt-4 space-y-2">
                  {['Soil quality analysis', 'Infrastructure scoring', 'Market rate lookup', 'Final valuation'].map((s, i) => (
                    <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.4 }}
                      className="text-xs text-slate-400 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                      {s}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Value cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="card p-4 border-l-4 border-blue-500">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Govt. Rate</p>
                    <p className="font-display font-bold text-xl text-slate-800 dark:text-white">{formatCurrency(result.govtValue)}</p>
                  </div>
                  <div className="card p-4 border-l-4 border-primary-500">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">ML Prediction</p>
                    <p className="font-display font-bold text-xl text-primary-600 dark:text-primary-400">{formatCurrency(result.mlValue)}</p>
                  </div>
                </div>

                {/* Confidence */}
                <div className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Model Confidence</span>
                    <span className="font-bold text-primary-600 dark:text-primary-400">{result.confidence}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                    />
                  </div>
                </div>

                {/* Comparison Chart */}
                <div className="card p-4">
                  <h4 className="font-semibold text-sm text-slate-700 dark:text-white mb-3 flex items-center gap-2">
                    <BarChart3 size={15} className="text-primary-500" /> Value Comparison
                  </h4>
                  <ComparisonBarChart govtValue={result.govtValue} mlValue={result.mlValue} />
                </div>

                {/* Trend Chart */}
                {result.historicalTrend && (
                  <div className="card p-4">
                    <h4 className="font-semibold text-sm text-slate-700 dark:text-white mb-3 flex items-center gap-2">
                      <TrendingUp size={15} className="text-primary-500" /> Historical Trend
                    </h4>
                    <TrendLineChart data={result.historicalTrend} />
                  </div>
                )}

                {/* AI Explanation */}
                <div className="card p-4 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/30">
                  <div className="flex items-start gap-2.5">
                    <Info size={16} className="text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-1.5">AI Reasoning</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{result.explanation}</p>
                    </div>
                  </div>
                </div>

                {/* Factors */}
                {result.factors && (
                  <div className="card p-4">
                    <p className="text-sm font-semibold text-slate-700 dark:text-white mb-3">Key Factors</p>
                    <div className="space-y-2.5">
                      {result.factors.map(f => (
                        <div key={f.name} className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 dark:text-slate-400 w-28 shrink-0">{f.name}</span>
                          <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${f.weight}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className="h-full bg-primary-500 rounded-full"
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 w-8 text-right">{f.weight}%</span>
                          <span className={`text-xs font-semibold w-14 text-right ${f.impact === 'High' ? 'text-primary-600' : f.impact === 'Medium' ? 'text-amber-600' : 'text-red-500'}`}>
                            {f.impact}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {!result && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700"
              >
                <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={24} className="text-primary-500" />
                </div>
                <p className="font-semibold text-slate-700 dark:text-white">Ready for Prediction</p>
                <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">Fill in your land details and click "Get ML Prediction" to see the AI-powered compensation estimate.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Recent submissions */}
      {myLands.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">Recent Submissions</h3>
              <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium flex items-center gap-1">
                View All <ChevronRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    {['Location', 'Size', 'ML Value', 'Govt. Value', 'Status', 'Date'].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {myLands.map(land => (
                    <tr key={land.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">{land.location}</td>
                      <td className="py-3 px-3 text-slate-500">{land.size} ac</td>
                      <td className="py-3 px-3 font-semibold text-primary-600 dark:text-primary-400">{formatCurrency(land.mlValue)}</td>
                      <td className="py-3 px-3 text-slate-500">{formatCurrency(land.govtValue)}</td>
                      <td className="py-3 px-3">
                        <span className={`badge ${land.status === 'approved' ? 'badge-green' : land.status === 'rejected' ? 'badge-red' : 'badge-yellow'}`}>
                          {land.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">{land.submittedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Missing import fix
function BarChart3({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}
