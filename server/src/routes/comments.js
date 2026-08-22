const router = require('express').Router({ mergeParams: true });
const c = require('../controllers/commentController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/error');

// Vote/report endpoints live at /api/comments/:id/* (see api.js), so this
// router only handles the nested collection under a society slug.
router.get('/', optionalAuth, asyncHandler(async (req, res) => c.list(req, res)));
router.post('/', requireAuth, asyncHandler(async (req, res) => c.create(req, res)));

module.exports = router;
