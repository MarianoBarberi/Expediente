const mysql = require('mysql2')
const dbConfig = require("../config/db.config.js");

// Create a connection to the database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,

    // host: dbConfig.HOST,
    // user: dbConfig.USER,
    // password: dbConfig.PASSWORD,
    // database: dbConfig.DB
  });

// open the MySQL connection
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});


module.exports = connection;