// Vercel serverless handler. Lives in server/ so every require resolves from
// server/node_modules; api/index.js just re-exports it. The whole Express app
// (API + SEO-injected SPA) runs inside one function, and the mongoose
// connection is created once per warm instance and reused.
const mongoose = require('mongoose');
const { env, assertEnv } = require('./config/env');
const createApp = require('./app');

assertEnv();

const app = createApp();
let connecting = null;

module.exports = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    if (!connecting) {
      connecting = mongoose.connect(env.mongodbUri).catch((err) => {
        connecting = null;
        throw err;
      });
    }
    await connecting;
  }
  return app(req, res);
};
