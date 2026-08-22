import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SocietyCard from '../components/SocietyCard.jsx';
import { CardSkeleton } from '../components/Skeleton.jsx';
import api from '../utils/api.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useSEO } from '../utils/seo.js';
import { tierColor } from '../utils/tier.js';

const TIERS = ['S', 'A', 'B', 'C', 'D'];

export default function SocietiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const q = searchParams.get('q') || '';
  const tier = searchParams.get('tier') || '';
  const sector = searchParams.get('sector') || '';
  const sort = searchParams.get('sort') || 'rank';
  const page = Number(searchParams.get('page') || 1);
  const debouncedQ = useDebounce(q);

  const params = useMemo(
    () => ({ q: debouncedQ || undefined, tier: tier || undefined, sector: sector || undefined, sort, page, limit: 12 }),
    [debouncedQ, tier, sector, sort, page]
  );

  useEffect(() => {
    setData(null);
    api.get('/societies', { params }).then((res) => setData(res.data)).catch(() => setData({ items: [] }));
  }, [params]);

  function update(patch) {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!('page' in patch)) next.delete('page');
    setSearchParams(next);
  }

  useSEO({ title: 'All Gurgaon Societies — GurgaonTier', path: '/societies' });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-4xl uppercase sm:text-5xl">All Societies</h1>
      <p className="mb-6 font-bold uppercase tracking-wide text-gray-600">Find your next society.</p>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-2 border-3 border-ink bg-paper p-3 shadow-brutal">
        <input
          value={q}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="Search name, builder…"
          className="w-full max-w-xs border-3 border-ink bg-white px-3 py-2 font-semibold outline-none transition focus:shadow-brutal-sm sm:w-auto"
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => update({ tier: '' })}
            className={`border-3 border-ink px-2.5 py-1 text-xs font-bold uppercase shadow-brutal-sm transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${!tier ? 'bg-tierS' : 'bg-white hover:bg-tierS/30'}`}
          >
            All
          </button>
          {TIERS.map((t) => (
            <button
              key={t}
              onClick={() => update({ tier: t })}
              style={tier === t ? { background: tierColor(t) } : {}}
              className={`border-3 border-ink px-2.5 py-1 text-xs font-bold uppercase shadow-brutal-sm transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${tier === t ? '' : 'bg-white hover:bg-tierS/30'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="ml-auto border-3 border-ink bg-white px-2 py-1.5 text-xs font-bold uppercase outline-none focus:shadow-brutal-sm"
        >
          <option value="rank">Ranking Score</option>
          <option value="rating">Rating</option>
          <option value="popular">Most Rated</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {!data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : data.items.length === 0 ? (
        <p className="border-3 border-dashed border-ink p-10 text-center font-bold uppercase text-gray-600">No societies match. Try fewer filters.</p>
      ) : (
        <>
          <p className="mb-4 text-sm font-bold uppercase text-gray-600">{data.total} results</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((s) => (
              <SocietyCard key={s.slug} society={s} />
            ))}
          </div>
          {data.pages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {[...Array(data.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => update({ page: String(i + 1) })}
                  className={`h-10 w-10 border-3 border-ink font-display shadow-brutal-sm ${page === i + 1 ? 'bg-tierS' : 'bg-white'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
