import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-28 text-center">
      <p className="inline-block -rotate-2 border-3 border-ink bg-tierD px-3 py-1 font-display text-white shadow-brutal">404</p>
      <h1 className="mt-4 font-display text-5xl uppercase">This sector is undeveloped</h1>
      <p className="mt-2 font-bold uppercase text-gray-600">No societies here. Yet.</p>
      <Link to="/" className="brutal-btn mt-8 bg-tierS text-lg">Back to the Tier List</Link>
    </div>
  );
}
