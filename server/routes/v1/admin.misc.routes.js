const { Router } = require('express');
const inquiryService = require('../../services/inquiry.service');
const testimonialService = require('../../services/testimonial.service');
const settingsService = require('../../services/settings.service');
const validate = require('../../middleware/validate');
const schemas = require('../../validation/admin.schema');
const wrap = require('../../utils/asyncHandler');

const router = Router();

// inquiries
router.get(
  '/inquiries',
  wrap(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const status = ['new', 'contacted', 'closed'].includes(req.query.status)
      ? req.query.status
      : undefined;
    res.json(await inquiryService.list({ status, page }));
  })
);
router.patch(
  '/inquiries/:id',
  validate({ body: schemas.inquiryStatus }),
  wrap(async (req, res) => {
    res.json(await inquiryService.setStatus(req.params.id, req.body.status));
  })
);

// testimonials
router.get('/testimonials', wrap(async (_req, res) => res.json(await testimonialService.listAdmin())));
router.post(
  '/testimonials',
  validate({ body: schemas.testimonial }),
  wrap(async (req, res) => res.status(201).json(await testimonialService.create(req.body)))
);
router.patch(
  '/testimonials/:id',
  validate({ body: schemas.testimonial.partial() }),
  wrap(async (req, res) => res.json(await testimonialService.update(req.params.id, req.body)))
);
router.delete(
  '/testimonials/:id',
  wrap(async (req, res) => {
    await testimonialService.remove(req.params.id);
    res.json({ ok: true });
  })
);

// settings
router.get('/settings', wrap(async (_req, res) => res.json(await settingsService.getMerged())));
router.patch(
  '/settings',
  validate({ body: schemas.settings }),
  wrap(async (req, res) => res.json(await settingsService.update(req.body)))
);

module.exports = router;
