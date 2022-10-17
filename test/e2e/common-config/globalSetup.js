const {setTimeout} = require('timers/promises');

if (process.env.TS_JEST === '1') {
  const dotenv = require('dotenv');
  dotenv.config({path: './test/e2e/local-config/.env'});
}

module.exports = async () => {
  const workers = parseInt(process.env.JEST_WORKERS || '2', 10);
  
  const knex = require('knex')({
    client: 'pg',
    useNullAsDefault: true,
    asyncStackTraces: true,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './dist/migrations',
    },
  });

  const now = Date.now();
  const timeoutInMS = 10000;

  while (true) {
    try {
      await knex.raw('SELECT 1 + 1');

      console.log('Database is up - processing');

      break;
    } catch (error) {
      if (Date.now() - now >= timeoutInMS) {
        console.log('Database connection cannot be established. Exiting...');

        throw new Error('Database connection cannot be established');
      }

      console.log('Database is unavailable - sleeping');

      await setTimeout(1000);
    }
  }

  await knex.raw(`DROP SCHEMA public CASCADE;`);

  await knex.raw(`CREATE SCHEMA public;`);
  await knex.raw(`ALTER SCHEMA public OWNER to ${ process.env.DB_USER };`);

  await knex.migrate.latest();

  await knex.destroy();

  for (let i = 1; i <= workers; i++) {
    // TODO: create DB for each worker and run migrations for it
  }
};
