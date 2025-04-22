const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_CONFLICT,
  STATUS_UNAUTHORIZED,
} = require('../utils/constants');
const { JWT_SECRET } = require('../utils/config'); // Import the JWT secret

// GET /users/me - returns the current authenticated user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'User not found' });
    }

    return res.status(200).send({
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      id: user._id,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Internal server error' });
  }
};

// PATCH /users/me — update the current user's profile (name and avatar)
const updateUserProfile = async (req, res) => {
  const { name, avatar } = req.body;

  try {
    if (!name && !avatar) {
      return res.status(STATUS_BAD_REQUEST).send({
        message:
          'You must provide at least one field (name or avatar) to update.',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    const updatedUser = await user.save();

    return res.status(200).send({
      message: 'User profile updated successfully',
      user: { name: updatedUser.name, avatar: updatedUser.avatar },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(STATUS_BAD_REQUEST).send({
        message: 'Invalid data format or missing required fields',
      });
    }

    console.error(err);
    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Internal server error' });
  }
};

// POST /users — creates a new user
const createUser = async (req, res) => {
  const { email, password, name, avatar } = req.body;

  try {
    if (!email || !password || !name || !avatar) {
      return res.status(STATUS_BAD_REQUEST).send({
        message: 'All fields (email, password, name, avatar) are required',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(STATUS_CONFLICT)
        .send({ message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      avatar,
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(201).send({
      message: 'User created successfully',
      user: {
        email: userWithoutPassword.email,
        name: userWithoutPassword.name,
        avatar: userWithoutPassword.avatar,
      },
    });
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

// POST /users/login - login a user and return a JWT token
const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email or password are missing
  if (!email || !password) {
    return res.status(STATUS_BAD_REQUEST).send({
      message: 'Email and password are required',
    });
  }

  try {
    // Use the custom method to find user by credentials
    const user = await User.findUserByCredentials(email, password);

    // Create a JWT token with the user's _id and an expiration of 7 days
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Send the token in the response
    return res.status(200).send({ token });
  } catch (err) {
    // Check if the error message is related to incorrect credentials
    if (err.message === 'Incorrect email or password') {
      return res
        .status(STATUS_UNAUTHORIZED)
        .send({ message: 'Incorrect email or password' });
    }

    // For any other error, return a 500 Internal Server Error
    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Internal server error' });
  }
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateUserProfile,
};
