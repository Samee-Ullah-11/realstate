const Property = require('../models/Property');
const ApiError = require('../utils/ApiError');
const { slugify, withSuffix } = require('../utils/slugify');
const { toSqFt } = require('../utils/units');

const PUBLIC_FILTER = { deletedAt: null, isDraft: false, status: { $ne: 'hidden' } };

const SORTS = {
  newest: { createdAt: -1 },
  priceAsc: { price: 1 },
  priceDesc: { price: -1 },
};

function buildPublicQuery(filters) {
  const query = { ...PUBLIC_FILTER };
  if (filters.purpose) query.purpose = filters.purpose;
  if (filters.type) query.type = filters.type;
  if (filters.area) query.area = new RegExp(escapeRegex(filters.area), 'i');
  if (filters.status) query.status = filters.status;
  if (filters.featured) query.isFeatured = true;
  if (filters.beds != null) query.bedrooms = { $gte: filters.beds };
  if (filters.minPrice != null || filters.maxPrice != null) {
    query.price = {};
    if (filters.minPrice != null) query.price.$gte = filters.minPrice;
    if (filters.maxPrice != null) query.price.$lte = filters.maxPrice;
  }
  return query;
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function listPublic(filters) {
  const query = buildPublicQuery(filters);
  const { page, limit } = filters;
  const [items, total] = await Promise.all([
    Property.find(query)
      .sort(SORTS[filters.sort] || SORTS.newest)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Property.countDocuments(query),
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) || 1 };
}

async function getBySlug(slug) {
  const property = await Property.findOne({ slug, ...PUBLIC_FILTER }).lean();
  if (!property) throw ApiError.notFound('Property not found');
  // Fire-and-forget view counter; a failed increment never blocks the page.
  Property.updateOne({ _id: property._id }, { $inc: { viewsCount: 1 } }).catch(() => {});
  return property;
}

async function getRelated(slug, max = 3) {
  const current = await Property.findOne({ slug, ...PUBLIC_FILTER }).lean();
  if (!current) return [];
  // Same area first, then same type, excluding itself.
  const sameArea = await Property.find({
    ...PUBLIC_FILTER,
    _id: { $ne: current._id },
    area: current.area,
  })
    .sort({ createdAt: -1 })
    .limit(max)
    .lean();
  if (sameArea.length >= max) return sameArea;
  const sameType = await Property.find({
    ...PUBLIC_FILTER,
    _id: { $ne: current._id, $nin: sameArea.map((p) => p._id) },
    type: current.type,
  })
    .sort({ createdAt: -1 })
    .limit(max - sameArea.length)
    .lean();
  return [...sameArea, ...sameType];
}

function toDocument(input) {
  const doc = { ...input };
  if (input.areaValue != null) {
    doc.areaSqFt = toSqFt(input.areaValue, input.areaUnit || 'marla');
    doc.areaUnitEntered = input.areaUnit || 'marla';
    delete doc.areaValue;
    delete doc.areaUnit;
  }
  if (doc.priceOnCall) doc.price = null;
  return doc;
}

async function create(input, { agentId, userId }) {
  const doc = toDocument(input);
  const baseSlug = slugify(input.title.en);
  const exists = await Property.exists({ slug: baseSlug });
  doc.slug = exists ? withSuffix(baseSlug) : baseSlug;
  doc.agentId = agentId;
  doc.createdBy = userId;
  return Property.create(doc);
}

async function update(id, input) {
  const property = await Property.findOne({ _id: id, deletedAt: null });
  if (!property) throw ApiError.notFound('Property not found');
  Object.assign(property, toDocument(input));
  await property.save();
  return property;
}

async function softDelete(id) {
  const result = await Property.updateOne(
    { _id: id, deletedAt: null },
    { deletedAt: new Date() }
  );
  if (!result.matchedCount) throw ApiError.notFound('Property not found');
}

async function listAdmin({ page = 1, limit = 20 }) {
  const query = { deletedAt: null };
  const [items, total] = await Promise.all([
    Property.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Property.countDocuments(query),
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) || 1 };
}

async function getByIdAdmin(id) {
  const property = await Property.findOne({ _id: id, deletedAt: null }).lean();
  if (!property) throw ApiError.notFound('Property not found');
  return property;
}

async function addPhotos(id, photos) {
  const property = await Property.findOne({ _id: id, deletedAt: null });
  if (!property) throw ApiError.notFound('Property not found');
  property.photos.push(...photos);
  await property.save();
  return property;
}

async function reorderPhotos(id, publicIds) {
  const property = await Property.findOne({ _id: id, deletedAt: null });
  if (!property) throw ApiError.notFound('Property not found');
  const byId = new Map(property.photos.map((photo) => [photo.publicId, photo]));
  if (publicIds.length !== property.photos.length || publicIds.some((pid) => !byId.has(pid))) {
    throw ApiError.badRequest('Photo list does not match');
  }
  property.photos = publicIds.map((pid) => byId.get(pid));
  await property.save();
  return property;
}

async function removePhoto(id, publicId) {
  const property = await Property.findOne({ _id: id, deletedAt: null });
  if (!property) throw ApiError.notFound('Property not found');
  property.photos = property.photos.filter((photo) => photo.publicId !== publicId);
  await property.save();
  return property;
}

module.exports = {
  listPublic,
  getBySlug,
  getRelated,
  create,
  update,
  softDelete,
  listAdmin,
  getByIdAdmin,
  addPhotos,
  reorderPhotos,
  removePhoto,
  buildPublicQuery,
};
