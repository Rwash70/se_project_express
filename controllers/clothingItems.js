const mongoose = require('mongoose');
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_FORBIDDEN,
} = require('../utils/constants');
const clothingItems = require('../models/clothingItems');
const InternalServerError = require('../errors/InternalServerError');

// GET /items — returns all clothing items
const getItems = async (req, res, next) => {
  try {
    const items = await clothingItems.find({});
    res.status(STATUS_OK).send(items);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(err);
    }
    next(new InternalServerError('Internal server error')); // res
    //   .status(STATUS_INTERNAL_SERVER_ERROR)
    //   .send({ message: 'Internal server error' });
  }
};

const createItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body || {};
  if (!name || !weather || !imageUrl) {
    return res
      .status(STATUS_BAD_REQUEST)
      .send({ message: 'Missing required fields' });
  }

  try {
    const newItem = await clothingItems.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });

    return res.status(STATUS_CREATED).send(newItem);
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

const deleteItem = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
  }

  try {
    const item = await clothingItems.findById(req.params.itemId);

    if (!item) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return res
        .status(STATUS_FORBIDDEN)
        .send({ message: 'You do not have permission to delete this item' });
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

    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'An error occurred while deleting the item' });
  }
};

const likeItem = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
  }

  try {
    const item = await clothingItems.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!item) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    }

    return res.status(STATUS_OK).send(item);
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res
        .status(STATUS_BAD_REQUEST)
        .send({ message: 'Invalid item ID' });
    }

    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'An error occurred while liking the item' });
  }
};

const dislikeItem = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
  }

  try {
    const item = await clothingItems.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!item) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    }

    return res.status(STATUS_OK).send(item);
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res
        .status(STATUS_BAD_REQUEST)
        .send({ message: 'Invalid item ID' });
    }

    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
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
