import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../utils/cn.js';

const VARIANTS = {
  primary: 'bg-ink text-white',
  secondary: 'bg-white text-ink',
  glass: 'bg-white/10 text-white border-white/20 backdrop-blur-md hover:bg-white/15',
  ghost: 'bg-transparent text-ink'
};

const SIZES = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-3.5 text-sm sm:text-base'
};

/**
 * Tactile 3D pressable pill — solid stacked base shadow + lift on hover,
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
  baseColor = '#000000',
  ...props
}) {
  const reduce = useReducedMotion();
  const classes = cn(
    'group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-150',
    'border-2 border-black/10',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size],
    !reduce && 'hover:-translate-y-0.5 active:translate-y-1',
    className
  );

  // The "base" is a solid offset block behind the button giving the 3D stack.
  const stackStyle = reduce
    ? { boxShadow: '0 6px 20px -8px rgba(10,10,10,0.45)' }
    : {
        boxShadow: `0 6px 0 0 ${baseColor}, 0 12px 24px -6px rgba(10,10,10,0.30)`,
        transition: 'box-shadow .15s ease, transform .15s ease'
      };

  const inner = (
    <motion.span
      className={classes}
      style={stackStyle}
      whileHover={reduce ? undefined : { boxShadow: `0 8px 0 0 ${baseColor}, 0 16px 28px -8px rgba(10,10,10,0.32)` }}
    >
      {children}
    </motion.span>
  );

  if (to) return <Link to={to} {...props}>{inner}</Link>;
  if (href) return <a href={href} {...props}>{inner}</a>;
  return (
    <button {...props}>
      {inner}
    </button>
  );
}
