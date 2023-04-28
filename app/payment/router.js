const express = require("express");
const router = express.Router();

const {
  index,
  viewCreate,
  actionCreate,
  viewEdit,
  actionEdit,
  actionDelete,
} = require("./controller");

router.get("/", index);
router.get("/create", viewCreate);
router.post("/create", actionCreate);
router.post("/edit", viewEdit);
router.put("/edit", actionEdit);
router.delete("/delete", actionDelete);

module.exports = router;
