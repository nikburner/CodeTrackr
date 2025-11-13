const express = require('express');
const router = express.Router();
const codeforcesController = require('../controllers/codeforcesController');


router.get('/profile/:handle', codeforcesController.getProfile);
router.get('/rating/:handle', codeforcesController.getContestRating);
router.get('/heatmap/:handle', codeforcesController.getHeatmap);

module.exports = router;