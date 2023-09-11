const express = require("express");
const router = express.Router();
const workerRouter = require('../routes/worker')
const recruiterRouter = require('../routes/recruiter')
const skillRouter = require('../routes/skill')
const portoRouter = require('../routes/portofolio')
const experienceRouter = require('../routes/experience')
const hireRouter = require('../routes/hire')

router.use('/worker', workerRouter);
router.use('/recruiter', recruiterRouter);
router.use('/skill', skillRouter);
router.use('/portofolio', portoRouter);
router.use('/experience', experienceRouter);
router.use('/hire', hireRouter);

module.exports = router;