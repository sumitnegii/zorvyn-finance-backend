const User = require('../models/User');

const getAllUsers = async () => {
  return await User.find().select('-__v').sort({ createdAt: -1 });
};

const updateUserRole = async (userId, role) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  ).select('-__v');

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

const updateUserStatus = async (userId, status) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true, runValidators: true }
  ).select('-__v');

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

const createUser = async ({ name, email, password, role }) => {
  return await User.create({ name, email, password, role });
};

module.exports = { getAllUsers, updateUserRole, updateUserStatus, createUser };
