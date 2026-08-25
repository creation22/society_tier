import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass } from '@phosphor-icons/react';
import Backdrop from '../components/ui/Backdrop.jsx';
import DrawLine from '../components/ui/DrawLine.jsx';
import PressButton from '../components/ui/PressButton.jsx';
import { useSEO } from '../utils/seo.js';

export default function NotFound() {
  useSEO({ title: '404 — Page not found | GurgaonFlat', path: '/404' });
  return (
    <section className="relative isolate flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-ink px-4 text-center">
      <Backdrop dark grid noise={false} />
      <div className="relative">
        {/* Giant ghost 404 with a drawn outline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto inline-block"
        >
          <svg
            className="mx-auto text-white/90"
            width="220"
            height="120"
            viewBox="0 0 220 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="404"
          >
            <motion.path
              d="M8 90 L8 30 L48 90 L48 30 M70 30 L110 30 L70 90 L110 90 M150 30 L150 90 L190 60 L190 90 M150 90 L190 30"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <DrawLine
            className="absolute -bottom-4 left-0 w-full text-white/50"
            d="M2 8 Q 60 1 120 7 T 218 6"
            width={220}
            height={12}
            duration={1}
            delay={0.9}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          This sector is <em className="font-serif font-normal italic">undeveloped</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-3 max-w-md text-base text-slate-300"
        >
          The page you’re looking for doesn’t exist — or hasn’t been built yet. Let’s get you back to
          civilization.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <PressButton to="/" variant="secondary" size="lg">
            <Compass weight="duotone" className="h-5 w-5" />
            Back to GurgaonFlat
          </PressButton>
        </motion.div>
      </div>
    </section>
  );
}
