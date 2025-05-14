const express = require('express');
const { getCurrentUser, updateUserProfile } = require('../controllers/users'); // Import updateUserProfile
const { validateUserProfileUpdate } = require('../middlewares/validation'); // Import validation

const router = express.Router();

// Route to get current user details
router.get('/me', getCurrentUser);

// Route to update current user's profile
router.patch('/me', validateUserProfileUpdate, updateUserProfile);

module.exports = router;
