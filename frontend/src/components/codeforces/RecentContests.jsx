import { motion } from 'framer-motion';

const RecentContests = ({ contests=[] }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6"
  >
    <h3 className="text-xl font-semibold text-blue-400 mb-4">Recent Contests</h3>
    <div className="space-y-3">
      {contests.map((contest, idx) => (
        <motion.div
          key={contest.contestId}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <div>
            <h4 className="font-medium text-white">{contest.contestName}</h4>
            <p className="text-sm text-gray-400">
              {new Date(contest.ratingUpdateTimeSeconds * 1000).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-green-400">Rank: {contest.rank}</p>
            <p className={`${contest.newRating > contest.oldRating ? 'text-green-400' : 'text-red-400'}`}>
              {contest.newRating - contest.oldRating} points
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default RecentContests;