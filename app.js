const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { STATUS_NOT_FOUND } = require('./utils/constants');

const authRoutes = require('./routes'); // /signin, /signup
const userRoutes = require('./routes/users'); // /users
const clothingItemsRoutes = require('./routes/clothingItems'); // /items
const { getItems } = require('./controllers/clothingItems');
const authMiddleware = require('./middlewares/auth');

const app = express();
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error:', error));

// Enable CORS
app.use(cors());

// Parse incoming JSON
app.use(express.json());

// Public auth routes
app.use('/', authRoutes); // /signin and /signup

// Public GET route for all items (No auth required)
app.get('/items', getItems); // Public route for fetching items

// Apply auth middleware for all protected routes (below)
app.use(authMiddleware);

// Protected routes
app.use('/items', clothingItemsRoutes); // POST, DELETE, LIKE (requires auth)
app.use('/users', userRoutes); // User routes (requires auth)

// 404 Handler
app.use((req, res) => {
  res
    .status(STATUS_NOT_FOUND)
    .send({ message: 'Requested resource not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
