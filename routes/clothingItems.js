const express = require('express');
const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingItems');

const {
  validateClothingItem,
  validateItemId,
} = require('../middlewares/validation'); // adjust the path if needed

const router = express.Router();

// Route to create a new item with body validation
router.post('/', validateClothingItem, createItem);

// Routes using :itemId param — validate the ID format
router.delete('/:itemId', validateItemId, deleteItem);
router.patch('/:itemId/likes', validateItemId, likeItem);
router.delete('/:itemId/likes', validateItemId, dislikeItem);

module.exports = router;
