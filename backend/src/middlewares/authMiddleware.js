const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/apiResponse');

/**
 * protect — verifies the JWT in the Authorization header.
 * Attaches the authenticated user to req.user.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. Please login.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, 'Authentication required. Please login.', 401);
    }

    if (user.status !== 'ACTIVE') {
      return sendError(res, 'Your account has been deactivated. Please contact an administrator.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid token. Please login again.', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token expired. Please login again.', 401);
    }
    return sendError(res, 'Authentication failed.', 500);
  }
};

/**
 * restrictTo — factory function that returns middleware restricting access
 * to specific roles only.
 *
 * Usage: router.get('/...', protect, restrictTo('ADMIN'), handler)
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Access Denied: Your role (${req.user.role}) is not permitted to perform this action.`,
        403
      );
    }
    next();
  };
};

module.exports = { protect, restrictTo };
