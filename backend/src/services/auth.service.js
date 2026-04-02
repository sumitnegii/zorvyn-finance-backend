const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

/**
 * Registers a new user.
 * The first user ever created is automatically assigned ADMIN role.
 */
const registerUser = async ({ name, email, password }) => {
  const userCount = await User.countDocuments();
  const role = userCount === 0 ? 'ADMIN' : 'VIEWER';

  const user = await User.create({ name, email, password, role });
  const token = signToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

/**
 * Authenticates a user and returns a JWT.
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  if (user.status !== 'ACTIVE') {
    const err = new Error('Your account has been deactivated');
    err.statusCode = 403;
    throw err;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

module.exports = { registerUser, loginUser };
