import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { connectTestDb, disconnectTestDb, getModel } from './helpers';

let app;
let agent;
let propertyService;

const base = {
  description: { en: '', ur: '' },
  city: 'Peshawar',
  features: [],
};

function makeProperty(overrides) {
  return propertyService.create(
    {
      title: { en: overrides.titleEn, ur: '' },
      purpose: 'buy',
      type: 'house',
      status: 'available',
      isDraft: false,
      price: 10_000_000,
      priceOnCall: false,
      areaValue: 5,
      areaUnit: 'marla',
      bedrooms: 3,
      bathrooms: 2,
      area: 'Hayatabad Phase 3',
      location: null,
      isFeatured: false,
      ...base,
      ...overrides,
    },
    { agentId: agent._id, userId: agent._id }
  );
}

beforeAll(async () => {
  await connectTestDb();
  app = (await import('../app')).default();
  propertyService = (await import('../services/property.service')).default;
  agent = await getModel('Agent').create({ name: 'Test Agent', slug: 'test-agent' });

  await makeProperty({ titleEn: 'Cheap house', price: 5_000_000, bedrooms: 2 });
  await makeProperty({
    titleEn: 'Mid house',
    price: 15_000_000,
    bedrooms: 4,
    area: 'University Town',
  });
  await makeProperty({
    titleEn: 'Expensive rental',
    purpose: 'rent',
    price: 80_000,
    bedrooms: 5,
  });
  await makeProperty({ titleEn: 'Plot no beds', type: 'plot', bedrooms: null });
  await makeProperty({ titleEn: 'Sold apartment', type: 'apartment', status: 'sold' });
  await makeProperty({ titleEn: 'Hidden one', status: 'hidden' });
  await makeProperty({ titleEn: 'Draft one', isDraft: true });
  const deleted = await makeProperty({ titleEn: 'Deleted one' });
  await propertyService.softDelete(deleted._id);
});

afterAll(disconnectTestDb);

async function titles(query = '') {
  const res = await request(app).get(`/api/v1/properties${query}`);
  expect(res.status).toBe(200);
  return { titles: res.body.items.map((p) => p.title.en), body: res.body };
}

describe('public property listing', () => {
  it('never returns hidden, draft, or deleted properties', async () => {
    const { titles: list } = await titles();
    expect(list).not.toContain('Hidden one');
    expect(list).not.toContain('Draft one');
    expect(list).not.toContain('Deleted one');
    expect(list.length).toBe(5);
  });

  it('filters by purpose', async () => {
    const { titles: list } = await titles('?purpose=rent');
    expect(list).toEqual(['Expensive rental']);
  });

  it('filters by type', async () => {
    const { titles: list } = await titles('?type=plot');
    expect(list).toEqual(['Plot no beds']);
  });

  it('filters by price range', async () => {
    const { titles: list } = await titles('?minPrice=6000000&maxPrice=20000000');
    expect(list.sort()).toEqual(['Mid house', 'Plot no beds', 'Sold apartment'].sort());
  });

  it('filters by minimum bedrooms', async () => {
    const { titles: list } = await titles('?beds=4');
    expect(list.sort()).toEqual(['Expensive rental', 'Mid house'].sort());
  });

  it('matches area case-insensitively', async () => {
    const { titles: list } = await titles('?area=university');
    expect(list).toEqual(['Mid house']);
  });

  it('filters by status', async () => {
    const { titles: list } = await titles('?status=sold');
    expect(list).toEqual(['Sold apartment']);
  });

  it('sorts by price ascending', async () => {
    const { body } = await titles('?sort=priceAsc&purpose=buy');
    const prices = body.items.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('paginates and reports totals', async () => {
    const { body } = await titles('?limit=2&page=2');
    expect(body.items.length).toBe(2);
    expect(body.total).toBe(5);
    expect(body.pages).toBe(3);
  });

  it('rejects invalid filter values', async () => {
    const res = await request(app).get('/api/v1/properties?purpose=invalid');
    expect(res.status).toBe(400);
  });

  it('serves a property by slug but not hidden ones', async () => {
    const ok = await request(app).get('/api/v1/properties/cheap-house');
    expect(ok.status).toBe(200);
    expect(ok.body.title.en).toBe('Cheap house');

    const hidden = await request(app).get('/api/v1/properties/hidden-one');
    expect(hidden.status).toBe(404);
  });

  it('returns related properties from the same area first', async () => {
    const res = await request(app).get('/api/v1/properties/cheap-house/related');
    expect(res.status).toBe(200);
    const related = res.body.map((p) => p.title.en);
    expect(related).not.toContain('Cheap house');
    expect(related.length).toBe(3);
    // All three candidates share the area, so every slot comes from Hayatabad Phase 3.
    expect(res.body.every((p) => p.area === 'Hayatabad Phase 3')).toBe(true);
  });

  it('converts marla input to canonical square feet', async () => {
    const res = await request(app).get('/api/v1/properties/cheap-house');
    expect(res.body.areaSqFt).toBeCloseTo(5 * 272.25);
    expect(res.body.areaUnitEntered).toBe('marla');
  });
});
