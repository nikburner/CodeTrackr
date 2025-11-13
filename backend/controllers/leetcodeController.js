const leetcodeService = require('../services/leetcodeService');

class LeetcodeController {
  async getUserStats(req, res, next) {
    try {
      const { username } = req.params;
      const userStats = await leetcodeService.fetchUserComprehensiveData(username);
      if (!userStats) {
        return res.status(404).json({
          success: false,
          message: `No stats found for user: ${username}`
        });
      }
      res.json({
        success: true,
        data: userStats
      });
    } catch (error) {
      next(error);
    }
  }
  async getContestRating(req, res, next) {
    try {
      const { username } = req.params;
      const contestData = await leetcodeService.getUserContestRankingInfo(username);
      
      if (!contestData || !contestData.userContestRanking) {
        return res.status(404).json({
          success: false,
          message: `No contest data found for user: ${username}`
        });
      }
      
      res.json({
        success: true,
        data: {
          contestRanking: contestData.userContestRanking,
          contestHistory: contestData.userContestRankingHistory.filter(
            entry => entry && entry.attended === true
          )
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getHeatmap(req, res, next) {
    try {
      const { username } = req.params;
      const calendarData = await leetcodeService.getUserProfileCalendar(username);
      
      if (!calendarData || !calendarData.matchedUser || !calendarData.matchedUser.userCalendar) {
        return res.status(404).json({
          success: false,
          message: `No heatmap data found for user: ${username}`
        });
      }
      
      let submissionCalendar = {};
      try {
        if (calendarData.matchedUser.userCalendar.submissionCalendar) {
          submissionCalendar = JSON.parse(calendarData.matchedUser.userCalendar.submissionCalendar);
        }
      } catch (e) {
        console.error('Error parsing submission calendar:', e);
      }
      
      res.json({
        success: true,
        data: {
          activeYears: calendarData.matchedUser.userCalendar.activeYears,
          streak: calendarData.matchedUser.userCalendar.streak || 0,
          totalActiveDays: calendarData.matchedUser.userCalendar.totalActiveDays,
          dccBadges: calendarData.matchedUser.userCalendar.dccBadges || [],
          submissionCalendar: submissionCalendar
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserProblemsSolved(req, res) {
    try {
      const { username } = req.params; // or req.query depending on your route setup
      
      if (!username) {
        return res.status(400).json({
          success: false,
          message: 'Username is required'
        });
      }

      const result = await getUserProblemsSolved(username);
      
      if (!result || !result.matchedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found or no data available'
        });
      }

      res.status(200).json({
        success: true,
        data: result
      });
      
    } catch (error) {
      console.error('Error fetching user problems solved:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

}

module.exports = new LeetcodeController();