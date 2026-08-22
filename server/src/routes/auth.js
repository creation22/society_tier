const router = require('express').Router();
const c = require('../controllers/authController');
const { optionalAuth, requireAuth } = require('../middleware/auth');

router.post('/guest', c.guest);
router.post('/signup', c.signup);
router.post('/login', c.login);
router.get('/me', requireAuth, c.me);
router.get('/:username', optionalAuth, c.getProfile);

module.exports = router;
