const { Router } = require('express');
const controller = require('../../controllers/property.controller');
const validate = require('../../middleware/validate');
const schemas = require('../../validation/property.schema');
const wrap = require('../../utils/asyncHandler');

const router = Router();

router.get('/', validate({ query: schemas.listQuery }), wrap(controller.list));
router.get('/:slug', wrap(controller.getBySlug));
router.get('/:slug/related', wrap(controller.getRelated));

module.exports = router;
