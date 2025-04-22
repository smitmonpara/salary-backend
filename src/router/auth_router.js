const { Router } = require("express");
const { bodyValidation } = require("../middleware/validation");
const { sendEmailOtpValidation, registerValidation, loginValidation, resetPasswordValidation, verifyResetPasswordValidation, createNewPasswordValidation } = require("../validation/auth_validation");
const { sendEmailOtp, register, login, resetPassword, verifyResetPasswordOtp, createNewPassword } = require("../controller/auth_controller");

const router = Router();

router.post('/send-email-otp', bodyValidation(sendEmailOtpValidation), sendEmailOtp);
router.post('/register', bodyValidation(registerValidation), register);
router.post('/login', bodyValidation(loginValidation), login);
router.post('/reset-password', bodyValidation(resetPasswordValidation), resetPassword);
router.post('/verify-otp', bodyValidation(verifyResetPasswordValidation), verifyResetPasswordOtp);
router.post('/create-new-password', bodyValidation(createNewPasswordValidation), createNewPassword);

module.exports = router;