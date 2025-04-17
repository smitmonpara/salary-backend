const { asyncHandler } = require('../utils/async_handler');
const { UserModel, selectUser } = require('../model/user_model');
const { ApiError } = require('../utils/api_error');
const { generateOtp } = require('../utils/utils');
const { sendMail } = require('../utils/transporter');
const { CONFIG } = require('../config/config');
const { EMAIL_TEMPLATE_PATH, OTP_TYPE } = require('../config/string');
const { OtpModel } = require('../model/otp_model');
const { generateToken, verifyToken } = require('../utils/generate_token');
const { SuccessResponse } = require('../utils/response');
const ejs = require('ejs');

const sendEmailOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const findUser = await UserModel.findOne({ email });
    if (findUser) {
        throw new ApiError(400, 'Email already exists');
    }
    const otp = generateOtp();

    const otpModel = await OtpModel.create({
        email,
        otp,
        expiredAt: new Date(Date.now() + (5 * 60 * 1000)),
        type: OTP_TYPE.VERIFY_EMAIL,
    });

    const token = generateToken({
        email,
        id: otpModel._id,
        expiredAt: otpModel.expiredAt,
        type: OTP_TYPE.VERIFY_EMAIL,
    });

    if (!token) {
        throw new ApiError(400, 'Email not sent, please try again later');
    }

    const html = await ejs.renderFile(EMAIL_TEMPLATE_PATH.SEND_OTP, {
        otp,
        email,
        app: CONFIG.APP_NAME,
    });
    const mailSent = await sendMail(email, 'Email Verification OTP', html);

    if (!mailSent) {
        throw new ApiError(400, 'Email not sent, please try again later');
    }

    setTimeout(() => {
        OtpModel.findByIdAndDelete(otpModel._id);
    }, 5 * 60 * 1000);

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: 'Email sent successfully',
        data: {
            email,
            token,
        },
    }))
});

const register = asyncHandler(async (req, res) => {
    const { firstName, lastName, password, fcmToken, otp } = req.body;
    let token = req.headers['authorization'];
    if (!token) {
        throw new ApiError(400, 'Please provide token in header');
    }
    token = token.split(' ');
    if (token.length !== 2) {
        throw new ApiError(400, 'Token format is invalid');
    }
    token = token[1];
    const data = verifyToken(token);
    if (!data) {
        throw new ApiError(400, 'Token is invalid or expired');
    }
    const { email, id } = data;

    const findOtp = await OtpModel.findById(id);

    if (!findOtp || findOtp.email !== email || new Date() > findOtp.expiredAt || findOtp.type !== OTP_TYPE.VERIFY_EMAIL) {
        throw new ApiError(400, 'Token is invalid or expired');
    }

    if (findOtp.otp !== otp) {
        throw new ApiError(400, 'OTP is invalid or expired');
    }

    const findOtpUser = await UserModel.findOne({ email });
    
    if (findOtpUser) {
        throw new ApiError(400, 'Email already exists');
    }

    await OtpModel.findByIdAndDelete(id);

    const user = await UserModel.create({
        firstName,
        lastName,
        email,
        password,
        fcmToken,
    });

    if (!user) {
        throw new ApiError(400, 'User not created, please try again later');
    }

    const findUser = await UserModel.findById(user._id).select(selectUser);

    if (!findUser) {
        throw new ApiError(400, 'User not created, please try again later');
    }

    const registerToken = generateToken({
        id: user._id,
    });

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: 'User registered successfully',
        data: {
            user: findUser,
            token: registerToken,
        },
    }));

});

module.exports = {
    sendEmailOtp,
    register,
};