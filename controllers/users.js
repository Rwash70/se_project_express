const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { JWT_SECRET } = require('../utils/config');

// Custom error classes
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require('../errors/customErrors');

// GET /users/me - returns the current authenticated user
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return res.status(200).send({
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      id: user._id,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /users/me — update the current user's profile (name and avatar)
const updateUserProfile = async (req, res, next) => {
  const { name, avatar } = req.body;

  try {
    if (!name && !avatar) {
      throw new BadRequestError(
        'You must provide at least one field (name or avatar) to update.'
      );
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    const updatedUser = await user.save();

    return res.status(200).send({
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      email: updatedUser.email,
      id: updatedUser._id,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(
        new BadRequestError('Invalid data format or missing required fields')
      );
    }
    next(err);
  }
};

// POST /users — creates a new user
const createUser = async (req, res, next) => {
  const { email, password, name, avatar } = req.body;

  try {
    if (!email || !password || !name || !avatar) {
      throw new BadRequestError(
        'All fields (email, password, name, avatar) are required'
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Email already in use');
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
      return next(
        new BadRequestError('Invalid data format or missing required fields')
      );
    }
    next(err);
  }
};

// POST /users/login - login a user and return a JWT token
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).send({ token });
  } catch (err) {
    if (err.message === 'Incorrect email or password') {
      return next(new UnauthorizedError('Incorrect email or password'));
    }
    next(err);
  }
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateUserProfile,
};
