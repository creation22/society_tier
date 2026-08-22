import { lazy, Suspense, useMemo } from 'react';

// Lazy-load the entire three.js scene so it never blocks first paint.
const Skyline3D = lazy(() => import('./Skyline3D.jsx'));

export default function Hero3D() {
  const lowPower = useMemo(
    () =>
      typeof window !== 'undefined' &&
      (window.matchMedia('(max-width: 768px)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        (navigator.hardwareConcurrency || 8) <= 4),
    []
  );

  return (
    <div className="relative h-full w-full" aria-hidden="true">
      <Suspense fallback={<SkeletonCity />}>
        <Skyline3D lowPower={lowPower} />
      </Suspense>
    </div>
  );
}

function SkeletonCity() {
  return (
    <div className="flex h-full w-full items-end justify-center gap-2 p-8 opacity-40">
      {[3, 5, 4, 6, 2, 5, 3].map((h, i) => (
        <div key={i} className="w-8 animate-pulse border-3 border-ink bg-ink/20" style={{ height: `${h * 12}%`, animationDelay: `${i * 120}ms` }} />
      ))}
    </div>
  );
}
