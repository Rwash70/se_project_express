const mongoose = require('mongoose');
const { STATUS_OK, STATUS_CREATED } = require('../utils/constants');
const clothingItems = require('../models/clothingItems');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  InternalServerError,
} = require('../errors');

// GET /items — returns all clothing items
const getItems = async (req, res, next) => {
  try {
    const items = await clothingItems.find({});
    res.status(STATUS_OK).send(items);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(err);
    }
    next(new InternalServerError('Internal server error'));
  }
};

// POST /items — create a new clothing item
const createItem = async (req, res, next) => {
  const { name, weather, imageUrl } = req.body || {};
  if (!name || !weather || !imageUrl) {
    // Instead of returning response here, throw error to be handled centrally
    return next(new BadRequestError('Missing required fields'));
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
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Invalid item data'));
    }
    return next(new InternalServerError('Failed to create item'));
  }
};

// DELETE /items/:itemId — delete a clothing item
const deleteItem = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return next(new BadRequestError('Invalid item ID'));
  }

  try {
    const item = await clothingItems.findById(req.params.itemId);

    if (!item) {
      return next(new NotFoundError('Item not found'));
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return next(
        new ForbiddenError('You do not have permission to delete this item'),
      );
    }

    await clothingItems.findByIdAndDelete(req.params.itemId);
    return res.status(STATUS_OK).send({ message: 'Item deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid item ID'));
    }
    return next(
      new InternalServerError('An error occurred while deleting the item'),
    );
  }
};

// PUT /items/:itemId/like — like a clothing item
const likeItem = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return next(new BadRequestError('Invalid item ID'));
  }

  try {
    const item = await clothingItems.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!item) {
      return next(new NotFoundError('Item not found'));
    }

    return res.status(STATUS_OK).send(item);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid item ID'));
    }
    return next(
      new InternalServerError('An error occurred while liking the item'),
    );
  }
};

// PUT /items/:itemId/dislike — dislike a clothing item
const dislikeItem = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return next(new BadRequestError('Invalid item ID'));
  }

  try {
    const item = await clothingItems.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!item) {
      return next(new NotFoundError('Item not found'));
    }

    return res.status(STATUS_OK).send(item);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid item ID'));
    }
    return next(
      new InternalServerError('An error occurred while unliking the item'),
    );
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
