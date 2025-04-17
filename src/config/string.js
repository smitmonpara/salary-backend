const USER_LOGIN_TYPE = {
    EMAIL: "Email",
    GOOGLE: "Google",
    APPLE: "Apple",
}

const USER_ROLE = {
    USER: "User",
    ADMIN: "Admin",
}

const OTP_TYPE = {
    VERIFY_EMAIL: "Verify Email",
    FORGOT_PASSWORD: "Forgot Password",
}

const EMAIL_TEMPLATE_PATH = {
    SEND_OTP: "./views/send-otp.ejs",
}
module.exports = {
    USER_LOGIN_TYPE,
    USER_ROLE,
    OTP_TYPE,
    EMAIL_TEMPLATE_PATH,
};