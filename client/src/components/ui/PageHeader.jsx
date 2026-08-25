import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from '@phosphor-icons/react';
import Backdrop from './Backdrop.jsx';
import DrawLine from './DrawLine.jsx';
import Reveal from './Reveal.jsx';
import { cn } from '../../utils/cn.js';

/**
 * Unified premium page hero for inner pages.
 *
 * @param {string} props.eyebrow      Small pill label above the title.
 * @param {string} props.title        Headline (Space Grotesk).
 * @param {string} [props.accent]     Word to render in Fraunces italic (editorial accent).
 * @param {string} [props.intro]      Supporting paragraph.
 * @param {node}  [props.children]   Action slot (buttons) under the intro.
 * @param {Array} [props.crumbs]      [{label,to}] breadcrumb trail.
 */
export default function PageHeader({ eyebrow, title, accent, intro, children, crumbs, className }) {
  return (
    <section className={cn('relative isolate overflow-hidden bg-white', className)}>
      <Backdrop orbs />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:py-20">
        {crumbs?.length > 0 && (
          <nav className="mb-5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i === 0 && <ArrowLeft weight="bold" className="h-3 w-3" />}
                {c.to ? (
                  <Link to={c.to} className="transition-colors hover:text-ink">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-slate-600">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <span className="text-slate-300">/</span>}
              </span>
            ))}
          </nav>
        )}

        {eyebrow && (
          <Reveal>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              {eyebrow}
            </span>
          </Reveal>
        )}

        <Reveal delay={0.05}>
          <h1 className="relative mt-5 inline-block font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {title}{' '}
            {accent && <em className="font-serif font-normal italic text-ink">{accent}</em>}
            <DrawLine
              className="absolute -bottom-3 left-0 w-full text-ink/70"
              d="M2 9 Q 60 2 120 8 T 318 7"
              width={320}
              height={12}
              duration={1.1}
              delay={0.3}
            />
          </h1>
        </Reveal>

        {intro && (
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-500">{intro}</p>
          </Reveal>
        )}

        {children && (
          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">{children}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
