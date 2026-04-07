const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../../middleware/validate');
const requireRole = require('../../middleware/rbac');
const controller = require('./compensation.controller');

const router = express.Router();

router.post(
  '/compensation/calculate',
  requireRole('officer', 'admin'),
  [body('case_id').isUUID()],
  validate,
  controller.calculateCompensation
);

router.post(
  '/compensation/predict',
  requireRole('officer', 'admin'),
  [body('case_id').isUUID()],
  validate,
  controller.predictCompensation
);

router.get(
  '/cases/:id/compensation',
  requireRole('farmer', 'officer', 'admin'),
  [param('id').isUUID()],
  validate,
  controller.getCompensation
);

module.exports = router;
