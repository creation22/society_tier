import { Link } from 'react-router-dom';
import { Star, MapPin } from '@phosphor-icons/react';
import { tierColor } from '../utils/tier.js';
import { formatCount } from '../utils/format.js';
import { cn } from '../utils/cn.js';
import TierBadge from './ui/TierBadge.jsx';

/** Backwards-compat re-export of the refined tier chip. */
export function TierChip({ tier, size = 'md' }) {
  return <TierBadge tier={tier} size={size} />;
}

/**
 * Premium society card. Soft surface, refined score readout, subtle lift on hover.
 */
export default function SocietyCard({ society, rank }) {
  const score = Number(society.overallRating || 0).toFixed(1);
  const pct = Math.min(100, (Number(society.overallRating || 0) / 10) * 100);

  return (
    <Link
      to={`/society/${society.slug}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-stretch">
        {rank !== undefined && (
          <div className="flex w-12 shrink-0 items-center justify-center bg-slate-900 font-display text-lg font-bold text-white">
            {rank}
          </div>
        )}
        <div className="min-w-0 flex-1 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-display text-base font-bold text-ink sm:text-lg">
                {society.name}
              </h3>
              <p className="mt-1 flex items-center gap-1 truncate text-xs font-medium text-slate-500">
                <MapPin weight="fill" className="h-3 w-3 shrink-0 text-slate-400" />
                {society.sector}
                {society.area ? ` · ${society.area}` : ''}
              </p>
            </div>
            <TierBadge tier={society.tier} />
          </div>

          <div className="mt-3.5 flex items-center gap-3">
            <span className="flex items-center gap-1 font-display text-2xl font-bold leading-none text-ink">
              {score}
              <Star weight="fill" className="h-4 w-4 fill-amber-400 text-amber-400" />
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: tierColor(society.tier) }}
              />
            </div>
            <span className="shrink-0 text-xs font-medium text-slate-400">
              {formatCount(society.ratingCount)} ratings
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
