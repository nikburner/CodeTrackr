import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProfileCard from '../components/codeforces/ProfileCard';
import RatingChart from '../components/codeforces/RatingChart';
import RecentContests from '../components/codeforces/RecentContests';
import CalendarHeatmap from '../components/codeforces/CalendarHeatmap';
import Header from '../components/Header';
import { useUserProfile } from '../context/UserProfileContext';
import { UserAuth } from '../context/AuthContext';

const CodeforcesPage = () => {
  const { profileData, loading: profileLoading, error: profileError } = useUserProfile();
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const { session } = UserAuth();

  // Get username from profile data
  useEffect(() => {
    if (profileData?.codeforces_username) {
      setUsername(profileData.codeforces_username);
    }
  }, [profileData]);

  const upsertCodeforcesData = async (data) => {
    try {
      if (!session) return;

      // Prepare contest ranking data (only updating Codeforces fields)
      const contestRankingData = {
        codeforces_recent_contest_rating: data.rating || 0,
        codeforces_max_contest_rating: data.maxRating || 0
      };

      // Prepare total questions data (only updating Codeforces field)
      const totalQuestionsData = {
        codeforces_total: data.totalSolved || 0,
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
      console.error('Error upserting Codeforces data:', err);
    }
  };

  const upsertCodeforcesDatas = async () => {
    try {
      if (!session) return;

      // Prepare contest ranking data with null values
      const contestRankingData = {
        codeforces_recent_contest_rating: null,
        codeforces_max_contest_rating: null,
      };

      // Prepare total questions data with null values
      const totalQuestionsData = {
        codeforces_total: null,
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
      console.error('Error upserting Codeforces data:', err);
    }
  };

  // Fetch Codeforces data when username changes
  useEffect(() => {
    if (!username) {
      if (session) {
        upsertCodeforcesDatas();
      }
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setFetchError('');
        
        const response = await fetch(`${API_BASE}/api/codeforces/profile/${username}?t=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid data received from API');
        }
        
        setUserData(data);
        
        // Update database tables
        if (session) {
          await upsertCodeforcesData(data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setFetchError(err.message || 'Failed to load profile data');
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 300);
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
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          layout
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {username ? (
            <>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : fetchError ? (
                <motion.div
                  className="bg-red-900/20 border border-red-700 rounded-xl p-6 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-xl font-bold text-red-300 mb-2">Error Loading Codeforces Data</h2>
                  <p className="text-red-300">{fetchError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                  >
                    Retry
                  </button>
                </motion.div>
              ) : userData ? (
                <>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <ProfileCard user={userData} />
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6"
                  >
                    <h2 className="text-xl font-bold text-blue-400 mb-4">Performance Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h3 className="text-blue-300 text-sm">Current Rating</h3>
                        <p className="text-2xl font-bold">{userData.rating || '-'}</p>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h3 className="text-blue-300 text-sm">Max Rating</h3>
                        <p className="text-2xl font-bold">{userData.maxRating || '-'}</p>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h3 className="text-blue-300 text-sm">Contests</h3>
                        <p className="text-2xl font-bold">{userData.contests || 0}</p>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h3 className="text-blue-300 text-sm">Problems Solved</h3>
                        <p className="text-2xl font-bold">{userData.totalProblemsSolved || 0}</p>
                      </div>
                    </div>
                  </motion.div>

                  {userData.submissionCalendar && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <CalendarHeatmap submissionCalendar={userData.submissionCalendar} />
                    </motion.div>
                  )}

                  {userData.recentContests && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <RecentContests contests={userData.recentContests} />
                    </motion.div>
                  )}

                  {userData.ratingHistory && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <RatingChart ratingHistory={userData.ratingHistory} />
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 mb-6">
                  <h2 className="text-xl font-bold text-red-300 mb-2">No Data Found</h2>
                  <p className="text-red-300">Could not retrieve Codeforces data for this username.</p>
                </div>
              )}
            </>
          ) : (
            <motion.div
              className="bg-gray-800 rounded-xl p-8 shadow-lg text-center border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 mb-6 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">No Codeforces Username Found</h2>
              <p className="text-gray-300 mb-6">Please add your Codeforces username to your profile to view statistics.</p>
              <button
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors w-full max-w-xs mx-auto"
                onClick={() => window.location.href = '/profile'}
              >
                Go to Profile
              </button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default CodeforcesPage;