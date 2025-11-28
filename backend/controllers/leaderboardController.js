const leaderboardService = require('../services/leaderboardService');

// Get friend leaderboard
const getFriendLeaderboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const leaderboard = await leaderboardService.getFriendLeaderboard(userId);

    res.json({ success: true, data: leaderboard });
  } catch (error) {
    console.error('Get friend leaderboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Refresh leaderboard data
const refreshLeaderboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const io = req.app.get('io');
    const supabase = require('../supabase/supabaseClient');

    // Get all friends
    const { data: friends } = await supabase
      .from('friends')
      .select('friend_id')
      .eq('user_id', userId)
      .eq('status', 'accepted');

    const friendIds = friends?.map(f => f.friend_id) || [];
    const allUserIds = [userId, ...friendIds];

    // Update data for current user AND all friends (with delays to avoid rate limiting)
    for (let i = 0; i < allUserIds.length; i++) {
      const uid = allUserIds[i];
      try {
        await leaderboardService.updateUserLeaderboardData(uid);
        // Add a 2 second delay between users to avoid CodeForces API rate limiting
        if (i < allUserIds.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (err) {
        console.error(`Failed to update data for user ${uid}:`, err.message);
        // Continue even if one user fails
      }
    }

    // Emit update to current user and all friends
    await leaderboardService.emitLeaderboardUpdate(io, allUserIds);

    res.json({ success: true, message: 'Leaderboard refreshed successfully' });
  } catch (error) {
    console.error('Refresh leaderboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getFriendLeaderboard,
  refreshLeaderboard
};
