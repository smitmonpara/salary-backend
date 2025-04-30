const { Router } = require("express");
const { verifyUser } = require("../middleware/verify_user");
const { USER_ROLE } = require("../config/string");
const { addTransaction, getTransaction } = require("../controller/transaction_controller");
const { bodyValidation } = require("../middleware/validation");
const { createTransactionValidation } = require("../validation/transaction_validation");

const router = Router();

router.post("/", verifyUser([USER_ROLE.USER]), bodyValidation(createTransactionValidation), addTransaction);
router.get("/", verifyUser([USER_ROLE.USER]), getTransaction);


module.exports = router;