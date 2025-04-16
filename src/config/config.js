const { config } = require("dotenv");

config({
    path: ".env"
});

const PORT = process.env.PORT;
const DB_CONNECT = process.env.DB_CONNECT;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    PORT,
    DB_CONNECT,
    JWT_SECRET
};