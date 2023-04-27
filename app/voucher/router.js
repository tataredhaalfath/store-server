const express = require("express");
const router = express.Router();
const multer = require("multer");
const os = require("os");

const {
  index,
  viewCreate,
  actionCreate,
  viewEdit,
  actionEdit,
  actionDelete,
  actionStatus,
} = require("./controller");

router.get("/", index);
router.get("/create", viewCreate);
router.post(
  "/create",
  multer({ dest: os.tmpdir() }).single("image"),
  actionCreate
);
router.post("/edit", viewEdit);
router.put("/edit", multer({ dest: os.tmpdir() }).single("image"), actionEdit);
router.delete("/delete", actionDelete);
router.put("/status", actionStatus);

module.exports = router;
