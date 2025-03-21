const {
  STATUS_OK,
  STATUS_CREATED, // Added STATUS_CREATED
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');
const clothingItems = require('../models/clothingItems'); // Use lowercase 'clothingItems'

// GET /items — returns all clothing items
const getItems = async (req, res) => {
  try {
    const items = await clothingItems.find({});
    res.status(STATUS_OK).send(items);
  } catch (err) {
    res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Internal server error' });
  }
};

// POST /items — creates a new item
const createItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body;

  try {
    const newItem = await clothingItems.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id, // Assign the user's ID to the owner field
    });

    return res.status(STATUS_CREATED).send(newItem); // Ensure you return here
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res
        .status(STATUS_BAD_REQUEST)
        .send({ message: 'Invalid item data' });
    }

    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Failed to create item' });
  }
};

// DELETE /items/:itemId — deletes an item by _id
const deleteItem = async (req, res) => {
  try {
    const item = await clothingItems.findByIdAndDelete(req.params.itemId);

    if (!item) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    }

    return res.status(STATUS_OK).send({ message: 'Item deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(STATUS_BAD_REQUEST)
        .send({ message: 'Invalid item ID' });
    }

    return res.status(STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'An error occurred while deleting the item',
    });
  }
};

// PUT /items/:itemId/likes — like an item
const likeItem = async (req, res) => {
  try {
    const item = await clothingItems.findByIdAndUpdate(
      req.params.itemId,
      {
        $addToSet: { likes: req.user._id }, // Added underscore to `id`
      },
      { new: true },
    );

    if (!item) {
      return res.status(STATUS_NOT_FOUND).send({
        message: 'Item not found',
      });
    }

    return res.status(STATUS_OK).send(item); // Explicitly return after sending response
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(STATUS_BAD_REQUEST)
        .send({ message: 'Invalid item ID' });
    }

    return res.status(STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'An error occurred while liking the item',
    });
  }
};

// DELETE /items/:itemId/likes — unlike an item
const dislikeItem = async (req, res) => {
  try {
    const item = await clothingItems.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } }, // Added underscore to `id`
      { new: true },
    );

    if (!item) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    }

    return res.status(STATUS_OK).send(item); // Explicit return here
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(STATUS_BAD_REQUEST)
        .send({ message: 'Invalid item ID' });
    }

    return res.status(STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'An error occurred while unliking the item',
    });
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
