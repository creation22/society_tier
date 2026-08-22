import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';
import { useAuth } from '../hooks/useAuth.jsx';

const TABS = ['Reports', 'Societies', 'Users', 'Comments', 'Ratings'];

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
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl uppercase">Admin only</h1>
        <p className="mt-2 font-bold uppercase text-gray-600">This area is restricted to moderators.</p>
        <Link to="/" className="brutal-btn mt-6 bg-tierS">Back to Home</Link>
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-4xl uppercase sm:text-5xl">Admin Dashboard</h1>

      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} className="border-3 border-ink bg-paper p-3 text-center shadow-brutal-sm">
              <p className="font-display text-2xl">{v}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{k}</p>
            </div>
          ))}
        </div>
      )}

      {anomalies.length > 0 && (
        <p className="mt-4 border-3 border-ink bg-tierD p-3 font-bold uppercase text-white">
          ⚠ Suspicious voting activity detected ({anomalies.length} account(s) with >40 votes/hr)
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-3 border-ink px-3 py-1.5 text-xs font-bold uppercase shadow-brutal-sm ${tab === t ? 'bg-tierS' : 'bg-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {!data ? (
        <div className="mt-6 h-64 animate-pulse border-3 border-ink bg-ink/10" />
      ) : (
        <div className="mt-6 overflow-x-auto border-3 border-ink bg-paper shadow-brutal">
          <table className="w-full min-w-[640px] text-left text-sm">
            <tbody>
              {tab === 'Reports' &&
                data.map((r) => (
                  <tr key={r._id} className="border-b-2 border-ink/20">
                    <td className="px-3 py-2">{r.commentId?.body?.slice(0, 80)}…</td>
                    <td className="px-3 py-2 text-xs uppercase text-gray-600">@{r.reporterId?.username}</td>
                    <td className="px-3 py-2">
                      <button onClick={() => resolveReport(r._id, 'delete-comment')} className="border-2 border-ink px-2 py-0.5 font-bold uppercase hover:bg-tierD hover:text-white">Remove</button>{' '}
                      <button onClick={() => resolveReport(r._id, 'dismiss')} className="border-2 border-ink px-2 py-0.5 font-bold uppercase hover:bg-tierS">Dismiss</button>
                    </td>
                  </tr>
                ))}
              {tab === 'Societies' &&
                data.map((s) => (
                  <tr key={s._id} className="border-b-2 border-ink/20">
                    <td className="px-3 py-2 font-bold"><Link to={`/society/${s.slug}`} className="underline">{s.name}</Link></td>
                    <td className="px-3 py-2">{s.sector}</td>
                    <td className="px-3 py-2">{s.tier} · {Number(s.overallRating).toFixed(1)}</td>
                    <td className="px-3 py-2 text-xs uppercase">{s.ratingCount} ratings</td>
                  </tr>
                ))}
              {tab === 'Users' &&
                data.map((u) => (
                  <tr key={u._id} className="border-b-2 border-ink/20">
                    <td className="px-3 py-2 font-bold">@{u.username}</td>
                    <td className="px-3 py-2 text-gray-600">{u.email}</td>
                    <td className="px-3 py-2 uppercase">{u.role}{u.isBanned ? ' · BANNED' : ''}</td>
                    <td className="px-3 py-2">
                      {u.role !== 'admin' && (
                        <button onClick={() => ban(u._id)} className="border-2 border-ink px-2 py-0.5 font-bold uppercase hover:bg-tierD hover:text-white">
                          {u.isBanned ? 'Unban' : 'Ban'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              {tab === 'Comments' &&
                data.map((c) => (
                  <tr key={c._id} className="border-b-2 border-ink/20">
                    <td className="px-3 py-2">{c.body.slice(0, 90)}</td>
                    <td className="px-3 py-2 text-xs uppercase">@{c.userId?.username}</td>
                    <td className="px-3 py-2 text-xs">{c.upvotes - c.downvotes} pts</td>
                  </tr>
                ))}
              {tab === 'Ratings' &&
                data.map((r) => (
                  <tr key={r._id} className="border-b-2 border-ink/20">
                    <td className="px-3 py-2 font-bold">{r.societyId?.name}</td>
                    <td className="px-3 py-2 text-xs uppercase">@{r.userId?.username}</td>
                    <td className="px-3 py-2 font-display">{Number(r.overall).toFixed(1)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {data.length === 0 && <p className="p-8 text-center font-bold uppercase text-gray-500">Nothing here.</p>}
        </div>
      )}
    </div>
  );
}
