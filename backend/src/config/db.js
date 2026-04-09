const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { MONGODB_URI } = require('./env');

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    logger.info('Database connection established');
  } catch (error) {
    logger.error({ err: error }, 'Database connection failed');
    process.exit(1);
  }
}

async function disconnectDB() {
  if (!isConnected) {
    return;
  }

  await mongoose.disconnect();
  isConnected = false;
}

module.exports = {
  mongoose,
  connectDB,
  disconnectDB,
};
