import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../utils/cn.js';

/**
 * Seamless framer-motion marquee. Duplicates children for a continuous loop.
 * `reverse` scrolls left-to-right.
 */
export default function Marquee({ children, className, reverse = false, speed = 28, pauseOnHover = true }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div className={cn('overflow-hidden', className)}>
        <div className="flex items-center gap-8">{children}</div>
      </div>
    );
  }
  return (
    <div className={cn('group overflow-hidden', className)}>
      <motion.div
        className="flex w-max items-center gap-8 will-change-transform"
        animate={{ x: reverse ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        whileHover={pauseOnHover ? { transition: { duration: 0.4 } } : undefined}
      >
        <span className="flex items-center gap-8">{children}</span>
        <span className="flex items-center gap-8" aria-hidden="true">{children}</span>
      </motion.div>
    </div>
  );
}
