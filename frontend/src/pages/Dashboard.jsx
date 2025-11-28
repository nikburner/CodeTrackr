import { motion } from "framer-motion";
import Header from "../components/Header";
import { useUserProfile } from "../context/UserProfileContext";
import { UserAuth } from "../context/AuthContext";
import { FiMail, FiMapPin, FiExternalLink } from "react-icons/fi";
import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import { MdVerified } from "react-icons/md";
import { FaGraduationCap, FaBriefcase } from "react-icons/fa6";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";
import 'react-circular-progressbar/dist/styles.css';
import CombinedHeatmap from "../components/CombinedHeatmap";
import Recommendations from "../components/Recommendations";

const Dashboard = () => {
  const { profileData } = useUserProfile();
  const { session } = UserAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const user = {
    name: profileData?.name || "",
    email: profileData?.email || "",
    emailVerified: profileData?.emailVerified || true,
    linkedin: profileData?.linkedin || "",
    github: profileData?.github || "",
    organization: profileData?.education || "",
    location: profileData?.location || "",
    work: profileData?.work || "",
    codeforces_username: profileData?.codeforces_username || "",
    leetcode_username: profileData?.leetcode_username || "",
    codechef_username: profileData?.codechef_username || "",
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/dashboard/${session.user.id}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session]);

  const getAvatar = (name) => {
    if (!name) return "👤";
    return name.charAt(0).toUpperCase();
  };

  // Calculate total questions solved across all platforms
  const getTotalQuestionsSolved = () => {
    if (!dashboardData?.total_questions?.length) return 0;
    const totals = dashboardData.total_questions[0];
    return (totals.leetcode_total || 0) +
      (totals.codechef_total || 0) +
      (totals.codeforces_total || 0);
  };

  // Get contest rating for a specific platform
  const getContestRating = (platform) => {
    if (!dashboardData?.contest_ranking_info?.length) return null;
    const data = dashboardData.contest_ranking_info[0];

    if (platform === 'leetcode') {
      return {
        recent: data.leetcode_recent_contest_rating,
        max: data.leetcode_max_contest_rating
      };
    } else if (platform === 'codechef') {
      return {
        stars: data.codechef_stars,
        recent: data.codechef_recent_contest_rating,
        max: data.codechef_max_contest_rating
      };
    } else if (platform === 'codeforces') {
      return {
        recent: data.codeforces_recent_contest_rating,
        max: data.codeforces_max_contest_rating
      };
    }
    return null;
  };

  // Get questions solved for a specific platform
  const getPlatformQuestions = (platform) => {
    if (!dashboardData?.total_questions?.length) return 0;
    return dashboardData.total_questions[0][`${platform}_total`] || 0;
  };

  // Get LeetCode difficulty breakdown
  const getLeetCodeBreakdown = () => {
    if (!dashboardData?.total_questions?.length) return { easy: 0, medium: 0, hard: 0 };
    const data = dashboardData.total_questions[0];
    return {
      easy: data.leetcode_easy || 0,
      medium: data.leetcode_medium || 0,
      hard: data.leetcode_hard || 0
    };
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  const leetCodeBreakdown = getLeetCodeBreakdown();
  const leetCodeRating = getContestRating('leetcode');
  const codechefRating = getContestRating('codechef');
  const codeforcesRating = getContestRating('codeforces');

  return (
    <div>
      <Header />
      <div className="min-h-screen flex bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Enhanced Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-80 h-full bg-gradient-to-b from-gray-900/80 to-gray-900/60 backdrop-blur-lg p-6 border-r border-white/5 shadow-2xl space-y-8 flex flex-col overflow-y-auto"
        >
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold mb-4 text-white shadow-lg ring-4 ring-white/10 ring-offset-2 ring-offset-gray-900"
            >
              {getAvatar(user.name)}
            </motion.div>
            <h2 className="text-2xl font-bold text-white text-center tracking-tight">
              {user.name}
            </h2>
            <div className="flex items-center mt-3 space-x-2 bg-gray-800/50 px-4 py-2 rounded-full">
              <FiMail className="text-gray-300" />
              <span className="text-gray-300 text-sm font-medium">{user.email}</span>
              {user.emailVerified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-400 ml-1"
                >
                  <MdVerified size={18} />
                </motion.div>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-gray-800/30 p-4 rounded-xl border border-white/10 shadow-inner">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Connect With Me</h3>
            <div className="flex justify-center space-x-5">
              {user.linkedin && (
                <motion.a
                  whileHover={{ y: -2 }}
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-600/90 rounded-xl hover:bg-blue-600 transition-all shadow-md hover:shadow-blue-500/30"
                >
                  <FaLinkedin className="text-white" size={20} />
                </motion.a>
              )}
              {user.github && (
                <motion.a
                  whileHover={{ y: -2 }}
                  href={user.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all shadow-md hover:shadow-gray-500/30"
                >
                  <FaGithub className="text-white" size={20} />
                </motion.a>
              )}
            </div>
          </div>

          {/* Coding Platforms */}
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Coding Profiles</h3>
            <div className="space-y-3">
              {user.leetcode_username && (
                <motion.a
                  whileHover={{ x: 5 }}
                  href={`https://leetcode.com/u/${user.leetcode_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl hover:bg-gray-800/60 transition-all group border border-white/5 hover:border-white/10"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <SiLeetcode className="text-yellow-400" size={20} />
                    </div>
                    <span className="text-white font-medium">LeetCode</span>
                  </div>
                  <FiExternalLink className="text-gray-400 group-hover:text-yellow-400 transition" />
                </motion.a>
              )}
              {user.codechef_username && (
                <motion.a
                  whileHover={{ x: 5 }}
                  href={`https://www.codechef.com/users/${user.codechef_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl hover:bg-gray-800/60 transition-all group border border-white/5 hover:border-white/10"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <SiCodechef className="text-red-400" size={20} />
                    </div>
                    <span className="text-white font-medium">CodeChef</span>
                  </div>
                  <FiExternalLink className="text-gray-400 group-hover:text-red-400 transition" />
                </motion.a>
              )}
              {user.codeforces_username && (
                <motion.a
                  whileHover={{ x: 5 }}
                  href={`https://codeforces.com/profile/${user.codeforces_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl hover:bg-gray-800/60 transition-all group border border-white/5 hover:border-white/10"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <SiCodeforces className="text-blue-400" size={20} />
                    </div>
                    <span className="text-white font-medium">CodeForces</span>
                  </div>
                  <FiExternalLink className="text-gray-400 group-hover:text-blue-400 transition" />
                </motion.a>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">About</h3>
            {user.location && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center p-4 bg-gray-800/40 rounded-xl border border-white/5"
              >
                <div className="p-3 bg-blue-500/20 rounded-xl mr-4">
                  <FiMapPin className="text-blue-400" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Location</p>
                  <p className="text-sm font-semibold text-white">{user.location}</p>
                </div>
              </motion.div>
            )}
            {user.organization && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center p-4 bg-gray-800/40 rounded-xl border border-white/5"
              >
                <div className="p-3 bg-purple-500/20 rounded-xl mr-4">
                  <FaGraduationCap className="text-purple-400" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Education</p>
                  <p className="text-sm font-semibold text-white">{user.organization}</p>
                </div>
              </motion.div>
            )}
            {user.work && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center p-4 bg-gray-800/40 rounded-xl border border-white/5"
              >
                <div className="p-3 bg-green-500/20 rounded-xl mr-4">
                  <FaBriefcase className="text-green-400" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Work</p>
                  <p className="text-sm font-semibold text-white">{user.work}</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">

          <CombinedHeatmap profileData={profileData} />

          {/* First Row: Stats Cards */}
          <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-6">
            {/* Card 1: Total Questions Solved */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-2xl border border-white/10 p-6 shadow-lg backdrop-blur-sm"
            >
              <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-xl font-semibold text-gray-300 mb-4 text-center">Total Questions Solved</h1>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  className="text-6xl font-bold text-yellow-400 flex items-center justify-center h-full"
                >
                  {getTotalQuestionsSolved()}
                </motion.div>
                <p className="text-sm text-gray-400 mt-4">Across all platforms</p>
              </div>
            </motion.div>

            {/* Card 2: LeetCode Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-2xl border border-white/10 p-6 shadow-lg backdrop-blur-sm"
            >
              <div className="flex items-center justify-center mb-4">
                <h3 className="text-xl font-semibold text-white">DSA</h3>
              </div>

              {/* Circular Progress with Total */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 relative mb-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#374151" strokeWidth="8" />

                    {/* Easy */}
                    {leetCodeBreakdown.easy > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#22c55e" // green
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(leetCodeBreakdown.easy / getPlatformQuestions('leetcode')) * 251} 251`}
                        transform="rotate(-90 50 50)"
                      />
                    )}

                    {/* Medium */}
                    {leetCodeBreakdown.medium > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#facc15" // yellow
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(leetCodeBreakdown.medium / getPlatformQuestions('leetcode')) * 251} 251`}
                        strokeDashoffset={`-${(leetCodeBreakdown.easy / getPlatformQuestions('leetcode')) * 251}`}
                        transform="rotate(-90 50 50)"
                      />
                    )}

                    {/* Hard */}
                    {leetCodeBreakdown.hard > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#ef4444" // red
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(leetCodeBreakdown.hard / getPlatformQuestions('leetcode')) * 251} 251`}
                        strokeDashoffset={`-${(
                          (leetCodeBreakdown.easy + leetCodeBreakdown.medium) /
                          getPlatformQuestions('leetcode')
                        ) * 251}`}
                        transform="rotate(-90 50 50)"
                      />
                    )}

                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-2xl font-bold fill-white"
                    >
                      {getPlatformQuestions('leetcode')}
                    </text>
                  </svg>
                </div>

              </div>

              {/* Difficulty Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-300">Easy</span>
                  </div>
                  <span className="text-white font-medium">{leetCodeBreakdown.easy}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-gray-300">Medium</span>
                  </div>
                  <span className="text-white font-medium">{leetCodeBreakdown.medium}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-gray-300">Hard</span>
                  </div>
                  <span className="text-white font-medium">{leetCodeBreakdown.hard}</span>
                </div>
              </div>
            </motion.div>

            {/* Card 3: CodeChef & CodeForces Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-2xl border border-white/10 p-6 shadow-lg backdrop-blur-sm"
            >
              <h3 className="text-xl font-semibold text-white mb-6 text-center">Competitive Platforms</h3>

              {/* Platform Distribution */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-40 h-40 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#374151" strokeWidth="8" />

                    {/* CodeChef circle */}
                    {getPlatformQuestions('codechef') > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#ef4444"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(getPlatformQuestions('codechef') /
                          (getPlatformQuestions('codechef') + getPlatformQuestions('codeforces'))) * 251
                          } 251`}
                        transform="rotate(-90 50 50)"
                      />
                    )}

                    {/* Codeforces circle - only render if non-zero */}
                    {getPlatformQuestions('codeforces') > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(getPlatformQuestions('codeforces') /
                          (getPlatformQuestions('codechef') + getPlatformQuestions('codeforces'))) * 251
                          } 251`}
                        strokeDashoffset={`-${(getPlatformQuestions('codechef') /
                          (getPlatformQuestions('codechef') + getPlatformQuestions('codeforces'))) * 251
                          }`}
                        transform="rotate(-90 50 50)"
                      />
                    )}

                    {/* Total count in center */}
                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-lg font-bold fill-white"
                    >
                      {getPlatformQuestions('codechef') + getPlatformQuestions('codeforces')}
                    </text>
                  </svg>

                </div>
              </div>

              {/* Platform Details */}
              <div className="space-y-4">
                {user.codechef_username && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl border border-white/5"
                  >
                    <div className="flex items-center">
                      <SiCodechef className="text-red-500 mr-3" size={20} />
                      <span className="text-white">CodeChef</span>
                    </div>
                    <div className="text-white font-medium">
                      {getPlatformQuestions('codechef')}
                    </div>
                  </motion.div>
                )}
                {user.codeforces_username && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl border border-white/5"
                  >
                    <div className="flex items-center">
                      <SiCodeforces className="text-blue-400 mr-3" size={20} />
                      <span className="text-white">CodeForces</span>
                    </div>
                    <div className="text-white font-medium">
                      {getPlatformQuestions('codeforces')}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Second Row: Contest Ratings */}
          <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-6">
            {/* LeetCode Contest Rating */}
            {leetCodeRating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-2xl border border-white/10 p-6 shadow-lg backdrop-blur-sm"
              >
                <div className="flex items-center justify-center mb-4">
                  <SiLeetcode className="text-yellow-400 mr-2" size={20} />
                  <h3 className="text-xl font-semibold text-white">LeetCode Rating</h3>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">
                    {leetCodeRating.recent || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-400 mb-4">Current Rating</div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-yellow-400 h-2.5 rounded-full"
                      style={{ width: `${Math.min(100, (leetCodeRating.recent / (leetCodeRating.max || 2500)) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between w-full text-xs text-gray-400">
                    <span>0</span>
                    <span>Max: {leetCodeRating.max || 'N/A'}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CodeChef Contest Rating */}
            {codechefRating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-2xl border border-white/10 p-6 shadow-lg backdrop-blur-sm"
              >
                <div className="flex items-center justify-center mb-4">
                  <SiCodechef className="text-red-500 mr-2" size={20} />
                  <h3 className="text-xl font-semibold text-white">CodeChef Rating</h3>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center mb-2">
                    <div className="text-4xl font-bold text-red-500 mr-2">
                      {codechefRating.recent || 'N/A'}
                    </div>
                    {codechefRating.stars && (
                      <div className="text-yellow-400 text-lg font-bold">
                        {Array.from({ length: codechefRating.stars }).map((_, i) => '★')}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 mb-4">Current Rating</div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-red-500 h-2.5 rounded-full"
                      style={{ width: `${Math.min(100, (codechefRating.recent / (codechefRating.max || 5000)) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between w-full text-xs text-gray-400">
                    <span>0</span>
                    <span>Max: {codechefRating.max || 'N/A'}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CodeForces Contest Rating */}
            {codeforcesRating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-2xl border border-white/10 p-6 shadow-lg backdrop-blur-sm"
              >
                <div className="flex items-center justify-center mb-4">
                  <SiCodeforces className="text-blue-400 mr-2" size={20} />
                  <h3 className="text-xl font-semibold text-white">CodeForces Rating</h3>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {codeforcesRating.recent || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-400 mb-4">Current Rating</div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-blue-400 h-2.5 rounded-full"
                      style={{ width: `${Math.min(100, (codeforcesRating.recent / (codeforcesRating.max || 3000)) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between w-full text-xs text-gray-400">
                    <span>0</span>
                    <span>Max: {codeforcesRating.max || 'N/A'}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* AI Recommendations Section */}
          <div className="mt-8">
            <Recommendations />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;