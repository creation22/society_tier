import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t-3 border-ink bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="inline-block border-3 border-cream bg-tierS px-2 py-1 font-display text-lg text-ink">
            SOCIETY<span className="text-accent">TIER</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-gray-300">
            Rate your society. See where it ranks in Gurgaon. Real residents. Real opinions.
          </p>
        </div>
        <div className="flex flex-col gap-1 text-sm font-bold uppercase">
          <Link to="/leaderboard" className="hover:text-tierS">Leaderboard</Link>
          <Link to="/" className="hover:text-tierS">Map</Link>
          <Link to="/societies" className="hover:text-tierS">All Societies</Link>
          <Link to="/compare" className="hover:text-tierS">Compare</Link>
        </div>
        <div className="text-sm text-gray-400">
          <p className="font-bold uppercase text-cream">Community-powered rankings</p>
          <p className="mt-2">
            Ratings are confidence-adjusted and come from residents — not brokers, not paid listings.
          </p>
        </div>
      </div>
      <div className="border-t border-gray-700 px-4 py-4 text-center text-xs uppercase tracking-widest text-gray-500">
        © {new Date().getFullYear()} Society Tier — Built for Gurgaon
      </div>
    </footer>
  );
}
