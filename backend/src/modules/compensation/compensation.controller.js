const apiResponse = require('../../utils/apiResponse');
const casesService = require('../cases/cases.service');
const compensationService = require('./compensation.service');

function buildPredictionPayload(details) {
  return {
    state: details.state,
    district: details.district,
    land_area_acres: Number(details.land_area_acres),
    land_type: details.land_type,
    soil_type: details.soil_type,
    irrigation_type: details.irrigation_type,
    water_availability_score: Number(details.water_availability_score),
    crop_type: details.crop_type,
    crop_yield_per_acre: Number(details.crop_yield_per_acre),
    season: details.season,
    distance_to_road_km: Number(details.distance_to_road_km),
    distance_to_highway_km: Number(details.distance_to_highway_km),
    distance_to_city_km: Number(details.distance_to_city_km),
    distance_to_market_km: Number(details.distance_to_market_km),
    nearby_projects: details.nearby_projects,
    avg_land_price_per_acre: Number(details.avg_land_price_per_acre),
    guideline_value: Number(details.guideline_value),
    previous_compensation:
      details.previous_compensation !== null
        ? Number(details.previous_compensation)
        : null,
    acquisition_type: details.acquisition_type,
    urgency_level: details.urgency_level,
  };
}

async function calculateCompensation(req, res, next) {
  try {
    const { case_id } = req.body;
    const details = await compensationService.getLandDetailsForCase(case_id);
    if (!details) {
      return apiResponse.error(res, 'Land details not found for case', 404);
    }

    const market_value_per_acre = Math.max(
      Number(details.avg_land_price_per_acre),
      Number(details.guideline_value)
    );
    const multiplier = Number(details.distance_to_city_km) > 50 ? 2.0 : 1.0;
    const solatium_per_acre = market_value_per_acre * 1.0;
    const land_area_acres = Number(details.land_area_acres);
    const calculated_value =
      market_value_per_acre * multiplier * land_area_acres +
      solatium_per_acre * land_area_acres;

    const updated = await compensationService.upsertCompensationCalculated(
      case_id,
      {
        market_value_per_acre,
        multiplier,
        solatium_per_acre,
        calculated_value,
      }
    );

    const response = {
      case_id,
      breakdown: {
        market_value_per_acre,
        multiplier,
        multiplier_basis:
          Number(details.distance_to_city_km) > 50
            ? 'rural (>50km from city)'
            : 'urban (<=50km from city)',
        solatium_per_acre,
        land_area_acres,
        calculated_value,
      },
      statutory_basis: 'RFCTLARR Act 2013, Sections 26-30',
    };

    return apiResponse.success(res, response, 200, {
      compensation_id: updated.id,
    });
  } catch (error) {
    return next(error);
  }
}

async function predictCompensation(req, res, next) {
  try {
    const { case_id } = req.body;
    const details = await compensationService.getLandDetailsForCase(case_id);
    if (!details) {
      return apiResponse.error(res, 'Land details not found for case', 404);
    }

    const payload = buildPredictionPayload(details);
    const mlResponse = await compensationService.callMlService(payload);

    await compensationService.upsertCompensationPrediction(
      case_id,
      mlResponse.predicted_compensation,
      mlResponse.top_features || null
    );

    return apiResponse.success(res, { case_id, ...mlResponse });
  } catch (error) {
    if (error.code === 'ML_UNAVAILABLE') {
      return apiResponse.error(res, 'ML service unavailable', 503);
    }
    return next(error);
  }
}

async function getCompensation(req, res, next) {
  try {
    const caseId = req.params.id;
    const caseRow = await casesService.getCaseById(caseId, req.user);
    if (!caseRow) {
      return apiResponse.error(res, 'Case not found', 404);
    }

    const row = await compensationService.getCompensationByCase(caseId);
    if (!row) {
      return apiResponse.error(res, 'Compensation not found', 404);
    }
    return apiResponse.success(res, row);
  } catch (error) {
    if (error.code === 'FORBIDDEN') {
      return apiResponse.error(res, 'Forbidden', 403);
    }
    return next(error);
  }
}

module.exports = {
  calculateCompensation,
  predictCompensation,
  getCompensation,
};
