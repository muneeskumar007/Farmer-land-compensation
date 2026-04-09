const dotenv = require('dotenv');

dotenv.config();

const requiredVars = [
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'ML_SERVICE_URL',
  'PORT',
  'NODE_ENV',
];

const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  // Fail fast with descriptive error
  throw new Error(
    `Missing required environment variables: ${missing.join(', ')}`
  );
}

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ML_SERVICE_URL: process.env.ML_SERVICE_URL,
  PORT: parseInt(process.env.PORT, 10),
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Admin User',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
};
