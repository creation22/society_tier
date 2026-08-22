import { RATING_PARAMS, tierColor } from '../utils/tier.js';
import { useOnScreen } from '../hooks/useCountUp.js';

function Bar({ label, value }) {
  const [ref, visible] = useOnScreen({ threshold: 0.4 });
  const pct = Math.max(0, Math.min(100, value * 10));

  return (
    <div ref={ref}>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        <span className="font-display text-lg">{value != null ? Number(value).toFixed(1) : '–'}</span>
      </div>
      <div className="flex gap-[3px]" aria-label={`${label}: ${value} out of 10`}>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="rating-bar-fill h-5 flex-1 border-2 border-ink"
            style={{
              background: visible && i + 1 <= Math.round(value) ? tierColor('A') : '#FFFDF7',
              transitionDelay: `${i * 45}ms`
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
        <div className="mb-6 flex flex-wrap items-center gap-4 border-3 border-ink bg-ink p-4 text-cream shadow-brutal">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Overall Rating</p>
            <p className="font-display text-5xl" style={{ color: '#FFDD00' }}>
              {Number(overall).toFixed(1)}<span className="text-xl text-gray-400"> / 10</span>
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Based on</p>
            <p className="font-display text-3xl">{Number(ratingCount || 0).toLocaleString()}</p>
            <p className="text-xs font-bold uppercase text-gray-400">ratings</p>
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
