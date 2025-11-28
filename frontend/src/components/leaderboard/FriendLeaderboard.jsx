import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendLeaderboard = ({ leaderboardData, onRefresh, refreshing }) => {
  const getRankColor = (rankTitle) => {
    const colors = {
      'legendary grandmaster': 'text-red-600 font-bold',
      'international grandmaster': 'text-red-500',
      'grandmaster': 'text-red-400',
      'international master': 'text-orange-500',
      'master': 'text-orange-400',
      'candidate master': 'text-purple-500',
      'expert': 'text-blue-500',
      'specialist': 'text-cyan-500',
      'pupil': 'text-green-500',
      'newbie': 'text-gray-500',
      'unrated': 'text-gray-400'
    };

    return colors[rankTitle?.toLowerCase()] || 'text-gray-400';
  };

  const getRatingChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (!leaderboardData || leaderboardData.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Friend Leaderboard</h2>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 transition-colors"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <div className="text-center py-8 text-gray-400">
          <p className="text-lg">No leaderboard data available.</p>
          <p className="text-sm mt-2">Add friends and refresh to see rankings!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Friend Leaderboard</h2>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 transition-colors"
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Handle
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Max Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Solved
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Contests
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Week Change
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Last Active
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800/30 divide-y divide-gray-700">
            {leaderboardData.map((entry) => (
              <tr
                key={entry.user_id}
                className={`hover:bg-gray-700/50 transition-colors ${
                  entry.is_current_user ? 'bg-blue-900/30' : ''
                }`}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {entry.rank === 1 && <span className="text-2xl mr-2">🥇</span>}
                    {entry.rank === 2 && <span className="text-2xl mr-2">🥈</span>}
                    {entry.rank === 3 && <span className="text-2xl mr-2">🥉</span>}
                    <span className="text-sm font-semibold text-white">
                      #{entry.rank}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">
                    {entry.name}
                    {entry.is_current_user && (
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">{entry.email}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <a
                    href={`https://codeforces.com/profile/${entry.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {entry.handle}
                  </a>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className={`text-sm font-semibold ${getRankColor(entry.rank_title)}`}>
                    {entry.current_rating}
                  </div>
                  <div className="text-xs text-gray-500">{entry.rank_title}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{entry.max_rating}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{entry.total_solved}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{entry.contests_count}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${getRatingChangeColor(entry.rating_change_week)}`}>
                    {entry.rating_change_week > 0 ? '+' : ''}
                    {entry.rating_change_week}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-400">
                    {formatDate(entry.last_contest_date)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-400 text-center">
        <p>Real-time updates enabled • Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default FriendLeaderboard;
