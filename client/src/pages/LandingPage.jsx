import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapTrifold,
  Star,
  ArrowUpRight,
  TrendUp,
  Users,
  User,
  Sparkle
} from '@phosphor-icons/react';
import PressButton from '../components/ui/PressButton.jsx';
import Section from '../components/ui/Section.jsx';
import StatCounter from '../components/ui/StatCounter.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import TextReveal from '../components/ui/TextReveal.jsx';
import DrawLine from '../components/ui/DrawLine.jsx';
import Magnetic from '../components/ui/Magnetic.jsx';
import Marquee from '../components/ui/Marquee.jsx';
import Backdrop from '../components/ui/Backdrop.jsx';
import CityVideoBackdrop from '../components/ui/CityVideoBackdrop.jsx';
import FeaturesShowcase from '../components/landing/FeaturesShowcase.jsx';
import SocietyCard from '../components/SocietyCard.jsx';
import { TIER_META } from '../utils/tier.js';
import { useSEO } from '../utils/seo.js';
import api from '../utils/api.js';

const STEPS = [
  { n: '01', title: 'Search your society', body: 'Look up any society across Gurgaon by name, sector or area.' },
  { n: '02', title: 'Rate 10 parameters', body: 'Score location, safety, maintenance, amenities and more in under a minute.' },
  { n: '03', title: 'See where it ranks', body: 'Your score feeds a confidence-adjusted tier list updated in real time.' }
];

const AREAS = ['Golf Course Rd', 'Golf Course Ext', 'Dwarka Expressway', 'New Gurgaon', 'Sohna Road', 'MG Road', 'Cyber City'];

export default function LandingPage() {
  useSEO({
    title: 'GurgaonFlat — Rate Your Society. See Where It Ranks in Gurgaon.',
    description:
      'Gurgaon community-powered society tier list. Rate your society, read real resident opinions and see who makes S Tier.',
    path: '/'
  });

  const [top, setTop] = useState([]);
  useEffect(() => {
    let alive = true;
    api
      .get('/societies', { params: { sort: 'rating', limit: 4 } })
      .then(({ data }) => alive && setTop(Array.isArray(data) ? data : data?.societies || []))
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ───────── Hero ───────── */}
      <section className="relative isolate flex min-h-[88vh] flex-col justify-center overflow-hidden bg-ink py-32 sm:py-44">
        <CityVideoBackdrop fadeTo="#fafaf9" />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md"
            >
              <Sparkle weight="duotone" className="h-3.5 w-3.5" />
              Community-powered · No broker BS
            </motion.span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.04] tracking-tight text-white [text-shadow:0_2px_12px_rgb(0_0_0/0.45)] sm:text-6xl sm:leading-[1.02]">
              <TextReveal as="span" text="Rate your society." delay={0.05} />
              <br />
              <span className="inline-flex flex-wrap items-baseline justify-center gap-x-3">
                <TextReveal as="span" text="See where it" delay={0.25} />
                <span className="relative inline-block">
                  <em className="font-serif font-normal italic text-white">ranks</em>
                  <DrawLine
                    className="absolute -bottom-2 left-0 w-full text-white/70"
                    d="M2 8 Q 50 2 100 7 T 198 6"
                    width={200}
                    height={12}
                    duration={1.2}
                    delay={0.9}
                  />
                </span>
                <TextReveal as="span" text="." delay={0.45} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 max-w-xl text-lg leading-relaxed text-white/85 [text-shadow:0_1px_8px_rgb(0_0_0/0.4)]"
            >
              A tier list for Gurgaon’s residential societies — built on real resident ratings, threaded
              discussions and a confidence-adjusted ranking algorithm. Find the best, avoid the rest.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Magnetic>
                <PressButton to="/map" variant="secondary" size="lg">
                  <MapTrifold weight="duotone" className="h-5 w-5" />
                  Explore the map
                </PressButton>
              </Magnetic>
              <Magnetic>
                <PressButton to="/societies?openRate=1" variant="glass" size="lg">
                  <Star weight="duotone" className="h-5 w-5" />
                  Rate your society
                </PressButton>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.95 }}
              className="mt-10 flex flex-col items-center gap-4 text-sm text-white/80 sm:flex-row sm:gap-4"
            >
              <div className="flex -space-x-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm"
                    style={{ zIndex: 10 - i }}
                  >
                    <User weight="fill" className="h-4 w-4 text-white/80" />
                  </span>
                ))}
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-ink/50 text-[11px] font-bold text-white backdrop-blur-sm">
                  +2K
                </span>
              </div>
              <span className="text-center sm:text-left">
                Join <span className="font-semibold text-white">thousands</span> of residents rating Gurgaon
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────── Marquee strip ───────── */}
      <div className="border-y border-slate-200 bg-white py-4">
        <Marquee speed={32}>
          {AREAS.map((a) => (
            <span key={a} className="flex items-center gap-8 font-display text-sm font-semibold uppercase tracking-wide text-slate-400">
              {a} <span className="text-slate-300">/</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* ───────── Stats ───────── */}
      <Section className="py-14" innerClassName="">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <Reveal delay={0}><StatCounter to={1200} suffix="+" label="Societies rated" /></Reveal>
          <Reveal delay={0.08}><StatCounter to={4800} suffix="+" label="Resident ratings" accent="bg-slate-700" /></Reveal>
          <Reveal delay={0.16}><StatCounter to={5} label="Major corridors" accent="bg-slate-500" /></Reveal>
          <Reveal delay={0.24}><StatCounter to={8.6} decimals={1} label="Avg top-tier score" accent="bg-amber-500" /></Reveal>
        </div>
      </Section>

      {/* ───────── Features ───────── */}
      <FeaturesShowcase />

      {/* ───────── How it works ───────── */}
      <Section eyebrow="How it works" title="From search to verdict in three steps">
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="relative h-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <span className="font-display text-4xl font-bold text-slate-200">{s.n}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.body}</p>
                {i < STEPS.length - 1 && (
                  <ArrowUpRight weight="bold" className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-slate-300 md:block" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ───────── Tier system ───────── */}
      <Section
        eyebrow="The tier system"
        title="S through D — calibrated for confidence"
        intro="Raw averages lie. Each society’s score uses a Bayesian prior so a 9.8 from 5 ratings doesn’t beat a 9.3 from 1,500."
      >
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(TIER_META).map(([tier, meta], i) => (
            <Reveal key={tier} delay={i * 0.06}>
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 px-5 py-4" style={{ background: `${meta.color}14` }}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: meta.color }}>
                    {tier}
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold text-ink">{meta.label}</p>
                    <p className="text-xs font-medium text-slate-500">{meta.text}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ───────── Top societies (live) ───────── */}
      {top.length > 0 && (
        <Section
          eyebrow="Top rated"
          title="What residents love right now"
          intro="Pulled live from the ranking engine — confidence-adjusted, not raw averages."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {top.map((s, i) => (
              <Reveal key={s.slug || s._id || i} delay={i * 0.06}>
                <SocietyCard society={s} rank={i + 1} />
              </Reveal>
            ))}
          </div>
          <div className="mt-8">
            <Magnetic>
              <PressButton to="/leaderboard" variant="secondary">
                <TrendUp weight="duotone" className="h-5 w-5" />
                View full leaderboard
              </PressButton>
            </Magnetic>
          </div>
        </Section>
      )}

      {/* ───────── Final CTA ───────── */}
      <section className="relative isolate overflow-hidden bg-ink px-4 py-24 sm:py-32">
        <Backdrop dark grid noise={false} />
        <div className="relative mx-auto max-w-2xl text-center">
          <Users weight="duotone" className="mx-auto h-9 w-9 text-slate-300" />
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your rating moves the <em className="font-serif font-normal italic">needle</em>.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            One rating per account per society — so the tier list reflects residents, not brokers.
            Add your voice in under a minute.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Magnetic>
              <PressButton to="/societies?openRate=1" variant="primary" size="lg">
                <Star weight="duotone" className="h-5 w-5" />
                Rate your society
              </PressButton>
            </Magnetic>
            <PressButton to="/map" variant="glass" size="lg">
              <MapTrifold weight="duotone" className="h-5 w-5" />
              Explore the map
            </PressButton>
          </div>
        </div>
      </section>
    </div>
  );
}
