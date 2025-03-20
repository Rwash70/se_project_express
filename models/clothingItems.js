const mongoose = require('mongoose');

// Define the clothingItem schema
const clothingItemschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ['hot', 'warm', 'cold'], // The weather types allowed
  },
  imageUrl: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Array of User references for those who liked the item
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to current date and time
  },
});

// Create the clothingItem model
const clothingItems = mongoose.model('clothingItems', clothingItemschema);

module.exports = clothingItems;
