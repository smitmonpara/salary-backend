class ApiError extends Error {
    /**
     * Creates an instance of ApiError.
     *
     * @param {number} statusCode - The HTTP status code associated with the error.
     * @param {string} message - The error message to be displayed.
     */
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = { ApiError };
