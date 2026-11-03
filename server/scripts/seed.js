// Seeds the admin user, the agent (from site config), and clearly-labelled
// SAMPLE properties. `npm run seed:wipe` removes every SAMPLE property.
// Admin credentials: printed once on first creation; change the password after login.

const { env, assertEnv } = require('../config/env');

assertEnv();

const crypto = require('crypto');
const mongoose = require('mongoose');
const site = require('../config/site');
const User = require('../models/User');
const Agent = require('../models/Agent');
const Property = require('../models/Property');
const { createUser } = require('../services/auth.service');
const { slugify } = require('../utils/slugify');
const { toSqFt } = require('../utils/units');

const SAMPLE_MARK = 'SAMPLE';

// Temporary stock photos so the UI can be reviewed; real listing photos
// replace these through the admin panel. publicId 'sample/*' marks them
// as not living in the real Cloudinary account.
const photo = (id, w = 1200, h = 800) => ({
  publicId: `sample/${id}`,
  url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`,
  width: w,
  height: h,
});

const sampleProperties = [
  {
    title: { en: 'SAMPLE 7 Marla house, Street 12' },
    description: {
      en: 'SAMPLE listing for development. Double-storey house, 5 bedrooms, parking for two cars. Replace with a real listing before launch.',
    },
    purpose: 'buy',
    type: 'house',
    price: 32_500_000,
    areaValue: 7,
    areaUnit: 'marla',
    bedrooms: 5,
    bathrooms: 4,
    area: 'Hayatabad Phase 3',
    location: { lat: 33.9876, lng: 71.4345 },
    features: ['corner', 'parking', 'solar wiring'],
    isFeatured: true,
    photos: [
      photo('photo-1600596542815-ffad4c1539a9'),
      photo('photo-1600607687939-ce8a6c25118c'),
      photo('photo-1600566753086-00f18fb6b3ea'),
    ],
  },
  {
    title: { en: 'SAMPLE 10 Marla upper portion for rent' },
    description: { en: 'SAMPLE listing for development. 3 bedrooms, separate entrance.' },
    purpose: 'rent',
    type: 'house',
    price: 55_000,
    areaValue: 10,
    areaUnit: 'marla',
    bedrooms: 3,
    bathrooms: 2,
    area: 'University Town',
    features: ['separate entrance', 'water bore'],
    photos: [photo('photo-1600585154340-be6161a56a0c'), photo('photo-1600210492486-724fe5c67fb0')],
  },
  {
    title: { en: 'SAMPLE 5 Marla plot, main road' },
    description: { en: 'SAMPLE listing for development. Level plot, ready for transfer.' },
    purpose: 'buy',
    type: 'plot',
    price: 8_500_000,
    areaValue: 5,
    areaUnit: 'marla',
    area: 'Regi Model Town',
    features: ['ready for transfer'],
    photos: [photo('photo-1500382017468-9049fed747ef')],
  },
  {
    title: { en: 'SAMPLE 2 Kanal commercial building' },
    description: { en: 'SAMPLE listing for development. Price on call.' },
    purpose: 'buy',
    type: 'commercial',
    price: null,
    priceOnCall: true,
    areaValue: 2,
    areaUnit: 'kanal',
    area: 'Saddar',
    features: ['basement', 'three floors'],
    photos: [photo('photo-1486406146926-c627a92ad1ab')],
  },
  {
    title: { en: 'SAMPLE 3 bed apartment (sold)' },
    description: { en: 'SAMPLE listing for development, shown with Sold tag.' },
    purpose: 'buy',
    type: 'apartment',
    price: 14_000_000,
    areaValue: 1361,
    areaUnit: 'sqft',
    bedrooms: 3,
    bathrooms: 2,
    area: 'Gulbahar',
    status: 'sold',
    photos: [photo('photo-1522708323590-d24dbb6b0267')],
  },
];

async function wipeSamples() {
  const result = await Property.deleteMany({ 'title.en': new RegExp(`^${SAMPLE_MARK}`) });
  console.log(`Removed ${result.deletedCount} SAMPLE properties.`);
}

async function seed() {
  let admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    // DEV_ADMIN_PASSWORD exists only for the throwaway in-memory dev mode.
    const password = process.env.DEV_ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url');
    admin = await createUser({
      email: site.email,
      password,
      name: site.agentName,
      role: 'admin',
    });
    console.log('Created admin user:');
    console.log(`  email:    ${site.email}`);
    console.log(`  password: ${password}`);
    console.log('Change this password after first login.');
  }

  let agent = await Agent.findOne({ slug: slugify(site.agentName) });
  if (!agent) {
    agent = await Agent.create({
      userId: admin._id,
      name: site.agentName,
      slug: slugify(site.agentName),
      phone: site.phone,
      whatsapp: site.whatsapp,
      email: site.email,
      areasServed: site.areasServed,
      bio: {
        en: '[FILL IN: short honest bio for the About page]',
        ur: '',
      },
    });
    console.log(`Created agent: ${agent.name}`);
  }

  const existing = await Property.countDocuments({
    'title.en': new RegExp(`^${SAMPLE_MARK}`),
  });
  if (existing) {
    console.log(`${existing} SAMPLE properties already present, skipping.`);
    return;
  }

  for (const sample of sampleProperties) {
    const { areaValue, areaUnit, ...rest } = sample;
    await Property.create({
      ...rest,
      city: site.city,
      slug: slugify(sample.title.en),
      areaSqFt: toSqFt(areaValue, areaUnit),
      areaUnitEntered: areaUnit,
      agentId: agent._id,
      createdBy: admin._id,
    });
  }
  console.log(`Created ${sampleProperties.length} SAMPLE properties.`);
}

async function main() {
  await mongoose.connect(env.mongodbUri);
  if (process.argv.includes('--wipe')) await wipeSamples();
  else await seed();
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
