const Society = require('../models/Society');
const { asyncHandler } = require('../middleware/error');

/** Area cards for the homepage + /api/areas. */
exports.areas = asyncHandler(async (_req, res) => {
  const areas = await Society.aggregate([
    {
      $group: {
        _id: '$area',
        count: { $sum: 1 },
        avgRating: { $avg: '$overallRating' },
        topSociety: { $first: '$name' },
        topSlug: { $first: '$slug' }
      }
    },
    { $match: { _id: { $ne: null } } },
    { $sort: { count: -1 } }
  ]);

  res.json({
    items: areas.map((a) => ({
      name: a._id,
      count: a.count,
      avgRating: Math.round(a.avgRating * 10) / 10,
      topSociety: a.topSociety,
      topSlug: a.topSlug
    }))
  });
});

exports.areaDetail = asyncHandler(async (req, res) => {
  const name = decodeURIComponent(req.params.area);
  const societies = await Society.find({ area: name })
    .select('name slug builder sector tier overallRating rankingScore ratingCount image')
    .sort({ rankingScore: -1 })
    .lean();

  if (!societies.length) return res.status(404).json({ error: 'Area not found' });

  res.json({
    area: name,
    count: societies.length,
    items: societies.map((s, i) => ({ ...s, rank: i + 1 }))
  });
});
