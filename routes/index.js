const express = require("express");
const router = express.Router();
const { isLoginAdmin } = require("../app/middleware/auth");

const userRouter = require("../app/user/router");
const dashboardRouter = require("../app/dashboard/router");
const categoryRouter = require("../app/category/router");
const nominalRouter = require("../app/nominal/router");
const voucherRouter = require("../app/voucher/router");
const bankRouter = require("../app/bank/router");
const paymentRouter = require("../app/payment/router");
const transactionRouter = require("../app/transaction/router");
const playerRouter = require("../app/player/router");
const authRouter = require("../app/auth/router");

router.use("/", userRouter);
router.use("/dashboard", isLoginAdmin, dashboardRouter);
router.use("/category", isLoginAdmin, categoryRouter);
router.use("/nominal", isLoginAdmin, nominalRouter);
router.use("/voucher", isLoginAdmin, voucherRouter);
router.use("/bank", isLoginAdmin, bankRouter);
router.use("/payment", isLoginAdmin, paymentRouter);
router.use("/transaction", isLoginAdmin, transactionRouter);
router.use("/player", isLoginAdmin, playerRouter);

// api
const url = "/api/v1";
router.use(`${url}/player`, playerRouter);
router.use(`${url}/auth`, authRouter);

module.exports = router;
