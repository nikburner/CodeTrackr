const codechefService = require("../services/codechefService");
const axios = require('axios');
const codechefController = {
  
  async getProfileData(req, res) {
    try {
      const { username } = req.params;
      if (!username) {
        return res.status(400).json({ error: "Username is required" });
      }
      const profileData = await codechefService.extractProfileData(username);
      return res.status(200).json(profileData);
    } catch (error) {
      console.error("Error in getProfileData:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to extract profile data" });
    }
  },

  async getAnalysis(req, res) {
    try {
      const { username } = req.params;

      if (!username) {
        return res.status(400).json({ error: "Username is required" });
      }

      // Get all the data in parallel for better performance
      const [analysisData, heatmapData, contestData, profileData] =
        await Promise.all([
          codechefService.analyzeProfile(username),
          codechefService.extractSubmissionHeatmap(username),
          codechefService.extractContestGraph(username),
          codechefService.extractProfileData(username),
        ]);

      // Combine all data into a single response object
      const completeAnalysis = {
        profileInfo: profileData,
        analysis: analysisData,
        submissionHeatmap: heatmapData,
        contestGraph: contestData,
      };

      return res.status(200).json(completeAnalysis);
    } catch (error) {
      console.error("Error in getAnalysis:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to analyze profile" });
    }
  },

  async getSubmissionHeatmap(req, res) {
    try {
      const { username } = req.params;

      if (!username) {
        return res.status(400).json({ error: "Username is required" });
      }

      const heatmapData = await codechefService.extractSubmissionHeatmap(
        username
      );
      return res.status(200).json(heatmapData);
    } catch (error) {
      console.error("Error in getSubmissionHeatmap:", error);
      return res
        .status(500)
        .json({
          error: error.message || "Failed to extract submission heatmap",
        });
    }
  },

  async getContestGraph(req, res) {
    try {
      const { username } = req.params;

      if (!username) {
        return res.status(400).json({ error: "Username is required" });
      }

      const contestData = await codechefService.extractContestGraph(username);
      return res.status(200).json(contestData);
    } catch (error) {
      console.error("Error in getContestGraph:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to extract contest graph" });
    }
  },
  async getTotalProblemsSolved(username) {
    const apiUrl = `https://codechef-api.vercel.app/${username}`;
    const response = await axios.get(apiUrl);
    return response.data.fullySolved || 0; // Check the actual API response structure
  },
};

module.exports = codechefController;
