const mongoose = require('mongoose');

// Single document. Admin-editable values that override file-config defaults.
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'site', unique: true },
    phone: String,
    whatsapp: String,
    email: String,
    officeAddress: String,
    googleMapsLink: String,
    officeHours: { en: String, ur: String },
    googlePlaceId: String,
    marlaSqFt: Number,
  },
  { timestamps: true }
);

settingsSchema.statics.get = async function () {
  return (await this.findOne({ key: 'site' })) || (await this.create({ key: 'site' }));
};

module.exports = mongoose.model('Settings', settingsSchema);
