// utils/config.js
require('dotenv').config(); // Load environment variables

// Destructure to extract JWT_SECRET directly
const { JWT_SECRET = 'dev-key' } = process.env;

module.exports = {
  JWT_SECRET,
};
