const apiResponse = require('../utils/apiResponse');
const { verifyAccessToken } = require('../utils/jwt');

function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return apiResponse.error(res, 'Unauthorized', 401);
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return apiResponse.error(res, 'Unauthorized', 401);
  }
}

module.exports = auth;
