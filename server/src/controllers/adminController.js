const User = require('../models/User');
const Comment = require('../models/Comment');
const Report = require('../models/Report');
const Society = require('../models/Society');
const Rating = require('../models/Rating');
const Vote = require('../models/Vote');
const { asyncHandler, ApiError } = require('../middleware/error');

exports.stats = asyncHandler(async (_req, res) => {
  const [societies, users, comments, ratings, openReports] = await Promise.all([
    Society.countDocuments(),
    User.countDocuments(),
    Comment.countDocuments(),
    Rating.countDocuments(),
    Report.countDocuments({ status: 'open' })
  ]);
  res.json({ societies, users, comments, ratings, openReports });
});

exports.societies = asyncHandler(async (_req, res) => {
  const items = await Society.find()
    .select('name slug sector area tier overallRating ratingCount createdAt')
    .sort('-createdAt')
    .limit(200)
    .lean();
  res.json({ items });
});

exports.users = asyncHandler(async (_req, res) => {
  const items = await User.find()
    .select('username email role isBanned createdAt')
    .sort('-createdAt')
    .limit(200)
    .lean();
  res.json({ items });
});

exports.comments = asyncHandler(async (_req, res) => {
  const items = await Comment.find()
    .populate('userId', 'username')
    .populate('societyId', 'name slug')
    .sort('-createdAt')
    .limit(100)
    .lean();
  res.json({ items });
});

exports.ratings = asyncHandler(async (_req, res) => {
  const items = await Rating.find()
    .populate('userId', 'username')
    .populate('societyId', 'name slug')
    .sort('-createdAt')
    .limit(100)
    .lean();
  res.json({ items });
});

exports.reports = asyncHandler(async (_req, res) => {
  const items = await Report.find({ status: 'open' })
    .populate('reporterId', 'username')
    .populate({ path: 'commentId', select: 'body userId societyId upvotes downvotes', populate: { path: 'userId', select: 'username' } })
    .sort('-createdAt')
    .limit(100)
    .lean();
  res.json({ items });
});

exports.resolveReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) throw new ApiError(404, 'Report not found');

  const action = req.body.action; // 'dismiss' | 'delete-comment'
  if (action === 'delete-comment' && report.commentId) {
    const comment = await Comment.findById(report.commentId);
    if (comment) {
      comment.isHidden = true;
      comment.body = '[removed by moderators]';
      await comment.save();
    }
  }
  report.status = 'resolved';
  await report.save();
  res.json({ ok: true });
});

exports.hideComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new ApiError(404, 'Comment not found');
  comment.isHidden = !comment.isHidden;
  if (comment.isHidden) comment.body = '[removed by moderators]';
  await comment.save();
  res.json({ ok: true, isHidden: comment.isHidden });
});

exports.banUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === 'admin') throw new ApiError(400, 'Cannot ban an admin');
  user.isBanned = !user.isBanned;
  await user.save();
  res.json({ ok: true, isBanned: user.isBanned });
});

/** Suspicious voting: same voter hammering many comments of one author. */
exports.voteAnomalies = asyncHandler(async (_req, res) => {
  const anomalies = await Vote.aggregate([
    {
      $group: {
        _id: { userId: '$userId', commentAuthor: null }
      }
    }
  ]);
  // Simpler practical heuristic: voters with > 40 votes in the last hour.
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const burst = await Vote.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: '$userId', votes: { $sum: 1 } } },
    { $match: { votes: { $gt: 40 } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { username: '$user.username', votes: 1 } }
  ]);
  res.json({ items: burst, note: anomalies.length ? undefined : 'no data' });
});
