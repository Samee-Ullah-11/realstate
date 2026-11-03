const site = require('../config/site');
const { env } = require('../config/env');
const Property = require('../models/Property');
const { formatPrice } = require('../utils/format');

const PUBLIC_FILTER = { deletedAt: null, isDraft: false, status: { $ne: 'hidden' } };

const abs = (path) => `${env.siteUrl}${path}`;

function truncate(text, max = 160) {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

function agentJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: site.businessName,
    telephone: site.phone,
    email: site.email,
    url: env.siteUrl,
    areaServed: site.areasServed,
    address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'PK' },
  };
}

function defaults(path) {
  return {
    path,
    title: `${site.businessName} · ${site.city}`,
    description: truncate(
      `Houses, plots, apartments and commercial property for sale and rent in ${site.city}. Contact ${site.agentName} on ${site.phone}.`
    ),
    image: null,
    jsonLd: null,
    noindex: false,
    status: 200,
  };
}

// Deliberately no AggregateRating or Review markup anywhere.
async function metaFor(path) {
  const meta = defaults(path);

  if (path === '/') {
    meta.image = site.heroPhoto.url;
    // The hero is the LCP element; preloading it from the injected HTML
    // lets the browser start the download before React renders.
    meta.preload = { href: site.heroPhoto.url, srcset: site.heroPhoto.srcset };
    meta.jsonLd = agentJsonLd();
    return meta;
  }

  if (path === '/properties') {
    meta.title = `Properties for sale and rent in ${site.city} · ${site.businessName}`;
    return meta;
  }

  const slugMatch = path.match(/^\/properties\/([a-z0-9-]+)$/);
  if (slugMatch) {
    const property = await Property.findOne({ slug: slugMatch[1], ...PUBLIC_FILTER }).lean();
    if (!property) return { ...meta, status: 404, title: `Not found · ${site.businessName}` };
    const price = formatPrice(property.priceOnCall ? null : property.price);
    meta.title = `${property.title.en} — ${price} · ${site.businessName}`;
    meta.description = truncate(
      property.description.en || `${property.title.en}, ${property.area}, ${property.city}. ${price}.`
    );
    meta.image = property.photos[0]?.url || null;
    meta.price = property.priceOnCall ? null : property.price;
    meta.jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: property.title.en,
      url: abs(path),
      description: meta.description,
      image: property.photos.map((photo) => photo.url),
      datePosted: property.createdAt,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'PKR',
        ...(property.price != null && !property.priceOnCall ? { price: property.price } : {}),
        availability:
          property.status === 'available'
            ? 'https://schema.org/InStock'
            : 'https://schema.org/SoldOut',
      },
    };
    return meta;
  }

  if (path === '/about') {
    meta.title = `About ${site.agentName} · ${site.businessName}`;
    meta.description = truncate(
      `${site.agentName} of ${site.businessName}, serving ${site.areasServed.join(', ')}. Phone ${site.phone}.`
    );
    meta.jsonLd = agentJsonLd();
    return meta;
  }

  if (path === '/contact') {
    meta.title = `Contact · ${site.businessName}`;
    meta.description = truncate(
      `Call ${site.phone}, message on WhatsApp, or send an inquiry. Office hours: ${site.officeHours.en}.`
    );
    return meta;
  }

  if (path === '/privacy') return { ...meta, title: `Privacy policy · ${site.businessName}` };
  if (path === '/terms') return { ...meta, title: `Terms of use · ${site.businessName}` };

  if (path.startsWith('/admin') || path === '/style-guide') {
    return { ...meta, noindex: true };
  }

  // Unknown route: serve the SPA shell with a 404 status for crawlers.
  return { ...meta, status: 404, title: `Not found · ${site.businessName}` };
}

module.exports = { metaFor };
