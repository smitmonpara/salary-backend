const { Router } = require("express");
const { bodyValidation } = require("../middleware/validation");
const { sendEmailOtpValidation, registerValidation, loginValidation } = require("../validation/auth_validation");
const { sendEmailOtp, register, login } = require("../controller/auth_controller");

const router = Router();

router.post('/send-email-otp', bodyValidation(sendEmailOtpValidation), sendEmailOtp);
router.post('/register', bodyValidation(registerValidation), register);
router.post('/login', bodyValidation(loginValidation), login);

module.exports = router;