/*const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'webdatabase',
  password: 'rftgy2138Hyy@',
  port: 5432,
});

module.exports = pool;*/

const { Pool } = require('pg');

const pool = new Pool({
  user: 'zhangaozhuo6',
  host: 'ep-steep-dream-64032455.us-east-2.aws.neon.tech',
  database: 'bookdb',
  password: '8LEIHkvJz9wq',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
  sslmode: 'require',
});

module.exports = pool;
