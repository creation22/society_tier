import { cn } from '../../utils/cn.js';

/**
 * Landing section wrapper with optional eyebrow + heading.
 */
export default function Section({ id, eyebrow, title, intro, children, className, innerClassName }) {
  return (
    <section id={id} className={cn('relative scroll-mt-24 px-4 py-16 sm:py-24', className)}>
      <div className={cn('mx-auto max-w-7xl', innerClassName)}>
        {(eyebrow || title || intro) && (
          <header className="mb-14 max-w-3xl">
            {eyebrow && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-[2.75rem] sm:leading-[1.08]">
                {title}
              </h2>
            )}
            {intro && <p className="mt-5 text-lg leading-relaxed text-slate-500">{intro}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
