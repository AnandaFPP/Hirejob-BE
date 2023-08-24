const express = require("express");
const router = express.Router();
const workerRouter = require('../routes/worker')
const skillRouter = require('../routes/skill')
const portoRouter = require('../routes/portofolio')
const experienceRouter = require('../routes/experience')

router.use('/worker', workerRouter);
router.use('/skill', skillRouter);
router.use('/portofolio', portoRouter);
router.use('/experience', experienceRouter);

module.exports = router;