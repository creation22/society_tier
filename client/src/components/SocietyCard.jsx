import { Link } from 'react-router-dom';
import { tierColor, TIER_META } from '../utils/tier.js';
import { formatCount } from '../utils/format.js';

export function TierChip({ tier, size = 'md' }) {
  const meta = TIER_META[tier] || TIER_META.B;
  return (
    <span
      title={`${meta.label} — ${meta.text}`}
      className={`tier-chip ${size === 'lg' ? 'h-11 w-11 text-lg' : ''}`}
      style={{ background: meta.color }}
    >
      {tier}
    </span>
  );
}

/**
 * Neo-brutalist society card with subtle 3D tilt on hover.
 */
export default function SocietyCard({ society, rank }) {
  function onTilt(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translate(-3px,-3px)`;
  }
  function untilt(e) {
    e.currentTarget.style.transform = '';
  }

  return (
    <Link
      to={`/society/${society.slug}`}
      onMouseMove={onTilt}
      onMouseLeave={untilt}
      className="group block border-3 border-ink bg-paper shadow-brutal transition-[transform,box-shadow] duration-150 will-change-transform hover:shadow-brutal-lg"
    >
      <div className="flex items-stretch">
        {rank !== undefined && (
          <div className="flex w-12 shrink-0 items-center justify-center border-r-3 border-ink bg-ink font-display text-lg text-cream">
            {rank}
          </div>
        )}
        <div className="min-w-0 flex-1 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-display text-base uppercase leading-tight group-hover:underline sm:text-lg">
                {society.name}
              </h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-600">
                {society.sector}{society.area ? ` · ${society.area}` : ''}
              </p>
            </div>
            <TierChip tier={society.tier} />
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span
              className="border-3 border-ink px-2 py-0.5 font-display text-xl shadow-brutal-sm"
              style={{ background: tierColor(society.tier) }}
            >
              {Number(society.overallRating || 0).toFixed(1)} ★
            </span>
            <span className="text-xs font-bold uppercase tracking-wide text-gray-600">
              {formatCount(society.ratingCount)} ratings
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
