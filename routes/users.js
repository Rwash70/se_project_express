const express = require('express');
const { getUsers, getUser, createUser } = require('../controllers/users');

const router = express.Router();

// Removed 'users' from the path since it's already defined in app.js
router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);

module.exports = router;
