const express = require('express');
const router = express.Router();
const codechefController = require('../controllers/codechefController');

router.get('/profile/:username/heatmap', codechefController.getSubmissionHeatmap);

router.get('/profile/:username/contests', codechefController.getContestGraph);

router.get('/profile/:username', codechefController.getAnalysis);

router.get('/profile/:username/questions', codechefController.getTotalProblemsSolved);

module.exports = router;