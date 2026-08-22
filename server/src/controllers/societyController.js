const Society = require('../models/Society');
const { asyncHandler, ApiError } = require('../middleware/error');
const { slugify, paginate } = require('../utils/helpers');

// Fields safe to expose publicly.
const PUBLIC_FIELDS =
  'name slug builder sector area address latitude longitude description image pricePerSqft bhkOptions overallRating rankingScore ratingCount categoryScores tier createdAt updatedAt';

exports.list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};

  if (req.query.tier) {
    const tiers = String(req.query.tier).split(',').filter(Boolean);
    filter.tier = { $in: tiers };
  }
  if (req.query.area) filter.area = req.query.area;
  if (req.query.sector) filter.sector = new RegExp(String(req.query.sector).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (req.query.minRating) filter.overallRating = { $gte: Number(req.query.minRating) };
  if (req.query.maxPrice) filter.pricePerSqft = { $lte: Number(req.query.maxPrice) };
  if (req.query.bhk) filter.bhkOptions = Number(req.query.bhk);
  if (req.query.q) {
    const rx = new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { sector: rx }, { builder: rx }, { area: rx }];
  }

  let sort = { rankingScore: -1, ratingCount: -1 };
  switch (req.query.sort) {
    case 'rating':
      sort = { overallRating: -1, ratingCount: -1 };
      break;
    case 'popular':
      sort = { ratingCount: -1 };
      break;
    case 'name':
      sort = { name: 1 };
      break;
    case 'newest':
      sort = { createdAt: -1 };
      break;
    default:
      break;
  }

  const [items, total] = await Promise.all([
    Society.find(filter).select(PUBLIC_FIELDS).sort(sort).skip(skip).limit(limit).lean(),
    Society.countDocuments(filter)
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) || 1 });
});

exports.getBySlug = asyncHandler(async (req, res) => {
  const society = await Society.findOne({ slug: req.params.slug }).select(PUBLIC_FIELDS).lean();
  if (!society) throw new ApiError(404, 'Society not found');

  // Neighbouring societies in the same sector for "similar" rail.
  const similar = await Society.find({
    _id: { $ne: society._id },
    $or: [{ sector: society.sector }, { area: society.area }]
  })
    .select('name slug tier overallRating ratingCount')
    .sort({ rankingScore: -1 })
    .limit(4)
    .lean();

  res.json({ society, similar });
});

exports.create = asyncHandler(async (req, res) => {
  const body = req.body || {};
  for (const field of ['name', 'latitude', 'longitude']) {
    if (body[field] === undefined) throw new ApiError(400, `Field "${field}" is required`);
  }

  let slug = slugify(body.slug || body.name);
  if (await Society.exists({ slug })) slug = `${slug}-${Date.now().toString(36)}`;

  const society = await Society.create({ ...body, name: body.name.trim(), slug });
  res.status(201).json({ society });
});

exports.update = asyncHandler(async (req, res) => {
  const allowed = [
    'name', 'builder', 'sector', 'area', 'address', 'latitude', 'longitude',
    'description', 'image', 'pricePerSqft', 'bhkOptions'
  ];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  if (!Object.keys(updates).length) throw new ApiError(400, 'No valid fields to update');

  const society = await Society.findById(req.params.id);
  if (!society) throw new ApiError(404, 'Society not found');
  Object.assign(society, updates);
  await society.save();
  res.json({ society });
});

exports.remove = asyncHandler(async (req, res) => {
  const society = await Society.findByIdAndDelete(req.params.id);
  if (!society) throw new ApiError(404, 'Society not found');
  // Cascade cleanup of dependent docs.
  const Rating = require('../models/Rating');
  const Comment = require('../models/Comment');
  await Promise.all([Rating.deleteMany({ societyId: society._id }), Comment.deleteMany({ societyId: society._id })]);
  res.json({ ok: true });
});
