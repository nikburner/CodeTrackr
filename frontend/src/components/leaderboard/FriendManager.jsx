import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserAuth } from '../../context/AuthContext';

const FriendManager = () => {
  const { session } = UserAuth();
  const token = session?.access_token;
  const [friends, setFriends] = useState([]);
  const [searchHandle, setSearchHandle] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/friends`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setFriends(response.data.data);
      }
    } catch (error) {
      console.error('Fetch friends error:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchHandle.trim()) {
      setMessage({ type: 'error', text: 'Please enter a CodeForces handle' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.get(
        `${backendUrl}/api/friends/search/${searchHandle}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSearchResults(response.data.data);
        if (response.data.data.length === 0) {
          setMessage({ type: 'info', text: 'No users found with that handle' });
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessage({ type: 'error', text: 'Failed to search users' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/friends/add`,
        { friendId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Friend added successfully!' });
        fetchFriends();
        setSearchResults([]);
        setSearchHandle('');
      }
    } catch (error) {
      console.error('Add friend error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to add friend'
      });
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!confirm('Are you sure you want to remove this friend?')) {
      return;
    }

    try {
      const response = await axios.delete(`${backendUrl}/api/friends/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Friend removed successfully' });
        fetchFriends();
      }
    } catch (error) {
      console.error('Remove friend error:', error);
      setMessage({ type: 'error', text: 'Failed to remove friend' });
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Manage Friends</h2>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : message.type === 'error'
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">Add Friend</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by CodeForces handle..."
            value={searchHandle}
            onChange={(e) => setSearchHandle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-4 border border-gray-700 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-400 px-4 py-2 bg-gray-900/50">
              Search Results
            </h4>
            <div className="divide-y divide-gray-200">
              {searchResults.map((user) => (
                <div
                  key={user.user_id}
                  className="px-4 py-3 flex justify-between items-center hover:bg-gray-900/50"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-sm text-gray-500">@{user.codeforces_username}</p>
                  </div>
                  <button
                    onClick={() => handleAddFriend(user.user_id)}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-3">
          Your Friends ({friends.length})
        </h3>

        {friends.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No friends added yet.</p>
            <p className="text-sm mt-2">Search for users to add them as friends!</p>
          </div>
        ) : (
          <div className="border border-gray-700 rounded-lg divide-y divide-gray-200">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="px-4 py-3 flex justify-between items-center hover:bg-gray-900/50"
              >
                <div>
                  <p className="text-sm font-medium text-white">{friend.name}</p>
                  <p className="text-sm text-gray-500">
                    {friend.codeforces_username ? (
                      <a
                        href={`https://codeforces.com/profile/${friend.codeforces_username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        @{friend.codeforces_username}
                      </a>
                    ) : (
                      'No CodeForces handle'
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFriend(friend.id)}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendManager;
