import { describe, it, expect, beforeAll, afterAll, beforeEach, vi, afterEach } from 'vitest';
import request from 'supertest';
import { connectTestDb, disconnectTestDb, requireShared } from './helpers';

let app;
let reviewsService;
let envConfig;

const googlePayload = {
  rating: 4.8,
  userRatingCount: 23,
  googleMapsUri: 'https://maps.google.com/?cid=123',
  reviews: Array.from({ length: 7 }, (_, i) => ({
    rating: 5,
    relativePublishTimeDescription: `${i + 1} months ago`,
    text: { text: `Review number ${i + 1}` },
    authorAttribution: { displayName: `Reviewer ${i + 1}`, photoUri: '' },
  })),
};

function mockFetchOnce(response) {
  const fn = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fn);
  return fn;
}

beforeAll(async () => {
  await connectTestDb();
  app = requireShared('../app')();
  reviewsService = requireShared('../services/reviews.service');
  envConfig = requireShared('../config/env').env;
});

afterAll(disconnectTestDb);

beforeEach(() => {
  reviewsService.clearCache();
  envConfig.google.placeId = 'test-place-id';
  envConfig.google.placesApiKey = 'test-api-key';
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('google reviews service', () => {
  it('maps a successful response and caps reviews at 5', async () => {
    const fetchMock = mockFetchOnce({ ok: true, json: async () => googlePayload });
    const res = await request(app).get('/api/v1/reviews/google?lang=en');

    expect(res.status).toBe(200);
    expect(res.body.available).toBe(true);
    expect(res.body.rating).toBe(4.8);
    expect(res.body.total).toBe(23);
    expect(res.body.reviews.length).toBe(5);
    expect(res.body.reviews[0]).toEqual({
      author: 'Reviewer 1',
      authorPhoto: '',
      rating: 5,
      date: '1 months ago',
      text: 'Review number 1',
    });
    expect(res.body.writeReviewUrl).toBe(
      'https://search.google.com/local/writereview?placeid=test-place-id'
    );
    // Key goes to Google, never into the response body
    expect(JSON.stringify(res.body)).not.toContain('test-api-key');
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain('languageCode=en');
    expect(options.headers['X-Goog-Api-Key']).toBe('test-api-key');
  });

  it('reports unavailable when the Google call fails', async () => {
    mockFetchOnce({ ok: false, status: 403, json: async () => ({}) });
    const res = await request(app).get('/api/v1/reviews/google');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ available: false });
  });

  it('reports unavailable when there are no reviews', async () => {
    mockFetchOnce({
      ok: true,
      json: async () => ({ rating: 5, userRatingCount: 0, reviews: [] }),
    });
    const res = await request(app).get('/api/v1/reviews/google');
    expect(res.body).toEqual({ available: false });
  });

  it('serves the second request from cache', async () => {
    const fetchMock = mockFetchOnce({ ok: true, json: async () => googlePayload });
    await request(app).get('/api/v1/reviews/google?lang=en');
    await request(app).get('/api/v1/reviews/google?lang=en');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('caches per language', async () => {
    const fetchMock = mockFetchOnce({ ok: true, json: async () => googlePayload });
    await request(app).get('/api/v1/reviews/google?lang=en');
    await request(app).get('/api/v1/reviews/google?lang=ur');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toContain('languageCode=ur');
  });

  it('hides the section without config and never calls Google', async () => {
    envConfig.google.placeId = '';
    const fetchMock = mockFetchOnce({ ok: true, json: async () => googlePayload });
    const res = await request(app).get('/api/v1/reviews/google');
    expect(res.body).toEqual({ available: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
