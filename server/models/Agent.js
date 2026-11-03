const mongoose = require('mongoose');

const localized = { en: { type: String, default: '' }, ur: { type: String, default: '' } };

const agentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    photoUrl: { type: String, default: '' },
    bio: localized,
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    email: { type: String, default: '' },
    areasServed: [String],
    licenseInfo: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Agent', agentSchema);
