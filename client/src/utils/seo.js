import { useEffect } from 'react';

/**
 * Client-side SEO helper. Sets title, meta description and Open Graph tags.
 * (For full crawler support this would move to SSR/prerendering.)
 */
export function useSEO({ title, description, path }) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:title', title);
      setMeta('property', 'og:description', description);
      setMeta('property', 'og:url', window.location.origin + (path || ''));
    }
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + (path || '');
  }, [title, description, path]);
}

function setMeta(attrType, attrKey, content) {
  let el = document.head.querySelector(`meta[${attrType}="${attrKey}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrType, attrKey);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
