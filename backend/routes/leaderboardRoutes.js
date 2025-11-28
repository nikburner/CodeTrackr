const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get friend leaderboard
router.get('/friends', leaderboardController.getFriendLeaderboard);

// Refresh leaderboard data for current user
router.post('/refresh', leaderboardController.refreshLeaderboard);

module.exports = router;
