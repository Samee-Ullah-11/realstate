const Property = require('../models/Property');
const { env } = require('../config/env');
const { metaFor } = require('./meta.service');
const html = require('./html');

const PUBLIC_FILTER = { deletedAt: null, isDraft: false, status: { $ne: 'hidden' } };
const STATIC_PATHS = ['/', '/properties', '/about', '/contact', '/privacy', '/terms'];

async function sitemap(_req, res) {
  const properties = await Property.find(PUBLIC_FILTER)
    .select('slug updatedAt')
    .sort({ createdAt: -1 })
    .limit(5000)
    .lean();

  const urls = [
    ...STATIC_PATHS.map((path) => ({ loc: `${env.siteUrl}${path}` })),
    ...properties.map((property) => ({
      loc: `${env.siteUrl}/properties/${property.slug}`,
      lastmod: property.updatedAt.toISOString().slice(0, 10),
    })),
  ];

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(
        (url) =>
          `  <url><loc>${url.loc}</loc>${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}</url>`
      )
      .join('\n') +
    '\n</urlset>';

  res.type('application/xml').send(xml);
}

function robots(_req, res) {
  res
    .type('text/plain')
    .send(`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${env.siteUrl}/sitemap.xml\n`);
}

async function servePage(req, res) {
  const meta = await metaFor(req.path.replace(/\/$/, '') || '/');
  res.status(meta.status).type('html').send(html.render(meta));
}

module.exports = { sitemap, robots, servePage, distExists: html.distExists, DIST_DIR: html.DIST_DIR };
