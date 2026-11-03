const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const { env } = require('./config/env');
const rateLimits = require('./middleware/rateLimits');
const v1Routes = require('./routes/v1');
const seo = require('./seo');
const wrap = require('./utils/asyncHandler');
const { notFound, errorHandler } = require('./middleware/error');

function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          // 'unsafe-inline' only because the injected JSON-LD block is inline.
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: [
            "'self'",
            'data:',
            'https://res.cloudinary.com',
            'https://images.unsplash.com',
            'https://*.googleusercontent.com',
          ],
          frameSrc: ['https://www.google.com', 'https://maps.google.com'],
          connectSrc: ["'self'"],
        },
      },
    })
  );
  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());
  app.use(mongoSanitize());

  app.use('/api', rateLimits.api);
  app.use('/api/v1', v1Routes);
  app.use('/api', notFound);

  app.get('/sitemap.xml', wrap(seo.sitemap));
  app.get('/robots.txt', seo.robots);

  // With a client build present, Express serves the SPA and injects
  // per-route meta tags into the HTML before sending it.
  if (seo.distExists()) {
    app.use(express.static(seo.DIST_DIR, { index: false, maxAge: '1y', immutable: true }));
    app.get(/^\/(?!api\/).*/, wrap(seo.servePage));
  }

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
