const { env } = require('../config/env');
const logger = require('../utils/logger');

// Google Places API (New). Review text is served live and cached IN MEMORY
// only — never written to MongoDB or any other storage, because Google's
// terms restrict storing review content.
const PLACES_URL = 'https://places.googleapis.com/v1/places';
const FIELD_MASK = 'rating,userRatingCount,reviews,googleMapsUri';

const CACHE_TTL = 24 * 60 * 60 * 1000;
// Failures are cached briefly so a Google outage cannot trigger a request storm.
const FAILURE_TTL = 5 * 60 * 1000;

const cache = new Map();

function clearCache() {
  cache.clear();
}

// Google returns at most 5 reviews, chosen by relevance; the site shows
// exactly what it gets and never claims to show all reviews.
function mapResponse(data, placeId) {
  if (data.rating == null || !data.userRatingCount || !data.reviews?.length) return null;
  return {
    rating: data.rating,
    total: data.userRatingCount,
    googleMapsUri: data.googleMapsUri,
    writeReviewUrl: `https://search.google.com/local/writereview?placeid=${placeId}`,
    reviews: data.reviews.slice(0, 5).map((review) => ({
      author: review.authorAttribution?.displayName || '',
      authorPhoto: review.authorAttribution?.photoUri || '',
      rating: review.rating,
      date: review.relativePublishTimeDescription || '',
      text: review.text?.text || '',
    })),
  };
}

// Returns the mapped payload, or null when the section must not render:
// missing config, API failure, or no reviews.
async function getGoogleReviews(lang = 'en') {
  const { placesApiKey } = env.google;
  // Place ID: .env wins; otherwise the admin-editable setting.
  let placeId = env.google.placeId;
  if (!placeId) {
    const settingsService = require('./settings.service');
    placeId = (await settingsService.getMerged()).googlePlaceId;
  }
  if (!placeId || !placesApiKey) return null;

  const cacheKey = `${placeId}:${lang}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  let value = null;
  try {
    const res = await fetch(`${PLACES_URL}/${placeId}?languageCode=${lang}`, {
      headers: {
        'X-Goog-Api-Key': placesApiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
    });
    if (res.ok) {
      value = mapResponse(await res.json(), placeId);
    } else {
      logger.warn('Google Places request failed', { status: res.status });
    }
  } catch (err) {
    logger.warn('Google Places request errored', { message: err.message });
  }

  cache.set(cacheKey, {
    value,
    expiresAt: Date.now() + (value ? CACHE_TTL : FAILURE_TTL),
  });
  return value;
}

module.exports = { getGoogleReviews, clearCache };
