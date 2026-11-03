const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const logger = require('../utils/logger');
const { notifyNewInquiry } = require('./mailer.service');

async function create(input) {
  // A fake propertyId must not block a genuine inquiry; store it as general.
  let propertyId = null;
  if (input.propertyId) {
    const exists = await Property.exists({ _id: input.propertyId, deletedAt: null });
    if (exists) propertyId = input.propertyId;
  }

  const inquiry = await Inquiry.create({
    propertyId,
    name: input.name,
    phone: input.phone,
    email: input.email,
    message: input.message,
    language: input.language,
  });

  notifyNewInquiry(inquiry).catch((err) =>
    logger.warn('Inquiry email notification failed', { message: err.message })
  );

  return inquiry;
}

async function list({ status, page = 1, limit = 20 }) {
  const query = status ? { status } : {};
  const [items, total] = await Promise.all([
    Inquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('propertyId', 'title slug')
      .lean(),
    Inquiry.countDocuments(query),
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) || 1 };
}

async function setStatus(id, status) {
  const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
  return inquiry;
}

module.exports = { create, list, setStatus };
