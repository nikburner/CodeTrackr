const supabase = require('../supabase/supabaseClient')

class userService {
  static async updateProfile(id, profileData) {
    // Remove fields that shouldn't be updated
    const { id: _, user_id: __, ...updateData } = profileData;
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updateData,
        updated_at: new Date()
      })
      .eq('user_id', id)
      .select('*');
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data && data.length > 0 ? data[0] : data;
  }

  static async getEmail(id) {
    const { data, error } = await supabase
      .from('auth.users')
      .select('email')
      .eq('id', id)
  
    if (error) throw new Error(error.message);
    return data?.email;
  }
  
  static async getProfile(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', id)  // Match against user_id, not id

    if (error) throw new Error(error.message);
    // Return first item if array, or empty object if no data
    return Array.isArray(data) && data.length > 0 ? data[0] : (data || {});
  }
}

module.exports = userService;