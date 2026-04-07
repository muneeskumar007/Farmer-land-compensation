const { Pool } = require('pg');
const logger = require('../utils/logger');
const { DATABASE_URL } = require('./env');

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function testConnection() {
  try {
    await pool.query('SELECT 1');
    logger.info('Database connection established');
  } catch (error) {
    logger.error({ err: error }, 'Database connection failed');
    process.exit(1);
  }
}

testConnection();

async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 500) {
      logger.warn({ duration, text }, 'Slow query detected');
    }
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    if (duration > 500) {
      logger.warn({ duration, text }, 'Slow query detected');
    }
    throw error;
  }
}

module.exports = {
  pool,
  query,
};
