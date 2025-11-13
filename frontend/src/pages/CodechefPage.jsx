import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeChefStats from '../components/CodechefStats';
import Header from '../components/Header';
import { useUserProfile } from '../context/UserProfileContext';
import { UserAuth } from '../context/AuthContext';

const CodechefPage = () => {
  const { profileData, loading: profileLoading, error: profileError } = useUserProfile();
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const { session } = UserAuth();

  useEffect(() => {
    if (profileData?.codechef_username) {
      setUsername(profileData.codechef_username);
    }
  }, [profileData]);

  const upsertCodeChefData = async (data) => {
    try {
      if (!session) return;

      // Prepare contest ranking data
      const contestRankingData = {
        codechef_stars: data.profileInfo?.stars || 0,
        codechef_recent_contest_rating: data.profileInfo?.rating || 0,
        codechef_max_contest_rating: data.profileInfo?.highestRating || 0,
      };

      // Prepare total questions data
      const totalQuestionsData = {
        codechef_total: data.profileInfo?.problemsSolved || 0,
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
      console.error('Error upserting CodeChef data:', err);
    }
  };

  const upsertCodeforcesDatas = async () => {
    try {
      if (!session) return;

      // Prepare contest ranking data with null values
      const contestRankingData = {
        codechef_recent_contest_rating: null,
        codechef_max_contest_rating: null,
        codechef_stars :null
      };

      // Prepare total questions data with null values
      const totalQuestionsData = {
        codechef_total: null,
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
      console.error('Error upserting Codechef data:', err);
    }
  };

  useEffect(() => {
    if (!username) {
      if (session) {
        upsertCodeforcesDatas();
      }
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/codechef/profile/${username}/?t=${Date.now()}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('User not found on CodeChef');
          } else if (res.status >= 500) {
            throw new Error('Server is currently busy. Please try again later.');
          } else {
            throw new Error(`Failed to fetch CodeChef stats (${res.status})`);
          }
        }
        
        const data = await res.json();
        
        if (!data || Object.keys(data).length === 0) {
          throw new Error('No data found for this user');
        }
        
        setStatsData(data);
        setError(null);
        
        // Update database tables
        if (session) {
          await upsertCodeChefData(data);
        }
      } catch (err) {
        setError(err.message);
        setStatsData(null);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchStats, 300);
    return () => clearTimeout(timer);
  }, [username, session]);

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        <p>Error loading profile: {profileError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-blue-400 mb-4">CodeChef Stats</h2>
          
          {!username ? (
            <div className="text-center p-8">
              <div className="w-20 h-20 mb-6 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3">No CodeChef Username Found</h2>
              <p className="text-gray-300 mb-6">Please add your CodeChef username to your profile.</p>
              <a
                href="/profile"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-block"
              >
                Go to Profile
              </a>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-300">Loading CodeChef stats...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">We encountered an issue</h3>
              <p className="text-gray-300 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <CodeChefStats data={statsData} />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default CodechefPage;