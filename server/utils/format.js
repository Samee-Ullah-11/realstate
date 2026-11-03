const CRORE = 10_000_000;
const LAKH = 100_000;

function trimZeros(n, decimals) {
  return Number(n.toFixed(decimals)).toString();
}

// Server-side twin of the client price formatter, for meta tags and previews.
function formatPrice(pkr) {
  if (pkr == null) return 'Price on call';
  if (pkr >= CRORE) return `${trimZeros(pkr / CRORE, 2)} Crore`;
  if (pkr >= LAKH) return `${trimZeros(pkr / LAKH, 2)} Lakh`;
  return pkr.toLocaleString('en-PK');
}

module.exports = { formatPrice };
