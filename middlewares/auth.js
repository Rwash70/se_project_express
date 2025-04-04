const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config'); // Import the JWT_SECRET from the config file
const { STATUS_UNAUTHORIZED } = require('../utils/constants'); // Import the STATUS_UNAUTHORIZED constant

// Middleware to check the authorization token
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // If there's no Authorization header, return 401 error using the constant
  if (!authorization) {
    return res
      .status(STATUS_UNAUTHORIZED)
      .send({ message: 'Authorization required' });
  }

  // Extract the token from the Authorization header (Bearer <token>)
  const token = authorization.replace('Bearer ', '');

  try {
    // Verify the token using the secret key
    const payload = jwt.verify(token, JWT_SECRET);

    // Attach the payload to req.user
    req.user = payload;

    // Proceed to the next middleware/route handler
    return next();
  } catch (err) {
    // If token is invalid, return 401 error using the constant
    return res.status(STATUS_UNAUTHORIZED).send({ message: 'Unauthorized' });
  }
};

module.exports = auth;
