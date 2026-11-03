const { Router } = require('express');
const controller = require('../../controllers/auth.controller');
const validate = require('../../middleware/validate');
const schemas = require('../../validation/auth.schema');
const { requireAuth } = require('../../middleware/auth');
const rateLimits = require('../../middleware/rateLimits');
const wrap = require('../../utils/asyncHandler');

const router = Router();

router.post('/login', rateLimits.login, validate({ body: schemas.login }), wrap(controller.login));
router.post('/logout', wrap(controller.logout));
router.get('/me', requireAuth, wrap(controller.me));
router.patch(
  '/password',
  requireAuth,
  validate({ body: schemas.changePassword }),
  wrap(controller.changePassword)
);

module.exports = router;
