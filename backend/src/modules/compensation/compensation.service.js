const axios = require('axios');
const { Compensation, LandCase, LandDetails } = require('../../models');
const { ML_SERVICE_URL } = require('../../config/env');

const axiosClient = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: 5000,
});

async function getLandDetailsForCase(caseId) {
  const landDetails = await LandDetails.findOne({ case_id: caseId }).lean();
  if (!landDetails) {
    return null;
  }

  const landCase = await LandCase.findById(caseId).lean();
  if (!landCase) {
    return null;
  }

  return {
    id: landDetails._id.toString(),
    case_id: landDetails.case_id ? landDetails.case_id.toString() : null,
    state: landDetails.state,
    district: landDetails.district,
    taluk: landDetails.taluk,
    village: landDetails.village,
    pincode: landDetails.pincode,
    latitude: landDetails.latitude,
    longitude: landDetails.longitude,
    land_area_acres: landDetails.land_area_acres,
    gis_area_acres: landDetails.gis_area_acres,
    area_discrepancy_flag: landDetails.area_discrepancy_flag,
    land_type: landDetails.land_type,
    soil_type: landDetails.soil_type,
    irrigation_type: landDetails.irrigation_type,
    water_availability_score: landDetails.water_availability_score,
    crop_type: landDetails.crop_type,
    crop_yield_per_acre: landDetails.crop_yield_per_acre,
    season: landDetails.season,
    distance_to_road_km: landDetails.distance_to_road_km,
    distance_to_highway_km: landDetails.distance_to_highway_km,
    distance_to_city_km: landDetails.distance_to_city_km,
    distance_to_market_km: landDetails.distance_to_market_km,
    nearby_projects: landDetails.nearby_projects,
    avg_land_price_per_acre: landDetails.avg_land_price_per_acre,
    guideline_value: landDetails.guideline_value,
    previous_compensation: landDetails.previous_compensation,
    created_at: landDetails.created_at,
    acquisition_type: landCase.acquisition_type,
    urgency_level: landCase.urgency_level,
    farmer_id: landCase.farmer_id ? landCase.farmer_id.toString() : null,
  };
}

async function getCompensationByCase(caseId) {
  const doc = await Compensation.findOne({ case_id: caseId });
  if (!doc) {
    return null;
  }

  return {
    id: doc._id.toString(),
    case_id: doc.case_id ? doc.case_id.toString() : null,
    market_value_per_acre: doc.market_value_per_acre,
    multiplier: doc.multiplier,
    solatium_per_acre: doc.solatium_per_acre,
    calculated_value: doc.calculated_value,
    predicted_value: doc.predicted_value,
    final_value: doc.final_value,
    feature_importance: doc.feature_importance,
    approval_status: doc.approval_status,
    approved_by: doc.approved_by ? doc.approved_by.toString() : null,
    approved_at: doc.approved_at,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
}

async function upsertCompensationCalculated(caseId, values) {
  const doc = await Compensation.findOneAndUpdate(
    { case_id: caseId },
    {
      $set: {
        market_value_per_acre: values.market_value_per_acre,
        multiplier: values.multiplier,
        solatium_per_acre: values.solatium_per_acre,
        calculated_value: values.calculated_value,
      },
      $setOnInsert: { case_id: caseId },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  return {
    id: doc._id.toString(),
    case_id: doc.case_id ? doc.case_id.toString() : null,
    market_value_per_acre: doc.market_value_per_acre,
    multiplier: doc.multiplier,
    solatium_per_acre: doc.solatium_per_acre,
    calculated_value: doc.calculated_value,
    predicted_value: doc.predicted_value,
    final_value: doc.final_value,
    feature_importance: doc.feature_importance,
    approval_status: doc.approval_status,
    approved_by: doc.approved_by ? doc.approved_by.toString() : null,
    approved_at: doc.approved_at,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
}

async function upsertCompensationPrediction(caseId, predictedValue, featureImportance) {
  const doc = await Compensation.findOneAndUpdate(
    { case_id: caseId },
    {
      $set: {
        predicted_value: predictedValue,
        feature_importance: featureImportance,
      },
      $setOnInsert: { case_id: caseId },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  return {
    id: doc._id.toString(),
    case_id: doc.case_id ? doc.case_id.toString() : null,
    market_value_per_acre: doc.market_value_per_acre,
    multiplier: doc.multiplier,
    solatium_per_acre: doc.solatium_per_acre,
    calculated_value: doc.calculated_value,
    predicted_value: doc.predicted_value,
    final_value: doc.final_value,
    feature_importance: doc.feature_importance,
    approval_status: doc.approval_status,
    approved_by: doc.approved_by ? doc.approved_by.toString() : null,
    approved_at: doc.approved_at,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
}

async function callMlService(payload) {
  try {
    const response = await axiosClient.post('/predict', payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 503) {
      try {
        const retryResponse = await axiosClient.post('/predict', payload);
        return retryResponse.data;
      } catch (retryError) {
        const err = new Error('ML service unavailable');
        err.code = 'ML_UNAVAILABLE';
        throw err;
      }
    }
    const err = new Error('ML service unavailable');
    err.code = 'ML_UNAVAILABLE';
    throw err;
  }
}

module.exports = {
  getLandDetailsForCase,
  getCompensationByCase,
  upsertCompensationCalculated,
  upsertCompensationPrediction,
  callMlService,
};
