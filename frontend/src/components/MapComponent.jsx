import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Pencil, Trash2, CheckCircle } from 'lucide-react';
import { pattaService } from '../services/pattaService';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25,41], iconAnchor:[12,41], popupAnchor:[1,-34], shadowSize:[41,41],
});
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [18,30], iconAnchor:[9,30], popupAnchor:[1,-28], shadowSize:[30,30],
});

function MapInteraction({ mode, onPin, onDrawPoint, onDrawFinish }) {
  useMapEvents({
    click(e) {
      if (mode === 'pin') onPin({ lat: e.latlng.lat.toFixed(6), lng: e.latlng.lng.toFixed(6) });
      if (mode === 'draw') onDrawPoint([e.latlng.lat, e.latlng.lng]);
    },
    dblclick() { if (mode === 'draw') onDrawFinish(); },
  });
  return null;
}

function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => { if (coords) map.flyTo(coords, 15, { duration: 1.5 }); }, [coords]);
  return null;
}

export default function MapComponent({ onLocationSelect, onAreaChange, initialCoords, markers=[], readOnly=false, height='420px', t=(k)=>k }) {
  const [mode, setMode] = useState('pin');
  const [pinned, setPinned] = useState(initialCoords || null);
  const [drawPoints, setDrawPoints] = useState([]);
  const [drawComplete, setDrawComplete] = useState(false);
  const [flyTo, setFlyTo] = useState(null);

  useEffect(() => {
    if (initialCoords) {
      setPinned(initialCoords);
      setFlyTo([parseFloat(initialCoords.lat), parseFloat(initialCoords.lng)]);
    }
  }, [initialCoords?.lat, initialCoords?.lng]);

  const handlePin = useCallback((coords) => { setPinned(coords); onLocationSelect?.(coords); }, [onLocationSelect]);

  const handleDrawPoint = useCallback((pt) => {
    if (drawComplete) return;
    setDrawPoints(prev => [...prev, pt]);
  }, [drawComplete]);

  const handleDrawFinish = useCallback(() => {
    if (drawPoints.length < 3) return;
    setDrawComplete(true);
    const centroid = pattaService.getPolygonCentroid(drawPoints);
    const area = pattaService.calculatePolygonArea(drawPoints);
    setPinned(centroid);
    onLocationSelect?.(centroid);
    onAreaChange?.(area);
  }, [drawPoints, onLocationSelect, onAreaChange]);

  const clearDraw = () => { setDrawPoints([]); setDrawComplete(false); };

  const defaultCenter = [11.127123, 78.656891];
  const mapCenter = pinned ? [parseFloat(pinned.lat), parseFloat(pinned.lng)] : defaultCenter;

  return (
    <div className="space-y-3">
      {!readOnly && (
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => { setMode('pin'); clearDraw(); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${mode==='pin'?'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-600':'border-slate-200 dark:border-slate-600 text-slate-500 hover:border-primary-300'}`}>
            <MapPin size={16}/> 📍 Pin Location {mode==='pin'&&<CheckCircle size={14} className="text-primary-500"/>}
          </button>
          <button onClick={() => { setMode('draw'); setPinned(null); clearDraw(); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${mode==='draw'?'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400':'border-slate-200 dark:border-slate-600 text-slate-500 hover:border-amber-300'}`}>
            <Pencil size={16}/> ✏️ {t('drawBoundary')} {mode==='draw'&&<CheckCircle size={14} className="text-amber-500"/>}
          </button>
          {mode==='draw'&&drawPoints.length>0&&(
            <button onClick={clearDraw} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 border-2 border-red-200 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 transition-all">
              <Trash2 size={14}/> {t('clearDraw')}
            </button>
          )}
          {mode==='draw'&&drawPoints.length>=3&&!drawComplete&&(
            <button onClick={handleDrawFinish} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-primary-600 border-2 border-primary-400 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 transition-all animate-pulse">
              <CheckCircle size={14}/> முடி / Finish ({drawPoints.length} pts)
            </button>
          )}
        </div>
      )}

      {mode==='draw'&&!drawComplete&&(
        <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl">
          <Pencil size={14} className="text-amber-600 mt-0.5 shrink-0"/>
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
            {t('drawInstruction')} — {drawPoints.length} புள்ளிகள் / points marked
          </p>
        </div>
      )}

      <div style={{ height, cursor: mode==='draw'?'crosshair':'default' }} className="rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm">
        <MapContainer center={mapCenter} zoom={pinned?13:7} style={{height:'100%',width:'100%'}} doubleClickZoom={false}>
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          {!readOnly&&<MapInteraction mode={mode} onPin={handlePin} onDrawPoint={handleDrawPoint} onDrawFinish={handleDrawFinish}/>}
          {flyTo&&<FlyTo coords={flyTo}/>}
          {pinned&&mode==='pin'&&(
            <Marker position={[parseFloat(pinned.lat),parseFloat(pinned.lng)]} icon={greenIcon}>
              <Popup><div className="font-sans text-xs p-1"><p className="font-bold">📍 உங்கள் நிலம்</p><p className="text-slate-500">Lat: {pinned.lat}</p><p className="text-slate-500">Lng: {pinned.lng}</p></div></Popup>
            </Marker>
          )}
          {mode==='draw'&&drawPoints.map((pt,i)=>(
            <Marker key={i} position={pt} icon={redIcon}><Popup><p className="font-sans text-xs">Point {i+1}</p></Popup></Marker>
          ))}
          {mode==='draw'&&drawPoints.length>=2&&(
            <Polygon positions={drawPoints} pathOptions={{color:drawComplete?'#22c55e':'#f59e0b',fillColor:drawComplete?'#22c55e':'#f59e0b',fillOpacity:0.2,weight:2.5,dashArray:drawComplete?undefined:'8 4'}}/>
          )}
          {drawComplete&&pinned&&(
            <Marker position={[parseFloat(pinned.lat),parseFloat(pinned.lng)]} icon={greenIcon}>
              <Popup><div className="font-sans text-xs p-1"><p className="font-bold">✅ நில மையம்</p><p className="text-slate-500">Area: {pattaService.calculatePolygonArea(drawPoints)} acres</p></div></Popup>
            </Marker>
          )}
          {markers.map((m,i)=>(
            <Marker key={i} position={m.coords}><Popup><div className="font-sans text-sm"><p className="font-semibold">{m.label}</p>{m.sublabel&&<p className="text-slate-500 text-xs">{m.sublabel}</p>}</div></Popup></Marker>
          ))}
        </MapContainer>
      </div>

      {!readOnly&&pinned&&(
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30 text-sm">
            <MapPin size={14} className="text-primary-600 shrink-0"/>
            <span className="text-primary-700 dark:text-primary-400 font-mono font-medium">{pinned.lat}, {pinned.lng}</span>
          </div>
          {drawComplete&&(
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 text-sm">
              <span className="text-amber-700 font-medium">📐 {pattaService.calculatePolygonArea(drawPoints)} acres (வரைபட அளவீடு)</span>
            </div>
          )}
        </div>
      )}
      {!readOnly&&!pinned&&(
        <p className="text-sm text-slate-400 flex items-center gap-1.5"><Navigation size={14}/>{t('clickToPin')}</p>
      )}
    </div>
  );
}
