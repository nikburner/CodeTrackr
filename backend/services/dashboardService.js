const supabase = require('../supabase/supabaseClient');

class DashboardService {
  // Contest Ranking Info Methods
  static async upsertContestRankingInfo(userId, contestData) {
    const { data, error } = await supabase
      .from('contest_ranking_info')
      .upsert({
        id: userId,
        ...contestData,
        updated_at: new Date()
      })
      .select('*');
    
    if (error) throw new Error(error.message);
    return data;
  }

  static async getContestRankingInfo(userId) {
    const { data, error } = await supabase
      .from('contest_ranking_info')
      .select('*')
      .eq('id', userId);
    
    if (error) throw new Error(error.message);
    return data;
  }

  // Total Questions Methods
  static async upsertTotalQuestions(userId, questionsData) {
    const { data, error } = await supabase
      .from('total_questions')
      .upsert({
        id: userId,
        ...questionsData,
        updated_at: new Date()
      })
      .select('*');
    
    if (error) throw new Error(error.message);
    return data;
  }

  static async getTotalQuestions(userId) {
    const { data, error } = await supabase
      .from('total_questions')
      .select('*')
      .eq('id', userId);
    
    if (error) throw new Error(error.message);
    return data;
  }

  // Combined Dashboard Data
  static async getDashboardData(userId) {
    const [contestData, questionsData] = await Promise.all([
      this.getContestRankingInfo(userId),
      this.getTotalQuestions(userId)
    ]);
    
    return {
      contest_ranking_info: contestData,
      total_questions: questionsData
    };
  }
}

module.exports = DashboardService;