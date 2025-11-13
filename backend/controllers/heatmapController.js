// controllers/heatmapController.js
const combinedService = require('../services/combinedService');

exports.getCombinedHeatmap = async (req, res) => {
  try {
    const heatmap = await combinedService.getCombinedHeatmap({
      leetcode: req.query.leetcode,
      codeforces: req.query.codeforces,
      codechef: req.query.codechef
    });
    res.json(heatmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};