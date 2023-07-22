const express = require("express");
const router = express.Router();
const productController = require("../controller/products");
// const {protect, validationRoleSeller} = require('../middleware/auth')
const upload = require('../middleware/upload')
// const {hitCacheProductDetail,clearCacheProductDetail} = require('../middleware/redis')

router
  .get("/", productController.getAllProduct)
  .get("/search", productController.searchProduct)
  .get("/:id", productController.getDetailProduct)
  .post("/", upload.single('photo'), productController.createProduct)
  .put("/:id", upload.single('photo'), productController.updateProduct)
  .delete("/:id", productController.deleteProduct);

module.exports = router;