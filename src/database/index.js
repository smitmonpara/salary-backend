const mongoose = require("mongoose");
const { DB_CONNECT } = require("../config/config");

/**
 * Establishes a connection to the database using the connection string
 * specified in the configuration.
 * 
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the 
 * connection is successful, or false if there is an error.
 */
async function databaseConnect() {
    try {
        await mongoose.connect(DB_CONNECT);
        console.log("Database connect successfully 😂😂");
        return true;
    } catch (error) {
        console.log("Error connecting to database", error);
        return false;
    }
};

module.exports = { databaseConnect };