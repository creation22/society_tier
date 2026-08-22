import { useEffect, useRef, useState } from 'react';

/**
 * Animated count-up. Starts when `start` becomes true.
 */
export function useCountUp(target, start, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef();

  useEffect(() => {
    if (!start) return undefined;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      // easeOutCubic
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, start, duration]);

  return value;
}

/** IntersectionObserver hook — true once the element has entered the viewport. */
export function useOnScreen(options = { threshold: 0.3 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return undefined;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return [ref, visible];
}
