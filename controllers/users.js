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

// GET /users — returns all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'An error occurred while retrieving users',
    });
  }
};

// GET /users/me - returns the current authenticated user
const getCurrentUser = async (req, res) => {
  try {
    // Find the user using the ID from req.user (from the auth middleware)
    const user = await User.findById(req.user._id);

    // If user is not found, return a 404 error
    if (!user) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'User not found' });
    }

    // Respond with the user data (excluding the password)
    return res.status(200).send({
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    });
  } catch (err) {
    // If there is an error, log it and send a 500 error response
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
    // Check if at least one field is provided to update
    if (!name && !avatar) {
      return res.status(STATUS_BAD_REQUEST).send({
        message:
          'You must provide at least one field (name or avatar) to update.',
      });
    }

    // Find the user by _id (this will be set in the req.user by the auth middleware)
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'User not found' });
    }

    // Update the user's profile with the provided fields
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    // Save the updated user
    const updatedUser = await user.save();

    // Return the updated user (excluding the password)
    return res.status(200).send({
      message: 'User profile updated successfully',
      user: { name: updatedUser.name, avatar: updatedUser.avatar },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Internal server error' });
  }
};

// POST /users — creates a new user
const createUser = async (req, res) => {
  const {
    email, password, name, avatar,
  } = req.body;

  try {
    // Validate that the email and password are provided
    if (!email || !password || !name || !avatar) {
      return res.status(STATUS_BAD_REQUEST).send({
        message: 'All fields (email, password, name, avatar) are required',
      });
    }

    // Check if email is already in use (unique constraint)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(STATUS_CONFLICT)
        .send({ message: 'Email already in use' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      avatar,
    });

    // Exclude the password before sending the response
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

  try {
    // Use the custom method to find user by credentials
    const user = await User.findUserByCredentials(email, password);

    // Create a JWT token with the user's _id and an expiration of 7 days
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Send the token in the response
    return res.status(200).send({ token });
  } catch (err) {
    // If the credentials are incorrect, send a 401 Unauthorized error
    return res
      .status(STATUS_UNAUTHORIZED)
      .send({ message: 'Incorrect email or password' });
  }
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  login,
  updateUserProfile, // Export the new updateUserProfile controller
};
