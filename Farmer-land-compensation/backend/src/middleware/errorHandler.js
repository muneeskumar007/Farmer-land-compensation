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

  if (err.code === '23505') {
    return apiResponse.error(res, 'Conflict', 409);
  }

  if (err.code === '23503') {
    return apiResponse.error(res, 'Invalid reference', 400);
  }

  const message = NODE_ENV === 'production' ? 'Internal server error' : err.message;
  const details = NODE_ENV === 'production' ? null : { stack: err.stack };
  return apiResponse.error(res, message, 500, details);
}

module.exports = errorHandler;
