const { ApiError } = require("../utils/api_error");
const { ErrorResponse } = require("../utils/response");

function errorMiddleware(error, _req, res, _next) {
    if (error instanceof ApiError) {
        return res.status(error.statusCode).json(new ErrorResponse({
            statusCode: error.statusCode,
            message: error.message,
            error: {
                message: error.message,
                stack: error.stack,
            },
        }));
    } else {
        return res.status(500).json(new ErrorResponse({
            statusCode: 500,
            message: "⚠️ Oops! Something went wrong. Please try again later.",
            error: {
                message: error.message,
                stack: error.stack,
            },
        }));
    }
};

module.exports = {
    errorMiddleware,
};