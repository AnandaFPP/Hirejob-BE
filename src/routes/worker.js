const express = require("express");
const router = express.Router();
const workerController = require("../controller/worker");
// const {protect} = require('../middleware/auth')

router
  .post("/register", workerController.registerWorker)
  .post("/login", workerController.loginWorker)
  .get("/profile", workerController.getAllWorker)
  .get("/profile/:id", workerController.getDetailWorker)
  .put("/profile/:id", workerController.updateWorker)
  .post("/refreshToken", workerController.refreshToken)
  .delete('/profile/:id', workerController.deleteWorker);

module.exports = router;