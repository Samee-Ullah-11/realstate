const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    authorName: { type: String, required: true, trim: true },
    text: {
      en: { type: String, required: true },
      ur: { type: String, default: '' },
    },
    // Real clients only; nothing displays unless permission was obtained.
    permissionObtained: { type: Boolean, required: true, default: false },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
