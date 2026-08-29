import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../utils/cn.js';

const VARIANTS = {
  primary:
    'bg-ink text-white border-black/5 shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset,0_1px_2px_0_rgba(10,10,10,0.4)]',
  secondary:
    'bg-white text-ink border-black/5 shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_1px_2px_0_rgba(10,10,10,0.18)]',
  glass:
    'bg-white/10 text-white border-white/25 backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.18)_inset,0_1px_2px_0_rgba(0,0,0,0.18)] hover:bg-white/15 hover:border-white/35',
  ghost: 'bg-transparent text-ink border-transparent shadow-none'
};

const SIZES = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-3.5 text-sm sm:text-base'
};

/**
 * Tactile 3D pressable pill — soft layered base shadow + lift on hover,
 * press-down on active. Rounded-full. Premium CTA treatment.
 * Polymorphic: `to` → <Link>, `href` → <a>, else <button>.
 */
export default function PressButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  to,
  href,
  baseColor = 'rgba(10,10,10,0.92)',
  ...props
}) {
  const reduce = useReducedMotion();

  const stackStyle = reduce
    ? { boxShadow: '0 10px 26px -10px rgba(10,10,10,0.45)' }
    : {
        boxShadow: `0 5px 0 0 ${baseColor}, 0 14px 28px -10px rgba(10,10,10,0.40), 0 1px 0 0 rgba(255,255,255,0.10) inset`,
        transition: 'box-shadow .2s cubic-bezier(0.16,1,0.3,1), transform .2s cubic-bezier(0.16,1,0.3,1)'
      };

  const hoverShadow = reduce
    ? undefined
    : {
        boxShadow: `0 7px 0 0 ${baseColor}, 0 20px 34px -12px rgba(10,10,10,0.42), 0 1px 0 0 rgba(255,255,255,0.14) inset`
      };

  const classes = cn(
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-all duration-200',
    'border',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size],
    !reduce && 'hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-[0_2px_0_0_rgba(10,10,10,0.92),0_6px_14px_-8px_rgba(10,10,10,0.4)]',
    className
  );

  const inner = (
    <motion.span
      className={classes}
      style={stackStyle}
      whileHover={hoverShadow}
    >
      {/* Sheen sweep on hover */}
      {!reduce && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
      )}
      <span className="relative z-[1] inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.span>
  );

  if (to)
    return (
      <Link to={to} {...props}>
        {inner}
      </Link>
    );
  if (href)
    return (
      <a href={href} {...props}>
        {inner}
      </a>
    );
  return (
    <button {...props}>
      {inner}
    </button>
  );
}
