const clothingItems = require('../models/clothingItems'); // Use lowercase 'clothingItems'

// GET /items — returns all clothing items
const getItems = async (req, res) => {
  try {
    const items = await clothingItems.find({});
    res.status(200).send(items);
  } catch (err) {
    res
      .status(500)
      .send({ message: 'An error occurred while retrieving items' });
  }
};

// POST /items — creates a new item
const createItem = async (req, res) => {
  const { name, weather, imageUrl, owner } = req.body;
  try {
    const item = await clothingItems.create({ name, weather, imageUrl, owner });
    res.status(201).send(item);
  } catch (err) {
    res.status(400).send({ message: 'Invalid item data' });
  }
};

// DELETE /items/:itemId — deletes an item by _id
const deleteItem = async (req, res) => {
  try {
    const item = await clothingItems.findByIdAndDelete(req.params.itemId);
    if (!item) {
      return res.status(404).send({ message: 'Item not found' });
    }
    res.status(200).send({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).send({
      message: 'An error occurred while deleting the item',
    });
  } // <-- Missing closing brace added here
};

// PUT /items/:itemId/likes — like an item
const likeItem = async (req, res) => {
  try {
    const item = await clothingItems.findByIdAndUpdate(
      req.params.itemId,
      {
        $addToSet: { likes: req.user.id }, // Use 'id' instead of '_id'
      },
      { new: true },
    );

    if (!item) {
      return res.status(404).send({ message: 'Item not found' });
    }

    return res.status(200).send(item); // Explicitly return after sending response
  } catch (err) {
    return res.status(500).send({
      message: 'An error occurred while liking the item',
    });
  }
};

// DELETE /items/:itemId/likes — unlike an item
const dislikeItem = async (req, res) => {
  try {
    const item = await clothingItems.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user.id } }, // Use 'id' instead of '_id'
      { new: true },
    );
    if (!item) {
      return res.status(404).send({ message: 'Item not found' });
    }
    res.status(200).send(item);
  } catch (err) {
    res
      .status(500)
      .send({ message: 'An error occurred while unliking the item' });
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
