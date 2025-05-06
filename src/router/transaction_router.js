const { Router } = require("express");
const { verifyUser } = require("../middleware/verify_user");
const { USER_ROLE } = require("../config/string");
const { addTransaction, getTransaction, getCurrency, updateCurrency } = require("../controller/transaction_controller");
const { bodyValidation } = require("../middleware/validation");
const { createTransactionValidation, currencyValidation } = require("../validation/transaction_validation");

const router = Router();

router.post("/", verifyUser([USER_ROLE.USER]), bodyValidation(createTransactionValidation), addTransaction);
router.get("/", verifyUser([USER_ROLE.USER]), getTransaction);
router.get("/currency", verifyUser([USER_ROLE.USER]), getCurrency);
router.patch("/currency", verifyUser([USER_ROLE.USER]), bodyValidation(currencyValidation), updateCurrency);

module.exports = router;