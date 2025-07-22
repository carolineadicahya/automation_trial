const express = require("express");
const router = express.Router();
const penjualController = require("../controllers/penjualController");

// GET /api/penjual
router.get("/", penjualController.findAll);

// GET /api/penjual/:id
router.get("/:id", penjualController.findOne);

// POST /api/penjual
router.post("/", penjualController.create);

// PUT /api/penjual/:id
router.put("/:id", penjualController.update);

// DELETE /api/penjual/:id
router.delete("/:id", penjualController.delete);

module.exports = router;
