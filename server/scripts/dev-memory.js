// Development convenience when no MongoDB is installed: boots the API against
// an in-memory MongoDB and runs the seed. Data resets on every restart.
// Use a real MONGODB_URI (local or Atlas) for anything you want to keep.

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-memory-only-secret-not-for-prod';
process.env.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
// Fixed admin password in this throwaway mode so logins survive restarts.
process.env.DEV_ADMIN_PASSWORD = process.env.DEV_ADMIN_PASSWORD || 'dev-admin-123';

const { MongoMemoryServer } = require('mongodb-memory-server');

async function main() {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri('milestone');
  console.log('In-memory MongoDB started (data is NOT persisted)');

  const { execFileSync } = require('child_process');
  execFileSync(process.execPath, ['scripts/seed.js'], {
    cwd: require('path').join(__dirname, '..'),
    env: process.env,
    stdio: 'inherit',
  });

  require('../index');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
