const rateLimit = require('express-rate-limit');
const { env } = require('../config/env');

// Rate limits are no-ops in tests to keep suites deterministic.
const skip = () => env.isTest;

const api = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip,
});

const login = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip,
  message: { error: 'Too many attempts, try again later' },
});

const inquiries = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip,
  message: { error: 'Too many messages, try again later' },
});

const reviews = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip,
});

module.exports = { api, login, inquiries, reviews };
