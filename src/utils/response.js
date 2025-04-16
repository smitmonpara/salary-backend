class SuccessResponse {
    /**
     * Creates an instance of SuccessResponse.
     *
     * @param {object} data - Success response data.
     * @param {number} data.statusCode - The HTTP status code associated with the success response.
     * @param {string} data.message - Success response message to be displayed.
     * @param {object} [data.data] - Success response data to be displayed.
     */
    constructor(data) {
        this.statusCode = data.statusCode;
        this.success = true;
        this.message = data.message;
        this.data = data.data;
    }
}

class ErrorResponse {

    /**
     * Creates an instance of ErrorResponse.
     *
     * @param {object} data - Error response data.
     * @param {number} data.statusCode - The HTTP status code associated with the error response.
     * @param {string} data.message - Error response message to be displayed.
     * @param {object} [data.data] - Error response data to be displayed.
     * @param {object} [data.error] - Error object which contains error message and error stack.
     */
    constructor(data) {
        this.statusCode = data.statusCode;
        this.success = false;
        this.message = data.message;
        this.data = data.data;
        this.error = data.error;
    }
}

module.exports = { SuccessResponse, ErrorResponse };