import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Copy, Check, Search, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { PageHeader } from '../../components/UI';
import MapComponent from '../../components/MapComponent';
import { pattaService } from '../../services/pattaService';
import { useLang } from '../../context/LangContext';
import toast from 'react-hot-toast';

export default function MapPage() {
  const { lang, t } = useLang();
  const [selected, setSelected] = useState(null);
  const [drawnArea, setDrawnArea] = useState(null);
  const [copied, setCopied] = useState(false);
  const [patta, setPatta] = useState('');
  const [pattaLoading, setPattaLoading] = useState(false);
  const [pattaResult, setPattaResult] = useState(null);
  const [flyCoords, setFlyCoords] = useState(null);

  const handleLocationSelect = (coords) => setSelected(coords);
  const handleAreaChange = (acres) => setDrawnArea(acres);

  const copyCoords = () => {
    if (!selected) return;
    navigator.clipboard.writeText(`${selected.lat}, ${selected.lng}`);
    setCopied(true);
    toast.success(lang==='ta'?'ஆய கடன்கள் நகலெடுக்கப்பட்டன!':'Coordinates copied!');
    setTimeout(()=>setCopied(false), 2000);
  };

  const handlePattaSearch = async () => {
    if (!patta.trim()) { toast.error(lang==='ta'?'பட்டா எண் உள்ளிடவும்':'Enter Patta number'); return; }
    setPattaLoading(true);
    try {
      const res = await pattaService.lookup(patta.trim());
      if (res.found) {
        setPattaResult(res);
        const coords = { lat: String(res.coordinates.lat), lng: String(res.coordinates.lng) };
        setSelected(coords);
        setFlyCoords([parseFloat(res.coordinates.lat), parseFloat(res.coordinates.lng)]);
        toast.success(lang==='ta'?'பட்டா மூலம் இடம் கண்டறியப்பட்டது! 📍':'Location found from Patta! 📍');
      } else {
        toast.error(lang==='ta'?'பட்டா கண்டறிய முடியவில்லை':'Patta not found in records');
      }
    } catch { toast.error(lang==='ta'?'பிழை ஏற்பட்டது':'Error occurred'); }
    finally { setPattaLoading(false); }
  };

  const markers = [
    { coords:[10.787,79.139], label:'Papanasam Plot — பட்டா 1234', sublabel:'5.2 ac · Rice / நெல்' },
    { coords:[11.017,76.955], label:'Kinathukadavu — பட்டா 9012', sublabel:'5.1 ac · Sugarcane / கரும்பு' },
    { coords:[9.925,78.119], label:'Keelakuilkudi — பட்டா 5678', sublabel:'3.75 ac · Cotton / பருத்தி' },
  ];

  const HOW_STEPS = [
    { emoji:'1️⃣', en:'Enter your Patta number above and click Search to auto-locate', ta:'மேலே பட்டா எண் உள்ளிட்டு தேடல் அழுத்தவும் — இடம் தானாக கண்டறியப்படும்' },
    { emoji:'2️⃣', en:'Or click anywhere on the map to drop a pin on your land', ta:'அல்லது வரைபடத்தில் உங்கள் நிலத்தை கிளிக் செய்து குறிக்கவும்' },
    { emoji:'3️⃣', en:'Or use the "Draw Boundary" button to sketch your land boundary', ta:'அல்லது "எல்லை வரை" பொத்தான் அழுத்தி நில எல்லையை வரையவும்' },
    { emoji:'4️⃣', en:'Your coordinates are detected automatically — copy them to the prediction form', ta:'ஆய கடன்கள் தானாக கண்டறியப்படும் — கணிப்பு படிவத்தில் நகலெடுத்து ஒட்டவும்' },
  ];

  return (
    <div className="space-y-5 max-w-7xl">
      <PageHeader
        title={t('landMap_title')}
        subtitle={t('landMap_sub')}
      />

      {/* How to use - visual guide for non-technical users */}
      <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} className="card p-5">
        <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <span className="text-xl">🗺️</span> {t('howToSelect')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {HOW_STEPS.map((s,i)=>(
            <div key={i} className="flex items-start gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{lang==='ta'?s.ta:s.en}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Patta search bar - prominent */}
      <motion.div initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} transition={{delay:0.05}}
        className="card p-5 bg-gradient-to-r from-primary-50 to-green-50 dark:from-primary-900/20 dark:to-green-900/10 border border-primary-100 dark:border-primary-800/30">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📋</span>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white">{lang==='ta'?'பட்டா எண் மூலம் இடம் கண்டறி':'Find Location by Patta Number'}</h4>
            <p className="text-xs text-slate-500">{lang==='ta'?'தமிழ்நாடு அரசு நில பதிவு (TNREGINET) மூலம் இடம் கண்டறியப்படும்':'Searches Tamil Nadu land records (TNREGINET)'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input type="text" value={patta} onChange={e=>setPatta(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handlePattaSearch()}
            placeholder={lang==='ta'?'பட்டா எண் உள்ளிடவும் (எ.கா: 1234)':'Enter Patta number (e.g. 1234)'}
            className="input-field flex-1 text-lg font-mono font-bold"/>
          <button onClick={handlePattaSearch} disabled={pattaLoading}
            className="btn-primary px-6 py-3 shrink-0">
            {pattaLoading?(
              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>{lang==='ta'?'தேடுகிறது...':'Searching...'}</span>
            ):(
              <span className="flex items-center gap-2"><Search size={16}/>{lang==='ta'?'தேடு':'Search'}</span>
            )}
          </button>
        </div>

        {pattaResult&&(
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
            className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-primary-200 dark:border-primary-700/40">
            <p className="text-xs font-bold text-primary-700 dark:text-primary-400 flex items-center gap-1 mb-3">
              <CheckCircle size={14}/> {lang==='ta'?'பட்டா தகவல் கண்டறியப்பட்டது':'Patta Record Found'}
              {pattaResult.approximate&&<span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">{lang==='ta'?'தோராயம்':'Approximate'}</span>}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[
                ['🏘️', lang==='ta'?'கிராமம்':'Village', pattaResult.village],
                ['🏛️', lang==='ta'?'தாலுகா':'Taluk', pattaResult.taluk],
                ['📍', lang==='ta'?'மாவட்டம்':'District', pattaResult.district],
                ['📄', lang==='ta'?'கணக்கெடுப்பு':'Survey No', pattaResult.surveyNo],
                ['📐', lang==='ta'?'நில அளவு':'Area', pattaResult.area],
                ['🌱', lang==='ta'?'நில வகை':'Land Type', pattaResult.landType],
              ].map(([em,k,v])=> v&&(
                <div key={k} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2.5">
                  <p className="text-slate-400 text-xs mb-0.5">{em} {k}</p>
                  <p className="font-bold text-slate-700 dark:text-slate-200">{v}</p>
                </div>
              ))}
            </div>
            {pattaResult.approximate&&(
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-2">
                <AlertCircle size={11}/>{lang==='ta'?'இது தோராய இடம். வரைபடத்தில் சரி செய்யவும்.':'This is approximate. Please verify by clicking on the map.'}
              </p>
            )}
          </motion.div>
        )}

        {/* Demo hint */}
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
          <Info size={11}/>
          {lang==='ta'?'டெமோ பட்டா எண்கள்: 1234, 5678, 9012, 3456, 7890, 2345, 6789':'Demo Patta numbers: 1234, 5678, 9012, 3456, 7890, 2345, 6789'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Map */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="lg:col-span-2 card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <MapPin size={16} className="text-primary-600 dark:text-primary-400"/>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
                {lang==='ta'?'இடவியல் வரைபடம் — Tamil Nadu':'Interactive Map — Tamil Nadu'}
              </h3>
              <p className="text-xs text-slate-400">{lang==='ta'?'கிளிக் செய்யவும் அல்லது நில எல்லையை வரையவும்':'Click to pin or draw your land boundary'}</p>
            </div>
          </div>

          <MapComponent
            onLocationSelect={handleLocationSelect}
            onAreaChange={handleAreaChange}
            initialCoords={flyCoords ? { lat: String(flyCoords[0]), lng: String(flyCoords[1]) } : null}
            markers={markers}
            height="460px"
            t={t}
          />
        </motion.div>

        {/* Info panel */}
        <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.15}} className="space-y-4">
          {/* Selected location card */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Navigation size={16} className="text-primary-500"/> {t('selectedLocation')}
            </h3>
            {selected?(
              <div className="space-y-3">
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 border border-primary-100 dark:border-primary-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase">{lang==='ta'?'ஆய கடன்கள்':'Coordinates'}</span>
                    <button onClick={copyCoords} className="text-primary-500 hover:text-primary-700 transition-colors p-1.5 rounded-lg hover:bg-primary-100">
                      {copied?<Check size={14}/>:<Copy size={14}/>}
                    </button>
                  </div>
                  <p className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">📍 {selected.lat}°N</p>
                  <p className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">📍 {selected.lng}°E</p>
                </div>

                {drawnArea&&(
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-100 dark:border-amber-800/30 text-center">
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-0.5">{lang==='ta'?'வரைபட அளவீடு':'Drawn Area'}</p>
                    <p className="font-bold text-xl text-amber-700 dark:text-amber-400">{drawnArea} <span className="text-sm font-normal">acres</span></p>
                    <p className="text-xs text-slate-400 mt-0.5">{(drawnArea * 0.404686).toFixed(3)} hectares</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-400 mb-0.5">{lang==='ta'?'அட்சரேகை':'Latitude'}</p>
                    <p className="font-mono text-sm font-bold text-slate-700 dark:text-white">{selected.lat}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-400 mb-0.5">{lang==='ta'?'தீர்க்கரேகை':'Longitude'}</p>
                    <p className="font-mono text-sm font-bold text-slate-700 dark:text-white">{selected.lng}</p>
                  </div>
                </div>

                <button onClick={copyCoords}
                  className="w-full btn-primary justify-center py-2.5 text-sm">
                  {copied?<><Check size={14}/> {lang==='ta'?'நகலெடுக்கப்பட்டது!':'Copied!'}</> : <><Copy size={14}/> {t('copyCoords')}</>}
                </button>

                <p className="text-xs text-slate-400 text-center">
                  {lang==='ta'?'இந்த ஆய கடன்களை கணிப்பு படிவத்தில் ஒட்டவும்':'Paste these into the prediction form on Dashboard'}
                </p>
              </div>
            ):(
              <div className="text-center py-10 text-slate-400">
                <span className="text-5xl block mb-3">🗺️</span>
                <p className="text-sm font-medium">{t('clickToPin')}</p>
                <p className="text-xs mt-1">{lang==='ta'?'அல்லது மேலே பட்டா எண் தேடவும்':'Or search by Patta number above'}</p>
              </div>
            )}
          </div>

          {/* Registered plots */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-3 text-sm">📌 {t('registeredPlots')}</h3>
            <div className="space-y-2.5">
              {markers.map((m,i)=>(
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  onClick={()=>{setSelected({lat:String(m.coords[0]),lng:String(m.coords[1])});}}>
                  <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={12} className="text-primary-600 dark:text-primary-400"/>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{m.label}</p>
                    <p className="text-xs text-slate-400">{m.sublabel}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{m.coords[0]}, {m.coords[1]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
            <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-3">💡 {t('tips')}</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              {[t('tip1'),t('tip2'),t('tip3'),t('tip4')].map((tip,i)=>(
                <li key={i} className="flex items-start gap-2"><span className="text-primary-500 shrink-0 mt-0.5">✓</span>{tip}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
