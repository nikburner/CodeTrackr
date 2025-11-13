const express = require('express');
const router = express.Router();
const { getUpcomingContests } = require('../controllers/contestController');

router.get('/upcoming', getUpcomingContests);

module.exports = router;