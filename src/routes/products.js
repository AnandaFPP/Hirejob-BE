const express = require("express");
const router = express.Router();
const productController = require("../controller/products");
const {protect, validationRoleSeller} = require('../middleware/auth')
const upload = require('../middleware/upload')
const {hitCacheProductDetail,clearCacheProductDetail} = require('../middleware/redis')

router
  .get("/", protect, productController.getAllProduct)
  .get("/search", protect, productController.searchProduct)
  .get("/:id", protect, hitCacheProductDetail, productController.getDetailProduct)
  .post("/", protect, validationRoleSeller, upload.single('photo'), productController.createProduct)
  .put("/:id", protect, validationRoleSeller, clearCacheProductDetail, upload.single('photo'), productController.updateProduct)
  .delete("/:id", protect, validationRoleSeller, clearCacheProductDetail, productController.deleteProduct);

module.exports = router;