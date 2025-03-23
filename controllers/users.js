const User = require('../models/users');
const {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

// GET /users — returns all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'An error occurred while retrieving users' });
  }
};

// GET /users/:userId - returns a user by _id
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail(() => {
      const error = new Error('User not found');
      error.statusCode = STATUS_NOT_FOUND;
      throw error;
    });

    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(STATUS_BAD_REQUEST)
        .send({ message: 'Invalid ID format' });
    }

    // Handle other types of errors
    if (process.env.NODE_ENV !== 'production') {
      console.error(err);
    }

    if (err.statusCode) {
      return res.status(err.statusCode).send({ message: err.message });
    }

    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Internal server error' });
  }
};

// POST /users — creates a new user
const createUser = async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const user = await User.create({ name, avatar });
    return res.status(201).send(user); // Added return
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res
        .status(STATUS_BAD_REQUEST)
        .send({ message: 'Invalid data format or missing required fields' });
    }
    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Internal server error' });
  }
};

module.exports = { getUsers, getUser, createUser };
