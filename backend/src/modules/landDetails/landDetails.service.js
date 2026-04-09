const { LandDetails } = require('../../models');

function formatLandDetails(doc) {
  if (!doc) {
    return null;
  }
  return {
    id: doc._id.toString(),
    case_id: doc.case_id ? doc.case_id.toString() : null,
    state: doc.state,
    district: doc.district,
    taluk: doc.taluk,
    village: doc.village,
    pincode: doc.pincode,
    latitude: doc.latitude,
    longitude: doc.longitude,
    land_area_acres: doc.land_area_acres,
    gis_area_acres: doc.gis_area_acres,
    area_discrepancy_flag: doc.area_discrepancy_flag,
    land_type: doc.land_type,
    soil_type: doc.soil_type,
    irrigation_type: doc.irrigation_type,
    water_availability_score: doc.water_availability_score,
    crop_type: doc.crop_type,
    crop_yield_per_acre: doc.crop_yield_per_acre,
    season: doc.season,
    distance_to_road_km: doc.distance_to_road_km,
    distance_to_highway_km: doc.distance_to_highway_km,
    distance_to_city_km: doc.distance_to_city_km,
    distance_to_market_km: doc.distance_to_market_km,
    nearby_projects: doc.nearby_projects,
    avg_land_price_per_acre: doc.avg_land_price_per_acre,
    guideline_value: doc.guideline_value,
    previous_compensation: doc.previous_compensation,
    created_at: doc.created_at,
  };
}

async function upsertLandDetails(caseId, payload) {
  const update = {
    case_id: caseId,
    state: payload.state,
    district: payload.district,
    taluk: payload.taluk,
    village: payload.village,
    pincode: payload.pincode,
    latitude: payload.latitude,
    longitude: payload.longitude,
    land_area_acres: payload.land_area_acres,
    gis_area_acres: payload.gis_area_acres,
    area_discrepancy_flag: payload.area_discrepancy_flag,
    land_type: payload.land_type,
    soil_type: payload.soil_type,
    irrigation_type: payload.irrigation_type,
    water_availability_score: payload.water_availability_score,
    crop_type: payload.crop_type,
    crop_yield_per_acre: payload.crop_yield_per_acre,
    season: payload.season,
    distance_to_road_km: payload.distance_to_road_km,
    distance_to_highway_km: payload.distance_to_highway_km,
    distance_to_city_km: payload.distance_to_city_km,
    distance_to_market_km: payload.distance_to_market_km,
    nearby_projects: payload.nearby_projects,
    avg_land_price_per_acre: payload.avg_land_price_per_acre,
    guideline_value: payload.guideline_value,
    previous_compensation: payload.previous_compensation,
  };

  const doc = await LandDetails.findOneAndUpdate(
    { case_id: caseId },
    update,
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    }
  );

  return formatLandDetails(doc);
}

async function getLandDetails(caseId) {
  const doc = await LandDetails.findOne({ case_id: caseId });
  return formatLandDetails(doc);
}

module.exports = {
  upsertLandDetails,
  getLandDetails,
};
