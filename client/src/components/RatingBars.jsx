import { RATING_PARAMS, tierColor } from '../utils/tier.js';
import { useOnScreen } from '../hooks/useCountUp.js';

function Bar({ label, value }) {
  const [ref, visible] = useOnScreen({ threshold: 0.4 });
  const pct = Math.max(0, Math.min(100, value * 10));

  return (
    <div ref={ref}>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
        <span className="font-display text-lg font-semibold text-ink">{value != null ? Number(value).toFixed(1) : '–'}</span>
      </div>
      <div className="flex gap-1" aria-label={`${label}: ${value} out of 10`}>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-5 flex-1 rounded-full border border-slate-200"
            style={{
              background: visible && i + 1 <= Math.round(value) ? tierColor('A') : '#F8FAFC',
              transitionDelay: `${i * 45}ms`,
              transitionProperty: 'background',
              transitionDuration: '300ms'
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Animated 10-parameter rating dashboard.
 */
export default function RatingBars({ categoryScores = {}, overall, ratingCount }) {
  return (
    <div>
      {overall != null && (
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white shadow-md">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Overall Rating</p>
            <p className="font-display text-5xl font-bold tracking-tight" style={{ color: '#F59E0B' }}>
              {Number(overall).toFixed(1)}<span className="text-xl text-slate-400"> / 10</span>
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Based on</p>
            <p className="font-display text-3xl font-bold tracking-tight">{Number(ratingCount || 0).toLocaleString()}</p>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">ratings</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {RATING_PARAMS.map((p) => (
          <Bar key={p.key} label={p.label} value={categoryScores[p.key]} />
        ))}
      </div>
    </div>
  );
}
