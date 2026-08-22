import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t-3 border-ink bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <img src="/logo.png" alt="GurgaonFlat" className="h-10 w-auto" />
          <p className="mt-3 max-w-xs text-sm text-gray-300">
            Rate your society. See where it ranks in Gurgaon. Real residents. Real opinions.
          </p>
        </div>
        <div className="flex flex-col gap-1 text-sm font-bold uppercase">
          <Link to="/leaderboard" className="hover:text-tierS">Leaderboard</Link>
          <Link to="/" className="hover:text-tierS">Map</Link>
          <Link to="/societies" className="hover:text-tierS">All Societies</Link>
          <Link to="/find-flats" className="hover:text-tierS">Find Flats</Link>
          <Link to="/compare" className="hover:text-tierS">Compare</Link>
          <Link to="/privacy" className="hover:text-tierS">Privacy Policy</Link>
        </div>
        <div className="text-sm text-gray-400">
          <p className="font-bold uppercase text-cream">Community-powered rankings</p>
          <p className="mt-2">
            Ratings are confidence-adjusted and come from residents — not brokers, not paid listings.
          </p>
          <a
            href="mailto:creation2224@gmail.com?subject=GurgaonFlat%20—%20Developer%20Contact"
            className="mt-4 inline-block border-3 border-cream bg-transparent px-3 py-1.5 font-bold uppercase tracking-wide text-cream transition-colors hover:bg-tierS hover:text-ink"
          >
            Contact the Developer →
          </a>
        </div>
      </div>
      <div className="border-t border-gray-700 px-4 py-4 text-center text-xs uppercase tracking-widest text-gray-500">
        © {new Date().getFullYear()} GurgaonFlat — <a href="https://gurgaonflat.online" className="hover:text-tierS">gurgaonflat.online</a> — Built for Gurgaon
      </div>
    </footer>
  );
}
