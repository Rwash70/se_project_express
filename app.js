require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate'); // Moved up (external before local)

const { NotFoundError } = require('./errors');
const authRoutes = require('./routes'); // /signin, /signup
const userRoutes = require('./routes/users'); // /users
const clothingItemsRoutes = require('./routes/clothingItems'); // /items
const { getItems } = require('./controllers/clothingItems');
const authMiddleware = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3001 } = process.env;

// ✅ Connect to MongoDB with error catch
mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db').catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Error connecting to MongoDB:', error);
});

// Enable CORS
app.use(cors());

// Parse incoming JSON
app.use(express.json());

// Enable request logging
app.use(requestLogger);

// Public auth routes
app.use('/', authRoutes); // /signin and /signup

// Public GET route
app.get('/items', getItems); // No auth required

// Enable auth middleware for protected routes
app.use(authMiddleware);

// Protected routes
app.use('/items', clothingItemsRoutes); // Requires auth
app.use('/users', userRoutes); // Requires auth

// Middleware for unknown routes (404)
app.use(() => {
  throw new NotFoundError('Requested resource not found');
});

// Error logger after all route handlers
app.use(errorLogger);

// Celebrate validation error handler
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === 500
        ? 'Something went wrong, please try again later'
        : message,
  });
});

// No unnecessary console.log
app.listen(PORT, '0.0.0.0');
