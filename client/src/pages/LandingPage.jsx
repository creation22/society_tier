import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapTrifold,
  Star,
  ArrowUpRight,
  TrendUp,
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
import SkylineDraw from '../components/landing/SkylineDraw.jsx';
import SocietyCard from '../components/SocietyCard.jsx';
import { useSEO } from '../utils/seo.js';
import api from '../utils/api.js';

const STEPS = [
  { n: '01', title: 'Search your society', body: 'Look up any society across Gurgaon by name, sector or area.' },
  { n: '02', title: 'Rate 10 parameters', body: 'Score location, safety, maintenance, amenities and more in under a minute.' },
  { n: '03', title: 'See where it ranks', body: 'Your score feeds a confidence-adjusted tier list updated in real time.' }
];

const AREAS = ['Golf Course Rd', 'Golf Course Ext', 'Dwarka Expressway', 'New Gurgaon', 'Sohna Road', 'MG Road', 'Cyber City'];

// Tier display rows — score ranges mirror server thresholds (tier.js).
const TIER_ROWS = [
  { tier: 'S', color: '#FFD60A', label: 'Elite',       tag: 'ELITE',   desc: 'Best of the best. Residents consistently rave.', lo: '8.8', hi: '10',  fill: '100%' },
  { tier: 'A', color: '#06D6A0', label: 'Great',       tag: 'GREAT',   desc: 'Strong all-rounders most residents would recommend.', lo: '8.0', hi: '8.8', fill: '80%' },
  { tier: 'B', color: '#4361EE', label: 'Good',        tag: 'GOOD',    desc: 'Solid, liveable, with a few rough edges.', lo: '6.8', hi: '8.0', fill: '60%' },
  { tier: 'C', color: '#FF6B35', label: 'Average',     tag: 'AVERAGE', desc: 'Mixed reviews — worth a careful look.', lo: '5.5', hi: '6.8', fill: '40%' },
  { tier: 'D', color: '#EF233C', label: 'Avoid',       tag: 'AVOID',   desc: 'Recurring complaints. Due diligence strongly advised.', lo: '0',   hi: '5.5', fill: '22%' }
];

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
        <CityVideoBackdrop fadeTo="#DDEEF0" />
        {/* Soft radial scrim behind the hero copy so small text stays legible
            over bright sky portions of the video. */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[40rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(0_0_0/0.38),transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md [text-shadow:0_1px_6px_rgb(0_0_0/0.45)]"
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
              className="mt-8 max-w-xl text-lg leading-relaxed text-white [text-shadow:0_1px_12px_rgb(0_0_0/0.55),0_0_24px_rgb(0_0_0/0.35)]"
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
              className="mt-10 flex flex-col items-center gap-4 text-sm text-white sm:flex-row sm:gap-4 [text-shadow:0_1px_10px_rgb(0_0_0/0.55),0_0_20px_rgb(0_0_0/0.35)]"
            >
              <div className="flex -space-x-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur-sm"
                    style={{ zIndex: 10 - i }}
                  >
                    <User weight="fill" className="h-4 w-4 text-white" />
                  </span>
                ))}
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-ink/60 text-[11px] font-bold text-white backdrop-blur-sm">
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
      <div className="border-y border-white/40 bg-white/30 py-4 backdrop-blur-sm">
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
              <div className="relative h-full rounded-3xl border border-white/70 bg-white/80 p-8 shadow-sm backdrop-blur-md">
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
      <section className="relative px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">The tier system</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-[2.75rem]">
              S through D —{' '}
              <span className="font-serif font-normal italic text-ink">calibrated for confidence</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
              Raw averages lie. Each society’s score uses a Bayesian prior so a 9.8 from 5 ratings
              doesn’t beat a 9.3 from 1,500.
            </p>
          </Reveal>

          {/* Tier ladder — editorial, monochrome. Tier colour is a single hairline dot. */}
          <Reveal delay={0.16}>
            <div className="mt-14 overflow-hidden rounded-2xl border border-white/60 bg-white/40 divide-y divide-white/60 backdrop-blur-md">
              {TIER_ROWS.map((t) => (
                <div
                  key={t.tier}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 px-5 py-6 transition-colors hover:bg-white/70 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-10 sm:px-8"
                >
                  <span className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                    {t.tier}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: t.color }} />
                      <p className="font-display text-sm font-semibold text-ink sm:text-base">{t.label}</p>
                    </div>
                    <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-500">{t.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-medium text-slate-400">score</p>
                    <p className="font-display text-sm font-semibold text-ink">
                      {t.lo}<span className="text-slate-300"> → </span>{t.hi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Bayesian proof — quiet two-column comparison, no coloured bars, no emoji. */}
          <Reveal delay={0.1}>
            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/70 bg-slate-200/60 backdrop-blur-md md:grid-cols-2">
              <div className="bg-white/85 p-8 backdrop-blur-md">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">The trap</p>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="font-display text-5xl font-bold tracking-tight text-ink">9.8</span>
                  <span className="text-sm text-slate-500">★ · 5 ratings</span>
                </div>
                <div className="mt-5 h-px w-full bg-slate-200">
                  <div className="h-px bg-ink" style={{ width: '98%' }} />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  A raw average this high from five people is mostly noise — one enthusiastic resident
                  swings it by half a point.
                </p>
              </div>
              <div className="bg-ink/95 p-8 text-white backdrop-blur-md">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">The verdict</p>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="font-display text-5xl font-bold tracking-tight">9.3</span>
                  <span className="text-sm text-white/60">★ · 1,500 ratings</span>
                </div>
                <div className="mt-5 h-px w-full bg-white/15">
                  <div className="h-px bg-white" style={{ width: '93%' }} />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  1,500 residents carry real weight. After the prior is applied, Society B ranks higher —
                  too few voices, too much variance.
                </p>
                <p className="mt-6 border-t border-white/10 pt-4 font-mono text-[11px] text-white/45">
                  score = (n·avg + W·μ) ÷ (n + W)
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

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
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1.1fr_1fr] md:gap-20">
          {/* Copy */}
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur">
              <Sparkle weight="duotone" className="h-3.5 w-3.5" />
              One rating per account per society
            </span>
            <h2 className="mt-6 font-display text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-[2.75rem]">
              Your rating moves the{' '}
              <span className="font-serif font-normal italic text-white">needle</span>.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-300 md:max-w-none">
              The tier list reflects residents, not brokers. Add your voice in under a minute —
              every score feeds a confidence-adjusted ranking that actually respects sample size.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
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

          {/* Self-drawing Gurgaon skyline — pathLength animation on scroll */}
          <div className="relative mx-auto w-full max-w-md md:max-w-none">
            <SkylineDraw className="h-auto w-full text-white/85" />
            <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 md:text-left">
              Gurgaon · sector by sector
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
