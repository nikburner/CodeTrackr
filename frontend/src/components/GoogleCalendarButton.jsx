import { useState, useEffect } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { UserAuth } from '../context/AuthContext';
import {
  CalendarDaysIcon,
  ArrowPathIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const getContestId = (contest) => {
  return `${contest.title}-${contest.startTime}-${contest.platform}`;
};

export default function GoogleCalendarButton({ contest }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const { profileData } = useUserProfile();
  const { session } = UserAuth();
  const contestId = getContestId(contest);

  const validateContest = () => {
    if (!contest.startTime || !contest.endTime) {
      return 'Invalid contest times';
    }

    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);

    if (isNaN(start) || isNaN(end)) {
      return 'Invalid date format';
    }

    if (start >= end) {
      return 'End time must be after start time';
    }

    return null;
  };

  const createCalendarLink = () => {
    if (!profileData?.email) {
      setStatus({ type: 'error', message: 'Please login to set reminders' });
      return;
    }

    const validationError = validateContest();
    if (validationError) {
      setStatus({ type: 'error', message: validationError });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const start = new Date(contest.startTime);
      const end = new Date(contest.endTime);

      const formatDate = (date) => {
        return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
      };

      const details = [
        `Platform: ${contest.platform}`,
        `Duration: ${contest.duration} minutes`,
        contest.url ? `URL: ${contest.url}` : ''
      ].filter(Boolean).join('\n\n');
      
      const calendarUrl = new URL('https://calendar.google.com/calendar/render');
      calendarUrl.searchParams.append('action', 'TEMPLATE');
      calendarUrl.searchParams.append('text', contest.title);
      calendarUrl.searchParams.append('details', details);
      calendarUrl.searchParams.append('dates', `${formatDate(start)}/${formatDate(end)}`);
      calendarUrl.searchParams.append('ctz', 'UTC');
      
      if (contest.url) {
        calendarUrl.searchParams.append('location', contest.url);
      }

      // Add reminders (30 minutes and 1 day before)
      calendarUrl.searchParams.append('remind', '30');
      calendarUrl.searchParams.append('remind', '1440');

      // Open in new tab
      window.open(calendarUrl.toString(), '_blank');
      setStatus({ type: 'success', message: 'Opened Google Calendar with event details' });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.message,
        showRetry: true 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={createCalendarLink}
          disabled={loading}
          className={`mt-2 flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
            loading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
          aria-label="Add to Google Calendar"
        >
          {loading ? (
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
          ) : (
            <CalendarDaysIcon className="w-4 h-4" />
          )}
          {loading ? 'Opening...' : 'Add to Calendar'}
        </button>
      </div>

      {status && (
        <div className={`flex items-start gap-1 text-sm ${
          status.type === 'success' ? 'text-green-600' : 'text-red-600'
        }`}>
          {status.type === 'error' && (
            <ExclamationTriangleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
          )}
          <div>
            {status.message}
            {status.showRetry && (
              <button 
                onClick={createCalendarLink}
                className="ml-2 underline hover:no-underline"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}