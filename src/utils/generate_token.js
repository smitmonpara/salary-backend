const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

/**
 * Generates a JSON Web Token (JWT) for the given user ID.
 *
 * @param {string} id - The user ID to generate the JWT for.
 * @returns {string|null} The generated JWT if successful, or null if an error occurs.
 */
function generateToken(data) {
    try {
        const token = jwt.sign(data, JWT_SECRET);
        return token;
    } catch (e) {
        return null;
    }
}

/**
 * Verifies a JWT and returns the decoded payload.
 *
 * @param {string} token - The JWT to verify.
 * @returns {object|null} The decoded payload if the token is valid, or null if verification fails.
 */
function verifyToken(token) {
    try {
        const data = jwt.verify(token, JWT_SECRET);
        return data;
    } catch (e) {
        return null;
    }
}

module.exports = {
    generateToken,
    verifyToken
};