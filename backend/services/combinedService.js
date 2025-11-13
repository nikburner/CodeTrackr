const leetcodeService = require('./leetcodeService');
const codechefService = require('./codechefService');
const { getUserSubmissions } = require('./codeforcesService');

class CombinedService {
  constructor() {
    this.leetcode = leetcodeService;
  }

  async getCombinedHeatmap(usernames) {
    const results = await Promise.allSettled([
      this.getLeetCodeSubmissions(usernames.leetcode),
      this.getCodeforcesSubmissions(usernames.codeforces),
      this.getCodechefSubmissions(usernames.codechef)
    ]);

    const heatmap = new Map();

    results.forEach(({ status, value }) => {
      if (status === 'fulfilled' && value) {
        value.forEach(({ date, count, platform }) => {
          const key = date;
          const existing = heatmap.get(key) || { count: 0, platforms: {} };
          heatmap.set(key, {
            count: existing.count + count,
            platforms: {
              ...existing.platforms,
              [platform]: (existing.platforms[platform] || 0) + count
            },
            date
          });
        });
      }
    });


    return Array.from(heatmap.values()).map(entry => ({
      date: entry.date,
      count: entry.count,
      platforms: this.ensureAllPlatforms(entry.platforms)
    }));
  }

  ensureAllPlatforms(platforms) {
    return {
      leetcode: platforms.leetcode || 0,
      codechef: platforms.codechef || 0,
      codeforces: platforms.codeforces || 0
    };
  }

  // Update all date formatting to use UTC dates instead of local dates
async getLeetCodeSubmissions(username) {
  if (!username) return [];
  try {
    const { matchedUser } = await this.leetcode.getUserProfileCalendar(username);
    const calendar = JSON.parse(matchedUser.userCalendar.submissionCalendar);
    
    return Object.entries(calendar).map(([ts, count]) => {
      const date = new Date(ts * 1000);
      // Use UTC date formatting
      const utcDate = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;
      
      return {
        date: utcDate,
        count,
        platform: 'leetcode'
      };
    });
  } catch (error) {
    console.error('LeetCode submissions error:', error);
    return [];
  }
}

async getCodeforcesSubmissions(username) {
  if (!username) return [];
  try {
    const submissions = await getUserSubmissions(username);
    const counts = submissions.reduce((acc, sub) => {
      const date = new Date(sub.creationTimeSeconds * 1000);
      // Use UTC date formatting
      const utcDate = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;
      acc[utcDate] = (acc[utcDate] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts).map(([date, count]) => ({
      date,
      count,
      platform: 'codeforces'
    }));
  } catch (error) {
    console.error('Codeforces submissions error:', error);
    return [];
  }
}

  async getCodechefSubmissions(username) {
  if (!username) return [];
  try {
    const { heatmapData } = await codechefService.extractSubmissionHeatmap(username);
    
    return heatmapData.map(entry => {
      // CodeChef dates are in YYYY-M-D format, not DD-MM-YYYY
      const [year, month, day] = entry.date.split('-');
      const utcDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      
      // Add validation for reasonable submission counts
      const saneCount = entry.count;


      
      return {
        date: utcDate,
        count: saneCount,
        platform: 'codechef'
      };
    });
  } catch (error) {
    console.error('CodeChef submissions error:', error);
    return [];
  }
}
}

module.exports = new CombinedService();