const apiResponse = require('../../utils/apiResponse');
const workflowService = require('./workflow.service');
const casesService = require('../cases/cases.service');

async function submitCase(req, res, next) {
  try {
    const caseId = req.params.id;
    const caseRow = await casesService.getCaseById(caseId, req.user);
    if (!caseRow) {
      return apiResponse.error(res, 'Case not found', 404);
    }
    const result = await workflowService.submitCase(caseId, req.user.sub);
    return apiResponse.success(res, result);
  } catch (error) {
    if (error.code === 'FORBIDDEN') {
      return apiResponse.error(res, 'Forbidden', 403);
    }
    if (error.code === 'INVALID_STATUS') {
      return apiResponse.error(res, 'Case must be in draft status', 409);
    }
    if (error.code === 'NOT_FOUND') {
      return apiResponse.error(res, 'Case not found', 404);
    }
    return next(error);
  }
}

async function approveCase(req, res, next) {
  try {
    const caseId = req.params.id;
    const { final_value, notes } = req.body;
    const caseRow = await casesService.getCaseById(caseId, req.user);
    if (!caseRow) {
      return apiResponse.error(res, 'Case not found', 404);
    }

    const result = await workflowService.approveCase(
      caseId,
      req.user.sub,
      final_value,
      notes
    );
    return apiResponse.success(res, result);
  } catch (error) {
    if (error.code === 'INVALID_STATUS') {
      return apiResponse.error(res, 'Case must be under review', 409);
    }
    if (error.code === 'NOT_FOUND') {
      return apiResponse.error(res, 'Case not found', 404);
    }
    return next(error);
  }
}

async function rejectCase(req, res, next) {
  try {
    const caseId = req.params.id;
    const { reason } = req.body;
    const caseRow = await casesService.getCaseById(caseId, req.user);
    if (!caseRow) {
      return apiResponse.error(res, 'Case not found', 404);
    }
    const result = await workflowService.rejectCase(caseId, req.user.sub, reason);
    return apiResponse.success(res, result);
  } catch (error) {
    if (error.code === 'INVALID_STATUS') {
      return apiResponse.error(res, 'Case must be under review', 409);
    }
    if (error.code === 'NOT_FOUND') {
      return apiResponse.error(res, 'Case not found', 404);
    }
    return next(error);
  }
}

async function assignCase(req, res, next) {
  try {
    const caseId = req.params.id;
    const { officer_id } = req.body;
    const caseRow = await casesService.getCaseById(caseId, req.user);
    if (!caseRow) {
      return apiResponse.error(res, 'Case not found', 404);
    }
    const result = await workflowService.assignCase(
      caseId,
      req.user.sub,
      officer_id
    );
    return apiResponse.success(res, result);
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return apiResponse.error(res, 'Case not found', 404);
    }
    return next(error);
  }
}

async function submitToAuthority(req, res, next) {
  try {
    const caseId = req.params.id;
    const caseRow = await casesService.getCaseById(caseId, req.user);
    if (!caseRow) {
      return apiResponse.error(res, 'Case not found', 404);
    }
    const report = await workflowService.submitToAuthority(caseId, req.user.sub);
    return apiResponse.success(res, report);
  } catch (error) {
    if (error.code === 'INVALID_STATUS') {
      return apiResponse.error(res, 'Case must be approved', 409);
    }
    if (error.code === 'NOT_FOUND') {
      return apiResponse.error(res, 'Case not found', 404);
    }
    return next(error);
  }
}

module.exports = {
  submitCase,
  approveCase,
  rejectCase,
  assignCase,
  submitToAuthority,
};
