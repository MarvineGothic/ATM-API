const originalConfig = require('./knexfile');

module.exports = {
  ...originalConfig,
  migrations: {
    ...originalConfig.migrations,
    directory: './src/migrations',
  }
};
