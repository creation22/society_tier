export function formatCount(n) {
  if (n == null) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return String(Math.round(n));
}

export function formatRating(n) {
  return n != null ? Number(n).toFixed(1) : '–';
}

export function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60]
  ];
  for (const [name, secs] of units) {
    const interval = Math.floor(seconds / secs);
    if (interval >= 1) return `${interval} ${name}${interval > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export function formatPrice(perSqft) {
  if (!perSqft) return null;
  return `₹${formatCount(perSqft)}/sqft`;
}
