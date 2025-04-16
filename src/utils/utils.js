const os = require("os");

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

module.exports = {
    getLocalIP,
    getStaticFilePath
};