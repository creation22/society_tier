import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SocietyCard, { TierChip } from '../components/SocietyCard.jsx';
import MapView from '../components/MapView.jsx';
import api from '../utils/api.js';
import { useSEO } from '../utils/seo.js';

export default function AreaPage() {
  const { area } = useParams();
  const [data, setData] = useState(null);

  useSEO({
    title: data ? `Best Societies in ${data.area} — Ranked | GurgaonTier` : `Area — GurgaonTier`,
    description: data ? `Ranked societies in ${data.area}, Gurgaon based on resident ratings.` : undefined,
    path: `/area/${area}`
  });

  useEffect(() => {
    setData(null);
    api
      .get(`/areas/${encodeURIComponent(area)}`)
      .then(setData)
      .catch(() => setData({ error: true }));
  }, [area]);

  if (!data) return <div className="mx-auto max-w-7xl animate-pulse px-4 py-10"><div className="h-96 border-3 border-ink bg-ink/10" /></div>;
  if (data.error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl uppercase">Area not found</h1>
        <Link to="/societies" className="brutal-btn mt-4 bg-tierS">All Societies</Link>
      </div>
    );
  }

  return (
    <>
      <section className="border-b-3 border-ink bg-tierS">
        <div className="mx-auto flex flex-wrap items-end gap-4 px-4 py-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em]">Area Ranking</p>
            <h1 className="font-display text-4xl uppercase sm:text-6xl">{data.area}</h1>
            <p className="mt-1 font-bold uppercase">{data.count} societies · ranked by residents</p>
          </div>
          <div className="ml-auto h-40 w-full border-3 border-ink bg-paper shadow-brutal sm:w-96">
            <MapView societies={data.items.slice(0, 30)} />
          </div>
        </div>
      </section>

      <ol className="mx-auto max-w-5xl space-y-3 px-4 py-10">
        {data.items.map((s) => (
          <li key={s.slug}>
            <Link to={`/society/${s.slug}`} className="flex items-center gap-3 border-3 border-ink bg-paper px-4 py-3 shadow-brutal-sm hover:-translate-y-0.5 hover:shadow-brutal">
              <span className="w-12 font-display text-xl">{`#${s.rank}`}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display uppercase">{s.name}</span>
                <span className="text-xs font-bold uppercase text-gray-600">{s.builder || ''} {s.sector}</span>
              </span>
              <span className="hidden w-14 text-right font-display text-lg sm:block">{Number(s.overallRating).toFixed(1)}</span>
              <TierChip tier={s.tier} />
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
