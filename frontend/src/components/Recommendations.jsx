import React, { useState } from 'react';
import axios from 'axios';
import { UserAuth } from '../context/AuthContext';

const Recommendations = () => {
  const { session } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${backendUrl}/api/recommendations`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      if (response.data.success) {
        setRecommendations(response.data.data);
      }
    } catch (err) {
      console.error('Fetch recommendations error:', err);
      setError(err.response?.data?.error || 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Problem Recommendations</h2>
          <p className="text-sm text-gray-400 mt-1">Get personalized problem suggestions based on your solve history</p>
        </div>
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all shadow-md"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : '✨ Generate Recommendations'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {recommendations && (
        <div className="space-y-6">
          {/* Stats Overview */}
          {recommendations.stats && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{recommendations.stats.currentRating}</div>
                <div className="text-sm text-gray-400">Current Rating</div>
              </div>
              <div className="bg-green-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{recommendations.stats.maxRating}</div>
                <div className="text-sm text-gray-400">Max Rating</div>
              </div>
              <div className="bg-purple-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{recommendations.stats.totalSolved}</div>
                <div className="text-sm text-gray-400">Problems Solved</div>
              </div>
              <div className="bg-orange-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">{recommendations.stats.contestsParticipated}</div>
                <div className="text-sm text-gray-400">Contests</div>
              </div>
            </div>
          )}

          {/* Skill Level */}
          {recommendations.skillLevel && (
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">📊 Skill Level</h3>
              <p className="text-white font-medium">{recommendations.skillLevel}</p>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.strengths && recommendations.strengths.length > 0 && (
              <div className="bg-green-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-300 mb-3">💪 Strengths</h3>
                <ul className="space-y-2">
                  {recommendations.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommendations.weaknesses && recommendations.weaknesses.length > 0 && (
              <div className="bg-orange-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-300 mb-3">🎯 Areas to Improve</h3>
                <ul className="space-y-2">
                  {recommendations.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start">
                      <span className="text-orange-400 mr-2">→</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recommended Problems */}
          {recommendations.recommendations && recommendations.recommendations.length > 0 && (
            <div className="bg-gray-800/60 backdrop-blur-sm border-2 border-purple-500/50 rounded-lg p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-4">🚀 Recommended Problems</h3>
              <div className="space-y-3">
                {recommendations.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-gray-700/40 border border-gray-600/50 rounded-lg p-4 hover:bg-gray-700/60 hover:border-purple-500/50 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center flex-wrap gap-3">
                        <a
                          href={`https://codeforces.com/problemset/problem/${rec.problemCode || ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                        >
                          {rec.problemCode || `Problem ${idx + 1}`}
                        </a>
                        {rec.difficulty && (
                          <span className="px-3 py-1 bg-purple-900/50 text-purple-300 border border-purple-500/30 text-xs rounded-full font-medium">
                            ⭐ {rec.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                    {rec.reason && (
                      <p className="text-sm text-gray-300 mt-2 leading-relaxed">{rec.reason}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Focus Areas */}
          {recommendations.focusAreas && recommendations.focusAreas.length > 0 && (
            <div className="bg-blue-900/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">🎓 Focus Areas</h3>
              <ul className="space-y-2">
                {recommendations.focusAreas.map((area, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Raw text fallback */}
          {recommendations.rawText && !recommendations.recommendations?.length && (
            <div className="bg-gray-900/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Analysis</h3>
              <div className="prose prose-sm max-w-none text-gray-300 whitespace-pre-wrap">
                {recommendations.rawText}
              </div>
            </div>
          )}
        </div>
      )}

      {!recommendations && !loading && (
        <div className="text-center py-12 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-lg mb-2">Get AI-powered problem recommendations</p>
          <p className="text-sm">Click the button above to analyze your solve history and get personalized suggestions</p>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
