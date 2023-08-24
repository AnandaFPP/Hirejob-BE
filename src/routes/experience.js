const express = require("express");
const router = express.Router();
const experienceController = require("../controller/experience");

router
    .get("/", experienceController.getAllExperience)
    .post("/", experienceController.createExperience)
    .get("/profile/:id", experienceController.getExperienceWorker)
    .put("/:id", experienceController.updateExperience)
    .delete("/:id", experienceController.deleteExperience);
    
module.exports = router;