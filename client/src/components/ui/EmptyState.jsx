import { motion } from 'framer-motion';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { cn } from '../../utils/cn.js';

/**
 * Premium empty / loading-fallback state with a faint SVG illustration.
 *
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {node}  [props.action]    Optional CTA node.
 * @param {string} [props.icon]     Phosphor icon component (defaults to magnifier).
 * @param {string} [props.className]
 */
export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Try adjusting your filters or search.',
  action,
  icon: Icon = MagnifyingGlass,
  className
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm',
        className
      )}
    >
      {/* Faint line-drawing backdrop */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-slate-900"
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.04"
        aria-hidden="true"
      >
        <circle cx="200" cy="100" r="70" />
        <circle cx="200" cy="100" r="50" />
        <circle cx="200" cy="100" r="30" />
        <line x1="40" y1="100" x2="360" y2="100" />
        <line x1="200" y1="20" x2="200" y2="180" />
      </svg>

      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
        <Icon weight="duotone" className="h-7 w-7" />
      </div>
      <h3 className="relative mt-5 font-display text-xl font-bold text-ink">{title}</h3>
      <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-slate-500">{description}</p>
      {action && <div className="relative mt-6">{action}</div>}
    </motion.div>
  );
}
