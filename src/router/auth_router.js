const { Router } = require("express");
const { bodyValidation } = require("../middleware/validation");
const { sendEmailOtpValidation, registerValidation } = require("../validation/auth_validation");
const { sendEmailOtp, register } = require("../controller/auth_controller");

const router = Router();

router.post('/send-email-otp', bodyValidation(sendEmailOtpValidation), sendEmailOtp);
router.post('/register', bodyValidation(registerValidation), register);

module.exports = router;