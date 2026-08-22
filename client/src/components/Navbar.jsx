import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import SearchBar from './SearchBar.jsx';

const LINKS = [
  { to: '/', label: 'Map', end: true },
  { to: '/explore', label: 'Explore' },
  { to: '/leaderboard', label: 'Rankings' },
  { to: '/find-flats', label: 'FindFlats' },
  { to: '/societies', label: 'Societies' },
  { to: '/compare', label: 'Compare' }
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b-3 border-ink bg-cream">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 transition-all active:translate-x-[3px] active:translate-y-[3px]"
          >
            <img src="/logo.png" alt="GurgaonFlat" className="h-9 w-auto sm:h-11" />
            <span className="font-display text-lg tracking-tight sm:text-xl">
              Gurgaon<span className="text-accent">Flat</span>
            </span>
          </Link>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <SearchBar compact />
          </div>

          <Link
            to="/societies?openRate=1"
            className="brutal-btn ml-auto bg-accent text-white shadow-brutal-accent !px-3 !py-2 text-[11px] sm:ml-0 sm:!px-5 sm:!py-2.5 sm:text-sm"
          >
            Rate Your Society
          </Link>

          <button
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="brutal-btn flex h-10 w-12 shrink-0 !px-0 sm:ml-3"
          >
            <span className="flex w-5 flex-col gap-[5px]">
              <span className="h-[3px] w-full bg-ink" />
              <span className="h-[3px] w-full bg-ink" />
              <span className="h-[3px] w-full bg-ink" />
            </span>
          </button>
        </div>
      </header>

      <div className={`fixed inset-0 z-[60] ${menuOpen ? '' : 'pointer-events-none'}`} aria-hidden={!menuOpen}>
        <div
          onClick={close}
          className={`absolute inset-0 bg-ink/60 transition-opacity duration-200 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-80 max-w-[88vw] flex-col overflow-y-auto border-l-3 border-ink bg-cream p-6 shadow-brutal-lg transition-transform duration-200 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between">
            <Link to="/" onClick={close} className="flex shrink-0 items-center gap-2">
              <img src="/logo.png" alt="GurgaonFlat" className="h-8 w-auto" />
              <span className="font-display text-base tracking-tight">
                Gurgaon<span className="text-accent">Flat</span>
              </span>
            </Link>
            <button
              aria-label="Close menu"
              onClick={close}
              className="brutal-btn h-9 w-9 !px-0 text-lg leading-none"
            >
              ✕
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-3">
            {LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={close}
                className={({ isActive }) =>
                  `block border-3 border-ink px-4 py-3 text-left font-display uppercase tracking-wide transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${
                    isActive ? 'bg-tierS shadow-brutal-sm' : 'bg-white shadow-brutal-sm hover:bg-tierS/40'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-7 border-t-3 border-dashed border-ink pt-6">
            <SearchBar autoFocus={menuOpen} />
          </div>

          <Link
            to="/societies?openRate=1"
            onClick={close}
            className="brutal-btn mt-6 justify-center bg-accent text-white shadow-brutal-accent"
          >
            Rate Your Society
          </Link>
        </aside>
      </div>
    </>
  );
}
