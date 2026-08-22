import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TierChip } from '../components/SocietyCard.jsx';
import api from '../utils/api.js';
import { useSEO } from '../utils/seo.js';

export default function ProfilePage() {
  const { username } = useParams();
  const [data, setData] = useState(null);

  useSEO({ title: `@${username} — GurgaonTier Profile`, path: `/u/${username}` });

  useEffect(() => {
    setData(null);
    api.get(`/auth/${username}`).then((res) => setData(res.data)).catch(() => setData({ error: true }));
  }, [username]);

  if (!data) return <div className="mx-auto max-w-4xl animate-pulse px-4 py-10"><div className="h-64 border-3 border-ink bg-ink/10" /></div>;
  if (data.error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl uppercase">User not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center gap-4 border-b-3 border-ink pb-6">
        <div className="flex h-20 w-20 items-center justify-center border-3 border-ink bg-tierS font-display text-3xl shadow-brutal">
          {data.user.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-3xl uppercase sm:text-5xl">@{data.user.username}</h1>
          <p className="text-xs font-bold uppercase text-gray-600">
            Member since {new Date(data.user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          ['Societies Rated', data.stats.societiesRated],
          ['Reviews', data.stats.reviews],
          ['Helpful Votes', data.stats.helpfulVotes]
        ].map(([label, value]) => (
          <div key={label} className="border-3 border-ink bg-paper p-4 text-center shadow-brutal-sm">
            <p className="font-display text-3xl">{value}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-600">{label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-10 font-display text-2xl uppercase">Recent Ratings</h2>
      {data.recentRatings.length === 0 ? (
        <p className="border-3 border-dashed border-ink p-8 text-center font-bold uppercase text-gray-600">No ratings yet.</p>
      ) : (
        <div className="space-y-2">
          {data.recentRatings.map((r, i) =>
            r.society ? (
              <Link
                key={i}
                to={`/society/${r.society.slug}`}
                className="flex items-center gap-3 border-3 border-ink bg-paper px-4 py-3 shadow-brutal-sm hover:-translate-y-0.5"
              >
                <span className="min-w-0 flex-1 truncate font-display uppercase">{r.society.name}</span>
                <span className="font-display text-xl">{Number(r.overall).toFixed(1)}</span>
                <TierChip tier={r.society.tier} />
              </Link>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
