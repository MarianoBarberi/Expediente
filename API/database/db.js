const mysql = require('mysql2/promise');
const dbConfig = require("../config/db.config.js");

async function getConnection() {
    const connection = await mysql.createConnection({
        host: dbConfig.HOST,
        user: dbConfig.USER,
        password: dbConfig.PASSWORD,
        database: dbConfig.DB
    });

    // Check if connection is established
    try {
        await connection.connect();
        console.log("Successfully connected to the database.");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }

    return connection;
}

async function executeQuery(query, params) {
    const connection = await getConnection();

    try {
        const [results, ] = await connection.execute(query, params);
        return results;
    } catch (error) {
        console.error("Query execution failed:", error);
        throw error;
    } finally {
        await connection.end();
    }
}

module.exports = {
    getConnection,
    executeQuery
};