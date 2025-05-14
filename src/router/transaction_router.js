const { Router } = require("express");
const { verifyUser } = require("../middleware/verify_user");
const { USER_ROLE } = require("../config/string");
const { addTransaction, getTransaction, getCurrencies, updateCurrency, deleteTransaction, updateTransaction, addCurrency, getCurrency } = require("../controller/transaction_controller");
const { bodyValidation } = require("../middleware/validation");
const { createTransactionValidation, currencyValidation } = require("../validation/transaction_validation");

const router = Router();

router.post("/", verifyUser([USER_ROLE.USER]), bodyValidation(createTransactionValidation), addTransaction);
router.get("/", verifyUser([USER_ROLE.USER]), getTransaction);
router.put("/:id", verifyUser([USER_ROLE.USER]), updateTransaction);
router.delete("/:id", verifyUser([USER_ROLE.USER]), deleteTransaction);
router.post("/currency", verifyUser([USER_ROLE.ADMIN]), addCurrency);
router.get("/user/currency", verifyUser([USER_ROLE.USER]), getCurrency);
router.get("/currency", verifyUser([USER_ROLE.USER, USER_ROLE.ADMIN]), getCurrencies);
router.patch("/currency", verifyUser([USER_ROLE.USER]), bodyValidation(currencyValidation), updateCurrency);

module.exports = router;