const { z } = require('zod');

const localized = (required) =>
  z.object({
    en: required ? z.string().trim().min(3).max(200) : z.string().trim().max(5000).default(''),
    ur: z.string().trim().max(required ? 200 : 5000).default(''),
  });

const base = z.object({
  title: localized(true),
  description: localized(false).default({ en: '', ur: '' }),
  purpose: z.enum(['buy', 'rent']),
  type: z.enum(['house', 'plot', 'apartment', 'commercial']),
  status: z.enum(['available', 'sold', 'rented', 'hidden']).default('available'),
  isDraft: z.boolean().default(false),
  price: z.number().int().min(0).nullable().default(null),
  priceOnCall: z.boolean().default(false),
  // Admin enters area in the unit they think in; the service converts to sq ft.
  areaValue: z.number().positive(),
  areaUnit: z.enum(['marla', 'kanal', 'sqft']).default('marla'),
  bedrooms: z.number().int().min(0).max(50).nullable().default(null),
  bathrooms: z.number().int().min(0).max(50).nullable().default(null),
  city: z.string().trim().min(2).max(100),
  area: z.string().trim().min(2).max(100),
  location: z
    .object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) })
    .nullable()
    .default(null),
  features: z.array(z.string().trim().min(1).max(100)).max(50).default([]),
  isFeatured: z.boolean().default(false),
});

const create = base.refine((data) => data.priceOnCall || data.price != null, {
  message: 'Set a price or mark price on call',
  path: ['price'],
});

// base.partial() would still apply each field's .default() and so turn a
// partial PATCH into a reset of every omitted field. Strip defaults first:
// a field that isn't sent must stay untouched.
const update = z.object(
  Object.fromEntries(
    Object.entries(base.shape).map(([key, schema]) => [
      key,
      (schema instanceof z.ZodDefault ? schema.removeDefault() : schema).optional(),
    ])
  )
);

const listQuery = z.object({
  purpose: z.enum(['buy', 'rent']).optional(),
  type: z.enum(['house', 'plot', 'apartment', 'commercial']).optional(),
  area: z.string().trim().max(100).optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  beds: z.coerce.number().int().min(0).max(50).optional(),
  status: z.enum(['available', 'sold', 'rented']).optional(),
  featured: z.coerce.boolean().optional(),
  sort: z.enum(['newest', 'priceAsc', 'priceDesc']).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

const reorderPhotos = z.object({
  publicIds: z.array(z.string().min(1)).min(1).max(30),
});

module.exports = { create, update, listQuery, reorderPhotos };
