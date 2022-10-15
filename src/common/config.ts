const Config = {
  Server: {
    port: 3000,
    apiBaseUrl: process.env.API_BASE_URL ?? 'http://localhost:3000',
  },
};

export default Config;
export { Config };
