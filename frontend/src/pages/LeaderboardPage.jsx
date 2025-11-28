import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserAuth } from '../context/AuthContext';
import Header from '../components/Header';
import {
  initializeSocket,
  connectSocket,
  disconnectSocket,
  joinLeaderboardRoom,
  onLeaderboardUpdate,
  offLeaderboardUpdate
} from '../services/socket';
import FriendLeaderboard from '../components/leaderboard/FriendLeaderboard';
import FriendManager from '../components/leaderboard/FriendManager';

const LeaderboardPage = () => {
  const { session } = UserAuth();
  const token = session?.access_token;
  const user = session?.user;
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    // Initialize socket
    const socket = initializeSocket();
    connectSocket();

    if (user?.id) {
      joinLeaderboardRoom(user.id);
    }

    // Setup real-time listener
    onLeaderboardUpdate((data) => {
      console.log('Leaderboard update received:', data);
      setLeaderboardData(data);
    });

    // Fetch initial leaderboard data
    fetchLeaderboard();

    // Cleanup
    return () => {
      offLeaderboardUpdate();
      disconnectSocket();
    };
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${backendUrl}/api/leaderboard/friends`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setLeaderboardData(response.data.data);
      }
    } catch (err) {
      console.error('Fetch leaderboard error:', err);
      setError(err.response?.data?.error || 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const response = await axios.post(
        `${backendUrl}/api/leaderboard/refresh`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Data will be updated via socket
        console.log('Leaderboard refresh triggered');
      }
    } catch (err) {
      console.error('Refresh error:', err);
      setError(err.response?.data?.error || 'Failed to refresh leaderboard');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              CodeForces Friend Leaderboard
            </h1>
            <p className="text-gray-400">
              Compete with your friends and track rankings in real-time
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="mb-6">
            <div className="border-b border-gray-700">
              <nav className="flex -mb-px space-x-8">
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'leaderboard'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                  }`}
                >
                  Leaderboard
                </button>
                <button
                  onClick={() => setActiveTab('friends')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'friends'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                  }`}
                >
                  Manage Friends
                </button>
              </nav>
            </div>
          </div>

          {loading ? (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl p-12 text-center border border-gray-700">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-300">Loading leaderboard...</p>
            </div>
          ) : (
            <div>
              {activeTab === 'leaderboard' && (
                <FriendLeaderboard
                  leaderboardData={leaderboardData}
                  onRefresh={handleRefresh}
                  refreshing={refreshing}
                />
              )}
              {activeTab === 'friends' && <FriendManager />}
            </div>
          )}

          <div className="mt-8 bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">How it works:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>1. Add friends by searching their CodeForces handle</li>
              <li>2. Click "Refresh" to update rankings from CodeForces</li>
              <li>3. Rankings update automatically when anyone refreshes</li>
              <li>4. Compare ratings, problems solved, and contest performance</li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
