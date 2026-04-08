import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Leaf, User, Mail, Phone, MapPin, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { InputField, SelectField } from '../components/UI';
import toast from 'react-hot-toast';

const STATES = ['Andhra Pradesh','Bihar','Gujarat','Haryana','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '', email: '', phone: '', state: '', district: '',
    password: '', confirm: '', agreeTerms: false,
  });

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
    setErrors(er => ({ ...er, [field]: '' }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone) e.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit mobile number';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.state) e.state = 'State is required';
    if (!form.district.trim()) e.district = 'District is required';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to the terms';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    try {
      await signup({
        name: form.name, email: form.email, phone: form.phone,
        location: `${form.district}, ${form.state}`,
      });
      toast.success('Account created! Welcome to AgriComp 🌱');
      navigate('/farmer');
    } catch (err) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-primary-500', 'bg-primary-600'][strength];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 mb-8 transition-colors">
          <ArrowLeft size={15} /> Back to home
        </Link>

        <div className="card p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-white">Farmer Registration</h1>
              <p className="text-sm text-slate-400">AgriComp · Land Compensation Portal</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                  {step > s ? <CheckCircle size={16} /> : s}
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-semibold ${step >= s ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`}>
                    {s === 1 ? 'Personal Info' : 'Location & Security'}
                  </p>
                </div>
                {s < 2 && <div className={`h-0.5 flex-1 mx-1 rounded ${step > s ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`} />}
              </div>
            ))}
          </div>

          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <InputField label="Full Name" id="name" type="text" placeholder="e.g. Rajesh Kumar"
                icon={User} value={form.name} onChange={set('name')} error={errors.name} />
              <InputField label="Email Address" id="email" type="email" placeholder="you@example.com"
                icon={Mail} value={form.email} onChange={set('email')} error={errors.email} />
              <InputField label="Mobile Number" id="phone" type="tel" placeholder="9876543210"
                icon={Phone} value={form.phone} onChange={set('phone')} error={errors.phone} />
              <button onClick={handleNext} className="btn-primary w-full justify-center py-3 text-base mt-2">
                Continue →
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <SelectField label="State" id="state" options={STATES} value={form.state}
                onChange={set('state')} error={errors.state} />
              <InputField label="District" id="district" type="text" placeholder="e.g. Thanjavur"
                icon={MapPin} value={form.district} onChange={set('district')} error={errors.district} />

              <div>
                <label htmlFor="password" className="label">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input id="password" type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                    value={form.password} onChange={set('password')}
                    className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`} />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-slate-200 dark:bg-slate-700'}`} />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${strengthColor.replace('bg-', 'text-')}`}>{strengthLabel}</p>
                  </div>
                )}
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <InputField label="Confirm Password" id="confirm" type="password" placeholder="••••••••"
                icon={Lock} value={form.confirm} onChange={set('confirm')} error={errors.confirm} />

              <div>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={form.agreeTerms} onChange={set('agreeTerms')}
                    className="mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    I agree to the{' '}
                    <a href="#" className="text-primary-600 hover:underline font-medium">Terms & Conditions</a>
                    {' '}and{' '}
                    <a href="#" className="text-primary-600 hover:underline font-medium">Privacy Policy</a>
                  </span>
                </label>
                {errors.agreeTerms && <p className="mt-1 text-xs text-red-500">{errors.agreeTerms}</p>}
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center py-3">
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3 text-base">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : 'Create Account'}
                </button>
              </div>
            </motion.form>
          )}

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
