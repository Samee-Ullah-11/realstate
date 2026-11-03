const fs = require('fs');
const path = require('path');
const { env } = require('../config/env');
const site = require('../config/site');

const DIST_DIR = path.join(__dirname, '..', '..', 'client', 'dist');
const TITLE_RE = /<title>.*?<\/title>/s;

let cachedTemplate = null;

function distExists() {
  return fs.existsSync(path.join(DIST_DIR, 'index.html'));
}

function template() {
  if (!cachedTemplate || !env.isProd) {
    cachedTemplate = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
  }
  return cachedTemplate;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Injects title, description, canonical, OG/Twitter, hreflang, and JSON-LD
// into the built SPA shell so link previews and crawlers work without JS.
function render(meta) {
  const url = `${env.siteUrl}${meta.path}`;
  const lines = [
    meta.preload &&
      `<link rel="preload" as="image" href="${escapeHtml(meta.preload.href)}" imagesrcset="${escapeHtml(meta.preload.srcset)}" imagesizes="100vw" fetchpriority="high" />`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    meta.noindex
      ? '<meta name="robots" content="noindex, nofollow" />'
      : `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<link rel="alternate" hreflang="en" href="${escapeHtml(`${url}?lang=en`)}" />`,
    `<link rel="alternate" hreflang="ur" href="${escapeHtml(`${url}?lang=ur`)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(url)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(site.businessName)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    meta.image && `<meta property="og:image" content="${escapeHtml(meta.image)}" />`,
    meta.price != null &&
      `<meta property="product:price:amount" content="${meta.price}" />`,
    meta.price != null && `<meta property="product:price:currency" content="PKR" />`,
    `<meta name="twitter:card" content="${meta.image ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    meta.image && `<meta name="twitter:image" content="${escapeHtml(meta.image)}" />`,
    meta.jsonLd &&
      `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>`,
  ].filter(Boolean);

  return template()
    .replace(TITLE_RE, `<title>${escapeHtml(meta.title)}</title>`)
    .replace('</head>', `    ${lines.join('\n    ')}\n  </head>`);
}

module.exports = { render, distExists, DIST_DIR };
