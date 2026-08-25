import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SquaresFour, MagnifyingGlass, Funnel, CaretDown } from '@phosphor-icons/react';
import SocietyCard from '../components/SocietyCard.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { cn } from '../utils/cn.js';
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

  useSEO({ title: 'All Gurgaon Societies — GurgaonFlat', path: '/societies' });

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Societies' }]}
        eyebrow="The directory"
        title="All"
        accent="societies"
        intro="Every rated society in Gurgaon, ranked and filtered by what residents actually say."
      />

      <section className="mx-auto max-w-7xl px-4 pb-16">
        {/* Filters */}
        <Reveal>
          <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
            <div className="relative flex-1 lg:max-w-xs">
              <MagnifyingGlass
                weight="bold"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                value={q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Search name, builder…"
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm font-medium text-ink outline-none transition-colors placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Funnel weight="fill" className="h-3.5 w-3.5" /> Tier
              </span>
              <button
                onClick={() => update({ tier: '' })}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
                  !tier ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-ink'
                )}
              >
                All
              </button>
              {TIERS.map((t) => (
                <button
                  key={t}
                  onClick={() => update({ tier: t })}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
                    tier === t ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-ink'
                  )}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: tierColor(t) }}
                    aria-hidden="true"
                  />
                  {t}
                </button>
              ))}
            </div>

            <div className="relative ml-auto">
              <select
                value={sort}
                onChange={(e) => update({ sort: e.target.value })}
                className="appearance-none rounded-full border border-slate-200 bg-white py-2 pl-4 pr-9 text-xs font-semibold text-ink outline-none transition-colors focus:border-slate-300"
              >
                <option value="rank">Ranking score</option>
                <option value="rating">Rating</option>
                <option value="popular">Most rated</option>
                <option value="name">Name A–Z</option>
              </select>
              <CaretDown
                weight="bold"
                className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </Reveal>

        {!data ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl border border-slate-200 bg-slate-100/70 animate-pulse"
              />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <EmptyState
            icon={SquaresFour}
            title="No societies match"
            description="Try fewer filters or a broader search term."
            action={
              <button
                onClick={() => update({ q: '', tier: '', sector: '' })}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {data.total} results
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((s) => (
                <Reveal key={s.slug} y={16}>
                  <SocietyCard society={s} />
                </Reveal>
              ))}
            </div>
            {data.pages > 1 && (
              <div className="mt-10 flex flex-wrap justify-center gap-1.5">
                {[...Array(data.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => update({ page: String(i + 1) })}
                    className={cn(
                      'inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                      page === i + 1
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-ink'
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
