const PlatformStats = ({ contests, loading }) => {
    const countContestsByPlatform = () => {
      const counts = {
        leetcode: 0,
        codeforces: 0,
        codechef: 0,
        gfg: 0,
      };
      
      contests.forEach(contest => {
        if (counts.hasOwnProperty(contest.platform)) {
          counts[contest.platform]++;
        }
      });
      
      return counts;
    };
    
    const platformCounts = countContestsByPlatform();
    
    return (
      <div className="bg-white rounded-lg shadow-md p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Stats</h3>
        
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(platformCounts).map(([platform, count]) => (
              <div key={platform} className="flex items-center justify-between">
                <span className="capitalize text-gray-700">{platform}</span>
                <span className="font-medium">{count} contests</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default PlatformStats;