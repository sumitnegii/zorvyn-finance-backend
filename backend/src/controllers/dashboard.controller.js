const dashboardService = require('../services/dashboard.service');
const { sendSuccess } = require('../utils/apiResponse');

const summary = async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary();
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

const categoryBreakdown = async (req, res, next) => {
  try {
    const data = await dashboardService.getCategoryBreakdown();
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

const trends = async (req, res, next) => {
  try {
    const data = await dashboardService.getTrends();
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

const recentActivity = async (req, res, next) => {
  try {
    const data = await dashboardService.getRecentActivity();
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

module.exports = { summary, categoryBreakdown, trends, recentActivity };
