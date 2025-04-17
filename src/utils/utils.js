const os = require("os");
const crypto = require('crypto');

/**
 * Returns the local IP address of the machine.
 *
 * @returns {string} IP address in the form of "x.x.x.x"
 */
function getLocalIP() {
    try {
        const interfaces = os.networkInterfaces();
        for (const iface of Object.values(interfaces)) {
            for (const config of iface) {
                if (config.family === "IPv4" && !config.internal) {
                    return config.address;
                }
            }
        }
        return "localhost";
    } catch (error) {
        return "localhost";
    }
}

function getStaticFilePath(path) {
    return path.replace(/\\/g, "/");
}

function generateOtp() {
    const OTP = crypto.randomInt(100000,999999);
    return OTP.toString();
}

module.exports = {
    getLocalIP,
    getStaticFilePath,
    generateOtp,
};