const site = require('../config/site');

// Canonical storage unit is square feet.
function toSqFt(value, unit) {
  if (unit === 'marla') return value * site.marlaSqFt;
  if (unit === 'kanal') return value * site.marlaSqFt * site.kanalMarlas;
  return value;
}

module.exports = { toSqFt };
