const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: null },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true },
    message: { type: String, default: '', trim: true },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
    language: { type: String, enum: ['en', 'ur'], default: 'en' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
