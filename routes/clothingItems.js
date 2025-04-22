const express = require('express');
const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingItems'); // Assuming these functions are in the 'controllers/clothingItems.js' file

const router = express.Router();

// Route to create a new item
router.post('/', createItem);

// Route to delete an item by itemId
router.delete('/:itemId', deleteItem);

// Route to like an item
router.patch('/:itemId/like', likeItem); // Updated to PATCH from PUT

// Route to unlike an item
router.delete('/:itemId/like', dislikeItem);

module.exports = router;
