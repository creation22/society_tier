import DrawLine from './DrawLine.jsx';
import { cn } from '../../utils/cn.js';

/**
 * A thin centered SVG squiggle that draws itself via pathLength.
 * Drop between sections for a hand-drawn, editorial rhythm.
 *
 * @param {string} [props.tone]   Tailwind text color class for the stroke.
 * @param {string} [props.className]
 */
export default function SectionDivider({ tone = 'text-slate-300', className }) {
  return (
    <div className={cn('flex justify-center py-10', className)} aria-hidden="true">
      <DrawLine
        className={cn('h-3 w-40', tone)}
        d="M2 6 Q 40 1 80 6 T 158 6"
        width={160}
        height={12}
        duration={1.4}
      />
    </div>
  );
}
