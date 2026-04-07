const crypto = require('crypto');
const { query } = require('../../config/db');

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function createUser(name, email, passwordHash, role) {
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, is_active, created_at`,
    [name, email, passwordHash, role]
  );
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await query(
    `SELECT id, name, email, role, password_hash, is_active, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

async function isTokenBlocked(token) {
  const tokenHash = hashToken(token);
  const result = await query(
    `SELECT 1
     FROM token_blocklist
     WHERE token_hash = $1 AND expires_at > NOW()
     LIMIT 1`,
    [tokenHash]
  );
  return result.rowCount > 0;
}

async function blockToken(token, expiresAt) {
  const tokenHash = hashToken(token);
  await query(
    `INSERT INTO token_blocklist (token_hash, expires_at)
     VALUES ($1, $2)
     ON CONFLICT (token_hash) DO NOTHING`,
    [tokenHash, expiresAt]
  );
}

module.exports = {
  createUser,
  findUserByEmail,
  isTokenBlocked,
  blockToken,
};
