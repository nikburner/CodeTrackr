// Updated Activity Heatmap Component
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Tooltip } from 'react-tooltip';

const ActivityHeatmap = () => {
  // Generate realistic mock data
  const generateHeatmapData = () => {
    const startDate = new Date(new Date().getFullYear(), 0, 1); // Start from Jan 1st
    const today = new Date();
    const days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return {
        date,
        count: Math.floor(Math.random() * 5) // 0-4 problems
      };
    });
  };

  const heatmapData = generateHeatmapData();
  const [selectedDay, setSelectedDay] = useState(null);

  // Get weekdays for proper alignment
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Calculate offset for first week
  const firstDate = heatmapData[0]?.date;
  const startDay = firstDate ? firstDate.getDay() : 0;
  
  const getColor = (count) => {
    const colors = [
      'bg-gray-800',        // 0
      'bg-purple-900/60',   // 1
      'bg-purple-800/60',   // 2
      'bg-purple-700/60',   // 3
      'bg-purple-600/60'    // 4+
    ];
    return count >= 4 ? colors[4] : colors[count];
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl"
    >
      <h2 className="text-xl font-semibold mb-6">Activity Heatmap</h2>
      
      {/* Weekday Labels */}
      <div className="flex mb-2 gap-1">
        {weekdays.map(day => (
          <div key={day} className="w-4 h-4 text-xs text-gray-400 text-center">
            {day[0]}
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="flex flex-wrap gap-1">
        {/* Empty cells for first week alignment */}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="w-4 h-4" />
        ))}

        {heatmapData.map((day, index) => (
          <div
            key={index}
            data-tooltip-id="heatmap-tooltip"
            data-tooltip-content={`${day.count} problems on ${day.date.toLocaleDateString()}`}
            className={`w-4 h-4 rounded-sm ${getColor(day.count)} hover:scale-125 transition-transform cursor-pointer`}
            onMouseEnter={() => setSelectedDay(day)}
            onMouseLeave={() => setSelectedDay(null)}
          />
        ))}
      </div>

      {/* Tooltip */}
      <Tooltip 
        id="heatmap-tooltip" 
        className="!bg-black/80 !backdrop-blur-sm !border !border-white/10 !rounded-lg"
      />

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map(count => (
          <div key={count} className={`w-4 h-4 ${getColor(count)}`} />
        ))}
        <span>More</span>
      </div>
    </motion.div>
  );
};

export default ActivityHeatmap;