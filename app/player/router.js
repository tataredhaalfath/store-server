const express = require("express");
const router = express.Router();
const {
  index,
  actionStatus,
  landingPage,
  detailPage,
  category,
} = require("./controller");

router.get("/", index);
router.put("/status", actionStatus);

// api
router.get("/voucher", landingPage);
router.post("/detail", detailPage);
router.get("/category", category);

module.exports = router;
