const express = require("express");
const router = express.Router();
const usersController = require("../controller/users");

router
  .get("/", usersController.getAllUsers)
  .get("/:id", usersController.getDetailUsers)
  .post("/", usersController.createUsers)
  .put("/:id", usersController.updateUsers)
  .delete("/:id", usersController.deleteUsers);

module.exports = router;