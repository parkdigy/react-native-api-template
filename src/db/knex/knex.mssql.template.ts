import Knex from 'knex';

const knex = Knex({
  client: process.env.DB_CONNECTION,
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    charset: process.env.DB_CHARSET || 'utf8',

    // MSSQL
    options: {
      useUTC: false, // MSSQL 일 경우 반드시 추가해야 UTC 시간으로 저장되지 않음
    },
  },
  pool: { min: 0, max: 7 },
});

export default knex;
