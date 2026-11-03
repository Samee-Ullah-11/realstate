const { z } = require('zod');

const inquiryStatus = z.object({
  status: z.enum(['new', 'contacted', 'closed']),
});

const testimonial = z.object({
  authorName: z.string().trim().min(2).max(100),
  text: z.object({
    en: z.string().trim().min(3).max(1000),
    ur: z.string().trim().max(1000).default(''),
  }),
  permissionObtained: z.boolean(),
  isVisible: z.boolean().default(true),
  order: z.number().int().min(0).max(999).default(0),
});

const settings = z
  .object({
    phone: z.string().trim().max(20),
    whatsapp: z.string().trim().regex(/^\d{10,15}$/, 'International format, digits only'),
    email: z.string().trim().email(),
    officeAddress: z.string().trim().max(300),
    googleMapsLink: z.string().trim().url().or(z.literal('')),
    officeHours: z.object({
      en: z.string().trim().max(100),
      ur: z.string().trim().max(100).default(''),
    }),
    googlePlaceId: z.string().trim().max(100),
    marlaSqFt: z.number().min(100).max(500),
  })
  .partial();

module.exports = { inquiryStatus, testimonial, settings };
