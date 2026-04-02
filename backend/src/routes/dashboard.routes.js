const express = require('express');
const { summary, categoryBreakdown, trends, recentActivity } = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// All dashboard routes are available to any authenticated user
router.use(protect);

router.get('/summary', summary);
router.get('/category-breakdown', categoryBreakdown);
router.get('/trends', trends);
router.get('/recent', recentActivity);

module.exports = router;
