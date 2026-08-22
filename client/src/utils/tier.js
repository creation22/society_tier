export const TIER_META = {
  S: { label: 'S TIER', color: '#FFD60A', text: 'ELITE' },
  A: { label: 'A TIER', color: '#06D6A0', text: 'GREAT' },
  B: { label: 'B TIER', color: '#4361EE', text: 'GOOD' },
  C: { label: 'C TIER', color: '#FF6B35', text: 'AVERAGE' },
  D: { label: 'D TIER', color: '#EF233C', text: 'AVOID' }
};

export function tierColor(tier) {
  return (TIER_META[tier] || TIER_META.B).color;
}

/** Client-side mirror of the server's tier thresholds for optimistic UI. */
export function tierForScore(score) {
  if (score >= 8.8) return 'S';
  if (score >= 8.0) return 'A';
  if (score >= 6.8) return 'B';
  if (score >= 5.5) return 'C';
  return 'D';
}

export const RATING_PARAMS = [
  { key: 'location', label: 'Location' },
  { key: 'connectivity', label: 'Connectivity' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'amenities', label: 'Amenities' },
  { key: 'safety', label: 'Safety' },
  { key: 'cleanliness', label: 'Cleanliness' },
  { key: 'valueForMoney', label: 'Value for Money' },
  { key: 'parking', label: 'Parking' },
  { key: 'community', label: 'Community' },
  { key: 'noise', label: 'Noise' }
];

export const COMMENT_TAGS = [
  'MAINTENANCE', 'SAFETY', 'PARKING', 'WATER', 'POWER',
  'NOISE', 'AMENITIES', 'LOCATION', 'RENT', 'COMMUNITY'
];

export const LEADERBOARD_TABS = [
  { id: 'overall', label: 'Overall' },
  { id: 'best-value', label: 'Best Value' },
  { id: 'best-amenities', label: 'Best Amenities' },
  { id: 'connectivity', label: 'Best Connectivity' },
  { id: 'safest', label: 'Safest' },
  { id: 'families', label: 'Best for Families' },
  { id: 'professionals', label: 'Best for Professionals' }
];
