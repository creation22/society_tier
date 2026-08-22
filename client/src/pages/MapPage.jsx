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

  useSEO({ title: 'Gurgaon Society Map — Society Tier', path: '/' });

  const params = useMemo(
    () => ({
      limit: 100,
      ...(tiers.size ? { tier: [...tiers].join(',') } : {}),
      ...(minRating ? { minRating } : {}),
      ...(areas.size ? { area: [...areas][0] } : {}),
      ...(debouncedSector ? { sector: debouncedSector } : {}),
      ...(bhk ? { bhk } : {}),
      ...(maxPrice ? { maxPrice } : {})
    }),
    [tiers, minRating, areas, debouncedSector, bhk, maxPrice]
  );

  useEffect(() => {
    setLoading(true);
    api
      .get('/societies', { params })
      .then((res) => setSocieties(res.data.items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params]);

  const toggle = (setFn) => (value) =>
    setFn((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });

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
      <div className="shrink-0 border-b-3 border-ink px-4 py-3 md:hidden">
        <div className="grid grid-cols-2 gap-0 border-3 border-ink bg-white shadow-brutal-sm">
          <button
            onClick={() => setTab('list')}
            className={`border-r-3 border-ink py-2.5 text-sm font-bold uppercase transition-colors ${
              tab === 'list' ? 'bg-tierS' : 'bg-white hover:bg-tierS/30'
            }`}
          >
            Results ({societies.length})
          </button>
          <button
            onClick={() => setTab('map')}
            className={`py-2.5 text-sm font-bold uppercase transition-colors ${
              tab === 'map' ? 'bg-tierS' : 'bg-white hover:bg-tierS/30'
            }`}
          >
            Map
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* ── SIDEBAR ─────────────────────────────────────── */}
        <aside
          className={`${tab === 'list' ? 'block' : 'hidden'} shrink-0 overflow-y-auto border-b-3 border-ink bg-cream p-4 md:block md:w-80 md:border-b-0 md:border-r-3`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="font-display text-2xl uppercase">Gurgaon</h1>
              <p className="text-xs font-bold uppercase text-gray-600">
                {loading ? 'Loading…' : `${sorted.length} societies`}
              </p>
            </div>
            {activeFilters > 0 && (
              <button
                onClick={clearAll}
                className="border-3 border-ink bg-tierD px-2 py-1 text-xs font-bold uppercase text-white shadow-brutal-sm transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
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
              <p className="section-heading mb-2 text-sm">Tier</p>
              <div className="flex flex-wrap gap-2">
                {TIERS.map((t) => {
                  const on = tiers.has(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggle(setTiers)(t)}
                      className={`flex items-center gap-1.5 border-3 border-ink px-2.5 py-1.5 text-xs font-bold uppercase shadow-brutal-sm transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${
                        on ? 'text-ink' : 'bg-white hover:bg-tierS/30'
                      }`}
                      style={on ? { background: tierColor(t) } : {}}
                    >
                      {!on && <span className="h-2 w-2 border-2 border-ink" style={{ background: tierColor(t) }} />}
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="section-heading mb-2 text-sm">Rating</p>
              <div className="flex gap-2">
                {[0, 9, 8, 7].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`border-3 border-ink px-2.5 py-1 text-xs font-bold shadow-brutal-sm transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${
                      minRating === r ? 'bg-tierS' : 'bg-white hover:bg-tierS/30'
                    }`}
                  >
                    {r === 0 ? 'Any' : `${r}+`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="section-heading mb-2 text-sm">Area</p>
              <div className="flex flex-col gap-2">
                {AREAS.map((a) => {
                  const on = areas.has(a);
                  return (
                    <button
                      key={a}
                      onClick={() => toggle(setAreas)(a)}
                      className={`flex items-center justify-between border-3 border-ink px-3 py-2.5 text-left text-sm font-bold uppercase shadow-brutal-sm transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${
                        on ? 'bg-tierS' : 'bg-white hover:bg-tierS/30'
                      }`}
                    >
                      {a}
                      <span
                        className={`flex h-5 w-5 items-center justify-center border-2 border-ink text-[11px] ${
                          on ? 'bg-ink text-white' : 'bg-white'
                        }`}
                      >
                        {on ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="section-heading mb-2 text-sm">More filters</p>
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
            <div className="mb-3 mt-6 flex items-center justify-between border-t-3 border-dashed border-ink pt-4">
              <p className="section-heading text-sm">Results</p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border-3 border-ink bg-white px-2 py-1 text-xs font-bold shadow-brutal-sm focus:outline-none"
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
              <div className="border-3 border-dashed border-ink bg-paper p-4 text-center text-sm font-bold uppercase text-gray-500">
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
                        className={`flex w-full items-center gap-3 border-3 border-ink px-3 py-2.5 text-left transition-all ${
                          isActive
                            ? '-translate-x-[3px] -translate-y-[3px] bg-white shadow-brutal'
                            : 'bg-paper shadow-brutal-sm hover:-translate-y-0.5 hover:shadow-brutal'
                        }`}
                      >
                        <span className="w-5 shrink-0 text-xs font-bold text-gray-400">{i + 1}</span>
                        <span className="h-8 w-1.5 shrink-0 border-2 border-ink" style={{ background: tierColor(s.tier) }} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold">{s.name}</span>
                          <span className="block truncate text-xs font-semibold uppercase text-gray-500">
                            {s.sector} · {formatCount(s.ratingCount)} reviews
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block text-sm font-extrabold">{formatRating(s.overallRating)}</span>
                          <span
                            className="inline-block border-2 border-ink px-1 text-[10px] font-extrabold"
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
        <div className={`${tab === 'map' ? 'block' : 'hidden'} min-h-0 flex-1 md:block`}>
          <MapView
            societies={sorted}
            onBoundsChange={onBoundsChange}
            selectedSlug={selected}
            onSelect={setSelected}
          />
        </div>
      </div>
    </div>
  );
}
