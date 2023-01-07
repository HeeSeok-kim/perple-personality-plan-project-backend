// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const env = process.env;

const development = {
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_SCHEMA,
  host: env.DATABASE_HOST,
  dialect: 'mysql',
};

module.exports = { development };
