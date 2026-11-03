const propertyService = require('../services/property.service');
const uploadService = require('../services/upload.service');
const Agent = require('../models/Agent');
const ApiError = require('../utils/ApiError');

// --- public ---

async function list(req, res) {
  res.json(await propertyService.listPublic(req.validatedQuery));
}

async function getBySlug(req, res) {
  res.json(await propertyService.getBySlug(req.params.slug));
}

async function getRelated(req, res) {
  res.json(await propertyService.getRelated(req.params.slug));
}

// --- admin ---

async function listAdmin(req, res) {
  const page = Number(req.query.page) || 1;
  res.json(await propertyService.listAdmin({ page }));
}

async function getByIdAdmin(req, res) {
  res.json(await propertyService.getByIdAdmin(req.params.id));
}

async function create(req, res) {
  // Single-agent MVP: every property belongs to the active agent.
  const agent = await Agent.findOne({ isActive: true });
  if (!agent) throw ApiError.badRequest('No active agent in database; run the seed script');
  const property = await propertyService.create(req.body, {
    agentId: agent._id,
    userId: req.user.id,
  });
  res.status(201).json(property);
}

async function update(req, res) {
  res.json(await propertyService.update(req.params.id, req.body));
}

async function softDelete(req, res) {
  await propertyService.softDelete(req.params.id);
  res.json({ ok: true });
}

async function uploadPhotos(req, res) {
  if (!req.files?.length) throw ApiError.badRequest('No images in request');
  const photos = [];
  for (const file of req.files) {
    photos.push(await uploadService.uploadPropertyPhoto(file.buffer, file.mimetype));
  }
  res.json(await propertyService.addPhotos(req.params.id, photos));
}

async function reorderPhotos(req, res) {
  res.json(await propertyService.reorderPhotos(req.params.id, req.body.publicIds));
}

async function removePhoto(req, res) {
  const property = await propertyService.removePhoto(req.params.id, req.params.publicId);
  uploadService.deletePhoto(req.params.publicId).catch(() => {});
  res.json(property);
}

module.exports = {
  list,
  getBySlug,
  getRelated,
  listAdmin,
  getByIdAdmin,
  create,
  update,
  softDelete,
  uploadPhotos,
  reorderPhotos,
  removePhoto,
};
