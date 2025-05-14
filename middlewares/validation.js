// middleware/validation.js

const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

// 1. Validate clothing item body when an item is created
const validateClothingItem = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    imageUrl: Joi.string()
      .custom((value, helpers) => {
        if (!validator.isURL(value)) {
          return helpers.message('Invalid URL format');
        }
        return value;
      })
      .required(),
    weather: Joi.string().valid('hot', 'warm', 'cold').required(), // weather added as required
  }),
});

// 2. Validate user info body when a user is created
const validateUserInfo = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(), // Corrected field name
    avatar: Joi.string()
      .custom((value, helpers) => {
        if (!validator.isURL(value)) {
          return helpers.message('Invalid avatar URL format');
        }
        return value;
      })
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});

// 3. Validate authentication when a user logs in
const validateLogin = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});

// 4. Validate user and clothing item IDs when accessed
const validateId = celebrate({
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
});

const validateItemId = celebrate({
  params: Joi.object({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

const validateUserProfileUpdate = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string()
      .custom((value, helpers) => {
        if (!validator.isURL(value)) {
          return helpers.message('Invalid avatar URL format');
        }
        return value;
      })
      .required(),
  }),
});

module.exports = {
  validateClothingItem,
  validateUserInfo,
  validateLogin,
  validateId,
  validateItemId,
  validateUserProfileUpdate,
};
