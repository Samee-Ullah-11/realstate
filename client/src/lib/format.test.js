import { describe, it, expect } from 'vitest';
import { formatPrice, formatArea, toSqFt } from './format';
import site from '../config/site';

describe('formatPrice', () => {
  it('formats crore with trimmed decimals', () => {
    expect(formatPrice(12_500_000)).toBe('1.25 Crore');
    expect(formatPrice(10_000_000)).toBe('1 Crore');
    expect(formatPrice(32_500_000)).toBe('3.25 Crore');
  });

  it('formats lakh', () => {
    expect(formatPrice(8_500_000)).toBe('85 Lakh');
    expect(formatPrice(100_000)).toBe('1 Lakh');
    expect(formatPrice(9_950_000)).toBe('99.5 Lakh');
  });

  it('formats small amounts with separators', () => {
    expect(formatPrice(55_000)).toBe('55,000');
  });

  it('handles price on call', () => {
    expect(formatPrice(null)).toBe('Price on call');
    expect(formatPrice(undefined)).toBe('Price on call');
  });

  it('uses translations when provided', () => {
    const t = (key) => ({ 'units.crore': 'کروڑ' })[key] || key;
    expect(formatPrice(10_000_000, { t })).toBe('1 کروڑ');
  });
});

describe('formatArea', () => {
  const marla = site.marlaSqFt;

  it('shows marla for marla-scale sizes', () => {
    expect(formatArea(5 * marla)).toBe('5 Marla');
    expect(formatArea(7.5 * marla)).toBe('7.5 Marla');
  });

  it('shows kanal for kanal-scale sizes', () => {
    expect(formatArea(20 * marla)).toBe('1 Kanal');
    expect(formatArea(40 * marla)).toBe('2 Kanal');
  });

  it('shows square feet for small sizes', () => {
    expect(formatArea(120)).toBe('120 sq ft');
  });

  it('respects a forced unit', () => {
    expect(formatArea(20 * marla, { unit: 'marla' })).toBe('20 Marla');
  });
});

describe('toSqFt', () => {
  it('converts marla and kanal using config', () => {
    expect(toSqFt(1, 'marla')).toBeCloseTo(site.marlaSqFt);
    expect(toSqFt(1, 'kanal')).toBeCloseTo(site.marlaSqFt * site.kanalMarlas);
    expect(toSqFt(850, 'sqft')).toBe(850);
  });
});
