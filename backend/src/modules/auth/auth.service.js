const crypto = require('crypto');
const { User, TokenBlocklist } = require('../../models');

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function createUser(name, email, passwordHash, role) {
  const user = await User.create({
    name,
    email,
    password_hash: passwordHash,
    role,
  });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
    created_at: user.created_at,
  };
}

async function findUserByEmail(email) {
  const user = await User.findOne({ email }).lean();
  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    password_hash: user.password_hash,
    is_active: user.is_active,
    created_at: user.created_at,
  };
}

async function isTokenBlocked(token) {
  const tokenHash = hashToken(token);
  const exists = await TokenBlocklist.exists({
    token_hash: tokenHash,
    expires_at: { $gt: new Date() },
  });
  return Boolean(exists);
}

async function blockToken(token, expiresAt) {
  const tokenHash = hashToken(token);
  await TokenBlocklist.updateOne(
    { token_hash: tokenHash },
    { $setOnInsert: { token_hash: tokenHash, expires_at: expiresAt } },
    { upsert: true }
  );
}

module.exports = {
  createUser,
  findUserByEmail,
  isTokenBlocked,
  blockToken,
};
