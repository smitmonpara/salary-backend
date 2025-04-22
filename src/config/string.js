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
    RESET_PASSWORD: "Reset Password",
}

const EMAIL_TEMPLATE_PATH = {
    SEND_OTP: "./views/send-otp.ejs",
    RESET_PASSWORD: "./views/reset-password.ejs",
}
module.exports = {
    USER_LOGIN_TYPE,
    USER_ROLE,
    OTP_TYPE,
    EMAIL_TEMPLATE_PATH,
};