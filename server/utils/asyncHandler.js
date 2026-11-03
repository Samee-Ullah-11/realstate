// Express 4 does not forward rejected promises to the error handler.
const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next);

module.exports = asyncHandler;
