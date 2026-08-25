import { motion, useScroll } from 'framer-motion';

/**
 * Top-of-viewport scroll-progress bar. Fixed, scaleX follows page scroll.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[70] h-0.5 origin-left bg-ink"
      style={{ scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  );
}
