import { motion, useReducedMotion } from 'framer-motion';

/**
 * Word-by-word headline reveal. Words rise + fade in sequence on in-view.
 * Splits `text` on spaces; pass a JSX node for `text` to keep inline markup.
 */
export default function TextReveal({ text, as = 'h2', className, delay = 0, stagger = 0.05 }) {
  const M = motion[as] || motion.h2;
  const reduce = useReducedMotion();
  const words = String(text).split(' ');

  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={
              reduce
                ? { hidden: {}, show: {} }
                : { hidden: { y: '110%', opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }
            }
          >
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </M>
  );
}
