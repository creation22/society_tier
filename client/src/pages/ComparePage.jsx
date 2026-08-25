import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, ArrowsLeftRight, Trophy, MagnifyingGlass, ArrowRight } from '@phosphor-icons/react';
import SocietyCard, { TierChip } from '../components/SocietyCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import Section from '../components/ui/Section.jsx';
import { cn } from '../utils/cn.js';
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

  if (!societies) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-96 rounded-2xl border border-slate-200 bg-slate-100/70 animate-pulse" />
      </div>
    );
  }

  if (societies.length < 2 || societies.includes(null)) {
    return (
      <>
        <PageHeader
          crumbs={[{ label: 'Home', to: '/' }, { label: 'Compare' }]}
          eyebrow="Side by side"
          title="Pick two to"
          accent="compare"
          intro="Line up any two or three societies and settle the debate — parameter by parameter, score by score."
        />
        <section className="mx-auto max-w-4xl px-4 pb-20">
          <div className="grid gap-6 lg:grid-cols-2">
            {[0, 1].map((slot) => {
              const chosen = societies[slot] && societies[slot] !== null ? societies[slot] : null;
              return (
                <Reveal key={slot} delay={slot * 0.06}>
                  <div className="flex h-full flex-col rounded-2xl border border-dashed border-slate-300 bg-white p-5 shadow-sm">
                    {chosen ? (
                      <div className="flex h-full flex-col gap-4">
                        <SocietyCard society={chosen} />
                        <button
                          onClick={() => setPickerFor(slot)}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-ink"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col">
                        <div className="mb-4 flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                            {slot + 1}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Slot {slot + 1}
                          </span>
                        </div>
                        <SearchBar />
                        <QuickPicks onPick={(slug) => addSlug(slug)} exclude={slugs} />
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      </>
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
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Compare' }]}
        eyebrow="The faceoff"
        title="The"
        accent="faceoff"
        intro="Same parameters, different addresses. Best score in each row is highlighted."
      />

      {/* Society summary cards */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {societies.map((s) => (
            <Reveal key={s.slug}>
              <SocietyCard society={s} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <Section
        className="pt-10"
        eyebrow="Parameter breakdown"
        title="Where they differ"
        intro="Overall plus ten resident-rated dimensions. The top score per row wins."
      >
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Parameter
                    </th>
                    {societies.map((s) => (
                      <th key={s.slug} className="px-4 py-3 text-right">
                        <Link
                          to={`/society/${s.slug}`}
                          className="inline-flex flex-col items-end gap-1 text-ink transition-colors hover:text-slate-600"
                        >
                          <span className="font-display text-sm font-bold tracking-tight">
                            {s.name.split(' ').slice(-2).join(' ')}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                            {s.sector}
                            <TierChip tier={s.tier} size="sm" />
                          </span>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => {
                    const scores = societies.map((s) => scoreOf(s, row.key));
                    const best = Math.max(...scores);
                    const tie = scores.filter((x) => x === best).length >= societies.length;
                    return (
                      <tr key={row.key} className={cn('border-b border-slate-100', ri % 2 ? 'bg-slate-50/40' : '')}>
                        <td className="px-4 py-3 text-sm font-semibold text-ink">{row.label}</td>
                        {scores.map((v, i) => {
                          const isBest = v === best && !tie && v != null;
                          return (
                            <td
                              key={i}
                              className={cn(
                                'px-4 py-3 text-right font-display text-base transition-colors',
                                isBest
                                  ? 'bg-slate-900 font-bold text-white'
                                  : 'text-slate-700'
                              )}
                            >
                              <span className="inline-flex items-center justify-end gap-1.5">
                                {isBest && <Trophy weight="fill" className="h-3.5 w-3.5 text-amber-400" />}
                                {v != null ? Number(v).toFixed(1) : '–'}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 flex justify-center">
            <Link
              to="/societies"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:text-ink hover:shadow-md"
            >
              <ArrowsLeftRight weight="duotone" className="h-4 w-4" />
              Compare more societies
              <ArrowRight weight="bold" className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

function QuickPicks({ onPick, exclude }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get('/leaderboard/overall').then((res) => setItems(res.data.items.slice(0, 8))).catch(() => {});
  }, []);
  return (
    <div className="mt-5">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <MagnifyingGlass weight="bold" className="h-3.5 w-3.5" />
        Quick picks
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items
          .filter((i) => !exclude.includes(i.slug))
          .map((i) => (
            <button
              key={i.slug}
              onClick={() => onPick(i.slug)}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-ink"
            >
              <Plus weight="bold" className="h-3 w-3" />
              {i.name}
            </button>
          ))}
      </div>
    </div>
  );
}
