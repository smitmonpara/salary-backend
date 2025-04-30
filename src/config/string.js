const USER_LOGIN_TYPE = {
    EMAIL: "Email",
    GOOGLE: "Google",
    APPLE: "Apple",
}

const PLATFORM = {
    ANDROID: "Android",
    IOS: "IOS",
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
    ERROR_EMAIL: "./views/error.ejs",
}

const TRANSACTION_TYPE = {
    INCOME: "Income",
    EXPENSE: "Expense",
    TRANSFER: "Transfer",
}

module.exports = {
    USER_LOGIN_TYPE,
    PLATFORM,
    USER_ROLE,
    OTP_TYPE,
    EMAIL_TEMPLATE_PATH,
    TRANSACTION_TYPE,
};