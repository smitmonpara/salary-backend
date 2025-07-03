const { Router } = require("express");
const {
    getPrivacyPolicy,
    getTermsAndConditions
} = require('../controller/setting_controller');

const router = Router();

router.get('/privacy-policy', getPrivacyPolicy);
router.get('/terms-and-conditions', getTermsAndConditions);

module.exports = router;
