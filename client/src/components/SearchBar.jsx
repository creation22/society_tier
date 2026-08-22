import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce.js';
import api from '../utils/api.js';
import { tierColor } from '../utils/tier.js';

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
    <div ref={boxRef} className={`relative ${compact ? 'w-72' : 'w-full'}`}>
      <div className="flex items-center border-3 border-ink bg-white shadow-brutal-sm transition focus-within:shadow-brutal">
        <span className="pl-3 text-lg">🔍</span>
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
          className={`w-full bg-transparent px-3 font-semibold outline-none ${compact ? 'py-2 text-sm' : 'py-3.5'}`}
        />
      </div>

      {open && hasResults && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 animate-pop-in border-3 border-ink bg-paper shadow-brutal">
          {results.groups.map((g) => (
            <button
              key={`${g.type}-${g.value}`}
              onClick={() => go(g.type === 'area' ? `/area/${encodeURIComponent(g.value)}` : `/societies?sector=${encodeURIComponent(g.value)}`)}
              className="flex w-full items-center gap-2 border-b-3 border-ink/10 px-4 py-2.5 text-left text-sm font-bold uppercase transition-colors hover:bg-tierS"
            >
              <span>📍</span> {g.label}
            </button>
          ))}
          {results.societies.map((s) => (
            <button
              key={s.slug}
              onClick={() => go(`/society/${s.slug}`)}
              className="flex w-full items-center justify-between gap-3 border-b-3 border-ink/10 px-4 py-2.5 text-left last:border-b-0 transition-colors hover:bg-tierS"
            >
              <span>
                <span className="block font-bold">{s.name}</span>
                <span className="text-xs text-gray-600">{s.sector} · {s.area}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-sm font-bold">
                {Number(s.overallRating).toFixed(1)} ★
                <span
                  className="inline-flex h-6 w-6 items-center justify-center border-3 border-ink font-display text-xs"
                  style={{ background: tierColor(s.tier) }}
                >
                  {s.tier}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
