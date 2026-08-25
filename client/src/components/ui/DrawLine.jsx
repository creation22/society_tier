import { motion, useReducedMotion } from 'framer-motion';

/**
 * SVG path that "draws" itself using framer-motion's pathLength (0 → 1)
 * when scrolled into view. Pure stroke — no fill.
 *
 * @param {string} props.d        SVG path data
 * @param {number} [props.width]  viewBox width
 * @param {number} [props.height] viewBox height
 * @param {string} [props.className]
 * @param {number} [props.duration]
 * @param {number} [props.delay]
 * @param {boolean} [props.absolute] Position absolutely inside a relative parent.
 */
export default function DrawLine({
  d,
  width = 200,
  height = 12,
  className,
  duration = 1.1,
  delay = 0,
  absolute = false
}) {
  const reduce = useReducedMotion();
  return (
    <svg
      className={className}
      style={absolute ? { position: 'absolute', inset: 0, width: '100%', height: '100%' } : undefined}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        d={d}
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
