/**
 * Confidence-adjusted ranking algorithm.
 *
 * Raw averages are misleading: a society with a single 10/10 rating should not
 * outrank a society with thousands of ratings at 8.9. We use a Bayesian
 * average ("prior shrinkage") so small sample sizes regress toward the global
 * mean.
 *
 *   rankingScore = (n * avg + PRIOR_WEIGHT * globalMean) / (n + PRIOR_WEIGHT)
 *
 * This module is intentionally isolated: swap the strategy here and the rest
 * of the app (and database) needs no changes.
 */

const Society = require('../models/Society');

const PRIOR_WEIGHT = Number(process.env.RATING_PRIOR_WEIGHT || 60);

let cachedGlobalMean = null;
let cacheExpiresAt = 0;

async function getGlobalMean() {
  const now = Date.now();
  if (cachedGlobalMean !== null && now < cacheExpiresAt) return cachedGlobalMean;

  const result = await RatingModel().aggregate([
    { $group: { _id: null, avg: { $avg: '$overall' } } }
  ]);
  cachedGlobalMean = result.length ? result[0].avg : 7.5;
  cacheExpiresAt = now + 60 * 1000; // 60s cache
  return cachedGlobalMean;
}

// Lazy import to avoid circular dependency issues during model init.
function RatingModel() {
  return require('../models/Rating');
}

function rankingScore(avg, n, globalMean = 7.5) {
  return (n * avg + PRIOR_WEIGHT * globalMean) / (n + PRIOR_WEIGHT);
}

function round1(x) {
  return Math.round(x * 10) / 10;
}

function tierForScore(score) {
  if (score >= 8.8) return 'S';
  if (score >= 8.0) return 'A';
  if (score >= 6.8) return 'B';
  if (score >= 5.5) return 'C';
  return 'D';
}

/**
 * Recompute aggregate scores for one society after its ratings change.
 */
async function recomputeSociety(societyId) {
  const society = await Society.findById(societyId);
  if (!society) return null;

  const globalMean = await getGlobalMean();

  const stats = await RatingModel().aggregate([
    { $match: { societyId: society._id } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        overall: { $avg: '$overall' },
        location: { $avg: '$location' },
        connectivity: { $avg: '$connectivity' },
        maintenance: { $avg: '$maintenance' },
        amenities: { $avg: '$amenities' },
        safety: { $avg: '$safety' },
        cleanliness: { $avg: '$cleanliness' },
        valueForMoney: { $avg: '$valueForMoney' },
        parking: { $avg: '$parking' },
        community: { $avg: '$community' },
        noise: { $avg: '$noise' }
      }
    }
  ]);

  if (!stats.length) {
    society.overallRating = 0;
    society.rankingScore = 0;
    society.ratingCount = 0;
    society.categoryScores = {};
    society.tier = 'B';
    await society.save();
    return society;
  }

  const s = stats[0];
  const score = rankingScore(s.overall, s.count, globalMean);

  const categoryScores = {};
  for (const key of [
    'location',
    'connectivity',
    'maintenance',
    'amenities',
    'safety',
    'cleanliness',
    'valueForMoney',
    'parking',
    'community',
    'noise'
  ]) {
    categoryScores[key] = round1(s[key]);
  }

  society.overallRating = round1(s.overall);
  society.ratingCount = s.count;
  society.rankingScore = round1(score);
  society.categoryScores = categoryScores;
  society.tier = tierForScore(score);

  // Invalidate the global mean cache since totals changed.
  cachedGlobalMean = null;
  await society.save();
  return society;
}

/** Recompute every society (used by seed / admin tools). */
async function recomputeAll() {
  const societies = await Society.find({}, '_id');
  for (const s of societies) {
    await recomputeSociety(s._id);
  }
}

module.exports = { recomputeSociety, recomputeAll, rankingScore, round1, tierForScore, PRIOR_WEIGHT };
