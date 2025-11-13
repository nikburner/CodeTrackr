const express = require('express');
const leetcodeController = require('../controllers/leetcodeController');

const router = express.Router();

router.get('/stats/:username', leetcodeController.getUserStats);
router.get('/contest-rating/:username', leetcodeController.getContestRating);
router.get('/heatmap/:username', leetcodeController.getHeatmap);
router.get('questions/:username', leetcodeController.getUserProblemsSolved);

module.exports = router;