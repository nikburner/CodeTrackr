const userService = require('../services/userService');

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profileData = req.body;

    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Unauthorized to update this profile' });
    }

    const updatedProfile = await userService.updateProfile(id, profileData);
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('getProfile called - req.user.id:', req.user.id, 'param id:', id);
    
    if (req.user.id !== id) {
      console.log('Authorization failed - user id does not match');
      return res.status(403).json({ error: 'Unauthorized to access this profile' });
    }

    const profile = await userService.getProfile(id);
    console.log('Profile retrieved:', profile);
    res.json(profile);
  } catch (error) {
    console.error('getProfile error:', error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.getEmail = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Unauthorized to access this email' });
    }

    const email = await userService.getEmail(id);
    res.json(email);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};