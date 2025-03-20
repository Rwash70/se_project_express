const mongoose = require('mongoose');
const validator = require('validator');

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
});

// Create the user model
module.exports = mongoose.model('User', userSchema);
