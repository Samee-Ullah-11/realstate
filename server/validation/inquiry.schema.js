const { z } = require('zod');

const create = z.object({
  propertyId: z.string().regex(/^[a-f\d]{24}$/i).nullable().default(null),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20).regex(/^[+\d][\d\s-]+$/, 'Invalid phone number'),
  email: z.string().trim().email().max(200).or(z.literal('')).default(''),
  message: z.string().trim().max(2000).default(''),
  language: z.enum(['en', 'ur']).default('en'),
  // Honeypot: real users never fill this hidden field.
  website: z.literal('').optional(),
});

module.exports = { create };
