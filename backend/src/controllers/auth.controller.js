const { registerUser, loginUser } = require('../services/auth.service');
const { registerSchema, loginSchema } = require('../schemas/zodSchemas');
const { sendSuccess, sendError, sendValidationError } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return sendValidationError(res, parsed.error.errors);

    const result = await registerUser(parsed.data);
    return sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return sendValidationError(res, parsed.error.errors);

    const result = await loginUser(parsed.data);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  return sendSuccess(res, req.user);
};

module.exports = { register, login, getMe };
