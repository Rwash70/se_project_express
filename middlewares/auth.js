const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const { STATUS_UNAUTHORIZED } = require('../utils/constants');

// Middleware to check the authorization token
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(STATUS_UNAUTHORIZED)
      .send({ message: 'Authorization required' });
  }

  if (!authorization.startsWith('Bearer ')) {
    return res
      .status(STATUS_UNAUTHORIZED)
      .send({ message: 'Authorization token must be in Bearer format' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(STATUS_UNAUTHORIZED).send({ message: 'Token expired' });
    }

    return res.status(STATUS_UNAUTHORIZED).send({ message: 'Unauthorized' });
  }
};

module.exports = auth;
