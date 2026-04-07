const axios = require('axios');
const { query } = require('../../config/db');
const { ML_SERVICE_URL } = require('../../config/env');

const axiosClient = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: 5000,
});

async function getLandDetailsForCase(caseId) {
  const result = await query(
    `SELECT ld.*, lc.acquisition_type, lc.urgency_level, lc.farmer_id
     FROM land_details ld
     JOIN land_cases lc ON lc.id = ld.case_id
     WHERE ld.case_id = $1`,
    [caseId]
  );
  return result.rows[0] || null;
}

async function getCompensationByCase(caseId) {
  const result = await query(
    `SELECT * FROM compensation WHERE case_id = $1`,
    [caseId]
  );
  return result.rows[0] || null;
}

async function upsertCompensationCalculated(caseId, values) {
  const result = await query(
    `INSERT INTO compensation (
        case_id, market_value_per_acre, multiplier, solatium_per_acre, calculated_value
     )
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (case_id) DO UPDATE SET
        market_value_per_acre = EXCLUDED.market_value_per_acre,
        multiplier = EXCLUDED.multiplier,
        solatium_per_acre = EXCLUDED.solatium_per_acre,
        calculated_value = EXCLUDED.calculated_value,
        updated_at = NOW()
     RETURNING *`,
    [
      caseId,
      values.market_value_per_acre,
      values.multiplier,
      values.solatium_per_acre,
      values.calculated_value,
    ]
  );
  return result.rows[0];
}

async function upsertCompensationPrediction(caseId, predictedValue, featureImportance) {
  const result = await query(
    `INSERT INTO compensation (case_id, predicted_value, feature_importance)
     VALUES ($1, $2, $3)
     ON CONFLICT (case_id) DO UPDATE SET
        predicted_value = EXCLUDED.predicted_value,
        feature_importance = EXCLUDED.feature_importance,
        updated_at = NOW()
     RETURNING *`,
    [caseId, predictedValue, featureImportance]
  );
  return result.rows[0];
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
