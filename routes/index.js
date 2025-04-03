const express = require('express');
const { createUser, login } = require('../controllers/users'); // Import controllers for signup and login

const router = express.Router();

// POST /signup - creates a new user
router.post('/signup', createUser);

// POST /signin - logs in a user
router.post('/signin', login);

module.exports = router;
