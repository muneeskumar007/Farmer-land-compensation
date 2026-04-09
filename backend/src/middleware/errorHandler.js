const apiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');
const { NODE_ENV } = require('../config/env');

function errorHandler(err, req, res, next) {
  if (!err) {
    return next();
  }

  logger.error(
    { code: err.code, message: err.message },
    'Unhandled error'
  );

  if (err && err.code === 11000) {
    return apiResponse.error(res, 'Conflict', 409);
  }

  if (err && err.name === 'ValidationError') {
    return apiResponse.error(res, 'Validation error', 400, err.errors);
  }

  if (err && err.name === 'CastError') {
    return apiResponse.error(res, 'Invalid identifier', 400);
  }

  const message = NODE_ENV === 'production' ? 'Internal server error' : err.message;
  const details = NODE_ENV === 'production' ? null : { stack: err.stack };
  return apiResponse.error(res, message, 500, details);
}

module.exports = errorHandler;
