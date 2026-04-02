const Record = require('../models/Record');

/**
 * Builds a Mongoose filter object from query params.
 */
const buildFilter = ({ type, category, startDate, endDate }) => {
  const filter = {};
  if (type) filter.type = type;
  if (category) filter.category = { $regex: new RegExp(category, 'i') };
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  return filter;
};

const getRecords = async ({ page = 1, limit = 10, type, category, startDate, endDate }) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter = buildFilter({ type, category, startDate, endDate });

  const [records, total] = await Promise.all([
    Record.find(filter)
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-__v'),
    Record.countDocuments(filter),
  ]);

  return {
    records,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

const getRecordById = async (id) => {
  const record = await Record.findById(id).populate('createdBy', 'name email').select('-__v');
  if (!record) {
    const err = new Error('Record not found');
    err.statusCode = 404;
    throw err;
  }
  return record;
};

const createRecord = async (data, userId) => {
  return await Record.create({ ...data, createdBy: userId });
};

const updateRecord = async (id, data) => {
  const record = await Record.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select('-__v');
  if (!record) {
    const err = new Error('Record not found');
    err.statusCode = 404;
    throw err;
  }
  return record;
};

const deleteRecord = async (id) => {
  const record = await Record.findByIdAndDelete(id);
  if (!record) {
    const err = new Error('Record not found');
    err.statusCode = 404;
    throw err;
  }
  return record;
};

module.exports = { getRecords, getRecordById, createRecord, updateRecord, deleteRecord };
