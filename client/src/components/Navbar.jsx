import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { List, X, Star } from '@phosphor-icons/react';
import SearchBar from './SearchBar.jsx';
import Magnetic from './ui/Magnetic.jsx';
import PressButton from './ui/PressButton.jsx';
import { cn } from '../utils/cn.js';

const LINKS = [
  { to: '/map', label: 'Map' },
  { to: '/explore', label: 'Explore' },
  { to: '/leaderboard', label: 'Rankings' },
  { to: '/find-flats', label: 'Find Flats' },
  { to: '/societies', label: 'Societies' },
  { to: '/compare', label: 'Compare' }
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const isLanding = pathname === '/';
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl transition-shadow duration-300',
          scrolled && 'shadow-[0_1px_0_0_rgb(15_23_42/0.04),0_8px_24px_-12px_rgb(15_23_42/0.18)]'
        )}
      >
        {/* Subtle top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-900/10 to-transparent" />
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <Link to="/" className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80">
            <img src="/logo.png" alt="GurgaonFlat" className="h-8 w-auto sm:h-9" />
            <span className="font-display text-lg font-bold tracking-tight text-ink sm:text-xl">
              Gurgaon<span className="font-serif font-normal italic text-ink/80">Flat</span>
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-5 lg:flex">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'relative py-2 text-sm font-medium transition-colors',
                    'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:bg-ink after:transition-transform after:duration-300',
                    isActive
                      ? 'text-ink after:scale-x-100'
                      : 'text-slate-500 hover:text-ink after:scale-x-0 hover:after:scale-x-100'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {!isLanding && (
            <div className="ml-auto hidden items-center lg:flex">
              <SearchBar compact />
            </div>
          )}

          <Magnetic className={cn('ml-auto', !isLanding && 'lg:ml-0')}>
            <PressButton to="/societies?openRate=1" size="sm" className="!px-4 !py-2 lg:!px-5">
              <Star weight="duotone" className="h-4 w-4" />
              Rate Your Society
            </PressButton>
          </Magnetic>

          <button
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white/70 text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
          >
            <List weight="bold" className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className={`fixed inset-0 z-[60] ${menuOpen ? '' : 'pointer-events-none'}`} aria-hidden={!menuOpen}>
        <div
          onClick={close}
          className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-200 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-80 max-w-[88vw] flex-col overflow-y-auto border-l border-slate-200 bg-white shadow-xl transition-transform duration-200 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <Link to="/" onClick={close} className="flex shrink-0 items-center gap-2">
              <img src="/logo.png" alt="GurgaonFlat" className="h-7 w-auto" />
              <span className="font-display text-base font-bold tracking-tight text-ink">GurgaonFlat</span>
            </Link>
            <button
              aria-label="Close menu"
              onClick={close}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            >
              <X weight="bold" className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 p-4">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={close}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-100 p-4">
            <SearchBar autoFocus={menuOpen} />
          </div>

          <div className="p-4">
            <PressButton to="/societies?openRate=1" className="w-full justify-center">
              <Star weight="duotone" className="h-4 w-4" />
              Rate Your Society
            </PressButton>
          </div>
        </aside>
      </div>
    </>
  );
}
