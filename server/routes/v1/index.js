const { Router } = require('express');
const authRoutes = require('./auth.routes');
const propertiesRoutes = require('./properties.routes');
const adminPropertiesRoutes = require('./admin.properties.routes');
const adminMiscRoutes = require('./admin.misc.routes');
const settingsService = require('../../services/settings.service');
const agentService = require('../../services/agent.service');
const inquiryService = require('../../services/inquiry.service');
const testimonialService = require('../../services/testimonial.service');
const reviewsService = require('../../services/reviews.service');
const inquirySchemas = require('../../validation/inquiry.schema');
const validate = require('../../middleware/validate');
const rateLimits = require('../../middleware/rateLimits');
const { requireAuth, requireRole } = require('../../middleware/auth');
const wrap = require('../../utils/asyncHandler');

const router = Router();

// public
router.use('/properties', propertiesRoutes);
router.get('/agent', wrap(async (_req, res) => res.json(await agentService.getActive())));
router.get(
  '/settings',
  wrap(async (_req, res) => res.json(await settingsService.getPublic()))
);
router.get(
  '/testimonials',
  wrap(async (_req, res) => res.json(await testimonialService.listPublic()))
);
router.get(
  '/reviews/google',
  rateLimits.reviews,
  wrap(async (req, res) => {
    const lang = req.query.lang === 'ur' ? 'ur' : 'en';
    const data = await reviewsService.getGoogleReviews(lang);
    if (!data) return res.json({ available: false });
    res.json({ available: true, ...data });
  })
);
router.post(
  '/inquiries',
  rateLimits.inquiries,
  validate({ body: inquirySchemas.create }),
  wrap(async (req, res) => {
    const inquiry = await inquiryService.create(req.body);
    res.status(201).json({ ok: true, id: inquiry._id });
  })
);

// auth + admin
router.use('/auth', authRoutes);
router.use('/admin/properties', requireAuth, requireRole('admin'), adminPropertiesRoutes);
router.use('/admin', requireAuth, requireRole('admin'), adminMiscRoutes);

module.exports = router;
