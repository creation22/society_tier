import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

/**
 * Self-drawing Gurgaon skyline silhouette for the final CTA.
 * Pure stroke — every building outline draws itself in via pathLength
 * when scrolled into view. A single map-style route threads through the
 * towers, drawing last so the project's "explore the map" theme lands.
 *
 * Monochrome (currentColor) so it inherits its parent's text colour.
 */
export default function SkylineDraw({ className = '' }) {
  const reduce = useReducedMotion();
  const init = reduce ? 1 : 0;

  const buildings = [
    // Left cluster
    'M16 188 V120 H30 V100 H44 V188',
    'M44 188 V132 H58 V112 H72 V188',
    // Mid-left tower (tall, with antenna)
    'M76 188 V96 H88 V64 H96 V48 H104 V64 H112 V96 H124 V188',
    // DLF-style twin towers
    'M128 188 V84 H142 V72 H156 V84 H170 V188',
    // Central slab
    'M174 188 V108 H196 V92 H218 V108 H240 V188',
    // Cyber-city style pyramid top
    'M244 188 V104 L258 76 L272 104 V188',
    // Right tall tower with setbacks
    'M276 188 V88 H288 V68 H300 V52 H308 V68 H320 V88 H332 V188',
    // Mid-right
    'M336 188 V116 H350 V96 H364 V116 H378 V188',
    // Right edge low rise
    'M382 188 V128 H396 V112 H410 V128 H424 V188',
    // Far right
    'M428 188 V140 H442 V120 H456 V140 H470 V188'
  ];

  // A wandering "map route" that threads through the towers — drawn last.
  const route = 'M8 196 Q 60 150 96 168 T 172 150 T 258 120 T 350 158 T 472 196';

  return (
    <svg
      className={className}
      viewBox="0 0 480 200"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      {/* Ground line */}
      <motion.line
        x1="0" y1="188" x2="480" y2="188"
        strokeWidth="1.5"
        stroke="currentColor"
        strokeOpacity="0.25"
        initial={{ pathLength: init }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
      />

      {/* Building outlines — staggered draw-in */}
      {buildings.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeOpacity="0.9"
          initial={{ pathLength: init }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.15 + i * 0.09, ease: EASE }}
        />
      ))}

      {/* A few lit windows — fade in after the towers draw */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <motion.rect
          key={`w-${i}`}
          x={[92, 138, 200, 264, 296, 354, 404, 440][i]}
          y={[74, 92, 100, 86, 76, 104, 120, 128][i]}
          width="4" height="4"
          fill="currentColor"
          stroke="none"
          initial={{ opacity: reduce ? 0.8 : 0 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 1.2 + i * 0.05 }}
        />
      ))}

      {/* Map route threading through the skyline — drawn last */}
      <motion.path
        d={route}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="5 5"
        stroke="currentColor"
        strokeOpacity="0.55"
        initial={{ pathLength: init }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 1.5, ease: EASE }}
      />

      {/* Route endpoint pins — pop in after the route draws */}
      <motion.circle
        cx="8" cy="196" r="4" fill="currentColor" stroke="none"
        initial={{ scale: reduce ? 1 : 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.4, type: 'spring', stiffness: 400, damping: 14 }}
      />
      <motion.circle
        cx="472" cy="196" r="4" fill="currentColor" stroke="none"
        initial={{ scale: reduce ? 1 : 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 3.4, type: 'spring', stiffness: 400, damping: 14 }}
      />
    </svg>
  );
}
