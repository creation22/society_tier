import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, MapPin } from '@phosphor-icons/react';
import { useDebounce } from '../hooks/useDebounce.js';
import api from '../utils/api.js';
import { cn } from '../utils/cn.js';
import TierBadge from './ui/TierBadge.jsx';

/**
 * Global search with autocomplete (societies + sector/area groups).
 */
export default function SearchBar({ compact = false, autoFocus = false }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(q, 250);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    if (!debounced.trim()) {
      setResults(null);
      return undefined;
    }
    api
      .get('/search', { params: { q: debounced } })
      .then((res) => {
        if (!cancelled) setResults(res.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  useEffect(() => {
    function onClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function go(path) {
    setOpen(false);
    setQ('');
    navigate(path);
  }

  const hasResults =
    results && (results.societies.length > 0 || results.groups.length > 0);

  return (
    <div ref={boxRef} className={cn('relative', compact ? 'w-full max-w-[288px]' : 'w-full')}>
      <div className="flex items-center rounded-full border border-slate-200 bg-white py-1 shadow-sm transition focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-ink/10">
        <MagnifyingGlass weight="duotone" className="ml-3 h-5 w-5 shrink-0 text-slate-400" />
        <input
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === 'Enter' && q.trim() && go(`/societies?q=${encodeURIComponent(q.trim())}`)}
          placeholder="Search a society, sector or area..."
          className={cn(
            'w-full bg-transparent px-3 font-body outline-none',
            compact ? 'py-1.5 text-sm' : 'py-2.5'
          )}
        />
      </div>

      {open && hasResults && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg animate-pop-in">
          {results.groups.map((g) => (
            <button
              key={`${g.type}-${g.value}`}
              onClick={() => go(g.type === 'area' ? `/area/${encodeURIComponent(g.value)}` : `/societies?sector=${encodeURIComponent(g.value)}`)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <MapPin weight="duotone" className="h-4 w-4 text-slate-400" /> {g.label}
            </button>
          ))}
          {results.societies.map((s) => (
            <button
              key={s.slug}
              onClick={() => go(`/society/${s.slug}`)}
              className="flex w-full items-center justify-between gap-3 border-t border-slate-100 px-4 py-2.5 text-left transition-colors first:border-t-0 hover:bg-slate-50"
            >
              <span>
                <span className="block font-display font-semibold text-ink">{s.name}</span>
                <span className="text-xs text-slate-500">{s.sector} · {s.area}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-slate-700">
                {Number(s.overallRating).toFixed(1)}
                <TierBadge tier={s.tier} size="sm" />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
