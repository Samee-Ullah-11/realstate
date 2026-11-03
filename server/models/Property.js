const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    width: Number,
    height: Number,
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true, trim: true },
      ur: { type: String, default: '', trim: true },
    },
    slug: { type: String, required: true, unique: true },
    description: {
      en: { type: String, default: '' },
      ur: { type: String, default: '' },
    },
    purpose: { type: String, enum: ['buy', 'rent'], required: true },
    type: { type: String, enum: ['house', 'plot', 'apartment', 'commercial'], required: true },
    status: {
      type: String,
      enum: ['available', 'sold', 'rented', 'hidden'],
      default: 'available',
    },
    isDraft: { type: Boolean, default: false },

    price: { type: Number, min: 0, default: null },
    priceOnCall: { type: Boolean, default: false },

    areaSqFt: { type: Number, required: true, min: 1 },
    areaUnitEntered: { type: String, enum: ['marla', 'kanal', 'sqft'], default: 'marla' },

    bedrooms: { type: Number, min: 0, default: null },
    bathrooms: { type: Number, min: 0, default: null },

    city: { type: String, required: true },
    area: { type: String, required: true, index: true },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    features: [String],

    photos: [photoSchema], // photos[0] is the cover
    isFeatured: { type: Boolean, default: false },

    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    viewsCount: { type: Number, default: 0 },

    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

propertySchema.index({ status: 1, purpose: 1, type: 1, area: 1, price: 1 });
propertySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Property', propertySchema);
