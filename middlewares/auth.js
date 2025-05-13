const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

// Custom error class
const { UnauthorizedError } = require('../errors/customErrors');

// Middleware to check the authorization token
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new UnauthorizedError('Authorization required');
  }

  if (!authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authorization token must be in Bearer format');
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token expired');
    }

    throw new UnauthorizedError('Unauthorized');
  }
};

module.exports = auth;
