import { useSEO } from '../utils/seo.js';

export default function FindFlatsPage() {
  useSEO({ title: 'Find Flats — Coming Soon | GurgaonTier', path: '/find-flats' });

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-dotgrid px-4 text-center">
      <div className="border-3 border-ink bg-tierS px-4 py-1.5 font-display text-sm uppercase shadow-brutal-sm">
        Coming Soon
      </div>
      <h1 className="mt-6 font-display text-5xl uppercase leading-none sm:text-7xl">Find Flats</h1>
      <p className="mt-4 max-w-md font-bold uppercase text-gray-600">
        Verified rentals & resale listings inside rated societies. Launching next.
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Want early access? <a href="mailto:creation2224@gmail.com" className="font-bold underline">Tell us</a>.
      </p>
    </div>
  );
}
