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
    minlength: 6, // Ensure the password is at least 6 characters long
    select: false, // This ensures the password is not returned in queries by default
  },
});

// Pre-save hook to hash the password before saving it
userSchema.pre('save', async function (next) {
  const user = this;
  // Only hash the password if it is new or modified
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8); // Hash password with 8 salt rounds
  }
  next();
});

// Add method to find a user by credentials (email and password)
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password') // Include the password field explicitly for this query
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }

      // Compare the password with the hash in the database
      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return Promise.reject(new Error('Incorrect email or password'));
        }

        return user; // Return the user if password matches
      });
    });
};

// Create the user model and export it
module.exports = mongoose.model('User', userSchema);
