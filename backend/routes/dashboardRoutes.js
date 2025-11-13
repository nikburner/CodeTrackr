const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware')


// Contest Ranking Info Routes
router.post('/:id/contest-ranking', authMiddleware, DashboardController.updateContestRankingInfo);

// Total Questions Routes
router.post('/:id/total-questions',authMiddleware, DashboardController.updateTotalQuestions);

// Combined Data Route
router.get('/:id', authMiddleware,DashboardController.getDashboardData);

module.exports = router;