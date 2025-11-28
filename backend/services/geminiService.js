const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getRecommendations = async (solveHistory) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `You are a competitive programming coach. Analyze this user's CodeForces solve history and provide personalized problem recommendations for skill growth.

Solve History:
${JSON.stringify(solveHistory, null, 2)}

Based on this data, provide:
1. Current skill level assessment
2. Strengths and weaknesses
3. 5 specific CodeForces problem recommendations with problem codes and difficulty ratings
4. Focus areas for improvement

Keep your response concise and actionable. Format as JSON with keys: skillLevel, strengths, weaknesses, recommendations (array with problemCode, difficulty, reason), focusAreas.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from response
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      // Try parsing directly
      return JSON.parse(text);
    } catch (parseError) {
      // If JSON parsing fails, return structured text
      return {
        skillLevel: 'Analysis Complete',
        strengths: [],
        weaknesses: [],
        recommendations: [],
        focusAreas: [],
        rawText: text
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate recommendations');
  }
};

module.exports = {
  getRecommendations
};
