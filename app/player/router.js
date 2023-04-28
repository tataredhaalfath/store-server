const express = require("express");
const router = express.Router();
const {
  index,
  actionStatus,
  landingPage,
  detailPage,
} = require("./controller");

router.get("/", index);
router.put("/status", actionStatus);

// api
router.get("/voucher", landingPage);
router.post("/detail", detailPage);

module.exports = router;
