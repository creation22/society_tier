import { useState } from 'react';
import { Star } from '@phosphor-icons/react';
import { cn } from '../utils/cn.js';

/**
 * 5-star display widget mapping to the internal 1-10 scale
 * (each star = 2 points). Interactive when onChange is provided.
 */
export default function StarRating({ value = 0, onChange, size = 'text-2xl' }) {
  const [hover, setHover] = useState(null);
  const display = hover ?? value;

  return (
    <div className="inline-flex items-center gap-1" onMouseLeave={() => setHover(null)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = display >= star * 2;
        const half = !filled && display >= star * 2 - 1;
        return (
          <button
            key={star}
            type="button"
            disabled={!onChange}
            aria-label={`${star} stars`}
            onMouseEnter={() => onChange && setHover(star * 2)}
            onClick={() => onChange && onChange(star * 2)}
            className={cn(
              'relative leading-none transition-transform duration-100 text-amber-400',
              size,
              onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            )}
          >
            <Star weight="regular" className="text-slate-200" />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden text-amber-400"
                style={{ width: half ? '50%' : '100%' }}
              >
                <Star weight="fill" />
              </span>
            )}
          </button>
        );
      })}
      {onChange && (
        <span className="ml-2 w-8 font-display text-lg font-semibold text-ink">{display}</span>
      )}
    </div>
  );
}
