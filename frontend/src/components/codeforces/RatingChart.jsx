import { subMonths, startOfDay, format } from 'date-fns';
import Chart from 'react-apexcharts';

const RatingChart = ({ ratingHistory }) => {
  const sixMonthsAgo = startOfDay(subMonths(new Date(), 6)).getTime();
  const filteredData = ratingHistory
    .filter(contest => contest.ratingUpdateTimeSeconds * 1000 >= sixMonthsAgo)
    .map(contest => ({
      x: contest.ratingUpdateTimeSeconds * 1000,
      y: contest.newRating,
      rank: contest.rank
    }));

  const options = {
    chart: {
      type: 'area',
      height: 400,
      foreColor: '#9CA3AF',
      toolbar: { show: true },
      zoom: { enabled: false },
      background: 'transparent'
    },
    colors: ['#3B82F6'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100]
      }
    },
    xaxis: {
      type: 'datetime',
      min: sixMonthsAgo,
      max: new Date().getTime(),
      labels: {
        style: { colors: '#9CA3AF' },
        format: 'MMM dd',
        rotate: -45
      },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: { 
        style: { colors: '#9CA3AF' } 
      },
      forceNiceScale: true
    },
    annotations: {
      points: filteredData.map((contest, idx) => ({
        x: contest.x,
        y: contest.y,
        marker: {
          size: 6,
          fillColor: '#fff',
          strokeColor: '#3B82F6',
          radius: 2
        },
        label: {
          text: `#${contest.rank}`,
          style: {
            color: '#fff',
            background: '#3B82F6',
            fontSize: '12px',
            padding: { left: 5, right: 5, top: 2, bottom: 2 }
          }
        }
      }))
    },
    tooltip: {
      theme: 'dark',
      x: {
        formatter: (val) => format(new Date(val), 'MMM dd, yyyy HH:mm')
      }
    },
    grid: {
      borderColor: 'rgba(156, 163, 175, 0.2)',
      strokeDashArray: 4
    }
  };

  const series = [{
    name: 'Rating',
    data: filteredData
  }];

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
      <h3 className="text-xl font-semibold text-blue-400 mb-4">
        Rating History (Last 6 Months)
      </h3>
      <Chart 
        options={options} 
        series={series} 
        type="area" 
        height={400} 
      />
    </div>
  );
};

export default RatingChart;