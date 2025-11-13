// src/components/PlatformCard.jsx
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

const PlatformCard = ({ platform, data, color }) => {
  const ratingChange = data.rating - (data.rating - Math.floor(Math.random() * 200))

  return (
    <div className={`${color} dark:bg-gray-700 p-6 rounded-xl shadow-sm`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold dark:text-white">{platform}</h3>
        <span className="bg-white dark:bg-gray-600 px-3 py-1 rounded-full text-sm">
          @user_{platform.toLowerCase()}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
          <div className="text-2xl font-bold dark:text-white">{data.rating}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
          <div className="flex items-center mt-2">
            {ratingChange >= 0 ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ml-1 ${ratingChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(ratingChange)}
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
          <div className="text-2xl font-bold dark:text-white">{data.solved}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Solved</div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Contest Progress</span>
          <span>{data.contests}/50</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div 
            className="bg-indigo-500 h-2 rounded-full" 
            style={{ width: `${(data.contests / 50) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default PlatformCard