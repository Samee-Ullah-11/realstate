import { formatPrice } from './format';

// Preset price bands for the search bar and filters, in PKR.
export const BUDGETS = [
  { key: 'u50l', max: 5_000_000 },
  { key: '50l-1c', min: 5_000_000, max: 10_000_000 },
  { key: '1c-3c', min: 10_000_000, max: 30_000_000 },
  { key: 'o3c', min: 30_000_000 },
];

export function budgetLabel(budget, t) {
  const min = budget.min != null ? formatPrice(budget.min, { t }) : null;
  const max = budget.max != null ? formatPrice(budget.max, { t }) : null;
  if (min && max) return `${min} – ${max}`;
  if (max) return `${t('filters.upTo')} ${max}`;
  return `${t('filters.over')} ${min}`;
}

export function budgetFromParams(minPrice, maxPrice) {
  return (
    BUDGETS.find(
      (budget) =>
        String(budget.min ?? '') === (minPrice ?? '') &&
        String(budget.max ?? '') === (maxPrice ?? '')
    )?.key || ''
  );
}

export function paramsFromBudget(key) {
  const budget = BUDGETS.find((candidate) => candidate.key === key);
  return { minPrice: budget?.min?.toString() || '', maxPrice: budget?.max?.toString() || '' };
}
