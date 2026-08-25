import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="GurgaonFlat" className="h-9 w-auto" />
            <span className="font-display text-xl font-bold tracking-tight text-ink">GurgaonFlat</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
            Rate your society. See where it ranks in Gurgaon. Real residents, real opinions —
            confidence-adjusted rankings, not broker spin.
          </p>
          <a
            href="mailto:creation2224@gmail.com?subject=GurgaonFlat%20—%20Developer%20Contact"
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Contact the Developer →
          </a>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              { to: '/map', label: 'Map' },
              { to: '/leaderboard', label: 'Rankings' },
              { to: '/societies', label: 'All Societies' },
              { to: '/find-flats', label: 'Find Flats' },
              { to: '/compare', label: 'Compare' }
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-slate-600 transition hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/privacy" className="text-slate-600 transition hover:text-ink">
                Privacy Policy
              </Link>
            </li>
            <li className="text-slate-500">Community-powered rankings</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 px-4 py-5 text-center text-xs text-slate-400">
        © {year} GurgaonFlat ·{' '}
        <a href="https://gurgaonflat.online" className="transition hover:text-slate-600">
          gurgaonflat.online
        </a>{' '}
        · Built for Gurgaon
      </div>
    </footer>
  );
}
