const { Router } = require('express');
const multer = require('multer');
const controller = require('../../controllers/property.controller');
const validate = require('../../middleware/validate');
const schemas = require('../../validation/property.schema');
const ApiError = require('../../utils/ApiError');
const wrap = require('../../utils/asyncHandler');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(ApiError.badRequest('Only JPEG, PNG, or WebP images are allowed'));
    }
    cb(null, true);
  },
});

const router = Router();

router.get('/', wrap(controller.listAdmin));
router.post('/', validate({ body: schemas.create }), wrap(controller.create));
router.get('/:id', wrap(controller.getByIdAdmin));
router.patch('/:id', validate({ body: schemas.update }), wrap(controller.update));
router.delete('/:id', wrap(controller.softDelete));

router.post('/:id/photos', upload.array('photos', 10), wrap(controller.uploadPhotos));
router.patch(
  '/:id/photos/order',
  validate({ body: schemas.reorderPhotos }),
  wrap(controller.reorderPhotos)
);
router.delete('/:id/photos/:publicId', wrap(controller.removePhoto));

module.exports = router;
