/** Tier thresholds are based on the confidence-adjusted ranking score. */
const TIER_THRESHOLDS = [
  { tier: 'S', min: 8.8 },
  { tier: 'A', min: 8.0 },
  { tier: 'B', min: 6.8 },
  { tier: 'C', min: 5.5 },
  { tier: 'D', min: -Infinity }
];

function tierForScore(score) {
  for (const t of TIER_THRESHOLDS) {
    if (score >= t.min) return t.tier;
  }
  return 'D';
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

function paginate(query, defaults = { page: 1, limit: 20 }) {
  const page = Math.max(1, parseInt(query.page, 10) || defaults.page);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || defaults.limit));
  return { page, limit, skip: (page - 1) * limit };
}

module.exports = { tierForScore, TIER_THRESHOLDS, slugify, paginate };
