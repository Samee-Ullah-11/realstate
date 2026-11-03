const Testimonial = require('../models/Testimonial');

// Public list: only visible entries whose author gave permission.
const ApiError = require('../utils/ApiError');

async function listPublic() {
  return Testimonial.find({ isVisible: true, permissionObtained: true })
    .sort({ order: 1, createdAt: -1 })
    .select('authorName text createdAt')
    .lean();
}

async function listAdmin() {
  return Testimonial.find().sort({ order: 1, createdAt: -1 }).lean();
}

async function create(input) {
  return Testimonial.create(input);
}

async function update(id, input) {
  const testimonial = await Testimonial.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  });
  if (!testimonial) throw ApiError.notFound('Testimonial not found');
  return testimonial;
}

async function remove(id) {
  const result = await Testimonial.deleteOne({ _id: id });
  if (!result.deletedCount) throw ApiError.notFound('Testimonial not found');
}

module.exports = { listPublic, listAdmin, create, update, remove };
