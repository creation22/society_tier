import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SocietyCard, { TierChip } from '../components/SocietyCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import api from '../utils/api.js';
import { RATING_PARAMS } from '../utils/tier.js';
import { useSEO } from '../utils/seo.js';

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const slugs = (searchParams.get('socs') || searchParams.get('a') || '')
    .split(',')
    .filter(Boolean)
    .slice(0, 3);
  const [societies, setSocieties] = useState(null);
  const [pickerFor, setPickerFor] = useState(null);

  useSEO({ title: 'Compare Gurgaon Societies — GurgaonFlat', path: '/compare' });

  useEffect(() => {
    if (!slugs.length) {
      setSocieties([]);
      return undefined;
    }
    Promise.all(slugs.map((slug) => api.get(`/societies/${slug}`).then((r) => r.data.society).catch(() => null))).then(
      setSocieties
    );
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!societies) return <div className="mx-auto max-w-6xl animate-pulse px-4 py-10"><div className="h-96 border-3 border-ink bg-ink/10" /></div>;

  if (societies.length < 2 || societies.includes(null)) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="font-display text-4xl uppercase">Compare Societies</h1>
        <p className="mb-8 mt-2 font-bold uppercase text-gray-600">Pick at least two. Settle the debate.</p>
        <div className="grid gap-6 lg:grid-cols-2">
          {[0, 1].map((slot) => {
            const chosen = societies[slot] && societies[slot] !== null ? societies[slot] : null;
            return (
              <div key={slot} className="border-3 border-dashed border-ink p-5">
                {chosen ? (
                  <div>
                    <SocietyCard society={chosen} />
                    <button onClick={() => setPickerFor(slot)} className="brutal-btn mt-3 w-full bg-white">
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="mb-4 font-display text-xl uppercase">Slot {slot + 1}</p>
                    <SearchBar />
                    <QuickPicks onPick={(slug) => addSlug(slug)} exclude={slugs} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function addSlug(slug) {
    const next = [...slugs.filter(Boolean), slug].join(',');
    window.location.href = `/compare?socs=${next}`;
  }

  function scoreOf(s, key) {
    if (key === 'overall') return Number(s.overallRating);
    const cs = s.categoryScores instanceof Map ? Object.fromEntries(s.categoryScores) : s.categoryScores || {};
    return cs[key];
  }

  const rows = [{ key: 'overall', label: 'Overall' }, ...RATING_PARAMS.map((p) => ({ key: p.key, label: p.label }))];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl uppercase sm:text-5xl">The Faceoff</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {societies.map((s) => (
          <div key={s.slug}>
            <Link to={`/society/${s.slug}`} className="block border-3 border-ink bg-paper p-4 shadow-brutal hover:bg-tierS/30">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg uppercase">{s.name}</h2>
                <TierChip tier={s.tier} />
              </div>
              <p className="text-xs font-bold uppercase text-gray-600">{s.sector}</p>
            </Link>
          </div>
        ))}
      </div>

      {/* Comparison table — horizontally scrollable wrapper for mobile */}
      <div className="mt-8 overflow-x-auto border-3 border-ink bg-paper shadow-brutal">
        <table className="w-full min-w-[480px] border-collapse text-left">
          <thead>
            <tr className="border-b-3 border-ink bg-ink text-cream">
              <th className="px-4 py-3 font-display uppercase">Parameter</th>
              {societies.map((s) => (
                <th key={s.slug} className="px-4 py-3 text-right font-display uppercase">{s.name.split(' ').slice(-2).join(' ')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const scores = societies.map((s) => scoreOf(s, row.key));
              const best = Math.max(...scores);
              return (
                <tr key={row.key} className={ri % 2 ? 'bg-cream/60' : ''}>
                  <td className="border-t-2 border-ink/20 px-4 py-2.5 text-sm font-bold uppercase">{row.label}</td>
                  {scores.map((v, i) => (
                    <td
                      key={i}
                      className={`border-t-2 border-ink/20 px-4 py-2.5 text-right font-display ${
                        v === best && scores.filter((x) => x === best).length < societies.length ? 'bg-tierA' : ''
                      }`}
                    >
                      {v != null ? Number(v).toFixed(1) : '–'}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QuickPicks({ onPick, exclude }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get('/leaderboard/overall').then((res) => setItems(res.data.items.slice(0, 8))).catch(() => {});
  }, []);
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.filter((i) => !exclude.includes(i.slug)).map((i) => (
        <button key={i.slug} onClick={() => onPick(i.slug)} className="border-3 border-ink bg-white px-2 py-1 text-xs font-bold uppercase shadow-brutal-sm hover:bg-tierS">
          + {i.name}
        </button>
      ))}
    </div>
  );
}
