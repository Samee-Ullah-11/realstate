import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { connectTestDb, disconnectTestDb, getModel } from './helpers';

let app;
let property;

beforeAll(async () => {
  await connectTestDb();
  app = (await import('../app')).default();
  const agent = await getModel('Agent').create({ name: 'Test Agent', slug: 'test-agent' });
  property = await getModel('Property').create({
    title: { en: 'Inquiry target house' },
    slug: 'inquiry-target-house',
    purpose: 'buy',
    type: 'house',
    price: 10_000_000,
    areaSqFt: 1361,
    city: 'Peshawar',
    area: 'Hayatabad',
    agentId: agent._id,
  });
});

afterAll(disconnectTestDb);

describe('inquiry flow', () => {
  it('accepts a valid inquiry tied to a property', async () => {
    const res = await request(app).post('/api/v1/inquiries').send({
      propertyId: property._id.toString(),
      name: 'Gul Khan',
      phone: '0300 1234567',
      message: 'Is this still available?',
      language: 'ur',
    });
    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);

    const saved = await getModel('Inquiry').findById(res.body.id).lean();
    expect(saved.propertyId.toString()).toBe(property._id.toString());
    expect(saved.status).toBe('new');
    expect(saved.language).toBe('ur');
  });

  it('accepts a general inquiry without a property', async () => {
    const res = await request(app)
      .post('/api/v1/inquiries')
      .send({ name: 'Zara Bibi', phone: '+92 311 7654321' });
    expect(res.status).toBe(201);
  });

  it('stores an inquiry as general when the property id is unknown', async () => {
    const res = await request(app).post('/api/v1/inquiries').send({
      propertyId: 'aaaaaaaaaaaaaaaaaaaaaaaa',
      name: 'Gul Khan',
      phone: '0300 1234567',
    });
    expect(res.status).toBe(201);
    const saved = await getModel('Inquiry').findById(res.body.id).lean();
    expect(saved.propertyId).toBeNull();
  });

  it('rejects missing name or bad phone', async () => {
    const noName = await request(app)
      .post('/api/v1/inquiries')
      .send({ phone: '0300 1234567' });
    const badPhone = await request(app)
      .post('/api/v1/inquiries')
      .send({ name: 'Gul Khan', phone: 'call me' });
    expect(noName.status).toBe(400);
    expect(badPhone.status).toBe(400);
  });

  it('rejects a filled honeypot field', async () => {
    const res = await request(app).post('/api/v1/inquiries').send({
      name: 'Bot',
      phone: '0300 1234567',
      website: 'https://spam.example',
    });
    expect(res.status).toBe(400);
  });
});
