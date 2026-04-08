import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Copy, Check } from 'lucide-react';
import { PageHeader } from '../../components/UI';
import MapComponent from '../../components/MapComponent';
import { landService } from '../../services/api';
import toast from 'react-hot-toast';

export default function MapPage() {
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);
  const [lands, setLands] = useState([]);
  const [loadingMap, setLoadingMap] = useState(false);

  const handleLocationSelect = (coords) => {
    setSelected(coords);
  };

  const copyCoords = () => {
    if (!selected) return;
    navigator.clipboard.writeText(`${selected.lat}, ${selected.lng}`);
    setCopied(true);
    toast.success('Coordinates copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const markers = [
    { coords: [10.787, 79.139], label: 'Thanjavur Plot', sublabel: '5.2 acres · Rice' },
    { coords: [11.017, 76.955], label: 'Coimbatore Land', sublabel: '7.1 acres · Sugarcane' },
    { coords: [9.925, 78.119], label: 'Madurai Field', sublabel: '3.8 acres · Cotton' },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Land Location Map"
        subtitle="Click anywhere on the map to select your land's exact coordinates"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <MapPin size={16} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Interactive Map</h3>
              <p className="text-xs text-slate-400">Tamil Nadu, India — Click to pin your land</p>
            </div>
          </div>

          <MapComponent
            onLocationSelect={handleLocationSelect}
            markers={markers}
            height="450px"
          />
        </motion.div>

        {/* Info panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Selected coords */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Navigation size={16} className="text-primary-500" /> Selected Location
            </h3>

            {selected ? (
              <div className="space-y-3">
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 border border-primary-100 dark:border-primary-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase">Coordinates</span>
                    <button onClick={copyCoords} className="text-primary-500 hover:text-primary-700 transition-colors">
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <p className="font-mono text-sm text-slate-700 dark:text-slate-300">
                    {selected.lat}°N
                  </p>
                  <p className="font-mono text-sm text-slate-700 dark:text-slate-300">
                    {selected.lng}°E
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-400 mb-0.5">Latitude</p>
                    <p className="font-mono text-sm font-semibold text-slate-700 dark:text-white">{selected.lat}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-400 mb-0.5">Longitude</p>
                    <p className="font-mono text-sm font-semibold text-slate-700 dark:text-white">{selected.lng}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 text-center">
                  Copy these coordinates to use in your land prediction form
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <MapPin size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Click on the map to pin a location</p>
              </div>
            )}
          </div>

          {/* Sample markers info */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-3 text-sm">📌 Registered Plots</h3>
            <div className="space-y-3">
              {markers.map((m, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={12} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{m.label}</p>
                    <p className="text-xs text-slate-400">{m.sublabel}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{m.coords[0]}, {m.coords[1]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
            <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">💡 Tips</h4>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
              <li>• Click to place/move pin on map</li>
              <li>• Zoom in for precise selection</li>
              <li>• Copy coordinates to prediction form</li>
              <li>• Lat: North (+) or South (−)</li>
              <li>• Lng: East (+) or West (−)</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
