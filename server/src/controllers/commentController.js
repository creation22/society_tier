const Comment = require('../models/Comment');
const Vote = require('../models/Vote');
const Society = require('../models/Society');
const Report = require('../models/Report');
const { asyncHandler, ApiError } = require('../middleware/error');
const { paginate } = require('../utils/helpers');

const VALID_TAGS = [
  'MAINTENANCE', 'SAFETY', 'PARKING', 'WATER', 'POWER',
  'NOISE', 'AMENITIES', 'LOCATION', 'RENT', 'COMMUNITY'
];

const SORTS = {
  top: { upvotes: -1, createdAt: -1 },
  new: { createdAt: -1 },
  controversial: null // computed in memory
};

/**
 * Build a threaded tree from flat comments.
 */
function buildTree(comments) {
  const byId = new Map();
  const roots = [];
  for (const c of comments) {
    c.replies = [];
    byId.set(String(c._id), c);
  }
  for (const c of comments) {
    if (c.parentCommentId && byId.has(String(c.parentCommentId))) {
      byId.get(String(c.parentCommentId)).replies.push(c);
    } else {
      roots.push(c);
    }
  }
  return roots;
}

exports.list = asyncHandler(async (req, res) => {
  const society = await Society.findOne({ slug: req.params.slug });
  if (!society) throw new ApiError(404, 'Society not found');

  const sort = req.query.sort || 'top';
  const { page, limit, skip } = paginate(req.query, { page: 1, limit: 20 });

  let comments;
  if (sort === 'controversial') {
    // High engagement + split votes => controversial.
    comments = await Comment.find({ societyId: society._id, parentCommentId: null })
      .populate('userId', 'username avatar')
      .lean();
    comments.sort((a, b) => {
      const score = (c) => Math.min(c.upvotes, c.downvotes) / Math.max(1, c.upvotes + c.downvotes);
      return score(b) - score(a) || b.upvotes + b.downvotes - (a.upvotes + a.downvotes);
    });
    comments = comments.slice(skip, skip + limit);
  } else {
    comments = await Comment.find({ societyId: society._id, parentCommentId: null })
      .sort(SORTS[sort] || SORTS.top)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username avatar')
      .lean();
  }

  // Attach one level of threaded replies (replies to replies are flattened
  // into their parent thread with indentation handled client-side).
  const rootIds = comments.map((c) => c._id);
  const replies =
    rootIds.length &&
    (await Comment.find({ parentCommentId: { $in: rootIds } })
      .sort('createdAt')
      .populate('userId', 'username avatar')
      .lean());

  const tree = buildTree([...comments, ...(replies || [])]);
  const total = await Comment.countDocuments({ societyId: society._id });

  res.json({ items: tree, total, page, pages: Math.ceil(total / limit) || 1 });
});

exports.create = asyncHandler(async (req, res) => {
  const society = await Society.findOne({ slug: req.params.slug });
  if (!society) throw new ApiError(404, 'Society not found');

  const { body, parentCommentId, tags } = req.body || {};
  if (!body || !body.trim()) throw new ApiError(400, 'Comment body is required');

  let parent = null;
  if (parentCommentId) {
    parent = await Comment.findOne({
      _id: parentCommentId,
      societyId: society._id,
      parentCommentId: null // only allow one nesting level for clarity
    });
    if (!parent) throw new ApiError(400, 'Invalid parent comment');
  }

  const cleanTags = Array.isArray(tags)
    ? tags.filter((t) => VALID_TAGS.includes(t)).slice(0, 3)
    : [];

  const comment = await Comment.create({
    userId: req.user._id,
    societyId: society._id,
    parentCommentId: parent ? parent._id : null,
    body: body.trim(),
    tags: cleanTags
  });

  res.status(201).json({ comment: { ...comment.toObject(), userId: { username: req.user.username } , replies: [] } });
});

exports.vote = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new ApiError(404, 'Comment not found');

  const voteType = req.body.voteType;
  if (!['up', 'down'].includes(voteType)) throw new ApiError(400, 'voteType must be "up" or "down"');

  const existing = await Vote.findOne({ userId: req.user._id, commentId: comment._id });

  if (existing && existing.voteType === voteType) {
    // Toggle off.
    await existing.deleteOne();
    if (voteType === 'up') comment.upvotes -= 1;
    else comment.downvotes -= 1;
  } else if (existing) {
    // Switch direction.
    existing.voteType = voteType;
    await existing.save();
    if (voteType === 'up') {
      comment.upvotes += 1;
      comment.downvotes = Math.max(0, comment.downvotes - 1);
    } else {
      comment.downvotes += 1;
      comment.upvotes = Math.max(0, comment.upvotes - 1);
    }
  } else {
    await Vote.create({ userId: req.user._id, commentId: comment._id, voteType });
    if (voteType === 'up') comment.upvotes += 1;
    else comment.downvotes += 1;
  }

  await comment.save();
  res.json({ upvotes: comment.upvotes, downvotes: comment.downvotes });
});

exports.report = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new ApiError(404, 'Comment not found');

  await Report.create({
    reporterId: req.user._id,
    commentId: comment._id,
    reason: String(req.body.reason || '').slice(0, 500)
  });
  res.status(201).json({ ok: true });
});
