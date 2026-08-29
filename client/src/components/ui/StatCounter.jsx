import { useCountUp, useOnScreen } from '../../hooks/useCountUp.js';

/**
 * Animated count-up stat for landing pages. Triggers on scroll into view.
 */
export default function StatCounter({ to, label, prefix = '', suffix = '', decimals = 0, accent = 'bg-slate-900' }) {
  const [ref, visible] = useOnScreen({ threshold: 0.4 });
  const value = useCountUp(to, visible, 1400);
  const display = decimals > 0 ? value.toFixed(decimals) : value.toLocaleString('en-IN');

  return (
    <div ref={ref}>
      <div className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        <span className="text-slate-300">{prefix}</span>
        {display}
        {suffix}
      </div>
      <p className="mt-2 text-sm font-medium tracking-wide text-slate-500">{label}</p>
    </div>
  );
}
