const express = require("express");
const router = express.Router();
const uploadWorker = require("../middleware/uploadWorker");
const workerController = require("../controller/worker");
// const {protect} = require('../middleware/auth')

router
  .post("/register", workerController.registerWorker)
  .post("/login", workerController.loginWorker)
  .get("/verify", workerController.VerifyAccount)
  .get("/profile", workerController.getAllWorker)
  .get("/profile/:id", workerController.getDetailWorker)
  .put("/profile/:id", workerController.updateWorker)
  .put("/profilephoto/:id", uploadWorker, workerController.updateAvatarWorker)
  .post("/refreshToken", workerController.refreshToken)
  .delete('/profile/:id', workerController.deleteWorker);

module.exports = router;