const supabase = require('../supabase/supabaseClient');
const codeforcesService = require('./codeforcesService');

// Update user's leaderboard cache data
const updateUserLeaderboardData = async (userId) => {
  try {
    // Get user's codeforces username from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('codeforces_username')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile?.codeforces_username) {
      throw new Error('CodeForces username not found for user');
    }

    const handle = profile.codeforces_username;
    console.log(`Fetching CodeForces data for user ${userId}, handle: ${handle}`);

    // Fetch data from CodeForces API
    let userInfo, userRating, userSubmissions;

    try {
      const results = await Promise.allSettled([
        codeforcesService.getUserInfo(handle),
        codeforcesService.getUserRating(handle),
        codeforcesService.getUserSubmissions(handle)
      ]);

      userInfo = results[0].status === 'fulfilled' ? results[0].value : null;
      userRating = results[1].status === 'fulfilled' ? results[1].value : [];
      userSubmissions = results[2].status === 'fulfilled' ? results[2].value : [];

      if (!userInfo) {
        throw new Error('Failed to fetch user info - user may not exist');
      }
    } catch (err) {
      throw new Error(`CodeForces API error: ${err.message}`);
    }

    // Calculate total solved problems
    const solvedProblems = new Set();
    if (userSubmissions && userSubmissions.length > 0) {
      userSubmissions.forEach(submission => {
        if (submission.verdict === 'OK') {
          const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
          solvedProblems.add(problemId);
        }
      });
    }

    const totalSolved = solvedProblems.size;
    const currentRating = userInfo.rating || 0;
    const maxRating = userInfo.maxRating || 0;
    const rank = userInfo.rank || 'unrated';
    const contestsCount = userRating.length;

    // Get last contest date
    let lastContestDate = null;
    if (userRating.length > 0) {
      const sortedRatings = [...userRating].sort((a, b) => b.ratingUpdateTimeSeconds - a.ratingUpdateTimeSeconds);
      lastContestDate = new Date(sortedRatings[0].ratingUpdateTimeSeconds * 1000);
    }

    // Calculate rating change in last week
    const oneWeekAgo = Date.now() / 1000 - (7 * 24 * 60 * 60);
    const recentContests = userRating.filter(r => r.ratingUpdateTimeSeconds >= oneWeekAgo);
    let ratingChangeWeek = 0;
    if (recentContests.length > 0) {
      const oldestRecent = recentContests.reduce((prev, curr) =>
        prev.ratingUpdateTimeSeconds < curr.ratingUpdateTimeSeconds ? prev : curr
      );
      ratingChangeWeek = currentRating - oldestRecent.oldRating;
    }

    // Upsert to leaderboard cache
    const { data, error } = await supabase
      .from('codeforces_leaderboard_cache')
      .upsert({
        user_id: userId,
        handle,
        current_rating: currentRating,
        max_rating: maxRating,
        rank,
        total_solved: totalSolved,
        contests_count: contestsCount,
        last_contest_date: lastContestDate,
        rating_change_week: ratingChangeWeek,
        last_updated: new Date()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Update leaderboard data error:', error);
    throw error;
  }
};

// Get friend leaderboard with rankings
const getFriendLeaderboard = async (userId) => {
  try {
    // Get all friends
    const { data: friends, error: friendsError } = await supabase
      .from('friends')
      .select('friend_id')
      .eq('user_id', userId)
      .eq('status', 'accepted');

    if (friendsError) throw friendsError;

    const friendIds = friends.map(f => f.friend_id);

    // Include current user in leaderboard
    const allUserIds = [userId, ...friendIds];

    if (allUserIds.length === 0) {
      return [];
    }

    // Get leaderboard cache data
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from('codeforces_leaderboard_cache')
      .select('*')
      .in('user_id', allUserIds)
      .order('current_rating', { ascending: false });

    if (leaderboardError) throw leaderboardError;

    // Get profiles for names and emails
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, name, email')
      .in('user_id', allUserIds);

    if (profilesError) throw profilesError;

    // Combine data with rankings
    const leaderboard = leaderboardData.map((entry, index) => {
      const profile = profiles.find(p => p.user_id === entry.user_id);

      return {
        rank: index + 1,
        user_id: entry.user_id,
        name: profile?.name || 'Unknown',
        email: profile?.email || '',
        handle: entry.handle,
        current_rating: entry.current_rating,
        max_rating: entry.max_rating,
        rank_title: entry.rank,
        total_solved: entry.total_solved,
        contests_count: entry.contests_count,
        last_contest_date: entry.last_contest_date,
        rating_change_week: entry.rating_change_week,
        last_updated: entry.last_updated,
        is_current_user: entry.user_id === userId
      };
    });

    return leaderboard;
  } catch (error) {
    console.error('Get friend leaderboard error:', error);
    throw error;
  }
};

// Emit leaderboard update to all affected users
const emitLeaderboardUpdate = async (io, affectedUserIds) => {
  try {
    for (const userId of affectedUserIds) {
      const leaderboard = await getFriendLeaderboard(userId);
      io.to(`leaderboard_${userId}`).emit('leaderboard_update', leaderboard);
    }
  } catch (error) {
    console.error('Emit leaderboard update error:', error);
  }
};

module.exports = {
  updateUserLeaderboardData,
  getFriendLeaderboard,
  emitLeaderboardUpdate
};
