const { validationResult } = require('express-validator');
const apiResponse = require('../utils/apiResponse');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.error(res, 'Validation failed', 422, errors.array());
  }
  return next();
}

module.exports = validate;
