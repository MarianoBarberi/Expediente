const mysql = require('mysql2')
const dbConfig = require("../config/db.config.js");

// Create a connection to the database
const connection = mysql.createConnection({
    host: process.env.DB_HOST || dbConfig.HOST,
    database: process.env.DB_NAME || dbConfig.DB,
    password: process.env.DB_PASSWORD || dbConfig.PASSWORD,
    user: process.env.DB_USER || dbConfig.USER,
  });

// open the MySQL connection
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});


module.exports = connection;