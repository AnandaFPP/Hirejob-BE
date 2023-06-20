const express = require("express");
const router = express.Router();
const storesController = require("../controller/stores");

router
  .get("/", storesController.getAllStore)
  .get("/search", storesController.searchStore)
  .get("/:id", storesController.getDetailStore)
  .post("/", storesController.createStore)
  .put("/:id", storesController.updateStore)
  .delete("/:id", storesController.deleteStore);

module.exports = router;