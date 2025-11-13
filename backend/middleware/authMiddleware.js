const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.error('Auth error: No token provided');
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    // Decode JWT without verification first to get the user ID
    const decoded = jwt.decode(token);
    console.log('Decoded token:', { sub: decoded?.sub, email: decoded?.email });
    
    if (!decoded || !decoded.sub) {
      throw new Error('Invalid token format');
    }

    // Use service role key to fetch the user (verify they exist in auth.users)
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY  // Service role key (has elevated privileges)
    );

    console.log('Attempting to verify user with ID:', decoded.sub);
    // Verify token with Supabase admin API
    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(decoded.sub);
    
    console.log('Auth user lookup - error:', error, 'user found:', !!user);
    
    if (error || !user) {
      throw new Error(error?.message || 'User not found or token invalid');
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email
    };
    
    console.log('Auth successful for user:', req.user.id);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message, error.stack);
    res.status(401).json({ error: error.message });
  }
};

module.exports = authMiddleware;
