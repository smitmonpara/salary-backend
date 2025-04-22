const { Schema, model } = require('mongoose');
const { OTP_TYPE } = require('../config/string');

const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiredAt: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        enum: [OTP_TYPE.VERIFY_EMAIL, OTP_TYPE.RESET_PASSWORD],
        required: true,
    },
},
    { timestamps: true },
);

const OtpModel = model('otps', otpSchema);

module.exports = { OtpModel };