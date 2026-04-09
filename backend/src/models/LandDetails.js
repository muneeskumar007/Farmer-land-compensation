const mongoose = require('mongoose');

const { Schema } = mongoose;

const landDetailsSchema = new Schema(
  {
    case_id: { type: Schema.Types.ObjectId, ref: 'LandCase', unique: true, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    taluk: { type: String, required: true },
    village: { type: String, required: true },
    pincode: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    land_area_acres: { type: Number, required: true },
    gis_area_acres: { type: Number },
    area_discrepancy_flag: { type: Boolean, default: false },
    land_type: { type: String, required: true },
    soil_type: { type: String, required: true },
    irrigation_type: { type: String, required: true },
    water_availability_score: { type: Number },
    crop_type: { type: String },
    crop_yield_per_acre: { type: Number },
    season: { type: String },
    distance_to_road_km: { type: Number },
    distance_to_highway_km: { type: Number },
    distance_to_city_km: { type: Number },
    distance_to_market_km: { type: Number },
    nearby_projects: { type: String },
    avg_land_price_per_acre: { type: Number, required: true },
    guideline_value: { type: Number, required: true },
    previous_compensation: { type: Number },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

landDetailsSchema.index({ case_id: 1 }, { unique: true });
landDetailsSchema.index({ state: 1, district: 1 });

module.exports = mongoose.model('LandDetails', landDetailsSchema);
