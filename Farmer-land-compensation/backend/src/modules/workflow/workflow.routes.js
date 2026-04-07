const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../../middleware/validate');
const requireRole = require('../../middleware/rbac');
const controller = require('./workflow.controller');

const router = express.Router();

router.post(
  '/:id/submit',
  requireRole('farmer'),
  [param('id').isUUID()],
  validate,
  controller.submitCase
);

router.post(
  '/:id/approve',
  requireRole('officer', 'admin'),
  [
    param('id').isUUID(),
    body('final_value').isFloat({ gt: 0 }),
    body('notes').optional().isString().isLength({ max: 500 }),
  ],
  validate,
  controller.approveCase
);

router.post(
  '/:id/reject',
  requireRole('officer', 'admin'),
  [param('id').isUUID(), body('reason').notEmpty().isLength({ max: 500 })],
  validate,
  controller.rejectCase
);

router.post(
  '/:id/assign',
  requireRole('admin'),
  [param('id').isUUID(), body('officer_id').isUUID()],
  validate,
  controller.assignCase
);

router.post(
  '/:id/submit-to-authority',
  requireRole('officer', 'admin'),
  [param('id').isUUID()],
  validate,
  controller.submitToAuthority
);

module.exports = router;
