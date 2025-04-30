const Joi = require("joi");
const { PLATFORM, USER_LOGIN_TYPE } = require("../config/string");

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
    }),
    platform: Joi.string().valid(PLATFORM.ANDROID, PLATFORM.IOS).required().messages({
        "string.empty": "Platform is required",
        "any.required": "Platform is required",
        "any.only": "Platform must be either Android or IOS",
    }),
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
    platform: Joi.string().valid(PLATFORM.ANDROID, PLATFORM.IOS).required().messages({
        "string.empty": "Platform is required",
        "any.required": "Platform is required",
        "any.only": "Platform must be either Android or IOS",
    }),
});

const resetPasswordValidation = Joi.object({
    email: Joi.string().required().email().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
});

const verifyResetPasswordValidation = Joi.object({
    otp: Joi.string().required().messages({
        "string.empty": "OTP is required",
        "any.required": "OTP is required",
        "string.length": "OTP must be 6 digits",
    })
});

const createNewPasswordValidation = Joi.object({
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
    }),
});

const socialSignInValidation = Joi.object({
    email: Joi.string().required().email().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    fcmToken: Joi.string().optional().messages({
        "string.empty": "FCM token is required",
    }),
    platform: Joi.string().valid(PLATFORM.ANDROID, PLATFORM.IOS).required().messages({
        "string.empty": "Platform is required",
        "any.required": "Platform is required",
        "any.only": "Platform must be either Android or IOS",
    }),
    socialType: Joi.string().valid(USER_LOGIN_TYPE.GOOGLE, USER_LOGIN_TYPE.APPLE).required().messages({
        "string.empty": "Social type is required",
        "any.required": "Social type is required",
        "any.only": "Social type must be either google or apple",
    }),
});

const changePasswordValidation = Joi.object({
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
    }),
    newPassword: Joi.string().required().messages({
        "string.empty": "New password is required",
        "any.required": "New password is required",
    }),
});

module.exports = {
    sendEmailOtpValidation,
    registerValidation,
    loginValidation,
    resetPasswordValidation,
    verifyResetPasswordValidation,
    createNewPasswordValidation,
    socialSignInValidation,
    changePasswordValidation,
};

