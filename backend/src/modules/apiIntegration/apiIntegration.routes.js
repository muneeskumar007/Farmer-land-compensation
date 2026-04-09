const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../../middleware/validate');
const requireRole = require('../../middleware/rbac');
const controller = require('./apiIntegration.controller');

const router = express.Router();

// Mock Patta Lookup
router.post(
  '/patta/lookup',
  requireRole('officer', 'admin', 'farmer'),
  [
    body('pattaNumber').notEmpty().withMessage('pattaNumber is required'),
    body('district').notEmpty().withMessage('district is required')
  ],
  validate,
  controller.lookupPatta
);

// Get All Lands/Cases
router.get(
  '/lands',
  requireRole('officer', 'admin'),
  controller.getAllLands
);

// Update Land Status
router.patch(
  '/lands/:id/status',
  requireRole('officer', 'admin'),
  [
    param('id').isMongoId().withMessage('Invalid ID format'),
    body('status').isIn([
      'draft',
      'submitted',
      'under_review',
      'approved',
      'rejected',
      'submitted_to_authority'
    ]).withMessage('Invalid status')
  ],
  validate,
  controller.updateLandStatus
);

module.exports = router;
