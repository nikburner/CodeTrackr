const axios = require("axios");
const cheerio = require("cheerio");

const codechefService = {
  
  async extractProfileData(username) {
    try {
      const response = await axios.get(
        `https://www.codechef.com/users/${username}`
      );
      const $ = cheerio.load(response.data);
      
      // Basic profile info
      const rating = $(".rating-number").text().trim();
      const fullName = $(".h2-style").text().trim();
      const profileImage = $(".user-details-container img").attr("src");

      // Extract stars (from rating header)
      const ratingHeader = $(".rating-header").text().trim();
      const starsMatch = ratingHeader.match(/★+/);
      const stars = starsMatch ? starsMatch[0].length : 0;

      // Extract highest rating
      const highestRatingMatch = $(".rating-header small").text().match(/\d+/);
      const highestRating = highestRatingMatch ? parseInt(highestRatingMatch[0], 10) : 0;

      // Extract ranks
      const rankElements = $(".rating-ranks .inline-list strong");
      const globalRank = rankElements.eq(0).text().trim();
      const countryRank = rankElements.eq(1).text().trim();

      // NEW ROBUST METHOD TO GET PROBLEMS SOLVED COUNT
      let problemsSolved = 0;
      
      // Method 1: Check the problems solved section
      const solvedSection = $('h5:contains("Fully Solved")');
      if (solvedSection.length) {
        const countText = solvedSection.next().text().trim();
        const countMatch = countText.match(/\d+/);
        if (countMatch) {
          problemsSolved = parseInt(countMatch[0], 10);
        }
      }
      
      // Method 2: Fallback to searching in content (for older profiles)
      if (problemsSolved === 0) {
        const content = $('body').text();
        const solvedMatch = content.match(/Total Problems Solved:\s*(\d+)/i);
        if (solvedMatch) {
          problemsSolved = parseInt(solvedMatch[1], 10);
        }
      }

      // Method 3: Final fallback - count all solved problem links
      if (problemsSolved === 0) {
        problemsSolved = $('a[href*="/status/"]').length;
      }

      return {
        username,
        fullName,
        profileImage,
        rating,
        stars,
        highestRating,
        ranks: {
          global: globalRank,
          country: countryRank
        },
        problemsSolved
      };
    } catch (error) {
      console.error("Error extracting profile data:", error);
      throw new Error("Failed to extract profile data");
    }
  },

  async extractSubmissionHeatmap(username) {
    try {
      const apiUrl = `https://codechef-api.vercel.app/handle/${username}`;
      console.log(`Fetching heatmap data from API: ${apiUrl}`);

      const response = await axios.get(apiUrl);

      if (!response.data || !response.data.success) {
        console.error("API returned error:", response.data);
        throw new Error("Failed to fetch heatmap data from API");
      }

      const heatmapData = response.data.heatMap || [];

      const activeDays = heatmapData.length;

      // Calculate total submissions
      let totalSubmissions = 0;
      heatmapData.forEach((day) => {
        totalSubmissions += parseInt(day.value || 0);
      });

      const formattedData = heatmapData.map((day) => ({
        date: day.date,
        count: parseInt(day.value || 0),
      }));

      // Return the formatted data
      return {
        activeDays,
        totalSubmissions,
        heatmapData: formattedData,
      };
    } catch (error) {
      console.error("Error extracting submission heatmap:", error);
      throw new Error(`Failed to extract submission heatmap: ${error.message}`);
    }
  },

  async extractContestGraph(username) {
    try {
      // Fetch the contest data
      const response = await axios.get(
        `https://www.codechef.com/users/${username}`
      );
      const $ = cheerio.load(response.data);

      const contestData = [];

      // Extract contest data from the rating graph
      const scripts = $("script").toArray();
      for (const script of scripts) {
        const content = $(script).html() || "";
        if (content.includes("all_rating")) {
          const match = content.match(/all_rating\s*=\s*(\[.*?\]);/s);
          if (match && match[1]) {
            try {
              const ratingData = new Function(`return ${match[1]}`)();

              // Format contest data
              contestData.push(
                ...ratingData.map((contest) => ({
                  contestCode: contest.code,
                  contestName: contest.name,
                  rating: contest.rating,
                  rank: contest.rank,
                  date: new Date(contest.end_date).toISOString().split("T")[0],
                }))
              );
            } catch (e) {
              console.error("Error parsing contest data:", e);
            }
          }
        }
      }

      // Calculate statistics
      const contestsParticipated = contestData.length;
      let highestRating = 0;
      let bestRank = Infinity;

      if (contestData.length > 0) {
        highestRating = Math.max(...contestData.map((c) => c.rating));
        bestRank = Math.min(...contestData.map((c) => c.rank));
      }

      return {
        contestsParticipated,
        highestRating,
        bestRank,
        contestHistory: contestData,
      };
    } catch (error) {
      console.error("Error extracting contest graph:", error);
      throw new Error("Failed to extract contest graph");
    }
  },

  async analyzeProfile(username) {
    try {
      // Get all the data first with proper error handling
      const [profileData, heatmapData, contestData] = await Promise.all([
        this.extractProfileData(username).catch(e => {
          console.error('Error in extractProfileData:', e);
          return { problemsSolved: 0 };
        }),
        this.extractSubmissionHeatmap(username).catch(e => {
          console.error('Error in extractSubmissionHeatmap:', e);
          return { activeDays: 0, totalSubmissions: 0, heatmapData: [] };
        }),
        this.extractContestGraph(username).catch(e => {
          console.error('Error in extractContestGraph:', e);
          return { contestsParticipated: 0, highestRating: 0, bestRank: Infinity, contestHistory: [] };
        })
      ]);

      // Safely parse problems solved
      const totalProblemsSolved = typeof profileData.problemsSolved === 'number' 
        ? profileData.problemsSolved 
        : 0;

      // Analyze activity patterns
      const activeDays = heatmapData.activeDays || 0;
      const activityRate = activeDays / 365; // Activity as percentage of the year

      // Calculate contest performance metrics
      const contestsParticipated = contestData.contestsParticipated || 0;
      let ratingTrend = 0;
      
      if (contestData.contestHistory.length >= 2) {
        ratingTrend = contestData.contestHistory[contestData.contestHistory.length - 1].rating - 
                     contestData.contestHistory[0].rating;
      }

      return {
        username: username,
        summary: {
          totalProblemsSolved,
          activeDays,
          activityRate: activityRate.toFixed(2),
          contestsParticipated,
          highestRating: contestData.highestRating || 0,
          bestRank: contestData.bestRank === Infinity ? 0 : contestData.bestRank,
          ratingTrend,
        },
        strengths: {
          strongestCategory: "General", // Default since we removed breakdown
          problemsSolvedInCategory: totalProblemsSolved // Using total as fallback
        }
      };
    } catch (error) {
      console.error("Error analyzing profile:", error);
      throw new Error("Failed to analyze profile");
    }
  },

  async getCodeChefContests() {
    try {
      const response = await axios.get(
        "https://www.codechef.com/api/list/contests/all",
        {
          headers: {
            // Some CodeChef APIs require these headers
            Accept: "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
          },
        }
      );

      const currentTime = Date.now();

      const contests = response.data.future_contests
        .filter((contest) => {
          const contestTime = new Date(contest.contest_start_date).getTime();
          return contestTime > currentTime;
        })
        .map((contest) => ({
          name: contest.contest_name,
          platform: "CodeChef",
          startTime: new Date(contest.contest_start_date).getTime(),
          endTime: new Date(contest.contest_end_date).getTime(),
          duration: contest.contest_duration / 60 + " hours",
          url: `https://www.codechef.com/${contest.contest_code}`,
        }));

      return contests;
    } catch (error) {
      console.error("CodeChef API Error:", error.message);
      throw new Error("Failed to fetch CodeChef contests");
    }
  },
};

module.exports = codechefService;