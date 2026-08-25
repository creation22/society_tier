import { motion, useReducedMotion } from 'framer-motion';
import {
  MapTrifold,
  Trophy,
  ChatsCircle,
  GitDiff,
  MagnifyingGlass,
  ShieldCheck,
  MapPin,
  Check
} from '@phosphor-icons/react';
import { tierColor } from '../../utils/tier.js';
import Reveal from '../ui/Reveal.jsx';
import { cn } from '../../utils/cn.js';

const EASE = [0.16, 1, 0.3, 1];
const TIERS = ['S', 'A', 'B', 'C', 'D'];

const FEATURES = [
  { icon: MapTrifold, title: 'Interactive City Map', body: 'Pan across every Gurgaon sector. Filter by tier, rating, area, BHK and price to find exactly what fits your life.', Viz: MapViz },
  { icon: Trophy, title: 'S–D Tier Rankings', body: 'A gaming-style tier list powered by a Bayesian confidence-adjusted score — 1,500 ratings weigh more than 5.', Viz: TierBarsViz },
  { icon: ChatsCircle, title: 'Resident Discussions', body: 'Reddit-style threaded comments with votes, tags and sorting. Read what people actually living there think.', Viz: ChatsViz },
  { icon: GitDiff, title: 'Side-by-Side Compare', body: 'Stack any two societies and see a 10-parameter breakdown with the winner highlighted on every metric.', Viz: CompareViz },
  { icon: MagnifyingGlass, title: 'Find Flats', body: 'A focused discovery flow that surfaces societies matching your budget, BHK and preferred corridor.', Viz: SliderViz },
  { icon: ShieldCheck, title: 'Trustworthy by Design', body: 'No broker spin, no paid listings. Ratings come from real residents and one rating per account per society.', Viz: ShieldViz }
];

export default function FeaturesShowcase() {
  return (
    <section id="features" className="relative bg-cream px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
            Everything you need
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            One platform for the <em className="font-serif font-normal italic">whole</em> society decision
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
            From discovery to due diligence — explore the map, read real discussions, compare side by side,
            and trust a ranking that respects sample size.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <article className="group h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
                <f.Viz />
                <div className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors group-hover:bg-slate-700">
                    <f.icon weight="duotone" className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 1. Map: grid + pulsing pins + drawn route ── */
function MapViz() {
  const reduce = useReducedMotion();
  const pins = [
    { x: '22%', y: '30%' },
    { x: '58%', y: '52%' },
    { x: '78%', y: '28%' }
  ];
  return (
    <div className="relative h-32 overflow-hidden border-b border-slate-100 bg-slate-50">
      <div className="absolute inset-0 bg-grid-soft opacity-70" />
      <svg className="absolute inset-0 h-full w-full text-ink/40" viewBox="0 0 100 60" preserveAspectRatio="none" fill="none">
        <motion.path
          d="M22 18 Q 40 40 58 32 T 78 17"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          initial={{ pathLength: reduce ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
        />
      </svg>
      {pins.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ left: p.x, top: p.y }}
          animate={reduce ? undefined : { scale: [1, 1.18, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        >
          <span className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-ink/20 blur-[1px]" />
          <MapPin weight="fill" className="relative h-5 w-5 text-ink" />
        </motion.span>
      ))}
    </div>
  );
}

/* ── 2. Tier bars: animated rising bars ── */
function TierBarsViz() {
  const reduce = useReducedMotion();
  const heights = [92, 74, 58, 40, 24];
  return (
    <div className="flex h-32 items-end justify-center gap-2.5 border-b border-slate-100 bg-slate-50 px-6 pb-4 pt-3">
      {TIERS.map((t, i) => (
        <div key={t} className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex h-full w-full items-end justify-center">
            <motion.div
              className="w-full max-w-[28px] rounded-t-md"
              style={{ background: tierColor(t) }}
              initial={{ height: reduce ? `${heights[i]}%` : 0 }}
              whileInView={{ height: `${heights[i]}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-400">{t}</span>
        </div>
      ))}
    </div>
  );
}

/* ── 3. Discussions: floating chat bubbles ── */
function ChatsViz() {
  const reduce = useReducedMotion();
  const bubbles = [
    { x: '14%', y: '30%', w: '46%', d: 0 },
    { x: '34%', y: '52%', w: '54%', d: 0.6 },
    { x: '8%', y: '68%', w: '38%', d: 1.2 }
  ];
  return (
    <div className="relative h-32 overflow-hidden border-b border-slate-100 bg-slate-50">
      {bubbles.map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-2xl rounded-bl-sm border border-slate-200 bg-white shadow-sm"
          style={{ left: b.x, top: b.y, width: b.w, height: '16px' }}
          animate={reduce ? undefined : { y: [0, -6, 0], opacity: [0, 1, 0.85] }}
          transition={{ duration: 3, repeat: Infinity, delay: b.d, ease: 'easeInOut' }}
        />
      ))}
      <ChatsCircle weight="duotone" className="absolute bottom-2 right-3 h-6 w-6 text-slate-300" />
    </div>
  );
}

/* ── 4. Compare: two racing bars + winner check ── */
function CompareViz() {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-32 flex-col justify-center gap-4 border-b border-slate-100 bg-slate-50 px-6">
      {[
        { label: 'Camellias', pct: 94, win: true },
        { label: 'Aralias', pct: 78, win: false }
      ].map((r, i) => (
        <div key={r.label} className="flex items-center gap-2.5">
          <span className="w-16 shrink-0 truncate text-[11px] font-semibold text-slate-500">{r.label}</span>
          <div className="relative h-3.5 flex-1 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: r.win ? '#0A0A0A' : '#cbd5e1' }}
              initial={{ width: reduce ? `${r.pct}%` : 0 }}
              whileInView={{ width: `${r.pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.15, ease: EASE }}
            />
          </div>
          {r.win && (
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 400, damping: 12 }}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-white"
            >
              <Check weight="bold" className="h-3 w-3" />
            </motion.span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── 5. Find Flats: filter pills + moving slider ── */
function SliderViz() {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-32 flex-col justify-center gap-3 border-b border-slate-100 bg-slate-50 px-6">
      <div className="flex gap-1.5">
        {['2BHK', '3BHK', '4BHK'].map((p, i) => (
          <span
            key={p}
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-semibold',
              i === 1 ? 'bg-ink text-white' : 'border border-slate-200 bg-white text-slate-500'
            )}
          >
            {p}
          </span>
        ))}
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-slate-200">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-ink"
          style={{ width: '62%' }}
          animate={reduce ? undefined : { width: ['62%', '40%', '62%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-ink bg-white shadow"
          style={{ left: '62%' }}
          animate={reduce ? undefined : { left: ['62%', '40%', '62%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-medium text-slate-400">
        <span>₹8K</span>
        <span>₹25K</span>
      </div>
    </div>
  );
}

/* ── 6. Trust: shield with drawn check ── */
function ShieldViz() {
  const reduce = useReducedMotion();
  return (
    <div className="relative flex h-32 items-center justify-center border-b border-slate-100 bg-slate-50">
      <svg viewBox="0 0 48 56" className="h-24 text-ink" fill="none" stroke="currentColor">
        <motion.path
          d="M24 4 L42 12 V28 C42 40 33 48 24 52 C15 48 6 40 6 28 V12 Z"
          strokeWidth="2"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0, opacity: 0.25 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
        />
        <motion.path
          d="M17 28 L22 33 L32 22"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
        />
      </svg>
    </div>
  );
}
