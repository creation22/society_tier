import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapView from '../components/MapView.jsx';
import Skeleton from '../components/Skeleton.jsx';
import api from '../utils/api.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useSEO } from '../utils/seo.js';
import { tierColor } from '../utils/tier.js';
import { formatCount, formatRating } from '../utils/format.js';

const TIERS = ['S', 'A', 'B', 'C', 'D'];
const AREAS = [
  'Golf Course Road',
  'Golf Course Extension',
  'Dwarka Expressway',
  'New Gurgaon',
  'Sohna Road'
];

export default function MapPage() {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [tiers, setTiers] = useState(new Set());
  const [minRating, setMinRating] = useState(0);
  const [areas, setAreas] = useState(new Set());
  const [sector, setSector] = useState('');
  const [bhk, setBhk] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('rating');
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('map'); // mobile only: 'list' | 'map'
  const debouncedSector = useDebounce(sector);
  const listRef = useRef(null);

  useSEO({ title: 'Gurgaon Society Map — GurgaonFlat', path: '/map' });

  // Toggle a value inside a Set-based filter state.
  const toggle = (setter) => (value) =>
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });

  const params = useMemo(
    () => ({
      limit: 100,
      ...(tiers.size ? { tier: [...tiers].join(',') } : {}),
      ...(minRating ? { minRating } : {}),
      ...(areas.size ? { area: [...areas][0] } : {}), // single-select: picking one clears the others
      ...(debouncedSector ? { sector: debouncedSector } : {}),
      ...(bhk ? { bhk } : {}),
      ...(maxPrice ? { maxPrice } : {})
    }),
    [tiers, minRating, areas, debouncedSector, bhk, maxPrice]
  );

  useEffect(() => {
    setLoading(true);
    setFetchError('');
    api
      .get('/societies', { params })
      .then((res) => {
        const items = Array.isArray(res.data) ? res.data : res.data?.items;
        setSocieties(Array.isArray(items) ? items : []);
      })
      .catch((e) => {
        setSocieties([]);
        const status = e?.response?.status;
        setFetchError(
          status
            ? `Couldn't load societies (HTTP ${status}). The map is live — pins will appear once the API responds.`
            : "Couldn't reach the API server. Start the backend (npm run dev:server) and pins will appear."
        );
      })
      .finally(() => setLoading(false));
  }, [params]);

  const pickArea = (value) =>
    setAreas((prev) => (prev.has(value) ? new Set() : new Set([value])));

  const onBoundsChange = useCallback(() => {}, []);

  const sorted = useMemo(() => {
    const arr = [...societies];
    if (sort === 'rating') arr.sort((a, b) => b.overallRating - a.overallRating);
    else if (sort === 'reviews') arr.sort((a, b) => b.ratingCount - a.ratingCount);
    else arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [societies, sort]);

  const activeFilters =
    tiers.size + areas.size + (minRating ? 1 : 0) + (bhk ? 1 : 0) + (maxPrice ? 1 : 0) + (sector.trim() ? 1 : 0);

  const clearAll = () => {
    setTiers(new Set());
    setAreas(new Set());
    setMinRating(0);
    setBhk('');
    setMaxPrice('');
    setSector('');
  };

  const pickSociety = (slug) => {
    setSelected(slug);
    if (window.innerWidth < 768) setTab('map');
  };

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      {/* Mobile segmented control */}
      <div className="shrink-0 border-b border-slate-200 px-4 py-3 md:hidden">
        <div className="flex rounded-full bg-slate-100 p-1">
          <button
            onClick={() => setTab('list')}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
              tab === 'list' ? 'bg-white text-ink shadow-sm' : 'text-slate-500'
            }`}
          >
            Results ({societies.length})
          </button>
          <button
            onClick={() => setTab('map')}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
              tab === 'map' ? 'bg-white text-ink shadow-sm' : 'text-slate-500'
            }`}
          >
            Map
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* ── SIDEBAR ─────────────────────────────────────── */}
        <aside
          className={`${tab === 'list' ? 'block' : 'hidden'} shrink-0 overflow-y-auto border-b border-slate-200 bg-white p-4 md:block md:w-80 md:border-b-0 md:border-r`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Gurgaon</h1>
              <p className="text-xs font-medium text-slate-500">
                {loading ? 'Loading…' : `${sorted.length} societies`}
              </p>
            </div>
            {activeFilters > 0 && (
              <button
                onClick={clearAll}
                className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
              >
                Clear · {activeFilters}
              </button>
            )}
          </div>

          <input
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            placeholder="Filter by sector e.g. Sector 57"
            className="field mt-4"
          />

          <div className="mt-6 space-y-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Tier</p>
              <div className="flex flex-wrap gap-1.5">
                {TIERS.map((t) => {
                  const on = tiers.has(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggle(setTiers)(t)}
                      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
                        on
                          ? 'border-transparent text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                      style={on ? { background: tierColor(t) } : {}}
                    >
                      {!on && <span className="h-2 w-2 rounded-full" style={{ background: tierColor(t) }} />}
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Rating</p>
              <div className="flex flex-wrap gap-1.5">
                {[0, 9, 8, 7].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
                      minRating === r
                        ? 'border-ink bg-ink text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {r === 0 ? 'Any' : `${r}+`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Area</p>
              <div className="flex flex-col gap-1.5">
                {AREAS.map((a) => {
                  const on = areas.has(a);
                  return (
                    <button
                      key={a}
                      onClick={() => pickArea(a)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors ${
                        on ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {a}
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-md border text-[11px] ${
                          on ? 'border-white/40 bg-white/10 text-white' : 'border-slate-300 bg-white text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">More filters</p>
              <select value={bhk} onChange={(e) => setBhk(e.target.value)} className="field">
                <option value="">Any BHK</option>
                {[2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} BHK</option>
                ))}
              </select>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max ₹/sqft"
                className="field mt-2"
              />
            </div>
          </div>

          {/* ── RESULTS ──────────────────────────────────── */}
          <div ref={listRef}>
            <div className="mb-3 mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Results</p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-ink/10"
              >
                <option value="rating">Top rated</option>
                <option value="reviews">Most reviewed</option>
                <option value="name">A–Z</option>
              </select>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
                No societies match your filters
              </div>
            ) : (
              <ol className="space-y-2 pb-4">
                {sorted.map((s, i) => {
                  const isActive = selected === s.slug;
                  return (
                    <li key={s.slug}>
                      <button
                        onClick={() => pickSociety(s.slug)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                          isActive
                            ? 'border-slate-900 bg-white shadow-md ring-2 ring-ink/10'
                            : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <span className="w-5 shrink-0 text-xs font-bold text-slate-300">{i + 1}</span>
                        <span className="h-8 w-1.5 shrink-0 rounded-full" style={{ background: tierColor(s.tier) }} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-ink">{s.name}</span>
                          <span className="block truncate text-xs text-slate-500">
                            {s.sector} · {formatCount(s.ratingCount)} reviews
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block font-display text-sm font-bold text-ink">{formatRating(s.overallRating)}</span>
                          <span
                            className="mt-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-md px-1 text-[10px] font-bold text-white"
                            style={{ background: tierColor(s.tier) }}
                          >
                            {s.tier}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </aside>

        {/* ── MAP ─────────────────────────────────────────── */}
        <div className={`relative ${tab === 'map' ? 'block' : 'hidden'} min-h-0 flex-1 md:block`}>
          <MapView
            societies={sorted}
            onBoundsChange={onBoundsChange}
            selectedSlug={selected}
            onSelect={setSelected}
          />
          {/* Explain why no pins are showing — the map itself can't tell. */}
          {fetchError && (
            <div className="pointer-events-none absolute left-1/2 top-20 z-20 -translate-x-1/2 rounded-2xl border border-rose-200 bg-white/95 px-4 py-3 text-center text-sm font-medium text-rose-700 shadow-lg backdrop-blur">
              {fetchError}
            </div>
          )}
          {!loading && !fetchError && sorted.length === 0 && (
            <div className="pointer-events-none absolute left-1/2 top-20 z-20 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-center text-sm font-medium text-slate-600 shadow-lg backdrop-blur">
              No societies match your filters — clear them to see pins on the map.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
