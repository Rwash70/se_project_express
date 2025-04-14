const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Invalid URL format for avatar',
    },
  },
  email: {
    type: String,
    required: true, // Email is required
    unique: true, // Ensure the email is unique
    validate: {
      validator: (value) => validator.isEmail(value), // Validate the email format
      message: 'Invalid email format',
    },
  },
  password: {
    type: String,
    required: true, // Password is required
    select: false, // This ensures the password is not returned in queries by default
  },
});

// Add method to find a user by credentials (email and password)
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }

      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return Promise.reject(new Error('Incorrect email or password'));
        }
        return user;
      });
    });
};

// Create the user model and export it
module.exports = mongoose.model('User', userSchema);
