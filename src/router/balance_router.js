const { Router } = require("express");
const { verifyUser } = require("../middleware/verify_user");
const { USER_ROLE } = require("../config/string");
const { bodyValidation } = require("../middleware/validation");
const { createBalanceValidation } = require("../validation/balance_validation");
const { createBalance, getBalance } = require("../controller/balance_controller");

const router = Router();

router.post("/", verifyUser([USER_ROLE.USER]), bodyValidation(createBalanceValidation), createBalance);
router.get("/", verifyUser([USER_ROLE.USER]), getBalance);


module.exports = router;