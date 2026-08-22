const router = require('express').Router();
const c = require('../controllers/societyController');
const ratings = require('./ratings');
const comments = require('./comments');
const { requireAdmin } = require('../middleware/auth');

router.get('/', c.list);
router.post('/', requireAdmin, c.create);
router.get('/:slug', c.getBySlug);
router.put('/:id', requireAdmin, c.update);
router.delete('/:id', requireAdmin, c.remove);

// Nested resources keyed by society slug.
router.use('/:slug/ratings', ratings);
router.use('/:slug/comments', comments);

module.exports = router;
