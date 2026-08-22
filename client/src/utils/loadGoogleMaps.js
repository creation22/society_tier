/**
 * Lazy-loads the Google Maps JS API exactly once.
 * Reads the key from VITE_GOOGLE_MAPS_API_KEY — never hardcode keys.
 */
let loadPromise = null;

export function isMapsConfigured() {
  return Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
}

export function loadGoogleMaps() {
  if (window.google && window.google.maps) return Promise.resolve(window.google.maps);
  if (loadPromise) return loadPromise;

  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key) {
    return Promise.reject(new Error('VITE_GOOGLE_MAPS_API_KEY is not configured'));
  }

  loadPromise = new Promise((resolve, reject) => {
    const cbName = '__googleMapsReady__';
    window[cbName] = () => resolve(window.google.maps);

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=${cbName}&libraries=places`;
    script.async = true;
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Failed to load Google Maps script'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
