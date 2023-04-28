const express = require("express");
const router = express.Router();
const { index, actionStatus } = require("./controller");

router.get("/", index);
router.put("/status", actionStatus);

module.exports = router;
