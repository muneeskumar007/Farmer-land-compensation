const app = require('./src/app');
const logger = require('./src/utils/logger');
const { PORT } = require('./src/config/env');
const { connectDB } = require('./src/config/db');

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
  });
}

startServer();
