require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { STATUS_NOT_FOUND } = require('./utils/constants');

const authRoutes = require('./routes'); // /signin, /signup
const userRoutes = require('./routes/users'); // /users
const clothingItemsRoutes = require('./routes/clothingItems'); // /items
const { getItems } = require('./controllers/clothingItems');
const authMiddleware = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger'); // Import loggers

const app = express();
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db').catch((error) => {
  // Error logging in case of failure
  console.error('Error connecting to MongoDB:', error);
});

// Enable CORS
app.use(cors());

// Parse incoming JSON
app.use(express.json());

// Enable the request logger before all route handlers
app.use(requestLogger);

// Public auth routes
app.use('/', authRoutes); // /signin and /signup

// Public GET route for all items (No auth required)
app.get('/items', getItems); // Public route for fetching items

// Apply auth middleware for all protected routes (below)
app.use(authMiddleware);

// Protected routes
app.use('/items', clothingItemsRoutes); // POST, DELETE, LIKE (requires auth)
app.use('/users', userRoutes); // User routes (requires auth)

// Enable the error logger after routes and before error handlers
app.use(errorLogger); // enabling the error logger

// Celebrate validation error handler
const { errors } = require('celebrate');
app.use(errors()); // celebrate error handler

// 404 Handler
app.use((req, res) => {
  res
    .status(STATUS_NOT_FOUND)
    .send({ message: 'Requested resource not found' });
});

// Centralized error handler (custom error handler to manage uncaught errors)
// Define the errorHandler function here
const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error
  res.status(500).send({
    message: 'Something went wrong, please try again later',
    error: err.message, // Optional: you can send the error message in development
  });
};

app.use(errorHandler); // Attach error handler

app.listen(PORT, '0.0.0.0');
