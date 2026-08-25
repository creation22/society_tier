import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Star, ArrowsLeftRight, MapPin, Buildings, Tag } from '@phosphor-icons/react';
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
import Backdrop from '../components/ui/Backdrop.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import SectionDivider from '../components/ui/SectionDivider.jsx';

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
    title: data ? `${data.society.name} — ${Number(data.society.overallRating).toFixed(1)} ★ · ${data.society.tier} Tier | GurgaonFlat` : 'Society — GurgaonFlat',
    description: data
      ? `${data.society.name} in ${data.society.sector}, Gurgaon is rated ${Number(data.society.overallRating).toFixed(1)}/10 by ${data.society.ratingCount} residents. ${data.society.tier} Tier. Read resident reviews and rate it yourself.`
      : undefined,
    path: `/society/${slug}`
  });

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <EmptyState
          title="Society not found"
          description="We couldn't find a society at this address."
          icon={Buildings}
          action={<Link to="/societies" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4">Browse all societies</Link>}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-12">
        <div className="h-40 rounded-2xl border border-slate-200 bg-slate-100/70 animate-pulse" />
        <div className="h-96 rounded-2xl border border-slate-200 bg-slate-100/70 animate-pulse" />
      </div>
    );
  }

  const s = data.society;

  return (
    <>
      {/* ── HEADER BAND ────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-white">
        <Backdrop orbs />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1fr_420px]">
          <div>
            <Reveal>
              <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-400">
                <Link to="/societies" className="inline-flex items-center gap-1 transition-colors hover:text-ink">
                  <ArrowsLeftRight weight="bold" className="h-3 w-3" /> Societies
                </Link>
                <span className="text-slate-300">/</span>
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <MapPin weight="fill" className="h-3 w-3" />
                  {s.sector}, Gurgaon{s.area ? ` · ${s.area}` : ''}
                </span>
              </nav>
            </Reveal>

            <Reveal delay={0.05}>
              <p className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                <Tag weight="bold" className="h-3.5 w-3.5" /> Gurgaon Society
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl">
                {s.name}
              </h1>
            </Reveal>

            {s.builder && (
              <Reveal delay={0.14}>
                <p className="mt-3 inline-flex flex-wrap items-center gap-x-2 text-sm font-medium text-slate-500">
                  <Buildings weight="duotone" className="h-4 w-4" />
                  by {s.builder}
                  {s.pricePerSqft ? <span className="text-slate-300">·</span> : null}
                  {s.pricePerSqft ? <span>~₹{s.pricePerSqft.toLocaleString('en-IN')}/sqft</span> : null}
                  {s.bhkOptions?.length ? <span className="text-slate-300">·</span> : null}
                  {s.bhkOptions?.length ? <span>{s.bhkOptions.join(', ')} BHK</span> : null}
                </p>
              </Reveal>
            )}

            {s.description && (
              <Reveal delay={0.18}>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-600">{s.description}</p>
              </Reveal>
            )}

            {/* Score + tier */}
            <Reveal delay={0.22}>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-baseline gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                  <Star weight="fill" className="h-6 w-6 self-center text-amber-400" />
                  <span className="font-display text-4xl font-bold tracking-tight text-ink">{Number(s.overallRating).toFixed(1)}</span>
                  <span className="text-sm font-medium text-slate-400">/10</span>
                </span>
                <TierChip tier={s.tier} size="lg" />
                <div className="text-sm font-medium leading-tight text-slate-500">
                  <p>{Number(s.rankingScore).toFixed(1)} ranking score</p>
                  <p>{Number(s.ratingCount).toLocaleString()} ratings</p>
                </div>
              </div>
            </Reveal>

            {/* Actions */}
            <Reveal delay={0.26}>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setRateOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-black hover:shadow-md"
                >
                  <Star weight="fill" className="h-4 w-4" /> Rate This Society
                </button>
                <Link
                  to={`/compare?a=${s.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  <ArrowsLeftRight weight="duotone" className="h-4 w-4" /> Compare
                </Link>
              </div>
            </Reveal>

            <div className="mt-6">
              <AqiWidget />
            </div>
          </div>

          {/* Map */}
          <Reveal delay={0.2} className="lg:h-full">
            <div className="h-72 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:h-full lg:min-h-[320px]">
              <MapView societies={[s]} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── RATING BREAKDOWN ───────────────────────────────── */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <Reveal>
            <header className="mb-8 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">Breakdown</span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                The <em className="font-serif font-normal italic">breakdown</em>
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-slate-500">How residents score this society across every category.</p>
            </header>
          </Reveal>
          <Reveal delay={0.08}>
            <RatingBars categoryScores={s.categoryScores instanceof Map ? Object.fromEntries(s.categoryScores) : s.categoryScores || {}} overall={s.overallRating} ratingCount={s.ratingCount} />
          </Reveal>
        </div>
      </section>

      {/* ── SIMILAR ────────────────────────────────────────── */}
      {data.similar.length > 0 && (
        <section className="bg-white">
          <SectionDivider />
          <div className="mx-auto max-w-7xl px-4 pb-20">
            <Reveal>
              <header className="mb-8 max-w-3xl">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">Around here</span>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  Nearby & <em className="font-serif font-normal italic">similar</em>
                </h2>
              </header>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.similar.map((sim, i) => (
                <Reveal key={sim.slug} delay={Math.min(i * 0.05, 0.3)}>
                  <SocietyCard society={sim} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── COMMENTS ───────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-cream">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <Reveal>
            <header className="mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">Community</span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Resident <em className="font-serif font-normal italic">reviews</em>
              </h2>
            </header>
          </Reveal>
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
          }).replace(/</g, '\\u003c')
        }}
      />
    </>
  );
}
