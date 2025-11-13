import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronUp, ChevronDown, Award, Star, Code, Users, TrendingUp } from 'lucide-react';
import { IoStarSharp } from "react-icons/io5";

const CodeChefStats = ({ data }) => {
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    analysis: true,
    heatmap: true,
    contest: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-800 text-gray-200 rounded-lg border border-gray-700">
        <div className="text-xl text-red-400">No profile data available</div>
      </div>
    );
  }

  const { profileInfo, analysis, submissionHeatmap, contestGraph } = data;

  // Format contest history data for chart
  const chartData = contestGraph.contestHistory.map(contest => ({
    name: contest.contestName.replace('Starters ', 'S').replace(' (Rated)', '').replace(' (rated)', ''),
    rating: parseInt(contest.rating),
    date: contest.date
  }));

  // Function to render stars based on count
  const renderStars = (count) => {
    return (
      <div className="flex justify-center mb-2">
        {Array.from({ length: count }).map((_, i) => (
          <IoStarSharp key={i} className="text-yellow-400 text-4xl mx-0.5" />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Section - Centered */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-gray-200 border border-gray-700 text-center">
        <div className="flex flex-col items-center">
          {/* Rating Display - Centered */}
          <div className="flex flex-col items-center mb-4">
            {profileInfo.stars && renderStars(profileInfo.stars)}
            <div className="text-4xl font-bold text-white mb-1">{profileInfo.rating}</div>
            <div className="flex items-center gap-1 text-gray-400">
              <span>Highest: {profileInfo.highestRating}</span>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 w-full max-w-md mx-auto">
            <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
              <div className="text-gray-400 text-sm">Global Rank</div>
              <div className="text-xl font-bold text-blue-400">#{profileInfo.ranks.global}</div>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
              <div className="text-gray-400 text-sm">Country Rank</div>
              <div className="text-xl font-bold text-blue-400">#{profileInfo.ranks.country}</div>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
              <div className="text-gray-400 text-sm">Problems Solved</div>
              <div className="text-xl font-bold text-green-400">{profileInfo.problemsSolved}</div>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
              <div className="text-gray-400 text-sm">Active Days</div>
              <div className="text-xl font-bold text-purple-400">{submissionHeatmap.activeDays}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden text-gray-200 border border-gray-700">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer bg-gray-700"
          onClick={() => toggleSection('analysis')}
        >
          <h2 className="text-xl font-semibold flex items-center">
            <Award className="mr-2 text-blue-400" /> Performance Analysis
          </h2>
          {expandedSections.analysis ? 
            <ChevronUp className="text-blue-400" /> : 
            <ChevronDown className="text-blue-400" />
          }
        </div>
        
        {expandedSections.analysis && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                <h3 className="text-lg font-medium text-blue-300">Activity Stats</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Days:</span>
                    <span className="font-medium text-gray-200">{analysis.summary.activeDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Activity Rate:</span>
                    <span className="font-medium text-gray-200">{(parseFloat(analysis.summary.activityRate) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Submissions:</span>
                    <span className="font-medium text-gray-200">{submissionHeatmap.totalSubmissions}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                <h3 className="text-lg font-medium text-blue-300">Contest Performance</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Contests:</span>
                    <span className="font-medium text-gray-200">{analysis.summary.contestsParticipated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Highest Rating:</span>
                    <span className="font-medium text-gray-200">{analysis.summary.highestRating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best Rank:</span>
                    <span className="font-medium text-gray-200">{analysis.summary.bestRank}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                <h3 className="text-lg font-medium text-blue-300">Progress</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating Trend:</span>
                    <span className="font-medium text-green-400 flex items-center">
                      +{analysis.summary.ratingTrend} <TrendingUp size={16} className="ml-1" />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Rating:</span>
                    <span className="font-medium text-gray-200">{profileInfo.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contest Performance Graph */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden text-gray-200 border border-gray-700">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer bg-gray-700"
          onClick={() => toggleSection('contest')}
        >
          <h2 className="text-xl font-semibold flex items-center">
            <Star className="mr-2 text-blue-400" /> Contest Performance
          </h2>
          {expandedSections.contest ? 
            <ChevronUp className="text-blue-400" /> : 
            <ChevronDown className="text-blue-400" />
          }
        </div>
        
        {expandedSections.contest && (
          <div className="p-4">
            <div className="mb-4 flex flex-wrap gap-3">
              <div className="bg-gray-700/50 text-gray-200 px-3 py-1 rounded-full text-sm border border-gray-600">
                Contests: {contestGraph.contestsParticipated}
              </div>
              <div className="bg-gray-700/50 text-gray-200 px-3 py-1 rounded-full text-sm border border-gray-600">
                Highest Rating: {contestGraph.highestRating}
              </div>
              <div className="bg-gray-700/50 text-gray-200 px-3 py-1 rounded-full text-sm border border-gray-600">
                Best Rank: {contestGraph.bestRank}
              </div>
            </div>
            
            <div className="w-full h-64 md:h-80 bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#d1d5db' }} 
                    angle={-45} 
                    textAnchor="end"
                    height={60}
                    stroke="#4b5563"
                  />
                  <YAxis 
                    domain={['dataMin - 100', 'dataMax + 100']} 
                    tick={{ fill: '#d1d5db' }}
                    stroke="#4b5563"
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}`, 'Rating']}
                    labelFormatter={(label, items) => {
                      const item = items[0]?.payload;
                      return `${label} (${item?.date})`;
                    }}
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151', 
                      color: '#d1d5db', 
                      borderRadius: '0.375rem' 
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#d1d5db' }} />
                  <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#1d4ed8' }}
                    activeDot={{ r: 6, fill: '#93c5fd' }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Recent Contests Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden text-gray-200 border border-gray-700">
        <div className="p-4 bg-gray-700">
          <h2 className="text-xl font-semibold flex items-center">
            <Code className="mr-2 text-blue-400" /> Recent Contests
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contest</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {contestGraph.contestHistory.slice(0, 5).map((contest, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-gray-700 transition-colors duration-150"
                >
                  <td className="py-3 px-4 text-sm">{contest.contestName}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{contest.date}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-900/50 text-blue-100 border border-blue-700/50">
                      {contest.rating}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">#{contest.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CodeChefStats;