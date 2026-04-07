const apiResponse = require('../../utils/apiResponse');
const casesService = require('../cases/cases.service');
const landService = require('./landDetails.service');

function computeDiscrepancy(landArea, gisArea) {
  if (!gisArea || !landArea) {
    return { flag: false, warning: null };
  }
  const diffRatio = Math.abs(landArea - gisArea) / landArea;
  if (diffRatio > 0.05) {
    return {
      flag: true,
      warning:
        'Area discrepancy exceeds 5% threshold. Manual verification required.',
    };
  }
  return { flag: false, warning: null };
}

async function upsertLandDetails(req, res, next) {
  try {
    const caseId = req.params.id;
    const caseRow = await casesService.getCaseById(caseId, req.user);
    if (!caseRow) {
      return apiResponse.error(res, 'Case not found', 404);
    }

    const { flag, warning } = computeDiscrepancy(
      req.body.land_area_acres,
      req.body.gis_area_acres
    );

    const payload = {
      ...req.body,
      area_discrepancy_flag: flag,
    };

    const saved = await landService.upsertLandDetails(caseId, payload);

    const response = warning
      ? { land_details: saved, warning }
      : { land_details: saved };

    return apiResponse.success(res, response, 201);
  } catch (error) {
    if (error.code === 'FORBIDDEN') {
      return apiResponse.error(res, 'Forbidden', 403);
    }
    return next(error);
  }
}

async function getLandDetails(req, res, next) {
  try {
    const caseId = req.params.id;
    const caseRow = await casesService.getCaseById(caseId, req.user);
    if (!caseRow) {
      return apiResponse.error(res, 'Case not found', 404);
    }

    const details = await landService.getLandDetails(caseId);
    if (!details) {
      return apiResponse.error(res, 'Land details not found', 404);
    }
    return apiResponse.success(res, details);
  } catch (error) {
    if (error.code === 'FORBIDDEN') {
      return apiResponse.error(res, 'Forbidden', 403);
    }
    return next(error);
  }
}

module.exports = {
  upsertLandDetails,
  getLandDetails,
};
