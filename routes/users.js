const express = require('express');
const { getCurrentUser, updateUserProfile } = require('../controllers/users'); // Import updateUserProfile

const router = express.Router();

// Route to get current user details
router.get('/me', getCurrentUser);

// Route to update current user's profile
router.patch('/me', updateUserProfile);

module.exports = router;
