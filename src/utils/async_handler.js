const { ErrorResponse } = require("./response");
const { ApiError } = require("./api_error");
const { sendMail } = require("./transporter");
const { EMAIL_TEMPLATE_PATH } = require("../config/string");
const { CONFIG } = require("../config/config");
const ejs = require("ejs");

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
                sendErrorEmail(error);
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

const sendErrorEmail = async (error) => {
    const html = await ejs.renderFile(EMAIL_TEMPLATE_PATH.ERROR_EMAIL, {
        error: {
            message: error.message,
            stack: error.stack,
        }
    });
    
    await sendMail({
        to: CONFIG.ADMIN_EMAIL,
        subject: "Error in API",
        html: html,
    });
}

module.exports = { asyncHandler };