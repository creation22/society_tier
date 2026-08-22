import { useEffect, useState } from 'react';
import { fetchAqi, aqiCategory } from '../utils/aqi.js';

/**
 * City-level air quality card. AQI is area-wide, so this always shows the
 * single Gurugram reading rather than pretending societies differ.
 */
export default function AqiWidget() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchAqi()
      .then((d) => { if (!cancelled) setData(d); })
      .catch(() => { if (!cancelled) setErr(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const cat = data ? aqiCategory(data.aqi) : null;

  return (
    <div className="border-3 border-ink bg-paper p-4 shadow-brutal-sm">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm uppercase">Air Quality · Gurugram</p>
        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Live · CPCB</span>
      </div>

      {loading ? (
        <div className="mt-3 h-9 w-40 animate-pulse bg-ink/10" />
      ) : err || !cat ? (
        <p className="mt-3 text-sm font-bold uppercase text-gray-500">AQI unavailable</p>
      ) : (
        <div className="mt-3 flex items-center gap-3">
          <span
            className="border-3 border-ink px-3 py-1 font-display text-3xl leading-none"
            style={{ background: cat.color }}
          >
            {data.aqi}
          </span>
          <div>
            <p className="font-display text-base uppercase leading-none">{cat.label}</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-gray-600">
              {data.dominant ? `${data.dominant.toUpperCase()} dominant · city-wide` : 'city-wide reading'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
