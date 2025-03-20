const ClothingItem = require("../models/ClothingItem");

// GET /items — returns all clothing items
const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    res.status(200).send(items);
  } catch (err) {
    res
      .status(500)
      .send({ message: "An error occurred while retrieving items" });
  }
};

// POST /items — creates a new item
const createItem = async (req, res) => {
  const { name, weather, imageUrl, owner } = req.body;
  try {
    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    res.status(201).send(item);
  } catch (err) {
    res.status(400).send({ message: "Invalid item data" });
  }
};

// DELETE /items/:itemId — deletes an item by _id
const deleteItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndDelete(req.params.itemId);
    if (!item) {
      return res.status(404).send({ message: "Item not found" });
    }
    res.status(200).send({ message: "Item deleted" });
  } catch (err) {
    res
      .status(500)
      .send({ message: "An error occurred while deleting the item" });
  }
};

// PUT /items/:itemId/likes — like an item
const likeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } }, // Add user._id to the likes array if it's not already there
      { new: true },
    );
    if (!item) {
      return res.status(404).send({ message: "Item not found" });
    }
    res.status(200).send(item);
  } catch (err) {
    res
      .status(500)
      .send({ message: "An error occurred while liking the item" });
  }
};

// DELETE /items/:itemId/likes — unlike an item
const dislikeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } }, // Remove user._id from the likes array
      { new: true },
    );
    if (!item) {
      return res.status(404).send({ message: "Item not found" });
    }
    res.status(200).send(item);
  } catch (err) {
    res
      .status(500)
      .send({ message: "An error occurred while unliking the item" });
  }
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
