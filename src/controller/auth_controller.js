const { asyncHandler } = require('../utils/async_handler');
const { UserModel, selectUser } = require('../model/user_model');
const { ApiError } = require('../utils/api_error');
const { generateOtp } = require('../utils/utils');
const { sendMail } = require('../utils/transporter');
const { CONFIG } = require('../config/config');
const { EMAIL_TEMPLATE_PATH, OTP_TYPE, USER_ROLE, USER_LOGIN_TYPE } = require('../config/string');
const { OtpModel } = require('../model/otp_model');
const { generateToken, verifyToken } = require('../utils/generate_token');
const { SuccessResponse } = require('../utils/response');
const ejs = require('ejs');
const { comparePassword } = require('../utils/hash');

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

    setTimeout(async () => {
        await OtpModel.findByIdAndDelete(otpModel._id);
    }, 5 * 60 * 1000);

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: 'Email sent successfully',
        data: {
            email,
            token,
        },
    }));
});

const register = asyncHandler(async (req, res) => {
    const { firstName, lastName, password, fcmToken, otp, platform } = req.body;
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
        throw new ApiError(400, 'OTP is invalid or expired');
    }
    const { email, id } = data;

    const findOtp = await OtpModel.findById(id);

    if (!findOtp || findOtp.email !== email || new Date() > findOtp.expiredAt || findOtp.type !== OTP_TYPE.VERIFY_EMAIL) {
        throw new ApiError(400, 'OTP is invalid or expired');
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
        platform,
        role: USER_ROLE.USER,
        loginType: USER_LOGIN_TYPE.EMAIL,
        loginAt: new Date(),
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

const login = asyncHandler(async (req, res) => {
    const { email, password, fcmToken, platform } = req.body;
    const findUser = await UserModel.findOne({ email, role: USER_ROLE.USER });
    if (!findUser) {
        throw new ApiError(400, 'Email or password is incorrect');
    }    
    if (findUser.loginType !== USER_LOGIN_TYPE.EMAIL) {
        throw new ApiError(400, 'Email login is not allowed for this user, please use social login');
    }
    if (findUser.blocked) {
        throw new ApiError(400, 'User is blocked, please contact admin');
    }
    if (findUser.deleted) {
        throw new ApiError(400, 'User is deleted, please contact admin');
    }
    const isPasswordMatch = comparePassword(password, findUser.password)
    if (!isPasswordMatch) {
        throw new ApiError(400, 'Email or password is incorrect');
    }
    const token = generateToken({
        id: findUser._id,
    });

    if (!token) {
        throw new ApiError(400, 'Token not generated, please try again later');
    }

    const user = await UserModel.findByIdAndUpdate(findUser._id, {
        fcmToken,
        platform,
        loginAt: new Date(),
    }, {
        new: true,
    }).select(selectUser);

    if (!user) {
        throw new ApiError(400, 'User not found, please try again later');
    }

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: 'User logged in successfully',
        data: {
            user,
            token,
        },
    }));
});

const resetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
        throw new ApiError(400, 'Register email not found, please register first');
    }
    if (findUser.loginType !== USER_LOGIN_TYPE.EMAIL) {
        throw new ApiError(400, `${findUser.loginType} login is not allowed for this user, please use social login`);
    }
    const otp = generateOtp();
    const otpModel = await OtpModel.create({
        email,
        otp,
        expiredAt: new Date(Date.now() + (5 * 60 * 1000)),
        type: OTP_TYPE.RESET_PASSWORD,
    });

    if (!otpModel) {
        throw new ApiError(400, 'OTP not generated, please try again later');
    }

    const token = generateToken({
        email,
        id: otpModel._id,
    });

    if (!token) {
        throw new ApiError(400, 'Email not sent, please try again later');
    }

    const html = await ejs.renderFile(EMAIL_TEMPLATE_PATH.SEND_OTP, {
        otp,
        email,
        app: CONFIG.APP_NAME,
    });

    const mailSent = await sendMail(email, 'Reset Password', html);

    if (!mailSent) {
        throw new ApiError(400, 'Email not sent, please try again later');
    }

    setTimeout(async () => {
        await OtpModel.findByIdAndDelete(otpModel._id);
    }, 5 * 60 * 1000);

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: 'Register email reset password OTP sent successfully',
        data: {
            email,
            token,
        },
    }));
});

const verifyResetPasswordOtp = asyncHandler(async (req, res) => {
    const { otp } = req.body;
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
        throw new ApiError(400, 'OTP is invalid or expired');
    }
    const { email, id } = data;

    const findOtp = await OtpModel.findById(id);

    if (!findOtp || findOtp.email !== email || new Date() > findOtp.expiredAt || findOtp.type !== OTP_TYPE.RESET_PASSWORD) {
        throw new ApiError(400, 'OTP is invalid or expired');
    }

    if (findOtp.otp !== otp) {
        throw new ApiError(400, 'OTP is invalid or expired');
    }

    const findUser = await UserModel.findOne({ email });

    if (!findUser) {
        throw new ApiError(400, 'Register email not found, please register first');
    }

    await OtpModel.findByIdAndDelete(id);

    const generatedToken = generateToken({
        id: findUser._id,
    });

    if (!token) {
        throw new ApiError(400, 'Token not generated, please try again later');
    }

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: 'OTP verified successfully',
        data: {
            token: generatedToken,
        },
    }));
});

const createNewPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
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
    const { id } = data;

    const findUser = await UserModel.findById(id);

    if (!findUser) {
        throw new ApiError(400, 'Register email not found, please register first');
    }

    const isMatch = comparePassword(password, findUser.password);
    if (isMatch) {
        throw new ApiError(400, 'New password should not be same as old password');
    }
    findUser.password = password;
    const updatedUser = await findUser.save();
    if (!updatedUser) {
        throw new ApiError(400, 'Password not updated, please try again later');
    }
    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: 'Password changed successfully',
    }));
});

const socialLogin = asyncHandler(async (req, res) => {
    const { email, fcmToken, platform, firstName, lastName, socialType } = req.body;

    const findUser = await UserModel.findOne({ email, role: USER_ROLE.USER });

    if (findUser) {
        if(findUser.blocked) {
            throw new ApiError(400, 'User is blocked, please contact admin');
        }

        if(findUser.deleted) {
            throw new ApiError(400, 'User is deleted, please contact admin');
        }

        if (findUser.loginType !== socialType) {
            throw new ApiError(400, `${socialType} login is not allowed for this user`);
        }
        
        const token = generateToken({
            id: findUser._id,
        });

        if (!token) {
            throw new ApiError(400, 'Token not generated, please try again later');
        }

        const updatedUser = await UserModel.findByIdAndUpdate(findUser._id, {
            fcmToken,
            platform,
            loginAt: new Date(),
        }, {
            new: true,
        }).select(selectUser);
        
        if (!updatedUser) {
            throw new ApiError(400, 'User not updated, please try again later');
        }
        
        return res.status(200).json(new SuccessResponse({
            statusCode: 200,
            message: 'User logged in successfully',
            data: {
                token,
                user: updatedUser,
            },
        }));
    }

    const user = await UserModel.create({
        firstName,
        lastName,
        email,
        fcmToken,
        platform,
        role: USER_ROLE.USER,
        loginType: socialType,
        loginAt: new Date(),
    });

    if (!user) {
        throw new ApiError(400, 'User not created, please try again later');
    }

    const findCreatedUser = await UserModel.findById(user._id).select(selectUser);

    if (!findCreatedUser) {
        throw new ApiError(400, 'User not created, please try again later');
    }

    const registerToken = generateToken({
        id: user._id,
    });

    if (!registerToken) {
        throw new ApiError(400, 'Token not generated, please try again later');
    }

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: 'User registered successfully',
        data: {
            user: findCreatedUser,
            token: registerToken,
        },
    }));
});

const profile = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const findUser = await UserModel.findById(userId).select(selectUser);

    res.status(200).json(new SuccessResponse({
        statusCode: 200,
        message: 'User profile fetched successfully',
        data: {
            user: findUser,
        },
    }));
});

module.exports = {
    sendEmailOtp,
    register,
    login,
    resetPassword,
    verifyResetPasswordOtp,
    createNewPassword,
    socialLogin,
    profile,
};