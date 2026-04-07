const argon2 = require('argon2');
const logger = require('./src/utils/logger');
const { query, pool } = require('./src/config/db');
const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = require('./src/config/env');

async function seedAdmin() {
  try {
    const existing = await query(
      'SELECT id FROM users WHERE email = $1 LIMIT 1',
      [ADMIN_EMAIL]
    );
    if (existing.rowCount > 0) {
      logger.info('Admin user already exists');
      return;
    }

    const passwordHash = await argon2.hash(ADMIN_PASSWORD, {
      type: argon2.argon2id,
    });

    await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')`,
      [ADMIN_NAME, ADMIN_EMAIL, passwordHash]
    );

    logger.info('Admin user created');
  } catch (error) {
    logger.error({ err: error }, 'Admin seed failed');
  } finally {
    await pool.end();
  }
}

seedAdmin();
