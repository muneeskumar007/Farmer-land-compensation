function success(res, data, statusCode = 200, meta = {}) {
  return res.status(statusCode).json({
    success: true,
    data,
    meta,
  });
}

function error(res, message, statusCode = 400, details = null) {
  return res.status(statusCode).json({
    success: false,
    error: message,
    details,
  });
}

module.exports = {
  success,
  error,
};
