import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn.js';

const VARIANTS = {
  primary: 'bg-ink text-white border-ink shadow-sm hover:bg-black hover:border-black',
  secondary: 'bg-white text-slate-700 border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300',
  ghost: 'bg-transparent text-slate-700 border-transparent shadow-none hover:bg-slate-100',
  dark: 'bg-slate-900 text-white border-slate-900 shadow-sm hover:bg-slate-800 hover:border-slate-800',
  outline: 'bg-transparent text-slate-900 border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-400',
  subtle: 'bg-slate-100 text-slate-800 border-slate-200 shadow-sm hover:bg-slate-200'
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
  xl: 'px-7 py-3.5 text-base rounded-lg',
  icon: 'p-2 rounded-md'
};

/**
 * Clean SaaS button. Polymorphic: `to` → <Link>, `href` → <a>, else <button>.
 */
export default function Button({ children, className, variant = 'secondary', size = 'md', to, href, ...props }) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/70 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    VARIANTS[variant] || VARIANTS.secondary,
    SIZES[size],
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
