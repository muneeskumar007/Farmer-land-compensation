const { query } = require('../../config/db');

async function upsertLandDetails(caseId, payload) {
  const result = await query(
    `INSERT INTO land_details (
        case_id, state, district, taluk, village, pincode, latitude, longitude,
        land_area_acres, gis_area_acres, area_discrepancy_flag, land_type, soil_type,
        irrigation_type, water_availability_score, crop_type, crop_yield_per_acre,
        season, distance_to_road_km, distance_to_highway_km, distance_to_city_km,
        distance_to_market_km, nearby_projects, avg_land_price_per_acre, guideline_value,
        previous_compensation
     )
     VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22, $23, $24, $25, $26
     )
     ON CONFLICT (case_id) DO UPDATE SET
        state = EXCLUDED.state,
        district = EXCLUDED.district,
        taluk = EXCLUDED.taluk,
        village = EXCLUDED.village,
        pincode = EXCLUDED.pincode,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        land_area_acres = EXCLUDED.land_area_acres,
        gis_area_acres = EXCLUDED.gis_area_acres,
        area_discrepancy_flag = EXCLUDED.area_discrepancy_flag,
        land_type = EXCLUDED.land_type,
        soil_type = EXCLUDED.soil_type,
        irrigation_type = EXCLUDED.irrigation_type,
        water_availability_score = EXCLUDED.water_availability_score,
        crop_type = EXCLUDED.crop_type,
        crop_yield_per_acre = EXCLUDED.crop_yield_per_acre,
        season = EXCLUDED.season,
        distance_to_road_km = EXCLUDED.distance_to_road_km,
        distance_to_highway_km = EXCLUDED.distance_to_highway_km,
        distance_to_city_km = EXCLUDED.distance_to_city_km,
        distance_to_market_km = EXCLUDED.distance_to_market_km,
        nearby_projects = EXCLUDED.nearby_projects,
        avg_land_price_per_acre = EXCLUDED.avg_land_price_per_acre,
        guideline_value = EXCLUDED.guideline_value,
        previous_compensation = EXCLUDED.previous_compensation
     RETURNING *`,
    [
      caseId,
      payload.state,
      payload.district,
      payload.taluk,
      payload.village,
      payload.pincode,
      payload.latitude,
      payload.longitude,
      payload.land_area_acres,
      payload.gis_area_acres,
      payload.area_discrepancy_flag,
      payload.land_type,
      payload.soil_type,
      payload.irrigation_type,
      payload.water_availability_score,
      payload.crop_type,
      payload.crop_yield_per_acre,
      payload.season,
      payload.distance_to_road_km,
      payload.distance_to_highway_km,
      payload.distance_to_city_km,
      payload.distance_to_market_km,
      payload.nearby_projects,
      payload.avg_land_price_per_acre,
      payload.guideline_value,
      payload.previous_compensation,
    ]
  );
  return result.rows[0];
}

async function getLandDetails(caseId) {
  const result = await query(
    `SELECT * FROM land_details WHERE case_id = $1`,
    [caseId]
  );
  return result.rows[0] || null;
}

module.exports = {
  upsertLandDetails,
  getLandDetails,
};
