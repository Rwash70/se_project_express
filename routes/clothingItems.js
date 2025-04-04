const express = require('express');
const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingItems');

const router = express.Router();

// Route to create a new item
router.post('/', createItem);

// Route to delete an item by itemId
router.delete('/:itemId', deleteItem);

// Route to like an item
router.put('/:itemId/likes', likeItem);

// Route to unlike an item
router.delete('/:itemId/likes', dislikeItem);

module.exports = router;
