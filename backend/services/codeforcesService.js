const axios = require("axios");

const API_BASE = "https://codeforces.com/api";

const getUserInfo = async (handle) => {
  try {
    const { data } = await axios.get(`${API_BASE}/user.info?handles=${handle}`);
    return data.result[0];
  } catch (error) {
    throw new Error("Failed to fetch user info from Codeforces");
  }
};

const getUserRating = async (handle) => {
  try {
    const { data } = await axios.get(
      `${API_BASE}/user.rating?handle=${handle}`
    );
    return data.result;
  } catch (error) {
    throw new Error("Failed to fetch rating history");
  }
};

const getUserSubmissions = async (handle) => {
  try {
    const { data } = await axios.get(
      `${API_BASE}/user.status?handle=${handle}&from=1&count=1000`
    );
    return data.result;
  } catch (error) {
    throw new Error("Failed to fetch submissions");
  }
};
const getCodeforcesContests = async () => {
  try {
    const response = await axios.get(
      "https://codeforces.com/api/contest.list?gym=false"
    );

    const contests = response.data.result
      .filter((contest) => contest.phase === "BEFORE")
      .map((contest) => ({
        name: contest.name,
        platform: "Codeforces",
        startTime: contest.startTimeSeconds * 1000, // Convert to milliseconds
        endTime: (contest.startTimeSeconds + contest.durationSeconds) * 1000,
        duration: contest.durationSeconds / 3600 + " hours", // Convert seconds to hours
        url: `https://codeforces.com/contests/${contest.id}`,
      }));

    return contests;
  } catch (error) {
    console.error("Codeforces API Error:", error.message);
    throw new Error("Failed to fetch Codeforces contests");
  }
};

module.exports = {
  getUserInfo,
  getUserRating,
  getUserSubmissions,
  getCodeforcesContests,
};
