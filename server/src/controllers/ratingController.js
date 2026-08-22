const Rating = require('../models/Rating');
const Society = require('../models/Society');
const { recomputeSociety } = require('../services/ratingService');
const { asyncHandler, ApiError } = require('../middleware/error');
const { paginate } = require('../utils/helpers');

const PARAM_KEYS = [
  'location', 'connectivity', 'maintenance', 'amenities', 'safety',
  'cleanliness', 'valueForMoney', 'parking', 'community', 'noise'
];

function validateRatingBody(body) {
  const values = {};
  for (const key of PARAM_KEYS) {
    const v = Number(body[key]);
    if (!Number.isFinite(v) || v < 1 || v > 10) {
      throw new ApiError(400, `"${key}" must be a number between 1 and 10`);
    }
    values[key] = v;
  }
  // Overall = mean of the ten parameters (spec §21).
  values.overall = Math.round((PARAM_KEYS.reduce((sum, k) => sum + values[k], 0) / PARAM_KEYS.length) * 10) / 10;
  return values;
}

exports.list = asyncHandler(async (req, res) => {
  const society = await Society.findOne({ slug: req.params.slug });
  if (!society) throw new ApiError(404, 'Society not found');

  const { page, limit, skip } = paginate(req.query, { page: 1, limit: 10 });
  const [items, total] = await Promise.all([
    Rating.find({ societyId: society._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username avatar'),
    Rating.countDocuments({ societyId: society._id })
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) || 1 });
});

exports.createOrUpdate = asyncHandler(async (req, res) => {
  const society = await Society.findOne({ slug: req.params.slug });
  if (!society) throw new ApiError(404, 'Society not found');

  const values = validateRatingBody(req.body);

  // One rating per account per society — upsert keeps it idempotent.
  const rating = await Rating.findOneAndUpdate(
    { userId: req.user._id, societyId: society._id },
    { ...values },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  await recomputeSociety(society._id);
  res.status(201).json({
    rating,
    society: {
      slug: society.slug,
      overallRating: society.overallRating,
      rankingScore: society.rankingScore,
      tier: society.tier,
      ratingCount: society.ratingCount
    }
  });
});

exports.myRating = asyncHandler(async (req, res) => {
  const society = await Society.findOne({ slug: req.params.slug });
  if (!society) throw new ApiError(404, 'Society not found');
  const rating = await Rating.findOne({ userId: req.user._id, societyId: society._id });
  res.json({ rating });
});
