// "7 Marla House, Street 12" -> "7-marla-house-street-12"
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Keeps slugs unique without exposing the Mongo _id.
function withSuffix(slug) {
  return `${slug}-${Math.random().toString(36).slice(2, 7)}`;
}

module.exports = { slugify, withSuffix };
