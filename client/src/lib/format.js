import site from '../config/site';

const CRORE = 10_000_000;
const LAKH = 100_000;

function trimZeros(n, decimals) {
  return Number(n.toFixed(decimals)).toString();
}

// 12_500_000 -> "1.25 Crore", 8_500_000 -> "85 Lakh", 95_000 -> "95,000"
export function formatPrice(pkr, { t } = {}) {
  if (pkr == null) return t ? t('price.onCall') : 'Price on call';
  if (pkr >= CRORE) return `${trimZeros(pkr / CRORE, 2)} ${t ? t('units.crore') : 'Crore'}`;
  if (pkr >= LAKH) return `${trimZeros(pkr / LAKH, 2)} ${t ? t('units.lakh') : 'Lakh'}`;
  return pkr.toLocaleString('en-PK');
}

// Canonical storage is sq ft; display in the unit the size naturally reads in.
export function formatArea(sqFt, { t, unit } = {}) {
  const marlaSize = site.marlaSqFt;
  const kanalSize = marlaSize * site.kanalMarlas;
  const labels = {
    marla: t ? t('units.marla') : 'Marla',
    kanal: t ? t('units.kanal') : 'Kanal',
    sqft: t ? t('units.sqft') : 'sq ft',
  };

  const chosen =
    unit ||
    (sqFt >= kanalSize ? 'kanal' : sqFt >= marlaSize * 0.9 ? 'marla' : 'sqft');

  if (chosen === 'kanal') return `${trimZeros(sqFt / kanalSize, 2)} ${labels.kanal}`;
  if (chosen === 'marla') return `${trimZeros(sqFt / marlaSize, 2)} ${labels.marla}`;
  return `${Math.round(sqFt).toLocaleString('en-PK')} ${labels.sqft}`;
}

export function toSqFt(value, unit) {
  if (unit === 'marla') return value * site.marlaSqFt;
  if (unit === 'kanal') return value * site.marlaSqFt * site.kanalMarlas;
  return value;
}
