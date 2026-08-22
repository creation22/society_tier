import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { TierChip } from '../components/SocietyCard.jsx';
import { LEADERBOARD_TABS } from '../utils/tier.js';
import api from '../utils/api.js';
import { useSEO } from '../utils/seo.js';

const CATEGORY_SLUGS = {
  overall: 'best-societies-gurgaon',
  families: 'best-societies-for-families',
  professionals: 'best-societies-for-bachelors'
};

export default function LeaderboardPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  // Support both /leaderboard?category=x and SEO URLs /rankings/:slug
  const slugToCategory = Object.fromEntries(Object.entries(CATEGORY_SLUGS).map(([k, v]) => [v, k]));
  const category =
    (params.category && slugToCategory[params.category]) || searchParams.get('category') || 'overall';

  const [items, setItems] = useState(null);
  const [movement, setMovement] = useState({});

  useSEO({
    title: `The Gurgaon Leaderboard — ${LEADERBOARD_TABS.find((t) => t.id === category)?.label || 'Overall'} | GurgaonFlat`,
    description: `Ranked list of Gurgaon societies by ${category}. Confidence-adjusted scores based on real resident ratings.`,
    path: `/leaderboard`
  });

  useEffect(() => {
    setItems(null);
    api
      .get(`/leaderboard/${category}`)
      .then((res) => {
        const list = res.data.items;
        setItems(list);
        // Rank-change tracking via a local snapshot (movement since last visit).
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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-4xl uppercase sm:text-6xl">The Gurgaon Leaderboard</h1>
      <p className="mt-1 font-bold uppercase tracking-wide text-gray-600">
        Confidence-adjusted. Resident-powered. Zero brokers.
      </p>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b-3 border-ink pb-4">
        {LEADERBOARD_TABS.map((t) => (
          <Link
            key={t.id}
            to={t.id === 'overall' ? '/leaderboard' : `/leaderboard?category=${t.id}`}
            className={`border-3 border-ink px-3 py-1.5 text-xs font-bold uppercase shadow-brutal-sm transition-colors ${
              category === t.id ? 'bg-tierS' : 'bg-white hover:bg-tierS/40'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Rows */}
      {!items ? (
        <div className="mt-8 space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-14 animate-pulse border-3 border-ink bg-ink/10" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 border-3 border-dashed border-ink p-10 text-center font-bold uppercase text-gray-600">
          No societies have enough ratings yet. Be the first to rate.
        </div>
      ) : (
        <ol className="mt-8 space-y-3">
          {items.map((s, i) => (
            <LeaderRow key={s.slug} rank={i + 1} society={s} movement={movement[s.slug]} />
          ))}
        </ol>
      )}
    </div>
  );
}

function Movement({ delta }) {
  if (delta == null || delta === 0)
    return <span title="No change" className="font-display">—</span>;
  if (delta > 0) return <span title={`Up ${delta}`} className="font-display text-green-700">↑{delta}</span>;
  return <span title={`Down ${-delta}`} className="font-display text-red-600">↓{-delta}</span>;
}

function LeaderRow({ rank, society: s, movement }) {
  function onTilt(e) {
    const el = e.currentTarget;
    const x = (e.clientX - el.getBoundingClientRect().left) / el.offsetWidth - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 3}deg) translateX(4px)`;
  }
  return (
    <li>
      <Link
        to={`/society/${s.slug}`}
        onMouseMove={onTilt}
        onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
        className={`flex items-center gap-3 border-3 border-ink px-4 py-3 shadow-brutal transition-transform ${
          rank <= 3 ? ['bg-tierS', 'bg-tierA', 'bg-tierB text-white'][rank - 1] : 'bg-paper'
        }`}
      >
        <span className={`w-10 shrink-0 font-display text-xl ${rank === 1 ? 'text-2xl' : ''}`}>#{rank}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display uppercase leading-tight">{s.name}</span>
          <span className={`text-xs font-bold uppercase ${rank <= 3 && rank !== 2 ? 'opacity-80' : 'text-gray-600'}`}>
            {s.sector}{s.area ? ` · ${s.area}` : ''} · {s.ratingCount.toLocaleString()} ratings
          </span>
        </span>
        <Movement delta={movement[s.slug]} />
        <span className="hidden w-12 text-right font-display text-lg sm:block">{Number(s.score).toFixed(1)}</span>
        <TierChip tier={s.tier} />
      </Link>
    </li>
  );
}
