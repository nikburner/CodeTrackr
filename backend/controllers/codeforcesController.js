const { getUserInfo, getUserRating, getUserSubmissions } = require('../services/codeforcesService');

const getProfile = async (req, res) => {
    try {
      const { handle } = req.params;
      const [userInfo, ratingHistory, submissions] = await Promise.all([
        getUserInfo(handle),
        getUserRating(handle),
        getUserSubmissions(handle)
      ]);
  
      // Process submissions for calendar
      const sixMonthsAgo = Date.now() - 15552000000; // 6 months in milliseconds
      const submissionCalendar = submissions.reduce((acc, submission) => {
        const date = new Date(submission.creationTimeSeconds * 1000);
        if (date > sixMonthsAgo) {
          const key = date.toISOString().split('T')[0];
          acc[key] = (acc[key] || 0) + 1;
        }
        return acc;
      }, {});

      // Calculate total solved problems
      const solvedProblems = new Set();
      submissions.forEach(submission => {
        if (submission.verdict === 'OK') {
          const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
          solvedProblems.add(problemId);
        }
      });
      const totalSolved = solvedProblems.size;

      res.json({
        handle: userInfo.handle,
        rating: userInfo.rating,
        maxRating: userInfo.maxRating,
        rank: userInfo.rank,
        contribution: userInfo.contribution,
        friendOfCount: userInfo.friendOfCount,
        contests: ratingHistory.length,
        totalSolved, // Add total solved problems count
        ratingHistory,
        submissionCalendar,
        recentContests: ratingHistory.slice(-5).reverse()
      });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getContestRating = async (req, res) => {
  try {
    const { handle } = req.params;
    const ratingHistory = await getUserRating(handle);
    
    res.json({
      handle,
      contestCount: ratingHistory.length,
      ratingHistory: ratingHistory.map(contest => ({
        contestId: contest.contestId,
        contestName: contest.contestName,
        rank: contest.rank,
        oldRating: contest.oldRating,
        newRating: contest.newRating,
        ratingChange: contest.newRating - contest.oldRating,
        date: new Date(contest.ratingUpdateTimeSeconds * 1000)
      }))
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getHeatmap = async (req, res) => {
  try {
    const { handle } = req.params;
    const submissions = await getUserSubmissions(handle);

    // Process submissions for the last year
    const oneYearAgo = Date.now() - 31536000000;
    const submissionCalendar = submissions.reduce((acc, submission) => {
      const date = new Date(submission.creationTimeSeconds * 1000);
      if (date > oneYearAgo) {
        const key = date.toISOString().split('T')[0];
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {});

    res.json({
      handle,
      submissionCalendar
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = { getProfile, getContestRating, getHeatmap };