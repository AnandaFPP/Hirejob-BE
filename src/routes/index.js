const express = require("express");
const router = express.Router();
const productRouter = require('../routes/products')
const categoryRouter = require('../routes/category')
const usersRouter = require('../routes/users')
const storesRouter = require('../routes/stores')

router.use('/products', productRouter);
router.use('/category', categoryRouter);
router.use('/users', usersRouter);
router.use('/stores', storesRouter);

module.exports = router;