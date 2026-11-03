const Settings = require('../models/Settings');
const site = require('../config/site');

// File config supplies defaults; non-empty DB values override them.
// The merged shape is what both the public site and the admin form read.
function merge(doc) {
  return {
    phone: doc.phone || site.phone,
    whatsapp: doc.whatsapp || site.whatsapp,
    email: doc.email || site.email,
    officeAddress: doc.officeAddress || site.officeAddress,
    googleMapsLink: doc.googleMapsLink || site.googleMapsLink,
    officeHours: {
      en: doc.officeHours?.en || site.officeHours.en,
      ur: doc.officeHours?.ur || site.officeHours.ur,
    },
    googlePlaceId: doc.googlePlaceId || '',
    marlaSqFt: doc.marlaSqFt || site.marlaSqFt,
  };
}

async function getMerged() {
  return merge(await Settings.get());
}

// Public variant: everything a visitor may see; no API-coupled values.
async function getPublic() {
  const { googlePlaceId, ...publicSettings } = await getMerged();
  return publicSettings;
}

async function update(input) {
  const doc = await Settings.get();
  Object.assign(doc, input);
  await doc.save();
  return merge(doc);
}

module.exports = { getMerged, getPublic, update };
