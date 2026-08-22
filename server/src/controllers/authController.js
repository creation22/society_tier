const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Rating = require('../models/Rating');
const Comment = require('../models/Comment');
const Vote = require('../models/Vote');
const { signToken } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/error');

function publicUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role
  };
}

exports.signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body || {};
  if (!username || !email || !password) throw new ApiError(400, 'All fields are required');
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
    throw new ApiError(400, 'Username must be 3-24 letters, numbers or underscores');
  }
  if (password.length < 8) throw new ApiError(400, 'Password must be at least 8 characters');

  const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
  if (exists) throw new ApiError(409, 'An account with that email or username already exists');

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ username, email: email.toLowerCase(), passwordHash });
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, 'Invalid credentials');
  }
  if (user.isBanned) throw new ApiError(403, 'Account suspended');

  res.json({ token: signToken(user), user: publicUser(user) });
});

const GUEST_ADJ = ['Quiet', 'Green', 'Solar', 'Central', 'Skyline', 'Urban', 'Civic', 'Prime'];
const GUEST_NOUN = ['Resident', 'Observer', 'Neighbor', 'Local', 'Tenant', 'Insider', 'Scout'];

/** Silent guest session: gives every visitor an identity with zero friction. */
exports.guest = asyncHandler(async (req, res) => {
  const passwordHash = await bcrypt.hash(require('crypto').randomBytes(16).toString('hex'), 8);
  let user;
  for (let attempt = 0; attempt < 5 && !user; attempt += 1) {
    const username = `${GUEST_ADJ[Math.floor(Math.random() * GUEST_ADJ.length)]}${
      GUEST_NOUN[Math.floor(Math.random() * GUEST_NOUN.length)]
    }${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      // eslint-disable-next-line no-await-in-loop
      user = await User.create({
        username,
        email: `${username.toLowerCase()}.${Date.now()}@guest.local`,
        passwordHash,
        isGuest: true
      });
    } catch (err) {
      if (err.code !== 11000) throw err;
    }
  }
  if (!user) throw new ApiError(500, 'Could not create a guest session');
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

exports.getProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) throw new ApiError(404, 'User not found');

  const [ratingCount, reviewCount, helpfulVotes, ratings] = await Promise.all([
    Rating.countDocuments({ userId: user._id }),
    Comment.countDocuments({ userId: user._id }),
    Vote.countDocuments({ commentId: { $in: await Comment.find({ userId: user._id }, '_id') }, voteType: 'up' }),
    Rating.find({ userId: user._id }).sort({ updatedAt: -1 }).limit(10).populate('societyId', 'name slug tier')
  ]);

  const banned = req.user && req.user.role === 'admin';

  res.json({
    user: { username: user.username, avatar: user.avatar, createdAt: user.createdAt },
    isBannedView: banned ? user.isBanned : undefined,
    stats: {
      societiesRated: ratingCount,
      reviews: reviewCount,
      helpfulVotes
    },
    recentRatings: ratings.map((r) => ({
      society: r.societyId && {
        name: r.societyId.name,
        slug: r.societyId.slug,
        tier: r.societyId.tier
      },
      overall: r.overall,
      ratedAt: r.updatedAt
    }))
  });
});
