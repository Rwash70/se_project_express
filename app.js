const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/users');
const clothingItemsRoutes = require('./routes/clothingItems');

const app = express();

const {
  PORT = 3001,
} = process.env;

mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(express.json());

// Temporary authorization middleware
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // Replace with the test user ID from Postman
  };
  next();
});

app.use('/users', userRoutes);
app.use('/items', clothingItemsRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
