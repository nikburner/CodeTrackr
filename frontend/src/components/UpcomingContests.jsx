import { format } from 'date-fns';

const UpcomingContests = ({ contests, loading }) => {
  const upcoming = contests
    .filter(contest => new Date(contest.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 3);
    
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Contests</h3>
      
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      ) : upcoming.length > 0 ? (
        <div className="space-y-3">
          {upcoming.map(contest => (
            <div key={contest.id} className="border-l-4 border-indigo-500 pl-3 py-1">
              <h4 className="font-medium text-gray-800">{contest.title}</h4>
              <p className="text-sm text-gray-600">
                {format(new Date(contest.startTime), 'MMM d, h:mm a')}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No upcoming contests</p>
      )}
    </div>
  );
};

export default UpcomingContests;