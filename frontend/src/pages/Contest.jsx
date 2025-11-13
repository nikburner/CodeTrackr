import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { CalendarIcon, ChartPieIcon, ClockIcon, FireIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ContestCard from '../components/ContestCard';
import PlatformFilter from '../components/PlatformFilter';
import Header from '../components/Header';
import ContestCalendar from '../components/ContestCalendar';

const Contest = () => {
  const [contests, setContests] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [hoveredStat, setHoveredStat] = useState(null);

  const parseDuration = (duration) => {
    const [time, unit] = duration.split(' ');
    const timeValue = parseFloat(time);
    return unit.includes('hour') ? Math.round(timeValue * 60) : timeValue;
  };
  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/contests/upcoming`);
        const data = await response.json();
        if (data.success) {
          const transformedContests = data.contests.map(contest => ({
            id: `${contest.name}-${contest.startTime}`,
            title: contest.name,
            platform: contest.platform.toLowerCase(),
            startTime: contest.startTime,
            endTime: contest.endTime,
            duration: parseDuration(contest.duration),
            url: contest.url,
          }));
          setContests(transformedContests);
        }
      } catch (error) {
        console.error('Error fetching contests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const filteredContests = contests.filter(contest => {
    const matchesPlatform = selectedPlatform === 'all' || contest.platform === selectedPlatform;
    const matchesSearch = contest.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const PlatformTooltip = ({ visible, contests }) => {
    const platformCounts = useMemo(() => ({
      leetcode: contests.filter(c => c.platform === 'leetcode').length,
      codechef: contests.filter(c => c.platform === 'codechef').length,
      codeforces: contests.filter(c => c.platform === 'codeforces').length,
    }), [contests]);

    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full right-0 bg-gray-800/90 backdrop-blur-sm p-2 rounded-lg shadow-lg z-10 min-w-[120px]"
          >
            <div className="text-xs space-y-1">
              {Object.entries(platformCounts).map(([platform, count]) => (
                count > 0 && (
                  <div key={platform} className="flex justify-between items-center gap-4">
                    <span className="capitalize">{platform}</span>
                    <span className="font-medium">
                      {count}
                    </span>
                  </div>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mt-6 mb-8 px-4">
          <h1 className="text-2xl font-semibold border-b pb-2">
            🗓️ Upcoming Contests
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PlatformFilter selectedPlatform={selectedPlatform} setSelectedPlatform={setSelectedPlatform} />
            <input
              type="text"
              placeholder="🔍 Search contests"
              className="px-3 py-2 rounded-xl w-[53%] bg-white/10 text-white placeholder-gray-300 outline-none border border-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl max-h-[39rem] overflow-y-auto space-y-4 scrollbar-thin">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-24 bg-white/5 rounded-xl backdrop-blur-sm animate-pulse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))
              ) : (
                <AnimatePresence>
                  {filteredContests.length > 0 ? (
                    filteredContests.map((contest) => (
                      <ContestCard key={contest.id} contest={contest} />
                    ))
                  ) : (
                    <motion.div
                      className="text-center py-12 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-gray-400">No contests found matching your criteria</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-14 bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl space-y-4 py-6"
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ChartPieIcon className="w-6 h-6 text-purple-400" />
                Contest Stats
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center relative">
                  <span className="text-gray-400">Total Contests</span>
                  <div 
                    className="font-medium relative group"
                    onMouseEnter={() => setHoveredStat('total')}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    {contests.length}
                    <PlatformTooltip 
                      visible={hoveredStat === 'total'}
                      contests={contests}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center relative">
                  <span className="text-gray-400">Upcoming</span>
                  <div 
                    className="text-green-400 relative group"
                    onMouseEnter={() => setHoveredStat('upcoming')}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    {contests.filter(c => new Date(c.startTime) > new Date()).length}
                    <PlatformTooltip 
                      visible={hoveredStat === 'upcoming'}
                      contests={contests.filter(c => new Date(c.startTime) > new Date())}
                    />
                  </div>
                </div>

                <div className="flex justify-between  items-center relative">
                  <span className="text-gray-400">Ongoing</span>
                  <div 
                    className="text-yellow-400 relative group"
                    onMouseEnter={() => setHoveredStat('ongoing')}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    {contests.filter(c => 
                      new Date() > new Date(c.startTime) &&
                      new Date() < new Date(c.endTime)
                    ).length}
                    <PlatformTooltip 
                      visible={hoveredStat === 'ongoing'}
                      contests={contests.filter(c => 
                        new Date() > new Date(c.startTime) &&
                        new Date() < new Date(c.endTime)
                      )}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <ContestCalendar contests={filteredContests} />
          </div>
        </div>

        <div className="mt-6 mb-4 px-4">
          <h1 className="text-2xl font-semibold border-b pb-2">
            🏁 Previous Contests
          </h1>
          <p  > under progress..</p>
        </div>
      </main>
    </div>
  );
};

export default Contest;