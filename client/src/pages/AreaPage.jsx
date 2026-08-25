import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Compass, ArrowRight } from '@phosphor-icons/react';
import SocietyCard from '../components/SocietyCard.jsx';
import MapView from '../components/MapView.jsx';
import api from '../utils/api.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useSEO } from '../utils/seo.js';

export default function AreaPage() {
  const { area } = useParams();
  const [data, setData] = useState(null);

  useSEO({
    title: data ? `Best Societies in ${data.area} — Ranked | GurgaonFlat` : `Area — GurgaonFlat`,
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

  if (!data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="h-96 rounded-2xl border border-slate-200 bg-slate-100/70 animate-pulse" />
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <EmptyState
          icon={Compass}
          title="Area not found"
          description="We could not find that area. Browse all Gurgaon societies instead."
          action={
            <Link
              to="/societies"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              All societies
              <ArrowRight weight="bold" className="h-4 w-4" />
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Areas', to: '/societies' }, { label: data.area }]}
        eyebrow="Area ranking"
        title={data.area}
        accent="ranked"
        intro={`${data.count} societies in ${data.area}, Gurgaon — ranked by the people who actually live there.`}
      />

      {/* Map */}
      <section className="mx-auto max-w-7xl px-4 pb-2">
        <Reveal>
          <div className="h-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-80 lg:h-96">
            <MapView societies={data.items.slice(0, 30)} />
          </div>
        </Reveal>
      </section>

      {/* Ranked list */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <MapPin weight="duotone" className="h-4 w-4" />
          Ranked by overall resident rating
        </div>
        <ol className="space-y-3">
          {data.items.map((s) => (
            <li key={s.slug}>
              <Reveal y={16}>
                <SocietyCard society={s} rank={s.rank} />
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
