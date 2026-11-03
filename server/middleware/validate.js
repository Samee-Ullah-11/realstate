const ApiError = require('../utils/ApiError');

// Usage: validate({ body: schema }) or validate({ query: schema, params: schema })
function validate(schemas) {
  return (req, _res, next) => {
    for (const [part, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(req[part]);
      if (!result.success) {
        const details = result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        return next(ApiError.badRequest('Invalid input', details));
      }
      // Express 5 would make req.query read-only; assigning per-part keeps this portable.
      if (part === 'query') req.validatedQuery = result.data;
      else req[part] = result.data;
    }
    next();
  };
}

module.exports = validate;
