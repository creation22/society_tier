import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CaretUp, CaretDown, Minus, Trophy } from '@phosphor-icons/react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import TierBadge from '../components/ui/TierBadge.jsx';
import { LEADERBOARD_TABS, tierColor } from '../utils/tier.js';
import { formatCount } from '../utils/format.js';
import api from '../utils/api.js';
import { useSEO } from '../utils/seo.js';
import { cn } from '../utils/cn.js';

const CATEGORY_SLUGS = {
  overall: 'best-societies-gurgaon',
  families: 'best-societies-for-families',
  professionals: 'best-societies-for-bachelors'
};

export default function LeaderboardPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const slugToCategory = Object.fromEntries(Object.entries(CATEGORY_SLUGS).map(([k, v]) => [v, k]));
  const category =
    (params.category && slugToCategory[params.category]) || searchParams.get('category') || 'overall';

  const [items, setItems] = useState(null);
  const [movement, setMovement] = useState({});

  const activeLabel = LEADERBOARD_TABS.find((t) => t.id === category)?.label || 'Overall';
  useSEO({
    title: `The Gurgaon Leaderboard — ${activeLabel} | GurgaonFlat`,
    description: `Ranked list of Gurgaon societies by ${category}. Confidence-adjusted scores based on real resident ratings.`,
    path: '/leaderboard'
  });

  useEffect(() => {
    setItems(null);
    api
      .get(`/leaderboard/${category}`)
      .then((res) => {
        const list = res.data.items;
        setItems(list);
        try {
          const key = `tier-ranks:${category}`;
          const prev = JSON.parse(localStorage.getItem(key) || 'null');
          if (prev) {
            const moves = {};
            list.forEach((s, i) => {
              const before = prev[s.slug];
              moves[s.slug] = before == null ? null : before - (i + 1);
            });
            setMovement(moves);
          }
          localStorage.setItem(key, JSON.stringify(Object.fromEntries(list.map((s, i) => [s.slug, i + 1]))));
        } catch {
          /* storage unavailable */
        }
      })
      .catch(() => setItems([]));
  }, [category]);

  return (
    <>
      <PageHeader
        eyebrow="Leaderboard"
        title="The Gurgaon"
        accent="Leaderboard."
        intro="Confidence-adjusted. Resident-powered. Zero brokers. A Bayesian prior keeps 1,500 ratings honest against 5."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Leaderboard' }]}
      />

      <section className="mx-auto max-w-5xl px-4 py-12">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-5">
          {LEADERBOARD_TABS.map((t) => (
            <Link
              key={t.id}
              to={t.id === 'overall' ? '/leaderboard' : `/leaderboard?category=${t.id}`}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
                category === t.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-ink'
              )}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* Rows */}
        <div className="mt-8">
          {!items ? (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-2xl border border-slate-200 bg-slate-100/70"
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="No societies ranked yet"
              description="There isn’t enough resident data for this category. Be the first to rate your society and move the needle."
            />
          ) : (
            <ol className="space-y-3">
              {items.map((s, i) => (
                <Reveal key={s.slug} delay={Math.min(i * 0.04, 0.3)}>
                  <LeaderRow rank={i + 1} society={s} movement={movement[s.slug]} />
                </Reveal>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}

function Movement({ delta }) {
  if (delta == null || delta === 0)
    return <span title="No change" className="flex items-center text-xs font-semibold text-slate-400"><Minus weight="bold" className="h-3.5 w-3.5" /></span>;
  if (delta > 0)
    return <span title={`Up ${delta}`} className="flex items-center gap-0.5 text-xs font-bold text-emerald-600"><CaretUp weight="fill" className="h-3.5 w-3.5" />{delta}</span>;
  return <span title={`Down ${-delta}`} className="flex items-center gap-0.5 text-xs font-bold text-rose-600"><CaretDown weight="fill" className="h-3.5 w-3.5" />{-delta}</span>;
}

function LeaderRow({ rank, society: s, movement }) {
  const score = Number(s.score).toFixed(1);
  const pct = Math.min(100, (Number(s.score) / 10) * 100);
  const podium = rank <= 3;
  return (
    <li>
      <Link
        to={`/society/${s.slug}`}
        className={cn(
          'group flex items-center gap-4 rounded-2xl border bg-white px-4 py-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
          podium ? 'border-slate-300' : 'border-slate-200 hover:border-slate-300'
        )}
      >
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold',
            rank === 1
              ? 'bg-amber-400 text-white'
              : rank === 2
                ? 'bg-slate-300 text-slate-900'
                : rank === 3
                  ? 'bg-amber-700 text-white'
                  : 'bg-slate-100 text-slate-500'
          )}
        >
          {rank}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-bold text-ink">{s.name}</p>
          <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
            {s.sector}{s.area ? ` · ${s.area}` : ''} · {formatCount(s.ratingCount)} ratings
          </p>
          <div className="mt-2 hidden h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-slate-100 sm:block">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: tierColor(s.tier) }} />
          </div>
        </div>

        <div className="hidden w-16 shrink-0 text-right sm:block">
          <Movement delta={movement} />
        </div>
        <span className="w-14 shrink-0 text-right font-display text-xl font-bold text-ink">{score}</span>
        <TierBadge tier={s.tier} />
      </Link>
    </li>
  );
}
