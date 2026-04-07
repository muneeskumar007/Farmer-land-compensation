const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../../middleware/validate');
const requireRole = require('../../middleware/rbac');
const controller = require('./cases.controller');

const router = express.Router();

router.post(
  '/',
  requireRole('farmer', 'officer', 'admin'),
  [
    body('acquisition_type').notEmpty().isLength({ max: 50 }),
    body('urgency_level').isIn(['low', 'medium', 'high', 'critical']),
    body('farmer_id').optional().isUUID(),
  ],
  validate,
  controller.createCase
);

router.get(
  '/',
  requireRole('officer', 'admin'),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status')
      .optional()
      .isIn([
        'draft',
        'submitted',
        'under_review',
        'approved',
        'rejected',
        'submitted_to_authority',
      ]),
  ],
  validate,
  controller.getCases
);

router.get(
  '/:id',
  requireRole('farmer', 'officer', 'admin'),
  [param('id').isUUID()],
  validate,
  controller.getCaseById
);

module.exports = router;
