import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, ChatCircleText, ThumbsUp, ArrowRight } from '@phosphor-icons/react';
import { TierChip } from '../components/SocietyCard.jsx';
import api from '../utils/api.js';
import { useSEO } from '../utils/seo.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

const STATS = [
  { key: 'societiesRated', label: 'Societies Rated', icon: Star },
  { key: 'reviews', label: 'Reviews', icon: ChatCircleText },
  { key: 'helpfulVotes', label: 'Helpful Votes', icon: ThumbsUp }
];

export default function ProfilePage() {
  const { username } = useParams();
  const [data, setData] = useState(null);

  useSEO({ title: `@${username} — GurgaonFlat Profile`, path: `/u/${username}` });

  useEffect(() => {
    setData(null);
    api.get(`/auth/${username}`).then((res) => setData(res.data)).catch(() => setData({ error: true }));
  }, [username]);

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="h-64 rounded-2xl border border-slate-200 bg-slate-100/70 animate-pulse" />
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-2xl border border-slate-200 bg-slate-100/70 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          title="User not found"
          description="This profile doesn't exist or has been removed."
          icon={ArrowRight}
          action={<Link to="/" className="text-sm font-semibold text-ink underline underline-offset-4">Back to home</Link>}
        />
      </div>
    );
  }

  const memberSince = new Date(data.user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

  return (
    <>
      <PageHeader
        eyebrow="Member"
        title={`@${data.user.username}`}
        accent="Profile"
        intro={`Member since ${memberSince}. Here are the societies this resident has rated and reviewed.`}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Profile' }]}
      />

      {/* Avatar band */}
      <section className="border-y border-slate-200 bg-cream">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Reveal>
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white font-display text-3xl font-bold text-ink shadow-sm">
                {data.user.username[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Account</p>
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink">@{data.user.username}</h2>
                <p className="mt-1 text-sm text-slate-500">Member since {memberSince}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-4 pb-12">
          <div className="grid grid-cols-3 gap-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Reveal key={stat.key} delay={i * 0.06}>
                  <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                    <Icon weight="duotone" className="h-5 w-5 text-slate-400" />
                    <p className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">{data.stats[stat.key]}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent ratings */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-4 pb-20">
          <Reveal>
            <h3 className="mb-5 font-display text-2xl font-bold tracking-tight text-ink">Recent Ratings</h3>
          </Reveal>

          {data.recentRatings.length === 0 ? (
            <EmptyState
              title="No ratings yet"
              description="When this member rates a society, it will show up here."
              icon={Star}
            />
          ) : (
            <div className="space-y-2">
              {data.recentRatings.map((r, i) =>
                r.society ? (
                  <Reveal key={i} delay={Math.min(i * 0.03, 0.3)}>
                    <Link
                      to={`/society/${r.society.slug}`}
                      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                    >
                      <span className="min-w-0 flex-1 truncate font-display text-sm font-semibold text-ink">{r.society.name}</span>
                      <span className="font-display text-lg font-bold text-ink">{Number(r.overall).toFixed(1)}</span>
                      <TierChip tier={r.society.tier} size="sm" />
                    </Link>
                  </Reveal>
                ) : null
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
