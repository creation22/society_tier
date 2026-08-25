import { useMemo } from 'react';

/**
 * Flocks of SVG gulls gliding across the sky. Pure CSS keyframes
 * (nb-fly / nb-fly-rev / nb-flap) so it's cheap and never blocks the main thread.
 *
 * @param {number} [props.count=7]   Number of birds.
 * @param {string} [props.color]     Tailwind text color class for the strokes.
 * @param {string} [props.className] Positioned by parent (absolute inset-0).
 */
export default function Birds({ count = 7, color = 'text-ink/70', className = '' }) {
  const flock = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const rev = Math.random() > 0.5;
        return {
          id: i,
          rev,
          top: 8 + Math.random() * 38, // % of parent height
          scale: 0.45 + Math.random() * 0.7,
          duration: 16 + Math.random() * 14,
          delay: -Math.random() * 20, // negative => start mid-flight
          flapDur: 0.5 + Math.random() * 0.5
        };
      }),
    [count]
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {flock.map((b) => (
        <div
          key={b.id}
          className={`absolute left-0 ${color}`}
          style={{
            top: `${b.top}%`,
            animation: `${b.rev ? 'nb-fly-rev' : 'nb-fly'} ${b.duration}s linear ${b.delay}s infinite`,
            willChange: 'transform'
          }}
        >
          <svg
            viewBox="0 0 40 16"
            width="40"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: `scale(${b.scale})`,
              transformOrigin: 'center',
              animation: `nb-flap ${b.flapDur}s ease-in-out infinite`
            }}
          >
            <path d="M2 13 Q 11 2 20 13 Q 29 2 38 13" />
          </svg>
        </div>
      ))}
    </div>
  );
}
