const { config } = require("dotenv");

config({
    path: ".env"
});

const PORT = process.env.PORT;
const DB_CONNECT = process.env.DB_CONNECT;
const JWT_SECRET = process.env.JWT_SECRET;
const MAIL_EMAIL = process.env.MAIL_EMAIL;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
const APP_NAME = process.env.APP_NAME;

const CONFIG = {
    PORT,
    DB_CONNECT,
    JWT_SECRET,
    MAIL_EMAIL,
    MAIL_PASSWORD,
    APP_NAME,
}

module.exports = {
    CONFIG,
};