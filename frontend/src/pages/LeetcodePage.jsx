import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LeetCodeStats from '../components/LeetCodeStats';
import Header from '../components/Header';
import { useUserProfile } from '../context/UserProfileContext';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const NoUserNameFound = ({ service = "LeetCode", redirectPath = "/profile" }) => {
  const navigate = useNavigate();
  
  const handleGoToProfile = () => {
    navigate(redirectPath);
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-4 px-4 text-center">
      {/* Sad face icon circle */}
      <div className="bg-gray-700 rounded-full p-6 mb-6">
        <svg 
          className="w-12 h-12 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path 
            strokeLinecap="round" 
            strokeWidth="2" 
            d="M9 15c.83.67 1.94 1 3 1s2.17-.33 3-1" 
          />
          <circle cx="9" cy="9" r="1.5" />
          <circle cx="15" cy="9" r="1.5" />
        </svg>
      </div>
      
      {/* Message text */}
      <h2 className="text-xl font-bold text-white mb-4">
        No {service} Username Found
      </h2>
      <p className="text-gray-400 mb-8">
        Please add your {service} username to your profile to view your statistics.
      </p>
      
      {/* Action button */}
      <button 
        onClick={handleGoToProfile}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors w-64"
      >
        Go to Profile
      </button>
    </div>
  );
};

const LeetcodePage = () => {
  const { profileData, error: profileError } = useUserProfile();
  const [username, setUsername] = useState(null);
  const { session, loading: authLoading } = UserAuth();
  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  // Function to upsert LeetCode data with null values
  const upsertLeetCodeData = async () => {
    try {
      if (!session) return;

      // Prepare contest ranking data with null values
      const contestRankingData = {
        leetcode_recent_contest_rating: null,
        leetcode_max_contest_rating: null,
      };

      // Prepare total questions data with null values
      const totalQuestionsData = {
        leetcode_easy: null,
        leetcode_medium: null,
        leetcode_hard: null,
        leetcode_total: null,
      };

      // Upsert both data sets
      const upsertPromises = [
        fetch(`${API_BASE}/api/dashboard/${session.user.id}/contest-ranking`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(contestRankingData)
        }),
        fetch(`${API_BASE}/api/dashboard/${session.user.id}/total-questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(totalQuestionsData)
        })
      ];

      await Promise.all(upsertPromises);
    } catch (err) {
      console.error('Error upserting LeetCode data:', err);
    }
  };

  useEffect(() => {
    if (profileData) {
      if (profileData.leetcode_username) {
        setUsername(profileData.leetcode_username);
      } else if (session) {
        upsertLeetCodeData();
      }
    }
  }, [profileData, session]);

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        <p>Error loading profile: {profileError}</p>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          layout
          className="mb-8 max-w-4xl mx-auto p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-blue-400 mb-4">LeetCode Stats</h2>
          {username ? (
            <LeetCodeStats username={username} />
          ) : (
            <NoUserNameFound service="LeetCode" redirectPath="/profile" />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default LeetcodePage;