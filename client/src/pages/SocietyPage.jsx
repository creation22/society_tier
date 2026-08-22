import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { TierChip } from '../components/SocietyCard.jsx';
import RatingBars from '../components/RatingBars.jsx';
import RatingModal from '../components/RatingModal.jsx';
import CommentsSection from '../components/CommentsSection.jsx';
import MapView from '../components/MapView.jsx';
import SocietyCard from '../components/SocietyCard.jsx';
import AqiWidget from '../components/AqiWidget.jsx';
import api from '../utils/api.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { useSEO } from '../utils/seo.js';

export default function SocietyPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('openRate') === '1') setRateOpen(true);
  }, [searchParams]);

  useEffect(() => {
    setData(null);
    setNotFound(false);
    api
      .get(`/societies/${slug}`)
      .then((res) => setData(res.data))
      .catch(() => setNotFound(true));
    window.scrollTo(0, 0);
  }, [slug]);

  useSEO({
    title: data ? `${data.society.name} — ${Number(data.society.overallRating).toFixed(1)} ★ · ${data.society.tier} Tier | Society Tier` : 'Society — Society Tier',
    description: data
      ? `${data.society.name} in ${data.society.sector}, Gurgaon is rated ${Number(data.society.overallRating).toFixed(1)}/10 by ${data.society.ratingCount} residents. ${data.society.tier} Tier. Read resident reviews and rate it yourself.`
      : undefined,
    path: `/society/${slug}`
  });

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl uppercase">Society not found</h1>
        <Link to="/societies" className="brutal-btn mt-6 bg-tierS">Browse all societies</Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse space-y-6 px-4 py-12">
        <div className="h-40 border-3 border-ink bg-ink/10" />
        <div className="h-96 border-3 border-ink bg-ink/10" />
      </div>
    );
  }

  const s = data.society;

  return (
    <>
      {/* ── HEADER ─────────────────────────────────────────── */}
      <section className="border-b-3 border-ink bg-paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
              {s.sector}, Gurgaon{s.area ? ` · ${s.area}` : ''}
            </p>
            <h1 className="mt-2 font-display text-4xl uppercase leading-none sm:text-6xl">{s.name}</h1>
            {s.builder && (
              <p className="mt-2 text-sm font-bold uppercase text-gray-600">
                by {s.builder}
                {s.pricePerSqft ? ` · ~₹${s.pricePerSqft.toLocaleString('en-IN')}/sqft` : ''}
                {s.bhkOptions?.length ? ` · ${s.bhkOptions.join(', ')} BHK` : ''}
              </p>
            )}
            {s.description && <p className="mt-3 max-w-xl text-gray-700">{s.description}</p>}

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <span className="border-4 border-ink bg-tierS px-4 py-1 font-display text-4xl shadow-brutal">
                {Number(s.overallRating).toFixed(1)} ★
              </span>
              <TierChip tier={s.tier} size="lg" />
              <div className="text-sm font-bold uppercase leading-tight text-gray-600">
                <p>{Number(s.rankingScore).toFixed(1)} ranking score</p>
                <p>{Number(s.ratingCount).toLocaleString()} ratings</p>
              </div>
              <div className="flex w-full flex-wrap gap-3 sm:w-auto">
                <button onClick={() => setRateOpen(true)} className="brutal-btn flex-1 bg-tierA sm:flex-none">
                  Rate This Society ★
                </button>
                <Link to={`/compare?a=${s.slug}`} className="brutal-btn flex-1 bg-white sm:flex-none">
                  Compare ⇄
                </Link>
              </div>
            </div>

            <AqiWidget />
          </div>

          <div className="h-72 border-3 border-ink shadow-brutal lg:h-full lg:min-h-[280px]">
            <MapView societies={[s]} />
          </div>
        </div>
      </section>

      {/* ── RATING BREAKDOWN ───────────────────────────────── */}
      <section className="border-b-3 border-ink bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="mb-6 font-display text-2xl uppercase sm:text-3xl">The Breakdown</h2>
          <RatingBars categoryScores={s.categoryScores instanceof Map ? Object.fromEntries(s.categoryScores) : s.categoryScores || {}} overall={s.overallRating} ratingCount={s.ratingCount} />
        </div>
      </section>

      {/* ── SIMILAR ────────────────────────────────────────── */}
      {data.similar.length > 0 && (
        <section className="border-b-3 border-ink bg-paper">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <h2 className="mb-5 font-display text-2xl uppercase sm:text-3xl">Nearby & Similar</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.similar.map((sim) => (
                <SocietyCard key={sim.slug} society={sim} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── COMMENTS ───────────────────────────────────────── */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <CommentsSection societySlug={slug} user={user} />
        </div>
      </section>

      {rateOpen && (
        <RatingModal
          society={s}
          onClose={() => setRateOpen(false)}
          onRated={(updated) => {
            setRateOpen(false);
            setData((prev) => ({ ...prev, society: { ...prev.society, ...updated } }));
          }}
        />
      )}

      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Residence',
            name: s.name,
            address: {
              '@type': 'PostalAddress',
              streetAddress: s.address,
              addressLocality: 'Gurgaon',
              addressCountry: 'IN'
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: s.overallRating,
              bestRating: 10,
              ratingCount: Math.max(1, s.ratingCount)
            }
          })
        }}
      />
    </>
  );
}
