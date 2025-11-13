import { useRef } from 'react';
import CalendarHeatmap from "react-calendar-heatmap";
import 'react-calendar-heatmap/dist/styles.css';
import { useState } from 'react';

const EnhancedCalendarHeatmap = ({ 
  startDate, 
  endDate, 
  values = [], 
  gutterSize = 4, 
  showWeekdayLabels = true,
  selectedPlatform,
  onPlatformChange 
}) => {
  const heatmapRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState({});
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });


  const getFilteredValues = () => {
    if (!values || !Array.isArray(values)) return [];
    
    if (selectedPlatform === 'all') return values;
    
    return values
      .map(value => ({
        date: value.date,
        count: value.platforms?.[selectedPlatform] || 0,
        platforms: value.platforms
      }))
      .filter(value => value.count > 0); // Only include days with submissions
  };

  const customClassForValue = (value) => {
    if (!value || value.count === 0) return 'color-empty';
    const intensity = Math.min(value.count, 20);
    const level = Math.min(Math.ceil(intensity / 4), 5);
    return `color-scale-${level}`;
  };

  const handleMouseOver = (event, value) => {
    if (!value) {
      setShowTooltip(false);
      return;
    }
    
    const rect = event.target.getBoundingClientRect();
    const heatmapRect = heatmapRef.current.getBoundingClientRect();
    
    setTooltipPosition({
      x: rect.left - heatmapRect.left + rect.width / 2,
      y: rect.top - heatmapRect.top - 5
    });
    
    setTooltipContent({
      date: value.date ? new Date(value.date).toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric'
      }) : 'No date',
      total: value.count || 0,
      leetcode: value.platforms?.leetcode || 0,
      codeforces: value.platforms?.codeforces || 0,
      codechef: value.platforms?.codechef || 0
    });
    
    setShowTooltip(true);
  };


  return (
    <div className="calendar-heatmap-container relative" ref={heatmapRef}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Showing:</span>
          <div className="flex gap-1 text-xs">
            {[
              { id: 'all', label: 'All Platforms' },
              { id: 'leetcode', label: 'LeetCode', color: 'bg-green-500' },
              { id: 'codeforces', label: 'Codeforces', color: 'bg-blue-500' },
              { id: 'codechef', label: 'CodeChef', color: 'bg-yellow-500' }
            ].map(platform => (
              <button
                key={platform.id}
                onClick={() => onPlatformChange(platform.id)}
                className={`px-2 py-1 rounded flex items-center gap-1 ${
                  selectedPlatform === platform.id
                    ? 'bg-gray-800 text-white border border-gray-600'
                    : 'bg-gray-900/60 hover:bg-gray-800/80 text-gray-300 border border-transparent'
                } transition-colors`}
              >
                {platform.id !== 'all' && <div className={`w-2 h-2 rounded-full ${platform.color}`}></div>}
                {platform.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto ">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={getFilteredValues()}
          classForValue={customClassForValue}
          gutterSize={gutterSize}
          showWeekdayLabels={showWeekdayLabels}
          monthLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
          onMouseOver={handleMouseOver}
          onMouseLeave={() => setShowTooltip(false)}
        />
      </div>

      {showTooltip && (
        <div 
          className="absolute bg-gray-900 text-white p-3 rounded shadow-lg z-10 text-xs min-w-35 max-w-52"
          style={{ 
            left: `${tooltipPosition.x}px`, 
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="font-medium mb-1 text-sm">{tooltipContent.date}</div>
          <div className="font-bold text-base mb-2">
            {tooltipContent.total > 0 ? `${tooltipContent.total} total submissions` : 'No submissions'}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span>LeetCode:</span>
              </div>
              <span className="font-mono font-medium">{tooltipContent.leetcode}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <span>Codeforces:</span>
              </div>
              <span className="font-mono font-medium">{tooltipContent.codeforces}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                <span>CodeChef:</span>
              </div>
              <span className="font-mono font-medium">{tooltipContent.codechef}</span>
            </div>
          </div>
          <div className="absolute w-3 h-3 bg-gray-900 rotate-45" style={{ bottom: '-6px', left: '50%', transform: 'translateX(-50%)' }}></div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCalendarHeatmap;