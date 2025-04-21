const Joi = require("joi");

const sendEmailOtpValidation = Joi.object({
    email: Joi.string().required().email().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
});

const registerValidation = Joi.object({
    firstName: Joi.string().required().messages({
        "string.empty": "First name is required",
        "any.required": "First name is required",
    }),
    lastName: Joi.string().required().messages({
        "string.empty": "Last name is required",
        "any.required": "Last name is required",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
    }),
    fcmToken: Joi.string().optional().messages({
        "string.empty": "FCM token is required",
    }),
    otp: Joi.string().required().messages({
        "string.empty": "OTP is required",
        "any.required": "OTP is required",
        "string.length": "OTP must be 6 digits",
    })
});

const loginValidation = Joi.object({
    email: Joi.string().required().email().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
    }),
    fcmToken: Joi.string().optional().messages({
        "string.empty": "FCM token is required",
    }),
});

module.exports = {
    sendEmailOtpValidation,
    registerValidation,
    loginValidation,
};

