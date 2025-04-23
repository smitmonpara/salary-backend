const { Router } = require("express");
const { bodyValidation } = require("../middleware/validation");
const { sendEmailOtpValidation, registerValidation, loginValidation, resetPasswordValidation, verifyResetPasswordValidation, createNewPasswordValidation, socialSignInValidation } = require("../validation/auth_validation");
const { sendEmailOtp, register, login, resetPassword, verifyResetPasswordOtp, createNewPassword, profile, socialLogin } = require("../controller/auth_controller");
const { verifyUser } = require("../middleware/verify_user");
const { USER_ROLE } = require("../config/string");

const router = Router();

router.post('/send-email-otp', bodyValidation(sendEmailOtpValidation), sendEmailOtp);
router.post('/register', bodyValidation(registerValidation), register);
router.post('/login', bodyValidation(loginValidation), login);
router.post('/reset-password', bodyValidation(resetPasswordValidation), resetPassword);
router.post('/verify-otp', bodyValidation(verifyResetPasswordValidation), verifyResetPasswordOtp);
router.post('/create-new-password', bodyValidation(createNewPasswordValidation), createNewPassword);
router.post('/social-login', bodyValidation(socialSignInValidation), socialLogin);
router.get('/profile', verifyUser([USER_ROLE.USER]), profile);

module.exports = router;