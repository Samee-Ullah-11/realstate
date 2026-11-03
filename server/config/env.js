require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const REQUIRED = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_ORIGIN'];
// Photo upload cannot work without these; refuse to start in production.
const REQUIRED_IN_PROD = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientOrigin: process.env.CLIENT_ORIGIN,
  // Public URL of the deployed site, used for canonicals, OG tags, sitemap.
  siteUrl: (process.env.SITE_URL || `http://localhost:${Number(process.env.PORT) || 5000}`).replace(/\/$/, ''),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  google: {
    placesApiKey: process.env.GOOGLE_PLACES_API_KEY,
    placeId: process.env.GOOGLE_PLACE_ID,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    notifyEmail: process.env.NOTIFY_EMAIL,
  },
  isProd: (process.env.NODE_ENV || 'development') === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

function assertEnv() {
  const required = env.isProd ? [...REQUIRED, ...REQUIRED_IN_PROD] : REQUIRED;
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(
      `Missing required environment variables: ${missing.join(', ')}.\n` +
        'Copy .env.example to server/.env and fill them in.'
    );
    process.exit(1);
  }
  if (env.jwtSecret && env.jwtSecret.length < 24 && env.isProd) {
    console.error('JWT_SECRET is too short for production (min 24 chars).');
    process.exit(1);
  }
}

module.exports = { env, assertEnv };
