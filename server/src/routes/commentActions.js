const router = require('express').Router();
const c = require('../controllers/commentController');
const { requireAuth } = require('../middleware/auth');

// POST /api/comments/:id/vote
router.post('/:id/vote', requireAuth, c.vote);
// POST /api/comments/:id/report
router.post('/:id/report', requireAuth, c.report);

module.exports = router;
