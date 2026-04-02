const { getAllUsers, updateUserRole, updateUserStatus, createUser } = require('../services/user.service');
const { updateRoleSchema, updateStatusSchema, createUserSchema } = require('../schemas/zodSchemas');
const { sendSuccess, sendValidationError } = require('../utils/apiResponse');

const listUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    return sendSuccess(res, users);
  } catch (error) {
    next(error);
  }
};

const setUserRole = async (req, res, next) => {
  try {
    const parsed = updateRoleSchema.safeParse(req.body);
    if (!parsed.success) return sendValidationError(res, parsed.error.errors);

    const user = await updateUserRole(req.params.id, parsed.data.role);
    return sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

const setUserStatus = async (req, res, next) => {
  try {
    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) return sendValidationError(res, parsed.error.errors);

    const user = await updateUserStatus(req.params.id, parsed.data.status);
    return sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

const createNewUser = async (req, res, next) => {
  try {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) return sendValidationError(res, parsed.error.errors);

    const user = await createUser(parsed.data);
    return sendSuccess(res, user, 201);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }
    next(error);
  }
};

module.exports = { listUsers, setUserRole, setUserStatus, createNewUser };
