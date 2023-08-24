const express = require("express");
const router = express.Router();
const skillController = require("../controller/skill");

router
    .get("/", skillController.getAllSkills)
    .post("/", skillController.createSkill)
    .get("/profile/:id", skillController.getSkillWorker)
    .put("/:id", skillController.updateSkill)
    .delete("/:id", skillController.deleteSkill);
    
module.exports = router;