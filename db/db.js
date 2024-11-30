const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const password = process.env.DB_PASSWORD

// Create a pool of database connections
const pool = new Pool({
  user: 'postgres', // replace with your DB username
  host: 'localhost',
  database: 'approval_system',
  password: password, // replace with your DB password
  port: 5432,
});

module.exports = pool;
