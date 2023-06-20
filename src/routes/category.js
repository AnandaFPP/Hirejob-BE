const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category");

router
  .get("/", categoryController.getAllCategory)
  .get("/search", categoryController.searchCategory)
  .get("/:id", categoryController.getDetailCategory)
  .post("/", categoryController.createCategory)
  .put("/:id", categoryController.updateCategory)
  .delete("/:id", categoryController.deleteCategory);

module.exports = router;