// routes/heatmapRoutes.js
const express = require('express');
const router = express.Router();
const heatmapController = require('../controllers/heatmapController');

router.get('/heatmap', heatmapController.getCombinedHeatmap);

module.exports = router;