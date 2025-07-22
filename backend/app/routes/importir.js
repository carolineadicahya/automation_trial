const express = require("express");
const router = express.Router();
const importirController = require("../controllers/importirController");

// GET /api/importir
router.get("/", importirController.findAll);

// GET /api/importir/:id
router.get("/:id", importirController.findOne);

// POST /api/importir
router.post("/", importirController.create);

// PUT /api/importir/:id
router.put("/:id", importirController.update);

// DELETE /api/importir/:id
router.delete("/:id", importirController.delete);

module.exports = router;
