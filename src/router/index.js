const { Router } = require("express");
const authRouter = require("./auth_router");
const categoryRouter = require("./category_router");
const balanceRouter = require("./balance_router");
const transactionRouter = require("./transaction_router");

const router = Router();

router.use("/auth", authRouter);
router.use("/category", categoryRouter);
router.use("/balance", balanceRouter);
router.use("/transaction", transactionRouter);

module.exports = router;