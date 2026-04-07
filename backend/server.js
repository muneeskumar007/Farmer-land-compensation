const app = require('./src/app');
const logger = require('./src/utils/logger');
const { PORT } = require('./src/config/env');

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
