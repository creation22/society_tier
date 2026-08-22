const Society = require('../models/Society');
const { asyncHandler } = require('../middleware/error');

/**
 * Global autocomplete search: societies by name, plus sector / area /
 * builder "group" results.
 */
exports.search = asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json({ query: '', societies: [], groups: [] });

  const escapeRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rx = new RegExp(escapeRx(q), 'i');

  const societies = await Society.find({
    $or: [{ name: rx }, { builder: rx }]
  })
    .select('name slug tier overallRating ratingCount sector area image')
    .sort({ rankingScore: -1 })
    .limit(8)
    .lean();

  const sectors = await Society.distinct('sector', { sector: rx });
  const areas = await Society.distinct('area', { area: rx });

  const groups = [
    ...sectors.slice(0, 3).map((sector) => ({ type: 'sector', label: `Societies in ${sector}`, value: sector })),
    ...areas.slice(0, 3).map((area) => ({ type: 'area', label: area, value: area }))
  ];

  res.json({ query: q, societies, groups });
});
