const argon2 = require('argon2');
const apiResponse = require('../../utils/apiResponse');
const logger = require('../../utils/logger');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../../utils/jwt');
const {
  createUser,
  findUserByEmail,
  isTokenBlocked,
  blockToken,
} = require('./auth.service');

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    const user = await createUser(name, email, passwordHash, role);

    const payload = { sub: user.id, role: user.role, email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return apiResponse.success(
      res,
      { user, tokens: { accessToken, refreshToken } },
      201
    );
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      return apiResponse.error(res, 'Invalid credentials', 401);
    }

    const isValid = await argon2.verify(user.password_hash, password);
    if (!isValid) {
      return apiResponse.error(res, 'Invalid credentials', 401);
    }

    if (!user.is_active) {
      return apiResponse.error(res, 'Account inactive', 403);
    }

    const payload = { sub: user.id, role: user.role, email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
    };

    return apiResponse.success(res, {
      user: safeUser,
      tokens: { accessToken, refreshToken },
    });
  } catch (error) {
    return next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return apiResponse.error(res, 'Refresh token required', 401);
    }

    if (await isTokenBlocked(refreshToken)) {
      return apiResponse.error(res, 'Refresh token invalidated', 401);
    }

    const payload = verifyRefreshToken(refreshToken);
    const accessToken = signAccessToken({
      sub: payload.sub,
      role: payload.role,
      email: payload.email,
    });

    return apiResponse.success(res, { accessToken });
  } catch (error) {
    logger.warn('Refresh token verification failed');
    return apiResponse.error(res, 'Invalid refresh token', 401);
  }
}

async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return apiResponse.error(res, 'Refresh token required', 401);
    }

    const payload = verifyRefreshToken(refreshToken);
    const expiresAt = payload.exp
      ? new Date(payload.exp * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await blockToken(refreshToken, expiresAt);
    return apiResponse.success(res, { message: 'Logged out' });
  } catch (error) {
    return apiResponse.error(res, 'Invalid refresh token', 401);
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout,
};
