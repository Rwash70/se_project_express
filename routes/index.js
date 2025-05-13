const express = require('express');
const { createUser, login } = require('../controllers/users'); // Import controllers for signup and login
const {
  validateUserInfo,
  validateLogin,
} = require('../middlewares/validation');

const router = express.Router();

// POST /signup - creates a new user
router.post('/signup', validateUserInfo, createUser);

// POST /signin - logs in a user
router.post('/signin', validateLogin, login);

module.exports = router;
