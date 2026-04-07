const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../../middleware/validate');
const requireRole = require('../../middleware/rbac');
const controller = require('./landDetails.controller');

const router = express.Router();

router.post(
  '/:id/land-details',
  requireRole('officer', 'admin'),
  [
    param('id').isUUID(),
    body('state').notEmpty(),
    body('district').notEmpty(),
    body('taluk').notEmpty(),
    body('village').notEmpty(),
    body('pincode').matches(/^\d{6}$/),
    body('latitude').optional().isFloat({ min: -90, max: 90 }),
    body('longitude').optional().isFloat({ min: -180, max: 180 }),
    body('land_area_acres').isFloat({ gt: 0 }),
    body('gis_area_acres').optional().isFloat({ gt: 0 }),
    body('land_type').notEmpty(),
    body('soil_type').notEmpty(),
    body('irrigation_type').notEmpty(),
    body('water_availability_score').isInt({ min: 1, max: 10 }),
    body('crop_type').notEmpty(),
    body('crop_yield_per_acre').isFloat({ min: 0 }),
    body('season').notEmpty(),
    body('distance_to_road_km').isFloat({ min: 0 }),
    body('distance_to_highway_km').isFloat({ min: 0 }),
    body('distance_to_city_km').isFloat({ min: 0 }),
    body('distance_to_market_km').isFloat({ min: 0 }),
    body('nearby_projects').notEmpty(),
    body('avg_land_price_per_acre').isFloat({ gt: 0 }),
    body('guideline_value').isFloat({ gt: 0 }),
    body('previous_compensation').optional().isFloat({ gt: 0 }),
  ],
  validate,
  controller.upsertLandDetails
);

router.get(
  '/:id/land-details',
  requireRole('farmer', 'officer', 'admin'),
  [param('id').isUUID()],
  validate,
  controller.getLandDetails
);

module.exports = router;
