const { Pool } = require('pg');
require('dotenv').config();

// Create a new connection pool using our .env variables
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

// Verify the database connection pool is working smoothly
pool.on('connect', () => {
    console.log('🐘 PostgreSQL Connection Pool established successfully.');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected database error occurred:', err.message);
    process.exit(-1);
});

// Export a helpful helper function to run queries across our app
module.exports = {
    query: (text, params) => pool.query(text, params),
    pool // Exporting the raw pool just in case we need it later
};