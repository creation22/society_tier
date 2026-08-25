import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Warning, Buildings, Users, ChatCircleDots, Star, ShieldStar, ArrowLeft, Check, X, PencilSimple
} from '@phosphor-icons/react';
import api from '../utils/api.js';
import { useAuth } from '../hooks/useAuth.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { cn } from '../utils/cn.js';

const TABS = ['Reports', 'Societies', 'Users', 'Comments', 'Ratings'];

const TAB_ICONS = {
  Reports: Warning,
  Societies: Buildings,
  Users: Users,
  Comments: ChatCircleDots,
  Ratings: Star
};

export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('Reports');
  const [stats, setStats] = useState(null);
  const [data, setData] = useState(null);
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    api.get('/admin/stats').then((r) => setStats(r.data)).catch(() => {});
    api.get('/admin/vote-anomalies').then((r) => setAnomalies(r.data.items)).catch(() => {});
  }, []);

  useEffect(() => {
    setData(null);
    const endpoints = {
      Reports: '/admin/reports',
      Societies: '/admin/societies',
      Users: '/admin/users',
      Comments: '/admin/comments',
      Ratings: '/admin/ratings'
    };
    api.get(endpoints[tab]).then((r) => setData(r.data.items)).catch(() => setData([]));
  }, [tab]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          title="Admin only"
          description="This area is restricted to moderators."
          icon={ShieldStar}
          action={<Link to="/" className="text-sm font-semibold text-ink underline underline-offset-4">Back to home</Link>}
        />
      </div>
    );
  }

  async function resolveReport(id, action) {
    await api.post(`/admin/reports/${id}/resolve`, { action });
    setTab('Reports');
  }
  async function ban(id) {
    await api.post(`/admin/users/${id}/ban`, {});
    setTab('Users');
  }

  const tableHead = {
    Reports: ['Report', 'Reporter', 'Actions'],
    Societies: ['Society', 'Sector', 'Rating', 'Count'],
    Users: ['User', 'Email', 'Role', 'Actions'],
    Comments: ['Comment', 'Author', 'Score'],
    Ratings: ['Society', 'User', 'Score']
  };

  return (
    <>
      <PageHeader
        eyebrow="Moderation"
        title="Admin"
        accent="Dashboard"
        intro="Review reports, manage societies, users, comments, and ratings in one place."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Admin' }]}
      />

      <div className="mx-auto max-w-7xl px-4 pb-20">
        {/* Stat tiles */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {Object.entries(stats).map(([k, v], i) => (
              <Reveal key={k} delay={i * 0.04}>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                  <p className="font-display text-3xl font-bold tracking-tight text-ink">{v}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{k}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* Anomaly alert */}
        {anomalies.length > 0 && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            <Warning weight="duotone" className="mt-0.5 h-5 w-5 shrink-0" />
            <span>
              Suspicious voting activity detected ({anomalies.length} account(s) with {'>'}40 votes/hr)
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {TABS.map((t) => {
            const Icon = TAB_ICONS[t];
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                )}
              >
                <Icon weight={active ? 'fill' : 'duotone'} className="h-4 w-4" />
                {t}
              </button>
            );
          })}
        </div>

        {/* Body */}
        {!data ? (
          <div className="mt-6 h-64 rounded-2xl border border-slate-200 bg-slate-100/70 animate-pulse" />
        ) : data.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="Nothing here" description={`No ${tab.toLowerCase()} to review right now.`} icon={Check} />
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {tableHead[tab].map((h) => (
                      <th key={h} className="px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700">
                  {tab === 'Reports' &&
                    data.map((r) => (
                      <tr key={r._id} className="border-t border-slate-100">
                        <td className="px-4 py-3 text-slate-600">{r.commentId?.body?.slice(0, 80)}…</td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-500">@{r.reporterId?.username}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => resolveReport(r._id, 'delete-comment')}
                              className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                            >
                              <X weight="bold" className="h-3 w-3" /> Remove
                            </button>
                            <button
                              onClick={() => resolveReport(r._id, 'dismiss')}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                            >
                              <Check weight="bold" className="h-3 w-3" /> Dismiss
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {tab === 'Societies' &&
                    data.map((s) => (
                      <tr key={s._id} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-semibold text-ink">
                          <Link to={`/society/${s.slug}`} className="underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-ink">{s.name}</Link>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{s.sector}</td>
                        <td className="px-4 py-3 text-slate-600">{s.tier} · {Number(s.overallRating).toFixed(1)}</td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-500">{s.ratingCount} ratings</td>
                      </tr>
                    ))}
                  {tab === 'Users' &&
                    data.map((u) => (
                      <tr key={u._id} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-semibold text-ink">@{u.username}</td>
                        <td className="px-4 py-3 text-slate-600">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{u.role}{u.isBanned ? ' · BANNED' : ''}</span>
                        </td>
                        <td className="px-4 py-3">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => ban(u._id)}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700"
                            >
                              <PencilSimple weight="bold" className="h-3 w-3" /> {u.isBanned ? 'Unban' : 'Ban'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  {tab === 'Comments' &&
                    data.map((c) => (
                      <tr key={c._id} className="border-t border-slate-100">
                        <td className="px-4 py-3 text-slate-600">{c.body.slice(0, 90)}</td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-500">@{c.userId?.username}</td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-500">{c.upvotes - c.downvotes} pts</td>
                      </tr>
                    ))}
                  {tab === 'Ratings' &&
                    data.map((r) => (
                      <tr key={r._id} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-semibold text-ink">{r.societyId?.name}</td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-500">@{r.userId?.username}</td>
                        <td className="px-4 py-3 font-display font-bold text-ink">{Number(r.overall).toFixed(1)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-ink">
            <ArrowLeft weight="bold" className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </div>
    </>
  );
}
