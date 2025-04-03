const express = require('express');
const {
  getUsers,
  getCurrentUser,
  updateUserProfile,
} = require('../controllers/users'); // Import updateUserProfile

const router = express.Router();

// GET /users — returns all users
router.get('/', getUsers);

// GET /users/me - returns the current authenticated user
router.get('/me', getCurrentUser);

// PATCH /users/me — update the current user's profile (name and avatar)
router.patch('/me', updateUserProfile); // New route for updating user profile

module.exports = router;
