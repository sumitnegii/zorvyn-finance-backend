const Record = require('../models/Record');

/**
 * Returns total income, total expenses, and net balance.
 */
const getSummary = async () => {
  const result = await Record.aggregate([
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
      },
    },
  ]);

  const summary = { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
  result.forEach((item) => {
    if (item._id === 'INCOME') summary.totalIncome = item.total;
    if (item._id === 'EXPENSE') summary.totalExpenses = item.total;
  });
  summary.netBalance = summary.totalIncome - summary.totalExpenses;
  return summary;
};

/**
 * Returns totals grouped by category.
 */
const getCategoryBreakdown = async () => {
  return await Record.aggregate([
    {
      $group: {
        _id: { category: '$category', type: '$type' },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.category',
        breakdown: {
          $push: { type: '$_id.type', total: '$total', count: '$count' },
        },
        categoryTotal: { $sum: '$total' },
      },
    },
    { $sort: { categoryTotal: -1 } },
  ]);
};

/**
 * Returns monthly income vs expense for the last 12 months.
 */
const getTrends = async () => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  return await Record.aggregate([
    { $match: { date: { $gte: twelveMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type',
        },
        total: { $sum: '$amount' },
      },
    },
    {
      $group: {
        _id: { year: '$_id.year', month: '$_id.month' },
        data: { $push: { type: '$_id.type', total: '$total' } },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
};

/**
 * Returns the 10 most recent financial records.
 */
const getRecentActivity = async () => {
  return await Record.find()
    .populate('createdBy', 'name')
    .sort({ date: -1 })
    .limit(10)
    .select('-__v');
};

module.exports = { getSummary, getCategoryBreakdown, getTrends, getRecentActivity };
