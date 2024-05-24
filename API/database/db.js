const mysql = require('mysql2');
const dbConfig = require("../config/db.config.js");

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || dbConfig.HOST,
  database: process.env.DB_NAME || dbConfig.DB,
  password: process.env.DB_PASSWORD || dbConfig.PASSWORD,
  user: process.env.DB_USER || dbConfig.USER,
});

// Get a connection from the pool
pool.getConnection((error, connection) => {
  if (error) throw error;

  // Execute your command here
  connection.query('SELECT * FROM cars', (error, results) => {
    if (error) throw error;

    // Process the results

    // Release the connection back to the pool
    connection.release();
  });
});

module.exports = pool;