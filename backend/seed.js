const argon2 = require('argon2');
const logger = require('./src/utils/logger');
const { connectDB, disconnectDB } = require('./src/config/db');
const { User } = require('./src/models');
const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = require('./src/config/env');

async function seedAdmin() {
  await connectDB();
  try {
    const existing = await User.exists({ email: ADMIN_EMAIL });
    if (existing) {
      logger.info('Admin user already exists');
      return;
    }

    const passwordHash = await argon2.hash(ADMIN_PASSWORD, {
      type: argon2.argon2id,
    });

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password_hash: passwordHash,
      role: 'admin',
    });

    logger.info('Admin user created');
  } catch (error) {
    logger.error({ err: error }, 'Admin seed failed');
  } finally {
    await disconnectDB();
  }
}

seedAdmin();
