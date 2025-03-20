const express = require("express");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/itemController");

const router = express.Router();

// Route to get all items
router.get("/", getItems);

// Route to create a new item
router.post("/", createItem);

// Route to delete an item by itemId
router.delete("/:itemId", deleteItem);

// Route to like an item
router.put("/:itemId/likes", likeItem);

// Route to unlike an item
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
