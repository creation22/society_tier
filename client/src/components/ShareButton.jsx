import { useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Floating share button — shares the current page URL via the native Web
 * Share API, falling back to clipboard copy. Sits above the Support button.
 */
export default function ShareButton() {
  const { pathname } = useLocation();
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.origin + pathname;
    const title = document.title;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user dismissed */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <button
      aria-label="Share this page"
      onClick={share}
      className="fixed bottom-[68px] left-5 z-40 flex items-center gap-2 border-3 border-ink bg-white px-3 py-2.5 font-display text-xs uppercase shadow-brutal-sm transition-all hover:shadow-brutal active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
        <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
      </svg>
      <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
    </button>
  );
}
