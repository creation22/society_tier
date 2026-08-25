import { motion, useReducedMotion } from 'framer-motion';

/**
 * In-view reveal wrapper. Fades + slides children up when scrolled into view.
 */
export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 24,
  once = true,
  amount = 0.3,
  className
}) {
  const M = motion[as] || motion.div;
  const reduce = useReducedMotion();
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}
