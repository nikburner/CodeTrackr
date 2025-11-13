// src/components/PlatformFilter.jsx
import { motion } from 'framer-motion';

const platforms = [
  { id: 'all', name: 'All Platforms' },
  { id: 'leetcode', name: 'LeetCode' },
  { id: 'codeforces', name: 'Codeforces' },
  { id: 'codechef', name: 'CodeChef' },
];

const PlatformFilter = ({ selectedPlatform, setSelectedPlatform }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => (
        <motion.button
          key={platform.id}
          onClick={() => setSelectedPlatform(platform.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedPlatform === platform.id
              ? 'bg-purple-500/30 backdrop-blur-sm text-white'
              : 'bg-white/5 hover:bg-white/10 text-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {platform.name}
        </motion.button>
      ))}
    </div>
  );
};

export default PlatformFilter;