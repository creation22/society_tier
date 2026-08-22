const Society = require('../models/Society');
const { asyncHandler } = require('../middleware/error');

const CATEGORIES = {
  overall: null, // rankingScore (confidence adjusted)
  'best-value': 'valueForMoney',
  'best-amenities': 'amenities',
  connectivity: 'connectivity',
  safest: 'safety',
  families: null,
  professionals: null
};

// Category-specific composite weights. Modular: tweak here without touching DB.
const COMPOSITES = {
  families: { safety: 0.35, amenities: 0.25, community: 0.2, maintenance: 0.2 },
  professionals: { connectivity: 0.4, location: 0.25, parking: 0.15, noise: 0.2 }
};

function compositeScore(society, weights) {
  let total = 0;
  for (const [key, weight] of Object.entries(weights)) {
    total += ((society.categoryScores && society.categoryScores[key]) || society.overallRating || 0) * weight;
  }
  return total;
}

exports.leaderboard = asyncHandler(async (req, res) => {
  const category = req.params.category || req.query.category || 'overall';
  if (!(category in CATEGORIES)) {
    return res.status(400).json({ error: `Unknown category "${category}"` });
  }

  // Rank all societies; the Bayesian prior already discounts low-count ones.
  const societies = await Society.find({ ratingCount: { $gte: 1 } })
    .select('name slug builder sector area tier overallRating rankingScore ratingCount categoryScores')
    .lean();

  const composite = COMPOSITES[category];
  const field = CATEGORIES[category];

  const ranked = societies
    .map((s) => ({
      ...s,
      score:
        composite ? Math.round(compositeScore(s, composite) * 10) / 10 : field ? s.categoryScores[field] ?? 0 : s.rankingScore
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 100);

  res.json({ category, items: ranked });
});
