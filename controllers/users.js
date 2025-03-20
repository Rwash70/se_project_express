const users = require('../models/users');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/errors');

// GET /users — returns all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'An error occurred while retrieving users' });
  }
};

// GET /users/:userId - returns a user by _id
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail(() => {
      const error = new Error('User not found');
      error.statusCode = NOT_FOUND;
      throw error;
    });
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      return res.status(err.statusCode).send({ message: err.message });
    }
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'An error occurred while retrieving the user' });
  }
};

// POST /users — creates a new user
const createUser = async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const user = await User.create({ name, avatar });
    res.status(201).send(user);
  } catch (err) {
    console.error(err);
    res.status(BAD_REQUEST).send({ message: 'Invalid user data' });
  }
};

module.exports = { getUsers, getUser, createUser };
