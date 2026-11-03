const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

function notFound(_req, _res, next) {
  next(ApiError.notFound());
}

// Central error handler: the only place errors become responses.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid id' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Already exists' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Payload too large' });
  }
  logger.error(`Unhandled error on ${req.method} ${req.originalUrl}`, {
    message: err.message,
  });
  res.status(500).json({ error: 'Something went wrong' });
}

module.exports = { notFound, errorHandler };
