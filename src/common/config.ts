const Config = {
  Server: {
    port: 3000,
    apiBaseUrl: process.env.API_BASE_URL ?? 'http://localhost:3000',
  },
  DB: {
    Host: process.env.DB_HOST,
    Port: parseInt(process.env.DB_PORT ?? '5432', 10),
    User: process.env.DB_USER,
    Password: process.env.DB_PASSWORD,
    Database: process.env.DB_NAME,
    MaxPooledConnections: parseInt(process.env.DB_MAX_POOLED_CONNECTIONS ?? '50', 10),
  },
};

export default Config;
export { Config };
