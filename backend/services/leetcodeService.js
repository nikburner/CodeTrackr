const fetch = require('node-fetch');
const axios = require('axios');

class LeetcodeService {
  constructor() {
    this.apiUrl = 'https://leetcode.com/graphql';
  }

  async makeGraphQLRequest(query, variables) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com'
        },
        body: JSON.stringify({
          query,
          variables
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }
      
      return data.data;
    } catch (error) {
      console.error('Error making GraphQL request:', error);
      throw error;
    }
  }

  async getUserPublicProfile(username) {
    const query = `
      query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          contestBadge {
            name
            expired
            hoverText
            icon
          }
          username
          githubUrl
          twitterUrl
          linkedinUrl
          profile {
            ranking
            userAvatar
            realName
            aboutMe
            school
            websites
            countryName
            company
            jobTitle
            skillTags
            postViewCount
            postViewCountDiff
            reputation
            reputationDiff
            solutionCount
            solutionCountDiff
            categoryDiscussCount
            categoryDiscussCountDiff
          }
        }
      }
    `;
    
    return this.makeGraphQLRequest(query, { username });
  }

  async getLanguageStats(username) {
    const query = `
      query languageStats($username: String!) {
        matchedUser(username: $username) {
          languageProblemCount {
            languageName
            problemsSolved
          }
        }
      }
    `;
    return this.makeGraphQLRequest(query, { username });
  }

  async getSkillStats(username) {
    const query = `
      query skillStats($username: String!) {
        matchedUser(username: $username) {
          tagProblemCounts {
            advanced {
              tagName
              tagSlug
              problemsSolved
            }
            intermediate {
              tagName
              tagSlug
              problemsSolved
            }
            fundamental {
              tagName
              tagSlug
              problemsSolved
            }
          }
        }
      }
    `;
    
    return this.makeGraphQLRequest(query, { username });
  }

  async getUserContestRankingInfo(username) {
    const query = `
      query userContestRankingInfo($username: String!) {
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
          badge {
            name
          }
        }
        userContestRankingHistory(username: $username) {
          attended
          trendDirection
          problemsSolved
          totalProblems
          finishTimeInSeconds
          rating
          ranking
          contest {
            title
            startTime
          }
        }
      }
    `;
    return this.makeGraphQLRequest(query, { username });
  }

  async getUserProblemsSolved(username) {
    const query = `
      query userProblemsSolved($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          problemsSolvedBeatsStats {
            difficulty
            percentage
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;
    return this.makeGraphQLRequest(query, { username });
  }

  async getUserBadges(username) {
    const query = `
      query userBadges($username: String!) {
        matchedUser(username: $username) {
          badges {
            id
            name
            shortName
            displayName
            icon
            hoverText
            medal {
              slug
              config {
                iconGif
                iconGifBackground
              }
            }
            creationDate
            category
          }
          upcomingBadges {
            name
            icon
            progress
          }
        }
      }
    `;
    
    return this.makeGraphQLRequest(query, { username });
  }

  async getUserProfileCalendar(username, year) {
    const query = `
      query userProfileCalendar($username: String!, $year: Int) {
        matchedUser(username: $username) {
          userCalendar(year: $year) {
            activeYears
            streak
            totalActiveDays
            dccBadges {
              timestamp
              badge {
                name
                icon
              }
            }
            submissionCalendar
          }
        }
      }
    `;
    return this.makeGraphQLRequest(query, { username, year });
  }

  async getRecentAcSubmissions(username, limit = 15) {
    const query = `
      query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
          id
          title
          titleSlug
          timestamp
        }
      }
    `;
    return this.makeGraphQLRequest(query, { username, limit });
  }

  async getStreakCounter() {
    const query = `
      query getStreakCounter {
        streakCounter {
          streakCount
          daysSkipped
          currentDayCompleted
        }
      }
    `;
    
    return this.makeGraphQLRequest(query);
  }

  async getCurrentTimestamp() {
    const query = `
      query currentTimestamp {
        currentTimestamp
      }
    `;
    
    return this.makeGraphQLRequest(query);
  }

  async getQuestionOfToday() {
    const query = `
      query questionOfToday {
        activeDailyCodingChallengeQuestion {
          date
          userStatus
          link
          question {
            acRate
            difficulty
            freqBar
            frontendQuestionId: questionFrontendId
            isFavor
            paidOnly: isPaidOnly
            status
            title
            titleSlug
            hasVideoSolution
            hasSolution
            topicTags {
              name
              id
              slug
            }
          }
        }
      }
    `;
    
    return this.makeGraphQLRequest(query);
  }

  async getCodingChallengeMedal(year, month) {
    const query = `
      query codingChallengeMedal($year: Int!, $month: Int!) {
        dailyChallengeMedal(year: $year, month: $month) {
          name
          config {
            icon
          }
        }
      }
    `;
    return this.makeGraphQLRequest(query, { year, month });
  }

  async getUserActiveBadge(username) {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          activeBadge {
            displayName
            icon
          }
        }
      }
    `;
    return this.makeGraphQLRequest(query, { username });
  }

  async fetchUserComprehensiveData(username) {
    try {
      const [
        profileData,
        languageStats,
        skillStats,
        contestRanking,
        problemsSolved,
        badges,
        calendarData,
        recentSubmissions
      ] = await Promise.all([
        this.getUserPublicProfile(username),
        this.getLanguageStats(username),
        this.getSkillStats(username),
        this.getUserContestRankingInfo(username),
        this.getUserProblemsSolved(username),
        this.getUserBadges(username),
        this.getUserProfileCalendar(username),
        this.getRecentAcSubmissions(username, 15)
      ]);
  
      let contestHistory = [];
  
      if (contestRanking && Array.isArray(contestRanking.userContestRankingHistory)) {
        contestHistory = contestRanking.userContestRankingHistory.filter(
          entry => entry && entry.attended === true
        );
      }
      
      console.log(`Found ${contestHistory.length} contest history entries for ${username}`);
  
      const userData = {
        profile: profileData.matchedUser,
        languageStats: languageStats.matchedUser.languageProblemCount,
        tagProblemCounts: skillStats.matchedUser.tagProblemCounts,
        contestRanking: contestRanking.userContestRanking || {},
        contestHistory: contestHistory,
        problemsSolved: {
          solvedStats: problemsSolved.matchedUser
        },
        badges: badges.matchedUser,
        calendar: {
          activeYears: calendarData.matchedUser.userCalendar.activeYears,
          streak: calendarData.matchedUser.userCalendar.streak || 0,
          totalActiveDays: calendarData.matchedUser.userCalendar.totalActiveDays,
          dccBadges: calendarData.matchedUser.userCalendar.dccBadges
        },
        recentSubmissions: recentSubmissions.recentAcSubmissionList
      };
  
      if (calendarData.matchedUser.userCalendar && calendarData.matchedUser.userCalendar.submissionCalendar) {
        try {
          userData.submissionCalendar = JSON.parse(calendarData.matchedUser.userCalendar.submissionCalendar);
          userData.streakCount = calendarData.matchedUser.userCalendar.streak || 0;
        } catch (e) {
          console.error('Error parsing submission calendar:', e);
          userData.submissionCalendar = {};
          userData.streakCount = 0;
        }
      }
  
      return userData;
    } catch (error) {
      console.error(`Failed to fetch comprehensive data for user ${username}:`, error);
      throw error;
    }
  }

  
  async getLeetCodeContests() {
    const query = `
      query upcomingContests {
        upcomingContests {
          title
          titleSlug
          startTime
          duration
        }
      }
    `;
  
    const response = await this.makeGraphQLRequest(query, {});
  
  
    const contests = response.upcomingContests;
    if (!contests || !Array.isArray(contests)) return [];
  
    const upcomingContest = contests.filter(c => c.startTime * 1000 > Date.now());

  
    return upcomingContest.map(contest => ({
      name: contest.title,
      platform: "LeetCode",
      startTime: contest.startTime * 1000,
      endTime: (contest.startTime + contest.duration) * 1000,
      duration: `${Math.floor(contest.duration / 3600)} hours`,
      url: `https://leetcode.com/contest/${contest.titleSlug}/`
    }));
  }
  
  
}

module.exports = new LeetcodeService();