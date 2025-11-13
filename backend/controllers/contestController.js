// controllers/contestController.js
const { getCodeforcesContests} = require('../services/codeforcesService');
const {getCodeChefContests} = require('../services/codechefService');
const leetcodeService = require('../services/leetcodeService');

const getUpcomingContests = async (req, res) => {
    try {
      const [codeforces, codechef, leetcode] = await Promise.all([
        getCodeforcesContests(),
        getCodeChefContests(),
        leetcodeService.getLeetCodeContests()
      ]);
  
      const allContests = [
        ...codeforces,
        ...codechef,
        ...leetcode
      ].sort((a, b) => a.startTime - b.startTime);
  
      res.json({
        success: true,
        count: allContests.length,
        contests: allContests
      });
      
    } catch (error) {
      console.error('Controller Error:', error.message);
      res.status(500).json({
        success: false,
        error: error.message || 'Server error'
      });
    }
  };

module.exports = {getUpcomingContests};