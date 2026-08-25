import { cn } from '../../utils/cn.js';

const TONES = {
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  primary: 'bg-slate-900 text-white border-slate-900',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  danger: 'bg-rose-50 text-rose-700 border-rose-100',
  info: 'bg-sky-50 text-sky-700 border-sky-100'
};

/**
 * Soft pill badge.
 */
export default function Badge({ children, className, as: Tag = 'span', tone = 'slate', dot = false, ...props }) {
  return (
    <Tag
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        TONES[tone] || TONES.slate,
        className
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </Tag>
  );
}
