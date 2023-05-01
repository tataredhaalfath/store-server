const express = require("express");
const router = express.Router();
const {
  index,
  actionStatus,
  landingPage,
  detailPage,
  category,
  checkout,
} = require("./controller");
const { isLoginPlayer } = require("../middleware/auth");

router.get("/", index);
router.put("/status", actionStatus);

// api
router.get("/voucher", landingPage);
router.post("/detail", detailPage);
router.get("/category", category);
router.post("/checkout", isLoginPlayer, checkout);

module.exports = router;
