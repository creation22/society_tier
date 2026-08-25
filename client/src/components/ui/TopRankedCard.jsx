import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChartLineUp, ArrowUpRight } from '@phosphor-icons/react';
import { cn } from '../../utils/cn.js';

const ROWS = [
  { rank: 1, tier: 'S', name: 'DLF Camellias', area: 'Golf Course Rd', score: 9.4 },
  { rank: 2, tier: 'S', name: 'The Aralias', area: 'Golf Course Rd', score: 9.1 },
  { rank: 3, tier: 'A', name: 'Magnolias', area: 'Golf Course Rd', score: 8.7 },
  { rank: 4, tier: 'A', name: 'Heritage One', area: 'Dwarka Expwy', score: 8.4 }
];
const MAX = 10;

/**
 * Premium monochrome "Top ranked this week" panel.
 * - Faint SVG skyline line-drawing in the background.
 * - Monochrome tier pills (no rainbow) + thin gray score bars.
 */
export default function TopRankedCard({ className }) {
  return (
    <div className={cn('relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/95 shadow-xl backdrop-blur', className)}>
      {/* Background skyline line-drawing */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-slate-900"
        viewBox="0 0 1440 200"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.05"
        aria-hidden="true"
      >
        {LINE_BUILDINGS.map((b, i) => (
          <rect key={i} x={b.x} y={200 - b.h} width={b.w} height={b.h} rx="2" />
        ))}
        <line x1="0" y1="199" x2="1440" y2="199" />
      </svg>

      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white">
            <ChartLineUp weight="duotone" className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-ink">Top ranked this week</p>
            <p className="text-[11px] font-medium text-slate-400">Confidence-adjusted</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          Live
        </span>
      </div>

      {/* Rows */}
      <div className="relative divide-y divide-slate-100">
        {ROWS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.6 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50"
          >
            <span className="w-4 text-right font-display text-sm font-bold text-slate-300 transition-colors group-hover:text-slate-400">
              {r.rank}
            </span>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-900 text-[11px] font-bold text-white">
              {r.tier}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{r.name}</p>
              <p className="truncate text-[11px] font-medium text-slate-400">{r.area}</p>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-800"
                  style={{ width: `${(r.score / MAX) * 100}%` }}
                />
              </div>
            </div>
            <span className="font-display text-base font-bold text-ink">{r.score.toFixed(1)}</span>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <Link
        to="/leaderboard"
        className="relative flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-slate-50"
      >
        See full leaderboard
        <ArrowUpRight weight="bold" className="h-4 w-4" />
      </Link>
    </div>
  );
}

const LINE_BUILDINGS = [
  { x: 0, w: 80, h: 70 }, { x: 90, w: 50, h: 120 }, { x: 150, w: 70, h: 55 },
  { x: 230, w: 60, h: 140 }, { x: 300, w: 90, h: 85 }, { x: 400, w: 50, h: 160 },
  { x: 460, w: 70, h: 70 }, { x: 540, w: 60, h: 130 }, { x: 610, w: 85, h: 95 },
  { x: 705, w: 55, h: 175 }, { x: 770, w: 70, h: 75 }, { x: 850, w: 95, h: 150 },
  { x: 955, w: 50, h: 65 }, { x: 1015, w: 75, h: 130 }, { x: 1100, w: 60, h: 90 },
  { x: 1170, w: 90, h: 160 }, { x: 1270, w: 55, h: 75 }, { x: 1335, w: 85, h: 135 }
];
