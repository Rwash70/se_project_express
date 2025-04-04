const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const { STATUS_NOT_FOUND } = require('./utils/constants'); // Import the constant

const userRoutes = require('./routes'); // Import routes from routes/index.js
const clothingItemsRoutes = require('./routes/clothingItems');
const { getItems } = require('./controllers/clothingItems'); // Import getItems controller
const authMiddleware = require('./middlewares/auth'); // Import the auth middleware

const app = express();

const { PORT = 3001 } = process.env;

// Connect to MongoDB (removed deprecated options)
mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error:', error); // Log or handle the error
  });

// Enable CORS for all routes
app.use(cors());

// Use express.json() to parse incoming JSON data
app.use(express.json());

// Public routes (signin, signup, items) will not use the auth middleware
app.use('/signin', userRoutes); // Sign in route is public
app.use('/signup', userRoutes); // Sign up route is public

// Public route for retrieving all items (before authMiddleware)
app.get('/items', getItems); // Public route for getting all items

// Items route is public (for creating, liking, deleting items)
app.use('/items', clothingItemsRoutes); // Items route is public

// Protected routes will use the auth middleware
app.use(authMiddleware); // Apply the auth middleware globally for all routes below this line

// Protected user routes (they will require authentication)
app.use('/users', userRoutes); // All user routes are now protected by auth middleware

// 404 handler for routes that don't exist
app.use((req, res) => {
  res
    .status(STATUS_NOT_FOUND)
    .send({ message: 'Requested resource not found' });
});

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
