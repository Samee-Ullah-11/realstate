process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-for-the-test-suite-only';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';
process.env.MONGODB_URI = 'set-by-memory-server';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

async function connectTestDb() {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}

async function disconnectTestDb() {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
}

async function clearDb() {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) await collection.deleteMany({});
}

// Models register themselves on the shared mongoose instance when the app
// loads; fetching them from the registry avoids double-compiling schemas
// under vitest's module transform.
function getModel(name) {
  return mongoose.model(name);
}

// Loads a server module through the same CJS cache the app uses, so tests
// share module state (caches, env) instead of getting a second instance.
// Paths are relative to this tests directory.
function requireShared(modulePath) {
  return require(modulePath);
}

module.exports = { connectTestDb, disconnectTestDb, clearDb, getModel, requireShared };
