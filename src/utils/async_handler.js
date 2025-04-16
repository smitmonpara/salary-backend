const { ErrorResponse } = require("./response");
const { ApiError } = require("./api_error");

function asyncHandler(requestHandler) {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        } catch (error) {
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
        }
    };
}

module.exports = { asyncHandler };