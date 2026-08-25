import { useEffect, useState } from 'react';
import { Wind } from '@phosphor-icons/react';
import { fetchAqi, aqiCategory } from '../utils/aqi.js';
import { cn } from '../utils/cn.js';

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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 font-display text-sm font-semibold text-ink">
          <Wind weight="duotone" className="h-4 w-4 text-slate-400" />
          Air Quality · Gurugram
        </p>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Live · CPCB</span>
      </div>

      {loading ? (
        <div className="mt-3 h-9 w-40 animate-pulse rounded-lg bg-slate-100/70" />
      ) : err || !cat ? (
        <p className="mt-3 text-sm font-medium text-slate-500">AQI unavailable</p>
      ) : (
        <div className="mt-3 flex items-center gap-3">
          <span
            className="rounded-xl px-3 py-1 font-display text-3xl font-bold leading-none text-white shadow-sm"
            style={{ background: cat.color }}
          >
            {data.aqi}
          </span>
          <div>
            <p className="font-display text-base font-semibold leading-none text-ink">{cat.label}</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">
              {data.dominant ? `${data.dominant.toUpperCase()} dominant · city-wide` : 'city-wide reading'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
