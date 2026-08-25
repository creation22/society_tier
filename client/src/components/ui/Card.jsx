import { cn } from '../../utils/cn.js';

/**
 * Clean SaaS surface card. Subtle border, soft shadow, rounded corners.
 */
export default function Card({ children, className, as: Tag = 'div', hover = false, ...props }) {
  return (
    <Tag
      className={cn(
        'rounded-xl border border-slate-200 bg-white shadow-sm',
        hover && 'transition-all duration-200 hover:shadow-md hover:border-slate-300',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
