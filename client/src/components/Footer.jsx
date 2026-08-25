import { Link } from 'react-router-dom';

const NAV = {
  Explore: [
    { to: '/map', label: 'Interactive Map' },
    { to: '/leaderboard', label: 'Tier Rankings' },
    { to: '/societies', label: 'All Societies' },
    { to: '/find-flats', label: 'Find Flats' },
    { to: '/compare', label: 'Compare' }
  ],
  Community: [
    { to: '/societies?openRate=1', label: 'Rate your society' },
    { to: '/leaderboard', label: 'How ranking works' },
    { to: '/privacy', label: 'Privacy Policy' }
  ]
};

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-white/40 bg-white/30 backdrop-blur-md">
      {/* Warm horizon glow tying the footer to the sky backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-24 h-48 opacity-70"
        style={{ background: 'radial-gradient(60% 100% at 50% 100%, rgba(253,224,138,0.55), transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-10">
        {/* Top: wordmark + tagline */}
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src="/logo.png" alt="GurgaonFlat" className="h-10 w-auto" />
              <span className="font-display text-xl font-bold tracking-tight text-ink">
                Gurgaon<span className="font-serif font-normal italic text-ink/80">Flat</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm font-serif text-lg italic leading-snug text-slate-700">
              Rate your society. See where it ranks in Gurgaon.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
              Real residents, real opinions — confidence-adjusted rankings, not broker spin.
              One rating per account per society.
            </p>
            <a
              href="mailto:creation2224@gmail.com?subject=GurgaonFlat%20—%20Developer%20Contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-ink shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
            >
              Contact the developer
              <span aria-hidden="true">→</span>
            </a>
          </div>

          {Object.entries(NAV).map(([heading, links]) => (
            <nav key={heading} aria-label={heading}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{heading}</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-slate-700 transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Divider */}
        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-slate-400/40 to-transparent" />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-600 sm:flex-row">
          <p>© {year} GurgaonFlat · Built for Gurgaon</p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Community-powered · No broker BS</span>
          </div>
          <a
            href="https://gurgaonflat.online"
            className="font-medium text-slate-700 transition hover:text-ink"
          >
            gurgaonflat.online
          </a>
        </div>
      </div>
    </footer>
  );
}
