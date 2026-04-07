const express = require('express');
const { body } = require('express-validator');
const validate = require('../../middleware/validate');
const controller = require('./auth.controller');

const router = express.Router();

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

router.post(
  '/register',
  [
    body('name').trim().notEmpty().isLength({ min: 2, max: 150 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).matches(passwordRegex),
    body('role').isIn(['farmer', 'officer']),
  ],
  validate,
  controller.register
);

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  validate,
  controller.login
);

router.post(
  '/refresh',
  [body('refreshToken').notEmpty()],
  validate,
  controller.refresh
);

router.post(
  '/logout',
  [body('refreshToken').notEmpty()],
  validate,
  controller.logout
);

module.exports = router;
