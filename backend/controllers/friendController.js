const supabase = require('../supabase/supabaseClient');

// Add friend
const addFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({ success: false, error: 'Friend ID is required' });
    }

    if (userId === friendId) {
      return res.status(400).json({ success: false, error: 'Cannot add yourself as a friend' });
    }

    // Check if friendship already exists
    const { data: existing } = await supabase
      .from('friends')
      .select('*')
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
      .single();

    if (existing) {
      return res.status(400).json({ success: false, error: 'Friendship already exists' });
    }

    // Add friendship (both directions for easier querying)
    const { data, error } = await supabase
      .from('friends')
      .insert([
        { user_id: userId, friend_id: friendId, status: 'accepted' },
        { user_id: friendId, friend_id: userId, status: 'accepted' }
      ])
      .select();

    if (error) throw error;

    res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all friends
const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get friend relationships
    const { data: friendships, error } = await supabase
      .from('friends')
      .select('friend_id, status, created_at')
      .eq('user_id', userId)
      .eq('status', 'accepted');

    if (error) throw error;

    if (!friendships || friendships.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const friendIds = friendships.map(f => f.friend_id);

    // Get profiles for friends
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, name, email, codeforces_username')
      .in('user_id', friendIds);

    if (profileError) throw profileError;

    // Combine data
    const friendsWithProfiles = friendships.map(friendship => {
      const profile = profiles.find(p => p.user_id === friendship.friend_id);
      return {
        id: friendship.friend_id,
        name: profile?.name || 'Unknown',
        email: profile?.email || '',
        codeforces_username: profile?.codeforces_username,
        created_at: friendship.created_at
      };
    });

    res.json({ success: true, data: friendsWithProfiles });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Remove friend
const removeFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    // Delete both directions
    const { error } = await supabase
      .from('friends')
      .delete()
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);

    if (error) throw error;

    res.json({ success: true, message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Search user by codeforces handle
const searchUserByHandle = async (req, res) => {
  try {
    const { handle } = req.params;
    const userId = req.user.id;

    if (!handle) {
      return res.status(400).json({ success: false, error: 'Handle is required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, name, codeforces_username')
      .ilike('codeforces_username', `%${handle}%`)
      .neq('user_id', userId)
      .limit(10);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Search user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  addFriend,
  getFriends,
  removeFriend,
  searchUserByHandle
};
