const apiResponse = require('../../utils/apiResponse');
const casesService = require('./cases.service');

async function createCase(req, res, next) {
  try {
    const { acquisition_type, urgency_level, farmer_id } = req.body;
    const farmerId =
      req.user.role === 'farmer' ? req.user.sub : farmer_id || req.user.sub;

    const created = await casesService.createCase(
      farmerId,
      acquisition_type,
      urgency_level
    );
    return apiResponse.success(res, created, 201);
  } catch (error) {
    return next(error);
  }
}

async function getCaseById(req, res, next) {
  try {
    const caseId = req.params.id;
    const row = await casesService.getCaseById(caseId, req.user);
    if (!row) {
      return apiResponse.error(res, 'Case not found', 404);
    }
    return apiResponse.success(res, row);
  } catch (error) {
    if (error.code === 'FORBIDDEN') {
      return apiResponse.error(res, 'Forbidden', 403);
    }
    return next(error);
  }
}

async function getCases(req, res, next) {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const status = req.query.status || null;

    const result = await casesService.getCases({ status }, page, limit);
    return apiResponse.success(res, result.data, 200, {
      total: result.total,
      page: result.page,
      pages: result.pages,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createCase,
  getCaseById,
  getCases,
};
