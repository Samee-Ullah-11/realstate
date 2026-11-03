const { env, assertEnv } = require('./config/env');

assertEnv();

const mongoose = require('mongoose');
const createApp = require('./app');
const logger = require('./utils/logger');

async function main() {
  await mongoose.connect(env.mongodbUri);
  logger.info('MongoDB connected');

  const app = createApp();
  app.listen(env.port, () => logger.info(`API listening on port ${env.port}`));
}

main().catch((err) => {
  logger.error('Failed to start', { message: err.message });
  process.exit(1);
});
