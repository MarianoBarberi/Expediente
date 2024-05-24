const mysql = require('mysql2');
const dbConfig = require("../config/db.config.js");

// Create a connection pool
const pool = mysql.createPool({
  // host: process.env.DB_HOST,
  // database: process.env.DB_NAME,
  // password: process.env.DB_PASSWORD,
  // user: process.env.DB_USER,

  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
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