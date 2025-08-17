const { Router } = require("express");
const { bodyValidation } = require("../middleware/validation");
const { sendEmailOtpValidation, registerValidation, loginValidation, resetPasswordValidation, verifyResetPasswordValidation, createNewPasswordValidation, socialSignInValidation, changePasswordValidation, feedbackValidation } = require("../validation/auth_validation");
const { sendEmailOtp, register, login, resetPassword, verifyResetPasswordOtp, createNewPassword, profile, socialLogin, updateProfile, logout, changePassword, feedback, deleteAccount } = require("../controller/auth_controller");
const { verifyUser } = require("../middleware/verify_user");
const { USER_ROLE } = require("../config/string");
const { imageUploader } = require("../middleware/upload");

const router = Router();

router.post('/send-email-otp', bodyValidation(sendEmailOtpValidation), sendEmailOtp);
router.post('/register', bodyValidation(registerValidation), register);
router.post('/login', bodyValidation(loginValidation), login);
router.post('/reset-password', bodyValidation(resetPasswordValidation), resetPassword);
router.post('/verify-otp', bodyValidation(verifyResetPasswordValidation), verifyResetPasswordOtp);
router.post('/create-new-password', bodyValidation(createNewPasswordValidation), createNewPassword);
router.post('/social-login', bodyValidation(socialSignInValidation), socialLogin);
router.post('/change-password', verifyUser([USER_ROLE.USER]), bodyValidation(changePasswordValidation), changePassword);
router.get('/profile', verifyUser([USER_ROLE.USER]), profile);
router.put('/profile', verifyUser([USER_ROLE.USER]), imageUploader.single("image"), updateProfile);
router.post('/logout', verifyUser([USER_ROLE.USER]), logout);
router.delete('/delete-account', verifyUser([USER_ROLE.USER]), deleteAccount);
router.post('/feedback', verifyUser([USER_ROLE.USER]), bodyValidation(feedbackValidation), feedback);

module.exports = router;