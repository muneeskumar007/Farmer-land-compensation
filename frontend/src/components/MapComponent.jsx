import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

// Fix leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

function ClickMarker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat.toFixed(6), lng: e.latlng.lng.toFixed(6) });
    },
  });
  return null;
}

export default function MapComponent({ onLocationSelect, initialCoords, markers = [], readOnly = false, height = '400px' }) {
  const [selected, setSelected] = useState(initialCoords || null);

  useEffect(() => {
    if (initialCoords) setSelected(initialCoords);
  }, [initialCoords]);

  const handleSelect = (coords) => {
    setSelected(coords);
    onLocationSelect?.(coords);
  };

  const defaultCenter = [11.127123, 78.656891]; // Tamil Nadu center
  const center = selected
    ? [parseFloat(selected.lat), parseFloat(selected.lng)]
    : (markers.length > 0 ? markers[0].coords : defaultCenter);

  return (
    <div className="space-y-3">
      <div style={{ height }} className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
        <MapContainer center={center} zoom={7} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {!readOnly && <ClickMarker onSelect={handleSelect} />}
          {selected && (
            <Marker position={[parseFloat(selected.lat), parseFloat(selected.lng)]} icon={greenIcon}>
              <Popup>
                <div className="font-sans text-sm">
                  <p className="font-semibold text-slate-800">Selected Location</p>
                  <p className="text-slate-500 text-xs mt-1">Lat: {selected.lat}</p>
                  <p className="text-slate-500 text-xs">Lng: {selected.lng}</p>
                </div>
              </Popup>
            </Marker>
          )}
          {markers.map((m, i) => (
            <Marker key={i} position={m.coords}>
              <Popup>
                <div className="font-sans text-sm">
                  <p className="font-semibold text-slate-800">{m.label}</p>
                  {m.sublabel && <p className="text-slate-500 text-xs mt-0.5">{m.sublabel}</p>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {!readOnly && (
        <div className="flex items-center gap-2">
          {selected ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30 text-sm">
              <MapPin size={14} className="text-primary-600 dark:text-primary-400 shrink-0" />
              <span className="text-primary-700 dark:text-primary-400 font-medium">
                {selected.lat}, {selected.lng}
              </span>
            </div>
          ) : (
            <p className="text-sm text-slate-400 flex items-center gap-1.5">
              <Navigation size={14} />
              Click on the map to select your land location
            </p>
          )}
        </div>
      )}
    </div>
  );
}
