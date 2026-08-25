import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Bespoke SVG Gurgaon skyline backdrop with multi-layer parallax.
 * Grayscale, premium silhouette band for hero sections.
 * Place inside a relative, overflow-hidden parent.
 *
 * @param {string} [props.className]
 * @param {boolean} [props.dark]   Invert for dark sections.
 * @param {number}  [props.height]  Tailwind h-* class for the band.
 */
export default function SkylineBackdrop({ className = '', dark = false, height = 'h-[420px]' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  // Three layers move at different rates for depth.
  const yBack = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -30, reduce ? 0 : 30]);
  const yMid = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -18, reduce ? 0 : 18]);
  const yFront = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -8, reduce ? 0 : 8]);

  const back = dark ? '#1f1f1d' : '#e6e3dd';
  const mid = dark ? '#16161500' : '#dcd8d0';
  const front = dark ? '#0e0e0d' : '#cfcabf';
  const sky = dark ? 'transparent' : 'linear-gradient(180deg,#ffffff 0%,#fafaf9 60%,#f3f1ea 100%)';

  return (
    <div ref={ref} className={`pointer-events-none absolute inset-x-0 bottom-0 ${height} overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0" style={{ background: sky }} />
      <Layer y={yBack} fill={back} buildings={BUILDINGS_BACK} className="bottom-[28%]" opacity={0.55} />
      <Layer y={yMid} fill={mid} buildings={BUILDINGS_MID} className="bottom-[14%]" opacity={0.7} />
      <Layer y={yFront} fill={front} buildings={BUILDINGS_FRONT} className="bottom-0" opacity={0.95} />
      {/* Ground fade into the page background */}
      <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: dark ? 'linear-gradient(to top,#0A0A0A,transparent)' : 'linear-gradient(to top,#fafaf9,transparent)' }} />
    </div>
  );
}

function Layer({ y, fill, buildings, className, opacity }) {
  const d = buildings.map((b, i) => rect(b.x, b.y, b.w, b.h, i)).join(' ');
  return (
    <motion.svg
      style={{ y }}
      className={`absolute left-0 w-full ${className}`}
      viewBox="0 0 1440 300"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
      opacity={opacity}
    >
      <g fill={fill}>
        <path d={d} />
      </g>
    </motion.svg>
  );
}

function rect(x, y, w, h, i) {
  return `M${x} ${300 - h} h${w} v${h} h${-w} z`;
}

// Layered building silhouettes (x, width, height). y ignored; computed in rect().
const BUILDINGS_BACK = [
  { x: 0, w: 60, h: 90 }, { x: 70, w: 40, h: 140 }, { x: 120, w: 70, h: 70 },
  { x: 200, w: 50, h: 160 }, { x: 260, w: 90, h: 110 }, { x: 360, w: 45, h: 180 },
  { x: 420, w: 70, h: 95 }, { x: 500, w: 55, h: 150 }, { x: 565, w: 80, h: 120 },
  { x: 655, w: 50, h: 200 }, { x: 715, w: 65, h: 100 }, { x: 790, w: 90, h: 170 },
  { x: 890, w: 45, h: 90 }, { x: 945, w: 70, h: 145 }, { x: 1025, w: 55, h: 115 },
  { x: 1090, w: 85, h: 185 }, { x: 1185, w: 50, h: 100 }, { x: 1245, w: 75, h: 155 },
  { x: 1330, w: 60, h: 95 }, { x: 1400, w: 40, h: 130 }
];
const BUILDINGS_MID = [
  { x: 0, w: 80, h: 70 }, { x: 90, w: 55, h: 130 }, { x: 155, w: 75, h: 60 },
  { x: 240, w: 60, h: 150 }, { x: 310, w: 95, h: 95 }, { x: 415, w: 50, h: 175 },
  { x: 475, w: 75, h: 80 }, { x: 560, w: 60, h: 135 }, { x: 630, w: 85, h: 105 },
  { x: 725, w: 55, h: 190 }, { x: 790, w: 70, h: 85 }, { x: 870, w: 95, h: 160 },
  { x: 975, w: 50, h: 75 }, { x: 1035, w: 75, h: 140 }, { x: 1120, w: 60, h: 100 },
  { x: 1190, w: 90, h: 170 }, { x: 1290, w: 55, h: 85 }, { x: 1355, w: 85, h: 145 }
];
const BUILDINGS_FRONT = [
  { x: 0, w: 100, h: 50 }, { x: 110, w: 70, h: 110 }, { x: 190, w: 85, h: 45 },
  { x: 285, w: 65, h: 130 }, { x: 360, w: 105, h: 70 }, { x: 475, w: 55, h: 150 },
  { x: 540, w: 80, h: 60 }, { x: 630, w: 70, h: 120 }, { x: 710, w: 95, h: 80 },
  { x: 815, w: 60, h: 160 }, { x: 885, w: 75, h: 55 }, { x: 970, w: 100, h: 135 },
  { x: 1080, w: 55, h: 65 }, { x: 1145, w: 80, h: 115 }, { x: 1235, w: 65, h: 85 },
  { x: 1310, w: 95, h: 140 }, { x: 1415, w: 30, h: 70 }
];
