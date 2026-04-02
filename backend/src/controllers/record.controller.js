const recordService = require('../services/record.service');
const { createRecordSchema, updateRecordSchema } = require('../schemas/zodSchemas');
const { sendSuccess, sendValidationError } = require('../utils/apiResponse');

const listRecords = async (req, res, next) => {
  try {
    const { page, limit, type, category, startDate, endDate } = req.query;
    const { records, meta } = await recordService.getRecords({ page, limit, type, category, startDate, endDate });
    return sendSuccess(res, records, 200, meta);
  } catch (error) {
    next(error);
  }
};

const getRecord = async (req, res, next) => {
  try {
    const record = await recordService.getRecordById(req.params.id);
    return sendSuccess(res, record);
  } catch (error) {
    next(error);
  }
};

const createRecord = async (req, res, next) => {
  try {
    const parsed = createRecordSchema.safeParse(req.body);
    if (!parsed.success) return sendValidationError(res, parsed.error.errors);

    const record = await recordService.createRecord(parsed.data, req.user._id);
    return sendSuccess(res, record, 201);
  } catch (error) {
    next(error);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const parsed = updateRecordSchema.safeParse(req.body);
    if (!parsed.success) return sendValidationError(res, parsed.error.errors);

    const record = await recordService.updateRecord(req.params.id, parsed.data);
    return sendSuccess(res, record);
  } catch (error) {
    next(error);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    await recordService.deleteRecord(req.params.id);
    return sendSuccess(res, { message: 'Record deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listRecords, getRecord, createRecord, updateRecord, deleteRecord };
