const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_FORBIDDEN,
} = require('../utils/constants');
const clothingItems = require('../models/clothingItems'); // Use lowercase 'clothingItems'

// GET /items — returns all clothing items
const getItems = async (req, res) => {
  try {
    const items = await clothingItems.find({});
    res.status(STATUS_OK).send(items);
  } catch (err) {
    console.error(err);
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
      owner: req.user._id, // Ensure the user's ID is added to the owner field
    });

    return res.status(STATUS_CREATED).send(newItem); // Return created item
  } catch (err) {
    console.error(err);
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
    const item = await clothingItems.findById(req.params.itemId);

    if (!item) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    }

    // Ensure the logged-in user is the owner of the item
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(STATUS_FORBIDDEN).send({
        message: 'You do not have permission to delete this item',
      });
    }

    await clothingItems.findByIdAndDelete(req.params.itemId);
    return res.status(STATUS_OK).send({ message: 'Item deleted' });
  } catch (err) {
    console.error(err);
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

// PATCH /items/:itemId/likes — like an item
const likeItem = async (req, res) => {
  try {
    const item = await clothingItems.findByIdAndUpdate(
      req.params.itemId,
      {
        $addToSet: { likes: req.user._id }, // Prevent duplicate likes
      },
      { new: true }
    );

    if (!item) {
      return res.status(STATUS_NOT_FOUND).send({
        message: 'Item not found',
      });
    }

    return res.status(STATUS_OK).send(item); // Return the updated item with new likes
  } catch (err) {
    console.error(err);
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
      { $pull: { likes: req.user._id } }, // Remove the user from likes
      { new: true }
    );

    if (!item) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    }

    return res.status(STATUS_OK).send(item); // Return the updated item after unliking
  } catch (err) {
    console.error(err);
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
