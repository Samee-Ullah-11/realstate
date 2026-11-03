const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { env } = require('../config/env');

const COOKIE_NAME = 'token';

const cookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

function requireAuth(req, _res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return next(ApiError.unauthorized());
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(ApiError.unauthorized('Session expired, sign in again'));
  }
}

function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return next(ApiError.forbidden());
    next();
  };
}

module.exports = { requireAuth, requireRole, COOKIE_NAME, cookieOptions };
