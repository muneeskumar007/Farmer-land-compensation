import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Shield, BarChart3, MapPin, ArrowRight, Leaf,
  CheckCircle, Users, TrendingUp, Award, ChevronRight,
  Zap, Globe, Lock
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

const FEATURES = [
  { icon: Brain, title: 'AI-Powered Prediction', desc: 'Advanced machine learning models analyze soil quality, location, infrastructure proximity, and crop patterns to deliver fair, data-driven valuations.', color: 'primary' },
  { icon: Shield, title: 'Transparent & Fair', desc: 'Every prediction comes with a full explanation of the factors considered — no hidden algorithms, no bias, just clear reasoning.', color: 'blue' },
  { icon: BarChart3, title: 'Instant Analytics', desc: 'Compare government circle rates with ML predictions side by side. Understand the difference and make informed decisions.', color: 'amber' },
  { icon: MapPin, title: 'Map-Based Selection', desc: 'Pinpoint your exact land location using our interactive map. Spatial data improves prediction accuracy significantly.', color: 'purple' },
  { icon: Zap, title: 'Instant Results', desc: 'Get your compensation estimate in seconds, not weeks. Our system processes land data in real-time for quick decisions.', color: 'red' },
  { icon: Lock, title: 'Govt-Grade Security', desc: 'Your data is encrypted and handled with the highest security standards. Compliant with Indian government data regulations.', color: 'teal' },
];

const STATS = [
  { value: '12,400+', label: 'Farmers Served', icon: Users },
  { value: '₹840Cr+', label: 'Fair Value Ensured', icon: TrendingUp },
  { value: '97.3%', label: 'Prediction Accuracy', icon: Award },
  { value: '18 States', label: 'Pan-India Coverage', icon: Globe },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Register & Login', desc: 'Create your farmer account securely in under 2 minutes.' },
  { step: '02', title: 'Enter Land Details', desc: 'Provide soil type, crop, size, and select location on map.' },
  { step: '03', title: 'AI Analysis', desc: 'Our ML model processes 40+ parameters to estimate fair value.' },
  { step: '04', title: 'Receive Report', desc: 'Download your full compensation report with AI reasoning.' },
];

const colorMap = {
  primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  teal: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Leaf size={18} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-slate-900 dark:text-white text-lg">AgriComp</span>
              <span className="hidden sm:inline text-xs text-slate-400 ml-2">by Govt. of India</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost hidden sm:inline-flex text-slate-700 dark:text-slate-300">Log In</Link>
            <Link to="/signup" className="btn-primary shadow-primary-500/25 shadow-lg">
              Get Started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4">
        {/* Background */}
        <div className="absolute inset-0 hero-grid opacity-60" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl translate-x-1/2" />

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800/30 text-primary-700 dark:text-primary-400 text-sm font-semibold mb-8">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              AI-Powered Land Compensation System
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-slate-900 dark:text-white leading-tight mb-6">
              Fair Compensation for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
                Every Farmer
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Our intelligent ML system analyzes soil quality, infrastructure, and market data to ensure you receive the true value of your land — transparent, fast, and bias-free.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="btn-primary text-base px-8 py-4 shadow-lg shadow-primary-500/30 hover:scale-105 transition-transform">
                Start Free Assessment <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-secondary text-base px-8 py-4 hover:scale-105 transition-transform">
                I have an account
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-slate-500">
              {['No registration fee', 'Instant predictions', 'Govt. recognized'].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-primary-500" /> {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-20 max-w-4xl mx-auto"
          >
            <div className="relative bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-slate-400 font-mono">AgriComp Dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Govt. Value', val: '₹8.5L', color: 'bg-blue-500' },
                  { label: 'ML Prediction', val: '₹11.2L', color: 'bg-primary-500' },
                  { label: 'Difference', val: '+32%', color: 'bg-amber-500' },
                ].map(c => (
                  <div key={c.label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 text-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${c.color} mx-auto mb-2`} />
                    <p className="text-lg font-bold text-slate-800 dark:text-white">{c.val}</p>
                    <p className="text-xs text-slate-400">{c.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 h-20 items-end px-4">
                {[40, 55, 50, 70, 65, 85, 80, 95, 88, 100].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.8 + i * 0.06, duration: 0.4 }}
                    className={`flex-1 rounded-t-md ${i % 2 === 0 ? 'bg-primary-400/70' : 'bg-blue-400/70'}`}
                  />
                ))}
              </div>
              <div className="mt-2 text-center text-xs text-slate-400">Historical Value Trend (2015–2025)</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-4 bg-primary-600 dark:bg-primary-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <Icon size={24} className="text-primary-200 mx-auto mb-2" />
              <p className="font-display font-bold text-3xl text-white">{value}</p>
              <p className="text-primary-200 text-sm mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Why AgriComp</span>
            <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white mt-2 mb-4">Built for Farmers, Backed by Science</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Every feature is designed to bring transparency and fairness to land acquisition — using the latest in machine learning.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="card p-6 hover:shadow-card-hover cursor-default"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colorMap[color]}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-display font-semibold text-lg text-slate-800 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">How It Works</span>
            <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white mt-2">Simple 4-Step Process</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative"
              >
                <div className="text-6xl font-display font-black text-primary-100 dark:text-primary-900/50 mb-3">{step}</div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <ChevronRight size={20} className="hidden lg:block absolute -right-3 top-8 text-slate-300 dark:text-slate-600" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center relative"
        >
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">Ready to Know Your Land's True Value?</h2>
          <p className="text-primary-200 text-lg mb-10">Join over 12,000 farmers who have already received fair compensation using our AI system.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all text-base shadow-xl hover:scale-105 active:scale-95">
              Register as Farmer <ArrowRight size={18} />
            </Link>
            <Link to="/login?role=admin" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500/30 backdrop-blur text-white border border-white/20 font-semibold rounded-xl hover:bg-primary-500/40 transition-all text-base hover:scale-105 active:scale-95">
              Government Login
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-4 bg-slate-900 dark:bg-slate-950 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
            <Leaf size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-white">AgriComp</span>
        </div>
        <p className="text-slate-500 text-sm">© 2025 AgriComp · Intelligent Land Compensation System · Government of India Initiative</p>
      </footer>
    </div>
  );
}
