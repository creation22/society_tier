import { TIER_META } from '../../utils/tier.js';
import { cn } from '../../utils/cn.js';

/**
 * Refined tier badge. Rounded square, tier-colored fill, white letter.
 * @param {string} props.tier   S | A | B | C | D
 * @param {'sm'|'md'|'lg'} [props.size='md']
 */
export default function TierBadge({ tier, size = 'md', className }) {
  const meta = TIER_META[tier] || TIER_META.B;
  const sizes = {
    sm: 'h-6 w-6 min-w-[1.5rem] text-[11px] rounded-md',
    md: 'h-8 w-8 min-w-[2rem] text-xs rounded-lg',
    lg: 'h-11 w-11 min-w-[2.75rem] text-base rounded-xl'
  };
  return (
    <span
      title={`${meta.label} — ${meta.text}`}
      className={cn(
        'inline-flex items-center justify-center font-display font-bold leading-none text-white shadow-sm',
        sizes[size],
        className
      )}
      style={{ background: meta.color }}
    >
      {tier}
    </span>
  );
}
