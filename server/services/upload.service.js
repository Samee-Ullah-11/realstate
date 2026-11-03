const cloudinary = require('cloudinary').v2;
const ApiError = require('../utils/ApiError');
const { env } = require('../config/env');

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const { cloudName, apiKey, apiSecret } = env.cloudinary;
  if (!cloudName || !apiKey || !apiSecret) {
    throw ApiError.badRequest(
      'Photo upload is not configured yet (Cloudinary variables missing in .env)'
    );
  }
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  configured = true;
}

async function uploadPropertyPhoto(buffer, mimetype) {
  ensureConfigured();
  const dataUri = `data:${mimetype};base64,${buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'milestone/properties',
    resource_type: 'image',
  });
  return {
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
  };
}

async function deletePhoto(publicId) {
  ensureConfigured();
  await cloudinary.uploader.destroy(publicId);
}

module.exports = { uploadPropertyPhoto, deletePhoto };
