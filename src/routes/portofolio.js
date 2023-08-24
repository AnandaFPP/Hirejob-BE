const express = require("express");
const router = express.Router();
const portoController = require("../controller/portofolio");
const uploadPortofolio = require('../middleware/uploadPorto')

router
    .get("/", portoController.getAllPorto)
    .post("/", uploadPortofolio, portoController.createPorto)
    .get("/profile/:id", portoController.getPortoWorker)
    .put("/:id", uploadPortofolio, portoController.updatePorto)
    .delete("/:id", portoController.deletePorto);
    
module.exports = router;