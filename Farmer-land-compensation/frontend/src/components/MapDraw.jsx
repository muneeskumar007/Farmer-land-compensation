import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents } from "react-leaflet";
import GlassCard from "./GlassCard.jsx";

const startCenter = [18.5204, 73.8567];

function DrawLayer({ points, setPoints }) {
  useMapEvents({
    click(e) {
      setPoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
    }
  });
  return null;
}

export default function MapDraw({ readOnly }) {
  const [points, setPoints] = useState([
    [18.5204, 73.8567],
    [18.522, 73.862],
    [18.517, 73.865]
  ]);

  const areaEstimate = useMemo(() => {
    return Math.max(1.2, points.length * 0.75).toFixed(2);
  }, [points]);

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">GIS Map Preview</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {readOnly
              ? "Read-only view of recorded boundary."
              : "Click on the map to draw boundary points."}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Area Est.
          </p>
          <p className="text-lg font-semibold">{areaEstimate} acres</p>
        </div>
      </div>
      <div className="h-72 overflow-hidden rounded-2xl">
        <MapContainer center={startCenter} zoom={13} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {!readOnly && <DrawLayer points={points} setPoints={setPoints} />}
          {points.map((point, index) => (
            <Marker key={`${point[0]}-${index}`} position={point} />
          ))}
          <Polygon positions={points} pathOptions={{ color: "#51d1b5" }} />
        </MapContainer>
      </div>
      {!readOnly && (
        <button
          type="button"
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-ink-700"
          onClick={() => setPoints([])}
        >
          Clear Drawing
        </button>
      )}
    </GlassCard>
  );
}
