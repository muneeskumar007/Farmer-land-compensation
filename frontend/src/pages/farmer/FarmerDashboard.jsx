import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, TrendingUp, Clock, CheckCircle, FileText, MapPin,
  Info, Sparkles, ChevronRight, Search, AlertCircle, BarChart3Icon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { InputField, SelectField, StatCard, PageHeader } from '../../components/UI';
import { ComparisonBarChart, TrendLineChart } from '../../components/ChartComponent';
import { landService } from '../../services/api';
import { pattaService } from '../../services/pattaService';
import { formatCurrency, saveFormDraft, loadFormDraft, clearFormDraft } from '../../utils/helpers';
import toast from 'react-hot-toast';

const INITIAL_FORM = { location:'', lat:'', lng:'', patta:'', chitta:'', size:'', soilType:'', cropType:'', infrastructure:'None', description:'' };

const SOIL_EN = ['Alluvial','Black Cotton','Red Laterite','Sandy Loam','Clay','Loamy'];
const SOIL_TA = ['வண்டல் மண்','கரிசல் மண்','சிவப்பு பாறை மண்','மணல் கலந்த மண்','களிமண்','பஞ்சு மண்'];

const CROP_EN = ['Rice','Wheat','Cotton','Sugarcane','Groundnut','Banana','Mango','Vegetables','Pulses'];
const CROP_TA = ['நெல்','கோதுமை','பருத்தி','கரும்பு','நிலக்கடலை','வாழை','மாம்பழம்','காய்கறிகள்','பருப்பு வகைகள்'];

function BarChart3({ size, className }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
}

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const [form, setForm] = useState(() => loadFormDraft('farmer_land') || INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pattaLoading, setPattaLoading] = useState(false);
  const [pattaData, setPattaData] = useState(null);
  const [result, setResult] = useState(null);
  const [myLands, setMyLands] = useState([]);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => { loadMyLands(); }, []);
  useEffect(() => { saveFormDraft('farmer_land', form); }, [form]);

  const loadMyLands = async () => {
    try { const l = await landService.getLands(); setMyLands(l.slice(0,3)); } catch {}
  };

  const set = (field) => (e) => { setForm(f => ({...f,[field]:e.target.value})); setErrors(er => ({...er,[field]:''})); };

  // Patta lookup — fills location, lat, lng, size automatically
  const handlePattaLookup = async () => {
    if (!form.patta.trim()) { toast.error(lang==='ta'?'பட்டா எண் உள்ளிடவும்':'Please enter Patta number'); return; }
    setPattaLoading(true);
    try {
      const res = await pattaService.lookup(form.patta.trim());
      if (res.found) {
        setPattaData(res);
        setForm(f => ({
          ...f,
          location: res.address,
          lat: String(res.coordinates.lat),
          lng: String(res.coordinates.lng),
          size: res.area !== 'Unknown' ? res.area.replace(' acres','') : f.size,
          chitta: res.surveyNo || f.chitta,
        }));
        toast.success(t('pattaDetected') + (res.approximate ? ' (தோராயம்/Approx)' : ''));
        setActiveStep(2);
      } else {
        toast.error(t('pattaError'));
      }
    } catch { toast.error(t('pattaError')); }
    finally { setPattaLoading(false); }
  };

  const validate = () => {
    const e = {};
    if (!form.location.trim()) e.location = lang==='ta'?'இடம் தேவை':'Location is required';
    if (!form.size || isNaN(form.size) || +form.size<=0) e.size = lang==='ta'?'சரியான அளவு உள்ளிடவும்':'Enter valid land size';
    if (!form.soilType) e.soilType = lang==='ta'?'மண் வகை தேர்ந்தெடுக்கவும்':'Select soil type';
    if (!form.cropType) e.cropType = lang==='ta'?'பயிர் வகை தேர்ந்தெடுக்கவும்':'Select crop type';
    setErrors(e); return !Object.keys(e).length;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true); setResult(null);
    try {
      const res = await landService.predict({...form, farmerName:user?.name, pattaNumber:form.patta, chittaNumber:form.chitta});
      setResult(res);
      clearFormDraft('farmer_land');
      toast.success(lang==='ta'?'கணிப்பு வெற்றிகரமாக முடிந்தது!':'Compensation predicted successfully!');
    } catch { toast.error(lang==='ta'?'கணிப்பு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.':'Prediction failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const soilOptions = (lang==='ta' ? SOIL_TA : SOIL_EN).map((s,i)=>({ value: SOIL_EN[i], label: s }));
  const cropOptions = (lang==='ta' ? CROP_TA : CROP_EN).map((s,i)=>({ value: CROP_EN[i], label: s }));
  const infraOptions = lang==='ta'
    ? [{value:'None',label:'இல்லை'},{value:'Highway',label:'நெடுஞ்சாலை'},{value:'Railway',label:'ரயில் பாதை'},{value:'Both',label:'இரண்டும்'}]
    : [{value:'None',label:'None'},{value:'Highway',label:'National/State Highway'},{value:'Railway',label:'Railway Line'},{value:'Both',label:'Both Highway & Railway'}];

  const STATS = [
    { title: t('totalSubmissions'), value: myLands.length, icon: FileText, color:'blue' },
    { title: t('approved'), value: myLands.filter(l=>l.status==='approved').length, icon: CheckCircle, color:'primary' },
    { title: t('pending'), value: myLands.filter(l=>l.status==='pending').length, icon: Clock, color:'amber' },
    { title: t('avgMlValue'), value: myLands.length?formatCurrency(myLands.reduce((a,l)=>a+l.mlValue,0)/myLands.length):'₹0', icon: TrendingUp, color:'purple' },
  ];

  // Steps for non-technical guide
  const STEPS = [
    { num:1, label: lang==='ta'?'பட்டா / இடம்':'Patta / Location', emoji:'📋' },
    { num:2, label: lang==='ta'?'நில விவரங்கள்':'Land Details', emoji:'🌾' },
    { num:3, label: lang==='ta'?'கணிப்பு பெறு':'Get Prediction', emoji:'🤖' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome banner */}
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 p-6 text-white">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"/>
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-primary-200 text-sm font-medium mb-1">{t('goodMorning')} 🌅</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl">{user?.name}</h2>
            <p className="text-primary-200 mt-1 text-sm">{t('welcomeMsg')}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/15 rounded-xl px-4 py-3 backdrop-blur">
            <Leaf size={20} className="text-primary-200"/>
            <div>
              <p className="text-xs text-primary-200">{t('yourLocation')}</p>
              <p className="font-semibold text-sm">{user?.location||'Not set'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s,i)=>(
          <motion.div key={s.title} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}>
            <StatCard {...s}/>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left: Form */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="xl:col-span-3">
          <div className="card p-6">
            {/* Step indicator - visual for non-technical users */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
              {STEPS.map((s,i)=>(
                <div key={s.num} className="flex items-center gap-2 shrink-0">
                  <button onClick={()=>setActiveStep(s.num)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 ${activeStep===s.num?'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-600':'border-slate-200 dark:border-slate-600 text-slate-400 hover:border-primary-300'}`}>
                    <span className="text-base">{s.emoji}</span> {s.label}
                  </button>
                  {i<STEPS.length-1&&<ChevronRight size={14} className="text-slate-300 shrink-0"/>}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* STEP 1: Patta + Location */}
              <AnimatePresence mode="wait">
                {activeStep===1&&(
                  <motion.div key="step1" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-4">
                    {/* Patta search card - big and friendly */}
                    <div className="bg-gradient-to-br from-primary-50 to-green-50 dark:from-primary-900/20 dark:to-green-900/10 rounded-2xl p-5 border border-primary-100 dark:border-primary-800/30">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">📋</span>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm">{t('pattaLabel')}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {lang==='ta'?'பட்டா எண் இருந்தால் தானாக இடம் கண்டறியும்':'Auto-detects your land location from Tamil Nadu records'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={form.patta}
                            onChange={set('patta')}
                            placeholder={t('pattaPlaceholder')}
                            className="input-field text-lg font-mono font-bold"
                          />
                        </div>
                        <button type="button" onClick={handlePattaLookup} disabled={pattaLoading}
                          className="btn-primary px-4 py-3 shrink-0 text-sm">
                          {pattaLoading?(
                            <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>{t('detecting')}</span>
                          ):(
                            <span className="flex items-center gap-2"><Search size={16}/>{t('detectLocation')}</span>
                          )}
                        </button>
                      </div>
                      {pattaData&&(
                        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                          className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-primary-200 dark:border-primary-700/40 text-xs space-y-1">
                          <p className="font-semibold text-primary-700 dark:text-primary-400 flex items-center gap-1"><CheckCircle size={12}/> {lang==='ta'?'பட்டா தகவல்':'Patta Information Found'}</p>
                          {[
                            [lang==='ta'?'கிராமம்':'Village', pattaData.village],
                            [lang==='ta'?'தாலுகா':'Taluk', pattaData.taluk],
                            [lang==='ta'?'மாவட்டம்':'District', pattaData.district],
                            [lang==='ta'?'கணக்கெடுப்பு எண்':'Survey No.', pattaData.surveyNo],
                            [lang==='ta'?'நில அளவு':'Area', pattaData.area],
                            [lang==='ta'?'நில வகை':'Land Type', pattaData.landType],
                          ].map(([k,v])=> v&&(
                            <div key={k} className="flex gap-2"><span className="text-slate-400 w-24 shrink-0">{k}:</span><span className="font-medium text-slate-700 dark:text-slate-300">{v}</span></div>
                          ))}
                          {pattaData.approximate&&(
                            <p className="text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1"><AlertCircle size={11}/>{lang==='ta'?'தோராய இடம் — கீழே சரி செய்யவும்':'Approximate location — please verify below'}</p>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* Chitta/Survey no */}
                    <InputField label={t('chittaLabel')} id="chitta" type="text"
                      placeholder={t('chittaPlaceholder')} value={form.chitta} onChange={set('chitta')}/>

                    {/* Location text */}
                    <InputField label={t('locationLabel')} id="location" type="text"
                      placeholder={t('locationPlaceholder')} icon={MapPin}
                      value={form.location} onChange={set('location')} error={errors.location}/>

                    <div className="grid grid-cols-2 gap-3">
                      <InputField label={lang==='ta'?'அட்சரேகை (Latitude)':'Latitude'} id="lat" type="number" step="any"
                        placeholder="10.787" value={form.lat} onChange={set('lat')}/>
                      <InputField label={lang==='ta'?'தீர்க்கரேகை (Longitude)':'Longitude'} id="lng" type="number" step="any"
                        placeholder="79.139" value={form.lng} onChange={set('lng')}/>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                      <Info size={14} className="text-blue-500 mt-0.5 shrink-0"/>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {lang==='ta'
                          ?'வரைபட பக்கத்தில் நீங்கள் நேரடியாக நிலத்தை வரைந்து இடத்தை கண்டறியலாம் 🗺️'
                          :'You can also draw your land boundary on the Map page to auto-detect coordinates 🗺️'}
                      </p>
                    </div>

                    <button type="button" onClick={()=>setActiveStep(2)} className="btn-primary w-full justify-center py-3 text-base">
                      {t('continue')}
                    </button>
                  </motion.div>
                )}

                {/* STEP 2: Land details */}
                {activeStep===2&&(
                  <motion.div key="step2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-4">
                    <InputField label={`${t('landSize')} (ஏக்கர் / acres)`} id="size" type="number" step="0.1" min="0.1"
                      placeholder={lang==='ta'?'எ.கா. 5.2':'e.g. 5.2'} suffix="ac"
                      value={form.size} onChange={set('size')} error={errors.size}/>

                    {/* Soil - visual grid instead of dropdown for non-technical users */}
                    <div>
                      <label className="label">{t('soilType')} — {lang==='ta'?'மண் வகை தேர்ந்தெடுக்கவும்':'Select your soil type'}</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SOIL_EN.map((en,i)=>{
                          const ta = SOIL_TA[i];
                          const SOIL_EMOJIS = ['🟤','⬛','🔴','🟡','🧱','🟫'];
                          return (
                            <button key={en} type="button" onClick={()=>{ setForm(f=>({...f,soilType:en})); setErrors(er=>({...er,soilType:''})); }}
                              className={`p-3 rounded-xl border-2 text-left transition-all ${form.soilType===en?'border-primary-500 bg-primary-50 dark:bg-primary-900/30':'border-slate-200 dark:border-slate-600 hover:border-primary-300'}`}>
                              <span className="text-xl block mb-1">{SOIL_EMOJIS[i]}</span>
                              <p className={`text-xs font-bold ${form.soilType===en?'text-primary-700 dark:text-primary-400':'text-slate-700 dark:text-slate-300'}`}>{lang==='ta'?ta:en}</p>
                              {lang==='ta'&&<p className="text-xs text-slate-400">{en}</p>}
                            </button>
                          );
                        })}
                      </div>
                      {errors.soilType&&<p className="mt-1 text-xs text-red-500">{errors.soilType}</p>}
                    </div>

                    {/* Crop - visual grid */}
                    <div>
                      <label className="label">{t('primaryCrop')} — {lang==='ta'?'முதன்மை பயிர்':'Select primary crop'}</label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {CROP_EN.map((en,i)=>{
                          const ta = CROP_TA[i];
                          const CROP_EMOJIS = ['🌾','🌿','🌸','🎋','🥜','🍌','🥭','🥦','🫘'];
                          return (
                            <button key={en} type="button" onClick={()=>{ setForm(f=>({...f,cropType:en})); setErrors(er=>({...er,cropType:''})); }}
                              className={`p-2.5 rounded-xl border-2 text-center transition-all ${form.cropType===en?'border-primary-500 bg-primary-50 dark:bg-primary-900/30':'border-slate-200 dark:border-slate-600 hover:border-primary-300'}`}>
                              <span className="text-2xl block mb-1">{CROP_EMOJIS[i]}</span>
                              <p className={`text-xs font-semibold leading-tight ${form.cropType===en?'text-primary-700 dark:text-primary-400':'text-slate-600 dark:text-slate-400'}`}>{lang==='ta'?ta:en}</p>
                            </button>
                          );
                        })}
                      </div>
                      {errors.cropType&&<p className="mt-1 text-xs text-red-500">{errors.cropType}</p>}
                    </div>

                    {/* Infrastructure - visual cards */}
                    <div>
                      <label className="label">{t('infrastructure')}</label>
                      <div className="grid grid-cols-2 gap-2">
                        {infraOptions.map(opt=>(
                          <button key={opt.value} type="button" onClick={()=>setForm(f=>({...f,infrastructure:opt.value}))}
                            className={`p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${form.infrastructure===opt.value?'border-primary-500 bg-primary-50 dark:bg-primary-900/30':'border-slate-200 dark:border-slate-600 hover:border-primary-300'}`}>
                            <span className="text-2xl">{opt.value==='None'?'🚫':opt.value==='Highway'?'🛣️':opt.value==='Railway'?'🚂':'🛣️🚂'}</span>
                            <span className={`text-sm font-semibold ${form.infrastructure===opt.value?'text-primary-700 dark:text-primary-400':'text-slate-600 dark:text-slate-400'}`}>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="label">{t('additionalDesc')}</label>
                      <textarea rows={3} value={form.description} onChange={set('description')}
                        placeholder={t('descPlaceholder')} className="input-field resize-none"/>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={()=>setActiveStep(1)} className="btn-secondary flex-1 justify-center">{t('back')}</button>
                      <button type="button" onClick={()=>setActiveStep(3)} className="btn-primary flex-1 justify-center">{t('continue')}</button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Review + Submit */}
                {activeStep===3&&(
                  <motion.div key="step3" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-4">
                    {/* Summary card */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-2.5">
                      <p className="font-bold text-slate-700 dark:text-white text-sm mb-3">
                        {lang==='ta'?'📋 சமர்ப்பிப்பு சারம்':'📋 Submission Summary'}
                      </p>
                      {[
                        [lang==='ta'?'பட்டா எண்':'Patta No', form.patta||'—'],
                        [lang==='ta'?'சிட்டா எண்':'Chitta No', form.chitta||'—'],
                        [lang==='ta'?'இடம்':'Location', form.location||'—'],
                        [lang==='ta'?'அட்சரேகை':'Latitude', form.lat||'—'],
                        [lang==='ta'?'தீர்க்கரேகை':'Longitude', form.lng||'—'],
                        [lang==='ta'?'நில அளவு':'Size', form.size ? `${form.size} acres` : '—'],
                        [lang==='ta'?'மண் வகை':'Soil', form.soilType||'—'],
                        [lang==='ta'?'பயிர்':'Crop', form.cropType||'—'],
                        [lang==='ta'?'உள்கட்டமைப்பு':'Infrastructure', form.infrastructure||'—'],
                      ].map(([k,v])=>(
                        <div key={k} className="flex justify-between items-center py-1.5 border-b border-slate-200 dark:border-slate-700 last:border-0">
                          <span className="text-xs text-slate-500 dark:text-slate-400">{k}</span>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-right max-w-48 truncate">{v}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-start gap-2.5 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30">
                      <Sparkles size={18} className="text-primary-600 dark:text-primary-400 shrink-0 mt-0.5"/>
                      <p className="text-sm text-primary-700 dark:text-primary-300 font-medium">
                        {lang==='ta'
                          ?'உங்கள் நிலத்தின் நியாயமான மதிப்பை கண்டறிய AI கணிப்பு மேற்கொள்ளப்படும். இது சுமார் 2 நிமிடம் ஆகும்.'
                          :'Our AI will analyze your land details and predict a fair compensation value. This takes about 2 minutes.'}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={()=>setActiveStep(2)} className="btn-secondary flex-1 justify-center py-3">{t('back')}</button>
                      <button type="submit" disabled={loading} className="btn-primary flex-[2] justify-center py-4 text-base">
                        {loading?(
                          <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>{t('analyzing')}</span>
                        ):(
                          <span className="flex items-center gap-2"><Sparkles size={18}/>{t('getPrediction')}</span>
                        )}
                      </button>
                    </div>
                    <button type="button" onClick={()=>{setForm(INITIAL_FORM); clearFormDraft('farmer_land'); setActiveStep(1); setPattaData(null); setResult(null);}}
                      className="w-full text-center text-xs text-slate-400 hover:text-red-500 transition-colors py-1">{t('clearForm')}</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>

        {/* Right: Results */}
        <div className="xl:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {loading&&(
              <motion.div key="loading" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="card p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-5 relative">
                  <div className="absolute inset-0 border-4 border-primary-100 dark:border-primary-900/30 rounded-full"/>
                  <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"/>
                  <span className="absolute inset-0 flex items-center justify-center text-3xl">🤖</span>
                </div>
                <p className="font-bold text-slate-700 dark:text-white">{lang==='ta'?'நில தகவல்களை பகுப்பாய்வு செய்கிறது...':'Analyzing land data...'}</p>
                <p className="text-sm text-slate-400 mt-2">{lang==='ta'?'40+ அளவுருக்களை செயலாக்குகிறது':'Processing 40+ parameters'}</p>
                {[
                  [lang==='ta'?'மண் தர பகுப்பாய்வு':'Soil quality analysis','🌱'],
                  [lang==='ta'?'உள்கட்டமைப்பு மதிப்பெண்':'Infrastructure scoring','🏗️'],
                  [lang==='ta'?'சந்தை விலை தேடல்':'Market rate lookup','📊'],
                  [lang==='ta'?'இறுதி மதிப்பீடு':'Final valuation','💰'],
                ].map(([s,em],i)=>(
                  <motion.div key={s} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.5}}
                    className="text-xs text-slate-400 flex items-center gap-2 justify-center mt-2">
                    <span>{em}</span>{s}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {result&&!loading&&(
              <motion.div key="result" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="space-y-4">
                {/* Big value reveal */}
                <div className="card p-5 text-center border-2 border-primary-200 dark:border-primary-700/50 bg-gradient-to-b from-primary-50/50 to-white dark:from-primary-900/10 dark:to-slate-800">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{t('mlPrediction')}</p>
                  <p className="font-display font-black text-4xl text-primary-600 dark:text-primary-400">{formatCurrency(result.mlValue)}</p>
                  <p className="text-sm text-slate-400 mt-1">{lang==='ta'?'நியாயமான நில மதிப்பு':'Fair Land Value (ML Predicted)'}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="card p-4 border-l-4 border-blue-500 text-center">
                    <p className="text-xs text-slate-400 mb-1">{t('govtRate')}</p>
                    <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{formatCurrency(result.govtValue)}</p>
                  </div>
                  <div className="card p-4 border-l-4 border-amber-500 text-center">
                    <p className="text-xs text-slate-400 mb-1">{lang==='ta'?'வித்தியாசம்':'Difference'}</p>
                    <p className="font-bold text-lg text-amber-600">+{(((result.mlValue-result.govtValue)/result.govtValue)*100).toFixed(1)}%</p>
                  </div>
                </div>

                {/* Confidence */}
                <div className="card p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-500">{t('modelConfidence')}</span>
                    <span className="font-bold text-primary-600">{result.confidence}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div initial={{width:0}} animate={{width:`${result.confidence}%`}} transition={{duration:1}}
                      className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"/>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 text-center">{lang==='ta'?`${result.confidence}% நம்பகத்தன்மையுடன் கணிக்கப்பட்டது`:`Predicted with ${result.confidence}% confidence`}</p>
                </div>

                {/* Charts */}
                <div className="card p-4">
                  <h4 className="font-semibold text-sm text-slate-700 dark:text-white mb-3">{t('valueComparison')}</h4>
                  <ComparisonBarChart govtValue={result.govtValue} mlValue={result.mlValue}/>
                </div>

                {result.historicalTrend&&(
                  <div className="card p-4">
                    <h4 className="font-semibold text-sm text-slate-700 dark:text-white mb-3">{t('historicalTrend')}</h4>
                    <TrendLineChart data={result.historicalTrend}/>
                  </div>
                )}

                {/* AI Explanation - simplified for non-technical users */}
                <div className="card p-4 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/30">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl shrink-0">🤖</span>
                    <div>
                      <p className="font-semibold text-primary-700 dark:text-primary-400 mb-1.5 text-sm">{t('aiReasoning')}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{result.explanation}</p>
                    </div>
                  </div>
                </div>

                {/* Factors - visual bars */}
                {result.factors&&(
                  <div className="card p-4">
                    <p className="text-sm font-semibold text-slate-700 dark:text-white mb-3">{t('keyFactors')}</p>
                    <div className="space-y-3">
                      {result.factors.map(f=>(
                        <div key={f.name}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">{f.name}</span>
                            <span className={`font-bold ${f.impact==='High'?'text-primary-600':f.impact==='Medium'?'text-amber-600':'text-slate-400'}`}>{f.impact} ({f.weight}%)</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div initial={{width:0}} animate={{width:`${f.weight}%`}} transition={{duration:0.8,delay:0.2}}
                              className={`h-full rounded-full ${f.impact==='High'?'bg-primary-500':f.impact==='Medium'?'bg-amber-400':'bg-slate-300'}`}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {!result&&!loading&&(
              <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}}
                className="card p-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                <div className="text-6xl mb-4">🌾</div>
                <p className="font-bold text-slate-700 dark:text-white mb-2">{t('readyForPrediction')}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{t('readyMsg')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Recent submissions */}
      {myLands.length>0&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">{t('recentSubmissions')}</h3>
              <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium flex items-center gap-1">{t('viewAll')}<ChevronRight size={14}/></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    {[t('location'),t('size'),t('mlValue'),t('govtValue'),t('status'),t('date')].map(h=>(
                      <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {myLands.map(land=>(
                    <tr key={land.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">{land.location}</td>
                      <td className="py-3 px-3 text-slate-500">{land.size} ac</td>
                      <td className="py-3 px-3 font-semibold text-primary-600 dark:text-primary-400">{formatCurrency(land.mlValue)}</td>
                      <td className="py-3 px-3 text-slate-500">{formatCurrency(land.govtValue)}</td>
                      <td className="py-3 px-3"><span className={`badge ${land.status==='approved'?'badge-green':land.status==='rejected'?'badge-red':'badge-yellow'}`}>{lang==='ta'?{pending:'நிலுவை',approved:'அங்கீகரிக்கப்பட்டது',rejected:'நிராகரிக்கப்பட்டது'}[land.status]:land.status}</span></td>
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
