const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Add friend (directly adds as accepted for simplicity)
router.post('/add', friendController.addFriend);

// Get all friends
router.get('/', friendController.getFriends);

// Remove friend
router.delete('/:friendId', friendController.removeFriend);

// Search users by codeforces handle
router.get('/search/:handle', friendController.searchUserByHandle);

module.exports = router;
