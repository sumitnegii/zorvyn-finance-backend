/**
 * Unified API response helpers.
 * All endpoints use these to return consistent JSON shapes.
 */

const sendSuccess = (res, data, statusCode = 200, meta = {}) => {
  const payload = { success: true, data };
  if (Object.keys(meta).length > 0) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

const sendError = (res, message = 'Internal Server Error', statusCode = 500) => {
  return res.status(statusCode).json({ success: false, error: message });
};

const sendValidationError = (res, zodErrors) => {
  const details = zodErrors.map((e) => ({ field: e.path.join('.'), message: e.message }));
  return res.status(400).json({ success: false, error: 'Validation Error', details });
};

module.exports = { sendSuccess, sendError, sendValidationError };
