const router = require('express').Router();
const c = require('../controllers/ratingController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

router.get('/', c.list);
router.get('/mine', requireAuth, c.myRating);
router.post('/', requireAuth, c.createOrUpdate);
router.use(optionalAuth);

module.exports = router;
