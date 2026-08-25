import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import Birds from './Birds.jsx';
import SkylineBackdrop from './SkylineBackdrop.jsx';
import { cn } from '../../utils/cn.js';

const VIDEO_HD = 'https://videos.pexels.com/video-files/6618225/6618225-hd_1920_1080_30fps.mp4';
const VIDEO_SD = 'https://videos.pexels.com/video-files/6618225/6618225-sd_960_540_30fps.mp4';
const POSTER = 'https://images.pexels.com/videos/6618225/4k-4k-background-4k-resolution-4k-video-6618225.jpeg';

/**
 * Cinematic city + birds video backdrop for the hero.
 * - Full-bleed looping muted video, object-cover.
 * - Gradient scrims for text legibility + seamless bottom fade to the page bg.
 * - Animated SVG birds layered over the sky.
 * - Graceful fallback: on reduced-motion or load error → SkylineBackdrop (SVG).
 *
 * @param {string} [props.fadeTo]   CSS color the bottom should blend into.
 * @param {boolean} [props.birds=true]
 */
export default function CityVideoBackdrop({ fadeTo = '#fafaf9', birds = true, className }) {
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);

  if (reduce || failed) {
    return <SkylineBackdrop className={cn(className)} height="h-full" />;
  }

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      {/* Video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={POSTER}
        crossOrigin="anonymous"
        onError={() => setFailed(true)}
      >
        <source src={VIDEO_HD} type="video/mp4" />
        <source src={VIDEO_SD} type="video/mp4" />
      </video>

      {/* Scrims: light top tint for the nav + a short bottom fade into the page bg. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
      <div
        className="absolute inset-x-0 bottom-0 h-14"
        style={{ background: `linear-gradient(to top, ${fadeTo}, transparent)` }}
      />

      {/* Birds */}
      {birds && <Birds count={7} color="text-white/85" />}
    </div>
  );
}
