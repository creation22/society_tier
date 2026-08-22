const router = require('express').Router();
const leaderboard = require('../controllers/leaderboardController');
const search = require('../controllers/searchController');
const areas = require('../controllers/areaController');
const admin = require('../controllers/adminController');
const aqi = require('../controllers/aqiController');
const { requireAdmin } = require('../middleware/auth');

router.get('/leaderboard', (req, res, next) => {
  req.params.category = req.query.category || 'overall';
  next();
}, leaderboard.leaderboard);
router.get('/leaderboard/:category', leaderboard.leaderboard);

router.get('/search', search.search);

router.get('/areas', areas.areas);
router.get('/areas/:area', areas.areaDetail);

router.get('/aqi', aqi.getAqi);

// Admin
const adminRouter = require('express').Router();
adminRouter.get('/stats', admin.stats);
adminRouter.get('/societies', admin.societies);
adminRouter.get('/users', admin.users);
adminRouter.get('/comments', admin.comments);
adminRouter.get('/ratings', admin.ratings);
adminRouter.get('/reports', admin.reports);
adminRouter.post('/reports/:id/resolve', requireAdmin, admin.resolveReport);
adminRouter.post('/comments/:id/hide', requireAdmin, admin.hideComment);
adminRouter.post('/users/:id/ban', requireAdmin, admin.banUser);
adminRouter.get('/vote-anomalies', requireAdmin, admin.voteAnomalies);
router.use('/admin', requireAdmin, adminRouter);

module.exports = router;
