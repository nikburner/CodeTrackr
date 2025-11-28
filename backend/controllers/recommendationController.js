const supabase = require('../supabase/supabaseClient');
const codeforcesService = require('../services/codeforcesService');
const geminiService = require('../services/geminiService');

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's codeforces username
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('codeforces_username')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile?.codeforces_username) {
      return res.status(400).json({
        success: false,
        error: 'CodeForces username not found. Please set it in your profile.'
      });
    }

    const handle = profile.codeforces_username;

    // Fetch user's solve history from CodeForces
    console.log(`Fetching solve history for ${handle}...`);

    let userInfo, userSubmissions, userRating;
    try {
      const results = await Promise.allSettled([
        codeforcesService.getUserInfo(handle),
        codeforcesService.getUserSubmissions(handle),
        codeforcesService.getUserRating(handle)
      ]);

      userInfo = results[0].status === 'fulfilled' ? results[0].value : null;
      userSubmissions = results[1].status === 'fulfilled' ? results[1].value : [];
      userRating = results[2].status === 'fulfilled' ? results[2].value : [];

      if (!userInfo) {
        throw new Error('Failed to fetch user info');
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch CodeForces data. Please try again.'
      });
    }

    // Analyze solve history
    const solvedProblems = new Map();
    const problemDifficulties = {};
    const verdictCounts = {};

    userSubmissions.forEach(submission => {
      const problemId = `${submission.problem.contestId}${submission.problem.index}`;
      const verdict = submission.verdict;

      // Count verdicts
      verdictCounts[verdict] = (verdictCounts[verdict] || 0) + 1;

      // Track solved problems
      if (verdict === 'OK') {
        if (!solvedProblems.has(problemId)) {
          solvedProblems.set(problemId, {
            name: submission.problem.name,
            contestId: submission.problem.contestId,
            index: submission.problem.index,
            rating: submission.problem.rating,
            tags: submission.problem.tags
          });

          // Track difficulty distribution
          const rating = submission.problem.rating || 'unrated';
          problemDifficulties[rating] = (problemDifficulties[rating] || 0) + 1;
        }
      }
    });

    // Prepare data for Gemini
    const solveHistory = {
      handle,
      currentRating: userInfo.rating || 0,
      maxRating: userInfo.maxRating || 0,
      rank: userInfo.rank || 'unrated',
      totalSolved: solvedProblems.size,
      contestsParticipated: userRating.length,
      problemDifficulties,
      verdictCounts,
      recentProblems: Array.from(solvedProblems.values()).slice(-20), // Last 20 solved
      tags: extractTopTags(Array.from(solvedProblems.values()))
    };

    console.log('Sending to Gemini AI for analysis...');

    // Get recommendations from Gemini
    const recommendations = await geminiService.getRecommendations(solveHistory);

    res.json({
      success: true,
      data: {
        ...recommendations,
        stats: {
          currentRating: userInfo.rating || 0,
          maxRating: userInfo.maxRating || 0,
          totalSolved: solvedProblems.size,
          contestsParticipated: userRating.length
        }
      }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate recommendations'
    });
  }
};

// Helper function to extract top tags
const extractTopTags = (problems) => {
  const tagCounts = {};

  problems.forEach(problem => {
    if (problem.tags) {
      problem.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));
};

module.exports = {
  getRecommendations
};
